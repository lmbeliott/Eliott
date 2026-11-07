// Le parcours (motif Liste, DESIGN.md §8) : une seule piste, niveau par niveau,
// chaque chapitre en ligne avec ses problèmes sous forme de cellules.
import { Link } from 'react-router-dom'
import { BookOpen, Check } from 'lucide-react'
import { Cell } from '../components/Cell'
import { DifficultyMark, LinkButton, Panel, cx } from '../components/ui'
import { chapters, chapterSummary, chapterTitle, levels, levelSummary, levelTitle, problemById, problemList, problemTitle, totalPoints, type Level } from '../lib/content'
import { useAuth } from '../lib/auth'
import { formatNumber, formatPoints, plural, useI18n, type UiLang } from '../lib/i18n'
import { useProgress } from '../lib/progress'

/** « 3 ou 4 », « 4 » : bornes réelles tirées du catalogue. */
function range(lang: UiLang, values: number[]) {
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  if (lo === hi) return formatNumber(lang, lo)
  return `${formatNumber(lang, lo)} ${lang === 'en' ? 'to' : 'à'} ${formatNumber(lang, hi)}`
}

function levelPoints(lang: UiLang, level: Level) {
  const pts = level.chapters.flatMap((c) => c.problems.map((id) => problemById(id)?.points ?? 0))
  const lo = Math.min(...pts)
  const hi = Math.max(...pts)
  return lo === hi ? formatPoints(lang, lo) : `${formatNumber(lang, lo)}–${formatPoints(lang, hi)}`
}

