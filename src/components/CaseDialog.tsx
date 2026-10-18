import { useEffect, useRef } from 'react'
import type { CaseStudy } from '../content'
import { useLanguage } from '../i18n/context'
import { asset } from '../lib/asset'
import { TerrainThumb } from './TerrainThumb'
import './CaseDialog.css'

interface CaseDialogProps {
  study: CaseStudy | null
  onClose: () => void
}

/** Página do case num <dialog> nativo: foco preso, Esc fecha e o foco volta para quem abriu. */
export function CaseDialog({ study, onClose }: CaseDialogProps) {
  const { t } = useLanguage()
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (study && !dialog.open) dialog.showModal()
    if (!study && dialog.open) dialog.close()
  }, [study])

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const handleClose = () => onClose()
    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [onClose])

  return (
    <dialog
      ref={ref}
      className="case"
      aria-labelledby="case-titulo"
      onClick={(e) => { if (e.target === e.currentTarget) ref.current?.close() }}
    >
      {study && (
        <article className="case__sheet">
          <button type="button" className="case__close" onClick={() => ref.current?.close()}>
            {t.ui.close}
          </button>

          <header className="case__head">
            <p className="case__kind">{study.kind}</p>
            <h2 id="case-titulo" className="case__title">{study.title}</h2>
            <p className="case__period">{study.period}</p>
            <p className="case__summary">{study.summary}</p>
          </header>

          <TerrainThumb seed={study.seed} className="case__banner" />

          {study.images && study.images.length > 0 && (
            <ul className="case__gallery">
              {study.images.map((img) => (
                <li key={img.src}>
                  <figure>
                    <img src={asset(img.src)} alt={img.alt} width={img.width} height={img.height} loading="lazy" decoding="async" />
                    {img.caption && <figcaption>{img.caption}</figcaption>}
                  </figure>
                </li>
              ))}
            </ul>
          )}

          <div className="case__grid">
            <div className="case__main">
              <section>
                <h3>{t.ui.problem}</h3>
                <p>{study.problem}</p>
              </section>
              <section>
                <h3>{t.ui.solution}</h3>
                <p>{study.solution}</p>
              </section>
              <section>
                <h3>{study.highlightsTitle}</h3>
                <ul className="case__list">
                  {study.highlights.map((h) => (
                    <li key={h.text}>
                      {h.text}
                      {h.source && study.sources[h.source - 1] && (
                        <a className="case__ref" href={`#fonte-${study.id}-${h.source}`} aria-label={`${t.ui.sourceRef} ${h.source}`}>
                          {h.source}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h3>{t.ui.learned}</h3>
                <ul className="case__list">
                  {study.learned.map((l) => <li key={l}>{l}</li>)}
                </ul>
              </section>
              <section className="case__role">
                <h3>{t.ui.role}</h3>
                <p>{study.role}</p>
              </section>
            </div>

            <aside className="case__side">
              <section>
                <h3>{t.ui.stack}</h3>
                <ul className="tag-list">
                  {study.stack.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </section>
              {(study.links.length > 0 || study.note) && (
                <section>
                  <h3>{t.ui.links}</h3>
                  {study.links.length > 0 && (
                    <ul className="case__links">
                      {study.links.map((l) => (
                        <li key={l.href}><a href={l.href} target="_blank" rel="noreferrer">{l.label}</a></li>
                      ))}
                    </ul>
                  )}
                  {study.note && <p className="case__note">{study.note}</p>}
                </section>
              )}
              {study.sources.length > 0 && (
                <section>
                  <h3>{t.ui.sources}</h3>
                  <ol className="case__sources">
                    {study.sources.map((s, i) => (
                      <li key={s.href} id={`fonte-${study.id}-${i + 1}`}>
                        <a href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
                      </li>
                    ))}
                  </ol>
                </section>
              )}
            </aside>
          </div>
        </article>
      )}
    </dialog>
  )
}
