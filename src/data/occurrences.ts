import type { Absence, Creneau, DB, Groupe, ID, Niveau, Piscine, Qualification, Remplacement, User } from './types'
import { absenceStatus, approvedReplacement, userById } from './api'
import { fromISO, minutes, weekday } from '../lib/dates'

export interface AbsenceInfo {
  absence: Absence
  status: Absence['status']
  educator?: User
  replacement?: User
  candidates: Remplacement[]
}

export interface Occurrence {
  key: string
  slot: Creneau
  date: string
  groupe?: Groupe
  niveau?: Niveau
  piscine?: Piscine
  qualification?: Qualification
  educators: User[]
  absences: AbsenceInfo[]
  /** État le plus critique de la séance. */
  state: 'normal' | 'open' | 'replaced' | 'unreplaced'
}

export function buildOccurrence(db: DB, slot: Creneau, date: string): Occurrence {
  const groupe = db.groupes.find((g) => g.id === slot.groupeId)
  const absences: AbsenceInfo[] = db.absences
    .filter((a) => a.creneauId === slot.id && a.date === date && a.status !== 'cancelled')
    .map((absence) => {
      const rp = approvedReplacement(db, absence.id)
      return {
        absence,
        status: absenceStatus(db, absence),
        educator: userById(db, absence.educatorId),
        replacement: rp ? userById(db, rp.volunteerId) : undefined,
        candidates: db.remplacements.filter((r) => r.absenceId === absence.id && r.status === 'pending'),
      }
    })
  const state = absences.some((a) => a.status === 'unreplaced') ? 'unreplaced'
    : absences.some((a) => a.status === 'open') ? 'open'
      : absences.some((a) => a.status === 'replaced') ? 'replaced' : 'normal'
  return {
    key: `${slot.id}_${date}`,
    slot,
    date,
    groupe,
    niveau: db.niveaux.find((n) => n.id === groupe?.niveauId),
    piscine: db.piscines.find((p) => p.id === slot.piscineId),
    qualification: db.qualifications.find((q) => q.id === groupe?.qualificationId),
    educators: slot.educatorIds.map((id) => userById(db, id)).filter((u): u is User => !!u),
    absences,
    state,
  }
}

export function occurrencesOn(db: DB, clubId: ID, date: string, filter?: (s: Creneau) => boolean): Occurrence[] {
  const day = weekday(fromISO(date))
  return db.creneaux
    .filter((s) => s.clubId === clubId && s.day === day && (!filter || filter(s)))
    .sort((a, b) => minutes(a.start) - minutes(b.start))
    .map((s) => buildOccurrence(db, s, date))
}

/** Qui encadre réellement la séance (titulaires présents + remplaçants validés). */
export function effectiveCoaches(o: Occurrence): Array<{ user: User; replacing?: User }> {
  const out: Array<{ user: User; replacing?: User }> = []
  for (const u of o.educators) {
    const abs = o.absences.find((a) => a.absence.educatorId === u.id)
    if (!abs) out.push({ user: u })
    else if (abs.replacement) out.push({ user: abs.replacement, replacing: u })
  }
  return out
}

export function involves(o: Occurrence, userId: ID) {
  return o.slot.educatorIds.includes(userId) || o.absences.some((a) => a.replacement?.id === userId)
}

/** Layout des événements qui se chevauchent : colonne et nombre de colonnes par groupe de chevauchement. */
export function layoutColumns<T extends { slot: Creneau }>(items: T[]): Array<T & { col: number; cols: number }> {
  const sorted = [...items].sort((a, b) => minutes(a.slot.start) - minutes(b.slot.start) || minutes(b.slot.end) - minutes(a.slot.end))
  const out: Array<T & { col: number; cols: number }> = []
  let cluster: Array<T & { col: number; cols: number }> = []
  let clusterEnd = -1
  const flush = () => {
    const cols = Math.max(1, ...cluster.map((c) => c.col + 1))
    for (const c of cluster) c.cols = cols
    out.push(...cluster)
    cluster = []
  }
  for (const it of sorted) {
    const s = minutes(it.slot.start)
    const e = minutes(it.slot.end)
    if (s >= clusterEnd && cluster.length) flush()
    const used = new Set(cluster.filter((c) => minutes(c.slot.end) > s).map((c) => c.col))
    let col = 0
    while (used.has(col)) col++
    cluster.push({ ...it, col, cols: 1 })
    clusterEnd = Math.max(clusterEnd, e)
  }
  if (cluster.length) flush()
  return out
}
