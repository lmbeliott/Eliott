import { safeStorage } from './util'

export type ThemePref = 'system' | 'light' | 'dark'
const KEY = 'swimhub.theme'

export function getTheme(): ThemePref {
  try {
    const v = safeStorage()?.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : 'system'
  } catch {
    return 'system'
  }
}

export function applyTheme(pref: ThemePref = getTheme()) {
  const root = document.documentElement
  if (pref === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', pref)
  const dark = pref === 'dark' || (pref === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#07141d' : '#0c2a3e')
}

export function setTheme(pref: ThemePref) {
  try {
    const s = safeStorage()
    if (pref === 'system') s?.removeItem(KEY)
    else s?.setItem(KEY, pref)
  } catch { /* stockage indisponible */ }
  applyTheme(pref)
}
