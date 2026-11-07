import { Link } from 'react-router-dom'
import { Check, ChevronRight } from 'lucide-react'
import { DifficultyMark, Skeleton } from './ui'
import { openLevels, problemById, problemTitle, themeById, themeTitle } from '../lib/content'
import { formatPoints, useI18n } from '../lib/i18n'

/** Défi du jour : une ligne par niveau, dans un panneau à filets. */
export function DailyList({ daily, loading, solved }: { daily?: { level: string; problem_id: string }[]; loading: boolean; solved: Map<string, unknown> }) {
  const { lang, t } = useI18n()
  if (loading) return <Skeleton className="h-48" />
  const rows = openLevels
    .map((l) => ({ level: l, id: daily?.find((d) => d.level === l.id)?.problem_id }))
    .filter((r): r is { level: (typeof openLevels)[number]; id: string } => !!r.id && !!problemById(r.id))
  if (!rows.length) return <p className="text-sm text-muted">{t('Chargement du défi du jour impossible. Recharger la page.', 'The daily challenge could not be loaded. Reload the page.')}</p>
  return (
    <ul className="overflow-hidden rounded-lg bg-surface shadow-[inset_0_0_0_1px_var(--line),var(--edge)]">
      {rows.map(({ level, id }) => {
        const p = problemById(id)!
        const ch = themeById(p.chapter)
        const done = solved.has(id)
        return (
          <li key={level.id} className="border-b border-line last:border-0">
            <Link to={`/probleme/${id}`} className="group grid grid-cols-[6.5rem_1fr_auto] items-center gap-4 px-4 py-3 transition-colors hover:bg-surface-2 sm:grid-cols-[7.5rem_1fr_auto_auto]">
              <DifficultyMark difficulty={level.difficulty} />
              <span className="min-w-0">
                <span className="block truncate font-medium">{problemTitle(lang, p)}</span>
                {ch && <span className="block truncate text-sm text-muted">{themeTitle(lang, ch)}</span>}
              </span>
              <span className="hidden text-right text-sm sm:block">
                {done ? (
                  <span className="inline-flex items-center gap-1 text-ok">
                    <Check className="size-4" aria-hidden /> {t('Réussi', 'Solved')}
                  </span>
                ) : (
                  <span className="tabular text-ink-2">
                    +{formatPoints(lang, Math.round(p.points * 1.5))}
                    <span className="ml-1.5 text-muted">{t('avec le bonus', 'with bonus')}</span>
                  </span>
                )}
              </span>
              <ChevronRight className="size-4 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
