import { useCallback, useSyncExternalStore } from 'react'
import { writeStorage } from '../lib/storage'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'tema'
const darkQuery = '(prefers-color-scheme: dark)'

/** Lê o tema efetivo: escolha explícita no <html data-theme> ou a preferência do sistema. */
function currentTheme(): Theme {
  const explicit = document.documentElement.dataset.theme
  if (explicit === 'light' || explicit === 'dark') return explicit
  return window.matchMedia(darkQuery).matches ? 'dark' : 'light'
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia(darkQuery)
  media.addEventListener('change', onChange)
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => {
    media.removeEventListener('change', onChange)
    observer.disconnect()
  }
}

export function useTheme(): [Theme, () => void] {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => 'light' as Theme)
  const toggle = useCallback(() => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    writeStorage(STORAGE_KEY, next)
  }, [])
  return [theme, toggle]
}
