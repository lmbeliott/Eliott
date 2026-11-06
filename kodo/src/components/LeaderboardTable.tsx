import { Link } from 'react-router-dom'
import { Flame } from 'lucide-react'
import type { LeaderRow } from '../lib/supabase'
import { formatNumber, formatPoints, useI18n } from '../lib/i18n'
import { leagueOf } from '../lib/leagues'
import { LeagueBadge } from './League'
import { Avatar, cx, Skeleton } from './ui'

export function LeaderboardTable({ rows, loading, compact, empty }: { rows: LeaderRow[] | undefined; loading?: boolean; compact?: boolean; empty?: React.ReactNode }) {
  const { lang, t } = useI18n()
  if (loading)
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: compact ? 5 : 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12" />
        ))}
      </div>
    )
  if (!rows?.length) return <>{empty}</>
  // Ligne « toi » séparée si elle est hors du top affiché.
  const sorted = [...rows].sort((a, b) => a.rank - b.rank)
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <table className="w-full text-sm">
        <thead className="border-b border-line bg-surface-2 text-left text-xs text-muted">
          <tr>
            <th scope="col" className="w-14 py-2.5 pl-4 font-medium">
              {t('Rang', 'Rank')}
            </th>
            <th scope="col" className="py-2.5 font-medium">
              {t('Nom', 'Name')}
            </th>
            {!compact && (
              <th scope="col" className="hidden py-2.5 font-medium md:table-cell">
                {t('Établissement', 'School')}
              </th>
            )}
            {!compact && (
              <th scope="col" className="hidden py-2.5 font-medium lg:table-cell">
                {t('Ligue', 'League')}
              </th>
            )}
            <th scope="col" className="py-2.5 pr-4 text-right font-medium">
              {t('Points', 'Points')}
            </th>
            {!compact && (
              <th scope="col" className="hidden py-2.5 pr-4 text-right font-medium sm:table-cell">
                {t('Problèmes', 'Problems')}
              </th>
            )}
            {!compact && (
              <th scope="col" className="hidden py-2.5 pr-4 text-right font-medium sm:table-cell">
                {t('Série', 'Streak')}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r, i) => {
            const gap = i > 0 && r.rank > sorted[i - 1].rank + 1
            return (
              <tr
                key={r.user_id}
                className={cx(
                  'border-b border-line last:border-0',
                  r.is_me && 'bg-accent-soft shadow-[inset_3px_0_0_var(--accent)]',
                  gap && 'border-t-4 border-t-surface-2',
                )}
              >
                <td className={cx('py-2.5 pl-4 tabular', r.rank <= 3 ? 'font-semibold text-ink' : 'text-muted')}>{r.rank}</td>
                <td className="py-2 pr-2">
                  <Link to={`/profil/${r.username}`} className="flex min-w-0 items-center gap-2.5 hover:underline">
                    <Avatar name={r.display_name} size={28} />
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-ink">
                        {r.display_name}
                        {r.is_me && <span className="ml-1.5 text-xs font-normal text-ink-2">({t('toi', 'you')})</span>}
                      </span>
                      {!compact && <span className="block truncate text-xs text-muted">@{r.username}</span>}
                    </span>
                  </Link>
                </td>
                {!compact && <td className="hidden max-w-48 truncate py-2.5 text-ink-2 md:table-cell">{r.school ?? ''}</td>}
                {!compact && (
                  <td className="hidden py-2.5 lg:table-cell">
                    <LeagueBadge league={leagueOf(Number(r.xp)).current} className="font-normal text-ink-2" />
                  </td>
                )}
                <td className="py-2.5 pr-4 text-right font-medium tabular">{formatPoints(lang, Number(r.xp))}</td>
                {!compact && <td className="hidden py-2.5 pr-4 text-right tabular text-ink-2 sm:table-cell">{formatNumber(lang, Number(r.solved))}</td>}
                {!compact && (
                  <td className="hidden py-2.5 pr-4 text-right tabular text-ink-2 sm:table-cell">
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
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
