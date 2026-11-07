// Ligues : des paliers de points, de Bronze à Maître, et quelques distinctions pour des
// habitudes qu'on veut encourager.
import type { UiLang } from './i18n'
import { levels, problemById } from './content'

export interface League {
  id: string
  fr: string
  en: string
  min: number
  /** Teinte du losange (couleur métallique, uniquement décorative de la pastille) */
  tone: string
}

export const LEAGUES: League[] = [
  { id: 'bronze', fr: 'Bronze', en: 'Bronze', min: 0, tone: '#b8794a' },
  { id: 'argent', fr: 'Argent', en: 'Silver', min: 500, tone: '#9aa3ad' },
  { id: 'or', fr: 'Or', en: 'Gold', min: 1500, tone: '#d4a72c' },
  { id: 'platine', fr: 'Platine', en: 'Platinum', min: 3000, tone: '#5fb3b3' },
  { id: 'diamant', fr: 'Diamant', en: 'Diamond', min: 6000, tone: '#6f7cf6' },
  { id: 'maitre', fr: 'Maître', en: 'Master', min: 9000, tone: '#c2417f' },
]

export const leagueName = (lang: UiLang, l: League) => (lang === 'en' ? l.en : l.fr)

export function leagueOf(points: number) {
  let i = 0
  while (i + 1 < LEAGUES.length && points >= LEAGUES[i + 1].min) i++
  const current = LEAGUES[i]
  const next = LEAGUES[i + 1] ?? null
  return {
    current,
    next,
    remaining: next ? next.min - points : 0,
    ratio: next ? (points - current.min) / (next.min - current.min) : 1,
  }
}

export interface Badge {
  id: string
  title: [string, string]
  detail: [string, string]
  earned: boolean
}

interface BadgeInput {
  solves: { problem_id: string; first_try: boolean; daily?: boolean; language: string }[]
  bestStreak: number
  groups: number
}

export function badges(input: BadgeInput): Badge[] {
  const solvedIds = new Set(input.solves.map((s) => s.problem_id))
  const firstTries = input.solves.filter((s) => s.first_try).length
  const dailies = input.solves.filter((s) => s.daily).length
  const langs = new Set(input.solves.map((s) => s.language))
  const levelDone = (id: string) => {
    const lvl = levels.find((l) => l.id === id)!
    const ids = lvl.chapters.flatMap((c) => c.problems)
    return ids.length > 0 && ids.every((p) => solvedIds.has(p))
  }
  const experts = input.solves.filter((s) => problemById(s.problem_id)?.difficulty === 'expert').length
  return [
    { id: 'premier', title: ['Premier problème', 'First problem'], detail: ['1 problème réussi', '1 problem solved'], earned: solvedIds.size >= 1 },
    { id: 'dix', title: ['Dix problèmes', 'Ten problems'], detail: ['10 problèmes réussis', '10 problems solved'], earned: solvedIds.size >= 10 },
    { id: 'premier-coup', title: ['Du premier coup', 'First try'], detail: ['5 problèmes réussis à la première soumission', '5 problems accepted on the first submission'], earned: firstTries >= 5 },
    { id: 'serie-7', title: ['7 jours de suite', '7-day streak'], detail: ['Série de 7 jours', '7-day streak'], earned: input.bestStreak >= 7 },
    { id: 'serie-30', title: ['30 jours de suite', '30-day streak'], detail: ['Série de 30 jours', '30-day streak'], earned: input.bestStreak >= 30 },
    { id: 'defis', title: ['Défis du jour', 'Daily challenger'], detail: ['5 défis du jour réussis', '5 daily challenges solved'], earned: dailies >= 5 },
    { id: 'bilingue', title: ['Bilingue', 'Bilingual'], detail: ['Réussites en Python et en C++', 'Solves in both Python and C++'], earned: langs.has('python') && langs.has('cpp') },
    { id: 'groupe', title: ['En groupe', 'Team player'], detail: ['Membre d’un groupe', 'Member of a group'], earned: input.groups > 0 },
    { id: 'n1', title: ['Niveau 1 terminé', 'Level 1 complete'], detail: ['Tous les problèmes faciles réussis', 'All easy problems solved'], earned: levelDone('n1') },
    { id: 'n2', title: ['Niveau 2 terminé', 'Level 2 complete'], detail: ['Tous les problèmes moyens réussis', 'All medium problems solved'], earned: levelDone('n2') },
    { id: 'n3', title: ['Niveau 3 terminé', 'Level 3 complete'], detail: ['Tous les problèmes difficiles réussis', 'All hard problems solved'], earned: levelDone('n3') },
    { id: 'n4', title: ['Niveau 4 terminé', 'Level 4 complete'], detail: ['Tous les problèmes experts réussis', 'All expert problems solved'], earned: levelDone('n4') },
    { id: 'expert-1', title: ['Premier Expert', 'First Expert'], detail: ['1 problème Expert réussi', '1 Expert problem solved'], earned: experts >= 1 },
  ]
}
