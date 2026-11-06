import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Download, FileSpreadsheet } from 'lucide-react'
import { Button, EmptyState, IconButton, PageHeader, Panel, Table } from '../../components/ui'
import { NoAccess } from './Config'
import { useAppCtx } from '../../data/hooks'
import { useWholeDB } from '../../data/store'
import { fullName, hoursReport } from '../../data/api'
import { MONTHS } from '../../lib/dates'
import { download, toCSV } from '../../lib/csv'
import { fmtHours, normalize } from '../../lib/util'

export default function Reports() {
  const ctx = useAppCtx()
  const db = useWholeDB()
  const now = new Date()
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() })
  const rows = useMemo(() => hoursReport(db, ctx.club.id, ym.y, ym.m), [db, ctx.club.id, ym])
  if (!ctx.can('reports')) return <NoAccess what="les rapports" />

  const shift = (d: number) => setYm(({ y, m }) => {
    const date = new Date(y, m + d, 1)
    return { y: date.getFullYear(), m: date.getMonth() }
  })
  const totals = rows.reduce((t, r) => ({ planned: t.planned + r.planned, absent: t.absent + r.absent, replacing: t.replacing + r.replacing, effective: t.effective + r.effective }), { planned: 0, absent: 0, replacing: 0, effective: 0 })
  const label = `${MONTHS[ym.m]} ${ym.y}`
  const exportCSV = () => {
    const dec = (h: number) => Math.round(h * 100) / 100
    download(
      `heures-${normalize(ctx.club.name).replace(/[^a-z0-9]+/g, '-')}-${ym.y}-${String(ym.m + 1).padStart(2, '0')}.csv`,
      toCSV([
        ['Éducateur', 'E-mail', 'Séances prévues', 'Heures prévues', "Heures d'absence", 'Heures de remplacement', 'Heures effectives'],
        ...rows.map((r) => [fullName(r.user), r.user.email, r.sessions, dec(r.planned), dec(r.absent), dec(r.replacing), dec(r.effective)]),
        ['Total', '', rows.reduce((s, r) => s + r.sessions, 0), dec(totals.planned), dec(totals.absent), dec(totals.replacing), dec(totals.effective)],
      ]),
    )
  }

  return (
    <>
      <PageHeader title="Relevé d'heures" description="Heures effectives = heures prévues au planning − absences + remplacements effectués. Pour la paie et les défraiements." />
      <Panel
        title={<span className="flex items-center gap-1"><IconButton label="Mois précédent" icon={ChevronLeft} size="sm" onClick={() => shift(-1)} /><span className="min-w-[150px] text-center">{label}</span><IconButton label="Mois suivant" icon={ChevronRight} size="sm" onClick={() => shift(1)} /></span>}
        actions={<Button variant="secondary" icon={Download} onClick={exportCSV} disabled={!rows.length}>Exporter pour Excel</Button>}
      >
        {rows.length === 0 ? (
          <EmptyState compact icon={FileSpreadsheet} title="Aucune donnée pour ce mois">Le relevé se remplit dès que des créneaux sont affectés aux éducateurs.</EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Éducateur</th>
                <th className="text-right">Séances</th>
                <th className="text-right">Prévues</th>
                <th className="text-right">Absences</th>
                <th className="text-right">Remplacements</th>
                <th className="text-right">Effectives</th>
              </tr>
            </thead>
            <tbody className="num">
              {rows.map((r) => (
                <tr key={r.user.id}>
                  <td className="font-semibold text-ink">{fullName(r.user)}</td>
                  <td className="text-right text-ink-2">{r.sessions}</td>
                  <td className="text-right text-ink-2">{fmtHours(r.planned)}</td>
                  <td className="text-right text-ink-2">{r.absent ? <span className="text-rope">− {fmtHours(r.absent)}</span> : '—'}</td>
                  <td className="text-right text-ink-2">{r.replacing ? <span className="text-kelp">+ {fmtHours(r.replacing)}</span> : '—'}</td>
                  <td className="text-right font-bold text-ink">{fmtHours(r.effective)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="num">
              <tr className="[&_td]:border-t-2 [&_td]:border-line-strong [&_td]:px-3 [&_td]:py-3 [&_td:first-child]:pl-5 sm:[&_td:first-child]:pl-6 [&_td:last-child]:pr-5 sm:[&_td:last-child]:pr-6">
                <td className="font-bold text-ink">Total club</td>
                <td className="text-right font-semibold text-ink">{rows.reduce((s, r) => s + r.sessions, 0)}</td>
                <td className="text-right font-semibold text-ink">{fmtHours(totals.planned)}</td>
                <td className="text-right font-semibold text-ink">{fmtHours(totals.absent)}</td>
                <td className="text-right font-semibold text-ink">{fmtHours(totals.replacing)}</td>
                <td className="text-right font-bold text-ink">{fmtHours(totals.effective)}</td>
              </tr>
            </tfoot>
          </Table>
        )}
        <p className="mt-4 text-[13px] text-muted">Le fichier CSV utilise le point-virgule et la virgule décimale : il s'ouvre directement dans Excel en français.</p>
      </Panel>
    </>
  )
}
