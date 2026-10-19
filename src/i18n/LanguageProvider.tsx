import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { content, type Lang } from '../content'
import { readStorage, writeStorage } from '../lib/storage'
import { LanguageContext } from './context'

const STORAGE_KEY = 'idioma'

function initialLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (fromUrl === 'pt' || fromUrl === 'en') return fromUrl
  const saved = readStorage(STORAGE_KEY)
  if (saved === 'pt' || saved === 'en') return saved
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const t = content[lang]

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
  }, [lang, t])

  const value = useMemo(
    () => ({
      lang,
      t,
      setLang: (next: Lang) => {
        setLangState(next)
        writeStorage(STORAGE_KEY, next)
        const url = new URL(window.location.href)
        url.searchParams.set('lang', next)
        window.history.replaceState(null, '', url)
      },
    }),
    [lang, t],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
