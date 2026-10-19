import { useEffect, useRef, useState } from 'react'
import type { Stop } from '../content'
import { HERO_SEED, NARROW_LAYOUT, WIDE_LAYOUT } from '../components/heroRoute'
import { useLanguage } from '../i18n/context'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { asset } from '../lib/asset'
import { createTopoMap, type TopoMap } from '../lib/topoMap'
import './Hero.css'

interface HeroProps {
  onStop: (stop: Stop) => void
}

export function Hero({ onStop }: HeroProps) {
  const { t } = useLanguage()
  const reduced = useReducedMotion()
  const narrow = useMediaQuery('(max-width: 40rem)')
  const layout = narrow ? NARROW_LAYOUT : WIDE_LAYOUT
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const altRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<TopoMap | null>(null)
  const introPlayed = useRef(false)
  const [reached, setReached] = useState<boolean[]>(() => layout.stops.map(() => reduced))
  const [drift, setDrift] = useState(!reduced)

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return
    // A abertura toca uma vez; trocar de layout (girar o celular) não repete.
    const skipIntro = reduced || introPlayed.current
    const map = createTopoMap({
      host,
      canvas,
      route: layout.route,
      stops: layout.stops,
      bikeOffsets: layout.bikeOffsets,
      seed: HERO_SEED,
      reducedMotion: skipIntro,
      onStopReached: (n) => {
        setReached((prev) => prev.map((v, i) => v || i === n))
        if (n === layout.stops.length - 1) introPlayed.current = true
      },
      onAltitude: (reading) => {
        const el = altRef.current
        if (!el) return
        el.dataset.show = String(Boolean(reading))
        if (!reading) return
        el.textContent = `${reading.meters} m`
        el.style.transform = `translate(${reading.x + 14}px, ${reading.y - 28}px)`
      },
    })
    if (reduced) map.setDrift(false)
    mapRef.current = map
    return () => {
      map.destroy()
      mapRef.current = null
    }
  }, [reduced, layout])

  // As paradas ficam em frações da altura do mapa. Em janelas baixas, o texto do topo ocupa
  // proporcionalmente mais espaço e as paradas subiriam por cima dele; aqui o mapa cresce o
  // suficiente para toda parada (e o rótulo dela) passar abaixo do texto.
  useEffect(() => {
    const host = hostRef.current
    const text = textRef.current
    if (!host || !text) return
    const GAP = 14 // folga entre o texto e o que estiver acima da parada
    const DOT = 16 // meio marcador mais a borda
    const fit = () => {
      host.style.minHeight = ''
      const map = host.getBoundingClientRect()
      // mede cada peça (não o container dos botões, que ocupa a largura toda)
      const parts = [...text.querySelectorAll('.hero__name, .hero__lede, .hero__actions > *')].map((el) => {
        const r = el.getBoundingClientRect()
        return { left: r.left - map.left, right: r.right - map.left, bottom: r.bottom - map.top }
      })
      const labels = [...host.querySelectorAll<HTMLElement>('.stop__label')]
      let needed = 0
      layout.stops.forEach((index, n) => {
        const [fx, fy] = layout.route[index]
        const x = fx * map.width
        const { position, anchor } = layout.labels[n]
        const w = labels[n]?.offsetWidth ?? 0
        const h = labels[n]?.offsetHeight ?? 0
        // faixa horizontal ocupada pela parada e pelo rótulo
        const [from, to] =
          position === 'right' ? [x - DOT, x + 19 + w]
          : anchor === 'start' ? [x - DOT, Math.max(x + DOT, x - 13 + w)]
          : anchor === 'end' ? [Math.min(x - DOT, x + 13 - w), x + DOT]
          : [Math.min(x - DOT, x - w / 2), Math.max(x + DOT, x + w / 2)]
        const above = parts.filter((p) => p.left < to && p.right > from)
        if (!above.length) return
        const textBottom = Math.max(...above.map((p) => p.bottom))
        // distância do centro da parada até o ponto mais alto dela (marcador ou rótulo acima)
        const reachUp = position === 'above' ? 18 + h : DOT
        needed = Math.max(needed, (textBottom + GAP + reachUp) / fy)
      })
      if (needed > map.height) host.style.minHeight = `${Math.ceil(needed)}px`
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(text)
    window.addEventListener('resize', fit)
    document.fonts?.ready.then(fit)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [layout, t])

  const toggleDrift = () => {
    const next = !drift
    setDrift(next)
    mapRef.current?.setDrift(next)
  }

  const goTo = async (n: number) => {
    await mapRef.current?.rideTo(n)
    onStop(t.hero.stops[n])
  }

  return (
    <section id="topo" className="hero" aria-labelledby="hero-nome">
      <div ref={hostRef} className="hero__map">
        <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />

        <div ref={textRef} className="container hero__text">
          <h1 id="hero-nome" className="hero__name">{t.hero.name}</h1>
          <p className="hero__lede">{t.hero.lede}</p>
          <div className="hero__actions">
            <a className="button button--solid" href="#projetos">{t.hero.ctaProjects}</a>
            <a className="button button--ghost hero__ghost" href={asset(t.contact.cv.href)} download>
              {t.hero.ctaCv}
            </a>
          </div>
        </div>

        <ol className="hero__stops" aria-label={t.ui.mapLabel}>
          {t.hero.stops.map((stop, n) => {
            const [x, y] = layout.route[layout.stops[n]]
            const label = layout.labels[n]
            return (
              <li key={stop.label} style={{ left: `${x * 100}%`, top: `${y * 100}%` }}>
                <button
                  type="button"
                  className="stop"
                  data-on={reached[n]}
                  data-pos={label.position}
                  data-anchor={label.anchor}
                  onClick={() => goTo(n)}
                >
                  <span className="stop__dot" aria-hidden="true">{n + 1}</span>
                  <span className="stop__label">
                    {stop.label}{' '}
                    <small>{stop.date}</small>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <span ref={altRef} className="hero__alt" data-show="false" aria-hidden="true" />

        <div className="hero__legend" aria-hidden="true">
          <span><i className="l-curva" />{t.hero.legend.contour}</span>
          <span><i className="l-mestra" />{t.hero.legend.index}</span>
          <span><i className="l-trilha" />{t.hero.legend.trail}</span>
        </div>

        <button type="button" className="hero__pause" aria-pressed={!drift} onClick={toggleDrift}>
          {drift ? t.ui.pauseTerrain : t.ui.playTerrain}
        </button>
      </div>
    </section>
  )
}
