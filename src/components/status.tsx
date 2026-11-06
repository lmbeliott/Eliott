import { Badge } from './ui'
import type { AbsenceStatus, ReplacementStatus } from '../data/types'
import { daysUntil, fmtMedium } from '../lib/dates'

export function AbsenceStatusBadge({ status }: { status: AbsenceStatus }) {
  switch (status) {
    case 'open': return <Badge tone="rope" dot>À remplacer</Badge>
    case 'replaced': return <Badge tone="kelp" dot>Remplacé</Badge>
    case 'unreplaced': return <Badge tone="neutral">Non remplacé</Badge>
    case 'cancelled': return <Badge tone="neutral">Annulée</Badge>
  }
}

export function ReplacementStatusBadge({ status }: { status: ReplacementStatus }) {
  switch (status) {
    case 'pending': return <Badge tone="buoy" dot>En attente</Badge>
    case 'approved': return <Badge tone="kelp" dot>Validée</Badge>
    case 'refused': return <Badge tone="neutral">Non retenue</Badge>
    case 'withdrawn': return <Badge tone="neutral">Retirée</Badge>
    case 'cancelled': return <Badge tone="neutral">Absence annulée</Badge>
  }
}

/** Statut d'un diplôme selon sa date de recyclage. */
export function expiryInfo(expiresOn?: string): { tone: 'kelp' | 'buoy' | 'rope' | 'neutral'; label: string } {
  if (!expiresOn) return { tone: 'neutral', label: 'Sans échéance' }
  const d = daysUntil(expiresOn)
  if (d < 0) return { tone: 'rope', label: `Expiré depuis ${-d} j` }
  if (d <= 60) return { tone: 'buoy', label: d === 0 ? "Expire aujourd'hui" : `Recyclage dans ${d} j` }
  return { tone: 'kelp', label: `Valide jusqu'au ${fmtMedium(expiresOn)}` }
}

export function ExpiryBadge({ expiresOn }: { expiresOn?: string }) {
  const i = expiryInfo(expiresOn)
  return <Badge tone={i.tone}>{i.label}</Badge>
}
