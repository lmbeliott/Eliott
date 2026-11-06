import { lazy, Suspense, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Flame, Play } from 'lucide-react'
import { ElevationProfile } from '../components/ElevationProfile'
import { LeaderboardTable } from '../components/LeaderboardTable'
import { SummitProgress } from '../components/SummitProgress'
import { Heatmap } from '../components/Heatmap'
import { Button, LinkButton, Skeleton, SlopeMark, Spinner, cx } from '../components/ui'
import { useAuth } from '../lib/auth'
import { chapterById, chapterTitle, chapters, levels, problemById, problemList, problemTitle, totalAltitude } from '../lib/content'
import { formatAltitude, plural, useI18n } from '../lib/i18n'
import { useProgress } from '../lib/progress'
import { useActivity, useDaily, useLeaderboard, useMyGroups } from '../lib/queries'
import { liveStreak, parisDay } from '../lib/supabase'
import { judge, warmUp, type JudgeReport } from '../judge/judge'

const CodeEditor = lazy(() => import('../components/CodeEditor').then((m) => ({ default: m.CodeEditor })))

export function Home() {
  const { session, ready } = useAuth()
  if (!ready) return null
  return session ? <Dashboard /> : <Landing />
}

// ------------------------------------------------------------------ Essai en direct (accueil)

const DEMO = { a: 3, b: 4 }

