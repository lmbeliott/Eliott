// Rangs (paliers de points aux noms japonais) et titres (distinctions pour des habitudes
// qu'on veut encourager).
import type { UiLang } from './i18n'
import { levels, problemById } from './content'

export interface League {
  id: string
  /** Nom du rang en rōmaji (identique en français et en anglais) */
  fr: string
  en: string
  kanji: string
  /** Caractère affiché dans la pastille */
  glyph: string
  meaning: [string, string]
  min: number
  /** Teinte de la pastille (uniquement décorative) */
  tone: string
}

// Rangs : un chemin d'apprentissage japonais, de l'esprit du débutant au maître reconnu.
// Shu, Ha, Ri sont les trois étapes classiques : suivre la forme, la briser, s'en détacher.
// Seuils calés sur le parcours complet (bonus de chapitre compris) : niveau 1 terminé ≈ 6 000 pts,
// niveau 2 ≈ 11 000, niveau 3 ≈ 25 000, niveau 4 ≈ 55 000, niveau 5 ≈ 110 000 ; Meijin demande
// presque tout le parcours et une bonne part des problèmes ouverts.
export const LEAGUES: League[] = [
  { id: 'shoshin', fr: 'Shoshin', en: 'Shoshin', kanji: '初心', glyph: '初', meaning: ['L’esprit du débutant', 'The beginner’s mind'], min: 0, tone: '#8b95a3' },
  { id: 'minarai', fr: 'Minarai', en: 'Minarai', kanji: '見習い', glyph: '見', meaning: ['Apprendre en regardant faire', 'Learning by watching'], min: 1000, tone: '#6f9f88' },
  { id: 'deshi', fr: 'Deshi', en: 'Deshi', kanji: '弟子', glyph: '弟', meaning: ['L’élève, admis auprès d’un maître', 'The student, taken in by a master'], min: 3000, tone: '#4d9a4a' },
  { id: 'shu', fr: 'Shu', en: 'Shu', kanji: '守', glyph: '守', meaning: ['Suivre la forme', 'Following the form'], min: 7500, tone: '#3a86c4' },
  { id: 'ha', fr: 'Ha', en: 'Ha', kanji: '破', glyph: '破', meaning: ['Briser la forme', 'Breaking the form'], min: 15000, tone: '#5a66ec' },
  { id: 'ri', fr: 'Ri', en: 'Ri', kanji: '離', glyph: '離', meaning: ['Se détacher de la forme', 'Moving beyond the form'], min: 30000, tone: '#8b5fe0' },
  { id: 'tatsujin', fr: 'Tatsujin', en: 'Tatsujin', kanji: '達人', glyph: '達', meaning: ['Celui qui a atteint la maîtrise', 'One who has reached mastery'], min: 50000, tone: '#c9952a' },
  { id: 'shihan', fr: 'Shihan', en: 'Shihan', kanji: '師範', glyph: '師', meaning: ['Le modèle, celui qui enseigne', 'The model, one who teaches'], min: 80000, tone: '#d96a32' },
  { id: 'meijin', fr: 'Meijin', en: 'Meijin', kanji: '名人', glyph: '名', meaning: ['Le maître dont le nom fait autorité', 'The master whose name carries authority'], min: 120000, tone: '#cf3044' },
]

