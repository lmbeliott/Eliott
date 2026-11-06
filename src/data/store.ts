import { useSyncExternalStore } from 'react'
import type { DB, Session } from './types'
import { safeStorage } from '../lib/util'
import { createSeed, SEED_VERSION } from './seed'

// Stockage local (mode démo / hors ligne). Toute l'app passe par `api.ts`,
// qui est le seul endroit à remplacer pour brancher un backend HTTP.

const DB_KEY = 'swimhub.db.v2'
const SESSION_KEY = 'swimhub.session.v2'

let db: DB | null = null
let session: Session | null = null
const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}

function persist() {
  const s = safeStorage()
  if (!s || !db) return
  try {
    s.setItem(DB_KEY, JSON.stringify(db))
    if (session) s.setItem(SESSION_KEY, JSON.stringify(session))
    else s.removeItem(SESSION_KEY)
  } catch {
    /* quota ou stockage bloqué : l'app continue en mémoire */
  }
}

export async function initStore() {
  const s = safeStorage()
  try {
    const raw = s?.getItem(DB_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as DB
      if (parsed.version === SEED_VERSION) db = parsed
    }
    const rawSession = s?.getItem(SESSION_KEY)
    if (rawSession) session = JSON.parse(rawSession) as Session
  } catch {
    db = null
  }
  if (!db) {
    db = await createSeed()
    session = null
  }
  if (session && !db.users.some((u) => u.id === session!.userId)) session = null
  persist()

  // Synchronisation entre onglets.
  window.addEventListener('storage', (e) => {
    if (e.key === DB_KEY && e.newValue) {
      try { db = JSON.parse(e.newValue); emit() } catch { /* ignore */ }
    }
    if (e.key === SESSION_KEY) {
      try { session = e.newValue ? JSON.parse(e.newValue) : null; emit() } catch { /* ignore */ }
    }
  })
}

export function getDB(): DB {
  if (!db) throw new Error('Store non initialisé')
  return db
}

export function getSession(): Session | null {
  return session
}

/** Applique une mutation sur une copie, puis publie le nouvel état. */
export function mutate<T>(fn: (draft: DB) => T): T {
  const draft = structuredClone(getDB())
  const result = fn(draft)
  db = draft
  persist()
  emit()
  return result
}

export function setSession(next: Session | null) {
  session = next
  persist()
  emit()
}

export async function resetStore() {
  db = await createSeed()
  session = null
  persist()
  emit()
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

/** Lecture réactive de la base. Le sélecteur doit renvoyer une valeur stable (référence issue de la base). */
export function useDB<T>(selector: (db: DB) => T): T {
  return useSyncExternalStore(subscribe, () => selector(getDB()))
}

export function useSession(): Session | null {
  return useSyncExternalStore(subscribe, () => session)
}

/** Base complète (ré-rendu à chaque mutation). */
export function useWholeDB(): DB {
  return useSyncExternalStore(subscribe, () => getDB())
}
