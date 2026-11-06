import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Flame } from 'lucide-react'

import { LeagueProgress } from '../components/League'
import { CurriculumGrid } from '../components/CurriculumGrid'
import { Heatmap } from '../components/Heatmap'
import { DifficultyMark, LinkButton, Skeleton, cx } from '../components/ui'
import { useAuth } from '../lib/auth'
import { chapterById, chapterTitle, problemList, problemTitle } from '../lib/content'
import { formatPoints, plural, useI18n } from '../lib/i18n'
import { useProgress } from '../lib/progress'
import { useActivity, useDaily, useMyGroups } from '../lib/queries'
import { liveStreak, parisDay } from '../lib/supabase'


import { DailyList } from '../components/DailyList'

// ------------------------------------------------------------------ Tableau de bord

export function Dashboard() {
  const { profile, session } = useAuth()
  const { lang, t } = useI18n()
  const progress = useProgress()
  const daily = useDaily()
  const activity = useActivity(session?.user.id)
  const groups = useMyGroups()

  const nextProblem = useMemo(() => problemList.find((p) => !progress.solved.has(p.id)), [progress.solved])
  const nextChapter = nextProblem ? chapterById(nextProblem.chapter) : null
  if (!profile) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
        <Skeleton className="h-10 w-72" />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    )
  }
  const streak = liveStreak(profile)
  const doneToday = profile.last_streak_day === parisDay(new Date())

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold sm:text-3xl">{t(`Bonjour ${profile.display_name}`, `Hello ${profile.display_name}`)}</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {nextProblem && nextChapter ? (
          <Link to={`/probleme/${nextProblem.id}`} className="group flex flex-col justify-between rounded-xl border border-line bg-surface p-6 shadow-e1 transition-shadow hover:shadow-e2">
            <div>
              <p className="text-sm text-muted">{progress.solved.size === 0 ? t('Pour commencer', 'To get started') : t('Reprendre', 'Pick up where you left off')}</p>
              <p className="mt-2 text-xl font-semibold">{problemTitle(lang, nextProblem)}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-ink-2">
                <DifficultyMark difficulty={nextProblem.difficulty} />
                <span>{chapterTitle(lang, nextChapter)}</span>
                <span className="tabular">+{formatPoints(lang, nextProblem.points)}</span>
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-1.5 self-start rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink">
              {t('Ouvrir le problème', 'Open the problem')}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
        ) : (
          <div className="rounded-xl border border-line bg-surface p-6">
            <p className="text-xl font-semibold">{t('Tu as tout résolu.', 'You solved everything.')}</p>
            <p className="mt-1 text-ink-2">{t('De nouveaux problèmes arrivent régulièrement.', 'New problems arrive regularly.')}</p>
          </div>
        )}
        <div className="flex flex-col gap-5 rounded-xl border border-line bg-surface p-6">
          <LeagueProgress points={profile.xp} />
          <div className={cx('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm', doneToday ? 'bg-accent-soft' : 'bg-surface-2')}>
            <Flame className={cx('size-5 shrink-0', streak > 0 ? 'text-warn' : 'text-muted')} aria-hidden />
            <p>
              <span className="font-semibold tabular">{plural(lang, streak, ['jour', 'jours'], ['day', 'days'])}</span>{' '}
              {doneToday
                ? t('de suite, série assurée pour aujourd’hui.', 'in a row, today is covered.')
                : streak > 0
                  ? t('de suite. Résous un problème aujourd’hui pour la prolonger.', 'in a row. Solve a problem today to keep it going.')
                  : t('de série. Résous un problème aujourd’hui pour la lancer.', 'streak. Solve a problem today to start one.')}
            </p>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">{t('Défi du jour', 'Daily challenge')}</h2>
          <Link to="/defi" className="text-sm font-medium hover:underline">
            {t('Règles du défi', 'How it works')}
          </Link>
        </div>
        <p className="mt-1 text-sm text-ink-2">{t('Un problème par niveau, +50 % de points s’il est réussi aujourd’hui.', 'One problem per level, +50% points if solved today.')}</p>
        <DailyList daily={daily.data} loading={daily.isLoading} solved={progress.solved} />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">{t('Ta progression', 'Your progress')}</h2>
        <CurriculumGrid className="mt-4" solved={new Set(progress.solved.keys())} tried={progress.tried} />
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <h2 className="text-lg font-semibold">{t('Activité', 'Activity')}</h2>
          <div className="mt-4 rounded-xl border border-line bg-surface p-5">{activity.data ? <Heatmap days={activity.data} /> : <Skeleton className="h-28" />}</div>
        </section>
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">{t('Tes groupes', 'Your groups')}</h2>
            <Link to="/groupes" className="text-sm font-medium hover:underline">
              {t('Gérer', 'Manage')}
            </Link>
          </div>
          <div className="mt-4 rounded-xl border border-line bg-surface">
            {groups.isLoading ? (
              <Skeleton className="m-4 h-16" />
            ) : groups.data?.length ? (
              <ul>
                {groups.data.slice(0, 5).map((g) => (
                  <li key={g.id} className="border-b border-line last:border-0">
                    <Link to={`/groupes/${g.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-surface-2">
                      <span className="truncate font-medium">{g.name}</span>
                      <span className="shrink-0 text-sm text-muted">{plural(lang, g.members, ['membre', 'membres'], ['member', 'members'])}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-5">
                <p className="text-sm text-ink-2">{t('Rejoins ta classe avec le code donné par ton prof, ou crée un groupe avec tes amis.', 'Join your class with the code from your teacher, or create a group with friends.')}</p>
                <LinkButton to="/groupes" size="sm" variant="secondary" className="mt-3">
                  {t('Rejoindre ou créer', 'Join or create')}
                </LinkButton>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

