// Page problème : énoncé à gauche, éditeur et journal du juge à droite (DESIGN.md §8, « panneau double »).
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, CircleAlert, Clock, Lightbulb, Lock, Play, RotateCcw, Send, X } from 'lucide-react'
import { CodeEditor } from '../components/CodeEditor'
import { Cell } from '../components/Cell'
import { TestStrip, cellStateOf, statusText } from '../components/TestStrip'
import { Button, CopyButton, cx, DifficultyMark, IconButton, Kbd, LinkButton, Notice, Panel, Segmented, Skeleton, Spinner, Tabs, useDelayed } from '../components/ui'
import { useToast } from '../components/Toast'
import { chapterById, chapterTitle, loadProblem, problemById, problemList, problemTitle, type ProblemData } from '../lib/content'
import { locale, pick, plural, useI18n, type UiLang } from '../lib/i18n'
import { judge, runtimeFor, warmUp, limitFor, type JudgeReport, type JudgeTest, type TestResult } from '../judge/judge'
import { explainError, trimCompilerOutput } from '../judge/explain'
import type { Lang } from '../judge/protocol'
import { loadDraft, saveDraft, useCodeLang, useProgress, useRecordSubmission } from '../lib/progress'
import { useAuth } from '../lib/auth'
import { errorText, type SubmitResult } from '../lib/supabase'
import { useProblemStats } from '../lib/queries'
import { NotFound } from './NotFound'

const CPP_TEMPLATE = `#include <iostream>
using namespace std;

int main() {

    return 0;
}
`

// Commande affichée au-dessus d'une erreur de compilation. Doit suivre CPP_FLAGS (judge/clang.worker.ts),
// qu'on ne peut pas importer ici : le module du worker s'exécute dès son chargement.
const CPP_COMMAND = 'clang++ -O2 -std=c++17 -fno-exceptions main.cpp -o main.wasm'

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
const MOD = isMac ? '⌘' : 'Ctrl'
const RUN_KEYS = [MOD, '↵']
const SUBMIT_KEYS = [MOD, '⇧', '↵']
const ARIA_RUN = isMac ? 'Meta+Enter' : 'Control+Enter'
const ARIA_SUBMIT = isMac ? 'Meta+Shift+Enter' : 'Control+Shift+Enter'

const FILE_NAME: Record<Lang, string> = { python: 'solution.py', cpp: 'main.cpp' }
const RUNTIME_NAME: Record<Lang, string> = { python: 'Python 3.14', cpp: 'C++17' }
const LANG_NAME: Record<Lang, string> = { python: 'Python', cpp: 'C++' }

const seconds = (ui: UiLang, ms: number) => `${(ms / 1000).toLocaleString(locale(ui), { maximumFractionDigits: 1 })} s`
const megabytes = (ui: UiLang, bytes: number) => (bytes / 1e6).toLocaleString(locale(ui), { minimumFractionDigits: 1, maximumFractionDigits: 1 })

/** Raccourci clavier dans un bouton. Sur fond d'accent, le filet prend la couleur du texte. */
function Keys({ keys, onAccent, className }: { keys: string[]; onAccent?: boolean; className?: string }) {
  return (
    <span className={cx('items-center gap-0.5', className)} aria-hidden>
      {keys.map((k) => (
        <Kbd key={k} className={onAccent ? 'text-current! opacity-75 shadow-[inset_0_0_0_1px_color-mix(in_oklab,currentColor_45%,transparent)]!' : undefined}>
          {k}
        </Kbd>
      ))}
    </span>
  )
}

// ------------------------------------------------------------------ Chargement de l'environnement

function useRuntimeState(lang: Lang) {
  const rt = runtimeFor(lang)
  const [, force] = useState(0)
  useEffect(() => rt.subscribe(() => force((n) => n + 1)) as () => void, [rt])
  return { state: rt.state, progress: rt.progress }
}

function RuntimeStatus({ lang }: { lang: Lang }) {
  const { t, lang: ui } = useI18n()
  const { state, progress } = useRuntimeState(lang)
  const name = RUNTIME_NAME[lang]
  if (state === 'ready')
    return (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-muted">
        <span className="size-1.5 rounded-full bg-ok" aria-hidden />
        {t(`${name} prêt`, `${name} ready`)}
      </span>
    )
  if (state === 'failed') return <span className="text-xs text-bad">{t(`${name} n’a pas pu se charger. Recharge la page.`, `${name} failed to load. Reload the page.`)}</span>
  if (state === 'loading') {
    const pct = progress.total ? Math.round((progress.loaded / progress.total) * 100) : 0
    return (
      <span className="flex items-center gap-2 whitespace-nowrap text-xs text-muted" role="status">
        <span className="hidden h-1 w-12 overflow-hidden rounded-full bg-surface-3 sm:block" aria-hidden>
          <span className="block h-full bg-accent transition-[width] duration-150" style={{ width: `${pct}%` }} />
        </span>
        {progress.total
          ? t(`${name} : ${megabytes(ui, progress.loaded)} / ${megabytes(ui, progress.total)} Mo`, `${name}: ${megabytes(ui, progress.loaded)} / ${megabytes(ui, progress.total)} MB`)
          : t(`Chargement de ${name}`, `Loading ${name}`)}
      </span>
    )
  }
  return null
}

// ------------------------------------------------------------------ Énoncé

type LeftTab = 'statement' | 'hints' | 'solution'

function StatementSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  )
}

function SampleCell({ text, copyLabel }: { text: string; copyLabel: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <pre className="min-w-0 flex-1 overflow-x-auto py-2.5 text-sm leading-relaxed">{text.replace(/\n$/, '')}</pre>
      <div className="shrink-0 pt-1.5">
        <CopyButton text={text} label={copyLabel} />
      </div>
    </div>
  )
}

