// Accueil visiteur (DESIGN.md §8) : promesse → preuve → offre → inscription.
// Point focal : le juge en direct, avec un programme faux à corriger.
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check, Lightbulb, Play, X } from 'lucide-react'
import { CurriculumGrid } from '../components/CurriculumGrid'
import { LeaderboardTable } from '../components/LeaderboardTable'
import { Cell, type CellState } from '../components/Cell'
import { TestStrip } from '../components/TestStrip'
import { Button, cx, DifficultyMark, LinkButton, Panel, Skeleton, Spinner, SectionCell } from '../components/ui'
import { catalog, chapterById, chapters, chapterTitle, levels, levelTitle, loadProblem, problemById, problemList, problemTitle, totalPoints } from '../lib/content'
import { formatNumber, formatPoints, useI18n, type UiLang } from '../lib/i18n'
import { saveDraft } from '../lib/progress'
import { useLeaderboard } from '../lib/queries'
import { explainError } from '../judge/explain'
import { judge, limitFor, warmUp, type JudgeReport, type TestResult } from '../judge/judge'

const CodeEditor = lazy(() => import('../components/CodeEditor').then((m) => ({ default: m.CodeEditor })))

const FIRST_ID = 'somme-de-deux-nombres'
const first = problemById(FIRST_ID) ?? problemList[0]
const firstChapter = chapterById(first.chapter)
/** Durée des cours, de la plus courte à la plus longue (minutes). */
const minutes = chapters.map((c) => c.lessonMinutes).filter((m): m is number => !!m)
const [minLesson, maxLesson] = [Math.min(...minutes), Math.max(...minutes)]
const lessonRange = (lang: UiLang) => (minLesson === maxLesson ? `${minLesson}` : `${minLesson} ${lang === 'en' ? 'to' : 'à'} ${maxLesson}`)
/** Nombre de tests par problème, exemples compris : [minimum, maximum]. */
const { samples: sampleRange, total: testRange } = catalog.tests
/** Points d'un problème par niveau : 50, 100, 200, 400. */
const levelPoints = levels.map((l) => problemById(l.chapters[0]?.problems[0] ?? '')?.points ?? 0)
/** Limite fixée par la plupart des énoncés. */
const STATEMENT_LIMIT_MS = 1000
/** « 50 pts » sans coupure de ligne entre le nombre et l'unité. */
const pts = (lang: UiLang, n: number) => formatPoints(lang, n).replace(' ', '\u00a0')

// ------------------------------------------------------------------ Coloration minimale (extraits Python statiques)

const PY_KEYWORDS = new Set(['if', 'else', 'elif', 'for', 'in', 'while', 'def', 'return', 'and', 'or', 'not'])
const PY_BUILTINS = new Set(['int', 'input', 'print', 'map', 'len', 'range'])

