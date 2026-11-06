import { lazy, Suspense, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Play } from 'lucide-react'
import { LeaderboardTable } from '../components/LeaderboardTable'

import { CurriculumGrid } from '../components/CurriculumGrid'

import { Button, DifficultyMark, LinkButton, Skeleton, Spinner } from '../components/ui'

import { chapters, problemList, totalPoints } from '../lib/content'
import { formatPoints, useI18n } from '../lib/i18n'

import { useLeaderboard } from '../lib/queries'

import { judge, warmUp, type JudgeReport } from '../judge/judge'

const CodeEditor = lazy(() => import('../components/CodeEditor').then((m) => ({ default: m.CodeEditor })))

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
          <p className="font-semibold">{t('Somme de deux nombres', 'Sum of two numbers')}</p>
          <DifficultyMark difficulty="facile" />
        </div>
        <p className="mt-1.5 text-sm text-ink-2">
          {t(
            'Ton programme reçoit deux entiers sur une ligne et doit afficher leur somme. Complète la ligne 2, puis exécute.',
            'Your program receives two integers on one line and must print their sum. Finish line 2, then run it.',
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
            <span className="text-bad">{t('Python n’a pas pu démarrer dans ce navigateur.', 'Python could not start in this browser.')}</span>
          ) : report?.verdict === 'accepted' ? (
            <span className="inline-flex items-center gap-1.5 font-medium text-ok">
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

export function Landing() {
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
      text: t('Ton programme affronte une dizaine de tests, cas limites compris. Les erreurs courantes sont expliquées en clair.', 'Your program faces a dozen tests, edge cases included. Common errors are explained in plain words.'),
    },
  ]
  return (
    <>
      <section className="mx-auto grid max-w-[1280px] items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
        <div className="anim-rise">
          <h1 className="text-[2.6rem] font-semibold leading-[1.02] sm:text-5xl lg:text-[3.75rem]">
            {t('Apprends l’algorithmique. Pour de vrai.', 'Learn algorithms. For real.')}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-2">
            {t(
              `De ta première ligne de code aux Olympiades : des cours courts, ${problemList.length} problèmes corrigés en direct en Python ou en C++, et un classement pour te mesurer à ta classe.`,
              `From your first line of code to the Olympiads: short lessons, ${problemList.length} problems graded instantly in Python or C++, and leaderboards to measure up against your class.`,
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
              <h2 className="text-2xl font-semibold sm:text-3xl">{t(`${problemList.length} problèmes, ${chapters.length} chapitres, 4 niveaux`, `${problemList.length} problems, ${chapters.length} chapters, 4 levels`)}</h2>
              <p className="mt-2 text-ink-2">
                {t(
                  `Du premier print aux graphes et à la programmation dynamique. Chaque case est un problème ; tout réussir rapporte ${formatPoints(lang, totalPoints)}.`,
                  `From your first print to graphs and dynamic programming. Each square is a problem; solving them all is worth ${formatPoints(lang, totalPoints)}.`,
                )}
              </p>
            </div>
            <Link to="/parcours" className="text-sm font-medium text-ink underline-offset-2 hover:underline">
              {t('Voir le détail des chapitres', 'See all chapters')}
            </Link>
          </div>
          <CurriculumGrid className="mt-8" />
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
          <h2 className="text-2xl font-semibold sm:text-3xl">{t('Pour les profs : un groupe par classe', 'For teachers: one group per class')}</h2>
          <p className="mt-3 text-ink-2">
            {t(
              'Crée un groupe, donne le code à six caractères à tes élèves, et suis qui a réussi quoi, chapitre par chapitre. Chaque groupe a son propre classement, de la semaine ou depuis le début.',
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
                <Check className="mt-1 size-4 shrink-0 text-ok" aria-hidden />
                {x}
              </li>
            ))}
          </ul>
          <LinkButton to="/groupes" variant="secondary" className="mt-6">
            {t('Créer un groupe', 'Create a group')}
          </LinkButton>
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">{t('En tête cette semaine', 'Top of the week')}</h2>
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
                  <p className="font-medium">{t('Personne n’a encore marqué de points cette semaine.', 'Nobody has scored yet this week.')}</p>
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

