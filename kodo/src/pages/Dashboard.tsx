// Tableau de bord (DESIGN.md §8) : un coup d'œil, point focal = le prochain problème.
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Check, ChevronRight, Flame } from 'lucide-react'

import { Cell } from '../components/Cell'
import { CurriculumGrid } from '../components/CurriculumGrid'
import { DailyList } from '../components/DailyList'
import { Heatmap } from '../components/Heatmap'
import { LeagueBadge } from '../components/League'
import { DifficultyMark, LinkButton, Panel, Skeleton, cx } from '../components/ui'
import { limitFor, type Verdict } from '../judge/judge'
import { useAuth } from '../lib/auth'
import { chapterById, chapterTitle, loadProblem, problemList, problemTitle, type CatalogProblem } from '../lib/content'
import { formatDate, formatNumber, formatPoints as fmtPoints, plural, timeAgo, useI18n, type UiLang } from '../lib/i18n'
import { leagueName, leagueOf } from '../lib/leagues'
import { useCodeLang, useProgress } from '../lib/progress'
import { useActivity, useDaily, useLeaderboard, useMyGroups } from '../lib/queries'
import { liveStreak, parisDay, supabase, type Group } from '../lib/supabase'

// ------------------------------------------------------------------ Outils

/** « 350 pts » sans coupure de ligne entre le nombre et l'unité. */
const formatPoints = (lang: UiLang, n: number) => fmtPoints(lang, n).replace(' pts', '\u00a0pts')

/** Vrai sous 640 px : le calendrier d'activité affiche alors 16 semaines au lieu de 52. */
function useNarrow() {
  const q = '(max-width: 639px)'
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setNarrow(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return narrow
}

const KIND: Record<Group['kind'], [string, string]> = {
  classe: ['Classe', 'Class'],
  etablissement: ['Établissement', 'School'],
  amis: ['Amis', 'Friends'],
}

const ordinal = (lang: UiLang, n: number) => {
  if (lang === 'fr') return n === 1 ? '1er' : `${n}e`
  const s = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th'
  return `${n}${s}`
}

/** Temps restant jusqu'à minuit, heure de Paris (le défi et la série changent à ce moment-là). */
function useUntilMidnight() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [])
  const paris = new Date(new Date(now).toLocaleString('en-US', { timeZone: 'Europe/Paris' }))
  const minutes = 24 * 60 - (paris.getHours() * 60 + paris.getMinutes())
  return `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, '0')}`
}

type Segment = { code: boolean; text: string }

/** Première phrase du premier paragraphe d'un énoncé HTML, en gardant les bouts de code. */
function firstSentence(html: string): Segment[] {
  const p = new DOMParser().parseFromString(html, 'text/html').querySelector('p')
  if (!p) return []
  const segs: Segment[] = []
  for (const n of Array.from(p.childNodes)) {
    const text = (n.textContent ?? '').replace(/\s+/g, ' ')
    if (text) segs.push({ code: n.nodeName === 'CODE', text })
  }
  for (let i = 0; i < segs.length; i++) {
    if (segs[i].code) continue
    const m = /[.!?](?=\s|$)/.exec(segs[i].text)
    if (m) return [...segs.slice(0, i), { code: false, text: segs[i].text.slice(0, m.index + 1) }]
  }
  return segs
}

const VERDICT: Record<Verdict, [string, string]> = {
  accepted: ['accepté', 'accepted'],
  wrong_answer: ['mauvaise réponse', 'wrong answer'],
  time_limit: ['temps dépassé', 'time limit exceeded'],
  runtime_error: ['erreur d’exécution', 'runtime error'],
  compile_error: ['erreur de compilation', 'compilation error'],
}

// ------------------------------------------------------------------ Page

