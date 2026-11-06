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
    const rawSession = s?.getItem(SESSION_KEY)
    if (rawSession) session = JSON.parse(rawSession) as Session
    if (raw) {
      const parsed = JSON.parse(raw) as DB
      if (parsed.version === SEED_VERSION) db = parsed
      // Nouvelle version des données de démo : on la recharge sans perdre les comptes et clubs créés ici.
      else if (Array.isArray(parsed.users)) {
        const seed = await createSeed()
        db = keepOwnData(seed, parsed)
        session = ownSession(db, seed, session)
      }
    }
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

/**
 * Réinitialise la démo : les données d'exemple sont restaurées, mais les comptes et clubs créés
 * dans ce navigateur (hors démo) sont conservés. La session n'est gardée que pour un compte réel.
 */
export async function resetStore() {
  const seed = await createSeed()
  db = db ? keepOwnData(seed, db) : seed
  session = ownSession(db, seed, session)
  persist()
  emit()
}

/**
 * Données de démo à jour + ce qui appartient aux comptes réels de `cur`. Tout ce qui touche un compte
 * ou un club de démo est remplacé par le jeu d'exemple ; un club créé pendant la démo (sans membre réel) disparaît.
 */
function keepOwnData(seed: DB, cur: DB): DB {
  const seedUsers = new Set(seed.users.map((u) => u.id))
  const seedClubs = new Set(seed.clubs.map((c) => c.id))
  const users = (cur.users ?? []).filter((u) => !seedUsers.has(u.id))
  const userIds = new Set(users.map((u) => u.id))
  const clubs = (cur.clubs ?? []).filter((c) => !seedClubs.has(c.id)
    && (cur.memberships ?? []).some((m) => m.clubId === c.id && m.status === 'approved' && userIds.has(m.userId)))
  const clubIds = new Set(clubs.map((c) => c.id))
  const inClub = <T extends { clubId: string }>(rows: T[] | undefined) => (rows ?? []).filter((r) => clubIds.has(r.clubId))
  const absences = inClub(cur.absences).filter((a) => userIds.has(a.educatorId))
  const absenceIds = new Set(absences.map((a) => a.id))
  const seedQualifs = new Set(seed.qualifications.map((q) => q.id))
  return {
    ...seed,
    users: [...seed.users, ...users],
    clubs: [...seed.clubs, ...clubs],
    memberships: [...seed.memberships, ...inClub(cur.memberships).filter((m) => userIds.has(m.userId))],
    roles: [...seed.roles, ...inClub(cur.roles)],
    piscines: [...seed.piscines, ...inClub(cur.piscines)],
    niveaux: [...seed.niveaux, ...inClub(cur.niveaux)],
    groupes: [...seed.groupes, ...inClub(cur.groupes)],
    creneaux: [...seed.creneaux, ...inClub(cur.creneaux).map((c) => ({ ...c, educatorIds: c.educatorIds.filter((id) => userIds.has(id)) }))],
    // Catalogue de diplômes commun : ceux ajoutés ici restent.
    qualifications: [...seed.qualifications, ...(cur.qualifications ?? []).filter((q) => !seedQualifs.has(q.id))],
    userQualifications: [...seed.userQualifications, ...(cur.userQualifications ?? []).filter((q) => userIds.has(q.userId))],
    absences: [...seed.absences, ...absences],
    remplacements: [...seed.remplacements, ...(cur.remplacements ?? []).filter((r) => absenceIds.has(r.absenceId) && userIds.has(r.volunteerId))],
    tickets: [...seed.tickets, ...(cur.tickets ?? []).filter((t) => userIds.has(t.userId) && (!t.clubId || clubIds.has(t.clubId)))],
    notifications: [...seed.notifications, ...inClub(cur.notifications).filter((n) => userIds.has(n.userId))],
  }
}

/** Session conservée seulement pour un compte réel ; son club est oublié s'il n'en est plus membre. */
function ownSession(next: DB, seed: DB, s: Session | null): Session | null {
  if (!s || s.demo || seed.users.some((u) => u.id === s.userId) || !next.users.some((u) => u.id === s.userId)) return null
  const member = next.memberships.some((m) => m.userId === s.userId && m.clubId === s.clubId && m.status === 'approved')
  return !s.clubId || member ? s : { ...s, clubId: undefined }
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