export function Path() {
  const { lang, t } = useI18n()
  const { profile } = useAuth()
  const progress = useProgress()
  const solved = progress.solved
  const tried = progress.tried
  const total = problemList.length
  const solvedCount = problemList.filter((p) => solved.has(p.id)).length
  const next = problemList.find((p) => !solved.has(p.id))
  const minutes = chapters.map((c) => c.lessonMinutes).filter((m): m is number => !!m)
  const perChapter = chapters.map((c) => c.problems.length).filter(Boolean)

  let chapterNumber = 0
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-8 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[38rem]">
          <h1 className="display text-2xl">{t('Parcours', 'Path')}</h1>
          <p className="mt-3 text-ink-2">
            {t(
              `${chapters.length} chapitres répartis en ${levels.length} niveaux. Chaque chapitre commence par un cours de ${range(lang, minutes)} min, suivi de ${range(lang, perChapter)} problèmes à résoudre en Python ou en C++.`,
              `${chapters.length} chapters across ${levels.length} levels. Each chapter opens with a ${range(lang, minutes)}-minute lesson, followed by ${range(lang, perChapter)} problems to solve in Python or C++.`,
            )}
          </p>
        </div>

        <div className="flex flex-col gap-5 lg:items-end">
          <dl className="flex gap-10">
            <div>
              <dt className="text-sm text-muted">{t('Problèmes réussis', 'Problems solved')}</dt>
              <dd className="mt-1 text-xl font-semibold leading-none">
                {formatNumber(lang, solvedCount)}
                <span className="font-normal text-muted"> / {formatNumber(lang, total)}</span>
              </dd>
            </div>
            {!progress.guest && (
              <div>
                <dt className="text-sm text-muted">{t('Points gagnés', 'Points earned')}</dt>
                <dd className="mt-1 text-xl font-semibold leading-none">{formatPoints(lang, profile?.xp ?? [...solved.values()].reduce((a, s) => a + s.xp, 0))}</dd>
              </div>
            )}
          </dl>
          {next && (
            <LinkButton to={`/probleme/${next.id}`} className="self-start lg:self-end">
              {t(`Ouvrir ${problemTitle(lang, next)}`, `Open ${problemTitle(lang, next)}`)}
            </LinkButton>
          )}
        </div>
      </header>

      <p className="mt-4 text-sm text-muted">
        {progress.guest ? (
          <>
            {t(
              `Sans compte, réussites conservées dans ce navigateur, sans points. Les ${total} problèmes valent ${formatPoints(lang, totalPoints)} hors bonus. `,
              `Without an account, solved problems are kept in this browser and earn no points. The ${total} problems are worth ${formatPoints(lang, totalPoints)} before bonuses. `,
            )}
            <Link to="/inscription" className="font-medium text-ink underline underline-offset-2 hover:text-accent">
              {t('Créer un compte', 'Create an account')}
            </Link>
          </>
        ) : (
          t(
            `Les ${total} problèmes valent ${formatPoints(lang, totalPoints)} hors bonus : +20 % si la première soumission est acceptée, +50 % pour le défi du jour.`,
            `The ${total} problems are worth ${formatPoints(lang, totalPoints)} before bonuses: +20% if the first submission is accepted, +50% for the daily challenge.`,
          )
        )}
      </p>

      <div className="mt-12 flex flex-col gap-12">
        {levels.map((level, li) => {
          const ids = level.chapters.flatMap((c) => c.problems)
          const done = ids.filter((id) => solved.has(id)).length
          const headingId = `niveau-${level.id}`
          return (
            <section key={level.id} aria-labelledby={headingId} className="grid gap-5 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
              <div className="lg:pt-3">
                <p className="text-sm text-muted">{t(`Niveau ${li + 1}`, `Level ${li + 1}`)}</p>
                <h2 id={headingId} className="display mt-1 text-xl">
                  {levelTitle(lang, level)}
                </h2>
                <DifficultyMark difficulty={level.difficulty} className="mt-2" />
                <p className="mt-3 text-sm text-ink-2">{levelSummary(lang, level)}</p>
                <dl className="mt-4 flex gap-6 text-sm lg:flex-col lg:gap-1.5">
                  <div className="flex gap-1.5">
                    <dt className="text-muted">{t('Réussis', 'Solved')}</dt>
                    <dd className="font-medium">
                      {done} / {ids.length}
                    </dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="text-muted">{t('Par problème', 'Per problem')}</dt>
                    <dd className="font-medium">{levelPoints(lang, level)}</dd>
                  </div>
                </dl>
              </div>

              <Panel as="div" className="overflow-hidden">
                <ol className="divide-y divide-line">
                  {level.chapters.map((c) => {
                    chapterNumber++
                    const n = c.problems.length
                    const d = c.problems.filter((id) => solved.has(id)).length
                    const complete = n > 0 && d === n
                    const pts = c.problems.reduce((a, id) => a + (problemById(id)?.points ?? 0), 0)
                    return (
                      <li key={c.id} className="group relative grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3 px-4 py-4 transition-colors hover:bg-surface-2/70 sm:px-5 md:grid-cols-[1.75rem_minmax(0,1fr)_auto_4.5rem_4.5rem] md:items-center md:gap-x-5">
                        <span className={cx('pt-px text-sm tabular md:pt-0', complete ? 'text-accent' : 'text-muted')}>
                          {complete ? <Check className="size-4" aria-label={t(`Chapitre ${chapterNumber} terminé`, `Chapter ${chapterNumber} completed`)} /> : chapterNumber}
                        </span>
                        <div className="min-w-0">
                          <Link to={`/parcours/${c.id}`} className="font-medium text-ink after:absolute after:inset-0 group-hover:underline group-hover:underline-offset-2">
                            {chapterTitle(lang, c)}
                          </Link>
                          <p className="mt-0.5 text-sm text-ink-2">{chapterSummary(lang, c)}</p>
                        </div>

                        <div className="col-start-2 mt-3 flex items-center gap-5 md:col-start-auto md:mt-0 md:contents">
                          <span className="relative z-10 flex items-center gap-1" aria-label={t(`${d} sur ${n} réussis`, `${d} of ${n} solved`)}>
                            {n === 0 ? (
                              <span className="text-sm text-muted">{t('Problèmes à venir', 'Problems coming')}</span>
                            ) : (
                              c.problems.map((id) => {
                                const p = problemById(id)!
                                const state = solved.has(id) ? 'done' : tried.has(id) ? 'tried' : 'empty'
                                const label = `${problemTitle(lang, p)}, ${formatPoints(lang, p.points)}${state === 'done' ? `, ${t('réussi', 'solved')}` : state === 'tried' ? `, ${t('tenté', 'attempted')}` : ''}`
                                return <Cell key={id} state={state} size="lg" label={label} to={`/probleme/${id}`} />
                              })
                            )}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-sm text-muted md:justify-end">
                            <BookOpen className="size-3.5" aria-hidden />
                            {c.lessonMinutes ? <span>{t(`${c.lessonMinutes} min`, `${c.lessonMinutes} min`)}</span> : <span>{t('à venir', 'coming')}</span>}
                            <span className="sr-only">{t('de cours', 'of lesson')}</span>
                          </span>
                          <span className="ml-auto text-sm text-ink-2 tabular md:ml-0 md:text-right">{formatPoints(lang, pts)}</span>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </Panel>
            </section>
          )
        })}
      </div>

      <p className="mt-12 border-t border-line pt-6 text-sm text-muted">
        {t(
          `${plural(lang, total, ['problème', 'problèmes'], ['problem', 'problems'])}, de ${problemTitle(lang, problemList[0])} à ${problemTitle(lang, problemList[total - 1])}. `,
          `${plural(lang, total, ['problème', 'problèmes'], ['problem', 'problems'])}, from ${problemTitle(lang, problemList[0])} to ${problemTitle(lang, problemList[total - 1])}. `,
        )}
        <Link to="/problemes" className="font-medium text-ink underline underline-offset-2 hover:text-accent">
          {t(`Voir les ${total} problèmes en tableau`, `See all ${total} problems as a table`)}
        </Link>
      </p>
    </div>
  )
}
