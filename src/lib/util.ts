import { twMerge } from 'tailwind-merge'

/** Concatène des classes Tailwind ; la dernière gagne en cas de conflit (h-9 remplace h-11…). */
export function cn(...parts: Array<string | false | null | undefined>) {
  return twMerge(parts.filter(Boolean).join(' '))
}

/** Majuscule initiale uniquement (« mar. 17 nov. » → « Mar. 17 nov. »). */
export function ucfirst(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function uid(prefix = ''): string {
  const r = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().replace(/-/g, '').slice(0, 12)
    : Math.random().toString(36).slice(2, 14)
  return prefix ? `${prefix}_${r}` : r
}

export async function sha256(text: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
  }
  // Repli (contexte non sécurisé) : hachage non cryptographique, suffisant pour la démo locale.
  let h = 5381
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0
  return `djb2_${(h >>> 0).toString(16)}`
}

export function normalize(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

export function pluralize(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`
}

/** 7.9999… → « 8 h », 1.25 → « 1 h 15 », −0.75 → « −0 h 45 ». Arrondi à la minute avant découpage. */
export const fmtHours = (h: number) => {
  const total = Math.round(Math.abs(h) * 60)
  const sign = h < 0 && total > 0 ? '−' : ''
  const whole = Math.floor(total / 60)
  const min = total % 60
  return min === 0 ? `${sign}${whole} h` : `${sign}${whole} h ${String(min).padStart(2, '0')}`
}

export function safeStorage() {
  try {
    const k = '__swimhub_probe__'
    window.localStorage.setItem(k, '1')
    window.localStorage.removeItem(k)
    return window.localStorage
  } catch {
    return null
  }
}

/** Couleur stable dérivée d'une chaîne (avatars). */
export function hueFrom(text: string) {
  let h = 0
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) % 360
  return h
}
