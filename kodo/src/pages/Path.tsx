import { Link } from 'react-router-dom'
import { Check, ChevronRight } from 'lucide-react'
import { ElevationProfile } from '../components/ElevationProfile'
import { PageHeader, SlopeMark, cx } from '../components/ui'
import { chapterSummary, chapterTitle, levels, levelSummary, levelTitle, problemById } from '../lib/content'
import { formatAltitude, plural, useI18n } from '../lib/i18n'
import { useProgress } from '../lib/progress'

export function Path() {
  const { lang, t } = useI18n()
  const progress = useProgress()
  const solved = new Set(progress.solved.keys())
  let chapterNumber = 0
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
      <PageHeader
        title={t('Le parcours', 'The path')}
        lead={t(
          'Quatre pistes, de la plus douce à la plus raide. Chaque chapitre commence par un cours court, puis des problèmes de difficulté croissante.',
          'Four runs, from the gentlest to the steepest. Each chapter starts with a short lesson, followed by problems of increasing difficulty.',
        )}
      />
      <div className="rounded-xl border border-line bg-surface p-4 sm:p-6">
        <ElevationProfile solved={solved} />
      </div>

      <div className="mt-12 flex flex-col gap-14">
        {levels.map((level) => {
          const ids = level.chapters.flatMap((c) => c.problems)
          const done = ids.filter((id) => solved.has(id)).length
          return (
            <section key={level.id} aria-labelledby={`niveau-${level.id}`}>
              <div className="flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <SlopeMark slope={level.slope} />
                  <h2 id={`niveau-${level.id}`} className="mt-1 text-2xl font-semibold">
                    {levelTitle(lang, level)}
                  </h2>
                  <p className="mt-1 max-w-2xl text-ink-2">{levelSummary(lang, level)}</p>
                </div>
                <p className="text-sm text-muted tabular">
                  {done}/{ids.length} {t('problèmes réussis', 'problems solved')}
                </p>
              </div>
              <ol>
                {level.chapters.map((c) => {
                  chapterNumber++
                  const n = c.problems.length
                  const d = c.problems.filter((id) => solved.has(id)).length
                  const alt = c.problems.reduce((a, id) => a + (problemById(id)?.xp ?? 0), 0)
                  return (
                    <li key={c.id} className="border-b border-line">
                      <Link to={`/parcours/${c.id}`} className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 gap-y-1 py-4 hover:bg-surface/60 sm:grid-cols-[3rem_1fr_10rem_auto]">
                        <span className={cx('flex size-9 items-center justify-center rounded-full border text-sm font-semibold tabular', d === n && n > 0 ? 'border-transparent bg-ink text-snow' : 'border-line-strong text-ink-2')}>
                          {d === n && n > 0 ? <Check className="size-4" aria-label={t('Terminé', 'Completed')} /> : chapterNumber}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-semibold group-hover:underline">{chapterTitle(lang, c)}</span>
                          <span className="block text-sm text-ink-2">{chapterSummary(lang, c)}</span>
                        </span>
                        <span className="col-start-2 text-sm text-muted sm:col-start-3 sm:row-start-1">
                          {n === 0 ? (
                            t('Bientôt', 'Coming soon')
                          ) : (
                            <>
                              <span className="tabular">
                                {d}/{plural(lang, n, ['problème', 'problèmes'], ['problem', 'problems'])}
                              </span>
                              <span className="ml-2 tabular">+{formatAltitude(lang, alt)}</span>
                              <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-surface-3" aria-hidden>
                                <span className="block h-full bg-ink" style={{ width: `${n ? (d / n) * 100 : 0}%` }} />
                              </span>
                            </>
                          )}
                        </span>
                        <ChevronRight className="row-span-2 size-5 text-muted sm:row-span-1" aria-hidden />
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </section>
          )
        })}
      </div>
    </div>
  )
}
