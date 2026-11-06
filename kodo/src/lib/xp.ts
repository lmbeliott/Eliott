import type { Slope } from './content'

/** Altitude gagnée par piste (doit correspondre à XP_BY_SLOPE dans scripts/build-content.mjs). */
export const XP: { slope: Slope; xp: number; fr: string; en: string }[] = [
  { slope: 'verte', xp: 50, fr: 'Piste verte', en: 'Green run' },
  { slope: 'bleue', xp: 100, fr: 'Piste bleue', en: 'Blue run' },
  { slope: 'rouge', xp: 200, fr: 'Piste rouge', en: 'Red run' },
  { slope: 'noire', xp: 400, fr: 'Piste noire', en: 'Black run' },
]
