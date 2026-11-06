import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, Check, ChevronRight, CircleAlert, Clock, Lightbulb, Lock, Play, RotateCcw, Send, TriangleAlert, X } from 'lucide-react'
import { CodeEditor } from '../components/CodeEditor'
import { Button, CopyButton, cx, DifficultyMark, LinkButton, Notice, Segmented, Skeleton, Spinner, useDelayed } from '../components/ui'
import { useToast } from '../components/Toast'
import { chapterById, chapterTitle, loadProblem, problemById, problemList, problemTitle, type ProblemData } from '../lib/content'
import { formatPoints, pick, plural, useI18n } from '../lib/i18n'
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

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
const MOD = isMac ? '⌘' : 'Ctrl'

function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="rounded border border-current/25 px-1 font-sans text-[0.7rem] leading-4 opacity-70">{children}</kbd>
}

// ------------------------------------------------------------------ Chargement de l'environnement

function useRuntimeState(lang: Lang) {
  const rt = runtimeFor(lang)
  const [, force] = useState(0)
  useEffect(() => rt.subscribe(() => force((n) => n + 1)) as () => void, [rt])
  return { state: rt.state, progress: rt.progress }
}

function RuntimeStatus({ lang }: { lang: Lang }) {
  const { t } = useI18n()
  const { state, progress } = useRuntimeState(lang)
  const name = lang === 'python' ? 'Python' : 'C++'
  if (state === 'ready') return <span className="text-xs text-muted">{t(`${name} prêt`, `${name} ready`)}</span>
  if (state === 'failed') return <span className="text-xs text-bad">{t(`${name} n’a pas pu se charger`, `${name} failed to load`)}</span>
  if (state === 'loading') {
    const pct = progress.total ? Math.round((progress.loaded / progress.total) * 100) : 0
    const mb = Math.round(progress.total / 1e6)
    return (
      <span className="flex items-center gap-2 text-xs text-muted" role="status">
        <span className="h-1 w-16 overflow-hidden rounded-full bg-surface-3">
          <span className="block h-full bg-ink-2 transition-[width]" style={{ width: `${pct}%` }} />
        </span>
        {t(`Préparation de ${name}${mb ? ` (${mb} Mo, une seule fois)` : ''}`, `Loading ${name}${mb ? ` (${mb} MB, once)` : ''}`)}
      </span>
    )
  }
  return null
}

// ------------------------------------------------------------------ Énoncé

type LeftTab = 'statement' | 'hints' | 'solution'

