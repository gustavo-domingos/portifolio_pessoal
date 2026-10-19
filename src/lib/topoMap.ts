// Controlador imperativo do mapa do topo da página. O React cuida dos botões e textos;
// aqui fica só o canvas: relevo, trilha, bicicleta e a animação.

import {
  catmullRom,
  clamp01,
  contourSegments,
  createNoise,
  easeInOutCubic,
  easeOutCubic,
  measure,
  pointAt,
  type Point,
  type Polyline,
} from './topo'

const STEP = 9
const SCALE = 240
const LIFT_RADIUS = 110
const SAMPLES = 24
const RIPPLE_LIFE = 1700

export interface TopoMapOptions {
  canvas: HTMLCanvasElement
  host: HTMLElement
  /** Pontos da trilha em frações da largura e altura do mapa. */
  route: Point[]
  /** Índice, em `route`, de cada parada. */
  stops: number[]
  /** Deslocamento da bicicleta em cada parada; entre paradas, interpolado. */
  bikeOffsets?: Point[]
  seed: number
  reducedMotion: boolean
  onStopReached?: (stop: number) => void
  onAltitude?: (reading: { meters: number; x: number; y: number } | null) => void
}

export interface TopoMap {
  /** Posição de cada parada em pixels, relativa ao mapa. */
  stopPositions(): Point[]
  rideTo(stop: number): Promise<void>
  setDrift(on: boolean): void
  destroy(): void
}

interface Colors {
  minor: string
  major: string
  route: string
  casing: string
  ground: string
  ink: string
}

