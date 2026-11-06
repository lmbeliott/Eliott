// Logique métier. Chaque fonction lève une `ApiError` au message lisible,
// affiché tel quel dans l'interface.
import type {
  Absence, Club, Creneau, DB, Groupe, ID, Membership, Niveau, Permission, Piscine,
  Qualification, Remplacement, Role, Session, User, Weekday,
} from './types'
import { getDB, getSession, mutate, setSession } from './store'
import { hashPassword, LEVEL_COLORS } from './seed'
import { DAYS, fmtShort, fmtTime, fromISO, isOver, minutes, overlaps, today, toISO, weekday, datesOfWeekdayInMonth } from '../lib/dates'
import { normalize, uid } from '../lib/util'
import type { TableRow } from '../lib/csv'

export class ApiError extends Error {}
function fail(msg: string): never {
  throw new ApiError(msg)
}

export const PERMISSIONS: Array<{ key: Permission; label: string; hint: string }> = [
  { key: 'planning', label: "Gérer l'emploi du temps", hint: 'Piscines, groupes, niveaux et créneaux' },
  { key: 'replacements', label: 'Valider les remplacements', hint: 'Accepter ou refuser les volontaires' },
  { key: 'team', label: "Gérer l'équipe", hint: 'Adhésions et diplômes des membres' },
  { key: 'roles', label: 'Gérer les rôles', hint: 'Créer des rôles et les attribuer' },
  { key: 'reports', label: 'Consulter les rapports', hint: "Décompte d'heures et exports" },
]

// ---------------------------------------------------------------- lectures

export const fullName = (u?: Pick<User, 'firstname' | 'lastname'> | null) => (u ? `${u.firstname} ${u.lastname}` : 'Utilisateur supprimé')
export const shortName = (u?: Pick<User, 'firstname' | 'lastname'> | null) => (u ? `${u.firstname} ${u.lastname.charAt(0)}.` : '—')

export function userById(db: DB, id: ID) {
  return db.users.find((u) => u.id === id)
}

export function membershipOf(db: DB, userId: ID, clubId: ID) {
  return db.memberships.find((m) => m.userId === userId && m.clubId === clubId)
}

export function permissionsOf(db: DB, userId: ID, clubId: ID): Set<Permission> {
  const m = membershipOf(db, userId, clubId)
  if (!m || m.status !== 'approved') return new Set()
  if (m.isAdmin) return new Set(PERMISSIONS.map((p) => p.key))
  const role = m.roleId ? db.roles.find((r) => r.id === m.roleId) : undefined
  return new Set(role?.permissions ?? [])
}

export function approvedMembers(db: DB, clubId: ID): Array<{ user: User; membership: Membership }> {
  return db.memberships
    .filter((m) => m.clubId === clubId && m.status === 'approved')
    .map((membership) => ({ membership, user: userById(db, membership.userId)! }))
    .filter((x) => x.user)
    .sort((a, b) => a.user.lastname.localeCompare(b.user.lastname, 'fr'))
}

/** Statut affiché : une absence ouverte dont le créneau est passé devient « non remplacée ». */
export function absenceStatus(db: DB, a: Absence): Absence['status'] {
  if (a.status !== 'open') return a.status
  const s = db.creneaux.find((c) => c.id === a.creneauId)
  if (s && isOver(a.date, s.end)) return 'unreplaced'
  return 'open'
}

export function approvedReplacement(db: DB, absenceId: ID): Remplacement | undefined {
  return db.remplacements.find((r) => r.absenceId === absenceId && r.status === 'approved')
}

/** Diplôme valide à une date donnée ? */
export function hasValidQualification(db: DB, userId: ID, qualificationId: ID | undefined, onDate: string) {
  if (!qualificationId) return true
  return db.userQualifications.some((uq) =>
    uq.userId === userId && uq.qualificationId === qualificationId && (!uq.expiresOn || uq.expiresOn >= onDate))
}

/** Créneaux d'un éducateur un jour donné, tous clubs confondus (titulaire ou remplaçant validé), hors absences. */
export function educatorBusy(db: DB, userId: ID, date: string) {
  const day = weekday(fromISO(date))
  const own = db.creneaux.filter((c) => c.day === day && c.educatorIds.includes(userId))
    .filter((c) => !db.absences.some((a) => a.creneauId === c.id && a.date === date && a.educatorId === userId && a.status !== 'cancelled'))
  const covering = db.absences
    .filter((a) => a.date === date && a.status !== 'cancelled' && approvedReplacement(db, a.id)?.volunteerId === userId)
    .map((a) => db.creneaux.find((c) => c.id === a.creneauId))
    .filter((c): c is Creneau => !!c)
  return [...own, ...covering]
}

export type Eligibility = { ok: true } | { ok: false; reason: string }

/** Qui lit le motif : la personne elle-même (« Vous encadrez déjà… ») ou un responsable à son sujet (« Encadre déjà… »). */
export type Perspective = 'self' | 'other'

export function eligibility(db: DB, userId: ID, absence: Absence, perspective: Perspective = 'self'): Eligibility {
  const no = (self: string, other: string): Eligibility => ({ ok: false, reason: perspective === 'self' ? self : other })
  const slot = db.creneaux.find((c) => c.id === absence.creneauId)
  if (!slot) return { ok: false, reason: 'Créneau supprimé' }
  if (membershipOf(db, userId, absence.clubId)?.status !== 'approved') return no('Vous ne faites plus partie du club', 'Ne fait plus partie du club')
  if (absence.educatorId === userId) return no("C'est votre absence", "C'est son absence")
  if (slot.educatorIds.includes(userId)) return no('Vous êtes déjà sur ce créneau', 'Déjà titulaire de ce créneau')
  // Un refus explicite du responsable est définitif ; un refus parce qu'un autre volontaire a été retenu ne l'est pas.
  if (db.remplacements.some((r) => r.absenceId === absence.id && r.volunteerId === userId && r.status === 'refused' && !r.supersededBy)) {
    return no("Votre candidature n'a pas été retenue", 'A déjà été refusé·e pour ce remplacement')
  }
  const grp = db.groupes.find((g) => g.id === slot.groupeId)
  if (!hasValidQualification(db, userId, grp?.qualificationId, absence.date)) {
    const q = db.qualifications.find((x) => x.id === grp?.qualificationId)
    return { ok: false, reason: `${q?.short ?? 'Diplôme'} requis ou expiré` }
  }
  // Le créneau lui-même compte : la personne peut déjà y remplacer un autre éducateur absent ce jour-là.
  const conflict = educatorBusy(db, userId, absence.date).find((c) => overlaps(c.start, c.end, slot.start, slot.end))
  if (conflict) {
    if (conflict.id === slot.id) return no('Vous remplacez déjà un éducateur sur cette séance', 'Remplace déjà un éducateur sur cette séance')
    const at = fmtTime(conflict.start)
    // Autre club : rien sur son planning n'est dévoilé.
    if (conflict.clubId !== absence.clubId) return no(`Vous êtes déjà en séance dans un autre club à ${at}`, `Déjà en séance dans un autre club à ${at}`)
    const g = db.groupes.find((x) => x.id === conflict.groupeId)?.name ?? 'un groupe'
    return no(`Vous encadrez déjà ${g} à ${at}`, `Encadre déjà ${g} à ${at}`)
  }
  return { ok: true }
}

