import { formatPoints, useI18n } from '../lib/i18n'
import { leagueMeaning, leagueName, leagueOf, type League } from '../lib/leagues'
import { cx } from './ui'

/** Pastille de rang : le kanji du rang sur sa teinte, puis son nom. Le sens apparaît au survol. */
export function LeagueBadge({ league, className, kanji }: { league: League; className?: string; kanji?: boolean }) {
  const { lang } = useI18n()
  return (
    <span className={cx('inline-flex items-center gap-1.5 text-sm font-medium', className)} title={`${league.kanji} · ${leagueMeaning(lang, league)}`}>
      <span
        aria-hidden
        lang="ja"
        className="inline-flex size-5 shrink-0 items-center justify-center rounded-[5px] text-[12px] font-semibold leading-none text-white"
        style={{ background: league.tone }}
      >
        {league.glyph}
      </span>
      {leagueName(lang, league)}
      {kanji && (
        <span lang="ja" className="font-normal text-muted">
          {league.kanji}
        </span>
      )}
    </span>
  )
}

/** Points, rang actuel et distance jusqu'au suivant. */
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
            aria-label={t('Progression vers le rang suivant', 'Progress to the next rank')}
          >
            <div className="h-full rounded-full bg-accent transition-[width] duration-700" style={{ width: `${Math.max(2, l.ratio * 100)}%` }} />
          </div>
          <p className="mt-2 text-sm text-ink-2">
            {t(
              `Encore ${formatPoints(lang, l.remaining)} avant le rang ${leagueName(lang, l.next)}.`,
              `${formatPoints(lang, l.remaining)} to go before the ${leagueName(lang, l.next)} rank.`,
            )}
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm text-ink-2">{t('Rang le plus haut atteint.', 'Top rank reached.')}</p>
      )}
    </div>
  )
}
