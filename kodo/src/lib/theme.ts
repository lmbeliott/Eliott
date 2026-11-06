import { useCallback, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
const KEY = 'kodo:theme'

const systemTheme = (): Theme => (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
function current(): Theme {
  const forced = document.documentElement.dataset.theme
  return forced === 'light' || forced === 'dark' ? forced : systemTheme()
}

/** Thème effectif et bascule clair/sombre (le choix est mémorisé). */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(current)
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    const on = () => setTheme(current())
    mq?.addEventListener('change', on)
    window.addEventListener('kodo:theme', on)
    return () => {
      mq?.removeEventListener('change', on)
      window.removeEventListener('kodo:theme', on)
    }
  }, [])
  const toggle = useCallback(() => {
    const next: Theme = current() === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event('kodo:theme'))
  }, [])
  return [theme, toggle]
}