/** Membres du club qui peuvent se proposer pour cette absence (diplômés, libres, encore membres). */
export function eligibleVolunteers(db: DB, absence: Absence): ID[] {
  return approvedMembers(db, absence.clubId).map((x) => x.user.id).filter((id) => eligibility(db, id, absence).ok)
}

export function slotLabel(db: DB, slot: Creneau) {
  const g = db.groupes.find((x) => x.id === slot.groupeId)
  return `${g?.name ?? 'Groupe'} — ${DAYS[slot.day]} ${fmtTime(slot.start)}`
}

// ---------------------------------------------------------------- session

function requireSession(): Session {
  return getSession() ?? fail('Votre session a expiré. Reconnectez-vous.')
}

function requireUser(): User {
  const s = requireSession()
  return userById(getDB(), s.userId) ?? fail('Compte introuvable.')
}

function requireClubId(): ID {
  return requireSession().clubId ?? fail('Choisissez un club pour continuer.')
}

function requirePermission(p: Permission) {
  const s = requireSession()
  const clubId = requireClubId()
  if (!permissionsOf(getDB(), s.userId, clubId).has(p)) fail("Votre rôle ne permet pas cette action. Demandez l'accès à un administrateur du club.")
}

function requireAdmin() {
  const s = requireSession()
  const m = membershipOf(getDB(), s.userId, requireClubId())
  if (!m?.isAdmin) fail('Seuls les administrateurs du club peuvent faire cela.')
}

function notify(draft: DB, userIds: ID[], clubId: ID, text: string, href?: string) {
  const self = getSession()?.userId
  for (const userId of new Set(userIds)) {
    if (userId === self) continue
    draft.notifications.unshift({ id: uid('nt'), userId, clubId, text, href, read: false, createdAt: new Date().toISOString() })
  }
}

function managers(draft: DB, clubId: ID, p: Permission) {
  return draft.memberships.filter((m) => m.clubId === clubId && m.status === 'approved' && permissionsOf(draft, m.userId, clubId).has(p)).map((m) => m.userId)
}

/** Annule une absence dans le brouillon ; ses candidatures en cours passent à « cancelled ». Renvoie ces candidatures. */
function cancelInDraft(draft: DB, a: Absence): Remplacement[] {
  const now = new Date().toISOString()
  a.status = 'cancelled'
  const affected = draft.remplacements.filter((r) => r.absenceId === a.id && (r.status === 'pending' || r.status === 'approved'))
  for (const r of affected) { r.status = 'cancelled'; r.decidedAt = now }
  return affected
}

/**
 * Remet à pourvoir une absence dont le remplaçant validé ne vient plus (sa candidature doit déjà être close),
 * prévient la personne absente et relance les collègues éligibles. Les responsables sont prévenus par l'appelant.
 */
function reopenInDraft(draft: DB, a: Absence, formerId: ID) {
  a.status = 'open'
  const slot = draft.creneaux.find((c) => c.id === a.creneauId)
  const grp = draft.groupes.find((g) => g.id === slot?.groupeId)
  notify(draft, [a.educatorId], a.clubId, `${fullName(userById(draft, formerId))} ne pourra finalement pas vous remplacer le ${fmtShort(a.date)} : la séance est de nouveau à pourvoir.`, '/app/absences')
  notify(draft, eligibleVolunteers(draft, a).filter((id) => id !== formerId), a.clubId, `${grp?.name ?? 'Une séance'} (${fmtShort(a.date)}${slot ? `, ${fmtTime(slot.start)}` : ''}) cherche de nouveau un remplaçant.`, '/app/remplacements')
}

