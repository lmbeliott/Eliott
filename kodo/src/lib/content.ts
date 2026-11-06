// Le catalogue (niveaux, chapitres, problèmes) est généré par scripts/build-content.mjs.
// Les énoncés et les cours sont chargés à la demande depuis public/content/.
import catalogJson from '../content/catalog.json'
import type { UiLang } from './i18n'
import { pick } from './i18n'

export type Difficulty = 'facile' | 'moyen' | 'difficile' | 'expert'
export const DIFFICULTIES: Difficulty[] = ['facile', 'moyen', 'difficile', 'expert']

export interface CatalogProblem {
  id: string
  title: string
  titleEn: string | null
  chapter: string
  level: string
  difficulty: Difficulty
  order: number
  tags: string[]
  points: number
}
export interface Chapter {
  id: string
  title: string
  titleEn?: string
  summary: string
  summaryEn?: string
  lessonMinutes: number | null
  problems: string[]
}
export interface Level {
  id: string
  difficulty: Difficulty
  title: string
  titleEn?: string
  summary: string
  summaryEn?: string
  chapters: Chapter[]
}
interface Catalog {
  levels: Level[]
  problems: Record<string, CatalogProblem>
}

export const catalog = catalogJson as unknown as Catalog
export const levels = catalog.levels
export const chapters = levels.flatMap((l) => l.chapters.map((c) => ({ ...c, level: l })))
export type ChapterWithLevel = (typeof chapters)[number]
export const problemList: CatalogProblem[] = chapters.flatMap((c) => c.problems.map((id) => catalog.problems[id]))
export const problemById = (id: string): CatalogProblem | undefined => catalog.problems[id]
export const chapterById = (id: string) => chapters.find((c) => c.id === id)
export const levelById = (id: string) => levels.find((l) => l.id === id)

export const problemTitle = (lang: UiLang, p: CatalogProblem) => pick(lang, p.title, p.titleEn)
export const chapterTitle = (lang: UiLang, c: Chapter) => pick(lang, c.title, c.titleEn)
export const chapterSummary = (lang: UiLang, c: Chapter) => pick(lang, c.summary, c.summaryEn)
export const levelTitle = (lang: UiLang, l: Level) => pick(lang, l.title, l.titleEn)
export const levelSummary = (lang: UiLang, l: Level) => pick(lang, l.summary, l.summaryEn)

export const DIFFICULTY_LABEL: Record<Difficulty, { fr: string; en: string }> = {
  facile: { fr: 'Facile', en: 'Easy' },
  moyen: { fr: 'Moyen', en: 'Medium' },
  difficile: { fr: 'Difficile', en: 'Hard' },
  expert: { fr: 'Expert', en: 'Expert' },
}
export const difficultyRank = (d: Difficulty) => DIFFICULTIES.indexOf(d) + 1

/** Total des points disponibles : la somme de tous les problèmes. */
export const totalPoints = problemList.reduce((a, p) => a + p.points, 0)

// ------------------------------------------------------------------ Énoncés

export interface ProblemText {
  title: string
  statement: string
  input: string
  output: string
  constraints: string | null
  hints: string[]
  solution: string
}
export interface ProblemData {
  id: string
  title: string
  titleEn: string | null
  chapter: string
  level: string
  difficulty: Difficulty
  order: number
  tags: string[]
  points: number
  timeLimitMs: number
  text: { fr: ProblemText; en: ProblemText | null }
  solutionCode: { python: string | null; cpp: string | null }
  starter: { fr: { python: string | null; cpp: string | null }; en: { python: string | null; cpp: string | null } }
  samples: { input: string; output: string }[]
  tests: { input: string; hash: string }[]
}
export interface LessonData {
  id: string
  fr: { html: string; minutes: number }
  en: { html: string; minutes: number } | null
}

const base = import.meta.env.BASE_URL
const cache = new Map<string, Promise<unknown>>()
function getJson<T>(path: string): Promise<T> {
  let p = cache.get(path) as Promise<T> | undefined
  if (!p) {
    p = fetch(`${base}${path}`).then((r) => {
      if (!r.ok) throw new Error(`${r.status}`)
      return r.json() as Promise<T>
    })
    p.catch(() => cache.delete(path))
    cache.set(path, p)
  }
  return p
}
export const loadProblem = (id: string) => getJson<ProblemData>(`content/problems/${id}.json`)
export const loadLesson = (id: string) => getJson<LessonData>(`content/lessons/${id}.json`)

// ------------------------------------------------------------------ Étiquettes

const TAG_EN: Record<string, string> = {
  'entrées-sorties': 'input/output',
  arithmétique: 'arithmetic',
  conditions: 'conditions',
  boucles: 'loops',
  listes: 'lists',
  chaînes: 'strings',
  grilles: 'grids',
  fonctions: 'functions',
  tri: 'sorting',
  dictionnaires: 'dictionaries',
  simulation: 'simulation',
  mathématiques: 'math',
  'sommes-préfixes': 'prefix sums',
  'deux-pointeurs': 'two pointers',
  dichotomie: 'binary search',
  récursivité: 'recursion',
  backtracking: 'backtracking',
  glouton: 'greedy',
  graphes: 'graphs',
  'parcours-en-largeur': 'BFS',
  'parcours-en-profondeur': 'DFS',
  'programmation-dynamique': 'dynamic programming',
  dijkstra: 'Dijkstra',
  'union-find': 'union-find',
  fenwick: 'Fenwick tree',
  'arbre-de-segments': 'segment tree',
  bits: 'bits',
}
export const tagLabel = (lang: UiLang, tag: string) => (lang === 'en' ? (TAG_EN[tag] ?? tag) : tag.replace(/-/g, ' '))
