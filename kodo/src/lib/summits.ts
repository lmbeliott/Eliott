// Les sommets : des paliers d'altitude (l'XP du site) nommés d'après de vraies montagnes,
// et quelques distinctions pour des habitudes qu'on veut encourager.
import type { UiLang } from './i18n'
import { levels, problemById } from './content'

export interface Summit {
  name: string
  nameEn: string
  meters: number
  where: string
  whereEn: string
}

export const SUMMITS: Summit[] = [
  { name: 'Puy de Dôme', nameEn: 'Puy de Dôme', meters: 1465, where: 'Massif central', whereEn: 'Massif Central' },
  { name: 'Mont Ventoux', nameEn: 'Mont Ventoux', meters: 1910, where: 'Provence', whereEn: 'Provence' },
  { name: 'Pic du Midi', nameEn: 'Pic du Midi', meters: 2877, where: 'Pyrénées', whereEn: 'Pyrenees' },
  { name: 'Mont Perdu', nameEn: 'Monte Perdido', meters: 3355, where: 'Pyrénées', whereEn: 'Pyrenees' },
  { name: 'Barre des Écrins', nameEn: 'Barre des Écrins', meters: 4102, where: 'Alpes', whereEn: 'Alps' },
  { name: 'Mont Blanc', nameEn: 'Mont Blanc', meters: 4806, where: 'Alpes', whereEn: 'Alps' },
  { name: 'Kilimandjaro', nameEn: 'Kilimanjaro', meters: 5895, where: 'Tanzanie', whereEn: 'Tanzania' },
  { name: 'Aconcagua', nameEn: 'Aconcagua', meters: 6961, where: 'Andes', whereEn: 'Andes' },
  { name: 'Everest', nameEn: 'Everest', meters: 8849, where: 'Himalaya', whereEn: 'Himalayas' },
]

export const summitName = (lang: UiLang, s: Summit) => (lang === 'en' ? s.nameEn : s.name)

export function summitProgress(xp: number) {
  const reached = SUMMITS.filter((s) => xp >= s.meters)
  const next = SUMMITS.find((s) => xp < s.meters) ?? null
  const prevMeters = reached.length ? reached[reached.length - 1].meters : 0
  return {
    reached,
    last: reached[reached.length - 1] ?? null,
    next,
    remaining: next ? next.meters - xp : 0,
    ratio: next ? (xp - prevMeters) / (next.meters - prevMeters) : 1,
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
  const blackRuns = input.solves.filter((s) => problemById(s.problem_id)?.slope === 'noire').length
  return [
    { id: 'premier', title: ['Premiers pas', 'First steps'], detail: ['Résoudre un premier problème', 'Solve your first problem'], earned: solvedIds.size >= 1 },
    { id: 'dix', title: ['Dix sur dix', 'Ten out of ten'], detail: ['Résoudre 10 problèmes', 'Solve 10 problems'], earned: solvedIds.size >= 10 },
    { id: 'premier-coup', title: ['Du premier coup', 'First try'], detail: ['5 problèmes réussis à la première soumission', '5 problems accepted on the first submission'], earned: firstTries >= 5 },
    { id: 'serie-7', title: ['Une semaine en cordée', 'A week on the rope'], detail: ['Une série de 7 jours', 'A 7-day streak'], earned: input.bestStreak >= 7 },
    { id: 'serie-30', title: ['Un mois sans redescendre', 'A month up high'], detail: ['Une série de 30 jours', 'A 30-day streak'], earned: input.bestStreak >= 30 },
    { id: 'defis', title: ['Lève-tôt', 'Early riser'], detail: ['5 défis du jour réussis', '5 daily challenges solved'], earned: dailies >= 5 },
    { id: 'bilingue', title: ['Bilingue', 'Bilingual'], detail: ['Réussir en Python et en C++', 'Solve problems in both Python and C++'], earned: langs.has('python') && langs.has('cpp') },
    { id: 'cordee', title: ['Encordé', 'Roped in'], detail: ['Rejoindre une cordée', 'Join a group'], earned: input.groups > 0 },
    { id: 'verte', title: ['Piste verte', 'Green run'], detail: ['Terminer le niveau 1', 'Finish level 1'], earned: levelDone('n1') },
    { id: 'bleue', title: ['Piste bleue', 'Blue run'], detail: ['Terminer le niveau 2', 'Finish level 2'], earned: levelDone('n2') },
    { id: 'rouge', title: ['Piste rouge', 'Red run'], detail: ['Terminer le niveau 3', 'Finish level 3'], earned: levelDone('n3') },
    { id: 'noire', title: ['Piste noire', 'Black run'], detail: ['Terminer le niveau 4', 'Finish level 4'], earned: levelDone('n4') },
    { id: 'noire-1', title: ['Hors-piste', 'Off-piste'], detail: ['Résoudre un problème de piste noire', 'Solve a black-run problem'], earned: blackRuns >= 1 },
  ]
}
