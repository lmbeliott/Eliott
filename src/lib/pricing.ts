// Grille tarifaire (reprise des CGV d'origine).
export const BASE_PRICE = 7.99
export const PROMO_MONTHS = 6
export const INCLUDED_PROMO = 5
export const INCLUDED_NORMAL = 3

export const TIERS = [
  { from: 4, to: 10, unit: 1.79 },
  { from: 11, to: 20, unit: 1.49 },
  { from: 21, to: Infinity, unit: 1.09 },
] as const

export interface PriceLine {
  label: string
  count: number
  unit: number
  subtotal: number
}

export interface Quote {
  included: number
  lines: PriceLine[]
  total: number
}

/**
 * Prix mensuel TTC pour un nombre d'accès.
 * Chaque accès au-delà de l'inclus est facturé au tarif du palier où il tombe
 * (ex. 15 accès hors promo : 7,99 + 7 × 1,79 + 5 × 1,49 = 27,97 €).
 */
export function quote(access: number, promo: boolean): Quote {
  const included = promo ? INCLUDED_PROMO : INCLUDED_NORMAL
  const lines: PriceLine[] = []
  for (const t of TIERS) {
    const lo = Math.max(t.from, included + 1)
    const hi = Math.min(t.to, access)
    const count = hi >= lo ? hi - lo + 1 : 0
    if (count > 0) {
      lines.push({
        label: t.to === Infinity ? `Accès ${t.from} et plus` : `Accès ${t.from} à ${t.to}`,
        count,
        unit: t.unit,
        subtotal: round(count * t.unit),
      })
    }
  }
  const total = round(BASE_PRICE + lines.reduce((s, l) => s + l.subtotal, 0))
  return { included, lines, total }
}

const round = (n: number) => Math.round(n * 100) / 100

const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
export const euros = (n: number) => eur.format(n)
