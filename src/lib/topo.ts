// Funções puras do mapa topográfico: ruído, curvas de nível (marching squares) e trilha.
// Não tocam no DOM, por isso são testadas isoladamente em topo.test.ts.

export type Point = [number, number]

export type Noise = (x: number, y: number) => number

/** Ruído de valor 2D com três oitavas, determinístico para a mesma semente. Retorna valores em [0, 1]. */
export function createNoise(seed: number): Noise {
  const perm = new Uint8Array(512)
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647
  const p = Array.from({ length: 256 }, (_, i) => i)
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[p[i], p[j]] = [p[j], p[i]]
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]

  const hash = (x: number, y: number) => perm[(perm[x & 255] + (y & 255)) & 255] / 255
  const smooth = (t: number) => t * t * (3 - 2 * t)
  const value = (x: number, y: number) => {
    const ix = Math.floor(x)
    const iy = Math.floor(y)
    const u = smooth(x - ix)
    const v = smooth(y - iy)
    const a = hash(ix, iy)
    const b = hash(ix + 1, iy)
    const c = hash(ix, iy + 1)
    const d = hash(ix + 1, iy + 1)
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
  }

  return (x, y) =>
    value(x, y) * 0.6 + value(x * 2.1 + 5.2, y * 2.1 + 1.3) * 0.28 + value(x * 4.3 + 9.1, y * 4.3 + 3.7) * 0.12
}

export type SegmentSink = (major: boolean, x1: number, y1: number, x2: number, y2: number) => void

/**
 * Gera as curvas de nível de um campo escalar amostrado numa grade regular.
 * Cada `spacing` de altura vira uma curva; a cada `majorEvery` curvas, uma curva mestra.
 */
export function contourSegments(
  field: ArrayLike<number>,
  cols: number,
  rows: number,
  step: number,
  spacing: number,
  sink: SegmentSink,
  majorEvery = 5,
): void {
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const a = field[j * cols + i]
      const b = field[j * cols + i + 1]
      const c = field[(j + 1) * cols + i + 1]
      const d = field[(j + 1) * cols + i]
      const mn = Math.min(a, b, c, d)
      const mx = Math.max(a, b, c, d)
      for (let k = Math.ceil(mn / spacing); k * spacing <= mx; k++) {
        const t = k * spacing
        const idx = (a > t ? 8 : 0) | (b > t ? 4 : 0) | (c > t ? 2 : 0) | (d > t ? 1 : 0)
        if (idx === 0 || idx === 15) continue
        const x = i * step
        const y = j * step
        const major = k % majorEvery === 0
        const top = (): Point => [x + (step * (t - a)) / (b - a), y]
        const right = (): Point => [x + step, y + (step * (t - b)) / (c - b)]
        const bottom = (): Point => [x + (step * (t - d)) / (c - d), y + step]
        const left = (): Point => [x, y + (step * (t - a)) / (d - a)]
        const seg = (p: Point, q: Point) => sink(major, p[0], p[1], q[0], q[1])
        switch (idx) {
          case 1: case 14: seg(left(), bottom()); break
          case 2: case 13: seg(bottom(), right()); break
          case 3: case 12: seg(left(), right()); break
          case 4: case 11: seg(top(), right()); break
          case 5: seg(top(), right()); seg(left(), bottom()); break
          case 6: case 9: seg(top(), bottom()); break
          case 7: case 8: seg(left(), top()); break
          case 10: seg(left(), top()); seg(bottom(), right()); break
        }
      }
    }
  }
}

/** Curva Catmull-Rom que passa por todos os pontos, com `samples` amostras por trecho. */
export function catmullRom(points: Point[], samples = 24): Point[] {
  if (points.length < 2) return points.slice()
  const out: Point[] = []
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]
    for (let k = 0; k < samples; k++) {
      const t = k / samples
      const t2 = t * t
      const t3 = t2 * t
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3)
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])])
    }
  }
  out.push(points[points.length - 1])
  return out
}

export interface Polyline {
  points: Point[]
  /** Comprimento acumulado até cada ponto. */
  lengths: number[]
  total: number
}

export function measure(points: Point[]): Polyline {
  const lengths = [0]
  for (let i = 1; i < points.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]))
  }
  return { points, lengths, total: lengths[lengths.length - 1] || 0 }
}

/** Ponto na fração `s` (0 a 1) do comprimento da linha, e o índice do primeiro ponto depois dele. */
export function pointAt(line: Polyline, s: number): { x: number; y: number; index: number } {
  const { points, lengths, total } = line
  if (points.length === 1 || total === 0) return { x: points[0][0], y: points[0][1], index: 0 }
  const d = Math.max(0, Math.min(1, s)) * total
  let lo = 0
  let hi = lengths.length - 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (lengths[mid] < d) lo = mid
    else hi = mid
  }
  const span = lengths[hi] - lengths[lo] || 1
  const t = (d - lengths[lo]) / span
  return {
    x: points[lo][0] + (points[hi][0] - points[lo][0]) * t,
    y: points[lo][1] + (points[hi][1] - points[lo][1]) * t,
    index: hi,
  }
}

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
