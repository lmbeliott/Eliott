import type { Weekday } from '../data/types'

export const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'] as const
export const DAYS_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] as const
export const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
] as const

const pad = (n: number) => String(n).padStart(2, '0')

/** Date locale → "yyyy-mm-dd" (sans décalage UTC). */
export function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** "yyyy-mm-dd" → Date locale à minuit. */
export function fromISO(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function today(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export const todayISO = () => toISO(today())

export function addDays(d: Date, n: number): Date {
  const c = new Date(d)
  c.setDate(c.getDate() + n)
  return c
}

/** Lundi = 0 … Dimanche = 6 */
export function weekday(d: Date): Weekday {
  return ((d.getDay() + 6) % 7) as Weekday
}

export function startOfWeek(d: Date): Date {
  return addDays(d, -weekday(d))
}

export function sameDay(a: Date, b: Date) {
  return toISO(a) === toISO(b)
}

export function minutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + (m || 0)
}

export function hours(start: string, end: string): number {
  return Math.max(0, minutes(end) - minutes(start)) / 60
}

export function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return minutes(aStart) < minutes(bEnd) && minutes(bStart) < minutes(aEnd)
}

/** "17:45" → "17h45", "18:00" → "18h" */
export function fmtTime(hhmm: string): string {
  const [h, m] = hhmm.split(':')
  return m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}`
}

export function fmtRange(start: string, end: string) {
  return `${fmtTime(start)} – ${fmtTime(end)}`
}

const fmtCache = new Map<string, Intl.DateTimeFormat>()
function fmt(opts: Intl.DateTimeFormatOptions) {
  const key = JSON.stringify(opts)
  let f = fmtCache.get(key)
  if (!f) {
    f = new Intl.DateTimeFormat('fr-FR', opts)
    fmtCache.set(key, f)
  }
  return f
}

/** "mer. 12 nov." */
export function fmtShort(iso: string | Date) {
  const d = typeof iso === 'string' ? fromISO(iso) : iso
  return fmt({ weekday: 'short', day: 'numeric', month: 'short' }).format(d)
}

/** "mercredi 12 novembre" */
export function fmtLong(iso: string | Date) {
  const d = typeof iso === 'string' ? fromISO(iso) : iso
  return fmt({ weekday: 'long', day: 'numeric', month: 'long' }).format(d)
}

/** "12/11/2026" */
export function fmtNumeric(iso: string | Date) {
  const d = typeof iso === 'string' ? fromISO(iso) : iso
  return fmt({ day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

/** "12 nov. 2026" */
export function fmtMedium(iso: string | Date) {
  const d = typeof iso === 'string' ? fromISO(iso) : iso
  return fmt({ day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}

/** Libellé relatif : « aujourd'hui », « demain », « dans 3 jours », « il y a 2 jours » */
export function relativeDay(iso: string): string {
  const diff = Math.round((fromISO(iso).getTime() - today().getTime()) / 86_400_000)
  if (diff === 0) return "aujourd'hui"
  if (diff === 1) return 'demain'
  if (diff === -1) return 'hier'
  if (diff > 1) return `dans ${diff} jours`
  return `il y a ${-diff} jours`
}

export function daysUntil(iso: string): number {
  return Math.round((fromISO(iso).getTime() - today().getTime()) / 86_400_000)
}

/** Toutes les dates d'un mois tombant un jour de semaine donné. */
export function datesOfWeekdayInMonth(year: number, month: number, day: Weekday): string[] {
  const out: string[] = []
  const d = new Date(year, month, 1)
  while (d.getMonth() === month) {
    if (weekday(d) === day) out.push(toISO(d))
    d.setDate(d.getDate() + 1)
  }
  return out
}

/** Les n prochaines occurrences d'un jour de semaine (aujourd'hui inclus). */
export function nextOccurrences(day: Weekday, count: number, from = today()): string[] {
  const out: string[] = []
  let d = addDays(from, (day - weekday(from) + 7) % 7)
  while (out.length < count) {
    out.push(toISO(d))
    d = addDays(d, 7)
  }
  return out
}

/** Vrai si le créneau (date + heure de fin) est déjà terminé. */
export function isOver(dateISO: string, end: string, now = new Date()): boolean {
  const d = fromISO(dateISO)
  d.setMinutes(minutes(end))
  return d.getTime() < now.getTime()
}

export function nowMinutes(now = new Date()) {
  return now.getHours() * 60 + now.getMinutes()
}