function Samples({ data }: { data: ProblemData }) {
  const { t } = useI18n()
  return (
    <Panel className="overflow-hidden">
      <table className="w-full table-fixed border-collapse text-left">
        <thead className="bg-surface-2 text-xs text-muted">
          <tr>
            <th scope="col" className="w-10 py-2 pl-4 font-normal">
              <span className="sr-only">{t('Exemple', 'Example')}</span>
            </th>
            <th scope="col" className="px-3 py-2 font-normal">
              {t('Entrée', 'Input')}
            </th>
            <th scope="col" className="border-l border-line px-3 py-2 font-normal">
              {t('Sortie attendue', 'Expected output')}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.samples.map((s, i) => (
            <tr key={i} className="border-t border-line align-top">
              <th scope="row" className="py-3 pl-4 text-xs font-normal text-muted">
                {i + 1}
              </th>
              <td className="min-w-0 pl-3 pr-1">
                <SampleCell text={s.input} copyLabel={t(`Copier l’entrée ${i + 1}`, `Copy input ${i + 1}`)} />
              </td>
              <td className="min-w-0 border-l border-line pl-3 pr-1">
                <SampleCell text={s.output} copyLabel={t(`Copier la sortie ${i + 1}`, `Copy output ${i + 1}`)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  )
}

function Hints({ hints }: { hints: string[] }) {
  const { t, lang } = useI18n()
  const [shown, setShown] = useState(0)
  if (hints.length === 0) return <p className="text-sm text-ink-2">{t('Ce problème n’a pas d’indice.', 'This problem has no hints.')}</p>
  return (
    <div className="max-w-[70ch]">
      <p className="text-sm text-ink-2">
        {t(
          `${plural(lang, hints.length, ['indice', 'indices'], ['', ''])}, du plus léger au plus complet. Chacun s’ouvre après le précédent.`,
          `${plural(lang, hints.length, ['', ''], ['hint', 'hints'])}, from the lightest to the most complete. Each one opens after the previous one.`,
        )}
      </p>
      <Panel as="section" className="mt-4">
        <ol className="divide-y divide-line">
          {hints.map((h, i) => (
            <li key={i} className="px-4 py-3.5">
              <div className="flex min-h-8 items-center justify-between gap-3">
                <h3 className={cx('text-sm font-medium', i > shown && 'text-muted')}>{t(`Indice ${i + 1}`, `Hint ${i + 1}`)}</h3>
                {i === shown ? (
                  <Button variant="secondary" size="sm" onClick={() => setShown((n) => n + 1)}>
                    <Lightbulb className="size-4" aria-hidden />
                    {t(`Afficher l’indice ${i + 1}`, `Show hint ${i + 1}`)}
                  </Button>
                ) : i > shown ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                    <Lock className="size-3.5" aria-hidden />
                    {t(`après l’indice ${i}`, `after hint ${i}`)}
                  </span>
                ) : null}
              </div>
              {i < shown && <div className="anim-rise prose-kodo mt-1 text-[0.9375rem]" dangerouslySetInnerHTML={{ __html: h }} />}
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  )
}

function Solution({ data, solved, lang, onOpenHints }: { data: ProblemData; solved: boolean; lang: Lang; onOpenHints: () => void }) {
  const { lang: ui, t } = useI18n()
  const text = pick(ui, data.text.fr, data.text.en)
  const total = data.samples.length + data.tests.length
  if (!solved) {
    const langs = [data.solutionCode.python && 'Python', data.solutionCode.cpp && 'C++'].filter(Boolean) as string[]
    return (
      <div className="max-w-[70ch]">
        <div className="flex gap-3 rounded-lg bg-surface-2 px-4 py-4 shadow-[inset_0_0_0_1px_var(--line)]">
          <Lock className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
          <div>
            <p className="font-medium">
              {t(`La solution s’ouvre quand ton programme passe les ${total} tests.`, `The solution opens once your program passes all ${total} tests.`)}
            </p>
            {langs.length > 0 && (
              <p className="mt-1 text-sm text-ink-2">
                {t(
                  `Elle explique la méthode et donne un programme de référence en ${langs.join(' et en ')}.`,
                  `It explains the method and gives a reference program in ${langs.join(' and ')}.`,
                )}
              </p>
            )}
            {text.hints.length > 0 && (
              <Button variant="secondary" size="sm" className="mt-3" onClick={onOpenHints}>
                <Lightbulb className="size-4" aria-hidden />
                {t(`Ouvrir les ${text.hints.length} indices`, `Open the ${text.hints.length} hints`)}
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }
  const shownLang: Lang = lang === 'cpp' && data.solutionCode.cpp ? 'cpp' : 'python'
  const code = data.solutionCode[shownLang]
  return (
    <div className="flex max-w-[70ch] flex-col gap-6">
      <div className="prose-kodo" dangerouslySetInnerHTML={{ __html: text.solution }} />
      {code && (
        <Panel className="overflow-hidden">
          <div className="flex min-h-10 items-center justify-between gap-3 border-b border-line bg-surface-2 pl-4 pr-1.5">
            <h3 className="text-sm font-medium">{t(`Programme de référence en ${LANG_NAME[shownLang]}`, `Reference program in ${LANG_NAME[shownLang]}`)}</h3>
            <CopyButton text={code} label={t('Copier le programme de référence', 'Copy the reference program')} />
          </div>
          <pre className="overflow-x-auto px-4 py-3 text-sm leading-relaxed">{code}</pre>
        </Panel>
      )}
    </div>
  )
}

function ProblemSteps({ index, prev, next }: { index: number; prev?: string; next?: string }) {
  const { t, lang } = useI18n()
  const link = 'inline-flex size-8 items-center justify-center rounded-md text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink'
  const off = 'inline-flex size-8 items-center justify-center text-muted opacity-40'
  const name = (id: string) => problemTitle(lang, problemById(id)!)
  return (
    <div className="flex shrink-0 items-center gap-1">
      <span className="mr-1 whitespace-nowrap text-xs text-muted">{t(`${index + 1} sur ${problemList.length}`, `${index + 1} of ${problemList.length}`)}</span>
      {prev ? (
        <Link to={`/probleme/${prev}`} className={link} aria-label={t(`Problème précédent : ${name(prev)}`, `Previous problem: ${name(prev)}`)} title={`${name(prev)} (Alt ←)`}>
          <ChevronLeft className="size-4" aria-hidden />
        </Link>
      ) : (
        <span className={off} aria-hidden>
          <ChevronLeft className="size-4" />
        </span>
      )}
      {next ? (
        <Link to={`/probleme/${next}`} className={link} aria-label={t(`Problème suivant : ${name(next)}`, `Next problem: ${name(next)}`)} title={`${name(next)} (Alt →)`}>
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span className={off} aria-hidden>
          <ChevronRight className="size-4" />
        </span>
      )}
    </div>
  )
}

function StatementPanel({
  data,
  solved,
  codeLang,
  initialTab,
  index,
  prev,
  next,
}: {
  data: ProblemData
  solved: boolean
  codeLang: Lang
  initialTab: LeftTab
  index: number
  prev?: string
  next?: string
}) {
  const { lang, t } = useI18n()
  const [tab, setTab] = useState<LeftTab>(initialTab)
  const text = pick(lang, data.text.fr, data.text.en)
  const chapter = chapterById(data.chapter)
  const stats = useProblemStats()
  const solvers = stats.data?.get(data.id) ?? 0
  const scroller = useRef<HTMLDivElement>(null)
  const prefix = `problem-${data.id}`
  const pickTab = (v: LeftTab) => {
    setTab(v)
    scroller.current?.scrollTo({ top: 0 })
  }

  const tabs: { id: LeftTab; label: ReactNode }[] = [
    { id: 'statement', label: t('Énoncé', 'Statement') },
    {
      id: 'hints',
      label: (
        <>
          {t('Indices', 'Hints')}
          <span className="text-xs font-normal text-muted">{text.hints.length}</span>
        </>
      ),
    },
    {
      id: 'solution',
      label: (
        <>
          {!solved && <Lock className="size-3.5" aria-label={t('verrouillée', 'locked')} />}
          {t('Solution', 'Solution')}
        </>
      ),
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="border-b border-line px-4 pt-4 sm:px-6 sm:pt-5">
        <div className="flex min-h-8 items-center justify-between gap-3">
          {chapter && (
            <nav aria-label={t('Fil d’Ariane', 'Breadcrumb')} className="flex min-w-0 items-center gap-1 text-sm text-muted">
              <Link to="/parcours" className="shrink-0 hover:text-ink">
                {t('Parcours', 'Path')}
              </Link>
              <ChevronRight className="size-3.5 shrink-0" aria-hidden />
              <Link to={`/parcours/${chapter.id}`} className="truncate hover:text-ink">
                {chapterTitle(lang, chapter)}
              </Link>
            </nav>
          )}
          <div className="hidden lg:block">
            <ProblemSteps index={index} prev={prev} next={next} />
          </div>
        </div>
        <h1 className="display mt-1 text-xl leading-tight sm:text-2xl">{text.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink-2">
          <DifficultyMark difficulty={data.difficulty} />
          <span>{t(`${data.points} points`, `${data.points} points`)}</span>
          <span title={t('Limite par test, selon le langage', 'Limit per test, by language')} className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5 text-muted" aria-hidden />
            {t(
              `${seconds(lang, limitFor('python', data.timeLimitMs))} en Python, ${seconds(lang, limitFor('cpp', data.timeLimitMs))} en C++`,
              `${seconds(lang, limitFor('python', data.timeLimitMs))} in Python, ${seconds(lang, limitFor('cpp', data.timeLimitMs))} in C++`,
            )}
          </span>
          <span className="text-muted">
            {stats.data
              ? solvers > 0
                ? t(`Réussi par ${plural(lang, solvers, ['élève', 'élèves'], ['', ''])}`, `Solved by ${plural(lang, solvers, ['', ''], ['student', 'students'])}`)
                : t('Personne ne l’a encore réussi', 'Nobody has solved it yet')
              : null}
          </span>
          {solved && (
            <span className="inline-flex items-center gap-1 font-medium text-ok">
              <Check className="size-4" aria-hidden /> {t('Tu l’as réussi', 'You solved it')}
            </span>
          )}
        </div>
        <Tabs<LeftTab> className="mt-3 -ml-2.5" value={tab} onChange={pickTab} tabs={tabs} label={t('Contenu du problème', 'Problem content')} idPrefix={prefix} />
      </header>
      <div
        ref={scroller}
        id={`${prefix}-panel`}
        role="tabpanel"
        aria-labelledby={`${prefix}-tab-${tab}`}
        tabIndex={0}
        className="min-h-0 flex-1 overflow-y-auto px-4 pb-12 pt-6 focus-visible:outline-offset-[-2px] sm:px-6"
      >
        {tab === 'statement' && (
          <article className="max-w-[70ch]">
            <div className="prose-kodo" dangerouslySetInnerHTML={{ __html: text.statement }} />
            <StatementSection title={t('Entrée', 'Input')}>
              <div className="prose-kodo" dangerouslySetInnerHTML={{ __html: text.input }} />
            </StatementSection>
            <StatementSection title={t('Sortie', 'Output')}>
              <div className="prose-kodo" dangerouslySetInnerHTML={{ __html: text.output }} />
            </StatementSection>
            {text.constraints && (
              <StatementSection title={t('Contraintes', 'Constraints')}>
                <div className="prose-kodo" dangerouslySetInnerHTML={{ __html: text.constraints }} />
              </StatementSection>
            )}
            <StatementSection title={data.samples.length > 1 ? t('Exemples', 'Examples') : t('Exemple', 'Example')}>
              <Samples data={data} />
            </StatementSection>
            {lang === 'en' && !data.text.en && <p className="mt-8 text-sm text-muted">This problem has not been translated into English yet, so it is shown in French.</p>}
          </article>
        )}
        {tab === 'hints' && <Hints key={data.id} hints={text.hints} />}
        {tab === 'solution' && <Solution data={data} solved={solved} lang={codeLang} onOpenHints={() => pickTab('hints')} />}
      </div>
    </div>
  )
}

// ------------------------------------------------------------------ Journal du juge

type Mode = 'run' | 'submit' | 'custom'

interface Outcome {
  mode: Mode
  report: JudgeReport | null
  phase: 'loading' | 'compiling' | 'testing' | 'done' | 'failed'
  recorded?: SubmitResult | null
  recordError?: string
  failure?: string
}

type StripItem = Pick<TestResult, 'index' | 'status' | 'sample' | 'timeMs'>

const pendingItems = (from: number, count: number, sample: boolean): StripItem[] =>
  Array.from({ length: count }, (_, i) => ({ index: from + i, status: 'pending', sample, timeMs: 0 }))

/** Les deux bandes : exemples de l'énoncé, puis tests cachés. */
function Strips({ items, samples, hidden, selected, onSelect }: { items: StripItem[] | null; samples: number; hidden: number; selected?: number | null; onSelect?: (i: number) => void }) {
  const { t } = useI18n()
  const sampleItems = items?.filter((x) => x.sample) ?? pendingItems(0, samples, true)
  const ran = items?.filter((x) => !x.sample) ?? []
  const hiddenItems = ran.length ? ran : pendingItems(samples, hidden, false)
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-3">
      <div>
        <p className="mb-2 text-xs text-muted">{samples > 1 ? t(`${samples} exemples`, `${samples} examples`) : t('1 exemple', '1 example')}</p>
        <TestStrip results={sampleItems} selected={selected} onSelect={onSelect} />
      </div>
      {hidden > 0 && (
        <div>
          <p className="mb-2 text-xs text-muted">
            {ran.length
              ? t(`${hidden} tests cachés`, `${hidden} hidden tests`)
              : t(`${hidden} tests cachés, lancés quand tu soumets`, `${hidden} hidden tests, run when you submit`)}
          </p>
          <TestStrip results={hiddenItems} selected={selected} onSelect={onSelect} />
        </div>
      )}
    </div>
  )
}

const OUT_LIMIT = 1200

/** Affiche une sortie de programme, en surlignant la valeur numéro `mark` (0 = la première). */
function Output({ text, mark, tone }: { text: string; mark?: number; tone?: 'ok' | 'bad' }) {
  const { t, lang } = useI18n()
  const body = text.replace(/\n$/, '')
  const cut = body.length > OUT_LIMIT
  const shown = cut ? body.slice(0, OUT_LIMIT) : body
  let parts: ReactNode = shown
  if (mark !== undefined) {
    const re = /\S+/g
    let m: RegExpExecArray | null
    let k = 0
    while ((m = re.exec(shown))) {
      if (k++ === mark) {
        parts = (
          <>
            {shown.slice(0, m.index)}
            <mark className={cx('rounded-[2px] px-0.5 -mx-0.5', tone === 'ok' ? 'bg-ok-soft text-ok' : 'bg-bad-soft text-bad')}>{m[0]}</mark>
            {shown.slice(m.index + m[0].length)}
          </>
        )
        break
      }
    }
  }
  return (
    <pre className="max-h-40 overflow-auto text-[0.8125rem] leading-relaxed">
      {parts}
      {cut && <span className="text-muted">{t(`\n… ${plural(lang, body.length - OUT_LIMIT, ['caractère de plus', 'caractères de plus'], ['', ''])}`, `\n… ${plural(lang, body.length - OUT_LIMIT, ['', ''], ['more character', 'more characters'])}`)}</span>}
    </pre>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[92px_minmax(0,1fr)] sm:grid-cols-[120px_minmax(0,1fr)]">
      <dt className="px-3 py-2 text-xs leading-5 text-muted">{label}</dt>
      <dd className="min-w-0 border-l border-line px-3 py-2">{children}</dd>
    </div>
  )
}

function Callout({ children }: { children: ReactNode }) {
  return (
    <p className="flex gap-2.5 rounded-md bg-warn-soft px-3 py-2.5 text-sm text-ink shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--warn)_30%,transparent)]">
      <Lightbulb className="mt-0.5 size-4 shrink-0 text-warn" aria-hidden />
      <span>{children}</span>
    </p>
  )
}

const tokens = (s: string) => s.split(/\s+/).filter(Boolean)
const short = (s: string) => (s.length > 32 ? `${s.slice(0, 31)}…` : s)

/** Premier écart entre la sortie attendue et celle de l'élève, comme le juge les compare (valeur par valeur). */
function firstDiff(expected: string, got: string) {
  const a = tokens(expected)
  const b = tokens(got)
  for (let i = 0; i < Math.max(a.length, b.length); i++) if (a[i] !== b[i]) return { i, exp: a[i] as string | undefined, got: b[i] as string | undefined, expCount: a.length, gotCount: b.length }
  return null
}

function DiffNote({ d }: { d: NonNullable<ReturnType<typeof firstDiff>> }) {
  const { t, lang } = useI18n()
  let line: string
  if (d.gotCount === 0) line = t('Ton programme n’a rien affiché.', 'Your program printed nothing.')
  else if (d.exp !== undefined && d.got !== undefined)
    line =
      d.exp.toLowerCase() === d.got.toLowerCase()
        ? t(`Seules les majuscules diffèrent, valeur ${d.i + 1} : « ${short(d.exp)} » attendu, « ${short(d.got)} » affiché.`, `Only the letter case differs, value ${d.i + 1}: expected “${short(d.exp)}”, got “${short(d.got)}”.`)
        : t(`Premier écart à la valeur ${d.i + 1} : « ${short(d.exp)} » attendu, « ${short(d.got)} » affiché.`, `First difference at value ${d.i + 1}: expected “${short(d.exp)}”, got “${short(d.got)}”.`)
  else if (d.got === undefined)
    line = t(
      `Ta sortie s’arrête après ${plural(lang, d.gotCount, ['valeur', 'valeurs'], ['', ''])} ; la sortie attendue en compte ${d.expCount}.`,
      `Your output stops after ${plural(lang, d.gotCount, ['', ''], ['value', 'values'])}; the expected output has ${d.expCount}.`,
    )
  else
    line = t(
      `Ta sortie continue après les ${d.expCount} valeurs attendues : « ${short(d.got!)} » est en trop.`,
      `Your output goes on after the ${d.expCount} expected values: “${short(d.got!)}” is extra.`,
    )
  return (
    <p className="text-sm text-ink">
      {line}{' '}
      <span className="text-muted">{t('Les espaces et retours à la ligne ne comptent pas.', 'Spaces and line breaks do not count.')}</span>
    </p>
  )
}

function TestDetail({ r, lang, limitMs, custom, skippedAfter, onUseInput }: { r: TestResult; lang: Lang; limitMs: number; custom: boolean; skippedAfter: number; onUseInput: (input: string) => void }) {
  const { t, lang: ui } = useI18n()
  const explanation = r.status === 'error' ? explainError(lang, r.stderr, ui) : null
  const diff = r.status === 'wrong' && r.expected !== undefined ? firstDiff(r.expected, r.stdout) : null
  const otherLang: Lang = lang === 'python' ? 'cpp' : 'python'
  return (
    <div className="mt-5 flex flex-col gap-3">
      {r.status === 'timeout' && (
        <p className="text-sm text-ink">
          {t(`Arrêté à ${seconds(ui, limitMs)}, la limite en ${LANG_NAME[lang]} pour ce problème`, `Stopped at ${seconds(ui, limitMs)}, the ${LANG_NAME[lang]} limit for this problem`)}
          {skippedAfter > 0
            ? t(` ; les ${plural(ui, skippedAfter, ['test suivant n’a', 'tests suivants n’ont'], ['', ''])} pas été lancés.`, `; the next ${plural(ui, skippedAfter, ['', ''], ['test was', 'tests were'])} not run.`)
            : '.'}{' '}
          <span className="text-ink-2">
            {t(
              `Cherche une boucle qui ne s’arrête jamais, ou compte les opérations pour la plus grande entrée des contraintes. En ${LANG_NAME[otherLang]}, la limite est de ${seconds(ui, limitFor(otherLang, limitMs === limitFor(lang, 0) ? 0 : limitMs))}.`,
              `Look for a loop that never ends, or count the operations for the largest input in the constraints. In ${LANG_NAME[otherLang]}, the limit is ${seconds(ui, limitFor(otherLang, limitMs === limitFor(lang, 0) ? 0 : limitMs))}.`,
            )}
          </span>
        </p>
      )}
      {diff && <DiffNote d={diff} />}
      {explanation && <Callout>{explanation}</Callout>}
      <div className="overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_var(--line-strong)]">
        <div className="flex min-h-10 items-center justify-between gap-3 border-b border-line bg-surface-2 px-3">
          <span className="flex min-w-0 items-center gap-2 text-sm">
            {!custom && <Cell state={cellStateOf(r.status)} label={statusText(t, r.status)} />}
            <span className="font-medium">{custom ? t('Ton entrée', 'Your input') : t(`Test ${r.index + 1}`, `Test ${r.index + 1}`)}</span>
            {!custom && <span className="truncate text-muted">{r.sample ? t(`exemple ${r.index + 1} de l’énoncé`, `example ${r.index + 1} from the statement`) : t('test caché', 'hidden test')}</span>}
          </span>
          <span className="shrink-0 text-xs text-muted">
            {statusText(t, r.status)}, {r.timeMs} ms
          </span>
        </div>
        <dl className="divide-y divide-line">
          <Row label={t('Entrée', 'Input')}>
            <Output text={r.input} />
          </Row>
          {r.expected !== undefined ? (
            <Row label={t('Sortie attendue', 'Expected output')}>
              <Output text={r.expected} mark={diff?.exp !== undefined ? diff.i : undefined} tone="ok" />
            </Row>
          ) : !r.sample ? (
            <Row label={t('Sortie attendue', 'Expected output')}>
              <p className="text-sm text-ink-2">
                {t(
                  'Masquée : pour un test caché, ton navigateur ne reçoit qu’une empreinte SHA-256 de la sortie attendue, comparée à celle de ta sortie.',
                  'Hidden: for a hidden test, your browser only receives a SHA-256 hash of the expected output, compared with the hash of yours.',
                )}
              </p>
            </Row>
          ) : null}
          <Row label={t('Ta sortie', 'Your output')}>
            {r.stdout.trim() === '' ? (
              <p className="text-sm text-muted">{t('Rien n’a été affiché.', 'Nothing was printed.')}</p>
            ) : (
              <Output text={r.stdout} mark={diff?.got !== undefined ? diff.i : undefined} tone="bad" />
            )}
          </Row>
          {r.stderr && (
            <Row label={t('Erreur', 'Error')}>
              <div className="text-bad">
                <Output text={r.stderr} />
              </div>
            </Row>
          )}
        </dl>
      </div>
      {!r.sample && r.status !== 'ok' && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Button variant="secondary" size="sm" onClick={() => onUseInput(r.input)}>
            {t('Reprendre cette entrée', 'Reuse this input')}
          </Button>
          <span className="text-xs text-muted">
            {t('Elle remplace ta propre entrée : corrige ton code, puis', 'It replaces your own input: fix your code, then')} <Keys keys={RUN_KEYS} className="inline-flex align-middle" />{' '}
            {t('le relance dessus.', 'reruns it on that input.')}
          </span>
        </div>
      )}
    </div>
  )
}

function SuccessBlock({ o, data, next, onShowSolution }: { o: Outcome; data: ProblemData; next: string | null; onShowSolution: () => void }) {
  const { t, lang: ui } = useI18n()
  const { session } = useAuth()
  const rec = o.recorded
  const nextMeta = next ? problemById(next) : undefined
  const title = pick(ui, data.text.fr, data.text.en).title
  return (
    <div className="anim-rise mt-5 flex flex-col gap-5 border-t border-line pt-5 sm:flex-row sm:items-end sm:justify-between">
      <div aria-live="polite">
        {rec?.new_solve ? (
          <>
            <p className="display text-2xl font-semibold leading-none">
              +{rec.xp_gain} <span className="text-base font-medium text-ink-2">points</span>
            </p>
            <dl className="mt-3 grid w-fit grid-cols-[auto_auto] gap-x-8 gap-y-1 text-sm">
              <dt className="text-ink-2">{title}</dt>
              <dd className="tabular text-right">{data.points}</dd>
              {rec.first_try && (
                <>
                  <dt className="text-ink-2">{t('Bonus premier essai (20 %)', 'First-try bonus (20%)')}</dt>
                  <dd className="tabular text-right">+{Math.floor(data.points / 5)}</dd>
                </>
              )}
              {rec.daily && (
                <>
                  <dt className="text-ink-2">{t('Bonus défi du jour (50 %)', 'Daily challenge bonus (50%)')}</dt>
                  <dd className="tabular text-right">+{Math.floor(data.points / 2)}</dd>
                </>
              )}
            </dl>
            {rec.streak > 0 && (
              <p className="mt-3 text-sm text-ink-2">
                {t(`Série en cours : ${plural(ui, rec.streak, ['jour', 'jours'], ['', ''])} d’affilée.`, `Current streak: ${plural(ui, rec.streak, ['', ''], ['day', 'days'])} in a row.`)}
              </p>
            )}
          </>
        ) : rec ? (
          <p className="text-sm text-ink">{t('Tu avais déjà réussi ce problème : cette version est enregistrée, sans points en plus.', 'You had already solved this problem: this version is saved, with no extra points.')}</p>
        ) : !session ? (
          <p className="max-w-[52ch] text-sm text-ink">
            {t('Réussite enregistrée sur cet appareil. ', 'Saved on this device. ')}
            <Link to="/inscription" className="font-medium text-accent underline underline-offset-2">
              {t('Crée un compte', 'Create an account')}
            </Link>{' '}
            {t(`pour gagner les ${data.points} points et apparaître au classement.`, `to earn the ${data.points} points and appear on the leaderboard.`)}
          </p>
        ) : o.recordError ? (
          <p className="text-sm text-bad">{o.recordError}</p>
        ) : (
          <Spinner label={t('Enregistrement de ta réussite…', 'Saving your solve…')} />
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={onShowSolution}>
          {t('Voir la solution', 'See the solution')}
        </Button>
        {nextMeta && (
          <LinkButton to={`/probleme/${nextMeta.id}`} size="sm">
            {t(`Ouvrir ${problemTitle(ui, nextMeta)}`, `Open ${problemTitle(ui, nextMeta)}`)}
            <ArrowRight className="size-4" aria-hidden />
          </LinkButton>
        )}
      </div>
    </div>
  )
}

function RunLog({
  o,
  data,
  lang,
  limitMs,
  next,
  onShowSolution,
  onUseInput,
}: {
  o: Outcome | null
  data: ProblemData
  lang: Lang
  limitMs: number
  next: string | null
  onShowSolution: () => void
  onUseInput: (input: string) => void
}) {
  const { t, lang: ui } = useI18n()
  const r = o?.report ?? null
  const samples = data.samples.length
  const hidden = data.tests.length
  const total = samples + hidden
  const [open, setOpen] = useState<number | null>(null)
  const firstBad = r?.results.find((x) => x.status !== 'ok' && x.status !== 'pending' && x.status !== 'running')
  useEffect(() => {
    if (o?.phase === 'done') setOpen(firstBad && firstBad.status !== 'skipped' ? firstBad.index : o.mode === 'custom' ? 0 : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [o?.phase])

  // --- Rien n'a encore été lancé
  if (!o)
    return (
      <div>
        <p className="text-sm text-ink">
          {t(
            `Ton programme sera jugé sur ${total} tests : ${samples > 1 ? `les ${samples} exemples` : 'l’exemple'} de l’énoncé, puis ${hidden} tests cachés.`,
            `Your program will be judged on ${total} tests: the ${samples > 1 ? `${samples} examples` : 'example'} from the statement, then ${hidden} hidden tests.`,
          )}
        </p>
        <div className="mt-4">
          <Strips items={null} samples={samples} hidden={hidden} />
        </div>
        <p className="mt-4 hidden flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted md:flex">
          <Keys keys={RUN_KEYS} className="inline-flex" />
          <span className="mr-3">{t('lance les exemples', 'runs the examples')}</span>
          <Keys keys={SUBMIT_KEYS} className="inline-flex" />
          <span>{t(`soumet sur les ${total} tests`, `submits on all ${total} tests`)}</span>
        </p>
      </div>
    )

  if (o.phase === 'failed')
    return (
      <Notice tone="error">
        {o.failure ?? t('Le juge n’a pas pu démarrer.', 'The judge could not start.')}{' '}
        {t('Recharge la page puis relance ; si l’erreur revient, essaie un autre navigateur.', 'Reload the page and run again; if the error comes back, try another browser.')}
      </Notice>
    )

  // --- Erreur de compilation (C++)
  if (r?.compileError !== undefined) {
    const explanation = explainError('cpp', r.compileError, ui)
    return (
      <div className="flex flex-col gap-3">
        <p className="flex items-center gap-2 font-semibold text-bad" aria-live="polite">
          <CircleAlert className="size-4" aria-hidden /> {t('Erreur de compilation : aucun test n’a été lancé', 'Compilation error: no test was run')}
        </p>
        {explanation && <Callout>{explanation}</Callout>}
        <div className="overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_var(--line-strong)]">
          <p className="overflow-x-auto whitespace-nowrap border-b border-line bg-surface-2 px-3 py-2 font-mono text-xs text-muted">
            <span aria-hidden>$ </span>
            {CPP_COMMAND}
          </p>
          <pre className="max-h-64 overflow-auto px-3 py-2.5 text-[0.8125rem] leading-relaxed">{trimCompilerOutput(r.compileError)}</pre>
        </div>
      </div>
    )
  }

  const done = o.phase === 'done'
  const custom = o.mode === 'custom'
  const finished = r?.results.filter((x) => x.status !== 'pending' && x.status !== 'running').length ?? 0
  const accepted = done && r?.verdict === 'accepted'
  const items: StripItem[] | null =
    r?.results ?? (o.mode === 'submit' ? [...pendingItems(0, samples, true), ...pendingItems(samples, hidden, false)] : o.mode === 'run' ? pendingItems(0, samples, true) : null)

  let head: ReactNode
  if (!done || !r) {
    const label =
      o.phase === 'compiling'
        ? t('Compilation de main.cpp…', 'Compiling main.cpp…')
        : o.phase === 'loading'
          ? t(`Démarrage de ${RUNTIME_NAME[lang]}…`, `Starting ${RUNTIME_NAME[lang]}…`)
          : custom
            ? t('Exécution sur ton entrée…', 'Running on your input…')
            : t(`Test ${Math.min(finished + 1, r?.total ?? 1)} sur ${r?.total ?? 0}…`, `Test ${Math.min(finished + 1, r?.total ?? 1)} of ${r?.total ?? 0}…`)
    head = <Spinner label={label} className="text-ink-2" />
  } else if (custom) {
    const x = r.results[0]
    head = (
      <p className={cx('text-sm font-medium', x?.status === 'ok' ? 'text-ink' : 'text-bad')} aria-live="polite">
        {x?.status === 'ok'
          ? t(`Exécuté sur ton entrée en ${x.timeMs} ms`, `Ran on your input in ${x.timeMs} ms`)
          : `${statusText(t, x?.status ?? 'error').replace(/^./, (c) => c.toUpperCase())} ${t('sur ton entrée', 'on your input')}`}
      </p>
    )
  } else {
    const title = accepted
      ? o.mode === 'submit'
        ? t('Problème réussi', 'Problem solved')
        : samples > 1
          ? t(`Les ${samples} exemples passent`, `All ${samples} examples pass`)
          : t('L’exemple passe', 'The example passes')
      : firstBad
        ? `${statusText(t, firstBad.status).replace(/^./, (c) => c.toUpperCase())} ${t('au test', 'on test')} ${firstBad.index + 1}`
        : ''
    head = (
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className={cx('flex items-center gap-1.5 font-semibold', accepted ? 'text-ok' : 'text-bad')} aria-live="polite">
          {accepted ? <Check className="size-4 self-center" aria-hidden /> : <X className="size-4 self-center" aria-hidden />}
          {title}
        </p>
        <p className="text-sm text-muted">
          {t(`${r.passed}/${r.total} tests réussis, ${r.maxTimeMs} ms au plus`, `${r.passed}/${r.total} tests passed, ${r.maxTimeMs} ms max`)}
        </p>
      </div>
    )
  }

  const selected = done && r && open !== null ? r.results[open] : undefined
  const skippedAfter = selected ? r!.results.filter((x) => x.status === 'skipped').length : 0

  return (
    <div>
      {head}
      {items && (
        <div className="mt-4">
          <Strips items={items} samples={samples} hidden={hidden} selected={done ? open : null} onSelect={done ? (i) => setOpen(open === i ? null : i) : undefined} />
        </div>
      )}
      {accepted && o.mode === 'run' && (
        <p className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-ink-2">
          {t(`Soumets pour lancer les ${hidden} tests cachés :`, `Submit to run the ${hidden} hidden tests:`)}
          <Keys keys={SUBMIT_KEYS} className="inline-flex" />
        </p>
      )}
      {accepted && o.mode === 'submit' && <SuccessBlock o={o} data={data} next={next} onShowSolution={onShowSolution} />}
      {selected && !(accepted && o.mode === 'submit') && (
        <TestDetail key={selected.index} r={selected} lang={lang} limitMs={limitMs} custom={custom} skippedAfter={skippedAfter} onUseInput={onUseInput} />
      )}
      {selected && accepted && o.mode === 'submit' && (
        <TestDetail key={selected.index} r={selected} lang={lang} limitMs={limitMs} custom={false} skippedAfter={0} onUseInput={onUseInput} />
      )}
    </div>
  )
}

// ------------------------------------------------------------------ Espace de travail

function defaultCode(data: ProblemData, lang: Lang, ui: UiLang) {
  const starter = data.starter[ui]?.[lang] ?? data.starter.fr[lang]
  if (starter) return starter
  return lang === 'cpp' ? CPP_TEMPLATE : ''
}

function Workspace({ data, onSolved, onShowSolution }: { data: ProblemData; onSolved: (problemId: string) => void; onShowSolution: () => void }) {
  const { t, lang: ui } = useI18n()
  const [lang, setLang] = useCodeLang()
  const [code, setCode] = useState(() => loadDraft(data.id, lang) ?? defaultCode(data, lang, ui))
  const [customInput, setCustomInput] = useState(() => data.samples[0]?.input ?? '')
  const [showCustom, setShowCustom] = useState(false)
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const [busy, setBusy] = useState(false)
  const record = useRecordSubmission()
  const toast = useToast()
  const abort = useRef<AbortController | null>(null)
  const customRef = useRef<HTMLTextAreaElement>(null)
  const next = useMemo(() => {
    const i = problemList.findIndex((p) => p.id === data.id)
    return problemList[i + 1]?.id ?? null
  }, [data.id])

  // Clé de l'exécution en cours : un résultat qui arrive après un changement de problème
  // ou de langage n'est jamais affiché ni attribué au nouveau problème.
  const runKey = useRef(`${data.id}:${lang}`)

  // Nouveau problème ou nouveau langage : on arrête l'exécution en cours et on recharge le brouillon.
  useEffect(() => {
    runKey.current = `${data.id}:${lang}`
    abort.current?.abort()
    setBusy(false)
    setCode(loadDraft(data.id, lang) ?? defaultCode(data, lang, ui))
    setOutcome(null)
    setCustomInput(data.samples[0]?.input ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id, lang])

  useEffect(() => {
    warmUp(lang)
  }, [lang])

  // Sauvegarde du brouillon, une demi-seconde après la dernière frappe.
  useEffect(() => {
    const id = setTimeout(() => saveDraft(data.id, lang, code), 500)
    return () => clearTimeout(id)
  }, [code, data.id, lang])

  const run = useCallback(
    async (mode: Mode) => {
      if (busy) return
      if (!code.trim()) {
        toast(t('Écris d’abord un programme dans l’éditeur.', 'Write a program in the editor first.'))
        return
      }
      setBusy(true)
      const key = `${data.id}:${lang}`
      const ctl = new AbortController()
      abort.current = ctl
      const live = () => runKey.current === key && !ctl.signal.aborted
      const tests: JudgeTest[] =
        mode === 'custom'
          ? [{ input: customInput.endsWith('\n') ? customInput : customInput + '\n', sample: true }]
          : mode === 'run'
            ? data.samples.map((s) => ({ input: s.input, output: s.output, sample: true }))
            : [...data.samples.map((s) => ({ input: s.input, output: s.output, sample: true })), ...data.tests.map((x) => ({ input: x.input, hash: x.hash, sample: false }))]
      let report: JudgeReport | null = null
      setOutcome({ mode, report: null, phase: 'loading' })
      const show: typeof setOutcome = (v) => {
        if (live()) setOutcome(v)
      }
      try {
        report = await judge({
          lang,
          code,
          problemId: data.id,
          tests,
          timeLimitMs: data.timeLimitMs,
          signal: ctl.signal,
          onEvent: (e) => {
            if (e.kind === 'compiling') show({ mode, report: null, phase: 'compiling' })
            if (e.kind === 'test')
              show((o) => {
                const results: TestResult[] = o?.report?.results.slice() ?? tests.map((x, i) => ({ index: i, sample: x.sample, status: 'pending', timeMs: 0, stdout: '', stderr: '', input: x.input, expected: x.output }))
                results[e.result.index] = { ...e.result }
                if (e.result.index + 1 < results.length && results[e.result.index + 1].status === 'pending') results[e.result.index + 1] = { ...results[e.result.index + 1], status: 'running' }
                return { mode, phase: 'testing', report: { verdict: null, results, passed: results.filter((r) => r.status === 'ok').length, total: results.length, maxTimeMs: 0 } }
              })
          },
        })
        // Exécution interrompue (changement de problème ou de langage) : rien à afficher ni à enregistrer.
        if (ctl.signal.aborted) return
        show({ mode, report, phase: 'done' })
      } catch (err) {
        if (ctl.signal.aborted) return
        show({ mode, report: null, phase: 'failed', failure: err instanceof Error ? err.message : String(err) })
        if (live()) setBusy(false)
        return
      }
      if (live()) setBusy(false)
      if (mode !== 'submit' || !report.verdict) return
      // Le jugement est terminé : on l'enregistre même si l'élève est déjà passé à autre chose.
      try {
        const res = await record({ problemId: data.id, lang, code, verdict: report.verdict, passed: report.passed, total: report.total, timeMs: report.maxTimeMs })
        show({ mode, report, phase: 'done', recorded: res })
        if (report.verdict === 'accepted') onSolved(data.id)
      } catch (err) {
        show({ mode, report, phase: 'done', recordError: errorText(err, ui) })
      }
    },
    [busy, code, customInput, data, lang, record, toast, t, ui, onSolved],
  )

  const reset = () => {
    if (window.confirm(t('Remplacer ton code par le code de départ ? Ton brouillon sera perdu.', 'Replace your code with the starting code? Your draft will be lost.'))) {
      setCode(defaultCode(data, lang, ui))
    }
  }

  const useInput = (input: string) => {
    setCustomInput(input)
    setShowCustom(true)
    setTimeout(() => customRef.current?.focus(), 0)
  }

  const limitMs = limitFor(lang, data.timeLimitMs)
  const showSkeleton = useDelayed(busy && !outcome, 300)
  const runningSubmit = busy && outcome?.mode === 'submit'
  const runningOther = busy && outcome?.mode !== 'submit'

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* En-tête façon onglet d'éditeur */}
      <div className="flex h-11 shrink-0 items-stretch justify-between gap-2 border-b border-line bg-surface-2 pr-1.5">
        <div className="relative -mb-px flex items-center border-r border-line bg-surface px-4">
          <span className="absolute inset-x-0 top-0 h-0.5 bg-accent" aria-hidden />
          <span className="font-mono text-[0.8125rem] text-ink">{FILE_NAME[lang]}</span>
        </div>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="hidden min-w-0 sm:inline-flex">
            <RuntimeStatus lang={lang} />
          </span>
          <Segmented<Lang>
            size="sm"
            label={t('Langage', 'Language')}
            value={lang}
            onChange={setLang}
            options={[
              { value: 'python', label: 'Python' },
              { value: 'cpp', label: 'C++' },
            ]}
          />
          <IconButton label={t('Revenir au code de départ', 'Back to the starting code')} onClick={reset}>
            <RotateCcw className="size-4" aria-hidden />
          </IconButton>
        </div>
      </div>
      <div className="flex shrink-0 items-center border-b border-line px-4 py-1.5 sm:hidden">
        <RuntimeStatus lang={lang} />
      </div>
      <div className="min-h-[220px] flex-1">
        <CodeEditor
          value={code}
          onChange={setCode}
          lang={lang}
          label={t('Ton code', 'Your code')}
          placeholder={lang === 'python' ? t('# Écris ton programme ici', '# Write your program here') : undefined}
          onRun={() => run(showCustom ? 'custom' : 'run')}
          onSubmit={() => run('submit')}
        />
      </div>
      {showCustom && (
        <div className="border-t border-line px-3 pb-3 pt-2">
          <label htmlFor="custom-input" className="text-xs text-muted">
            {t('Ton entrée, lue par ton programme comme une entrée de test', 'Your input, read by your program like a test input')}
          </label>
          <textarea
            ref={customRef}
            id="custom-input"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            rows={3}
            spellCheck={false}
            className="mt-1 block max-h-40 w-full resize-y rounded-md bg-surface px-3 py-2 font-mono text-sm shadow-[inset_0_0_0_1px_var(--field-line)] focus:shadow-[inset_0_0_0_1px_var(--accent),0_0_0_3px_color-mix(in_oklab,var(--accent)_22%,transparent)] focus:outline-none"
          />
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-3 py-2">
        <label className="flex min-h-9 items-center gap-2 text-sm text-ink-2">
          <input type="checkbox" checked={showCustom} onChange={(e) => setShowCustom(e.target.checked)} className="size-4 accent-[var(--accent)]" />
          {t('Tester avec ma propre entrée', 'Test with my own input')}
        </label>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => run(showCustom ? 'custom' : 'run')} loading={runningOther} disabled={busy} aria-keyshortcuts={ARIA_RUN}>
            {!runningOther && <Play className="size-4" aria-hidden />}
            {showCustom ? t('Exécuter sur mon entrée', 'Run on my input') : t('Tester les exemples', 'Run examples')}
            <Keys keys={RUN_KEYS} className="ml-1 hidden xl:inline-flex" />
          </Button>
          <Button onClick={() => run('submit')} loading={runningSubmit} disabled={busy} aria-keyshortcuts={ARIA_SUBMIT}>
            {!runningSubmit && <Send className="size-4" aria-hidden />}
            {t('Soumettre', 'Submit')}
            <Keys keys={SUBMIT_KEYS} onAccent className="ml-1 hidden xl:inline-flex" />
          </Button>
        </div>
      </div>
      <section aria-label={t('Résultats du juge', 'Judge results')} className="max-h-[50%] min-h-[132px] shrink-0 overflow-y-auto border-t border-line px-4 py-4 sm:px-5">
        {showSkeleton && !outcome ? (
          <Skeleton className="h-16" />
        ) : (
          <RunLog o={outcome} data={data} lang={lang} limitMs={limitMs} next={next} onShowSolution={onShowSolution} onUseInput={useInput} />
        )}
      </section>
    </div>
  )
}

// ------------------------------------------------------------------ Page

export function Problem() {
  const { id = '' } = useParams()
  const { t, lang } = useI18n()
  const meta = problemById(id)
  const progress = useProgress()
  const navigate = useNavigate()
  const [codeLang] = useCodeLang()
  const [mobilePane, setMobilePane] = useState<'statement' | 'code'>('statement')
  const [solvedNow, setSolvedNow] = useState(false)
  // Problème affiché au moment où une soumission se termine (voir onSolved).
  const idRef = useRef(id)
  idRef.current = id
  // Ouverture de l'onglet Solution depuis le juge : on remonte le panneau d'énoncé sur cet onglet.
  const [solutionView, setSolutionView] = useState<{ id: string; n: number } | null>(null)
  const q = useQuery({ queryKey: ['problem', id], queryFn: () => loadProblem(id), enabled: !!meta, staleTime: Infinity })
  const showSkeleton = useDelayed(q.isLoading)

  useEffect(() => {
    setSolvedNow(false)
    setMobilePane('statement')
  }, [id])
  useEffect(() => {
    if (meta) document.title = `${problemTitle(lang, meta)} · Kodo`
  }, [meta, lang])

  const idx = problemList.findIndex((p) => p.id === id)
  const prev = problemList[idx - 1]
  const next = problemList[idx + 1]

  // Raccourcis de navigation : Alt + ← / →
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey) return
      // Pas pendant la frappe : Alt+flèche sert aussi à se déplacer dans l'éditeur et les champs.
      const el = e.target as HTMLElement | null
      if (el?.closest('.cm-editor, input, textarea, select, [contenteditable="true"]')) return
      if (e.key === 'ArrowLeft' && prev) navigate(`/probleme/${prev.id}`)
      if (e.key === 'ArrowRight' && next) navigate(`/probleme/${next.id}`)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next, navigate])

  if (!meta) return <NotFound />
  const solved = solvedNow || progress.solved.has(id)
  const openSolution = solutionView?.id === id

  return (
    <div className="flex h-[calc(100dvh-57px)] flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-line bg-surface px-3 py-1.5 lg:hidden">
        <Segmented
          size="sm"
          label={t('Affichage', 'View')}
          value={mobilePane}
          onChange={setMobilePane}
          options={[
            { value: 'statement', label: t('Énoncé', 'Statement') },
            { value: 'code', label: t('Code', 'Code') },
          ]}
        />
        <ProblemNav prev={prev?.id} next={next?.id} />
      </div>
      {q.isError ? (
        <div className="p-6">
          <Notice
            tone="error"
            action={
              <Button variant="secondary" size="sm" onClick={() => q.refetch()}>
                {t('Recharger l’énoncé', 'Reload the statement')}
              </Button>
            }
          >
            {t('L’énoncé n’a pas pu être chargé. Vérifie ta connexion.', 'The statement could not be loaded. Check your connection.')}
          </Notice>
        </div>
      ) : !q.data ? (
        showSkeleton ? (
          <div className="grid flex-1 gap-6 p-6 lg:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-40" />
            </div>
            <Skeleton className="h-full min-h-60" />
          </div>
        ) : null
      ) : (
        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,44fr)_minmax(0,56fr)]">
          <div className={cx('min-h-0 border-line bg-bg lg:block lg:border-r', mobilePane === 'statement' ? 'block' : 'hidden')}>
            <StatementPanel
              key={`${id}-${openSolution ? solutionView!.n : 0}`}
              data={q.data}
              solved={solved}
              codeLang={codeLang}
              initialTab={openSolution ? 'solution' : 'statement'}
              index={idx}
              prev={prev?.id}
              next={next?.id}
            />
          </div>
          <div className={cx('min-h-0 bg-surface lg:block', mobilePane === 'code' ? 'block' : 'hidden')}>
            <Workspace
              data={q.data}
              onSolved={(pid) => {
                if (pid === idRef.current) setSolvedNow(true)
              }}
              onShowSolution={() => {
                setSolutionView((s) => ({ id, n: (s?.n ?? 0) + 1 }))
                setMobilePane('statement')
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function ProblemNav({ prev, next }: { prev?: string; next?: string }) {
  const { t, lang } = useI18n()
  const cls = 'inline-flex h-8 items-center gap-1 rounded-md px-2 text-sm text-ink-2 hover:bg-surface-2 hover:text-ink'
  return (
    <div className="flex items-center gap-1">
      {prev ? (
        <Link to={`/probleme/${prev}`} className={cls} title={problemTitle(lang, problemById(prev)!)}>
          <ArrowLeft className="size-4" aria-hidden />
          <span className="hidden sm:inline">{t('Précédent', 'Previous')}</span>
          <span className="sr-only sm:hidden">{t('Problème précédent', 'Previous problem')}</span>
        </Link>
      ) : null}
      {next ? (
        <Link to={`/probleme/${next}`} className={cls} title={problemTitle(lang, problemById(next)!)}>
          <span className="hidden sm:inline">{t('Suivant', 'Next')}</span>
          <span className="sr-only sm:hidden">{t('Problème suivant', 'Next problem')}</span>
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      ) : null}
    </div>
  )
}
