// Deux langues : le français par défaut, l'anglais au choix (interface et contenu).
// Les textes de l'interface s'écrivent sur place : t('Soumettre', 'Submit').
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type UiLang = 'fr' | 'en'
const KEY = 'cordee:lang'

function initialLang(): UiLang {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'fr' || v === 'en') return v
  } catch {
    /* stockage indisponible */
  }
  return 'fr'
}

interface I18n {
  lang: UiLang
  setLang: (l: UiLang) => void
  t: (fr: string, en: string) => string
}

const Ctx = createContext<I18n | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<UiLang>(initialLang)
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  const setLang = useCallback((l: UiLang) => {
    setLangState(l)
    try {
      localStorage.setItem(KEY, l)
    } catch {
      /* ignore */
    }
  }, [])
  const value = useMemo<I18n>(() => ({ lang, setLang, t: (fr, en) => (lang === 'en' ? en : fr) }), [lang, setLang])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useI18n() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useI18n hors de I18nProvider')
  return v
}

/** Contenu traduit si disponible, sinon la version française. */
export const pick = <T,>(lang: UiLang, fr: T, en: T | null | undefined): T => (lang === 'en' && en ? en : fr)

export const locale = (lang: UiLang) => (lang === 'en' ? 'en-GB' : 'fr-FR')

export function formatNumber(lang: UiLang, n: number) {
  return new Intl.NumberFormat(locale(lang)).format(n)
}

/** Altitude (l'XP du site) : « 1 250 m ». */
export function formatAltitude(lang: UiLang, meters: number) {
  return `${formatNumber(lang, meters)} m`
}

export function plural(lang: UiLang, n: number, fr: [string, string], en: [string, string]) {
  const [one, many] = lang === 'en' ? en : fr
  // En français, 0 et 1 sont au singulier.
  const singular = lang === 'en' ? n === 1 : n <= 1
  return `${formatNumber(lang, n)} ${singular ? one : many}`
}

export function formatDate(lang: UiLang, d: Date | string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) {
  return new Intl.DateTimeFormat(locale(lang), opts).format(typeof d === 'string' ? new Date(d) : d)
}

export function timeAgo(lang: UiLang, d: Date | string) {
  const date = typeof d === 'string' ? new Date(d) : d
  const s = Math.round((date.getTime() - Date.now()) / 1000)
  const rtf = new Intl.RelativeTimeFormat(locale(lang), { numeric: 'auto' })
  const abs = Math.abs(s)
  if (abs < 60) return rtf.format(Math.round(s), 'second')
  if (abs < 3600) return rtf.format(Math.round(s / 60), 'minute')
  if (abs < 86400) return rtf.format(Math.round(s / 3600), 'hour')
  if (abs < 86400 * 30) return rtf.format(Math.round(s / 86400), 'day')
  return formatDate(lang, date)
}
