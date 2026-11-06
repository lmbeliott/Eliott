// Le programme en un coup d'œil : une case par problème, rangées par chapitre,
// colonnes par niveau. Les cases réussies se remplissent.
import { Link } from 'react-router-dom'
import { chapterTitle, levels, levelTitle, problemById, problemTitle } from '../lib/content'
import { formatPoints, useI18n } from '../lib/i18n'
import { cx, DifficultyMark } from './ui'

interface Props {
  solved?: Set<string>
  tried?: Set<string>
  /** Les cases sont des liens vers les problèmes */
  interactive?: boolean
  className?: string
}

export function CurriculumGrid({ solved = new Set(), tried = new Set(), interactive = true, className }: Props) {
  const { lang, t } = useI18n()
  return (
    <div className={cx('grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 xl:grid-cols-4', className)}>
      {levels.map((level, li) => {
        const ids = level.chapters.flatMap((c) => c.problems)
        const done = ids.filter((id) => solved.has(id)).length
        return (
          <section key={level.id} className="bg-surface p-5" aria-label={levelTitle(lang, level)}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-muted tabular">
                {t('Niveau', 'Level')} {li + 1}
              </p>
              <DifficultyMark difficulty={level.difficulty} className="text-xs" />
            </div>
            <h3 className="mt-1 text-lg font-semibold">{levelTitle(lang, level)}</h3>
            <p className="text-sm text-muted tabular">
              {done}/{ids.length} {t('réussis', 'solved')}
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {level.chapters.map((c) => (
                <li key={c.id}>
                  <Link to={`/parcours/${c.id}`} className="text-sm font-medium text-ink-2 hover:text-ink hover:underline">
                    {chapterTitle(lang, c)}
                  </Link>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {c.problems.map((id) => {
                      const p = problemById(id)!
                      const state = solved.has(id) ? 'solved' : tried.has(id) ? 'tried' : 'todo'
                      const label = `${problemTitle(lang, p)}, ${formatPoints(lang, p.points)}${state === 'solved' ? `, ${t('réussi', 'solved')}` : state === 'tried' ? `, ${t('tenté', 'attempted')}` : ''}`
                      const cls = cx(
                        'block size-5 rounded-[4px] border transition-colors',
                        state === 'solved' ? 'border-accent bg-accent' : state === 'tried' ? 'border-accent bg-accent-soft' : 'border-line-strong bg-surface-2',
                        interactive && 'hover:border-ink',
                      )
                      return interactive ? (
                        <Link key={id} to={`/probleme/${id}`} className={cls} aria-label={label} title={label} />
                      ) : (
                        <span key={id} className={cls} title={label} />
                      )
                    })}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