/** Séance encore à venir (fin non dépassée) ? */
function upcoming(db: DB, a: Absence) {
  const slot = db.creneaux.find((c) => c.id === a.creneauId)
  return !!slot && !isOver(a.date, slot.end)
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ---------------------------------------------------------------- auth

export async function login(email: string, password: string) {
  const db = getDB()
  const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
  const hash = await hashPassword(email, password)
  if (!user || user.passwordHash !== hash) fail('E-mail ou mot de passe incorrect.')
  const clubs = db.memberships.filter((m) => m.userId === user!.id && m.status === 'approved')
  setSession({ userId: user!.id, clubId: clubs.length === 1 ? clubs[0].clubId : undefined })
  return user!
}

/** Ouvre un compte de démo par son identifiant fixe (DEMO_ADMIN_ID, DEMO_EDUCATOR_ID), qui ne change pas avec l'e-mail. */
export async function loginDemo(userId: ID) {
  const db = getDB()
  const user = userById(db, userId) ?? fail('Le compte de démonstration est introuvable. Réinitialisez la démo.')
  setSession({ userId: user.id, clubId: 'c_cntr', demo: true })
  return user
}

export async function register(input: { firstname: string; lastname: string; email: string; password: string }) {
  const email = input.email.trim().toLowerCase()
  if (!input.firstname.trim() || !input.lastname.trim()) fail('Indiquez votre prénom et votre nom.')
  if (!EMAIL_RE.test(email)) fail("Cette adresse e-mail n'est pas valide.")
  if (input.password.length < 8) fail('Le mot de passe doit contenir au moins 8 caractères.')
  if (getDB().users.some((u) => u.email.toLowerCase() === email)) fail('Un compte existe déjà avec cet e-mail. Connectez-vous ou réinitialisez votre mot de passe.')
  const passwordHash = await hashPassword(email, input.password)
  const user: User = {
    id: uid('u'), firstname: input.firstname.trim(), lastname: input.lastname.trim(), email,
    passwordHash, verified: true, createdAt: new Date().toISOString(),
  }
  mutate((d) => { d.users.push(user) })
  setSession({ userId: user.id })
  return user
}

let loggedOutAt = 0
export function logout() {
  loggedOutAt = Date.now()
  setSession(null)
}
/** Vrai juste après une déconnexion volontaire : les gardes renvoient alors vers l'accueil. */
export const justLoggedOut = () => Date.now() - loggedOutAt < 3000

export function selectClub(clubId: ID) {
  const s = requireSession()
  const m = membershipOf(getDB(), s.userId, clubId)
  if (!m || m.status !== 'approved') fail("Votre adhésion à ce club n'est pas encore validée.")
  setSession({ ...s, clubId })
}

export function leaveClubSelection() {
  const s = requireSession()
  setSession({ ...s, clubId: undefined })
}

// ---------------------------------------------------------------- clubs

export function createClub(name: string, city?: string): Club {
  const user = requireUser()
  if (name.trim().length < 3) fail('Le nom du club doit contenir au moins 3 caractères.')
  if (getDB().clubs.some((c) => normalize(c.name) === normalize(name))) fail('Un club porte déjà ce nom. Ajoutez la ville pour le distinguer.')
  const now = new Date().toISOString()
  const club: Club = { id: uid('c'), name: name.trim(), city: city?.trim() || undefined, capacity: 5, subscribedAt: now, createdAt: now }
  mutate((d) => {
    d.clubs.push(club)
    d.memberships.push({ id: uid('m'), userId: user.id, clubId: club.id, status: 'approved', isAdmin: true, requestedAt: now })
  })
  setSession({ ...requireSession(), clubId: club.id })
  return club
}

export function requestJoin(clubId: ID) {
  const user = requireUser()
  const db = getDB()
  const existing = membershipOf(db, user.id, clubId)
  if (existing) fail(existing.status === 'pending' ? 'Votre demande est déjà envoyée.' : 'Vous êtes déjà membre de ce club.')
  mutate((d) => {
    d.memberships.push({ id: uid('m'), userId: user.id, clubId, status: 'pending', isAdmin: false, requestedAt: new Date().toISOString() })
    notify(d, managers(d, clubId, 'team'), clubId, `${fullName(user)} demande à rejoindre le club.`, '/app/equipe/demandes')
  })
}

export function cancelJoinRequest(clubId: ID) {
  const user = requireUser()
  mutate((d) => { d.memberships = d.memberships.filter((m) => !(m.userId === user.id && m.clubId === clubId && m.status === 'pending')) })
}

export function updateClub(patch: { name?: string; city?: string }) {
  requireAdmin()
  const clubId = requireClubId()
  if (patch.name !== undefined && patch.name.trim().length < 3) fail('Le nom du club doit contenir au moins 3 caractères.')
  mutate((d) => {
    const c = d.clubs.find((x) => x.id === clubId)!
    if (patch.name !== undefined) c.name = patch.name.trim()
    if (patch.city !== undefined) c.city = patch.city.trim() || undefined
  })
}

export function setCapacity(capacity: number) {
  requireAdmin()
  const clubId = requireClubId()
  const used = approvedMembers(getDB(), clubId).length
  if (!Number.isInteger(capacity) || capacity < 1) fail("Le nombre d'accès doit être un entier positif.")
  if (capacity < used) fail(`Votre club compte ${used} membres actifs : la limite ne peut pas descendre en dessous.`)
  mutate((d) => { d.clubs.find((c) => c.id === clubId)!.capacity = capacity })
}

// ---------------------------------------------------------------- équipe

export function decideMembership(membershipId: ID, accept: boolean) {
  requirePermission('team')
  const clubId = requireClubId()
  const db = getDB()
  const m = db.memberships.find((x) => x.id === membershipId && x.clubId === clubId) ?? fail('Demande introuvable.')
  if (accept) {
    const club = db.clubs.find((c) => c.id === clubId)!
    if (approvedMembers(db, clubId).length >= club.capacity) fail(`Le club a atteint sa limite de ${club.capacity} accès. Augmentez-la dans Abonnement pour accepter ce membre.`)
  }
  mutate((d) => {
    if (accept) {
      d.memberships.find((x) => x.id === m.id)!.status = 'approved'
      notify(d, [m.userId], clubId, `Votre adhésion à ${d.clubs.find((c) => c.id === clubId)!.name} est acceptée.`, '/app')
    } else {
      d.memberships = d.memberships.filter((x) => x.id !== m.id)
    }
  })
}

export function removeMember(userId: ID) {
  requirePermission('team')
  const clubId = requireClubId()
  const s = requireSession()
  if (userId === s.userId) fail('Vous ne pouvez pas vous retirer vous-même du club.')
  const db = getDB()
  const target = membershipOf(db, userId, clubId)
  // Retirer un administrateur demande les mêmes droits que lui retirer ce statut.
  if (target?.isAdmin) requireAdmin()
  if (target?.isAdmin && db.memberships.filter((m) => m.clubId === clubId && m.isAdmin).length <= 1) fail('Le club doit garder au moins un administrateur.')
  mutate((d) => {
    d.memberships = d.memberships.filter((m) => !(m.userId === userId && m.clubId === clubId))
    for (const c of d.creneaux) if (c.clubId === clubId) c.educatorIds = c.educatorIds.filter((id) => id !== userId)
    // Séances à venir uniquement : l'historique (et donc le relevé d'heures passé) reste intact.
    const now = new Date().toISOString()
    for (const a of d.absences) {
      if (a.clubId !== clubId || a.status === 'cancelled' || !upcoming(d, a)) continue
      if (a.educatorId === userId) {
        // Ses absences n'ont plus d'objet : les volontaires sont libérés.
        const affected = cancelInDraft(d, a)
        notify(d, affected.map((r) => r.volunteerId), clubId, `L'absence du ${fmtShort(a.date)} est annulée : votre remplacement n'est plus nécessaire.`, '/app/remplacements')
        continue
      }
      // Ses candidatures en cours sont retirées ; une séance qu'il ou elle devait assurer redevient à pourvoir.
      for (const r of d.remplacements) {
        if (r.absenceId !== a.id || r.volunteerId !== userId || (r.status !== 'pending' && r.status !== 'approved')) continue
        const wasApproved = r.status === 'approved'
        r.status = 'withdrawn'; r.decidedAt = now
        if (wasApproved) {
          reopenInDraft(d, a, userId)
          const grp = d.groupes.find((g) => g.id === d.creneaux.find((c) => c.id === a.creneauId)?.groupeId)
          notify(d, managers(d, clubId, 'replacements').filter((id) => id !== a.educatorId), clubId, `${fullName(userById(d, userId))} ne fait plus partie du club : ${grp?.name ?? 'la séance'} du ${fmtShort(a.date)} est de nouveau à pourvoir.`, '/app/remplacements')
        }
      }
    }
  })
}

export function setMemberRole(userId: ID, roleId: ID | undefined) {
  requirePermission('roles')
  const clubId = requireClubId()
  mutate((d) => {
    const m = d.memberships.find((x) => x.userId === userId && x.clubId === clubId) ?? fail('Membre introuvable.')
    m.roleId = roleId || undefined
  })
}

export function setMemberAdmin(userId: ID, isAdmin: boolean) {
  requireAdmin()
  const clubId = requireClubId()
  const db = getDB()
  if (!isAdmin && db.memberships.filter((m) => m.clubId === clubId && m.isAdmin).length <= 1) fail('Le club doit garder au moins un administrateur.')
  mutate((d) => { d.memberships.find((x) => x.userId === userId && x.clubId === clubId)!.isAdmin = isAdmin })
}

export function saveRole(input: { id?: ID; name: string; permissions: Permission[] }): Role {
  requirePermission('roles')
  const clubId = requireClubId()
  if (!input.name.trim()) fail('Donnez un nom au rôle.')
  if (getDB().roles.some((r) => r.clubId === clubId && r.id !== input.id && normalize(r.name) === normalize(input.name))) fail('Un rôle porte déjà ce nom.')
  return mutate((d) => {
    if (input.id) {
      const r = d.roles.find((x) => x.id === input.id)!
      r.name = input.name.trim()
      r.permissions = input.permissions
      return r
    }
    const r: Role = { id: uid('r'), clubId, name: input.name.trim(), permissions: input.permissions }
    d.roles.push(r)
    return r
  })
}

export function deleteRole(id: ID) {
  requirePermission('roles')
  mutate((d) => {
    d.roles = d.roles.filter((r) => r.id !== id)
    for (const m of d.memberships) if (m.roleId === id) m.roleId = undefined
  })
}

// ---------------------------------------------------------------- diplômes

export function saveQualification(input: { id?: ID; short: string; label: string; validityMonths?: number }): Qualification {
  requirePermission('team')
  if (!input.short.trim()) fail("Indiquez l'abréviation du diplôme (ex. BNSSA).")
  if (getDB().qualifications.some((q) => q.id !== input.id && normalize(q.short) === normalize(input.short))) fail('Ce diplôme existe déjà dans le catalogue.')
  return mutate((d) => {
    if (input.id) {
      const q = d.qualifications.find((x) => x.id === input.id)!
      Object.assign(q, { short: input.short.trim(), label: input.label.trim(), validityMonths: input.validityMonths || undefined })
      return q
    }
    const q: Qualification = { id: uid('q'), short: input.short.trim(), label: input.label.trim(), validityMonths: input.validityMonths || undefined }
    d.qualifications.push(q)
    return q
  })
}

export function deleteQualification(id: ID) {
  requirePermission('team')
  mutate((d) => {
    d.qualifications = d.qualifications.filter((q) => q.id !== id)
    d.userQualifications = d.userQualifications.filter((uq) => uq.qualificationId !== id)
    for (const g of d.groupes) if (g.qualificationId === id) g.qualificationId = undefined
  })
}

export function grantQualification(userId: ID, qualificationId: ID, expiresOn?: string) {
  requirePermission('team')
  if (!qualificationId) fail('Choisissez un diplôme.')
  mutate((d) => {
    const existing = d.userQualifications.find((x) => x.userId === userId && x.qualificationId === qualificationId)
    if (existing) existing.expiresOn = expiresOn || undefined
    else d.userQualifications.push({ id: uid('uq'), userId, qualificationId, expiresOn: expiresOn || undefined })
  })
}

export function revokeQualification(userQualificationId: ID) {
  requirePermission('team')
  mutate((d) => { d.userQualifications = d.userQualifications.filter((x) => x.id !== userQualificationId) })
}

// ---------------------------------------------------------------- planning

export function savePiscine(input: { id?: ID; name: string; address?: string; lanes?: number }): Piscine {
  requirePermission('planning')
  const clubId = requireClubId()
  if (!input.name.trim()) fail('Donnez un nom à la piscine.')
  return mutate((d) => {
    if (input.id) {
      const p = d.piscines.find((x) => x.id === input.id)!
      Object.assign(p, { name: input.name.trim(), address: input.address?.trim() || undefined, lanes: input.lanes || undefined })
      return p
    }
    const p: Piscine = { id: uid('p'), clubId, name: input.name.trim(), address: input.address?.trim() || undefined, lanes: input.lanes || undefined }
    d.piscines.push(p)
    return p
  })
}

export function deletePiscine(id: ID) {
  requirePermission('planning')
  mutate((d) => {
    const groupIds = new Set(d.groupes.filter((g) => g.piscineId === id).map((g) => g.id))
    const slotIds = new Set(d.creneaux.filter((c) => c.piscineId === id || groupIds.has(c.groupeId)).map((c) => c.id))
    cascadeSlots(d, slotIds)
    d.groupes = d.groupes.filter((g) => !groupIds.has(g.id))
    d.piscines = d.piscines.filter((p) => p.id !== id)
  })
}

export function saveNiveau(input: { id?: ID; name: string; color?: string }): Niveau {
  requirePermission('planning')
  const clubId = requireClubId()
  if (!input.name.trim()) fail('Donnez un nom au niveau.')
  const db = getDB()
  if (db.niveaux.some((n) => n.clubId === clubId && n.id !== input.id && normalize(n.name) === normalize(input.name))) fail('Ce niveau existe déjà.')
  return mutate((d) => {
    if (input.id) {
      const n = d.niveaux.find((x) => x.id === input.id)!
      n.name = input.name.trim()
      if (input.color) n.color = input.color
      return n
    }
    const used = d.niveaux.filter((n) => n.clubId === clubId).length
    const n: Niveau = { id: uid('n'), clubId, name: input.name.trim(), color: input.color ?? LEVEL_COLORS[used % LEVEL_COLORS.length] }
    d.niveaux.push(n)
    return n
  })
}

export function deleteNiveau(id: ID) {
  requirePermission('planning')
  mutate((d) => {
    d.niveaux = d.niveaux.filter((n) => n.id !== id)
    for (const g of d.groupes) if (g.niveauId === id) g.niveauId = undefined
  })
}

export function saveGroupe(input: { id?: ID; name: string; piscineId: ID; niveauId?: ID; qualificationId?: ID }): Groupe {
  requirePermission('planning')
  const clubId = requireClubId()
  if (!input.name.trim()) fail('Donnez un nom au groupe.')
  if (!input.piscineId) fail('Choisissez la piscine du groupe.')
  return mutate((d) => {
    const data = { name: input.name.trim(), piscineId: input.piscineId, niveauId: input.niveauId || undefined, qualificationId: input.qualificationId || undefined }
    if (input.id) {
      const g = d.groupes.find((x) => x.id === input.id)!
      Object.assign(g, data)
      for (const c of d.creneaux) if (c.groupeId === g.id) c.piscineId = g.piscineId
      return g
    }
    const g: Groupe = { id: uid('g'), clubId, ...data }
    d.groupes.push(g)
    return g
  })
}

export function deleteGroupe(id: ID) {
  requirePermission('planning')
  mutate((d) => {
    cascadeSlots(d, new Set(d.creneaux.filter((c) => c.groupeId === id).map((c) => c.id)))
    d.groupes = d.groupes.filter((g) => g.id !== id)
  })
}

function cascadeSlots(d: DB, slotIds: Set<ID>) {
  const absIds = new Set(d.absences.filter((a) => slotIds.has(a.creneauId)).map((a) => a.id))
  d.remplacements = d.remplacements.filter((r) => !absIds.has(r.absenceId))
  d.absences = d.absences.filter((a) => !absIds.has(a.id))
  d.creneaux = d.creneaux.filter((c) => !slotIds.has(c.id))
}

export interface SlotInput {
  id?: ID
  groupeId: ID
  day: Weekday
  start: string
  end: string
  ligne?: string
  educatorIds: ID[]
}

/** Conflits d'un créneau : éducateurs déjà occupés au même moment (dans ce club ou un autre). */
export function slotConflicts(db: DB, clubId: ID, input: SlotInput): string[] {
  const out: string[] = []
  for (const userId of new Set(input.educatorIds)) {
    const clash = db.creneaux.find((c) => c.id !== input.id && c.day === input.day && c.educatorIds.includes(userId) && overlaps(c.start, c.end, input.start, input.end))
    if (!clash) continue
    if (clash.clubId !== clubId) {
      // Planning d'un autre club : on n'en dévoile rien.
      out.push(`${fullName(userById(db, userId))} est déjà en séance dans un autre club à cette heure-là.`)
      continue
    }
    const g = db.groupes.find((x) => x.id === clash.groupeId)
    out.push(`${fullName(userById(db, userId))} encadre déjà ${g?.name ?? 'un groupe'} (${fmtTime(clash.start)}–${fmtTime(clash.end)}).`)
  }
  return out
}

/**
 * Absences à venir qu'une modification du créneau rend caduques : jour changé, ou éducateur absent retiré du créneau.
 * `saveCreneau` les annule ; l'écran peut s'en servir pour prévenir avant d'enregistrer.
 */
export function staleAbsences(db: DB, input: Pick<SlotInput, 'id' | 'day' | 'educatorIds'>): Absence[] {
  const prev = input.id ? db.creneaux.find((c) => c.id === input.id) : undefined
  if (!prev) return []
  return db.absences.filter((a) => a.creneauId === prev.id && a.status !== 'cancelled' && !isOver(a.date, prev.end)
    && (weekday(fromISO(a.date)) !== input.day || !input.educatorIds.includes(a.educatorId)))
}

export function saveCreneau(input: SlotInput): Creneau {
  requirePermission('planning')
  const clubId = requireClubId()
  const db = getDB()
  // Tout est limité au club courant : un formulaire resté ouvert après un changement de club ne peut rien écrire ailleurs.
  const grp = db.groupes.find((g) => g.id === input.groupeId && g.clubId === clubId) ?? fail('Choisissez un groupe.')
  if (input.id && !db.creneaux.some((c) => c.id === input.id && c.clubId === clubId)) fail('Créneau introuvable.')
  const educatorIds = [...new Set(input.educatorIds)]
  if (educatorIds.some((id) => membershipOf(db, id, clubId)?.status !== 'approved')) fail("Un des éducateurs choisis ne fait plus partie du club. Rouvrez le formulaire et vérifiez la liste.")
  if (!/^\d{2}:\d{2}$/.test(input.start) || !/^\d{2}:\d{2}$/.test(input.end)) fail('Indiquez une heure de début et de fin.')
  if (minutes(input.end) <= minutes(input.start)) fail("L'heure de fin doit être après l'heure de début.")
  const conflicts = slotConflicts(db, clubId, input)
  if (conflicts.length) fail(conflicts.join(' '))
  return mutate((d) => {
    const data = { groupeId: grp.id, piscineId: grp.piscineId, day: input.day, start: input.start, end: input.end, ligne: input.ligne?.trim() || undefined, educatorIds }
    if (input.id) {
      const c = d.creneaux.find((x) => x.id === input.id)!
      const added = data.educatorIds.filter((x) => !c.educatorIds.includes(x))
      const prevName = d.groupes.find((g) => g.id === c.groupeId)?.name ?? grp.name
      // À calculer avant la modification (heure de fin d'origine).
      const stale = staleAbsences(d, { id: c.id, day: data.day, educatorIds: data.educatorIds })
      Object.assign(c, data)
      for (const a of stale) {
        const affected = cancelInDraft(d, a)
        notify(d, [a.educatorId], clubId, `Le créneau ${prevName} a été modifié : votre absence du ${fmtShort(a.date)} est annulée.`, '/app/absences')
        notify(d, affected.map((r) => r.volunteerId), clubId, `Le créneau ${prevName} a été modifié : le remplacement du ${fmtShort(a.date)} n'est plus nécessaire.`, '/app/remplacements')
      }
      notify(d, added, clubId, `Vous êtes ajouté·e sur ${grp.name}, ${DAYS[c.day].toLowerCase()} ${fmtTime(c.start)}.`, '/app/planning')
      return c
    }
    const c: Creneau = { id: uid('s'), clubId, ...data }
    d.creneaux.push(c)
    notify(d, c.educatorIds, clubId, `Nouveau créneau : ${grp.name}, ${DAYS[c.day].toLowerCase()} ${fmtTime(c.start)}.`, '/app/planning')
    return c
  })
}

export function deleteCreneau(id: ID) {
  requirePermission('planning')
  mutate((d) => cascadeSlots(d, new Set([id])))
}

// ---------------------------------------------------------------- absences

export function declareAbsence(creneauId: ID, date: string, reason?: string): Absence {
  const user = requireUser()
  const clubId = requireClubId()
  const db = getDB()
  const slot = db.creneaux.find((c) => c.id === creneauId && c.clubId === clubId) ?? fail('Choisissez un de vos créneaux.')
  if (!slot.educatorIds.includes(user.id)) fail("Vous n'êtes pas titulaire de ce créneau.")
  if (!date) fail('Choisissez la date de la séance.')
  if (weekday(fromISO(date)) !== slot.day) fail(`Ce créneau a lieu le ${DAYS[slot.day].toLowerCase()} : choisissez une date correspondante.`)
  if (isOver(date, slot.end)) fail('Cette séance est déjà passée.')
  if (db.absences.some((a) => a.creneauId === slot.id && a.date === date && a.educatorId === user.id && a.status !== 'cancelled')) fail('Vous avez déjà déclaré cette absence.')
  const grp = db.groupes.find((g) => g.id === slot.groupeId)
  return mutate((d) => {
    const a: Absence = { id: uid('a'), clubId, creneauId: slot.id, educatorId: user.id, date, reason: reason?.trim() || undefined, status: 'open', createdAt: new Date().toISOString() }
    d.absences.push(a)
    notify(d, eligibleVolunteers(d, a), clubId, `${grp?.name} (${fmtShort(date)}, ${fmtTime(slot.start)}) cherche un remplaçant.`, '/app/remplacements')
    notify(d, managers(d, clubId, 'replacements'), clubId, `${fullName(user)} sera absent·e : ${grp?.name}, ${fmtShort(date)}.`, '/app/remplacements')
    return a
  })
}

/**
 * Annule une absence : la personne absente (même si un remplaçant est déjà validé) ou un membre ayant la permission
 * « replacements ». Les volontaires, y compris le remplaçant validé, sont libérés et prévenus.
 */
export function cancelAbsence(absenceId: ID) {
  const user = requireUser()
  const db = getDB()
  const a = db.absences.find((x) => x.id === absenceId) ?? fail('Absence introuvable.')
  const own = a.educatorId === user.id
  if (!own && !permissionsOf(db, user.id, a.clubId).has('replacements')) fail('Seul·e la personne absente ou un responsable peut annuler cette absence.')
  if (a.status === 'cancelled') fail('Cette absence est déjà annulée.')
  if (!upcoming(db, a)) fail('Cette séance est déjà passée.')
  const grp = db.groupes.find((g) => g.id === db.creneaux.find((c) => c.id === a.creneauId)?.groupeId)
  const absent = userById(db, a.educatorId)
  mutate((d) => {
    const x = d.absences.find((y) => y.id === absenceId)!
    const affected = cancelInDraft(d, x)
    notify(d, affected.map((r) => r.volunteerId), x.clubId, `L'absence du ${fmtShort(x.date)} (${grp?.name}) est annulée : votre remplacement n'est plus nécessaire.`, '/app/remplacements')
    if (!own) notify(d, [x.educatorId], x.clubId, `${fullName(user)} a annulé votre absence du ${fmtShort(x.date)} (${grp?.name}) : vous assurez la séance.`, '/app/absences')
    notify(d, managers(d, x.clubId, 'replacements').filter((id) => id !== x.educatorId), x.clubId, `${fullName(absent)} assurera finalement ${grp?.name} le ${fmtShort(x.date)}.`, '/app/remplacements')
  })
}

// ---------------------------------------------------------------- remplacements

export function volunteer(absenceId: ID) {
  const user = requireUser()
  const db = getDB()
  const a = db.absences.find((x) => x.id === absenceId) ?? fail('Absence introuvable.')
  if (absenceStatus(db, a) !== 'open') fail("Ce créneau n'est plus à pourvoir.")
  const e = eligibility(db, user.id, a)
  if (!e.ok) fail(e.reason)
  if (db.remplacements.some((r) => r.absenceId === absenceId && r.volunteerId === user.id && r.status === 'pending')) fail('Votre candidature est déjà envoyée.')
  const slot = db.creneaux.find((c) => c.id === a.creneauId)!
  const grp = db.groupes.find((g) => g.id === slot.groupeId)
  mutate((d) => {
    d.remplacements.push({ id: uid('rp'), absenceId, volunteerId: user.id, status: 'pending', createdAt: new Date().toISOString() })
    notify(d, managers(d, a.clubId, 'replacements'), a.clubId, `${fullName(user)} se propose pour ${grp?.name} (${fmtShort(a.date)}).`, '/app/remplacements')
  })
}

/** Retire sa candidature (en attente, même après la séance) ou se désiste d'un remplacement validé à venir. */
export function withdraw(remplacementId: ID) {
  const user = requireUser()
  const db = getDB()
  const r = db.remplacements.find((x) => x.id === remplacementId && x.volunteerId === user.id) ?? fail('Candidature introuvable.')
  if (r.status !== 'pending' && r.status !== 'approved') fail('Cette candidature est déjà close.')
  const a = db.absences.find((x) => x.id === r.absenceId) ?? fail('Absence introuvable.')
  if (r.status === 'approved' && !upcoming(db, a)) fail('Cette séance est déjà passée.')
  mutate((d) => {
    const x = d.remplacements.find((y) => y.id === remplacementId)!
    const wasApproved = x.status === 'approved'
    x.status = 'withdrawn'
    x.decidedAt = new Date().toISOString()
    if (wasApproved) {
      const abs = d.absences.find((y) => y.id === x.absenceId)!
      reopenInDraft(d, abs, user.id)
      notify(d, managers(d, abs.clubId, 'replacements').filter((id) => id !== abs.educatorId), abs.clubId, `${fullName(user)} se désiste d'un remplacement validé (${fmtShort(abs.date)}).`, '/app/remplacements')
    }
  })
}

export function decideReplacement(remplacementId: ID, approve: boolean) {
  requirePermission('replacements')
  const clubId = requireClubId()
  const db = getDB()
  const r = db.remplacements.find((x) => x.id === remplacementId) ?? fail('Candidature introuvable.')
  const a = db.absences.find((x) => x.id === r.absenceId && x.clubId === clubId) ?? fail('Candidature introuvable.')
  if (r.status !== 'pending') fail('Cette candidature a déjà été traitée.')
  if (approve) {
    if (absenceStatus(db, a) !== 'open') fail("Ce créneau n'est plus à pourvoir.")
    const e = eligibility(db, r.volunteerId, a, 'other')
    if (!e.ok) fail(`Impossible de valider ${fullName(userById(db, r.volunteerId))}. ${e.reason}.`)
  }
  const slot = db.creneaux.find((c) => c.id === a.creneauId)!
  const grp = db.groupes.find((g) => g.id === slot.groupeId)
  mutate((d) => {
    const now = new Date().toISOString()
    const target = d.remplacements.find((x) => x.id === remplacementId)!
    target.status = approve ? 'approved' : 'refused'
    target.decidedAt = now
    if (approve) {
      d.absences.find((x) => x.id === a.id)!.status = 'replaced'
      const others = d.remplacements.filter((x) => x.absenceId === a.id && x.id !== remplacementId && x.status === 'pending')
      // Refus « par défaut » : ces volontaires pourront se reproposer si le remplaçant retenu se désiste.
      for (const o of others) { o.status = 'refused'; o.decidedAt = now; o.supersededBy = remplacementId }
      notify(d, [target.volunteerId], a.clubId, `Remplacement validé : ${grp?.name}, ${fmtShort(a.date)} à ${fmtTime(slot.start)}.`, '/app/planning')
      notify(d, others.map((o) => o.volunteerId), a.clubId, `Un autre remplaçant a été retenu pour ${grp?.name} (${fmtShort(a.date)}).`, '/app/remplacements')
      notify(d, [a.educatorId], a.clubId, `${fullName(userById(d, target.volunteerId))} vous remplace le ${fmtShort(a.date)}.`, '/app/absences')
    } else {
      notify(d, [target.volunteerId], a.clubId, `Candidature non retenue : ${grp?.name}, ${fmtShort(a.date)}.`, '/app/remplacements')
    }
  })
}

// ---------------------------------------------------------------- rapports

export interface HoursRow {
  user: User
  planned: number
  absent: number
  replacing: number
  effective: number
  sessions: number
}

/** Décompte mensuel : heures prévues − absences + remplacements effectués. */
export function hoursReport(db: DB, clubId: ID, year: number, month: number): HoursRow[] {
  // Cumul en minutes entières, converti en heures à la fin : pas de dérive des flottants (40 min = 0,666…).
  const rows = new Map<ID, HoursRow>()
  for (const { user } of approvedMembers(db, clubId)) rows.set(user.id, { user, planned: 0, absent: 0, replacing: 0, effective: 0, sessions: 0 })
  const slots = db.creneaux.filter((c) => c.clubId === clubId)
  const length = (s: Creneau) => Math.max(0, minutes(s.end) - minutes(s.start))
  for (const s of slots) {
    const occurrences = datesOfWeekdayInMonth(year, month, s.day).length
    for (const id of s.educatorIds) {
      const r = rows.get(id)
      if (!r) continue
      r.planned += occurrences * length(s)
      r.sessions += occurrences
    }
  }
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`
  for (const a of db.absences) {
    if (a.clubId !== clubId || !a.date.startsWith(prefix) || a.status === 'cancelled') continue
    const s = slots.find((c) => c.id === a.creneauId)
    if (!s) continue
    const m = length(s)
    // On ne retire que des heures comptées dans le prévu : encore titulaire, et la date tombe le jour du créneau.
    const absentRow = rows.get(a.educatorId)
    if (absentRow && s.educatorIds.includes(a.educatorId) && weekday(fromISO(a.date)) === s.day) absentRow.absent += m
    // Un remplacement validé reste crédité, même si le créneau a changé depuis.
    const rp = approvedReplacement(db, a.id)
    const repRow = rp && rows.get(rp.volunteerId)
    if (repRow) repRow.replacing += m
  }
  for (const r of rows.values()) {
    r.effective = (r.planned - r.absent + r.replacing) / 60
    r.planned /= 60
    r.absent /= 60
    r.replacing /= 60
  }
  return [...rows.values()].sort((a, b) => b.effective - a.effective)
}

// ---------------------------------------------------------------- import

export interface ImportReport {
  created: { piscines: number; groupes: number; niveaux: number; creneaux: number }
  skipped: Array<{ line: number; reason: string }>
}

export const IMPORT_COLUMNS = ['Piscine', 'Groupe', 'Niveau', 'Jour', 'Début', 'Fin', 'Ligne', 'E-mails éducateurs'] as const

const DAY_ALIASES: Record<string, Weekday> = {
  lundi: 0, lun: 0, mardi: 1, mar: 1, mercredi: 2, mer: 2, jeudi: 3, jeu: 3, vendredi: 4, ven: 4, samedi: 5, sam: 5, dimanche: 6, dim: 6,
}

/** « 17 », « 17h », « 17h30 », « 17.30 », « 17:30 », « 17:30:00 » (Sheets, LibreOffice) → « 17:30 ». */
function parseTime(v: string): string | null {
  const m = v.trim().toLowerCase().replace(/\s/g, '').match(/^(\d{1,2})(?:[:h.](\d{2})(?::\d{2})?|[:h])?$/)
  if (!m) return null
  const h = Number(m[1]); const min = Number(m[2] ?? 0)
  if (h > 23 || min > 59) return null
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}

/**
 * Importe des créneaux. Passez de préférence les lignes de `parseRows` : les numéros de ligne du rapport
 * suivent alors le tableur, lignes vides comprises. Avec un simple `string[][]`, ils suivent la position.
 */
export function importSchedule(rows: Array<string[] | TableRow>): ImportReport {
  requirePermission('planning')
  const clubId = requireClubId()
  const report: ImportReport = { created: { piscines: 0, groupes: 0, niveaux: 0, creneaux: 0 }, skipped: [] }
  const records: TableRow[] = rows.map((r, i) => (Array.isArray(r) ? { line: i + 1, cells: r } : r))
  const header = records[0]?.cells.map((h) => normalize(h)) ?? []
  const hasHeader = header.includes('piscine') || header.includes('groupe')
  const body = hasHeader ? records.slice(1) : records
  mutate((d) => {
    const members = approvedMembers(d, clubId)
    body.forEach(({ line, cells }) => {
      const [piscineName = '', groupeName = '', niveauName = '', jour = '', debut = '', fin = '', ligne = '', emails = ''] = cells
      if (!piscineName || !groupeName) return report.skipped.push({ line, reason: 'Piscine ou groupe manquant' })
      const day = DAY_ALIASES[normalize(jour).replace('.', '')]
      if (day === undefined) return report.skipped.push({ line, reason: `Jour « ${jour} » non reconnu` })
      const start = parseTime(debut); const end = parseTime(fin)
      if (!start || !end || minutes(end) <= minutes(start)) return report.skipped.push({ line, reason: `Horaires « ${debut} – ${fin} » invalides` })
      const educatorIds: ID[] = []
      for (const email of emails.split(/[,\s]+/).filter(Boolean)) {
        const found = members.find((x) => x.user.email.toLowerCase() === email.toLowerCase())
        if (!found) return report.skipped.push({ line, reason: `${email} n'est pas membre du club` })
        if (!educatorIds.includes(found.user.id)) educatorIds.push(found.user.id)
      }
      // Tous les contrôles avant toute création : une ligne refusée ne laisse ni piscine, ni niveau, ni groupe vide.
      const existingPool = d.piscines.find((x) => x.clubId === clubId && normalize(x.name) === normalize(piscineName))
      const existingGroup = existingPool && d.groupes.find((x) => x.clubId === clubId && x.piscineId === existingPool.id && normalize(x.name) === normalize(groupeName))
      if (existingGroup && d.creneaux.some((c) => c.clubId === clubId && c.groupeId === existingGroup.id && c.day === day && c.start === start)) return report.skipped.push({ line, reason: 'Créneau déjà présent' })
      const conflicts = slotConflicts(d, clubId, { groupeId: existingGroup?.id ?? '', day, start, end, ligne, educatorIds })
      if (conflicts.length) return report.skipped.push({ line, reason: conflicts[0] })
      let p = existingPool
      if (!p) { p = { id: uid('p'), clubId, name: piscineName }; d.piscines.push(p); report.created.piscines++ }
      let n: Niveau | undefined
      // Le niveau ne sert qu'à un groupe créé ici.
      if (niveauName && !existingGroup) {
        n = d.niveaux.find((x) => x.clubId === clubId && normalize(x.name) === normalize(niveauName))
        if (!n) {
          const used = d.niveaux.filter((x) => x.clubId === clubId).length
          n = { id: uid('n'), clubId, name: niveauName, color: LEVEL_COLORS[used % LEVEL_COLORS.length] }
          d.niveaux.push(n); report.created.niveaux++
        }
      }
      let g = existingGroup
      if (!g) { g = { id: uid('g'), clubId, piscineId: p.id, niveauId: n?.id, name: groupeName }; d.groupes.push(g); report.created.groupes++ }
      d.creneaux.push({ id: uid('s'), clubId, piscineId: p.id, groupeId: g.id, day, start, end, ligne: ligne || undefined, educatorIds })
      report.created.creneaux++
    })
  })
  return report
}

