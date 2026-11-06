import type { Difficulty } from './content'

/** Points par difficulté (doit correspondre à POINTS dans scripts/build-content.mjs). */
export const POINTS_TABLE: { difficulty: Difficulty; points: number; fr: string; en: string }[] = [
  { difficulty: 'facile', points: 50, fr: 'Facile', en: 'Easy' },
  { difficulty: 'moyen', points: 100, fr: 'Moyen', en: 'Medium' },
  { difficulty: 'difficile', points: 200, fr: 'Difficile', en: 'Hard' },
  { difficulty: 'expert', points: 400, fr: 'Expert', en: 'Expert' },
]
