// Profil (motif Détail) : identité et faits en ligne, grille personnelle, activité, ligue,
// distinctions, dernières réussites. Voir DESIGN.md.
import { useMemo } from 'react'
import { StaffTitle, UserName } from '../components/Staff'
import { UserAvatar } from '../components/UserAvatar'
import { Link, useParams } from 'react-router-dom'
import { Check, Flame } from 'lucide-react'
import { CurriculumGrid } from '../components/CurriculumGrid'
import { Heatmap } from '../components/Heatmap'
import { LeagueBadge } from '../components/League'
import { Button, cx, DifficultyMark, LinkButton, Notice, Skeleton, SectionCell } from '../components/ui'
import { useAuth } from '../lib/auth'
import { problemById, problemList, problemTitle, totalPoints } from '../lib/content'
import { formatDate, formatPoints, plural, timeAgo, useI18n } from '../lib/i18n'
import { badges, LEAGUES, leagueName, leagueOf } from '../lib/leagues'
import { useActivity, useLeaderboard, useMyGroups, useProfile, useSolvesOf } from '../lib/queries'
import { liveStreak } from '../lib/supabase'
import { NotFound } from './NotFound'

const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="mb-4 text-lg">
          <SectionCell />
    {children}
  </h2>
)

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
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <Skeleton className="h-16 w-80" />
        <Skeleton className="mt-8 h-64" />
      </div>
    )
  if (profileQ.isError)
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <Notice
          tone="error"
          action={
            <Button variant="secondary" size="sm" onClick={() => profileQ.refetch()}>
              {t('Réessayer', 'Try again')}
            </Button>
          }
        >
          {t('Chargement du profil impossible. Vérifier la connexion internet puis réessayer.', 'The profile could not be loaded. Check the internet connection, then try again.')}
        </Notice>
      </div>
    )
  if (!profile) return <NotFound />

  // Le classement renvoie au plus les 200 premiers (et soi-même) : pas de total fiable, et
  // un profil absent de la liste est au-delà de la 200ᵉ place.
  const rank = board.data?.find((r) => r.user_id === profile.id)?.rank
  const beyond = !rank && profile.xp > 0 && (board.data?.length ?? 0) >= 200
  const league = leagueOf(profile.xp)
  const streak = liveStreak(profile)
  // Les groupes d'un autre élève ne sont pas visibles : cette distinction n'est montrée que sur son propre profil.
  const all = badges({ solves: list, bestStreak: profile.best_streak, groups: isMe ? (myGroups.data?.length ?? 0) : 0 }).filter((b) => isMe || b.id !== 'groupe')
  const sortedBadges = [...all.filter((b) => b.earned), ...all.filter((b) => !b.earned)]
  const solvedSet = new Set(list.map((s) => s.problem_id))
  const L = (x: [string, string]) => (lang === 'en' ? x[1] : x[0])

  const facts: { k: string; v: React.ReactNode }[] = [
    { k: t('Points', 'Points'), v: formatPoints(lang, profile.xp) },
    { k: t('Rang', 'Rank'), v: <LeagueBadge league={league.current} className="text-base" /> },
    { k: t('Classement général', 'Overall rank'), v: rank ? (lang === 'en' ? `#${rank}` : `${rank}${rank === 1 ? 'ᵉʳ' : 'ᵉ'}`) : beyond ? t('après la 200ᵉ place', 'below #200') : '–' },
    { k: t('Problèmes réussis', 'Problems solved'), v: solves.data ? `${problemList.filter((p) => solvedSet.has(p.id)).length} / ${problemList.length}` : '–' },
    {
      k: t('Série', 'Streak'),
      v: (
        <span className="inline-flex items-center gap-1.5">
          <Flame className={cx('size-4', streak > 0 ? 'text-warn' : 'text-muted')} aria-hidden />
          {plural(lang, streak, ['jour', 'jours'], ['day', 'days'])}
          <span className="text-sm font-normal text-muted">{t(`record ${profile.best_streak}`, `best ${profile.best_streak}`)}</span>
        </span>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-6 border-b border-line pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <UserAvatar avatar={profile.avatar} seed={profile.id} size={56} />
            <div>
              <h1 className="display flex flex-wrap items-baseline gap-x-3 text-2xl">
                <UserName name={profile.display_name} staff={profile.staff} />
                <StaffTitle staff={profile.staff} className="text-base" />
              </h1>
              <p className="text-ink-2">
                @{profile.username}
                {profile.school && <span className="text-muted"> — {profile.school}</span>}
              </p>
              <p className="text-sm text-muted">{t(`Inscrit le ${formatDate(lang, profile.created_at)}`, `Joined ${formatDate(lang, profile.created_at)}`)}</p>
            </div>
          </div>
          {isMe && (
            <LinkButton to="/compte" variant="secondary" size="sm">
              {t('Modifier mon profil', 'Edit my profile')}
            </LinkButton>
          )}
        </div>
        <dl className="flex flex-wrap gap-x-10 gap-y-4">
          {facts.map((f) => (
            <div key={f.k}>
              <dt className="text-xs text-muted">{f.k}</dt>
              <dd className="mt-1 text-lg font-semibold">{f.v}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section aria-labelledby="progression" className="mt-10">
        <H2 id="progression">
          {t('Progression', 'Progress')}
          <span className="ml-3 text-sm font-normal text-muted">
            {t(`${formatPoints(lang, profile.xp)} sur ${formatPoints(lang, totalPoints)} hors bonus`, `${formatPoints(lang, profile.xp)} of ${formatPoints(lang, totalPoints)} before bonuses`)}
          </span>
        </H2>
        <CurriculumGrid solved={solvedSet} />
      </section>

      <section aria-labelledby="activite" className="mt-12">
        <H2 id="activite">{t('Activité', 'Activity')}</H2>
        <div className="rounded-lg bg-surface p-5 shadow-[inset_0_0_0_1px_var(--line),var(--edge)]">{activity.data ? <Heatmap days={activity.data} /> : <Skeleton className="h-32" />}</div>
      </section>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <section aria-labelledby="ligue">
          <H2 id="ligue">{t('Rangs', 'Ranks')}</H2>
          <ol className="overflow-hidden rounded-lg bg-surface shadow-[inset_0_0_0_1px_var(--line),var(--edge)]">
            {[...LEAGUES].reverse().map((l) => {
              const current = l.id === league.current.id
              const reached = profile.xp >= l.min
              return (
                <li key={l.id} className={cx('flex h-11 items-center justify-between border-b border-line px-4 text-sm last:border-0', current && 'bg-accent-soft')}>
                  <span className="flex items-center gap-3">
                    <LeagueBadge league={l} className={reached ? '' : 'opacity-40'} />
                    {current && league.next && (
                      <span className="text-xs text-ink-2">{t(`encore ${formatPoints(lang, league.remaining)} pour ${leagueName(lang, league.next)}`, `${formatPoints(lang, league.remaining)} to ${leagueName(lang, league.next)}`)}</span>
                    )}
                  </span>
                  <span className={cx('tabular', reached ? 'text-ink-2' : 'text-muted')}>{formatPoints(lang, l.min)}</span>
                </li>
              )
            })}
          </ol>
        </section>

        <section aria-labelledby="distinctions">
          <H2 id="distinctions">
            {t('Titres', 'Titles')}
            <span className="ml-3 text-sm font-normal text-muted">
              {all.filter((b) => b.earned).length} / {all.length}
            </span>
          </H2>
          <ul className="grid overflow-hidden rounded-lg bg-surface shadow-[inset_0_0_0_1px_var(--line),var(--edge)] sm:grid-cols-2">
            {sortedBadges.map((b) => (
              <li key={b.id} className="flex items-start gap-3 border-b border-line px-4 py-3 sm:[&:nth-last-child(-n+2)]:border-b-0">
                <span className={cx('mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[3px]', b.earned ? 'bg-accent text-accent-ink' : 'bg-surface-2 shadow-[inset_0_0_0_1px_var(--line-strong)]')} aria-hidden>
                  {b.earned && <Check className="size-3.5" />}
                </span>
                <span>
                  <span className={cx('block text-sm font-medium', !b.earned && 'text-ink-2')}>
                    {L(b.title)}
                    <span className="sr-only">{b.earned ? t(' (obtenue)', ' (earned)') : t(' (pas encore obtenue)', ' (not earned yet)')}</span>
                  </span>
                  <span className="block text-xs text-muted">{L(b.detail)}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="reussites" className="mt-12">
        <H2 id="reussites">{t('Dernières réussites', 'Latest solves')}</H2>
        {list.length === 0 ? (
          <p className="text-ink-2">
            {isMe ? (
              <>
                {t('Aucun problème réussi pour l’instant. Le premier est ', 'No problem solved yet. The first one is ')}
                <Link to={`/probleme/${problemList[0].id}`} className="text-accent underline underline-offset-2">
                  {problemTitle(lang, problemList[0])}
                </Link>
                .
              </>
            ) : (
              t('Aucun problème réussi pour l’instant.', 'No problem solved yet.')
            )}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg bg-surface shadow-[inset_0_0_0_1px_var(--line),var(--edge)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-surface-2 text-left text-xs text-muted">
                  <th scope="col" className="h-9 px-4 font-medium">{t('Problème', 'Problem')}</th>
                  <th scope="col" className="hidden font-medium sm:table-cell">{t('Difficulté', 'Difficulty')}</th>
                  <th scope="col" className="hidden font-medium md:table-cell">{t('Langage', 'Language')}</th>
                  <th scope="col" className="hidden font-medium md:table-cell">{t('Bonus', 'Bonus')}</th>
                  <th scope="col" className="px-4 text-right font-medium">{t('Points', 'Points')}</th>
                  <th scope="col" className="hidden pr-4 text-right font-medium sm:table-cell">{t('Quand', 'When')}</th>
                </tr>
              </thead>
              <tbody>
                {list.slice(0, 20).map((s) => {
                  const p = problemById(s.problem_id)
                  if (!p) return null
                  const bonus = [s.first_try && t('premier essai', 'first try'), s.daily && t('défi du jour', 'daily challenge')].filter(Boolean).join(', ')
                  return (
                    <tr key={s.problem_id} className="border-b border-line last:border-0 hover:bg-surface-2">
                      <td className="h-11 px-4">
                        <Link to={`/probleme/${p.id}`} className="font-medium hover:underline">
                          {problemTitle(lang, p)}
                        </Link>
                      </td>
                      <td className="hidden sm:table-cell">
                        <DifficultyMark difficulty={p.difficulty} />
                      </td>
                      <td className="hidden text-ink-2 md:table-cell">{s.language === 'cpp' ? 'C++' : 'Python'}</td>
                      <td className="hidden text-ink-2 md:table-cell">{bonus || <span className="text-muted">–</span>}</td>
                      <td className="px-4 text-right tabular">+{formatPoints(lang, s.xp)}</td>
                      <td className="hidden pr-4 text-right text-muted sm:table-cell">{timeAgo(lang, s.solved_at)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