export const leagueName = (lang: UiLang, l: League) => (lang === 'en' ? l.en : l.fr)
export const leagueMeaning = (lang: UiLang, l: League) => (lang === 'en' ? l.meaning[1] : l.meaning[0])

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
  const n = solvedIds.size
  const firstTries = input.solves.filter((s) => s.first_try).length
  const dailies = input.solves.filter((s) => s.daily).length
  const langs = new Set(input.solves.map((s) => s.language))
  const cpp = input.solves.filter((s) => s.language === 'cpp').length
  const levelDone = (id: string) => {
    const lvl = levels.find((l) => l.id === id)
    const ids = lvl ? lvl.chapters.flatMap((c) => c.problems) : []
    return ids.length > 0 && ids.every((p) => solvedIds.has(p))
  }
  const chaptersDone = levels.flatMap((l) => l.chapters).filter((c) => c.problems.length > 0 && c.problems.every((p) => solvedIds.has(p)))
  const chapterDone = (id: string) => chaptersDone.some((c) => c.id === id)
  const total = levels.flatMap((l) => l.chapters).reduce((a, c) => a + c.problems.length, 0)
  const experts = input.solves.filter((s) => problemById(s.problem_id)?.difficulty === 'expert').length
  const b = (id: string, title: [string, string], detail: [string, string], earned: boolean): Badge => ({ id, title, detail, earned })
  return [
    // Volume
    b('premier', ['Premier problème', 'First problem'], ['1 problème réussi', '1 problem solved'], n >= 1),
    b('dix', ['Dix problèmes', 'Ten problems'], ['10 problèmes réussis', '10 problems solved'], n >= 10),
    b('vingt-cinq', ['Vingt-cinq problèmes', 'Twenty-five problems'], ['25 problèmes réussis', '25 problems solved'], n >= 25),
    b('cinquante', ['Cinquante problèmes', 'Fifty problems'], ['50 problèmes réussis', '50 problems solved'], n >= 50),
    b('cent', ['Cent problèmes', 'One hundred problems'], ['100 problèmes réussis', '100 problems solved'], n >= 100),
    b('tout', ['Parcours complet', 'Full path'], [`Les ${total} exercices du parcours réussis`, `All ${total} exercises of the path solved`], total > 0 && n >= total && levels.every((l) => levelDone(l.id))),
    // Précision
    b('premier-coup', ['Du premier coup', 'First try'], ['5 problèmes acceptés à la première soumission', '5 problems accepted on the first submission'], firstTries >= 5),
    b('premier-coup-25', ['Sans retouche', 'No second draft'], ['25 problèmes acceptés à la première soumission', '25 problems accepted on the first submission'], firstTries >= 25),
    // Régularité
    b('serie-7', ['Sept jours de suite', 'Seven-day streak'], ['Série de 7 jours', '7-day streak'], input.bestStreak >= 7),
    b('serie-30', ['Trente jours de suite', 'Thirty-day streak'], ['Série de 30 jours', '30-day streak'], input.bestStreak >= 30),
    b('serie-100', ['Cent jours de suite', 'Hundred-day streak'], ['Série de 100 jours', '100-day streak'], input.bestStreak >= 100),
    b('defis', ['Défis du jour', 'Daily challenger'], ['5 défis du jour réussis le jour même', '5 daily challenges solved on the day'], dailies >= 5),
    b('defis-30', ['Trente défis du jour', 'Thirty daily challenges'], ['30 défis du jour réussis le jour même', '30 daily challenges solved on the day'], dailies >= 30),
    // Langages
    b('bilingue', ['Bilingue', 'Bilingual'], ['Réussites en Python et en C++', 'Solves in both Python and C++'], langs.has('python') && langs.has('cpp')),
    b('cpp-25', ['Vingt-cinq en C++', 'Twenty-five in C++'], ['25 problèmes réussis en C++', '25 problems solved in C++'], cpp >= 25),
    // Parcours
    b('chapitre', ['Premier chapitre', 'First chapter'], ['Un chapitre terminé', 'One chapter complete'], chaptersDone.length >= 1),
    b('chapitres-10', ['Dix chapitres', 'Ten chapters'], ['10 chapitres terminés', '10 chapters complete'], chaptersDone.length >= 10),
    ...levels.map((l, i) =>
      b(`niveau-${i + 1}`, [`Niveau ${i + 1} terminé`, `Level ${i + 1} complete`], [`Tous les exercices de « ${l.title} »`, `Every exercise of “${l.titleEn ?? l.title}”`], levelDone(l.id)),
    ),
    b('expert-1', ['Premier Expert', 'First Expert'], ['1 problème Expert réussi', '1 Expert problem solved'], experts >= 1),
    b('expert-10', ['Dix Experts', 'Ten Experts'], ['10 problèmes Expert réussis', '10 Expert problems solved'], experts >= 10),
    b('olympiades', ['Prêt pour les Olympiades', 'Olympiad-ready'], ['Synthèse du niveau 6 terminée', 'Level 6 review complete'], chapterDone('p6-synthese')),
    // Groupe
    b('groupe', ['En groupe', 'Team player'], ['Membre d’un groupe', 'Member of a group'], input.groups > 0),
  ]
}
