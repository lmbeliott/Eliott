import { Link } from 'react-router-dom'
import { Flame } from 'lucide-react'
import type { LeaderRow } from '../lib/supabase'
import { formatNumber, formatPoints, useI18n } from '../lib/i18n'
import { leagueOf } from '../lib/leagues'
import { LeagueBadge } from './League'
import { Avatar, cx, Skeleton } from './ui'

/** Classement : tableau L1 à filets ; ta ligne surlignée (DESIGN.md §5). */
export function LeaderboardTable({ rows, loading, compact, empty }: { rows: LeaderRow[] | undefined; loading?: boolean; compact?: boolean; empty?: React.ReactNode }) {
  const { lang, t } = useI18n()
  if (loading)
    return (
      <div className="flex flex-col gap-px overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_var(--line)]">
        {Array.from({ length: compact ? 5 : 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-none" />
        ))}
      </div>
    )
  if (!rows?.length) return <>{empty}</>
  const sorted = [...rows].sort((a, b) => a.rank - b.rank)
  return (
    <div className="overflow-hidden rounded-lg bg-surface shadow-[inset_0_0_0_1px_var(--line),var(--edge)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line bg-surface-2 text-left text-xs text-muted">
            <th scope="col" className="h-9 w-14 pl-4 font-medium">
              {t('Rang', 'Rank')}
            </th>
            <th scope="col" className="font-medium">
              {t('Nom', 'Name')}
            </th>
            {!compact && (
              <th scope="col" className="hidden font-medium md:table-cell">
                {t('Établissement', 'School')}
              </th>
            )}
            {!compact && (
              <th scope="col" className="hidden font-medium lg:table-cell">
                {t('Ligue', 'League')}
              </th>
            )}
            {!compact && (
              <th scope="col" className="hidden pr-4 text-right font-medium sm:table-cell">
                {t('Problèmes', 'Problems')}
              </th>
            )}
            {!compact && (
              <th scope="col" className="hidden pr-4 text-right font-medium sm:table-cell">
                {t('Série', 'Streak')}
              </th>
            )}
            <th scope="col" className="pr-4 text-right font-medium">
              {t('Points', 'Points')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r, i) => {
            const gap = i > 0 && r.rank > sorted[i - 1].rank + 1
            return (
              <tr
                key={r.user_id}
                className={cx('border-b border-line transition-colors last:border-0', r.is_me ? 'bg-accent-soft' : 'hover:bg-surface-2', gap && 'border-t-[6px] border-t-surface-2')}
              >
                <td className={cx('h-12 pl-4 tabular', r.rank <= 3 ? 'font-semibold text-ink' : 'text-muted')}>{r.rank}</td>
                <td className="py-2 pr-3">
                  <Link to={`/profil/${r.username}`} className="group flex min-w-0 items-center gap-3">
                    <Avatar name={r.display_name} size={28} />
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-ink group-hover:underline">
                        {r.display_name}
                        {r.is_me && <span className="ml-2 text-xs font-normal text-accent">{t('moi', 'me')}</span>}
                      </span>
                      {!compact && <span className="block truncate text-xs text-muted">@{r.username}</span>}
                    </span>
                  </Link>
                </td>
                {!compact && <td className="hidden max-w-52 truncate pr-3 text-ink-2 md:table-cell">{r.school ?? <span className="text-muted">–</span>}</td>}
                {!compact && (
                  <td className="hidden pr-3 lg:table-cell">
                    <LeagueBadge league={leagueOf(Number(r.xp)).current} className="font-normal text-ink-2" />
                  </td>
                )}
                {!compact && <td className="hidden pr-4 text-right tabular text-ink-2 sm:table-cell">{formatNumber(lang, Number(r.solved))}</td>}
                {!compact && (
                  <td className="hidden pr-4 text-right tabular text-ink-2 sm:table-cell">
                    {r.streak > 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <Flame className="size-3.5 text-warn" aria-hidden />
                        {r.streak}
                      </span>
                    ) : (
                      <span className="text-muted">–</span>
                    )}
                  </td>
                )}
                <td className="pr-4 text-right font-medium tabular">{formatPoints(lang, Number(r.xp))}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
