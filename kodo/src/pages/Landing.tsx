// Accueil visiteur : le titre, un problème à corriger directement dans la page, le parcours,
// les classes et le classement. Pas de description des fonctionnalités.
import { lazy, Suspense, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check, Play, X } from 'lucide-react'
import { CurriculumGrid } from '../components/CurriculumGrid'
import { LeaderboardTable } from '../components/LeaderboardTable'
import { TestStrip } from '../components/TestStrip'
import { Cell, type CellState } from '../components/Cell'
import { Button, cx, DifficultyMark, LinkButton, Panel, Skeleton, Spinner, SectionCell } from '../components/ui'
import { chapters, levelAvailable, levels, levelTitle, openList, problemById, problemList, problemTitle } from '../lib/content'
import { formatPoints, useI18n, type UiLang } from '../lib/i18n'
import { saveDraft } from '../lib/progress'
import { useLeaderboard } from '../lib/queries'
import { explainError } from '../judge/explain'
import { judge, limitFor, warmUp, type JudgeReport, type TestResult } from '../judge/judge'

/** « 50 pts » sans coupure de ligne entre le nombre et l'unité. */
const pts = (lang: UiLang, n: number) => formatPoints(lang, n).replace(' ', '\u00a0')
const CodeEditor = lazy(() => import('../components/CodeEditor').then((m) => ({ default: m.CodeEditor })))

const FIRST_ID = 'somme-de-deux-nombres'
const first = problemById(FIRST_ID) ?? openList[0]
/** Limite fixée par la plupart des énoncés. */
const STATEMENT_LIMIT_MS = 1000




/** Met en police de code les fragments de programme cités dans une phrase. */

/** Bloc de code ou de sortie de programme, numéroté si c'est un programme. */

// ------------------------------------------------------------------ Le juge en direct (héros)

const DEMO_TESTS = [
  { input: '3 4\n', output: '7\n', sample: true },
  { input: '120 35\n', output: '155\n', sample: true },
  { input: '0 1000\n', output: '1000\n', sample: true },
]
const BUGGY = 'a, b = map(int, input().split())\nprint(a - b)'
const DEMO_LIMIT = limitFor('python', STATEMENT_LIMIT_MS)

const pendingResults = (): TestResult[] =>
  DEMO_TESTS.map((x, index) => ({
    index,
    sample: true,
    status: 'pending',
    timeMs: 0,
    stdout: '',
    stderr: '',
    input: x.input,
    expected: x.output,
  }))

const oneLine = (s: string) => s.replace(/\n$/, '').replace(/\n/g, ' ↵ ')