function Samples({ data }: { data: ProblemData }) {
  const { t } = useI18n()
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">{data.samples.length > 1 ? t('Exemples', 'Examples') : t('Exemple', 'Example')}</h2>
      <div className="mt-3 flex flex-col gap-4">
        {data.samples.map((s, i) => (
          <div key={i} className="grid gap-3 sm:grid-cols-2">
            {[
              { title: t('Entrée', 'Input'), text: s.input },
              { title: t('Sortie attendue', 'Expected output'), text: s.output },
            ].map((b) => (
              <div key={b.title} className="min-w-0 rounded-lg border border-line bg-code">
                <div className="flex items-center justify-between border-b border-line px-3 py-1">
                  <span className="text-xs font-medium text-muted">
                    {b.title}
                    {data.samples.length > 1 && ` ${i + 1}`}
                  </span>
                  <CopyButton text={b.text} label={`${t('Copier', 'Copy')} ${b.title.toLowerCase()}`} />
                </div>
                <pre className="overflow-x-auto px-3 py-2 text-sm leading-relaxed">{b.text.replace(/\n$/, '')}</pre>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function Hints({ hints }: { hints: string[] }) {
  const { t } = useI18n()
  const [shown, setShown] = useState(0)
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-2">
        {t(
          'Les indices vont du simple coup de pouce à l’idée presque complète. Ouvre-les un par un : chercher un peu avant d’ouvrir le suivant, c’est là qu’on apprend.',
          'Hints go from a small nudge to almost the whole idea. Open them one at a time: searching a bit before opening the next one is where the learning happens.',
        )}
      </p>
      <ol className="flex flex-col gap-3">
        {hints.slice(0, shown).map((h, i) => (
          <li key={i} className="anim-rise rounded-lg border border-line bg-surface p-4">
            <p className="mb-1 text-xs font-medium text-muted">{t(`Indice ${i + 1}`, `Hint ${i + 1}`)}</p>
            <div className="prose-kodo text-[0.95rem]" dangerouslySetInnerHTML={{ __html: h }} />
          </li>
        ))}
      </ol>
      {shown < hints.length && (
        <div>
          <Button variant="secondary" onClick={() => setShown((n) => n + 1)}>
            <Lightbulb className="size-4" aria-hidden />
            {t(`Afficher l’indice ${shown + 1} sur ${hints.length}`, `Show hint ${shown + 1} of ${hints.length}`)}
          </Button>
        </div>
      )}
    </div>
  )
}

function Solution({ data, solved, lang }: { data: ProblemData; solved: boolean; lang: Lang }) {
  const { lang: ui, t } = useI18n()
  const text = pick(ui, data.text.fr, data.text.en)
  if (!solved) {
    return (
      <div className="rounded-lg border border-line bg-surface-2 p-5">
        <Lock className="size-5 text-muted" aria-hidden />
        <p className="mt-2 font-medium">{t('La solution s’ouvre quand tu as réussi le problème.', 'The solution unlocks once you solve the problem.')}</p>
        <p className="mt-1 text-sm text-ink-2">
          {t('En attendant, les indices sont là pour te débloquer pas à pas.', 'Until then, the hints can get you unstuck step by step.')}
        </p>
      </div>
    )
  }
  const code = data.solutionCode[lang] ?? data.solutionCode.python
  return (
    <div className="flex flex-col gap-6">
      <div className="prose-kodo" dangerouslySetInnerHTML={{ __html: text.solution }} />
      {code && (
        <div className="rounded-lg border border-line bg-code">
          <div className="flex items-center justify-between border-b border-line px-3 py-1">
            <span className="text-xs font-medium text-muted">{t('Solution de référence', 'Reference solution')} ({lang === 'cpp' && data.solutionCode.cpp ? 'C++' : 'Python'})</span>
            <CopyButton text={code} label={t('Copier la solution', 'Copy the solution')} />
          </div>
          <pre className="overflow-x-auto px-4 py-3 text-sm leading-relaxed">{code}</pre>
        </div>
      )}
    </div>
  )
}

function StatementPanel({ data, solved, codeLang }: { data: ProblemData; solved: boolean; codeLang: Lang }) {
  const { lang, t } = useI18n()
  const [tab, setTab] = useState<LeftTab>('statement')
  const text = pick(lang, data.text.fr, data.text.en)
  const chapter = chapterById(data.chapter)
  const stats = useProblemStats()
  const solvers = stats.data?.get(data.id) ?? 0
  const scroller = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setTab('statement')
    scroller.current?.scrollTo({ top: 0 })
  }, [data.id])

  const tabs: { id: LeftTab; label: ReactNode }[] = [
    { id: 'statement', label: t('Énoncé', 'Statement') },
    { id: 'hints', label: `${t('Indices', 'Hints')} (${text.hints.length})` },
    {
      id: 'solution',
      label: (
        <span className="inline-flex items-center gap-1.5">
          {!solved && <Lock className="size-3.5" aria-hidden />}
          {t('Solution', 'Solution')}
        </span>
      ),
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-line px-5 pt-4 sm:px-6">
        {chapter && (
          <nav aria-label={t('Fil d’Ariane', 'Breadcrumb')} className="flex items-center gap-1 text-sm text-muted">
            <Link to="/parcours" className="hover:text-ink">
              {t('Parcours', 'Path')}
            </Link>
            <ChevronRight className="size-3.5" aria-hidden />
            <Link to={`/parcours/${chapter.id}`} className="truncate hover:text-ink">
              {chapterTitle(lang, chapter)}
            </Link>
          </nav>
        )}
        <h1 className="mt-1.5 text-xl font-semibold sm:text-2xl">{text.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-2">
          <DifficultyMark difficulty={data.difficulty} />
          <span className="tabular">+{formatPoints(lang, data.points)}</span>
          <span className="text-muted">
            {solvers > 0
              ? t(`Réussi par ${plural(lang, solvers, ['élève', 'élèves'], ['', ''])}`, `Solved by ${plural(lang, solvers, ['', ''], ['student', 'students'])}`)
              : t('Personne ne l’a encore réussi', 'Nobody has solved it yet')}
          </span>
          {solved && (
            <span className="inline-flex items-center gap-1 font-medium text-ok">
              <Check className="size-4" aria-hidden /> {t('Réussi', 'Solved')}
            </span>
          )}
        </div>
        <div role="tablist" aria-label={t('Contenu du problème', 'Problem content')} className="mt-3 flex gap-1">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              role="tab"
              type="button"
              aria-selected={tab === tb.id}
              onClick={() => setTab(tb.id)}
              className={cx(
                'relative px-3 pb-2.5 pt-1 text-sm font-medium transition-colors',
                tab === tb.id ? 'text-ink after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-ink' : 'text-muted hover:text-ink',
              )}
            >
              {tb.label}
            </button>
          ))}
        </div>
      </div>
      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6" role="tabpanel">
        {tab === 'statement' && (
          <article>
            <div className="prose-kodo" dangerouslySetInnerHTML={{ __html: text.statement }} />
            <h2 className="mt-8 text-lg font-semibold">{t('Entrée', 'Input')}</h2>
            <div className="prose-kodo mt-2" dangerouslySetInnerHTML={{ __html: text.input }} />
            <h2 className="mt-6 text-lg font-semibold">{t('Sortie', 'Output')}</h2>
            <div className="prose-kodo mt-2" dangerouslySetInnerHTML={{ __html: text.output }} />
            {text.constraints && (
              <>
                <h2 className="mt-6 text-lg font-semibold">{t('Contraintes', 'Constraints')}</h2>
                <div className="prose-kodo mt-2" dangerouslySetInnerHTML={{ __html: text.constraints }} />
              </>
            )}
            <Samples data={data} />
            {lang === 'en' && !data.text.en && (
              <p className="mt-8 text-sm text-muted">This problem has not been translated into English yet, so it is shown in French.</p>
            )}
          </article>
        )}
        {tab === 'hints' && <Hints key={data.id} hints={text.hints} />}
        {tab === 'solution' && <Solution data={data} solved={solved} lang={codeLang} />}
      </div>
    </div>
  )
}

// ------------------------------------------------------------------ Résultats

const statusStyle: Record<TestResult['status'], string> = {
  pending: 'border-line bg-surface text-muted',
  running: 'border-ink-2 bg-surface text-ink',
  ok: 'border-ok/40 bg-ok-soft text-ok',
  wrong: 'border-bad/40 bg-bad-soft text-bad',
  timeout: 'border-warn/40 bg-warn-soft text-warn',
  error: 'border-bad/40 bg-bad-soft text-bad',
  skipped: 'border-line bg-surface-2 text-muted',
}

function statusLabel(t: (fr: string, en: string) => string, s: TestResult['status']) {
  return {
    pending: t('en attente', 'pending'),
    running: t('en cours', 'running'),
    ok: t('réussi', 'passed'),
    wrong: t('mauvaise réponse', 'wrong answer'),
    timeout: t('temps dépassé', 'time limit exceeded'),
    error: t('erreur d’exécution', 'runtime error'),
    skipped: t('non exécuté', 'not run'),
  }[s]
}

function StatusIcon({ status }: { status: TestResult['status'] }) {
  if (status === 'ok') return <Check className="size-3.5" aria-hidden />
  if (status === 'wrong') return <X className="size-3.5" aria-hidden />
  if (status === 'timeout') return <Clock className="size-3.5" aria-hidden />
  if (status === 'error') return <TriangleAlert className="size-3.5" aria-hidden />
  if (status === 'running') return <span className="size-2 animate-pulse rounded-full bg-current" aria-hidden />
  return <span className="size-1.5 rounded-full bg-current" aria-hidden />
}

const clip = (s: string, n = 1200) => (s.length > n ? `${s.slice(0, n)}\n… (+${s.length - n})` : s)

function OutputBox({ title, text, tone }: { title: string; text: string; tone?: 'bad' }) {
  return (
    <div className="min-w-0 rounded-md border border-line bg-code">
      <p className={cx('border-b border-line px-3 py-1 text-xs font-medium', tone === 'bad' ? 'text-bad' : 'text-muted')}>{title}</p>
      <pre className="max-h-48 overflow-auto px-3 py-2 text-[0.8rem] leading-relaxed">{text === '' ? ' ' : clip(text)}</pre>
    </div>
  )
}

function TestDetail({ r, lang, limitMs }: { r: TestResult; lang: Lang; limitMs: number }) {
  const { t, lang: ui } = useI18n()
  const explanation = r.status === 'error' ? explainError(lang, r.stderr, ui) : null
  return (
    <div className="flex flex-col gap-3">
      {r.status === 'timeout' && (
        <p className="text-sm text-ink-2">
          {t(
            `Ton programme a dépassé ${(limitMs / 1000).toLocaleString('fr-FR')} s sur ce test. Boucle infinie, ou algorithme trop lent pour cette taille d’entrée ?`,
            `Your program took more than ${limitMs / 1000} s on this test. An infinite loop, or an algorithm too slow for this input size?`,
          )}
        </p>
      )}
      {r.status === 'wrong' && !r.sample && (
        <p className="text-sm text-ink-2">
          {t(
            'C’est un test caché : la sortie attendue n’est pas affichée. Relis l’énoncé et cherche le cas particulier que ce test pourrait viser.',
            'This is a hidden test, so the expected output is not shown. Re-read the statement and look for the special case this test might target.',
          )}
        </p>
      )}
      {explanation && (
        <p className="flex gap-2 rounded-md border border-warn/40 bg-warn-soft px-3 py-2 text-sm">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-warn" aria-hidden />
          <span>{explanation}</span>
        </p>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        <OutputBox title={t('Entrée du test', 'Test input')} text={r.input.replace(/\n$/, '')} />
        {r.expected !== undefined && <OutputBox title={t('Sortie attendue', 'Expected output')} text={r.expected.replace(/\n$/, '')} />}
        <OutputBox title={t('Ta sortie', 'Your output')} text={r.stdout.replace(/\n$/, '')} tone={r.status === 'wrong' ? 'bad' : undefined} />
        {r.stderr && <OutputBox title={t('Message d’erreur', 'Error message')} text={r.stderr} tone="bad" />}
      </div>
    </div>
  )
}

type Mode = 'run' | 'submit' | 'custom'

interface Outcome {
  mode: Mode
  report: JudgeReport | null
  phase: 'loading' | 'compiling' | 'testing' | 'done' | 'failed'
  recorded?: SubmitResult | null
  recordError?: string
  failure?: string
}

function Verdict({ o, lang, limitMs, next, onShowSolution }: { o: Outcome; lang: Lang; limitMs: number; next: string | null; onShowSolution: () => void }) {
  const { t, lang: ui } = useI18n()
  const { session } = useAuth()
  const r = o.report
  const [open, setOpen] = useState<number | null>(null)
  const firstBad = r?.results.find((x) => x.status !== 'ok' && x.status !== 'pending' && x.status !== 'running')
  useEffect(() => {
    if (o.phase === 'done') setOpen(firstBad && firstBad.status !== 'skipped' ? firstBad.index : o.mode === 'custom' ? 0 : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [o.phase])

  if (o.phase === 'failed')
    return (
      <Notice tone="error">
        {o.failure ?? t('Le juge n’a pas pu démarrer.', 'The judge could not start.')}{' '}
        {t('Recharge la page puis réessaie ; si ça persiste, essaie un autre navigateur.', 'Reload the page and try again; if it persists, try another browser.')}
      </Notice>
    )
  if (!r) return <Spinner label={o.phase === 'compiling' ? t('Compilation…', 'Compiling…') : t('Préparation…', 'Preparing…')} />

  if (r.compileError !== undefined) {
    const explanation = explainError('cpp', r.compileError, ui)
    return (
      <div className="flex flex-col gap-3">
        <p className="flex items-center gap-2 font-semibold text-bad" aria-live="polite">
          <CircleAlert className="size-5" aria-hidden /> {t('Erreur de compilation', 'Compilation error')}
        </p>
        {explanation && (
          <p className="flex gap-2 rounded-md border border-warn/40 bg-warn-soft px-3 py-2 text-sm">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-warn" aria-hidden />
            {explanation}
          </p>
        )}
        <pre className="max-h-64 overflow-auto rounded-md border border-line bg-code px-3 py-2 text-[0.8rem] leading-relaxed">{trimCompilerOutput(r.compileError)}</pre>
      </div>
    )
  }

  const done = o.phase === 'done'
  const accepted = done && r.verdict === 'accepted'
  const title = !done
    ? t(`Test ${r.results.filter((x) => x.status !== 'pending' && x.status !== 'running').length + 1} sur ${r.total}…`, `Test ${r.results.filter((x) => x.status !== 'pending' && x.status !== 'running').length + 1} of ${r.total}…`)
    : o.mode === 'custom'
      ? t('Résultat de ton entrée', 'Result for your input')
      : accepted
        ? o.mode === 'submit'
          ? t('Problème réussi', 'Problem solved')
          : t('Les exemples passent', 'The examples pass')
        : firstBad
          ? `${statusLabel(t, firstBad.status).replace(/^./, (c) => c.toUpperCase())} ${t('au test', 'on test')} ${firstBad.index + 1}`
          : ''

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className={cx('flex items-center gap-2 text-base font-semibold', accepted ? 'text-ok' : done && o.mode !== 'custom' ? 'text-bad' : 'text-ink')} aria-live="polite">
          {accepted && <Check className="size-5" aria-hidden />}
          {title}
        </p>
        {done && o.mode !== 'custom' && (
          <p className="text-sm text-muted tabular">
            {t(`${r.passed}/${r.total} tests réussis, ${r.maxTimeMs} ms au plus`, `${r.passed}/${r.total} tests passed, ${r.maxTimeMs} ms max`)}
          </p>
        )}
      </div>

      {accepted && o.mode === 'submit' && (
        <div className="anim-rise flex flex-col gap-3 rounded-lg border border-ok/40 bg-ok-soft p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {o.recorded?.new_solve ? (
              <>
                <p className="display text-2xl font-semibold tabular">+{formatPoints(ui, o.recorded.xp_gain)}</p>
                <p className="text-sm text-ink-2">
                  {[
                    o.recorded.first_try && t('bonus premier essai', 'first-try bonus'),
                    o.recorded.daily && t('bonus défi du jour', 'daily challenge bonus'),
                    t(`série de ${o.recorded.streak} jour${o.recorded.streak > 1 ? 's' : ''}`, `${o.recorded.streak}-day streak`),
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </>
            ) : o.recorded ? (
              <p className="text-sm">{t('Déjà réussi : ta nouvelle version est enregistrée.', 'Already solved: your new version is saved.')}</p>
            ) : !session ? (
              <p className="text-sm">
                {t('Réussite enregistrée sur cet appareil. ', 'Saved on this device. ')}
                <Link to="/inscription" className="font-medium underline underline-offset-2">
                  {t('Crée un compte', 'Create an account')}
                </Link>{' '}
                {t('pour gagner des points et apparaître au classement.', 'to earn points and show up on the leaderboard.')}
              </p>
            ) : o.recordError ? (
              <p className="text-sm text-bad">{o.recordError}</p>
            ) : (
              <Spinner label={t('Enregistrement…', 'Saving…')} />
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={onShowSolution}>
              {t('Voir la solution', 'See the solution')}
            </Button>
            {next && (
              <LinkButton to={`/probleme/${next}`} size="sm">
                {t('Problème suivant', 'Next problem')}
                <ArrowRight className="size-4" aria-hidden />
              </LinkButton>
            )}
          </div>
        </div>
      )}

      {accepted && o.mode === 'run' && (
        <p className="text-sm text-ink-2">
          {t('Soumets maintenant ton code : il sera vérifié sur les tests cachés.', 'Now submit your code: it will be checked against the hidden tests.')}
        </p>
      )}

      {o.mode !== 'custom' && (
        <ul className="flex flex-wrap gap-1.5" aria-label={t('Tests', 'Tests')}>
          {r.results.map((x) => (
            <li key={x.index}>
              <button
                type="button"
                onClick={() => setOpen(open === x.index ? null : x.index)}
                disabled={x.status === 'pending' || x.status === 'running' || x.status === 'skipped'}
                aria-pressed={open === x.index}
                aria-label={`${t('Test', 'Test')} ${x.index + 1}${x.sample ? ` (${t('exemple', 'example')})` : ''} : ${statusLabel(t, x.status)}`}
                className={cx(
                  'flex h-8 min-w-11 items-center justify-center gap-1 rounded-md border px-2 text-xs font-medium tabular transition-shadow',
                  statusStyle[x.status],
                  open === x.index && 'ring-2 ring-focus ring-offset-1 ring-offset-surface',
                )}
              >
                <StatusIcon status={x.status} />
                {x.index + 1}
              </button>
            </li>
          ))}
        </ul>
      )}
      {open !== null && r.results[open] && done && <TestDetail r={r.results[open]} lang={lang} limitMs={limitMs} />}
    </div>
  )
}

// ------------------------------------------------------------------ Espace de travail

function defaultCode(data: ProblemData, lang: Lang, ui: 'fr' | 'en') {
  const starter = data.starter[ui]?.[lang] ?? data.starter.fr[lang]
  if (starter) return starter
  return lang === 'cpp' ? CPP_TEMPLATE : ''
}

function Workspace({ data, onSolved, onShowSolution }: { data: ProblemData; onSolved: () => void; onShowSolution: () => void }) {
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
  const next = useMemo(() => {
    const i = problemList.findIndex((p) => p.id === data.id)
    return problemList[i + 1]?.id ?? null
  }, [data.id])

  // Nouveau problème ou nouveau langage : on recharge le brouillon.
  useEffect(() => {
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
      abort.current = new AbortController()
      const tests: JudgeTest[] =
        mode === 'custom'
          ? [{ input: customInput.endsWith('\n') ? customInput : customInput + '\n', sample: true }]
          : mode === 'run'
            ? data.samples.map((s) => ({ input: s.input, output: s.output, sample: true }))
            : [...data.samples.map((s) => ({ input: s.input, output: s.output, sample: true })), ...data.tests.map((x) => ({ input: x.input, hash: x.hash, sample: false }))]
      let report: JudgeReport | null = null
      setOutcome({ mode, report: null, phase: 'loading' })
      try {
        report = await judge({
          lang,
          code,
          problemId: data.id,
          tests,
          timeLimitMs: data.timeLimitMs,
          signal: abort.current.signal,
          onEvent: (e) => {
            if (e.kind === 'compiling') setOutcome({ mode, report: null, phase: 'compiling' })
            if (e.kind === 'test')
              setOutcome((o) => {
                const results: TestResult[] = o?.report?.results.slice() ?? tests.map((x, i) => ({ index: i, sample: x.sample, status: 'pending', timeMs: 0, stdout: '', stderr: '', input: x.input, expected: x.output }))
                results[e.result.index] = { ...e.result }
                if (e.result.index + 1 < results.length && results[e.result.index + 1].status === 'pending') results[e.result.index + 1] = { ...results[e.result.index + 1], status: 'running' }
                return { mode, phase: 'testing', report: { verdict: null, results, passed: results.filter((r) => r.status === 'ok').length, total: results.length, maxTimeMs: 0 } }
              })
          },
        })
        setOutcome({ mode, report, phase: 'done' })
      } catch (err) {
        setOutcome({ mode, report: null, phase: 'failed', failure: err instanceof Error ? err.message : String(err) })
        setBusy(false)
        return
      }
      setBusy(false)
      if (mode !== 'submit' || !report.verdict) return
      try {
        const res = await record({ problemId: data.id, lang, code, verdict: report.verdict, passed: report.passed, total: report.total, timeMs: report.maxTimeMs })
        setOutcome({ mode, report, phase: 'done', recorded: res })
        if (report.verdict === 'accepted') onSolved()
      } catch (err) {
        setOutcome({ mode, report, phase: 'done', recordError: errorText(err, ui) })
      }
    },
    [busy, code, customInput, data, lang, record, toast, t, ui, onSolved],
  )

  const reset = () => {
    if (window.confirm(t('Remplacer ton code par le code de départ ? Ton brouillon sera perdu.', 'Replace your code with the starting code? Your draft will be lost.'))) {
      setCode(defaultCode(data, lang, ui))
    }
  }

  const limitMs = limitFor(lang, data.timeLimitMs)
  const showSkeleton = useDelayed(busy && !outcome?.report, 300)

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-3 py-2">
        <div className="flex items-center gap-3">
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
          <RuntimeStatus lang={lang} />
        </div>
        <Button variant="ghost" size="sm" onClick={reset} title={t('Revenir au code de départ', 'Back to the starting code')}>
          <RotateCcw className="size-3.5" aria-hidden /> {t('Réinitialiser', 'Reset')}
        </Button>
      </div>
      <div className="min-h-[240px] flex-1">
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
        <div className="border-t border-line px-3 py-2">
          <label htmlFor="custom-input" className="text-xs font-medium text-muted">
            {t('Ton entrée de test', 'Your test input')}
          </label>
          <textarea
            id="custom-input"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            rows={3}
            spellCheck={false}
            className="mt-1 w-full resize-y rounded-md border border-field bg-code px-3 py-2 font-mono text-sm focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/25"
          />
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-surface px-3 py-2">
        <label className="flex items-center gap-2 text-sm text-ink-2">
          <input type="checkbox" checked={showCustom} onChange={(e) => setShowCustom(e.target.checked)} className="size-4 accent-[var(--ink)]" />
          {t('Tester avec ma propre entrée', 'Test with my own input')}
        </label>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => run(showCustom ? 'custom' : 'run')} loading={busy && outcome?.mode !== 'submit'} disabled={busy}>
            {!(busy && outcome?.mode !== 'submit') && <Play className="size-4" aria-hidden />}
            {showCustom ? t('Exécuter', 'Run') : t('Tester les exemples', 'Run examples')}
            <span className="hidden xl:inline">
              <Kbd>{MOD}</Kbd> <Kbd>↵</Kbd>
            </span>
          </Button>
          <Button onClick={() => run('submit')} loading={busy && outcome?.mode === 'submit'} disabled={busy}>
            {!(busy && outcome?.mode === 'submit') && <Send className="size-4" aria-hidden />}
            {t('Soumettre', 'Submit')}
            <span className="hidden xl:inline">
              <Kbd>{MOD}</Kbd> <Kbd>⇧</Kbd> <Kbd>↵</Kbd>
            </span>
          </Button>
        </div>
      </div>
      <section aria-label={t('Résultats', 'Results')} className="max-h-[45%] min-h-[96px] overflow-y-auto border-t border-line bg-surface px-4 py-4">
        {outcome ? (
          <Verdict o={outcome} lang={lang} limitMs={limitMs} next={next} onShowSolution={onShowSolution} />
        ) : showSkeleton ? (
          <Skeleton className="h-16" />
        ) : (
          <p className="text-sm text-muted">
            {t(
              `Teste ton code sur les exemples, puis soumets-le : il sera vérifié sur ${plural(ui, data.samples.length + data.tests.length, ['test', 'tests'], ['', ''])}.`,
              `Run your code on the examples, then submit it: it will be checked against ${data.samples.length + data.tests.length} tests.`,
            )}
          </p>
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
  const [solutionKey, setSolutionKey] = useState(0)
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
      if (e.key === 'ArrowLeft' && prev) navigate(`/probleme/${prev.id}`)
      if (e.key === 'ArrowRight' && next) navigate(`/probleme/${next.id}`)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next, navigate])

  if (!meta) return <NotFound />
  const solved = solvedNow || progress.solved.has(id)

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
          <Notice tone="error" action={<Button variant="secondary" size="sm" onClick={() => q.refetch()}>{t('Réessayer', 'Try again')}</Button>}>
            {t('L’énoncé n’a pas pu être chargé. Vérifie ta connexion.', 'The statement could not be loaded. Check your connection.')}
          </Notice>
        </div>
      ) : !q.data ? (
        showSkeleton ? (
          <div className="grid flex-1 gap-6 p-6 lg:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-40" />
            </div>
            <Skeleton className="h-full min-h-60" />
          </div>
        ) : null
      ) : (
        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,44fr)_minmax(0,56fr)]">
          <div className={cx('min-h-0 border-line bg-bg lg:block lg:border-r', mobilePane === 'statement' ? 'block' : 'hidden')}>
            <StatementPanel key={`${id}-${solutionKey}`} data={q.data} solved={solved} codeLang={codeLang} />
          </div>
          <div className={cx('min-h-0 bg-surface lg:block', mobilePane === 'code' ? 'block' : 'hidden')}>
            <Workspace
              data={q.data}
              onSolved={() => setSolvedNow(true)}
              onShowSolution={() => {
                setSolutionKey((k) => k + 1)
                setMobilePane('statement')
                setTimeout(() => document.querySelector<HTMLButtonElement>('[role=tab]:nth-child(3)')?.click(), 0)
              }}
            />
          </div>
        </div>
      )}
      <div className="hidden items-center justify-between border-t border-line bg-surface px-4 py-1.5 lg:flex">
        <p className="text-xs text-muted">
          {t('Problème', 'Problem')} {idx + 1} / {problemList.length}<span className="ml-4">{t('Alt + flèches pour naviguer', 'Alt + arrow keys to navigate')}</span>
        </p>
        <ProblemNav prev={prev?.id} next={next?.id} />
      </div>
    </div>
  )
}

function ProblemNav({ prev, next }: { prev?: string; next?: string }) {
  const { t, lang } = useI18n()
  return (
    <div className="flex items-center gap-1">
      {prev ? (
        <Link to={`/probleme/${prev}`} className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-sm text-ink-2 hover:bg-surface-2 hover:text-ink" title={problemTitle(lang, problemById(prev)!)}>
          <ArrowLeft className="size-4" aria-hidden />
          <span className="hidden sm:inline">{t('Précédent', 'Previous')}</span>
        </Link>
      ) : null}
      {next ? (
        <Link to={`/probleme/${next}`} className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-sm text-ink-2 hover:bg-surface-2 hover:text-ink" title={problemTitle(lang, problemById(next)!)}>
          <span className="hidden sm:inline">{t('Suivant', 'Next')}</span>
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      ) : null}
    </div>
  )
}
