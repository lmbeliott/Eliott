// Modèle de données — calqué sur l'API d'origine (swimhub-api) pour pouvoir
// brancher un backend réel sans toucher aux écrans.

export type ID = string

export interface User {
  id: ID
  firstname: string
  lastname: string
  email: string
  passwordHash: string
  verified: boolean
  phone?: string
  createdAt: string
}

export type Permission = 'planning' | 'replacements' | 'team' | 'roles' | 'reports'

export interface Club {
  id: ID
  name: string
  city?: string
  /** Nombre d'accès (sièges) souscrits */
  capacity: number
  /** Date de début d'abonnement (ISO) — sert au calcul de la période promo */
  subscribedAt: string
  createdAt: string
}

export type MembershipStatus = 'pending' | 'approved'

export interface Membership {
  id: ID
  userId: ID
  clubId: ID
  status: MembershipStatus
  isAdmin: boolean
  roleId?: ID
  requestedAt: string
}

export interface Role {
  id: ID
  clubId: ID
  name: string
  permissions: Permission[]
}

export interface Piscine {
  id: ID
  clubId: ID
  name: string
  address?: string
  lanes?: number
}

export interface Niveau {
  id: ID
  clubId: ID
  name: string
  color: string
}

export interface Groupe {
  id: ID
  clubId: ID
  piscineId: ID
  niveauId?: ID
  name: string
  /** Diplôme requis pour encadrer (et donc remplacer) ce groupe */
  qualificationId?: ID
}

/** 0 = lundi … 6 = dimanche */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface Creneau {
  id: ID
  clubId: ID
  piscineId: ID
  groupeId: ID
  day: Weekday
  start: string // "HH:MM"
  end: string // "HH:MM"
  ligne?: string
  educatorIds: ID[]
}

export interface Qualification {
  id: ID
  short: string
  label: string
  /** Durée de validité avant recyclage, en mois (indicatif) */
  validityMonths?: number
}

export interface UserQualification {
  id: ID
  userId: ID
  qualificationId: ID
  /** Date de péremption / recyclage (ISO yyyy-mm-dd) */
  expiresOn?: string
}

export type AbsenceStatus = 'open' | 'replaced' | 'unreplaced' | 'cancelled'

export interface Absence {
  id: ID
  clubId: ID
  creneauId: ID
  educatorId: ID
  date: string // yyyy-mm-dd
  reason?: string
  status: AbsenceStatus
  createdAt: string
}

export type ReplacementStatus = 'pending' | 'approved' | 'refused' | 'withdrawn'

export interface Remplacement {
  id: ID
  absenceId: ID
  volunteerId: ID
  status: ReplacementStatus
  createdAt: string
  decidedAt?: string
}

export type TicketStatus = 'open' | 'resolved'

export interface Ticket {
  id: ID
  clubId?: ID
  userId: ID
  subject: string
  message: string
  status: TicketStatus
  createdAt: string
}

export interface Notification {
  id: ID
  userId: ID
  clubId: ID
  text: string
  href?: string
  read: boolean
  createdAt: string
}

export interface DB {
  version: number
  users: User[]
  clubs: Club[]
  memberships: Membership[]
  roles: Role[]
  piscines: Piscine[]
  niveaux: Niveau[]
  groupes: Groupe[]
  creneaux: Creneau[]
  qualifications: Qualification[]
  userQualifications: UserQualification[]
  absences: Absence[]
  remplacements: Remplacement[]
  tickets: Ticket[]
  notifications: Notification[]
}

export interface Session {
  userId: ID
  clubId?: ID
  demo?: boolean
}
