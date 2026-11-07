// Calendrier d'activité : une cellule par jour, colonnes = semaines (lundi en haut).
import { useMemo } from 'react'
import { formatDate, plural, useI18n } from '../lib/i18n'
import { parisDay } from '../lib/supabase'
import { cx } from './ui'

const LEVEL_BG = [
  'bg-surface-2 shadow-[inset_0_0_0_1px_var(--line)]',
  'bg-[color-mix(in_oklab,var(--accent)_28%,var(--surface))]',
  'bg-[color-mix(in_oklab,var(--accent)_52%,var(--surface))]',
  'bg-[color-mix(in_oklab,var(--accent)_76%,var(--surface))]',
  'bg-accent',
]
const level = (n: number) => (n === 0 ? 0 : n < 3 ? 1 : n < 6 ? 2 : n < 10 ? 3 : 4)

export function Heatmap({ days, weeks = 53, className }: { days: { day: string; submissions: number; solves: number }[]; weeks?: number; className?: string }) {
  const { lang, t } = useI18n()
  const byDay = useMemo(() => new Map(days.map((d) => [d.day, d])), [days])
  const { cols, months } = useMemo(() => {
    // Jours ancrés à midi (heure locale) : un changement d'heure ne peut pas dupliquer une date.
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12)
    const dow = (today.getDay() + 6) % 7 // lundi = 0
    const startOffset = (weeks - 1) * 7 + dow
    const cols: { date: Date; key: string; future: boolean }[][] = []
    const months: { col: number; label: string }[] = []
    let lastMonth = -1
    for (let w = 0; w < weeks; w++) {
      const col = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - startOffset + w * 7 + d, 12)
        col.push({ date, key: parisDay(date), future: date > now && date.getDate() !== now.getDate() })
      }
      const m = col[0].date.getMonth()
      if (m !== lastMonth) {
        if (w < weeks - 2) months.push({ col: w, label: formatDate(lang, col[0].date, { month: 'short' }).replace('.', '') })
        lastMonth = m
      }
      cols.push(col)
    }
    return { cols, months }
  }, [weeks, lang])

  const activeDays = days.filter((d) => d.submissions > 0).length
  const weekdays = lang === 'en' ? ['Mon', '', 'Wed', '', 'Fri', '', ''] : ['lun', '', 'mer', '', 'ven', '', '']

  return (
    <figure className={className}>
      <div className="overflow-x-auto pb-1">
        <div
          className="grid min-w-[720px] gap-[3px]"
          style={{ gridTemplateColumns: `2rem repeat(${weeks}, minmax(10px, 1fr))`, gridTemplateRows: `14px repeat(7, auto)` }}
          role="img"
          aria-label={t(`${plural(lang, activeDays, ['jour actif', 'jours actifs'], ['', ''])} sur les 12 derniers mois`, `${activeDays} active ${activeDays === 1 ? 'day' : 'days'} over the last 12 months`)}
        >
          {months.map((m) => (
            <span key={m.col} className="text-xs leading-none text-muted" style={{ gridColumn: m.col + 2, gridRow: 1 }} aria-hidden>
              {m.label}
            </span>
          ))}
          {weekdays.map((w, i) =>
            w ? (
              <span key={i} className="self-center text-xs leading-none text-muted" style={{ gridColumn: 1, gridRow: i + 2 }} aria-hidden>
                {w}
              </span>
            ) : null,
          )}
          {cols.map((col, w) =>
            col.map((c, d) => {
              if (c.future) return null
              const a = byDay.get(c.key)
              const n = a?.submissions ?? 0
              const title = `${formatDate(lang, c.date, { weekday: 'long', day: 'numeric', month: 'long' })} : ${
                n === 0 ? t('aucune soumission', 'no submissions') : `${plural(lang, n, ['soumission', 'soumissions'], ['submission', 'submissions'])}${a?.solves ? `, ${plural(lang, a.solves, ['réussite', 'réussites'], ['solve', 'solves'])}` : ''}`
              }`
              return <span key={c.key} title={title} className={cx('aspect-square max-h-4 rounded-[3px]', LEVEL_BG[level(n)])} style={{ gridColumn: w + 2, gridRow: d + 2 }} />
            }),
          )}
        </div>
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-4 text-xs text-muted">
        <span>{t(`${plural(lang, activeDays, ['jour actif', 'jours actifs'], ['', ''])} en 12 mois`, `${activeDays} active ${activeDays === 1 ? 'day' : 'days'} in 12 months`)}</span>
        <span className="flex items-center gap-1" aria-hidden>
          {t('moins', 'less')}
          {LEVEL_BG.map((c, i) => (
            <span key={i} className={cx('size-3 rounded-[3px]', c)} />
          ))}
          {t('plus', 'more')}
        </span>
      </figcaption>
    </figure>
  )
}
