import { useLanguage } from '../i18n/context'
import './Stack.css'

/** Cada grupo usa um traço do mapa: quanto mais uso, mais forte o traço. */
const SYMBOLS = ['trilha', 'mestra', 'curva', 'tracejada'] as const

export function Stack() {
  const { t } = useLanguage()

  return (
    <section id="stack" className="section stack" aria-labelledby="stack-titulo">
      <div className="container">
        <header className="section__head">
          <h2 id="stack-titulo" className="section__title">{t.stack.title}</h2>
          <p className="section__intro">{t.stack.intro}</p>
        </header>

        <dl className="stack__legend">
          {t.stack.groups.map((g, i) => (
            <div key={g.name} className="stack__row">
              <dt>
                <span className={`stack__symbol stack__symbol--${SYMBOLS[i] ?? 'curva'}`} aria-hidden="true" />
                {g.name}
              </dt>
              <dd>
                <ul>
                  {g.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </dd>
            </div>
          ))}
        </dl>

        <p className="stack__note">{t.stack.note}</p>
      </div>
    </section>
  )
}
