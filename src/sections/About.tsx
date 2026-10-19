import { useLanguage } from '../i18n/context'
import './About.css'

export function About() {
  const { t } = useLanguage()

  return (
    <section id="sobre" className="section about" aria-labelledby="sobre-titulo">
      <div className="container about__grid">
        <div className="about__text">
          <h2 id="sobre-titulo" className="section__title">{t.about.title}</h2>
          {t.about.paragraphs.map((p) => <p key={p}>{p}</p>)}
        </div>
        <aside className="about__sites">
          <h3>{t.about.sitesTitle}</h3>
          <dl>
            {t.about.sites.map((s) => (
              <div key={s.name}>
                <dt>{s.name}</dt>
                <dd>{s.why}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  )
}
