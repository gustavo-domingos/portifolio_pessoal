import { createContext, useContext } from 'react'
import type { Content, Lang } from '../content'

export interface LanguageState {
  lang: Lang
  t: Content
  setLang: (lang: Lang) => void
}

export const LanguageContext = createContext<LanguageState | null>(null)

export function useLanguage(): LanguageState {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage precisa estar dentro de LanguageProvider')
  return value
}