function TryIt() {
  const { t } = useI18n()
  const [code, setCode] = useState(t('a, b = map(int, input().split())\nprint(a ...)\n', 'a, b = map(int, input().split())\nprint(a ...)\n'))
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState<number | null>(null)
  const [report, setReport] = useState<JudgeReport | null>(null)
  const [failure, setFailure] = useState<string | null>(null)

  const run = async () => {
    setBusy(true)
    setReport(null)
    setFailure(null)
    try {
      const r = await judge({
        lang: 'python',
        code,
        problemId: 'demo',
        timeLimitMs: 1000,
        tests: [
          { input: `${DEMO.a} ${DEMO.b}\n`, output: `${DEMO.a + DEMO.b}\n`, sample: true },
          { input: '120 35\n', output: '155\n', sample: true },
          { input: '0 1000\n', output: '1000\n', sample: true },
        ],
        onEvent: (e) => e.kind === 'loading' && setLoading(e.total ? Math.round((e.loaded / e.total) * 100) : 0),
      })
      setReport(r)
    } catch (e) {
      setFailure(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(null)
      setBusy(false)
    }
  }

  const first = report?.results[0]
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-e3">
      <div className="border-b border-line px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold">{t('Le registre du refuge', 'The hut’s logbook')}</p>
          <SlopeMark slope="verte" />
        </div>
        <p className="mt-1.5 text-sm text-ink-2">
          {t(
            'Inès note les randonneurs arrivés le matin et l’après-midi. Lis les deux nombres et affiche leur somme. Complète la ligne 2, puis exécute.',
            'Inès writes down the hikers who arrived in the morning and in the afternoon. Read both numbers and print their sum. Finish line 2, then run it.',
          )}
        </p>
      </div>
      <div className="h-36 border-b border-line" onFocusCapture={() => warmUp('python')}>
        <Suspense fallback={<Skeleton className="m-4 h-24" />}>
          <CodeEditor value={code} onChange={setCode} lang="python" label={t('Essaie ici', 'Try it here')} onRun={run} />
        </Suspense>
      </div>
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-5 py-3">
        <div className="min-w-0 flex-1 text-sm" aria-live="polite">
          {loading !== null ? (
            <Spinner label={t(`Préparation de Python… ${loading} %`, `Loading Python… ${loading}%`)} />
          ) : failure ? (
            <span className="text-rouge">{t('Python n’a pas pu démarrer dans ce navigateur.', 'Python could not start in this browser.')}</span>
          ) : report?.verdict === 'accepted' ? (
            <span className="inline-flex items-center gap-1.5 font-medium text-verte">
              <Check className="size-4" aria-hidden /> {t('3 tests sur 3. Tu viens de résoudre ton premier problème.', '3 tests out of 3. You just solved your first problem.')}
            </span>
          ) : report && first ? (
            <span className="text-ink-2">
              {first.status === 'error'
                ? t('Python ne comprend pas encore ta ligne 2. Remplace « ... » par le bon calcul.', 'Python does not understand line 2 yet. Replace “...” with the right calculation.')
                : t(`Avec « ${DEMO.a} ${DEMO.b} », on attendait ${DEMO.a + DEMO.b} et ton programme affiche « ${first.stdout.trim() || '(rien)'} ».`, `With “${DEMO.a} ${DEMO.b}”, the answer is ${DEMO.a + DEMO.b} and your program prints “${first.stdout.trim() || '(nothing)'}”.`)}
            </span>
          ) : (
            <span className="text-muted">{t('Ton code tourne dans ton navigateur, rien à installer.', 'Your code runs in your browser, nothing to install.')}</span>
          )}
        </div>
        <Button onClick={run} loading={busy} size="sm">
          {!busy && <Play className="size-4" aria-hidden />}
          {t('Exécuter', 'Run')}
        </Button>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------ Accueil visiteur

function Landing() {
  const { lang, t } = useI18n()
  const week = useLeaderboard('week', null, 5)
  const steps = [
    {
      title: t('Lis le cours', 'Read the lesson'),
      text: t('Cinq minutes de lecture, des exemples en Python et en C++, juste ce qu’il faut pour attaquer les problèmes du chapitre.', 'Five minutes of reading, examples in Python and C++, just what you need for the chapter’s problems.'),
    },
    {
      title: t('Code dans ton navigateur', 'Code in your browser'),
      text: t('L’éditeur, Python et le compilateur C++ tournent sur ta machine. Teste sur les exemples autant que tu veux.', 'The editor, Python and the C++ compiler run on your machine. Test on the examples as often as you like.'),
    },
    {
      title: t('Valide sur les tests cachés', 'Pass the hidden tests'),
      text: t('Ton programme affronte une dizaine de tests, cas limites compris. Les erreurs courantes sont expliquées en français.', 'Your program faces a dozen tests, edge cases included. Common errors are explained in plain words.'),
    },
  ]
  return (
    <>
      <section className="mx-auto grid max-w-[1280px] items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
        <div className="anim-rise">
          <h1 className="text-[2.6rem] font-semibold leading-[1.02] sm:text-5xl lg:text-[3.6rem]">
            {t('Apprends à programmer, de ta première ligne aux Olympiades.', 'Learn to code, from your first line to the Olympiads.')}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-2">
            {t(
              `Des cours courts et ${problemList.length} problèmes corrigés en direct, en Python ou en C++. Chaque problème réussi te fait grimper, et ta classe grimpe avec toi.`,
              `Short lessons and ${problemList.length} problems graded instantly, in Python or C++. Every problem you solve takes you higher, and your class climbs with you.`,
            )}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton to="/parcours" size="lg">
              {t('Commencer le parcours', 'Start the path')}
            </LinkButton>
            <LinkButton to="/inscription" size="lg" variant="secondary">
              {t('Créer un compte', 'Create an account')}
            </LinkButton>
          </div>
          <p className="mt-4 text-sm text-muted">{t('Gratuit. Pas besoin de compte pour essayer.', 'Free. No account needed to try.')}</p>
        </div>
        <div className="anim-rise [animation-delay:120ms]">
          <TryIt />
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold sm:text-3xl">{t('Un parcours, quatre pistes', 'One path, four runs')}</h2>
              <p className="mt-2 text-ink-2">
                {t(
                  `Du « Bonjour » affiché à l’écran jusqu’aux graphes et à la programmation dynamique : ${chapters.length} chapitres, classés comme des pistes de ski. Tout terminer, c’est grimper à ${formatAltitude(lang, totalAltitude)}.`,
                  `From printing “Hello” to graphs and dynamic programming: ${chapters.length} chapters, graded like ski runs. Finishing them all takes you up to ${formatAltitude(lang, totalAltitude)}.`,
                )}
              </p>
            </div>
            <Link to="/parcours" className="text-sm font-medium text-ink underline-offset-2 hover:underline">
              {t('Voir le détail des chapitres', 'See all chapters')}
            </Link>
          </div>
          <ElevationProfile className="mt-8" showHere={false} animate />
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">{t('Comment ça marche', 'How it works')}</h2>
        <ol className="mt-8 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="border-t-2 border-ink pt-4">
              <p className="text-sm font-medium text-muted tabular">{t('Étape', 'Step')} {i + 1}</p>
              <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-ink-2">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto grid max-w-[1280px] gap-12 px-4 pb-8 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold sm:text-3xl">{t('Pour les profs : une cordée par classe', 'For teachers: one group per class')}</h2>
          <p className="mt-3 text-ink-2">
            {t(
              'Crée une cordée, donne le code à six caractères à tes élèves, et suis qui a réussi quoi, chapitre par chapitre. Chaque cordée a son propre classement, de la semaine ou depuis le début.',
              'Create a group, give your students the six-character code, and see who solved what, chapter by chapter. Each group has its own leaderboard, for the week or all time.',
            )}
          </p>
          <ul className="mt-5 flex flex-col gap-2 text-ink-2">
            {[
              t('Tableau de progression par élève et par chapitre', 'Progress table per student and per chapter'),
              t('Accès au code soumis par chaque élève', 'Access to the code each student submitted'),
              t('Classement de la classe, de l’établissement ou entre amis', 'Leaderboards for a class, a school or friends'),
            ].map((x) => (
              <li key={x} className="flex gap-2.5">
                <Check className="mt-1 size-4 shrink-0 text-verte" aria-hidden />
                {x}
              </li>
            ))}
          </ul>
          <LinkButton to="/cordees" variant="secondary" className="mt-6">
            {t('Créer une cordée', 'Create a group')}
          </LinkButton>
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">{t('En tête cette semaine', 'Top climbers this week')}</h2>
            <Link to="/classements" className="text-sm font-medium hover:underline">
              {t('Classements', 'Leaderboards')}
            </Link>
          </div>
          <div className="mt-4">
            <LeaderboardTable
              rows={week.data}
              loading={week.isLoading}
              compact
              empty={
                <div className="rounded-lg border border-line bg-surface p-6">
                  <p className="font-medium">{t('Personne n’a encore grimpé cette semaine.', 'Nobody has climbed yet this week.')}</p>
                  <p className="mt-1 text-sm text-ink-2">{t('Résous un problème et ton nom sera le premier du classement.', 'Solve a problem and your name will top the leaderboard.')}</p>
                </div>
              }
            />
          </div>
        </div>
      </section>
    </>
  )
}

// ------------------------------------------------------------------ Tableau de bord

function Dashboard() {
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
                <SlopeMark slope={nextProblem.slope} />
                <span>{chapterTitle(lang, nextChapter)}</span>
                <span className="tabular">+{formatAltitude(lang, nextProblem.xp)}</span>
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-1.5 self-start rounded-md bg-btn px-4 py-2 text-sm font-medium text-btn-ink">
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
          <SummitProgress xp={profile.xp} />
          <div className={cx('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm', doneToday ? 'bg-signal-soft' : 'bg-surface-2')}>
            <Flame className={cx('size-5 shrink-0', streak > 0 ? 'text-amber' : 'text-muted')} aria-hidden />
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
        <p className="mt-1 text-sm text-ink-2">{t('Un problème par piste, +50 % d’altitude s’il est réussi aujourd’hui.', 'One problem per run, +50% altitude if solved today.')}</p>
        <DailyList daily={daily.data} loading={daily.isLoading} solved={progress.solved} />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">{t('Ta progression', 'Your progress')}</h2>
        <div className="mt-4 rounded-xl border border-line bg-surface p-4 sm:p-6">
          <ElevationProfile solved={new Set(progress.solved.keys())} />
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <h2 className="text-lg font-semibold">{t('Activité', 'Activity')}</h2>
          <div className="mt-4 rounded-xl border border-line bg-surface p-5">{activity.data ? <Heatmap days={activity.data} /> : <Skeleton className="h-28" />}</div>
        </section>
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">{t('Tes cordées', 'Your groups')}</h2>
            <Link to="/cordees" className="text-sm font-medium hover:underline">
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
                    <Link to={`/cordees/${g.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-surface-2">
                      <span className="truncate font-medium">{g.name}</span>
                      <span className="shrink-0 text-sm text-muted">{plural(lang, g.members, ['membre', 'membres'], ['member', 'members'])}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-5">
                <p className="text-sm text-ink-2">{t('Rejoins ta classe avec le code donné par ton prof, ou crée une cordée avec tes amis.', 'Join your class with the code from your teacher, or create a group with friends.')}</p>
                <LinkButton to="/cordees" size="sm" variant="secondary" className="mt-3">
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

export function DailyList({ daily, loading, solved }: { daily?: { level: string; problem_id: string }[]; loading: boolean; solved: Map<string, unknown> }) {
  const { lang, t } = useI18n()
  if (loading) return <Skeleton className="mt-4 h-40" />
  const rows = levels
    .map((l) => ({ level: l, id: daily?.find((d) => d.level === l.id)?.problem_id }))
    .filter((r): r is { level: (typeof levels)[number]; id: string } => !!r.id && !!problemById(r.id))
  if (!rows.length) return <p className="mt-4 text-sm text-muted">{t('Le défi du jour n’est pas disponible pour le moment.', 'The daily challenge is not available right now.')}</p>
  return (
    <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {rows.map(({ level, id }) => {
        const p = problemById(id)!
        const done = solved.has(id)
        return (
          <li key={level.id}>
            <Link to={`/probleme/${id}`} className="flex h-full flex-col justify-between gap-4 rounded-lg border border-line bg-surface p-4 transition-colors hover:border-line-strong">
              <div>
                <SlopeMark slope={level.slope} />
                <p className="mt-2 font-medium leading-snug">{problemTitle(lang, p)}</p>
              </div>
              <p className="text-sm tabular text-ink-2">
                {done ? (
                  <span className="inline-flex items-center gap-1 text-verte">
                    <Check className="size-4" aria-hidden /> {t('Déjà réussi', 'Already solved')}
                  </span>
                ) : (
                  <>+{formatAltitude(lang, Math.round(p.xp * 1.5))}</>
                )}
              </p>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
