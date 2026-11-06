import type { Absence, Creneau, DB, Groupe, Membership, Niveau, Piscine, Qualification, User, UserQualification, Weekday } from './types'
import { addDays, startOfWeek, today, toISO, weekday } from '../lib/dates'
import { sha256 } from '../lib/util'

export const SEED_VERSION = 4
export const DEMO_PASSWORD = 'demo1234'
export const DEMO_ADMIN_EMAIL = 'camille.martin@demo.swimhub.fr'
export const DEMO_EDUCATOR_EMAIL = 'lea.bernard@demo.swimhub.fr'

export const LEVEL_COLORS = ['#7a5ae0', '#0e9c8e', '#2f6fdb', '#e07a1f', '#d2478e', '#6f8f1e', '#0b8fb3', '#8a5a2b']

export function hashPassword(email: string, password: string) {
  return sha256(`${email.trim().toLowerCase()}:${password}`)
}

/** Données de démonstration, datées par rapport à aujourd'hui pour rester « vivantes ». */
export async function createSeed(): Promise<DB> {
  const now = new Date().toISOString()
  const t = today()
  const monday = startOfWeek(t)
  const iso = (d: Date) => toISO(d)
  const monthsFromNow = (m: number, extraDays = 0) => {
    const d = new Date(t)
    d.setMonth(d.getMonth() + m)
    return iso(addDays(d, extraDays))
  }
  /** Prochaine occurrence (strictement après aujourd'hui) d'un jour de semaine, + n semaines. */
  const next = (day: Weekday, weeks = 0) => {
    const delta = ((day - weekday(t) + 7) % 7) || 7
    return iso(addDays(t, delta + weeks * 7))
  }
  /** Occurrence d'un jour dans la semaine passée (n semaines en arrière). */
  const past = (day: Weekday, weeksBack = 1) => iso(addDays(monday, day - weeksBack * 7))

  const people: Array<[string, string, string]> = [
    ['camille', 'Camille', 'Martin'],
    ['lea', 'Léa', 'Bernard'],
    ['hugo', 'Hugo', 'Petit'],
    ['ines', 'Inès', 'Moreau'],
    ['theo', 'Théo', 'Laurent'],
    ['manon', 'Manon', 'Girard'],
    ['yanis', 'Yanis', 'Roux'],
    ['chloe', 'Chloé', 'Fournier'],
    ['sami', 'Sami', 'Benali'],
    ['julie', 'Julie', 'Lefèvre'],
  ]
  const users: User[] = await Promise.all(
    people.map(async ([key, firstname, lastname]) => {
      const email = `${key}.${lastname.toLowerCase().replace('è', 'e')}@demo.swimhub.fr`
      return {
        id: `u_${key}`,
        firstname,
        lastname,
        email,
        passwordHash: await hashPassword(email, DEMO_PASSWORD),
        verified: true,
        createdAt: now,
      }
    }),
  )

  const subscribed = new Date(t)
  subscribed.setMonth(subscribed.getMonth() - 8)

  const clubs = [
    { id: 'c_cntr', name: 'Club Nautique des Trois Rivières', city: 'Villeurbanne', capacity: 12, subscribedAt: subscribed.toISOString(), createdAt: subscribed.toISOString() },
    { id: 'c_villeneuve', name: 'Aqua Club de Villeneuve', city: 'Villeneuve', capacity: 5, subscribedAt: addDays(t, -40).toISOString(), createdAt: addDays(t, -40).toISOString() },
  ]

  const roles = [
    { id: 'r_coord', clubId: 'c_cntr', name: 'Coordination bassin', permissions: ['planning', 'replacements'] as const },
    { id: 'r_secretariat', clubId: 'c_cntr', name: 'Secrétariat', permissions: ['team', 'reports'] as const },
  ].map((r) => ({ ...r, permissions: [...r.permissions] }))

  const m = (userId: string, clubId: string, extra: Partial<Membership> = {}): Membership => ({
    id: `m_${userId}_${clubId}`,
    userId,
    clubId,
    status: 'approved',
    isAdmin: false,
    requestedAt: subscribed.toISOString(),
    ...extra,
  })
  const memberships: Membership[] = [
    m('u_camille', 'c_cntr', { isAdmin: true }),
    m('u_lea', 'c_cntr'),
    m('u_hugo', 'c_cntr'),
    m('u_ines', 'c_cntr'),
    m('u_theo', 'c_cntr'),
    m('u_manon', 'c_cntr'),
    m('u_yanis', 'c_cntr'),
    m('u_chloe', 'c_cntr', { roleId: 'r_coord' }),
    m('u_sami', 'c_cntr', { status: 'pending', requestedAt: addDays(t, -2).toISOString() }),
    m('u_julie', 'c_cntr', { status: 'pending', requestedAt: addDays(t, -1).toISOString() }),
    m('u_lea', 'c_villeneuve'),
    m('u_ines', 'c_villeneuve', { isAdmin: true }),
  ]

  const qualifications: Qualification[] = [
    { id: 'q_bnssa', short: 'BNSSA', label: 'Brevet national de sécurité et de sauvetage aquatique', validityMonths: 60 },
    { id: 'q_bpjeps', short: 'BPJEPS AAN', label: 'BPJEPS Activités aquatiques et de la natation', validityMonths: 60 },
    { id: 'q_dejeps', short: 'DEJEPS Natation', label: 'DEJEPS Perfectionnement sportif, mention natation course' },
    { id: 'q_bf1', short: 'BF1', label: 'Brevet fédéral natation, premier niveau' },
    { id: 'q_pse1', short: 'PSE1', label: 'Premiers secours en équipe de niveau 1', validityMonths: 12 },
    { id: 'q_psc1', short: 'PSC1', label: 'Prévention et secours civiques de niveau 1' },
  ]

  const uq = (userId: string, qualificationId: string, expiresOn?: string): UserQualification => ({
    id: `uq_${userId}_${qualificationId}`,
    userId,
    qualificationId,
    expiresOn,
  })
  const userQualifications: UserQualification[] = [
    uq('u_camille', 'q_bpjeps', monthsFromNow(30)),
    uq('u_camille', 'q_pse1', monthsFromNow(5)),
    uq('u_lea', 'q_bnssa', monthsFromNow(26)),
    uq('u_lea', 'q_bpjeps', monthsFromNow(41)),
    uq('u_lea', 'q_pse1', monthsFromNow(7)),
    uq('u_hugo', 'q_bf1'),
    uq('u_hugo', 'q_psc1'),
    uq('u_ines', 'q_bpjeps', monthsFromNow(18)),
    uq('u_ines', 'q_bnssa', iso(addDays(t, 19))),
    uq('u_theo', 'q_bnssa', monthsFromNow(12)),
    uq('u_theo', 'q_pse1', iso(addDays(t, -12))),
    uq('u_manon', 'q_bpjeps', monthsFromNow(33)),
    uq('u_manon', 'q_dejeps'),
    uq('u_yanis', 'q_bf1'),
    uq('u_chloe', 'q_bnssa', monthsFromNow(48)),
    uq('u_chloe', 'q_bf1'),
    uq('u_chloe', 'q_pse1', iso(addDays(t, 45))),
  ]

  const piscines: Piscine[] = [
    { id: 'p_iris', clubId: 'c_cntr', name: 'Piscine des Iris', address: '12 rue des Iris, Villeurbanne', lanes: 6 },
    { id: 'p_parc', clubId: 'c_cntr', name: 'Centre aquatique du Parc', address: '3 allée du Parc, Villeurbanne', lanes: 8 },
    { id: 'p_vil', clubId: 'c_villeneuve', name: 'Piscine municipale', address: 'Place du Marché, Villeneuve', lanes: 5 },
  ]

  const niveaux: Niveau[] = [
    { id: 'n_jardin', clubId: 'c_cntr', name: 'Jardin aquatique', color: LEVEL_COLORS[0] },
    { id: 'n_ecole', clubId: 'c_cntr', name: 'École de natation', color: LEVEL_COLORS[1] },
    { id: 'n_perf', clubId: 'c_cntr', name: 'Perfectionnement', color: LEVEL_COLORS[2] },
    { id: 'n_compet', clubId: 'c_cntr', name: 'Compétition', color: LEVEL_COLORS[3] },
    { id: 'n_masters', clubId: 'c_cntr', name: 'Masters', color: LEVEL_COLORS[4] },
    { id: 'n_adultes', clubId: 'c_cntr', name: 'Aquaforme adultes', color: LEVEL_COLORS[5] },
    { id: 'n_vil_ecole', clubId: 'c_villeneuve', name: 'École de natation', color: LEVEL_COLORS[1] },
  ]

  const g = (id: string, piscineId: string, niveauId: string, name: string, qualificationId?: string, clubId = 'c_cntr'): Groupe =>
    ({ id, clubId, piscineId, niveauId, name, qualificationId })
  const groupes: Groupe[] = [
    g('g_bebes', 'p_iris', 'n_jardin', 'Bébés nageurs', 'q_bpjeps'),
    g('g_jardin', 'p_iris', 'n_jardin', 'Jardin aquatique 4–6 ans', 'q_bpjeps'),
    g('g_ecole1', 'p_iris', 'n_ecole', 'École de natation 1', 'q_bf1'),
    g('g_ecole2', 'p_iris', 'n_ecole', 'École de natation 2', 'q_bf1'),
    g('g_aquagym', 'p_iris', 'n_adultes', 'Aquagym', 'q_bpjeps'),
    g('g_adultes', 'p_iris', 'n_perf', 'Adultes perfectionnement', 'q_bnssa'),
    g('g_avenirs', 'p_parc', 'n_compet', 'Avenirs', 'q_bpjeps'),
    g('g_jeunes', 'p_parc', 'n_compet', 'Jeunes', 'q_bpjeps'),
    g('g_juniors', 'p_parc', 'n_compet', 'Juniors – Seniors', 'q_dejeps'),
    g('g_masters', 'p_parc', 'n_masters', 'Masters', 'q_bnssa'),
    g('g_vil_ecole', 'p_vil', 'n_vil_ecole', 'École de natation', undefined, 'c_villeneuve'),
  ]

  let n = 0
  const c = (day: Weekday, start: string, end: string, groupeId: string, educatorIds: string[], ligne?: string): Creneau => {
    const grp = groupes.find((x) => x.id === groupeId)!
    return { id: `s_${++n}`, clubId: grp.clubId, piscineId: grp.piscineId, groupeId, day, start, end, ligne, educatorIds }
  }
  const creneaux: Creneau[] = [
    // Lundi
    c(0, '17:00', '17:45', 'g_ecole1', ['u_hugo'], 'Lignes 1–2'),
    c(0, '17:45', '18:30', 'g_ecole2', ['u_yanis'], 'Lignes 1–3'),
    c(0, '18:00', '19:30', 'g_jeunes', ['u_manon'], 'Lignes 1–4'),
    c(0, '19:30', '21:00', 'g_juniors', ['u_manon'], 'Lignes 1–6'),
    c(0, '20:00', '21:00', 'g_masters', ['u_theo'], 'Lignes 7–8'),
    // Mardi
    c(1, '17:30', '18:30', 'g_avenirs', ['u_lea'], 'Lignes 1–3'),
    c(1, '18:30', '19:15', 'g_aquagym', ['u_ines'], 'Petit bassin'),
    c(1, '19:30', '20:30', 'g_aquagym', ['u_camille'], 'Petit bassin'),
    c(1, '19:30', '20:30', 'g_adultes', ['u_theo', 'u_chloe'], 'Lignes 4–6'),
    // Mercredi
    c(2, '10:00', '10:45', 'g_jardin', ['u_ines', 'u_camille'], 'Petit bassin'),
    c(2, '14:00', '14:45', 'g_ecole1', ['u_hugo', 'u_chloe'], 'Lignes 1–2'),
    c(2, '14:45', '15:30', 'g_ecole2', ['u_yanis'], 'Lignes 1–3'),
    c(2, '17:00', '18:30', 'g_jeunes', ['u_lea'], 'Lignes 1–4'),
    c(2, '18:30', '20:00', 'g_juniors', ['u_manon'], 'Lignes 1–6'),
    // Jeudi
    c(3, '17:30', '18:30', 'g_avenirs', ['u_lea'], 'Lignes 1–3'),
    c(3, '18:30', '19:15', 'g_aquagym', ['u_ines'], 'Petit bassin'),
    c(3, '19:00', '20:00', 'g_masters', ['u_theo'], 'Lignes 5–8'),
    // Vendredi
    c(4, '17:00', '17:45', 'g_ecole1', ['u_chloe'], 'Lignes 1–2'),
    c(4, '18:00', '19:00', 'g_adultes', ['u_camille'], 'Lignes 4–6'),
    c(4, '18:00', '19:30', 'g_jeunes', ['u_manon'], 'Lignes 1–4'),
    c(4, '19:30', '21:00', 'g_juniors', ['u_manon', 'u_lea'], 'Lignes 1–6'),
    // Samedi
    c(5, '08:00', '10:00', 'g_juniors', ['u_manon'], 'Lignes 1–6'),
    c(5, '09:00', '09:45', 'g_bebes', ['u_ines', 'u_camille'], 'Petit bassin'),
    c(5, '09:45', '10:30', 'g_jardin', ['u_ines'], 'Petit bassin'),
    c(5, '10:00', '11:30', 'g_avenirs', ['u_lea'], 'Lignes 1–3'),
    // Dimanche
    c(6, '10:00', '11:00', 'g_masters', ['u_theo'], 'Lignes 5–8'),
    // Villeneuve
    c(2, '16:00', '17:00', 'g_vil_ecole', ['u_lea'], 'Lignes 1–2'),
    c(5, '14:00', '15:00', 'g_vil_ecole', ['u_ines', 'u_lea']),
  ]

  const slot = (groupeId: string, day: Weekday) => creneaux.find((s) => s.groupeId === groupeId && s.day === day)!.id
  const ab = (id: string, creneauId: string, educatorId: string, date: string, status: Absence['status'], reason?: string): Absence =>
    ({ id, clubId: 'c_cntr', creneauId, educatorId, date, status, reason, createdAt: addDays(t, -3).toISOString() })

  const absences: Absence[] = [
    ab('a_manon', slot('g_juniors', 2), 'u_manon', next(2), 'open', 'Formation DEJEPS'),
    ab('a_hugo', slot('g_ecole1', 0), 'u_hugo', next(0), 'open', 'Examen universitaire'),
    ab('a_theo', slot('g_masters', 3), 'u_theo', next(3), 'open'),
    ab('a_lea', slot('g_avenirs', 1), 'u_lea', next(1, 1), 'open', 'Déplacement compétition'),
    ab('a_ines_past', slot('g_bebes', 5), 'u_ines', past(5, 1), 'replaced', 'Maladie'),
    ab('a_yanis_past', slot('g_ecole2', 2), 'u_yanis', past(2, 2), 'open'),
    ab('a_theo_past', slot('g_adultes', 1), 'u_theo', past(1, 1), 'replaced'),
  ]

  const remplacements = [
    { id: 'rp_1', absenceId: 'a_hugo', volunteerId: 'u_chloe', status: 'pending' as const, createdAt: addDays(t, -1).toISOString() },
    { id: 'rp_2', absenceId: 'a_ines_past', volunteerId: 'u_lea', status: 'approved' as const, createdAt: addDays(t, -9).toISOString(), decidedAt: addDays(t, -8).toISOString() },
    { id: 'rp_3', absenceId: 'a_theo_past', volunteerId: 'u_chloe', status: 'approved' as const, createdAt: addDays(t, -10).toISOString(), decidedAt: addDays(t, -9).toISOString() },
    { id: 'rp_4', absenceId: 'a_lea', volunteerId: 'u_ines', status: 'pending' as const, createdAt: now },
  ]

  return {
    version: SEED_VERSION,
    users,
    clubs,
    memberships,
    roles,
    piscines,
    niveaux,
    groupes,
    creneaux,
    qualifications,
    userQualifications,
    absences,
    remplacements,
    tickets: [
      { id: 't_1', clubId: 'c_cntr', userId: 'u_camille', subject: "Export des heures : ajouter les remplacements", message: "Serait-il possible de distinguer les remplacements dans l'export CSV ?", status: 'resolved', createdAt: addDays(t, -20).toISOString() },
    ],
    notifications: [
      { id: 'nt_1', userId: 'u_camille', clubId: 'c_cntr', text: 'Chloé Fournier se propose pour remplacer Hugo Petit (École de natation 1).', href: '/app/remplacements', read: false, createdAt: addDays(t, -1).toISOString() },
      { id: 'nt_2', userId: 'u_camille', clubId: 'c_cntr', text: '2 demandes d’adhésion attendent votre réponse.', href: '/app/equipe/demandes', read: false, createdAt: addDays(t, -1).toISOString() },
      { id: 'nt_3', userId: 'u_lea', clubId: 'c_cntr', text: 'Masters (Théo Laurent) cherche un remplaçant.', href: '/app/remplacements', read: false, createdAt: addDays(t, -2).toISOString() },
    ],
  }
}
