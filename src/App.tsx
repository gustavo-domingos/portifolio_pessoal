import { useCallback, useEffect, useState } from 'react'
import type { CaseId, Stop } from './content'
import { CaseDialog } from './components/CaseDialog'
import { Header } from './components/Header'
import { useLanguage } from './i18n/context'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'
import { Hero } from './sections/Hero'
import { Journey } from './sections/Journey'
import { Projects } from './sections/Projects'
import { Stack } from './sections/Stack'

const CASE_HASH = /^#case-(.+)$/

export default function App() {
  const { t } = useLanguage()
  // Link direto para um case: .../#case-quem-eu-voto
  const [openId, setOpenId] = useState<CaseId | null>(() => {
    const id = CASE_HASH.exec(window.location.hash)?.[1]
    return t.projects.cases.find((c) => c.id === id)?.id ?? null
  })
  const study = t.projects.cases.find((c) => c.id === openId) ?? null

  const openCase = useCallback((id: CaseId) => {
    setOpenId(id)
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#case-${id}`)
  }, [])

  const closeCase = useCallback(() => {
    setOpenId(null)
    if (CASE_HASH.test(window.location.hash)) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#projetos`)
    }
  }, [])

  // Um link #case-... aberto com a página já carregada também abre o case.
  useEffect(() => {
    const onHash = () => {
      const id = CASE_HASH.exec(window.location.hash)?.[1]
      const found = t.projects.cases.find((c) => c.id === id)
      if (found) setOpenId(found.id)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [t])

  const onStop = useCallback(
    (stop: Stop) => {
      if (stop.target.kind === 'case') {
        openCase(stop.target.id)
        return
      }
      const el = document.getElementById(`trajetoria-${stop.target.id}`)
      if (!el) return
      el.scrollIntoView({ block: 'start' })
      el.focus({ preventScroll: true })
    },
    [openCase],
  )

  return (
    <>
      <a className="skip-link" href="#conteudo">{t.nav.skip}</a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero onStop={onStop} />
        <Journey onOpenCase={openCase} />
        <Projects onOpenCase={openCase} />
        <About />
        <Stack />
        <Contact />
      </main>
      <Footer />
      <CaseDialog study={study} onClose={closeCase} />
    </>
  )
}
