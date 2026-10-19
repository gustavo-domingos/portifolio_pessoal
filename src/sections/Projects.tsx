import type { CaseId } from '../content'
import { TerrainThumb } from '../components/TerrainThumb'
import { useLanguage } from '../i18n/context'
import './Projects.css'

interface ProjectsProps {
  onOpenCase: (id: CaseId) => void
}

export function Projects({ onOpenCase }: ProjectsProps) {
  const { t } = useLanguage()

  return (
    <section id="projetos" className="section projects" aria-labelledby="projetos-titulo">
      <div className="container">
        <header className="section__head">
          <h2 id="projetos-titulo" className="section__title">{t.projects.title}</h2>
          <p className="section__intro">{t.projects.intro}</p>
        </header>

        <ul className="projects__list">
          {t.projects.cases.map((c) => (
            <li key={c.id} className="project">
              <TerrainThumb seed={c.seed} className="project__thumb" />
              <div className="project__body">
                <p className="project__kind">{c.kind}</p>
                <h3 className="project__title">{c.title}</h3>
                <p className="project__summary">{c.summary}</p>
                <ul className="tag-list project__stack" aria-label={t.ui.stack}>
                  {c.stack.slice(0, 6).map((s) => <li key={s}>{s}</li>)}
                </ul>
                <button type="button" className="button button--solid project__open" onClick={() => onOpenCase(c.id)}>
                  {t.ui.readCase}
                  <span className="visually-hidden">: {c.title}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