function TryIt() {
  const { lang, t } = useI18n()
  const [code, setCode] = useState(BUGGY)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState<number | null>(null)
  const [results, setResults] = useState<TestResult[]>(pendingResults)
  const [report, setReport] = useState<JudgeReport | null>(null)
  const [failure, setFailure] = useState<string | null>(null)
  // Une case de plus toutes les 40 ms au maximum : le seul moment animé de la page (DESIGN.md §6).
  const nextSlot = useRef(0)
  const later = (fn: () => void) => {
    const now = performance.now()
    const at = Math.max(now, nextSlot.current + 40)
    nextSlot.current = at
    setTimeout(fn, at - now)
  }

  const run = async () => {
    if (busy) return
    setBusy(true)
    setReport(null)
    setFailure(null)
    nextSlot.current = 0
    setResults(pendingResults().map((r) => (r.index === 0 ? { ...r, status: 'running' } : r)))
    try {
      const r = await judge({
        lang: 'python',
        code,
        problemId: 'demo',
        timeLimitMs: STATEMENT_LIMIT_MS,
        tests: DEMO_TESTS,
        onEvent: (e) => {
          if (e.kind === 'loading') setLoading(e.total ? Math.round((e.loaded / e.total) * 100) : 0)
          if (e.kind === 'test') {
            const res = { ...e.result }
            later(() => {
              setLoading(null)
              setResults((prev) =>
                prev.map((p) => (p.index === res.index ? res : p.index === res.index + 1 && p.status === 'pending' && res.status !== 'timeout' ? { ...p, status: 'running' } : p)),
              )
            })
          }
        },
      })
      later(() => {
        setResults(r.results.map((x) => ({ ...x })))
        setReport(r)
        setBusy(false)
        setLoading(null)
        if (r.verdict === 'accepted') saveDraft(FIRST_ID, 'python', code)
      })
    } catch (e) {
      setFailure(e instanceof Error ? e.message : String(e))
      setResults(pendingResults())
      setLoading(null)
      setBusy(false)
    }
  }

  const accepted = report?.verdict === 'accepted'

  const firstBad = report?.results.find((r) => r.status !== 'ok')
  const passed = results.filter((r) => r.status === 'ok').length
  const done = results.some((r) => !['pending', 'running'].includes(r.status))

  let line: ReactNode
  if (loading !== null) line = <Spinner label={t(`Chargement… ${loading} %`, `Loading… ${loading}%`)} />
  else if (failure)
    line = (
      <span className="text-bad">
        {t(
          'Démarrage de Python impossible dans ce navigateur. Recharger la page puis relancer les tests.',
          'Python could not start in this browser. Reload the page, then run the tests again.',
        )}
      </span>
    )
  else if (accepted)
    line = (
      <span className="flex flex-col gap-1">
        <span className="inline-flex items-center gap-1.5 font-medium text-ok">
          <Check className="size-4 shrink-0" aria-hidden />
          {t('3 tests sur 3 réussis.', '3 of 3 tests passed.')}
        </span>
        <span className="flex flex-col gap-1 text-ink-2">
          <Link to={`/probleme/${FIRST_ID}`} className="self-start font-medium text-accent underline-offset-2 hover:underline">
            {t('Soumettre ce code', 'Submit this code')}
          </Link>
        </span>
      </span>
    )
  else if (report && firstBad) {
    const n = firstBad.index + 1
    const exp = oneLine(firstBad.expected ?? '')
    const got = oneLine(firstBad.stdout)
    const lastErr = firstBad.stderr.trim().split('\n').pop() ?? ''
    line = (
      <span className="inline-flex items-start gap-1.5 text-ink">
        <X className="mt-0.5 size-4 shrink-0 text-bad" aria-hidden />
        <span>
          {firstBad.status === 'wrong'
            ? got
              ? t(`Test ${n} : attendu ${exp}, obtenu ${got}.`, `Test ${n}: expected ${exp}, got ${got}.`)
              : t(`Test ${n} : attendu ${exp}, sortie vide.`, `Test ${n}: expected ${exp}, empty output.`)
            : firstBad.status === 'timeout'
              ? t(`Test ${n} : plus de ${DEMO_LIMIT / 1000} s, arrêté par le juge.`, `Test ${n}: over ${DEMO_LIMIT / 1000} s, stopped by the judge.`)
              : `${t(`Test ${n} : `, `Test ${n}: `)}${explainError('python', firstBad.stderr, lang) ?? lastErr}`}
        </span>
      </span>
    )
  } else line = null

  return (
    <section aria-labelledby="essai-titre" className="overflow-hidden rounded-xl bg-surface shadow-[inset_0_0_0_1px_var(--line-strong),var(--edge)]">
      <div className="border-b border-line px-4 py-3.5 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <h2 id="essai-titre" className="text-base font-semibold">
            {problemTitle(lang, first)}
          </h2>
          <DifficultyMark difficulty={first.difficulty} className="text-xs" />
        </div>
        <p className="mt-1 text-sm text-ink-2">
          {t(
            'Lire deux entiers sur une ligne et afficher leur somme. Ce programme utilise la mauvaise opération à la ligne 2.',
            'Read two integers on one line and print their sum. This program uses the wrong operation on line 2.',
          )}
        </p>
      </div>

      <div className="h-[68px] border-b border-line bg-code" onFocusCapture={() => warmUp('python')}>
        <Suspense fallback={<Skeleton className="m-3 h-14" />}>
          <CodeEditor value={code} onChange={setCode} lang="python" label={t('Programme à corriger, en Python', 'Program to fix, in Python')} onRun={run} />
        </Suspense>
      </div>

      <table className="w-full text-sm">
        <caption className="sr-only">{t('Les 3 tests de l’exercice', 'The 3 tests of the exercise')}</caption>
        <thead>
          <tr className="border-b border-line bg-surface-2 text-left text-xs text-muted">
            <th scope="col" className="h-8 w-14 pl-4 font-medium sm:pl-5">
              {t('Test', 'Test')}
            </th>
            <th scope="col" className="font-medium">
              {t('Entrée', 'Input')}
            </th>
            <th scope="col" className="font-medium">
              {t('Attendu', 'Expected')}
            </th>
            <th scope="col" className="pr-4 font-medium sm:pr-5">
              {t('Obtenu', 'Actual')}
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.index} className="border-b border-line">
              <td className="h-9 pl-4 text-muted tabular sm:pl-5">{r.index + 1}</td>
              <td className="font-mono text-[0.8125rem]">{oneLine(r.input)}</td>
              <td className="font-mono text-[0.8125rem]">{oneLine(r.expected ?? '')}</td>
              <td
                className={cx(
                  'pr-4 font-mono text-[0.8125rem] sm:pr-5',
                  r.status === 'ok' ? 'text-ok' : r.status === 'pending' || r.status === 'running' ? 'text-muted' : 'text-bad',
                )}
              >
                {r.status === 'pending' || r.status === 'running' ? (
                  <span aria-label={t('pas encore exécuté', 'not run yet')}>–</span>
                ) : r.status === 'error' ? (
                  t('erreur', 'error')
                ) : r.status === 'timeout' ? (
                  t('trop long', 'too slow')
                ) : (
                  oneLine(r.stdout) || t('(vide)', '(empty)')
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-col gap-3 px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <TestStrip results={results} />
            <span className="text-sm text-muted tabular" aria-hidden={!done}>
              {done ? `${passed}/${results.length}` : ''}
            </span>
          </div>
          <Button onClick={run} loading={busy} onPointerEnter={() => warmUp('python')} title={t('Ctrl + Entrée dans l’éditeur', 'Ctrl + Enter in the editor')}>
            {!busy && <Play className="size-4" aria-hidden />}
            {t('Exécuter les 3 tests', 'Run the 3 tests')}
          </Button>
        </div>
        <div className="min-h-11 text-sm" aria-live="polite">
          {line}
        </div>
      </div>
    </section>
  )
}

// ------------------------------------------------------------------ Le juge : trois pièces réelles

/** Seuil de température (13 tests) : `t > 8` au lieu de `t >= 8` ne rate que le test caché n° 3, d'entrée « 8 ». */
const STUDENTS = [
  { fr: 'Élève A', en: 'Student A', reach: 46 },
  { fr: 'Élève B', en: 'Student B', reach: 35 },
  { fr: 'Élève C', en: 'Student C', reach: 27 },
  { fr: 'Élève D', en: 'Student D', reach: 19 },
  { fr: 'Élève E', en: 'Student E', reach: 12 },
  { fr: 'Élève F', en: 'Student F', reach: 5 },
]

/** Données fictives mais stables : chaque élève a réussi la plupart des problèmes avant `reach`, avec quelques trous. */
function exampleState(s: number, i: number, reach: number): CellState {
  let h = Math.imul(s * 97 + 13, 2654435761) ^ Math.imul(i + 7, 40503)
  h ^= h >>> 13
  h = Math.imul(h, 2246822507) >>> 0
  return i < reach && h % 100 >= 11 ? 'done' : 'empty'
}

function ClassExample() {
  const { lang, t } = useI18n()
  const exampleList = problemList.length ? problemList : openList
  const order = new Map(exampleList.map((p, i) => [p.id, i]))
  const rows = STUDENTS.map((s, si) => {
    const states = exampleList.map((_, i) => exampleState(si, i, s.reach))
    const points = exampleList.reduce((a, p, i) => a + (states[i] === 'done' ? p.points : 0), 0)
    return { name: lang === 'en' ? s.en : s.fr, states, points }
  })
  return (
    <Panel className="overflow-hidden">
      <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-line px-4 py-2">
        <h3 className="text-sm font-medium">{t('Exemple : la progression d’une classe, vue par son prof', 'Example: a class’s progress, as its teacher sees it')}</h3>
        <span className="text-xs text-muted">{t('Élèves fictifs', 'Fictional students')}</span>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[1000px] text-sm">
          <caption className="sr-only">{t('Problèmes réussis par élève et par niveau (exemple)', 'Problems solved per student and level (example)')}</caption>
          <thead>
            <tr className="border-b border-line bg-surface-2 text-left text-xs text-muted">
              <th scope="col" className="h-9 w-28 pl-4 font-medium">
                {t('Élève', 'Student')}
              </th>
              {levels.filter(levelAvailable).map((l) => (
                <th key={l.id} scope="col" className="px-3 font-medium">
                  {levelTitle(lang, l)}
                </th>
              ))}
              <th scope="col" className="w-24 pr-4 text-right font-medium">
                {t('Points', 'Points')}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-b border-line last:border-0">
                <th scope="row" className="h-11 whitespace-nowrap pl-4 text-left font-medium">
                  {r.name}
                </th>
                {levels.filter(levelAvailable).map((l) => {
                  const ids = l.chapters.flatMap((c) => c.problems)
                  const solved = ids.filter((id) => r.states[order.get(id)!] === 'done').length
                  return (
                    <td key={l.id} className="px-3">
                      <span className="sr-only">{t(`${solved} sur ${ids.length}`, `${solved} of ${ids.length}`)}</span>
                      <span className="flex gap-[3px]" aria-hidden>
                        {ids.map((id) => (
                          <span key={id} className="contents">
                            <Cell state={r.states[order.get(id)!]} size="dense" label="" />
                          </span>
                        ))}
                      </span>
                    </td>
                  )
                })}
                <td className="pr-4 text-right tabular text-ink-2">{pts(lang, r.points)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line px-4 py-2.5 text-xs text-muted" aria-hidden>
        {(
          [
            ['done', t('réussi', 'solved')],
            ['empty', t('pas encore réussi', 'not solved yet')],
          ] as [CellState, string][]
        ).map(([s, label]) => (
          <span key={s} className="inline-flex items-center gap-1.5">
            <Cell state={s} size="dense" label="" />
            {label}
          </span>
        ))}
      </div>
    </Panel>
  )
}

// ------------------------------------------------------------------ Accueil visiteur

function SectionHeading({ id, title, lead, action }: { id: string; title: ReactNode; lead?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-[44rem]">
        <h2 id={id} className="display text-[1.75rem] leading-[1.15] sm:text-2xl">
          <SectionCell />
          {title}
        </h2>
        {lead && <p className="mt-3 text-ink-2">{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function Landing() {
  const { t } = useI18n()
  const week = useLeaderboard('week', null, 5)
  const container = 'mx-auto max-w-[1200px] px-4 sm:px-6'

  return (
    <>
      <section className={cx(container, 'grid items-center gap-12 pb-16 pt-12 sm:pb-24 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-12 lg:pt-24')}>
        <div>
          <h1 className="display text-[2rem] leading-[1.1] sm:text-[2.75rem]">
            {t('S’entraîner à la programmation et à l’algorithmique, en loisir ou pour les Olympiades, en Python et en C++.', 'Practise programming and algorithms, for fun or for the Olympiads, in Python and C++.')}
          </h1>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <LinkButton to={`/probleme/${FIRST_ID}`} size="lg" className="h-auto! min-h-11 py-2.5 text-center whitespace-normal! sm:h-11! sm:py-0 sm:whitespace-nowrap!">
              {t('Commencer', 'Start')}
            </LinkButton>
            <LinkButton to="/parcours" size="lg" variant="secondary">
              {t('Voir le parcours', 'See the path')}
            </LinkButton>
          </div>
        </div>
        <TryIt />
      </section>

      <section aria-labelledby="programme" className="border-t border-line bg-surface">
        <div className={cx(container, 'py-16 sm:py-24')}>
          <SectionHeading
            id="programme"
            title={t(`Le parcours : ${levels.length} niveaux, ${chapters.length} chapitres`, `The path: ${levels.length} levels, ${chapters.length} chapters`)}
            action={
              <LinkButton to="/parcours" variant="secondary">
                {t('Voir le parcours', 'See the path')}
              </LinkButton>
            }
          />
          <CurriculumGrid className="mt-10" />
        </div>
      </section>

      {/* Pour les profs */}
      <section aria-labelledby="profs" className="border-t border-line">
        <div className={cx(container, 'py-16 sm:py-24')}>
          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 id="profs" className="display text-[1.75rem] leading-[1.15] sm:text-2xl">
                <SectionCell />
                {t('Un groupe par classe', 'One group per class')}
              </h2>
              <p className="mt-3 text-ink-2">
                {t(
                  'Pour les profs : un groupe réunit les élèves d’une classe, suit les problèmes résolus par chacun et a son propre classement, de la semaine ou depuis le début.',
                  'For teachers: a group brings a class’s students together, tracks what each one solved and has its own leaderboard, for the week or all time.',
                )}
              </p>
              <LinkButton to="/groupes" variant="secondary" className="mt-6">
                {t('Créer un groupe', 'Create a group')}
              </LinkButton>
            </div>
            <dl className="divide-y divide-line border-y border-line lg:col-span-7">
              {[
                [
                  t('Un code à 6 caractères', 'A 6-character code'),
                  t(
                    'Kodo génère un code comme K7QM2P. Les élèves le saisissent dans Groupes, ou ouvrent le lien d’invitation envoyé par le prof.',
                    'Kodo generates a code such as K7QM2P. Students type it in Groups, or open the invite link sent by the teacher.',
                  ),
                ],
                [
                  t('Problème par problème', 'Problem by problem'),
                  t(
                    `Pour chaque élève, les exercices du parcours qu’il a réussis, rangés par niveau comme dans l’exemple ci-dessous, avec ses points.`,
                    `For each student, the path exercises they solved, grouped by level as in the example below, with their points.`,
                  ),
                ],
                [
                  t('Le programme de chaque soumission', 'The program behind each submission'),
                  t(
                    'Un clic sur un élève affiche ses 30 dernières soumissions, avec le code envoyé, le langage et le nombre de tests passés.',
                    'Clicking a student shows their last 30 submissions, with the code sent, the language and the number of tests passed.',
                  ),
                ],
              ].map(([term, text]) => (
                <div key={term} className="grid gap-1 py-4 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-6">
                  <dt className="font-medium">{term}</dt>
                  <dd className="text-ink-2">{text}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="mt-12">
            <ClassExample />
          </div>
        </div>
      </section>


      {/* Classement */}
      <section aria-labelledby="classement" className="border-t border-line">
        <div className={cx(container, 'grid gap-x-12 gap-y-8 py-16 sm:py-24 lg:grid-cols-12')}>
          <div className="lg:col-span-5">
            <h2 id="classement" className="display text-[1.75rem] leading-[1.15] sm:text-2xl">
              <SectionCell />
              {t('Classement de la semaine', 'This week’s leaderboard')}
            </h2>
            <p className="mt-3 text-ink-2">
              {t(
                'Points gagnés depuis lundi, heure de Paris. Un problème rapporte ses points une seule fois, +20 % si la première soumission est acceptée, +50 % s’il fait partie du défi du jour. Chaque indice ouvert avant la réussite en retire une part.',
                'Points earned since Monday, Paris time. A problem pays its points once, +20% if the first submission is accepted, +50% if it is part of the daily challenge. Each hint opened before solving takes a share away.',
              )}
            </p>
            <Link to="/classements" className="mt-4 inline-block text-sm font-medium text-accent underline-offset-2 hover:underline">
              {t('Voir tous les classements', 'See all leaderboards')}
            </Link>
          </div>
          <div className="lg:col-span-7">
            <LeaderboardTable
              rows={week.data}
              loading={week.isLoading}
              onRetry={week.isError ? () => week.refetch() : undefined}
              compact
              empty={
                <Panel className="flex items-center justify-between gap-4 px-5 py-5">
                  <p className="font-medium">{t('Aucun point depuis lundi.', 'No points since Monday.')}</p>
                  <LinkButton to="/inscription" variant="secondary" size="sm">
                    {t('Créer un compte', 'Create an account')}
                  </LinkButton>
                </Panel>
              }
            />
          </div>
        </div>
      </section>

    </>
  )
}
