// Le programme en un coup d'œil : une cellule par problème (DESIGN.md §1, §5).
// Colonnes = niveaux ; lignes = chapitres, avec leurs cellules alignées à droite.
import { Link } from 'react-router-dom'
import { chapterTitle, isAvailable, levelAvailable, levels, levelTitle, problemById, problemTitle } from '../lib/content'
import { formatPoints, useI18n } from '../lib/i18n'
import { Cell } from './Cell'
import { cx, DifficultyMark } from './ui'

interface Props {
  solved?: Set<string>
  tried?: Set<string>
  /** Les cellules sont des liens vers les problèmes */
  interactive?: boolean
  className?: string
}

export function CurriculumGrid({ solved = new Set(), tried = new Set(), interactive = true, className }: Props) {
  const { lang, t } = useI18n()
  return (
    <div className={cx('grid overflow-hidden rounded-lg bg-surface shadow-[inset_0_0_0_1px_var(--line),var(--edge)] sm:grid-cols-2 xl:grid-cols-3', className)}>
      {levels.map((level, li) => {
        const ids = level.chapters.flatMap((c) => c.problems)
        const done = ids.filter((id) => solved.has(id)).length
        return (
          <section
            key={level.id}
            aria-label={levelTitle(lang, level)}
            className={cx(
              'flex flex-col border-line p-4',
              li > 0 && 'border-t',
              li % 2 === 1 && 'sm:border-l',
              li < 2 && 'sm:border-t-0',
              'xl:border-l-0 xl:border-t-0',
              li % 3 !== 0 && 'xl:border-l',
              li >= 3 && 'xl:border-t',
              !levelAvailable(level) && 'opacity-60',
            )}
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-base font-semibold">
                <span className="mr-2 text-muted tabular">{li + 1}</span>
                {levelTitle(lang, level)}
              </h3>
              <span className="text-xs text-muted tabular">{levelAvailable(level) ? `${done}/${ids.length}` : t('Bientôt', 'Soon')}</span>
            </div>
            <DifficultyMark difficulty={level.difficulty} className="mt-1 text-xs" />
            <ul className="mt-4 flex flex-col">
              {level.chapters.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 border-t border-line py-2.5">
                  {isAvailable(c) ? (
                    <Link to={`/parcours/${c.id}`} className="min-w-0 truncate text-sm text-ink-2 hover:text-ink hover:underline">
                      {chapterTitle(lang, c)}
                    </Link>
                  ) : (
                    <span className="min-w-0 truncate text-sm text-muted">{chapterTitle(lang, c)}</span>
                  )}
                  <span className="flex shrink-0 gap-1">
                    {c.problems.map((id) => {
                      const p = problemById(id)!
                      const state = solved.has(id) ? 'done' : tried.has(id) ? 'tried' : 'empty'
                      const label = `${problemTitle(lang, p)}, ${formatPoints(lang, p.points)}${state === 'done' ? `, ${t('réussi', 'solved')}` : state === 'tried' ? `, ${t('tenté', 'attempted')}` : ''}`
                      return <Cell key={id} state={state} label={label} to={interactive ? `/probleme/${id}` : undefined} />
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
