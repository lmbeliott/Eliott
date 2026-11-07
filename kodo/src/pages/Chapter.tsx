import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, Check, Circle, CircleDot } from 'lucide-react'
import { Button, DifficultyMark, LinkButton, Notice, Segmented, Skeleton, cx, useDelayed, SectionCell } from '../components/ui'
import { availableChapters, chapterById, isAvailable, chapterSummary, chapterTitle, loadLesson, problemById, problemTitle } from '../lib/content'
import { formatPoints, plural, useI18n } from '../lib/i18n'
import { useCodeLang, useProgress } from '../lib/progress'
import { NotFound } from './NotFound'

export function ChapterPage() {
  const { id = '' } = useParams()
  const { lang, t } = useI18n()
  const chapter = chapterById(id)
  const progress = useProgress()
  const [codeLang, setCodeLang] = useCodeLang()
  const [pane, setPane] = useState<'lesson' | 'problems'>('lesson')
  const lesson = useQuery({ queryKey: ['lesson', id], queryFn: () => loadLesson(id), enabled: !!chapter?.lessonMinutes, staleTime: Infinity })
  const showSkeleton = useDelayed(lesson.isLoading)
  if (!chapter) return <NotFound />
  if (!isAvailable(chapter))
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
        <Link to="/parcours" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
          <ArrowLeft className="size-4" aria-hidden /> {t('Parcours', 'Path')}
        </Link>
        <header className="mt-3 max-w-3xl">
          <h1 className="text-3xl font-semibold">{chapterTitle(lang, chapter)}</h1>
          <p className="mt-2 text-lg text-ink-2">{chapterSummary(lang, chapter)}</p>
          <p className="mt-4 text-sm text-muted">{t('Chapitre indisponible pour l’instant.', 'Chapter not available yet.')}</p>
        </header>
      </div>
    )
  const idx = availableChapters.findIndex((c) => c.id === id)
  const prev = availableChapters[idx - 1]
  const next = availableChapters[idx + 1]
  const firstTodo = chapter.problems.find((p) => !progress.solved.has(p))
  const body = lesson.data ? (lang === 'en' && lesson.data.en ? lesson.data.en : lesson.data.fr) : null

  const problems = (
    <div>
      <h2 className="text-lg font-semibold"><SectionCell />{t('Exercices du chapitre', 'Exercises in this chapter')}</h2>
      <ol className="mt-3 overflow-hidden rounded-lg border border-line bg-surface">
        {chapter.problems.map((pid, i) => {
          const p = problemById(pid)!
          const solved = progress.solved.has(pid)
          const tried = !solved && progress.tried.has(pid)
          return (
            <li key={pid} className="border-b border-line last:border-0">
              <Link to={`/probleme/${pid}`} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2">
                {solved ? (
                  <Check className="size-5 shrink-0 text-ok" aria-label={t('Réussi', 'Solved')} />
                ) : tried ? (
                  <CircleDot className="size-5 shrink-0 text-accent" aria-label={t('Tenté', 'Attempted')} />
                ) : (
                  <Circle className="size-5 shrink-0 text-line-strong" aria-label={t('À faire', 'To do')} />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">
                    <span className="mr-1.5 text-muted tabular">{i + 1}.</span>
                    {problemTitle(lang, p)}
                  </span>
                </span>
                <span className="shrink-0 text-sm text-muted tabular">+{formatPoints(lang, p.points)}</span>
              </Link>
            </li>
          )
        })}
        {chapter.problems.length === 0 && <li className="px-4 py-3 text-sm text-muted">{t('Problèmes de ce chapitre à venir.', 'Problems for this chapter coming soon.')}</li>}
      </ol>
      {firstTodo && (
        <LinkButton to={`/probleme/${firstTodo}`} className="mt-4 w-full">
          {progress.solved.size && chapter.problems.some((p) => progress.solved.has(p)) ? t('Continuer', 'Continue') : t('Commencer les problèmes', 'Start the problems')}
          <ArrowRight className="size-4" aria-hidden />
        </LinkButton>
      )}
    </div>
  )

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
      <Link to="/parcours" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> {t('Parcours', 'Path')}
      </Link>
      <header className="mt-3 max-w-3xl">
        <DifficultyMark difficulty={chapter.level.difficulty} />
        <h1 className="mt-1 text-3xl font-semibold">{chapterTitle(lang, chapter)}</h1>
        <p className="mt-2 text-lg text-ink-2">{chapterSummary(lang, chapter)}</p>
        <p className="mt-2 text-sm text-muted">
          {chapter.lessonMinutes ? t(`Cours : ${chapter.lessonMinutes} min de lecture`, `Lesson: ${chapter.lessonMinutes} min read`) : null}
          {chapter.lessonMinutes ? ', ' : ''}
          {plural(lang, chapter.problems.length, ['problème', 'problèmes'], ['problem', 'problems'])}
        </p>
      </header>

      <div className="mt-6 lg:hidden">
        <Segmented
          label={t('Affichage', 'View')}
          value={pane}
          onChange={setPane}
          options={[
            { value: 'lesson', label: t('Cours', 'Lesson') },
            { value: 'problems', label: `${t('Problèmes', 'Problems')} (${chapter.problems.length})` },
          ]}
        />
      </div>

      <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <article className={cx(pane === 'lesson' ? 'block' : 'hidden', 'lg:block')}>
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-line pb-4">
            <p className="text-sm text-muted">{t('Exemples de code en', 'Code examples in')}</p>
            <Segmented
              size="sm"
              label={t('Langage des exemples', 'Example language')}
              value={codeLang}
              onChange={setCodeLang}
              options={[
                { value: 'python', label: 'Python' },
                { value: 'cpp', label: 'C++' },
              ]}
            />
          </div>
          {lesson.isError ? (
            <Notice tone="error" action={<Button size="sm" variant="secondary" onClick={() => lesson.refetch()}>{t('Réessayer', 'Try again')}</Button>}>
              {t('Chargement du cours impossible. Vérifier la connexion internet puis réessayer.', 'The lesson could not be loaded. Check the internet connection, then try again.')}
            </Notice>
          ) : body ? (
            <>
              <div className="prose-kodo" dangerouslySetInnerHTML={{ __html: body.html }} />
              {lang === 'en' && !lesson.data?.en && <p className="mt-6 text-sm text-muted">Not yet translated into English: lesson shown in French.</p>}
            </>
          ) : !chapter.lessonMinutes ? (
            <p className="text-muted">{t('Cours de ce chapitre à venir.', 'Lesson for this chapter coming soon.')}</p>
          ) : showSkeleton ? (
            <div className="flex max-w-2xl flex-col gap-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-32" />
            </div>
          ) : null}
          <nav className="mt-12 flex justify-between gap-4 border-t border-line pt-6" aria-label={t('Chapitres', 'Chapters')}>
            {prev ? (
              <Link to={`/parcours/${prev.id}`} className="text-sm">
                <span className="block text-muted">{t('Chapitre précédent', 'Previous chapter')}</span>
                <span className="font-medium hover:underline">{chapterTitle(lang, prev)}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link to={`/parcours/${next.id}`} className="text-right text-sm">
                <span className="block text-muted">{t('Chapitre suivant', 'Next chapter')}</span>
                <span className="font-medium hover:underline">{chapterTitle(lang, next)}</span>
              </Link>
            )}
          </nav>
        </article>
        <aside className={cx(pane === 'problems' ? 'block' : 'hidden', 'lg:block')}>
          <div className="lg:sticky lg:top-20">{problems}</div>
        </aside>
      </div>
    </div>
  )
}