// ---------------------------------------------------------------- compte & support

export function updateProfile(patch: { firstname: string; lastname: string; phone?: string }) {
  const user = requireUser()
  if (!patch.firstname.trim() || !patch.lastname.trim()) fail('Le prénom et le nom sont obligatoires.')
  mutate((d) => {
    const u = d.users.find((x) => x.id === user.id)!
    u.firstname = patch.firstname.trim(); u.lastname = patch.lastname.trim(); u.phone = patch.phone?.trim() || undefined
  })
}

export async function changeEmail(newEmail: string, currentPassword: string) {
  const user = requireUser()
  const email = newEmail.trim().toLowerCase()
  if (!EMAIL_RE.test(email)) fail("Cette adresse e-mail n'est pas valide.")
  if ((await hashPassword(user.email, currentPassword)) !== user.passwordHash) fail('Mot de passe actuel incorrect.')
  if (getDB().users.some((u) => u.id !== user.id && u.email === email)) fail('Cette adresse est déjà utilisée par un autre compte.')
  const passwordHash = await hashPassword(email, currentPassword)
  mutate((d) => { const u = d.users.find((x) => x.id === user.id)!; u.email = email; u.passwordHash = passwordHash })
}

export async function changePassword(current: string, next: string) {
  const user = requireUser()
  if ((await hashPassword(user.email, current)) !== user.passwordHash) fail('Mot de passe actuel incorrect.')
  if (next.length < 8) fail('Le nouveau mot de passe doit contenir au moins 8 caractères.')
  const passwordHash = await hashPassword(user.email, next)
  mutate((d) => { d.users.find((x) => x.id === user.id)!.passwordHash = passwordHash })
}

export function createTicket(subject: string, message: string) {
  const user = requireUser()
  if (subject.trim().length < 4) fail('Précisez le sujet en quelques mots.')
  if (message.trim().length < 10) fail('Décrivez la demande en une ou deux phrases.')
  mutate((d) => {
    d.tickets.unshift({ id: uid('t'), clubId: getSession()?.clubId, userId: user.id, subject: subject.trim(), message: message.trim(), status: 'open', createdAt: new Date().toISOString() })
  })
}

export function markNotificationsRead(ids: ID[]) {
  mutate((d) => { for (const n of d.notifications) if (ids.includes(n.id)) n.read = true })
}

export const todayKey = () => toISO(today())