export function Dashboard() {
  const { profile, session } = useAuth()
  const { lang, t } = useI18n()
  const progress = useProgress()
  const daily = useDaily()
  const activity = useActivity(session?.user.id)
  const groups = useMyGroups()
  const week = useLeaderboard('week')
  const untilMidnight = useUntilMidnight()
  const narrow = useNarrow()

  // Le prochain problème : d'abord le dernier tenté sans réussite, sinon le premier non réussi du parcours.
  const next = useMemo(() => {
    const pending = [...progress.tried].find((id) => !progress.solved.has(id) && problemList.some((p) => p.id === id))
    if (pending) return { problem: problemList.find((p) => p.id === pending)!, tried: true }
    const p = problemList.find((x) => !progress.solved.has(x.id))
    return p ? { problem: p, tried: false } : null
  }, [progress.solved, progress.tried])

  if (!profile) return <DashboardSkeleton />

  const streak = liveStreak(profile)
  const doneToday = profile.last_streak_day === parisDay(new Date())
  const me = week.data?.find((r) => r.is_me)
  const dailyIds = new Set((daily.data ?? []).map((d) => d.problem_id))
  const dailyDone = (daily.data ?? []).filter((d) => progress.solved.has(d.problem_id)).length
  const triedOnly = [...progress.tried].filter((id) => !progress.solved.has(id)).length
  const totals = (activity.data ?? []).reduce((a, d) => ({ subs: a.subs + d.submissions, solves: a.solves + d.solves }), { subs: 0, solves: 0 })

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
      {/* ---------------------------------------------------------- En-tête */}
      <header className="border-b border-line pb-6">
        <h1 className="display text-2xl">{profile.display_name}</h1>
        <ul className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-2" aria-label={t('Ton état', 'Your status')}>
          <li className="font-medium text-ink">{formatPoints(lang, profile.xp)}</li>
          <li>
            <LeagueBadge league={leagueOf(profile.xp).current} className="text-ink" />
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Flame className={cx('size-4', streak > 0 ? 'text-warn' : 'text-muted')} aria-hidden />
            <span>
              <span className="font-medium text-ink">{plural(lang, streak, ['jour', 'jours'], ['day', 'days'])}</span> {t('de série', 'streak')}
              {doneToday && <span className="text-muted">{t(', aujourd’hui compté', ', today counted')}</span>}
            </span>
          </li>
          <li>
            {week.isLoading ? (
              <Skeleton className="h-4 w-36" />
            ) : me ? (
              <Link to="/classements" className="hover:text-ink hover:underline">
                <span className="font-medium text-ink">{ordinal(lang, me.rank)}</span> {t('au classement de la semaine', 'on this week’s leaderboard')}
              </Link>
            ) : (
              <span>{t('Aucun point cette semaine', 'No points this week')}</span>
            )}
          </li>
        </ul>
      </header>

      {/* ---------------------------------------------------------- Point focal + rail */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        {progress.loading ? (
          <Skeleton className="h-[296px] rounded-lg" />
        ) : next ? (
          <NextProblem problem={next.problem} tried={next.tried} isDaily={dailyIds.has(next.problem.id)} solved={progress.solved} />
        ) : (
          <Panel className="p-6">
            <h2 className="display text-xl">{t(`Les ${problemList.length} problèmes sont réussis`, `All ${problemList.length} problems solved`)}</h2>
            <p className="mt-2 text-ink-2">{t(`Tu as ${formatPoints(lang, profile.xp)}. Ton rang se joue maintenant au défi du jour et au classement de la semaine.`, `You have ${formatPoints(lang, profile.xp)}. Your rank now depends on the daily challenge and this week’s leaderboard.`)}</p>
            <LinkButton to="/classements" variant="secondary" className="mt-5">
              {t('Voir le classement', 'View the leaderboard')}
            </LinkButton>
          </Panel>
        )}

        <aside className="flex flex-col" aria-label={t('Ligue et série', 'League and streak')}>
          <LeagueRail points={profile.xp} solved={progress.solved} />
          <WeekRail
            streak={streak}
            doneToday={doneToday}
            untilMidnight={untilMidnight}
            days={activity.data}
          />
        </aside>
      </div>

      {/* ---------------------------------------------------------- Défi du jour */}
      <section className="mt-12" aria-labelledby="dash-defi">
        <SectionHead
          id="dash-defi"
          title={t('Défi du jour', 'Daily challenge')}
          link={{ to: '/defi', label: t('Voir le défi', 'View the challenge') }}
        >
          {daily.data?.length
            ? t(
                `${dailyDone} sur ${daily.data.length} réussi${dailyDone > 1 ? 's' : ''}. +50 % de points jusqu’à minuit, heure de Paris (dans ${untilMidnight}).`,
                `${dailyDone} of ${daily.data.length} solved. +50% points until midnight Paris time (in ${untilMidnight}).`,
              )
            : t('Un problème par niveau, le même pour tout le monde, renouvelé à minuit, heure de Paris.', 'One problem per level, the same for everyone, renewed at midnight Paris time.')}
        </SectionHead>
        <div className="mt-4">
          <DailyList daily={daily.data} loading={daily.isLoading} solved={progress.solved} />
        </div>
      </section>

      {/* ---------------------------------------------------------- Progression */}
      <section className="mt-12" aria-labelledby="dash-progression">
        <SectionHead id="dash-progression" title={t('Ta progression', 'Your progress')} link={{ to: '/parcours', label: t('Ouvrir le parcours', 'Open the path') }}>
          {t(
            `${progress.solved.size} problème${progress.solved.size > 1 ? 's' : ''} réussi${progress.solved.size > 1 ? 's' : ''} sur ${problemList.length}${triedOnly ? `, ${triedOnly} tenté${triedOnly > 1 ? 's' : ''} sans réussite` : ''}. Chaque case est un problème : clique dessus pour l’ouvrir.`,
            `${progress.solved.size} of ${problemList.length} problems solved${triedOnly ? `, ${triedOnly} attempted without success` : ''}. Each square is a problem: click it to open it.`,
          )}
        </SectionHead>
        <Legend />
        <CurriculumGrid className="mt-3" solved={new Set(progress.solved.keys())} tried={progress.tried} />
      </section>

      {/* ---------------------------------------------------------- Activité + groupes */}
      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section aria-labelledby="dash-activite" className="min-w-0">
          <SectionHead id="dash-activite" title={t('Activité', 'Activity')}>
            {activity.data
              ? t(
                  `${plural(lang, totals.subs, ['soumission', 'soumissions'], ['', ''])} et ${plural(lang, totals.solves, ['réussite', 'réussites'], ['', ''])} sur les 12 derniers mois.`,
                  `${plural(lang, totals.subs, ['', ''], ['submission', 'submissions'])} and ${plural(lang, totals.solves, ['', ''], ['solve', 'solves'])} over the last 12 months.`,
                )
              : ' '}
          </SectionHead>
          <Panel className="mt-4 p-4">{activity.data ? <Heatmap days={activity.data} weeks={narrow ? 16 : 52} /> : <Skeleton className="h-[136px]" />}</Panel>
        </section>

        <section aria-labelledby="dash-groupes" className="min-w-0">
          <SectionHead id="dash-groupes" title={t('Tes groupes', 'Your groups')} link={groups.data?.length ? { to: '/groupes', label: t('Gérer', 'Manage') } : undefined}>
            {groups.data?.length
              ? t('Chaque groupe a son propre classement.', 'Each group has its own leaderboard.')
              : ' '}
          </SectionHead>
          <Panel className="mt-4 overflow-hidden">
            {groups.isLoading ? (
              <div className="p-4">
                <Skeleton className="h-12" />
              </div>
            ) : groups.data?.length ? (
              <ul>
                {groups.data.slice(0, 5).map((g) => (
                  <li key={g.id} className="border-b border-line last:border-0">
                    <Link to={`/groupes/${g.id}`} className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-2">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{g.name}</span>
                        <span className="block truncate text-sm text-muted">
                          {KIND[g.kind][lang === 'en' ? 1 : 0]}, {plural(lang, g.members, ['membre', 'membres'], ['member', 'members'])}
                          {g.role === 'encadrant' && `, ${t('tu encadres', 'you lead it')}`}
                        </span>
                      </span>
                      <ChevronRight className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4">
                <p className="font-medium">{t('Tu n’es dans aucun groupe.', 'You are not in any group.')}</p>
                <p className="mt-1 text-sm text-ink-2">
                  {t(
                    'Entre le code de 6 caractères donné par ton prof pour rejoindre ta classe et son classement, ou crée un groupe et partage son code.',
                    'Enter the 6-character code from your teacher to join your class and its leaderboard, or create a group and share its code.',
                  )}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <LinkButton to="/groupes" size="sm">
                    {t('Entrer un code', 'Enter a code')}
                  </LinkButton>
                  <LinkButton to="/groupes" size="sm" variant="secondary">
                    {t('Créer un groupe', 'Create a group')}
                  </LinkButton>
                </div>
              </div>
            )}
          </Panel>
        </section>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------ Le prochain problème

function NextProblem({ problem, tried, isDaily, solved }: { problem: CatalogProblem; tried: boolean; isDaily: boolean; solved: Map<string, unknown> }) {
  const { lang, t } = useI18n()
  const { session } = useAuth()
  const [codeLang] = useCodeLang()
  const chapter = chapterById(problem.chapter)
  const index = problemList.findIndex((p) => p.id === problem.id)
  const prev = index > 0 ? problemList[index - 1] : null
  const title = problemTitle(lang, problem)

  const data = useQuery({ queryKey: ['problem-data', problem.id], queryFn: () => loadProblem(problem.id), staleTime: Infinity })
  const last = useQuery({
    queryKey: ['last-submission', session?.user.id, problem.id],
    enabled: tried && !!session,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('verdict, passed, total, language, created_at')
        .eq('user_id', session!.user.id)
        .eq('problem_id', problem.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) throw error
      return data as { verdict: Verdict; passed: number; total: number; language: 'python' | 'cpp'; created_at: string } | null
    },
  })

  const text = data.data ? (lang === 'en' && data.data.text.en ? data.data.text.en : data.data.text.fr) : null
  const sentence = useMemo(() => (text ? firstSentence(text.statement) : []), [text])
  const testCount = data.data ? data.data.samples.length + data.data.tests.length : 0
  const limitMs = data.data ? limitFor(codeLang, data.data.timeLimitMs) : 0
  const firstTry = Math.floor(problem.points / 5)
  const dailyBonus = isDaily ? Math.floor(problem.points / 2) : 0

  const context = tried
    ? t(`Tu as tenté ${title} sans le réussir.`, `You attempted ${title} without solving it.`)
    : index === 0
      ? t('Premier problème du parcours.', 'First problem of the path.')
      : prev && solved.has(prev.id)
        ? t(`Suivant dans le parcours, après ${problemTitle(lang, prev)}.`, `Next in the path, after ${problemTitle(lang, prev)}.`)
        : t('Premier problème du parcours que tu n’as pas encore réussi.', 'First problem of the path you have not solved yet.')

  return (
    <Panel as="article" aria-labelledby="next-title" className="flex flex-col">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-6 pt-5">
        <p className="text-sm text-ink-2">{context}</p>
        <p className="text-sm text-muted">{t(`Problème ${index + 1} sur ${problemList.length}`, `Problem ${index + 1} of ${problemList.length}`)}</p>
      </div>

      <div className="px-6 pb-6 pt-4">
        <h2 id="next-title" className="display text-2xl">
          {title}
        </h2>
        <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink-2">
          <DifficultyMark difficulty={problem.difficulty} />
          {chapter && (
            <Link to={`/parcours/${chapter.id}`} className="hover:text-ink hover:underline">
              {chapterTitle(lang, chapter)}
            </Link>
          )}
          <span>{formatPoints(lang, problem.points)}</span>
          {isDaily && <span className="text-ink">{t('Défi du jour', 'Daily challenge')}</span>}
        </p>

        <div className="mt-5 max-w-[65ch] text-base text-ink">
          {data.isLoading ? (
            <Skeleton className="h-6 w-4/5" />
          ) : sentence.length ? (
            <p>
              {sentence.map((s, i) =>
                s.code ? (
                  <code key={i} className="rounded-[4px] bg-surface-2 px-1 py-px text-[0.875em]">
                    {s.text}
                  </code>
                ) : (
                  <span key={i}>{s.text}</span>
                ),
              )}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-auto border-t border-line px-6 py-4">
        {tried ? (
          <p className="text-sm text-ink-2">
            {last.data ? (
              <>
                {t('Dernière soumission', 'Last submission')} {timeAgo(lang, last.data.created_at)}, {last.data.language === 'cpp' ? 'C++' : 'Python'} :{' '}
                <span className="font-medium text-ink">
                  {t(`${last.data.passed} tests sur ${last.data.total}`, `${last.data.passed} of ${last.data.total} tests`)}
                </span>
                , <span className={last.data.verdict === 'accepted' ? 'text-ok' : last.data.verdict === 'time_limit' ? 'text-warn' : 'text-bad'}>{VERDICT[last.data.verdict]?.[lang === 'en' ? 1 : 0] ?? last.data.verdict}</span>.
              </>
            ) : (
              <span className="inline-block h-5" />
            )}
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {data.data ? (
              <ul className="flex flex-wrap gap-1" aria-hidden>
                {Array.from({ length: testCount }, (_, i) => (
                  <li key={i} className="flex">
                    <Cell state="empty" size="lg" label={`${t('Test', 'Test')} ${i + 1}`} />
                  </li>
                ))}
              </ul>
            ) : (
              <Skeleton className="h-3.5 w-40" />
            )}
            {data.data && (
              <p className="text-sm text-ink-2">
                {t(
                  `${testCount} tests, ${formatNumber(lang, limitMs / 1000)} s par test en ${codeLang === 'cpp' ? 'C++' : 'Python'}`,
                  `${testCount} tests, ${formatNumber(lang, limitMs / 1000)} s per test in ${codeLang === 'cpp' ? 'C++' : 'Python'}`,
                )}
              </p>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
          <LinkButton to={`/probleme/${problem.id}`} size="lg" className="max-w-full">
            <span className="truncate">{t(`Ouvrir ${title}`, `Open ${title}`)}</span>
          </LinkButton>
          <p className="text-sm text-ink-2">
            {tried
              ? isDaily
                ? t(`${formatPoints(lang, problem.points + dailyBonus)} s’il est réussi aujourd’hui, bonus du défi compris.`, `${formatPoints(lang, problem.points + dailyBonus)} if solved today, daily bonus included.`)
                : t(`${formatPoints(lang, problem.points)} à la réussite.`, `${formatPoints(lang, problem.points)} when solved.`)
              : t(
                  `${formatPoints(lang, problem.points + firstTry + dailyBonus)} s’il passe à la première soumission${isDaily ? ', bonus du défi compris' : ''}.`,
                  `${formatPoints(lang, problem.points + firstTry + dailyBonus)} if it passes on the first submission${isDaily ? ', daily bonus included' : ''}.`,
                )}
          </p>
        </div>
      </div>
    </Panel>
  )
}

// ------------------------------------------------------------------ Rail : ligue et semaine

function LeagueRail({ points, solved }: { points: number; solved: Map<string, unknown> }) {
  const { lang, t } = useI18n()
  const l = leagueOf(points)
  // Combien de problèmes, dans l'ordre du parcours, suffisent pour atteindre la ligue suivante.
  const plan = useMemo(() => {
    if (!l.next) return null
    let sum = 0
    let n = 0
    for (const p of problemList) {
      if (solved.has(p.id)) continue
      sum += p.points
      n++
      if (sum >= l.remaining) return { n, sum }
    }
    return null
  }, [l.next, l.remaining, solved])

  return (
    <div className="pb-6">
      <h2 className="text-sm font-medium">
        {l.next ? t(`Ligue ${leagueName(lang, l.next)} à ${formatPoints(lang, l.next.min)}`, `${leagueName(lang, l.next)} league at ${formatPoints(lang, l.next.min)}`) : t('Ligue', 'League')}
      </h2>
      {l.next ? (
        <>
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-3"
            role="progressbar"
            aria-valuemin={l.current.min}
            aria-valuemax={l.next.min}
            aria-valuenow={points}
            aria-label={t(`Progression vers la ligue ${leagueName(lang, l.next)}`, `Progress to the ${leagueName(lang, l.next)} league`)}
          >
            <div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(2, l.ratio * 100)}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted">
            <LeagueBadge league={l.current} className="text-xs font-normal text-muted" />
            <span>{t(`encore ${formatPoints(lang, l.remaining)}`, `${formatPoints(lang, l.remaining)} to go`)}</span>
          </div>
          {plan && (
            <p className="mt-3 text-sm text-ink-2">
              {plan.n === 1
                ? t(`Le prochain problème du parcours rapporte ${formatPoints(lang, plan.sum)} : il suffit.`, `The next problem of the path is worth ${formatPoints(lang, plan.sum)}: that is enough.`)
                : t(`Les ${plan.n} prochains problèmes du parcours rapportent ${formatPoints(lang, plan.sum)}.`, `The next ${plan.n} problems of the path are worth ${formatPoints(lang, plan.sum)}.`)}
            </p>
          )}
        </>
      ) : (
        <>
          <LeagueBadge league={l.current} className="mt-2" />
          <p className="mt-2 text-sm text-ink-2">{t('C’est la plus haute ligue.', 'This is the highest league.')}</p>
        </>
      )}
    </div>
  )
}

function WeekRail({ streak, doneToday, untilMidnight, days }: { streak: number; doneToday: boolean; untilMidnight: string; days?: { day: string; submissions: number; solves: number }[] }) {
  const { lang, t } = useI18n()
  const byDay = useMemo(() => new Map((days ?? []).map((d) => [d.day, d])), [days])
  const now = new Date()
  const week = Array.from({ length: 7 }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6 + i, 12))

  return (
    <div className="border-t border-line pt-6">
      <h2 className="text-sm font-medium">{t('Tes 7 derniers jours', 'Your last 7 days')}</h2>
      <ol className="mt-3 grid grid-cols-7 gap-1">
        {week.map((d, i) => {
          const a = byDay.get(parisDay(d))
          const state = a?.solves ? 'done' : a?.submissions ? 'tried' : 'empty'
          const label = `${formatDate(lang, d, { weekday: 'long', day: 'numeric', month: 'long' })} : ${
            a?.solves
              ? plural(lang, a.solves, ['réussite', 'réussites'], ['solve', 'solves'])
              : a?.submissions
                ? plural(lang, a.submissions, ['soumission sans réussite', 'soumissions sans réussite'], ['submission, no solve', 'submissions, no solve'])
                : t('rien', 'nothing')
          }`
          return (
            <li key={i} className="flex flex-col items-center gap-1.5">
              <Cell state={state} size="lg" label={label} />
              <span className={cx('text-xs', i === 6 ? 'font-medium text-ink' : 'text-muted')} aria-hidden>
                {formatDate(lang, d, { weekday: 'short' }).replace('.', '')}
              </span>
            </li>
          )
        })}
      </ol>
      <p className="mt-4 text-sm text-ink-2">
        {doneToday ? (
          <>
            <Check className="mr-1 inline size-4 -translate-y-px text-ok" aria-hidden />
            {t(
              `Série de ${plural(lang, streak, ['jour', 'jours'], ['', ''])}, aujourd’hui compté. Une réussite demain la porte à ${streak + 1}.`,
              `${streak}-day streak, today counted. A solve tomorrow takes it to ${streak + 1}.`,
            )}
          </>
        ) : streak > 0 ? (
          t(
            `Ta série de ${plural(lang, streak, ['jour', 'jours'], ['', ''])} retombe à zéro dans ${untilMidnight} sans nouveau problème réussi ou défi du jour.`,
            `Your ${streak}-day streak resets in ${untilMidnight} unless you solve a new problem or a daily challenge.`,
          )
        ) : (
          t(
            `Pas de série en cours. Réussis un nouveau problème ou un défi du jour d’ici minuit (${untilMidnight}) pour en commencer une.`,
            `No streak yet. Solve a new problem or a daily challenge before midnight (${untilMidnight}) to start one.`,
          )
        )}
      </p>
    </div>
  )
}

// ------------------------------------------------------------------ Petits morceaux

function SectionHead({ id, title, link, children }: { id: string; title: string; link?: { to: string; label: string }; children?: ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h2 id={id} className="text-xl">
          {title}
        </h2>
        {link && (
          <Link to={link.to} className="shrink-0 text-sm font-medium text-accent hover:underline">
            {link.label}
          </Link>
        )}
      </div>
      {children && <p className="mt-1 max-w-[75ch] text-sm text-ink-2">{children}</p>}
    </div>
  )
}

function Legend() {
  const { t } = useI18n()
  const items: { state: 'done' | 'tried' | 'empty'; label: string }[] = [
    { state: 'done', label: t('réussi', 'solved') },
    { state: 'tried', label: t('tenté', 'attempted') },
    { state: 'empty', label: t('pas encore soumis', 'not submitted yet') },
  ]
  return (
    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted" aria-hidden>
      {items.map((it) => (
        <li key={it.state} className="inline-flex items-center gap-1.5">
          <Cell state={it.state} size="dense" label={it.label} />
          {it.label}
        </li>
      ))}
    </ul>
  )
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6" aria-busy>
      <div className="border-b border-line pb-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-3 h-5 w-96 max-w-full" />
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Skeleton className="h-[296px] rounded-lg" />
        <Skeleton className="h-[296px] rounded-lg" />
      </div>
    </div>
  )
}
