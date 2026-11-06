import { formatPoints, useI18n } from '../lib/i18n'
import { leagueName, leagueOf, type League } from '../lib/leagues'
import { cx } from './ui'

/** Pastille de ligue : un losange à la teinte de la ligue, et son nom. */
export function LeagueBadge({ league, className }: { league: League; className?: string }) {
  const { lang } = useI18n()
  return (
    <span className={cx('inline-flex items-center gap-1.5 text-sm font-medium', className)}>
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
        <path d="M6 0.8 11.2 6 6 11.2 0.8 6Z" fill={league.tone} />
      </svg>
      {leagueName(lang, league)}
    </span>
  )
}

/** Points, ligue actuelle et distance jusqu'à la suivante. */
export function LeagueProgress({ points }: { points: number }) {
  const { lang, t } = useI18n()
  const l = leagueOf(points)
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="display text-3xl font-semibold tabular">{formatPoints(lang, points)}</p>
        <LeagueBadge league={l.current} />
      </div>
      {l.next ? (
        <>
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-3"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(l.ratio * 100)}
            aria-label={t('Progression vers la ligue suivante', 'Progress to the next league')}
          >
            <div className="h-full rounded-full bg-accent transition-[width] duration-700" style={{ width: `${Math.max(2, l.ratio * 100)}%` }} />
          </div>
          <p className="mt-2 text-sm text-ink-2">
            {t(
              `Encore ${formatPoints(lang, l.remaining)} pour la ligue ${leagueName(lang, l.next)}.`,
              `${formatPoints(lang, l.remaining)} to go for the ${leagueName(lang, l.next)} league.`,
            )}
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm text-ink-2">{t('Ligue la plus haute atteinte.', 'Top league reached.')}</p>
      )}
    </div>
  )
}