export function createTopoMap(opts: TopoMapOptions): TopoMap {
  const { canvas, host, reducedMotion } = opts
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D indisponível')
  const noise = createNoise(opts.seed)

  let width = 0
  let height = 0
  let cols = 0
  let rows = 0
  let field = new Float32Array(0)
  let lo = 0
  let hi = 1
  let spacing = 0.05
  let line: Polyline = measure([[0, 0]])
  let stopFractions: number[] = []
  let colors: Colors = readColors()

  let pointer = { x: -999, y: -999, mouse: false }
  let lift = 0
  let liftTarget = 0
  let ripples: { x: number; y: number; t: number }[] = []
  let offsetX = 0
  let offsetY = 0
  let drift = !reducedMotion
  let visible = false

  let introStart: number | null = null
  let introDone = reducedMotion
  let rise = reducedMotion ? 1 : 0
  let drawn = reducedMotion ? 1 : 0
  const reached = new Set<number>()

  let bike = 1
  let bikeDir = 1
  let travel: { from: number; to: number; t0: number; dur: number; done: () => void } | null = null

  let raf = 0
  let last = 0

  function readColors(): Colors {
    const cs = getComputedStyle(host)
    const v = (n: string) => cs.getPropertyValue(n).trim()
    return {
      minor: v('--curva'),
      major: v('--mestra'),
      route: v('--trilha'),
      casing: v('--contorno'),
      ground: v('--terreno'),
      ink: v('--tinta'),
    }
  }

  function resize() {
    const r = host.getBoundingClientRect()
    width = r.width
    height = r.height
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    cols = Math.ceil(width / STEP) + 1
    rows = Math.ceil(height / STEP) + 1
    field = new Float32Array(cols * rows)
    lo = Infinity
    hi = -Infinity
    for (let j = 0; j < rows; j += 2) {
      for (let i = 0; i < cols; i += 2) {
        const v = noise((i * STEP) / SCALE, (j * STEP) / SCALE)
        if (v < lo) lo = v
        if (v > hi) hi = v
      }
    }
    spacing = (hi - lo) / 16 || 0.05
    line = measure(catmullRom(opts.route.map(([x, y]) => [x * width, y * height] as Point), SAMPLES))
    stopFractions = opts.stops.map((k) => (line.total ? line.lengths[k * SAMPLES] / line.total : 0))
    if (reducedMotion) opts.stops.forEach((_, n) => markReached(n))
    draw(performance.now())
  }

  function markReached(n: number) {
    if (reached.has(n)) return
    reached.add(n)
    opts.onStopReached?.(n)
  }

  function computeField(now: number) {
    const amp = lift * spacing * 3.4
    const k = 1 / (2 * LIFT_RADIUS * LIFT_RADIUS)
    const waves = ripples.map((r) => {
      const age = now - r.t
      return { x: r.x, y: r.y, radius: age * 0.32, amp: spacing * 2.4 * (1 - age / RIPPLE_LIFE) }
    })
    for (let j = 0; j < rows; j++) {
      const y = j * STEP
      for (let i = 0; i < cols; i++) {
        const x = i * STEP
        let v = noise(x / SCALE + offsetX, y / SCALE + offsetY)
        v = lo + (v - lo) * rise
        if (amp > 0) {
          const dx = x - pointer.x
          const dy = y - pointer.y
          v += amp * Math.exp(-(dx * dx + dy * dy) * k)
        }
        for (const w of waves) {
          const d = Math.hypot(x - w.x, y - w.y) - w.radius
          if (d > -90 && d < 90) v += w.amp * Math.exp(-(d * d) / 1250)
        }
        field[j * cols + i] = v
      }
    }
  }

  function drawContours() {
    const minor = new Path2D()
    const major = new Path2D()
    contourSegments(field, cols, rows, STEP, spacing, (isMajor, x1, y1, x2, y2) => {
      const p = isMajor ? major : minor
      p.moveTo(x1, y1)
      p.lineTo(x2, y2)
    })
    ctx!.lineWidth = 1
    ctx!.strokeStyle = colors.minor
    ctx!.stroke(minor)
    ctx!.lineWidth = 1.8
    ctx!.strokeStyle = colors.major
    ctx!.stroke(major)
  }

  function drawRoute() {
    if (drawn <= 0 || line.points.length < 2) return
    const end = pointAt(line, drawn)
    const path = new Path2D()
    path.moveTo(line.points[0][0], line.points[0][1])
    for (let i = 1; i < end.index; i++) path.lineTo(line.points[i][0], line.points[i][1])
    path.lineTo(end.x, end.y)
    ctx!.lineJoin = 'round'
    ctx!.lineCap = 'round'
    ctx!.lineWidth = 9
    ctx!.strokeStyle = colors.casing
    ctx!.stroke(path)
    ctx!.lineWidth = 3.5
    ctx!.strokeStyle = colors.route
    ctx!.stroke(path)
  }

  function bikeOffset(s: number): Point {
    const offsets = opts.bikeOffsets
    if (!offsets?.length || !stopFractions.length) return [0, -16]
    if (s <= stopFractions[0]) return offsets[0]
    for (let i = 0; i < stopFractions.length - 1; i++) {
      const a = stopFractions[i]
      const b = stopFractions[i + 1]
      if (s <= b) {
        const t = easeInOutCubic(clamp01((s - a) / (b - a || 1)))
        return [offsets[i][0] + (offsets[i + 1][0] - offsets[i][0]) * t, offsets[i][1] + (offsets[i + 1][1] - offsets[i][1]) * t]
      }
    }
    return offsets[offsets.length - 1]
  }

  function drawBike() {
    if (drawn <= 0) return
    const { x, y } = pointAt(line, bike)
    const [dx, dy] = bikeOffset(bike)
    drawBikeGlyph(ctx!, x + dx, y + dy, bikeDir, colors)
  }

  function reportAltitude() {
    if (!opts.onAltitude) return
    if (!pointer.mouse) {
      opts.onAltitude(null)
      return
    }
    const i = Math.round(pointer.x / STEP)
    const j = Math.round(pointer.y / STEP)
    if (i < 0 || j < 0 || i >= cols || j >= rows) return
    const v = field[j * cols + i]
    opts.onAltitude({ meters: Math.round(40 + ((v - lo) / (hi - lo)) * 860), x: pointer.x, y: pointer.y })
  }

  function draw(now: number) {
    if (!width) return
    ctx!.clearRect(0, 0, width, height)
    computeField(now)
    drawContours()
    drawRoute()
    drawBike()
    reportAltitude()
  }

  const busy = () =>
    !introDone || travel !== null || ripples.length > 0 || Math.abs(liftTarget - lift) > 0.003 || (drift && visible && !document.hidden)

  function frame(now: number) {
    raf = 0
    const dt = Math.min(64, now - (last || now))
    last = now

    if (!introDone && introStart !== null) {
      const e = now - introStart
      rise = easeOutCubic(clamp01(e / 1100))
      drawn = easeInOutCubic(clamp01((e - 450) / 1500))
      bike = drawn
      stopFractions.forEach((f, n) => { if (drawn >= f - 0.001) markReached(n) })
      if (e > 1950) {
        introDone = true
        rise = 1
        drawn = 1
        bike = 1
        stopFractions.forEach((_, n) => markReached(n))
      }
    }
    if (travel) {
      const t = clamp01((now - travel.t0) / travel.dur)
      bike = travel.from + (travel.to - travel.from) * easeInOutCubic(t)
      if (t >= 1) {
        const done = travel.done
        travel = null
        done()
      }
    }
    lift += (liftTarget - lift) * (reducedMotion ? 1 : Math.min(1, dt / 90))
    if (Math.abs(liftTarget - lift) <= 0.003) lift = liftTarget
    ripples = ripples.filter((r) => now - r.t < RIPPLE_LIFE)
    if (drift && visible) {
      offsetX += dt * 0.000045
      offsetY += dt * 0.000018
    }
    draw(now)
    if (busy()) raf = requestAnimationFrame(frame)
    else last = 0
  }

  const kick = () => { if (!raf) raf = requestAnimationFrame(frame) }

  const local = (e: PointerEvent) => {
    const r = host.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  const onMove = (e: PointerEvent) => {
    const p = local(e)
    pointer = { ...p, mouse: e.pointerType === 'mouse' }
    if (pointer.mouse) liftTarget = 1
    kick()
  }
  const onLeave = () => {
    liftTarget = 0
    pointer.mouse = false
    kick()
  }
  const onDown = (e: PointerEvent) => {
    if (reducedMotion || (e.target as Element).closest('button, a')) return
    ripples.push({ ...local(e), t: performance.now() })
    if (ripples.length > 4) ripples.shift()
    kick()
  }
  host.addEventListener('pointermove', onMove)
  host.addEventListener('pointerleave', onLeave)
  host.addEventListener('pointerdown', onDown)

  const onThemeChange = () => {
    colors = readColors()
    draw(performance.now())
  }
  const media = matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', onThemeChange)
  const themeObserver = new MutationObserver(onThemeChange)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(host)

  const io = new IntersectionObserver(
    (entries) => {
      visible = entries.some((e) => e.isIntersecting)
      if (visible && introStart === null && !reducedMotion) introStart = performance.now()
      if (visible) kick()
    },
    { threshold: 0.2 },
  )
  io.observe(host)
  document.addEventListener('visibilitychange', kick)

  return {
    stopPositions: () => opts.stops.map((k) => [opts.route[k][0] * width, opts.route[k][1] * height] as Point),
    rideTo(stop) {
      const to = stopFractions[stop] ?? 1
      if (reducedMotion || !introDone) {
        bike = to
        travel?.done()
        travel = null
        kick()
        return Promise.resolve()
      }
      return new Promise((resolve) => {
        travel?.done()
        bikeDir = pointAt(line, to).x >= pointAt(line, bike).x ? 1 : -1
        travel = { from: bike, to, t0: performance.now(), dur: 380 + Math.abs(to - bike) * 700, done: resolve }
        kick()
      })
    },
    setDrift(on) {
      drift = on
      kick()
    },
    destroy() {
      cancelAnimationFrame(raf)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
      host.removeEventListener('pointerdown', onDown)
      media.removeEventListener('change', onThemeChange)
      themeObserver.disconnect()
      resizeObserver.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', kick)
    },
  }
}

/** Bicicleta desenhada à mão, com halo circular para ficar legível sobre as curvas. */
export function drawBikeGlyph(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dir: number,
  colors: Pick<Colors, 'ground' | 'route' | 'ink'>,
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = colors.ground
  ctx.beginPath()
  ctx.arc(0, 0, 15, 0, Math.PI * 2)
  ctx.fill()
  ctx.lineWidth = 1.5
  ctx.strokeStyle = colors.route
  ctx.stroke()
  ctx.scale(dir, 1)
  ctx.strokeStyle = colors.ink
  ctx.lineWidth = 1.6
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(-1.5, 3)
  ctx.arc(-5.5, 3, 4, 0, Math.PI * 2)
  ctx.moveTo(9.5, 3)
  ctx.arc(5.5, 3, 4, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(-5.5, 3)
  ctx.lineTo(-1, 3)
  ctx.lineTo(3, -3)
  ctx.lineTo(-3, -3)
  ctx.lineTo(-1, 3)
  ctx.moveTo(-5.5, 3)
  ctx.lineTo(-3, -3)
  ctx.moveTo(-4.5, -5)
  ctx.lineTo(-1.5, -5)
  ctx.moveTo(5.5, 3)
  ctx.lineTo(3, -5)
  ctx.lineTo(5, -6)
  ctx.stroke()
  ctx.restore()
}

/** Desenha um terreno estático (usado nas miniaturas dos projetos). */
export function drawStaticTerrain(canvas: HTMLCanvasElement, host: HTMLElement, seed: number, route: Point[]) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const r = host.getBoundingClientRect()
  if (!r.width || !r.height) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(r.width * dpr)
  canvas.height = Math.round(r.height * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  const cs = getComputedStyle(host)
  const v = (n: string) => cs.getPropertyValue(n).trim()
  const noise = createNoise(seed)
  const step = 6
  const scale = 120
  const cols = Math.ceil(r.width / step) + 1
  const rows = Math.ceil(r.height / step) + 1
  const field = new Float32Array(cols * rows)
  let lo = Infinity
  let hi = -Infinity
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const value = noise((i * step) / scale, (j * step) / scale)
      field[j * cols + i] = value
      if (value < lo) lo = value
      if (value > hi) hi = value
    }
  }
  const minor = new Path2D()
  const major = new Path2D()
  contourSegments(field, cols, rows, step, (hi - lo) / 12, (isMajor, x1, y1, x2, y2) => {
    const p = isMajor ? major : minor
    p.moveTo(x1, y1)
    p.lineTo(x2, y2)
  })
  ctx.clearRect(0, 0, r.width, r.height)
  ctx.lineWidth = 1
  ctx.strokeStyle = v('--curva')
  ctx.stroke(minor)
  ctx.lineWidth = 1.6
  ctx.strokeStyle = v('--mestra')
  ctx.stroke(major)
  const pts = catmullRom(route.map(([x, y]) => [x * r.width, y * r.height] as Point), 16)
  const path = new Path2D()
  path.moveTo(pts[0][0], pts[0][1])
  pts.slice(1).forEach(([x, y]) => path.lineTo(x, y))
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.lineWidth = 7
  ctx.strokeStyle = v('--contorno')
  ctx.stroke(path)
  ctx.lineWidth = 3
  ctx.strokeStyle = v('--trilha')
  ctx.stroke(path)
}
