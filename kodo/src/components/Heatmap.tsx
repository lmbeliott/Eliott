import { useMemo } from 'react'
import { formatDate, plural, useI18n } from '../lib/i18n'
import { parisDay } from '../lib/supabase'

/** Calendrier d'activité : une case par jour, les 26 dernières semaines. */
export function Heatmap({ days, weeks = 26 }: { days: { day: string; submissions: number; solves: number }[]; weeks?: number }) {
  const { lang, t } = useI18n()
  const byDay = useMemo(() => new Map(days.map((d) => [d.day, d])), [days])
  const grid = useMemo(() => {
    const today = new Date()
    const dow = (today.getDay() + 6) % 7 // lundi = 0
    const start = new Date(today.getTime() - ((weeks - 1) * 7 + dow) * 86400_000)
    const cols: { date: Date; key: string; future: boolean }[][] = []
    for (let w = 0; w < weeks; w++) {
      const col = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(start.getTime() + (w * 7 + d) * 86400_000)
        col.push({ date, key: parisDay(date), future: date > today })
      }
      cols.push(col)
    }
    return cols
  }, [weeks])
  const activeDays = days.filter((d) => d.submissions > 0).length
  const level = (n: number) => (n === 0 ? 0 : n < 3 ? 1 : n < 6 ? 2 : n < 10 ? 3 : 4)
  const fill = ['var(--surface-2)', 'color-mix(in oklab, var(--verte) 30%, var(--surface))', 'color-mix(in oklab, var(--verte) 55%, var(--surface))', 'color-mix(in oklab, var(--verte) 80%, var(--surface))', 'var(--verte)']
  const cell = 12
  const gap = 3
  return (
    <figure>
      <div className="overflow-x-auto">
        <svg
          width={weeks * (cell + gap)}
          height={7 * (cell + gap)}
          role="img"
          aria-label={t(`Activité : ${plural(lang, activeDays, ['jour actif', 'jours actifs'], ['', ''])} sur les ${weeks} dernières semaines`, `Activity: ${activeDays} active days over the last ${weeks} weeks`)}
        >
          {grid.map((col, w) =>
            col.map((c, d) => {
              if (c.future) return null
              const a = byDay.get(c.key)
              const n = a?.submissions ?? 0
              return (
                <rect key={c.key} x={w * (cell + gap)} y={d * (cell + gap)} width={cell} height={cell} rx="2.5" fill={fill[level(n)]}>
                  <title>
                    {formatDate(lang, c.date, { weekday: 'long', day: 'numeric', month: 'long' })} :{' '}
                    {n === 0
                      ? t('rien', 'nothing')
                      : `${plural(lang, n, ['soumission', 'soumissions'], ['submission', 'submissions'])}${a?.solves ? `, ${plural(lang, a.solves, ['réussite', 'réussites'], ['solve', 'solves'])}` : ''}`}
                  </title>
                </rect>
              )
            }),
          )}
        </svg>
      </div>
      <figcaption className="mt-2 flex items-center gap-1.5 text-xs text-muted">
        {t('Moins', 'Less')}
        {fill.map((f, i) => (
          <span key={i} className="inline-block size-2.5 rounded-[2px]" style={{ background: f }} aria-hidden />
        ))}
        {t('Plus', 'More')}
      </figcaption>
    </figure>
  )
}
