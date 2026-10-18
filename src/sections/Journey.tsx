import { useEffect, useRef, useState } from 'react'
import type { CaseId } from '../content'
import { BikeIcon } from '../components/BikeIcon'
import { useLanguage } from '../i18n/context'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './Journey.css'

interface JourneyProps {
  onOpenCase: (id: CaseId) => void
}

const TRAIL_X = 28
const WOBBLE = 12

/** x da trilha numa altura y: uma senoide suave, como uma estrada de serra. */
const trailX = (y: number) => TRAIL_X + WOBBLE * Math.sin(y / 95)

interface TrailGeometry {
  height: number
  d: string
  stops: number[]
}

export function Journey({ onOpenCase }: JourneyProps) {
  const { t } = useLanguage()
  const reduced = useReducedMotion()
  const listRef = useRef<HTMLOListElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const bikeRef = useRef<SVGGElement>(null)
  const [geo, setGeo] = useState<TrailGeometry>({ height: 0, d: '', stops: [] })
  const casesById = new Map(t.projects.cases.map((c) => [c.id, c]))

  // Recalcula a trilha quando a lista muda de tamanho (largura da tela, idioma).
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const measure = () => {
      const height = list.offsetHeight
      const points: string[] = []
      for (let y = 0; y <= height; y += 8) points.push(`${trailX(y).toFixed(1)},${y}`)
      points.push(`${trailX(height).toFixed(1)},${height}`)
      const stops = [...list.querySelectorAll<HTMLElement>(':scope > li')].map((li) => li.offsetTop + 14)
      setGeo({ height, d: `M${points.join(' L')}`, stops })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(list)
    return () => ro.disconnect()
  }, [t])

  // A bicicleta acompanha a rolagem e a trilha se desenha atrás dela.
  useEffect(() => {
    const list = listRef.current
    const path = pathRef.current
    const bike = bikeRef.current
    if (!list || !path || !bike || !geo.height) return
    const length = path.getTotalLength()
    path.style.strokeDasharray = `${length}`
    let raf = 0
    let lastX = 0
    const update = () => {
      raf = 0
      const rect = list.getBoundingClientRect()
      const progress = reduced ? 1 : Math.max(0, Math.min(1, (window.innerHeight * 0.55 - rect.top) / rect.height))
      path.style.strokeDashoffset = `${length * (1 - progress)}`
      const p = path.getPointAtLength(length * progress)
      const flip = p.x < lastX
      lastX = p.x
      bike.setAttribute('transform', `translate(${p.x} ${p.y})`)
      bike.firstElementChild?.querySelector('g')?.setAttribute('transform', flip ? 'scale(-1 1)' : '')
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [geo, reduced])

  return (
    <section id="trajetoria" className="section journey" aria-labelledby="trajetoria-titulo">
      <div className="container">
        <header className="section__head">
          <h2 id="trajetoria-titulo" className="section__title">{t.journey.title}</h2>
          <p className="section__intro">{t.journey.intro}</p>
        </header>

        <div className="journey__body">
          <svg className="journey__trail" width="56" height={geo.height} viewBox={`0 0 56 ${geo.height || 1}`} aria-hidden="true">
            <path className="journey__ghost" d={geo.d} />
            <path ref={pathRef} className="journey__line" d={geo.d} />
            {geo.stops.map((y, i) => (
              <circle key={i} className="journey__stop" cx={trailX(y)} cy={y} r="7" />
            ))}
            <g ref={bikeRef}>
              <BikeIcon />
            </g>
          </svg>

          <ol ref={listRef} className="journey__list" aria-label={t.ui.trailLabel}>
            {t.journey.items.map((item) => (
              <li key={item.id} id={`trajetoria-${item.id}`} className="journey__item" tabIndex={-1}>
                <p className="journey__date">{item.date}</p>
                <h3 className="journey__title">{item.title}</h3>
                <p className="journey__role">
                  {item.role}
                  {item.period && <span className="journey__period">{item.period}</span>}
                </p>
                {item.bullets && (
                  <ul className="journey__bullets">
                    {item.bullets.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                )}
                {item.cases && (
                  <div className="journey__cases">
                    {item.cases.map((id) => (
                      <button key={id} type="button" className="button button--ghost journey__case" onClick={() => onOpenCase(id)}>
                        {t.ui.readCase}: {casesById.get(id)?.title}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="education">
          <h3 className="education__title">{t.journey.educationTitle}</h3>
          <ul className="education__list">
            {t.journey.education.map((e) => (
              <li key={e.title}>
                <p className="education__name">{e.title}</p>
                <p className="education__school">{e.school}</p>
                <p className="education__status">{e.status}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
