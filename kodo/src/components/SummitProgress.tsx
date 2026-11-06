import { formatAltitude, useI18n } from '../lib/i18n'
import { summitName, summitProgress } from '../lib/summits'

/** Altitude actuelle et distance jusqu'au prochain sommet. */
export function SummitProgress({ xp }: { xp: number }) {
  const { lang, t } = useI18n()
  const p = summitProgress(xp)
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="display text-3xl font-semibold tabular">{formatAltitude(lang, xp)}</p>
        {p.last && <p className="text-sm text-ink-2">{t(`Au-dessus du ${summitName(lang, p.last)}`, `Above ${summitName(lang, p.last)}`)}</p>}
      </div>
      {p.next ? (
        <>
          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-surface-3"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(p.ratio * 100)}
            aria-label={t('Progression vers le prochain sommet', 'Progress to the next summit')}
          >
            <div className="h-full rounded-full bg-ink transition-[width] duration-700" style={{ width: `${Math.max(2, p.ratio * 100)}%` }} />
          </div>
          <p className="mt-2 text-sm text-ink-2">
            {t(
              `Prochain sommet : ${summitName(lang, p.next)} (${formatAltitude(lang, p.next.meters)}), encore ${formatAltitude(lang, p.remaining)}.`,
              `Next summit: ${summitName(lang, p.next)} (${formatAltitude(lang, p.next.meters)}), ${formatAltitude(lang, p.remaining)} to go.`,
            )}
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm text-ink-2">{t('Tu as dépassé l’Everest. Respect.', 'You are above Everest. Respect.')}</p>
      )}
    </div>
  )
}
