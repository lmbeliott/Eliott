import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, Flame, Lock } from 'lucide-react'
import { Heatmap } from '../components/Heatmap'
import { LeagueBadge, LeagueProgress } from '../components/League'
import { Avatar, DifficultyMark, LinkButton, Skeleton, cx } from '../components/ui'
import { useAuth } from '../lib/auth'
import { DIFFICULTIES, levels, problemById, problemTitle } from '../lib/content'
import { formatDate, formatPoints, plural, timeAgo, useI18n } from '../lib/i18n'
import { useActivity, useLeaderboard, useMyGroups, useProfile, useSolvesOf } from '../lib/queries'
import { badges, LEAGUES } from '../lib/leagues'
import { liveStreak } from '../lib/supabase'
import { NotFound } from './NotFound'

export function ProfilePage() {
  const { username = '' } = useParams()
  const { lang, t } = useI18n()
  const { session } = useAuth()
  const profileQ = useProfile(username)
  const profile = profileQ.data
  const solves = useSolvesOf(profile?.id)
  const activity = useActivity(profile?.id)
  const board = useLeaderboard('all', null, 200)
  const isMe = !!profile && session?.user.id === profile.id
  const myGroups = useMyGroups()

  const list = useMemo(() => [...(solves.data ?? [])].sort((a, b) => b.solved_at.localeCompare(a.solved_at)), [solves.data])
  if (profileQ.isLoading)
    return (
      <div className="mx-auto max-w-[1080px] px-4 py-10 sm:px-6">
        <Skeleton className="h-16 w-80" />
        <Skeleton className="mt-8 h-40" />
      </div>
    )
  if (!profile) return <NotFound />

  const rank = board.data?.find((r) => r.user_id === profile.id)?.rank
  const earned = badges({ solves: list, bestStreak: profile.best_streak, groups: isMe ? (myGroups.data?.length ?? 0) : 0 })
  const byLevel = DIFFICULTIES.map((d) => {
    const total = levels.filter((l) => l.difficulty === d).flatMap((l) => l.chapters.flatMap((c) => c.problems)).length
    const done = list.filter((x) => problemById(x.problem_id)?.difficulty === d).length
    return { d, total, done }
  })

  return (
    <div className="mx-auto max-w-[1080px] px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={profile.display_name} size={64} />
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">{profile.display_name}</h1>
            <p className="text-ink-2">
              @{profile.username}
              {profile.school && <span className="ml-3">{profile.school}</span>}
            </p>
            <p className="text-sm text-muted">{t(`Inscrit le ${formatDate(lang, profile.created_at)}`, `Joined ${formatDate(lang, profile.created_at)}`)}</p>
          </div>
        </div>
        {isMe && (
          <LinkButton to="/compte" variant="secondary" size="sm">
            {t('Modifier mon profil', 'Edit my profile')}
          </LinkButton>
        )}
      </header>

      <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
        {[
          { k: t('Points', 'Points'), v: formatPoints(lang, profile.xp) },
          { k: t('Classement', 'Rank'), v: rank ? `${rank}${lang === 'en' ? '' : rank === 1 ? 'ᵉʳ' : 'ᵉ'}` : '–' },
          { k: t('Problèmes réussis', 'Problems solved'), v: String(profile.solved_count) },
          { k: t('Série (record)', 'Streak (best)'), v: `${liveStreak(profile)} (${profile.best_streak})` },
        ].map((x) => (
          <div key={x.k} className="bg-surface px-5 py-4">
            <dt className="text-sm text-muted">{x.k}</dt>
            <dd className="display mt-1 text-2xl font-semibold tabular">{x.v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <section>
          <h2 className="text-lg font-semibold">{t('Ligue', 'League')}</h2>
          <div className="mt-4 rounded-xl border border-line bg-surface p-5">
            <LeagueProgress points={profile.xp} />
            <ol className="mt-5 flex flex-col">
              {[...LEAGUES].reverse().map((l) => {
                const reached = profile.xp >= l.min
                return (
                  <li key={l.id} className="flex items-center justify-between border-t border-line py-2 text-sm">
                    <span className={cx('flex items-center gap-2', reached ? 'text-ink' : 'text-muted')}>
                      {reached ? <Check className="size-4 text-accent" aria-label={t('Atteinte', 'Reached')} /> : <span className="inline-block size-4" aria-hidden />}
                      <LeagueBadge league={l} className={reached ? '' : 'font-normal opacity-70'} />
                    </span>
                    <span className="tabular text-ink-2">{formatPoints(lang, l.min)}</span>
                  </li>
                )
              })}
            </ol>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold">{t('Distinctions', 'Badges')}</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3">
            {earned.map((b) => (
              <li key={b.id} className={cx('rounded-lg border p-3', b.earned ? 'border-line-strong bg-surface' : 'border-dashed border-line bg-transparent')}>
                <p className={cx('flex items-center gap-1.5 text-sm font-semibold', !b.earned && 'text-muted')}>
                  {!b.earned && <Lock className="size-3.5" aria-label={t('Pas encore obtenue', 'Not earned yet')} />}
                  {lang === 'en' ? b.title[1] : b.title[0]}
                </p>
                <p className="mt-0.5 text-xs text-muted">{lang === 'en' ? b.detail[1] : b.detail[0]}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">{t('Par niveau', 'By level')}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-4">
          {byLevel.map(({ d, total, done }) => (
            <li key={d} className="rounded-lg border border-line bg-surface p-4">
              <DifficultyMark difficulty={d} />
              <p className="mt-2 text-xl font-semibold tabular">
                {done}
                <span className="text-base font-normal text-muted"> / {total}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">{t('Activité', 'Activity')}</h2>
        <div className="mt-4 rounded-xl border border-line bg-surface p-5">{activity.data ? <Heatmap days={activity.data} /> : <Skeleton className="h-28" />}</div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">{t('Dernières réussites', 'Latest solves')}</h2>
        {list.length === 0 ? (
          <p className="mt-3 text-ink-2">
            {isMe ? t('Pas encore de problème réussi. Le premier t’attend dans le parcours.', 'No problem solved yet. The first one is waiting in the path.') : t('Pas encore de problème réussi.', 'No problem solved yet.')}
          </p>
        ) : (
          <ul className="mt-4 overflow-hidden rounded-xl border border-line bg-surface">
            {list.slice(0, 15).map((s) => {
              const p = problemById(s.problem_id)
              if (!p) return null
              return (
                <li key={s.problem_id} className="flex items-center justify-between gap-3 border-b border-line px-5 py-3 last:border-0">
                  <span className="min-w-0">
                    <Link to={`/probleme/${p.id}`} className="block truncate font-medium hover:underline">
                      {problemTitle(lang, p)}
                    </Link>
                    <span className="flex flex-wrap items-center gap-x-3 text-xs text-muted">
                      <DifficultyMark difficulty={p.difficulty} className="text-xs" />
                      <span>{s.language === 'cpp' ? 'C++' : 'Python'}</span>
                      {s.first_try && <span>{t('du premier coup', 'first try')}</span>}
                      {s.daily && (
                        <span className="inline-flex items-center gap-1">
                          <Flame className="size-3 text-warn" aria-hidden />
                          {t('défi du jour', 'daily challenge')}
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="shrink-0 text-right text-sm">
                    <span className="block font-medium tabular">+{formatPoints(lang, s.xp)}</span>
                    <span className="text-xs text-muted">{timeAgo(lang, s.solved_at)}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        )}
        {list.length > 15 && <p className="mt-2 text-sm text-muted">{t(`et ${plural(lang, list.length - 15, ['autre', 'autres'], ['', ''])}`, `and ${list.length - 15} more`)}</p>}
      </section>
    </div>
  )
}
