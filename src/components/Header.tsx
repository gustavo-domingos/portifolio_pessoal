import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/context'
import { useTheme } from '../hooks/useTheme'
import './Header.css'

const SECTIONS = ['trajetoria', 'projetos', 'sobre', 'stack', 'contato'] as const

export function Header() {
  const { t, lang, setLang } = useLanguage()
  const [theme, toggleTheme] = useTheme()
  const [open, setOpen] = useState(false)

  const labels: Record<(typeof SECTIONS)[number], string> = {
    trajetoria: t.nav.journey,
    projetos: t.nav.projects,
    sobre: t.nav.about,
    stack: t.nav.stack,
    contato: t.nav.contact,
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="brand" href="#topo" aria-label={t.hero.name}>
          <BrandMark />
          <span>Gustavo Alves</span>
        </a>

        <nav className="nav" aria-label={t.nav.label}>
          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="nav-lista"
            onClick={() => setOpen((v) => !v)}
          >
            {t.nav.menu}
          </button>
          <ul id="nav-lista" className="nav__list" data-open={open}>
            {SECTIONS.map((id) => (
              <li key={id}>
                <a href={`#${id}`} onClick={() => setOpen(false)}>{labels[id]}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__tools">
          <button
            type="button"
            className="tool"
            lang={lang === 'pt' ? 'en' : 'pt-BR'}
            aria-label={`${t.ui.langSwitch}, ${t.ui.langSwitchLabel}`}
            onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
          >
            {t.ui.langSwitch}
          </button>
          <button
            type="button"
            className="tool"
            aria-label={theme === 'dark' ? t.ui.themeToLight : t.ui.themeToDark}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}

function BrandMark() {
  return (
    <svg className="brand__mark" viewBox="0 0 32 32" aria-hidden="true">
      <ellipse cx="16" cy="17" rx="13" ry="10" fill="none" stroke="var(--mestra)" strokeWidth="1.5" />
      <ellipse cx="16" cy="17" rx="8" ry="6" fill="none" stroke="var(--curva)" strokeWidth="1.5" />
      <path d="M4 26 C 10 22, 12 12, 20 13 S 27 7, 29 5" fill="none" stroke="var(--trilha)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  )
}