function Py({ code }: { code: string }) {
  const parts = code.split(/("[^"]*"|'[^']*'|\b\d+\b|\b[A-Za-z_]\w*\b)/g)
  return (
    <>
      {parts.map((p, i) => {
        if (i % 2 === 0) return p
        const color =
          p.startsWith('"') || p.startsWith("'")
            ? 'var(--tok-string)'
            : /^\d/.test(p)
              ? 'var(--tok-number)'
              : PY_KEYWORDS.has(p)
                ? 'var(--tok-keyword)'
                : PY_BUILTINS.has(p)
                  ? 'var(--tok-builtin)'
                  : undefined
        return color ? (
          <span key={i} style={{ color }}>
            {p}
          </span>
        ) : (
          p
        )
      })}
    </>
  )
}

/** Met en police de code les fragments de programme cités dans une phrase. */
function WithCode({ text, code }: { text: string; code: string[] }) {
  const re = new RegExp(`(${code.map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g')
  return (
    <>
      {text.split(re).map((part, i) =>
        code.includes(part) ? (
          <code key={i} className="rounded-sm bg-surface-2 px-1 py-px text-[0.875em] text-ink">
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </>
  )
}

/** Bloc de code ou de sortie de programme, numéroté si c'est un programme. */
function CodeBlock({ code, numbered, className }: { code: string; numbered?: boolean; className?: string }) {
  const lines = code.replace(/\n$/, '').split('\n')
  return (
    <pre className={cx('overflow-x-auto py-3 text-[0.8125rem] leading-relaxed', className)}>
      {lines.map((l, i) => (
        <div key={i} className="flex">
          {numbered && (
            <span className="w-8 shrink-0 select-none pr-3 text-right text-muted" aria-hidden>
              {i + 1}
            </span>
          )}
          <span className={cx(numbered ? 'whitespace-pre' : 'whitespace-pre-wrap px-4 [overflow-wrap:anywhere]')}>{numbered ? <Py code={l} /> : l || ' '}</span>
        </div>
      ))}
    </pre>
  )
}

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
  const [hiddenCount, setHiddenCount] = useState<number | null>(null)
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
  useEffect(() => {
    if (!accepted || hiddenCount !== null) return
    loadProblem(FIRST_ID)
      .then((p) => setHiddenCount(p.tests.length))
      .catch(() => {})
  }, [accepted, hiddenCount])

  const firstBad = report?.results.find((r) => r.status !== 'ok')
  const passed = results.filter((r) => r.status === 'ok').length
  const done = results.some((r) => !['pending', 'running'].includes(r.status))

  let line: ReactNode
  if (loading !== null) line = <Spinner label={t(`Chargement de Python 3.14… ${loading} %`, `Loading Python 3.14… ${loading}%`)} />
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
          {hiddenCount !== null ? (
            <span>
              {t(
                `Problème complet : ${hiddenCount} tests cachés supplémentaires, ${pts(lang, first.points)}.`,
                `Full problem: ${hiddenCount} additional hidden tests, ${pts(lang, first.points)}.`,
              )}
            </span>
          ) : null}
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
  } else line = <span className="text-muted">{t('Premier lancement : chargement de Python 3.14 dans la page (7,5 Mo).', 'First run: Python 3.14 loads into the page (7.5 MB).')}</span>

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
const THRESHOLD = {
  id: 'seuil-de-temperature',
  code: 't = int(input())\nif t > 8:\n    print("OUI")\nelse:\n    print("NON")\n',
  total: 13,
  samples: 2,
  failing: 2,
  input: '8',
  output: 'NON',
}

function HiddenTestExample() {
  const { lang, t } = useI18n()
  const p = problemById(THRESHOLD.id)
  const results = Array.from({ length: THRESHOLD.total }, (_, index) => ({
    index,
    sample: index < THRESHOLD.samples,
    status: (index === THRESHOLD.failing ? 'wrong' : 'ok') as TestResult['status'],
    timeMs: 1,
  }))
  const n = THRESHOLD.failing + 1
  return (
    <div>
      <h3 className="text-lg font-semibold">{t('Un test caché qui échoue', 'A hidden test that fails')}</h3>
      <p className="mt-2 max-w-[60ch] text-ink-2">
        <WithCode
          code={['t > 8', 'OUI']}
          text={t(
            `Sur ${p ? problemTitle(lang, p) : 'Seuil de température'}, l’énoncé demande OUI dès que la température atteint 8 degrés. Ce programme écrit t > 8 : il passe les 2 exemples et ${THRESHOLD.total - 3} tests cachés, puis échoue au test ${n}.`,
            `On ${p ? problemTitle(lang, p) : 'Temperature threshold'}, the statement asks for OUI as soon as the temperature reaches 8 degrees. This program writes t > 8: it passes both examples and ${THRESHOLD.total - 3} hidden tests, then fails test ${n}.`,
          )}
        />
      </p>
      <Panel className="mt-5 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-4 py-3">
          <TestStrip results={results} size="md" className="sm:hidden" />
          <TestStrip results={results} className="hidden sm:flex" />
          <p className="text-sm">
            <span className="text-ink-2 tabular">{t(`${THRESHOLD.total - 1} tests sur ${THRESHOLD.total}`, `${THRESHOLD.total - 1} of ${THRESHOLD.total} tests`)}</span>
          </p>
        </div>
        <div className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="border-b border-line sm:border-b-0 sm:border-r">
            <p className="border-b border-line px-4 py-2 text-xs text-muted">{t('Programme soumis', 'Submitted program')}</p>
            <CodeBlock code={THRESHOLD.code} numbered className="px-1" />
          </div>
          <div className="flex flex-col">
            <p className="border-b border-line px-4 py-2 text-xs">
              <span className="font-medium text-bad">{t(`Test ${n}, caché`, `Test ${n}, hidden`)}</span>
              <span className="text-muted">{t(' : mauvaise réponse', ': wrong answer')}</span>
            </p>
            <dl className="grid grid-cols-2 text-sm">
              <div className="border-r border-line px-4 py-3">
                <dt className="text-xs text-muted">{t('Entrée du test', 'Test input')}</dt>
                <dd className="mt-1 font-mono text-[0.8125rem]">{THRESHOLD.input}</dd>
              </div>
              <div className="px-4 py-3">
                <dt className="text-xs text-muted">{t('Sortie obtenue', 'Actual output')}</dt>
                <dd className="mt-1 font-mono text-[0.8125rem] text-bad">{THRESHOLD.output}</dd>
              </div>
              <div className="col-span-2 border-t border-line px-4 py-3">
                <dt className="text-xs text-muted">{t('Sortie attendue', 'Expected output')}</dt>
                <dd className="mt-1 text-ink-2">{t('Jamais affichée pour un test caché.', 'Never shown for a hidden test.')}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Panel>
      <p className="mt-3 max-w-[60ch] text-sm text-ink-2">
        <WithCode
          code={['8', 't >= 8']}
          text={t(
            'Un test caché affiche son entrée, jamais la sortie attendue. Ici, l’entrée 8 suffit à montrer que la condition doit être t >= 8.',
            'A hidden test shows its input, never the expected output. Here, the input 8 is enough to show that the condition must be t >= 8.',
          )}
        />
      </p>
    </div>
  )
}

const ERROR_TEXT =
  'Traceback (most recent call last):\n  File "solution.py", line 1, in <module>\n    a = int(input())\nValueError: invalid literal for int() with base 10: \'3 4\''

function ErrorExample() {
  const { lang, t } = useI18n()
  const explanation = explainError('python', ERROR_TEXT, lang)
  return (
    <div>
      <h3 className="text-lg font-semibold">{t('Une erreur traduite', 'An error, translated')}</h3>
      <p className="mt-2 text-ink-2">
        <WithCode
          code={['a = int(input())', '3 4']}
          text={t(
            'a = int(input()) sur l’entrée 3 4 : Python s’arrête. Le message d’origine reste affiché, suivi d’une phrase qui dit quoi changer.',
            'a = int(input()) on the input 3 4: Python stops. The original message stays on screen, followed by one sentence saying what to change.',
          )}
        />
      </p>
      <Panel className="mt-5 overflow-hidden">
        <p className="border-b border-line px-4 py-2 text-xs font-medium text-bad">{t('Message d’erreur', 'Error message')}</p>
        <CodeBlock code={ERROR_TEXT} className="text-ink-2" />
        {explanation && (
          <p className="flex gap-2 border-t border-line bg-warn-soft px-4 py-3 text-sm">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-warn" aria-hidden />
            <span>{explanation}</span>
          </p>
        )}
      </Panel>
    </div>
  )
}

function LimitsExample() {
  const { lang, t } = useI18n()
  const rows = [
    { lang: 'Python', ms: limitFor('python', STATEMENT_LIMIT_MS) },
    { lang: 'C++', ms: limitFor('cpp', STATEMENT_LIMIT_MS) },
  ]
  const max = Math.max(...rows.map((r) => r.ms))
  const ratio = rows[0].ms / rows[1].ms
  return (
    <div className="grid items-start gap-x-12 gap-y-5 lg:col-span-12 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <h3 className="text-lg font-semibold">{t('Une limite de temps par langage', 'One time limit per language')}</h3>
        <p className="mt-2 text-ink-2">
          {t(
            `Pour un énoncé à ${formatNumber(lang, STATEMENT_LIMIT_MS)} ms, Python a ${formatNumber(lang, ratio)} fois plus de temps que le C++ : dans le navigateur, il est bien plus lent qu’un programme compilé.`,
            `For a ${formatNumber(lang, STATEMENT_LIMIT_MS)} ms statement, Python gets ${formatNumber(lang, ratio)} times as long as C++: in the browser, it runs far slower than a compiled program.`,
          )}
        </p>
      </div>
      <Panel className="overflow-hidden lg:col-span-5">
        <table className="w-full text-sm">
          <caption className="sr-only">{t(`Limite par test pour un énoncé à ${STATEMENT_LIMIT_MS} ms`, `Limit per test for a ${STATEMENT_LIMIT_MS} ms statement`)}</caption>
          <thead>
            <tr className="border-b border-line bg-surface-2 text-left text-xs text-muted">
              <th scope="col" className="h-8 w-20 pl-4 font-medium">
                {t('Langage', 'Language')}
              </th>
              <th scope="col" className="font-medium">
                <span className="sr-only">{t('Proportion', 'Proportion')}</span>
              </th>
              <th scope="col" className="w-28 pr-4 text-right font-medium">
                {t('Par test', 'Per test')}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.lang} className="border-b border-line last:border-0">
                <th scope="row" className="h-11 pl-4 text-left font-medium">
                  {r.lang}
                </th>
                <td className="px-2">
                  <span className="block h-1.5 rounded-full bg-surface-3" aria-hidden>
                    <span className="block h-full rounded-full bg-ink-2" style={{ width: `${(r.ms / max) * 100}%` }} />
                  </span>
                </td>
                <td className="pr-4 text-right tabular">{formatNumber(lang, r.ms)} ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  )
}

// ------------------------------------------------------------------ Exemple de suivi de classe (statique)

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
  const order = new Map(problemList.map((p, i) => [p.id, i]))
  const rows = STUDENTS.map((s, si) => {
    const states = problemList.map((_, i) => exampleState(si, i, s.reach))
    const points = problemList.reduce((a, p, i) => a + (states[i] === 'done' ? p.points : 0), 0)
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
              {levels.map((l) => (
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
                {levels.map((l) => {
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
  const { lang, t } = useI18n()
  const week = useLeaderboard('week', null, 5)
  const firstTitle = problemTitle(lang, first)
  const container = 'mx-auto max-w-[1200px] px-4 sm:px-6'

  return (
    <>
      {/* Promesse + preuve immédiate */}
      <section className={cx(container, 'grid items-center gap-12 pb-16 pt-12 sm:pb-24 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-12 lg:pt-24')}>
        <div>
          <h1 className="display text-[2rem] leading-[1.1] sm:text-[2.75rem]">
            {t('S’entraîner à la programmation et à l’algorithmique, en loisir ou pour les Olympiades, en Python et en C++.', 'Practise programming and algorithms, for fun or for the Olympiads, in Python and C++.')}
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg leading-[1.55] text-ink-2">
            {t(
              `${problemList.length} problèmes en Python ou en C++, jugés dans le navigateur sur des tests cachés. Chaque chapitre s’ouvre sur un cours de ${lessonRange('fr')} minutes ; chaque problème réussi rapporte des points au classement de la classe.`,
              `${problemList.length} problems in Python or C++, judged in the browser against hidden tests. Each chapter opens with a lesson of ${lessonRange('en')} minutes; every solved problem earns points on the class leaderboard.`,
            )}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <LinkButton to={`/probleme/${FIRST_ID}`} size="lg" className="h-auto! min-h-11 py-2.5 text-center whitespace-normal! sm:h-11! sm:py-0 sm:whitespace-nowrap!">
              {t(`Commencer par ${firstTitle}`, `Start with ${firstTitle}`)}
            </LinkButton>
            <LinkButton to="/parcours" size="lg" variant="secondary">
              {t(`Voir les ${chapters.length} chapitres`, `See the ${chapters.length} chapters`)}
            </LinkButton>
          </div>
          <p className="mt-5 max-w-[34rem] text-sm text-muted">
            {t(
              'Sans compte, progression conservée sur cet appareil, puis transférée au compte à l’inscription.',
              'Without an account, progress is kept on this device, then moved to the account on sign-up.',
            )}
          </p>
        </div>
        <TryIt />
      </section>

      {/* Le juge */}
      <section aria-labelledby="juge" className="border-t border-line">
        <div className={cx(container, 'py-16 sm:py-24')}>
          <SectionHeading
            id="juge"
            title={t('Le juge', 'The judge')}
            lead={t(
              `Chaque soumission passe sur ${testRange[0]} à ${testRange[1]} tests selon le problème. Les ${sampleRange[0]} à ${sampleRange[1]} premiers sont les exemples de l’énoncé ; les autres sont cachés et visent les cas limites.`,
              `Each submission runs on ${testRange[0]} to ${testRange[1]} tests depending on the problem. The first ${sampleRange[0]} to ${sampleRange[1]} are the statement’s examples; the others are hidden and target edge cases.`,
            )}
          />
          <div className="mt-12 grid gap-x-12 gap-y-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <HiddenTestExample />
            </div>
            <div className="lg:col-span-5">
              <ErrorExample />
            </div>
            <LimitsExample />
          </div>
        </div>
      </section>

      {/* Le programme */}
      <section aria-labelledby="programme" className="border-t border-line bg-surface">
        <div className={cx(container, 'py-16 sm:py-24')}>
          <SectionHeading
            id="programme"
            title={t(
              `${problemList.length} problèmes, ${chapters.length} chapitres, ${levels.length} niveaux`,
              `${problemList.length} problems, ${chapters.length} chapters, ${levels.length} levels`,
            )}
            lead={t(
              `Une case par problème. Un problème rapporte ${levelPoints
                .map((x) => formatNumber(lang, x))
                .join(', ')
                .replace(/, (?=[^,]*$)/, ' ou ')} pts selon son niveau, ${pts(lang, totalPoints)} au total.`,
              `One square per problem. A problem is worth ${levelPoints
                .map((x) => formatNumber(lang, x))
                .join(', ')
                .replace(/, (?=[^,]*$)/, ' or ')} pts depending on its level, ${pts(lang, totalPoints)} in total.`,
            )}
            action={
              <LinkButton to="/parcours" variant="secondary">
                {t(`Voir les ${chapters.length} chapitres`, `See the ${chapters.length} chapters`)}
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
                    `Pour chaque élève, lesquels des ${problemList.length} problèmes il a réussis, rangés par niveau comme dans l’exemple ci-dessous, avec ses points.`,
                    `For each student, which of the ${problemList.length} problems they solved, grouped by level as in the example below, with their points.`,
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
              {t('Classement de la semaine', 'This week’s leaderboard')}
            </h2>
            <p className="mt-3 text-ink-2">
              {t(
                'Points gagnés depuis lundi, heure de Paris. Un problème rapporte ses points une seule fois, +20 % si la première soumission est acceptée, +50 % s’il fait partie du défi du jour.',
                'Points earned since Monday, Paris time. A problem pays its points once, +20% if the first submission is accepted, +50% if it is part of the daily challenge.',
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
                <Panel className="px-5 py-6">
                  <p className="font-medium">{t('Aucun point marqué depuis lundi.', 'No points scored since Monday.')}</p>
                  <p className="mt-1 text-sm text-ink-2">
                    {t(
                      `Remise à zéro chaque lundi. Avec un compte, réussir ${firstTitle} suffit pour passer en tête (${pts(lang, first.points)}).`,
                      `Resets every Monday. With an account, solving ${firstTitle} is enough to take first place (${pts(lang, first.points)}).`,
                    )}
                  </p>
                  <LinkButton to="/inscription" variant="secondary" size="sm" className="mt-4">
                    {t('Créer un compte', 'Create an account')}
                  </LinkButton>
                </Panel>
              }
            />
          </div>
        </div>
      </section>

      {/* Inscription */}
      <section aria-labelledby="commencer" className="border-t border-line">
        <div className={cx(container, 'flex flex-col gap-6 py-16 md:flex-row md:items-center md:justify-between')}>
          <div>
            <h2 id="commencer" className="text-xl font-semibold">
              {firstTitle}
            </h2>
            <p className="mt-2 max-w-[40rem] text-ink-2">
              {t(
                `Le premier problème du parcours : lire deux entiers sur une ligne et afficher leur somme, pour ${pts(lang, first.points)}. Le cours de son chapitre, ${firstChapter ? chapterTitle(lang, firstChapter) : ''}, se lit en ${firstChapter?.lessonMinutes ?? minLesson} minutes.`,
                `The first problem of the path: read two integers on one line and print their sum, for ${pts(lang, first.points)}. The lesson of its chapter, ${firstChapter ? chapterTitle(lang, firstChapter) : ''}, takes ${firstChapter?.lessonMinutes ?? minLesson} minutes to read.`,
              )}
            </p>
          </div>
          <LinkButton to={`/probleme/${FIRST_ID}`} size="lg" className="h-auto! min-h-11 shrink-0 py-2.5 text-center whitespace-normal! sm:h-11! sm:py-0 sm:whitespace-nowrap!">
            {t(`Commencer par ${firstTitle}`, `Start with ${firstTitle}`)}
          </LinkButton>
        </div>
      </section>
    </>
  )
}
