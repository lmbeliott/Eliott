// Proposer ou modifier un problème de la communauté (DESIGN.md §8, motif « formulaire »).
// La solution de référence de l'auteur calcule, dans son navigateur, la sortie de chaque test :
// les exemples gardent leur sortie en clair, les tests cachés n'en gardent que l'empreinte.
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Play, Plus, Trash2, Wand2 } from 'lucide-react'
import { Cell } from '../components/Cell'
import { CodeEditor } from '../components/CodeEditor'
import { TestStrip } from '../components/TestStrip'
import { Button, cx, Field, Input, LinkButton, PageHeader, Segmented, Skeleton, Spinner, useDelayed } from '../components/ui'
import { useToast } from '../components/Toast'
import { judge, limitFor, normalize, sha256Hex, type TestResult } from '../judge/judge'
import type { Lang } from '../judge/protocol'
import { useAuth } from '../lib/auth'
import { saveCommunityProblem, useCommunityProblem, useCommunityReference, useDeleteCommunityProblem, type CommunityRow, type CommunityReference } from '../lib/community'
import { DIFFICULTIES, DIFFICULTY_LABEL, type Difficulty } from '../lib/content'
import { useI18n } from '../lib/i18n'
import { renderMarkdown } from '../lib/markdown'
import { errorText } from '../lib/supabase'

const DRAFT_KEY = 'kodo:community-draft'
const MAX_SAMPLES = 5
const MIN_TESTS = 3
const MAX_TESTS = 50
const SAMPLE_BYTES = 4000
const TOTAL_BYTES = 2_000_000

interface Draft {
  id: string
  title: string
  statement: string
  input_spec: string
  output_spec: string
  constraints: string
  difficulty: Difficulty
  time_limit_ms: number
  sampleInputs: string[]
  testInputs: string[]
  refLang: Lang
  refCode: string
  generator: string
}

interface Verified {
  signature: string
  samples: { input: string; output: string }[]
  tests: { input: string; hash: string }[]
}

const REF_TEMPLATE: Record<Lang, string> = {
  python: '',
  cpp: `#include <iostream>
using namespace std;

int main() {

    return 0;
}
`,
}

const GENERATOR_TEMPLATE = `import random

n = int(input())  # numéro du test : 1, 2, 3…
random.seed(n)
taille = 10 * n
print(taille)
print(*[random.randint(1, 10**9) for _ in range(taille)])
`

const newDraft = (): Draft => ({
  id: crypto.randomUUID(),
  title: '',
  statement: '',
  input_spec: '',
  output_spec: '',
  constraints: '',
  difficulty: 'moyen',
  time_limit_ms: 1000,
  sampleInputs: [''],
  testInputs: ['', '', ''],
  refLang: 'python',
  refCode: '',
  generator: GENERATOR_TEMPLATE,
})

function readDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? ({ ...newDraft(), ...JSON.parse(raw) } as Draft) : null
  } catch {
    return null
  }
}
function writeDraft(d: Draft | null) {
  try {
    if (d) localStorage.setItem(DRAFT_KEY, JSON.stringify(d))
    else localStorage.removeItem(DRAFT_KEY)
  } catch {
    /* stockage plein ou indisponible : le brouillon n'est simplement pas gardé */
  }
}

const withNl = (s: string) => (s.endsWith('\n') ? s : `${s}\n`)
const bytes = (s: string) => new TextEncoder().encode(s).length
const signatureOf = (d: Draft) => JSON.stringify([d.sampleInputs.map(withNl), d.testInputs.map(withNl), d.refLang, d.refCode, d.time_limit_ms])
const sizeLabel = (n: number) => (n < 1000 ? `${n} o` : n < 1e6 ? `${(n / 1000).toFixed(1)} ko` : `${(n / 1e6).toFixed(2)} Mo`)
const preview = (s: string, max = 80) => {
  const one = s.trim().replace(/\s*\n\s*/g, ' ⏎ ')
  return one.length > max ? `${one.slice(0, max - 1)}…` : one || '∅'
}

function fromRow(r: CommunityRow, ref: CommunityReference | null): { draft: Draft; verified: Verified | null } {
  const draft: Draft = {
    id: r.id,
    title: r.title,
    statement: r.statement,
    input_spec: r.input_spec,
    output_spec: r.output_spec,
    constraints: r.constraints ?? '',
    difficulty: r.difficulty,
    time_limit_ms: r.time_limit_ms,
    sampleInputs: r.samples.map((s) => s.input),
    testInputs: r.tests.map((x) => x.input),
    refLang: ref?.language ?? 'python',
    refCode: ref?.code ?? '',
    generator: ref?.generator ?? GENERATOR_TEMPLATE,
  }
  // Rien n'a changé depuis la publication : les sorties enregistrées restent valables.
  return { draft, verified: ref ? { signature: signatureOf(draft), samples: r.samples, tests: r.tests } : null }
}

// ------------------------------------------------------------------ Petits éléments

function Section({ n, title, lead, children }: { n: number; title: string; lead?: ReactNode; children: ReactNode }) {
  return (
    <section aria-labelledby={`section-${n}`} className="border-t border-line pt-8 first:border-0 first:pt-0">
      <div className="mb-5 flex items-baseline gap-3">
        <span className="font-mono text-sm text-muted" aria-hidden>
          {String(n).padStart(2, '0')}
        </span>
        <div>
          <h2 id={`section-${n}`} className="text-lg font-semibold">
            {title}
          </h2>
          {lead && <p className="mt-1 max-w-[65ch] text-sm text-ink-2">{lead}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  )
}

const areaClass =
  'block w-full resize-y rounded-md bg-surface px-3 py-2 text-[0.9375rem] text-ink shadow-[inset_0_0_0_1px_var(--field-line)] placeholder:text-muted focus:outline-none focus:shadow-[inset_0_0_0_1px_var(--accent),0_0_0_3px_color-mix(in_oklab,var(--accent)_22%,transparent)]'

function InputList({
  idPrefix,
  label,
  items,
  min,
  max,
  onChange,
  addLabel,
  maxBytes,
}: {
  idPrefix: string
  label: (i: number) => string
  items: string[]
  min: number
  max: number
  onChange: (items: string[]) => void
  addLabel: string
  maxBytes?: number
}) {
  const { t } = useI18n()
  return (
    <div className="flex flex-col gap-2">
      <ol className="flex flex-col gap-2">
        {items.map((v, i) => {
          const size = bytes(v)
          const tooBig = maxBytes !== undefined && size > maxBytes
          return (
            <li key={i} className="grid grid-cols-[2.25rem_1fr_auto] items-start gap-2">
              <span className="pt-2 text-right font-mono text-xs text-muted">{i + 1}</span>
              <div>
                <label htmlFor={`${idPrefix}-${i}`} className="sr-only">
                  {label(i)}
                </label>
                <textarea
                  id={`${idPrefix}-${i}`}
                  value={v}
                  rows={Math.min(6, Math.max(2, v.split('\n').length))}
                  spellCheck={false}
                  onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
                  aria-invalid={tooBig || undefined}
                  className={cx(areaClass, 'font-mono text-sm', tooBig && 'shadow-[inset_0_0_0_1px_var(--bad)]')}
                />
                {size > 2000 && (
                  <p className={cx('mt-1 text-xs', tooBig ? 'text-bad' : 'text-muted')}>
                    {sizeLabel(size)}
                    {tooBig && t(` : un exemple est limité à ${sizeLabel(maxBytes!)}.`, ` : an example is limited to ${sizeLabel(maxBytes!)}.`)}
                  </p>
                )}
              </div>
              <button
                type="button"
                className="inline-flex size-9 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-40"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                disabled={items.length <= min}
                aria-label={`${t('Supprimer', 'Remove')} : ${label(i)}`}
                title={t('Supprimer', 'Remove')}
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </li>
          )
        })}
      </ol>
      <div className="pl-[2.75rem]">
        <Button type="button" variant="secondary" size="sm" disabled={items.length >= max} onClick={() => onChange([...items, ''])}>
          <Plus className="size-4" aria-hidden />
          {addLabel}
        </Button>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------ Page

export function CommunityEditor() {
  const { id: editId } = useParams()
  const { session, ready } = useAuth()
  const authLoading = !ready
  const { t } = useI18n()
  const row = useCommunityProblem(editId)
  const isAuthor = !!row.data && row.data.author_id === session?.user.id
  const ref = useCommunityReference(editId, isAuthor)
  const showSkeleton = useDelayed(authLoading || (!!editId && (row.isLoading || ref.isLoading)))

  if (authLoading || (editId && (row.isLoading || (isAuthor && ref.isLoading))))
    return showSkeleton ? (
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="mt-8 h-64" />
      </div>
    ) : null

  if (!session)
    return (
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-4 px-4 py-16 sm:px-6">
        <h1 className="display text-2xl">{t('Proposer un problème', 'Propose a problem')}</h1>
        <p className="max-w-[60ch] text-ink-2">{t('Il faut un compte pour proposer un problème : il est publié sous ton pseudo.', 'You need an account to propose a problem: it is published under your username.')}</p>
        <div className="flex gap-2">
          <LinkButton to={`/connexion?retour=${encodeURIComponent('/communaute/proposer')}`}>{t('Se connecter', 'Sign in')}</LinkButton>
          <LinkButton to={`/inscription?retour=${encodeURIComponent('/communaute/proposer')}`} variant="secondary">
            {t('Créer un compte', 'Create an account')}
          </LinkButton>
        </div>
      </div>
    )

  if (editId && (!row.data || !isAuthor))
    return (
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-4 px-4 py-16 sm:px-6">
        <h1 className="display text-2xl">{t('Modification impossible', 'Cannot edit')}</h1>
        <p className="text-ink-2">{t('Seul l’auteur d’un problème peut le modifier.', 'Only the author of a problem can edit it.')}</p>
        <LinkButton to="/communaute" variant="secondary">
          {t('Voir les problèmes de la communauté', 'See community problems')}
        </LinkButton>
      </div>
    )

  const initial = editId && row.data ? fromRow(row.data, ref.data ?? null) : { draft: readDraft() ?? newDraft(), verified: null }
  return <Editor key={editId ?? 'new'} isNew={!editId} initial={initial.draft} initialVerified={initial.verified} status={row.data?.status} />
}

function Editor({ isNew, initial, initialVerified, status }: { isNew: boolean; initial: Draft; initialVerified: Verified | null; status?: string }) {
  const { t, lang } = useI18n()
  const { session } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const qc = useQueryClient()
  const [d, setD] = useState<Draft>(initial)
  const [view, setView] = useState<'edit' | 'preview'>('edit')
  const [verified, setVerified] = useState<Verified | null>(initialVerified)
  const [run, setRun] = useState<{ results: TestResult[]; error?: string; compileError?: string; running: boolean } | null>(null)
  const [genCount, setGenCount] = useState(10)
  const [genState, setGenState] = useState<{ running: boolean; error?: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const abort = useRef<AbortController | null>(null)
  const del = useDeleteCommunityProblem(d.id)
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }))

  // Brouillon gardé sur l'appareil tant que le problème n'est pas publié.
  useEffect(() => {
    if (!isNew) return
    const h = setTimeout(() => writeDraft(d), 500)
    return () => clearTimeout(h)
  }, [d, isNew])
  useEffect(() => () => abort.current?.abort(), [])

  const signature = useMemo(() => signatureOf(d), [d])
  const upToDate = verified?.signature === signature
  const totalBytes = useMemo(() => d.sampleInputs.concat(d.testInputs).reduce((a, s) => a + bytes(s), 0) + (upToDate ? verified!.samples.reduce((a, s) => a + bytes(s.output), 0) : 0), [d, verified, upToDate])

  const checks: { label: string; ok: boolean }[] = [
    { label: t('Titre de 3 à 80 caractères', 'Title of 3 to 80 characters'), ok: d.title.trim().length >= 3 && d.title.trim().length <= 80 },
    { label: t('Énoncé d’au moins 20 caractères', 'Statement of at least 20 characters'), ok: d.statement.trim().length >= 20 && d.statement.length <= 20000 },
    { label: t('Entrée et sortie décrites', 'Input and output described'), ok: !!d.input_spec.trim() && !!d.output_spec.trim() },
    { label: t('1 à 5 exemples non vides', '1 to 5 non-empty examples'), ok: d.sampleInputs.length >= 1 && d.sampleInputs.length <= MAX_SAMPLES && d.sampleInputs.every((s) => s.trim() && bytes(s) <= SAMPLE_BYTES) },
    { label: t('3 à 50 tests cachés non vides', '3 to 50 non-empty hidden tests'), ok: d.testInputs.length >= MIN_TESTS && d.testInputs.length <= MAX_TESTS && d.testInputs.every((s) => s.trim()) },
    { label: t('Solution de référence écrite', 'Reference solution written'), ok: d.refCode.trim().length > 0 },
    { label: t('Sorties calculées pour cette version', 'Outputs computed for this version'), ok: upToDate },
  ]
  const ready = checks.every((c) => c.ok) && totalBytes <= TOTAL_BYTES

  // --- Calcul des sorties par la solution de référence
  const computeOutputs = async () => {
    abort.current?.abort()
    const ctl = new AbortController()
    abort.current = ctl
    const snapshot = d
    const sig = signatureOf(snapshot)
    const inputs = [...snapshot.sampleInputs, ...snapshot.testInputs].map(withNl)
    const nSamples = snapshot.sampleInputs.length
    setRun({ results: inputs.map((input, i) => ({ index: i, sample: i < nSamples, status: 'pending', timeMs: 0, stdout: '', stderr: '', input })), running: true })
    try {
      const report = await judge({
        lang: snapshot.refLang,
        code: snapshot.refCode,
        problemId: snapshot.id,
        tests: inputs.map((input, i) => ({ input, sample: i < nSamples })),
        timeLimitMs: snapshot.time_limit_ms,
        signal: ctl.signal,
        onEvent: (e) => {
          if (e.kind === 'test') setRun((r) => (r ? { ...r, results: r.results.map((x) => (x.index === e.result.index ? { ...e.result } : x)) } : r))
        },
      })
      if (ctl.signal.aborted) return
      if (report.compileError) {
        setRun({ results: report.results, compileError: report.compileError, running: false })
        return
      }
      const bad = report.results.find((r) => r.status !== 'ok')
      const empty = report.results.find((r) => r.status === 'ok' && !r.stdout.trim())
      const bigSample = report.results.find((r) => r.sample && bytes(r.stdout) > SAMPLE_BYTES)
      const error = bad
        ? bad.status === 'timeout'
          ? t(`Le test ${bad.index + 1} dépasse la limite de temps (${limitFor(snapshot.refLang, snapshot.time_limit_ms) / 1000} s). Allège le test ou augmente la limite.`, `Test ${bad.index + 1} exceeds the time limit (${limitFor(snapshot.refLang, snapshot.time_limit_ms) / 1000} s). Shrink the test or raise the limit.`)
          : t(`Ta solution s’arrête sur une erreur au test ${bad.index + 1}.`, `Your solution stops with an error on test ${bad.index + 1}.`)
        : empty
          ? t(`Ta solution n’affiche rien pour le test ${empty.index + 1}.`, `Your solution prints nothing for test ${empty.index + 1}.`)
          : bigSample
            ? t(`La sortie de l’exemple ${bigSample.index + 1} dépasse ${sizeLabel(SAMPLE_BYTES)}.`, `The output of example ${bigSample.index + 1} exceeds ${sizeLabel(SAMPLE_BYTES)}.`)
            : undefined
      setRun({ results: report.results, error, running: false })
      if (error) return
      const samples = report.results.slice(0, nSamples).map((r) => ({ input: r.input, output: r.stdout.replace(/\s+$/, '') + '\n' }))
      const tests = await Promise.all(report.results.slice(nSamples).map(async (r) => ({ input: r.input, hash: await sha256Hex(`${snapshot.id}:${r.index}:${normalize(r.stdout)}`) })))
      setVerified({ signature: sig, samples, tests })
    } catch (err) {
      if (!ctl.signal.aborted) setRun((r) => ({ results: r?.results ?? [], running: false, error: err instanceof Error ? err.message : String(err) }))
    }
  }

  // --- Générateur de tests (Python)
  const generate = async () => {
    const room = MAX_TESTS - d.testInputs.filter((s) => s.trim()).length
    const n = Math.max(1, Math.min(genCount, room))
    if (room <= 0) return
    setGenState({ running: true })
    try {
      const report = await judge({
        lang: 'python',
        code: d.generator,
        problemId: `${d.id}:gen`,
        tests: Array.from({ length: n }, (_, i) => ({ input: `${i + 1}\n`, sample: true })),
        timeLimitMs: 1000,
      })
      const bad = report.results.find((r) => r.status !== 'ok' || !r.stdout.trim())
      if (bad) {
        setGenState({ running: false, error: bad.status === 'ok' ? t(`Le générateur n’affiche rien pour le numéro ${bad.index + 1}.`, `The generator prints nothing for number ${bad.index + 1}.`) : `${t(`Erreur pour le numéro ${bad.index + 1}`, `Error for number ${bad.index + 1}`)} : ${bad.stderr.trim().split('\n').slice(-1)[0] ?? ''}` })
        return
      }
      setD((x) => ({ ...x, testInputs: [...x.testInputs.filter((s) => s.trim()), ...report.results.map((r) => r.stdout)].slice(0, MAX_TESTS) }))
      setGenState({ running: false })
      toast(t(`${n} tests ajoutés.`, `${n} tests added.`))
    } catch (err) {
      setGenState({ running: false, error: err instanceof Error ? err.message : String(err) })
    }
  }

  const publish = async () => {
    if (!ready || !verified || !session) return
    setSaving(true)
    setSaveError(null)
    try {
      await saveCommunityProblem(
        {
          id: d.id,
          title: d.title,
          statement: d.statement,
          input_spec: d.input_spec,
          output_spec: d.output_spec,
          constraints: d.constraints,
          difficulty: d.difficulty,
          time_limit_ms: d.time_limit_ms,
          samples: verified.samples,
          tests: verified.tests,
          reference: { language: d.refLang, code: d.refCode, generator: d.generator.trim() ? d.generator : null },
        },
        session.user.id,
        isNew,
      )
      if (isNew) writeDraft(null)
      await qc.invalidateQueries({ queryKey: ['community'] })
      toast(isNew ? t('Problème publié.', 'Problem published.') : t('Modifications enregistrées.', 'Changes saved.'))
      navigate(`/communaute/${d.id}`)
    } catch (err) {
      setSaveError(errorText(err, lang))
    } finally {
      setSaving(false)
    }
  }

  const remove = () => {
    if (!window.confirm(t(`Supprimer définitivement « ${d.title} » ? Ses réussites et ses votes seront perdus.`, `Delete “${d.title}” for good? Its solves and votes will be lost.`))) return
    del.mutate(undefined, {
      onSuccess: () => {
        toast(t('Problème supprimé.', 'Problem deleted.'))
        navigate('/communaute')
      },
      onError: (e) => toast(errorText(e, lang)),
    })
  }

  const runItems = run?.results ?? null
  const limits = `${limitFor('python', d.time_limit_ms) / 1000} s ${t('en Python', 'in Python')}, ${limitFor('cpp', d.time_limit_ms) / 1000} s ${t('en C++', 'in C++')}`

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
      <PageHeader
        meta={
          <Link to="/communaute" className="hover:text-ink">
            {t('Communauté', 'Community')}
          </Link>
        }
        title={isNew ? t('Proposer un problème', 'Propose a problem') : t('Modifier le problème', 'Edit the problem')}
        lead={t(
          'Écris l’énoncé et les entrées des tests. Ta solution calcule les sorties attendues dans ton navigateur ; elle reste privée.',
          'Write the statement and the test inputs. Your solution computes the expected outputs in your browser; it stays private.',
        )}
        actions={
          <Segmented<'edit' | 'preview'>
            label={t('Affichage', 'View')}
            value={view}
            onChange={setView}
            options={[
              { value: 'edit', label: t('Écrire', 'Write') },
              { value: 'preview', label: t('Aperçu', 'Preview') },
            ]}
          />
        }
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          {view === 'preview' ? (
            <article className="max-w-[70ch]">
              <h2 className="display text-2xl">{d.title || t('Sans titre', 'Untitled')}</h2>
              <div className="prose-kodo mt-4" dangerouslySetInnerHTML={{ __html: renderMarkdown(d.statement) }} />
              {(
                [
                  [t('Entrée', 'Input'), d.input_spec],
                  [t('Sortie', 'Output'), d.output_spec],
                  [t('Contraintes', 'Constraints'), d.constraints],
                ] as const
              ).map(([h, src]) =>
                src.trim() ? (
                  <section key={h} className="mt-8">
                    <h3 className="mb-2 text-sm font-semibold">{h}</h3>
                    <div className="prose-kodo" dangerouslySetInnerHTML={{ __html: renderMarkdown(src) }} />
                  </section>
                ) : null,
              )}
              <section className="mt-8">
                <h3 className="mb-2 text-sm font-semibold">{t('Exemples', 'Examples')}</h3>
                {d.sampleInputs.map((s, i) => (
                  <div key={i} className="mb-3 grid gap-2 sm:grid-cols-2">
                    <pre className="overflow-x-auto rounded-md bg-surface-2 p-3 font-mono text-sm">{s}</pre>
                    <pre className="overflow-x-auto rounded-md bg-surface-2 p-3 font-mono text-sm text-ink-2">{upToDate ? verified!.samples[i]?.output : t('(sortie calculée par ta solution)', '(output computed by your solution)')}</pre>
                  </div>
                ))}
              </section>
            </article>
          ) : (
            <div className="flex flex-col gap-10">
              <Section n={1} title={t('Énoncé', 'Statement')} lead={t('En Markdown : `code`, **gras**, listes, tableaux. Pas d’images ni de HTML.', 'In Markdown: `code`, **bold**, lists, tables. No images or HTML.')}>
                <Field label={t('Titre', 'Title')} htmlFor="c-title" hint={`${d.title.trim().length}/80`}>
                  <Input id="c-title" value={d.title} maxLength={80} onChange={(e) => set('title', e.target.value)} />
                </Field>
                <div className="flex flex-wrap gap-6">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium" id="c-diff">
                      {t('Difficulté', 'Difficulty')}
                    </span>
                    <Segmented<Difficulty> label={t('Difficulté', 'Difficulty')} value={d.difficulty} onChange={(v) => set('difficulty', v)} options={DIFFICULTIES.map((x) => ({ value: x, label: DIFFICULTY_LABEL[x][lang] }))} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium">{t('Limite de temps (C++)', 'Time limit (C++)')}</span>
                    <Segmented<string>
                      label={t('Limite de temps', 'Time limit')}
                      value={String(d.time_limit_ms)}
                      onChange={(v) => set('time_limit_ms', Number(v))}
                      options={['1000', '2000', '3000'].map((v) => ({ value: v, label: `${Number(v) / 1000} s` }))}
                    />
                    <span className="text-xs text-muted">{t(`Appliquée par test : ${limits}.`, `Applied per test: ${limits}.`)}</span>
                  </div>
                </div>
                <Field label={t('Énoncé', 'Statement')} htmlFor="c-statement">
                  <textarea id="c-statement" rows={10} value={d.statement} maxLength={20000} onChange={(e) => set('statement', e.target.value)} className={areaClass} />
                </Field>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label={t('Entrée', 'Input')} htmlFor="c-input" hint={t('Ce que le programme lit, ligne par ligne.', 'What the program reads, line by line.')}>
                    <textarea id="c-input" rows={4} value={d.input_spec} maxLength={4000} onChange={(e) => set('input_spec', e.target.value)} className={areaClass} />
                  </Field>
                  <Field label={t('Sortie', 'Output')} htmlFor="c-output" hint={t('Ce qu’il doit afficher, exactement.', 'What it must print, exactly.')}>
                    <textarea id="c-output" rows={4} value={d.output_spec} maxLength={4000} onChange={(e) => set('output_spec', e.target.value)} className={areaClass} />
                  </Field>
                </div>
                <Field label={t('Contraintes (facultatif)', 'Constraints (optional)')} htmlFor="c-constraints" hint={t('Bornes des valeurs : elles disent quelle complexité est attendue.', 'Value bounds: they tell which complexity is expected.')}>
                  <textarea id="c-constraints" rows={3} value={d.constraints} maxLength={3000} onChange={(e) => set('constraints', e.target.value)} className={areaClass} />
                </Field>
              </Section>

              <Section
                n={2}
                title={t('Solution de référence', 'Reference solution')}
                lead={t('Elle calcule la sortie attendue de chaque test. Seuls toi et les modérateurs peuvent la lire.', 'It computes the expected output of each test. Only you and the moderators can read it.')}
              >
                <div className="overflow-hidden rounded-lg border border-line bg-surface">
                  <div className="flex h-11 items-center justify-between border-b border-line bg-surface-2 pl-4 pr-1.5">
                    <span className="font-mono text-[0.8125rem]">{d.refLang === 'python' ? 'reference.py' : 'reference.cpp'}</span>
                    <Segmented<Lang>
                      size="sm"
                      label={t('Langage de la solution', 'Solution language')}
                      value={d.refLang}
                      onChange={(v) => setD((x) => ({ ...x, refLang: v, refCode: x.refCode.trim() && x.refCode !== REF_TEMPLATE[x.refLang] ? x.refCode : REF_TEMPLATE[v] }))}
                      options={[
                        { value: 'python', label: 'Python' },
                        { value: 'cpp', label: 'C++' },
                      ]}
                    />
                  </div>
                  <div className="h-80">
                    <CodeEditor value={d.refCode} onChange={(v) => set('refCode', v)} lang={d.refLang} label={t('Solution de référence', 'Reference solution')} placeholder={t('# Lis l’entrée, affiche la réponse', '# Read the input, print the answer')} />
                  </div>
                </div>
              </Section>

              <Section
                n={3}
                title={t('Tests', 'Tests')}
                lead={t(
                  'Les exemples apparaissent dans l’énoncé avec leur sortie. Les tests cachés vérifient les soumissions : mets des cas limites et de grandes entrées, pour qu’une solution trop lente échoue.',
                  'Examples appear in the statement with their output. Hidden tests check submissions: include edge cases and large inputs, so that a solution that is too slow fails.',
                )}
              >
                <div>
                  <h3 className="mb-2 text-sm font-medium">
                    {t('Exemples', 'Examples')} <span className="font-normal text-muted">{d.sampleInputs.length}/{MAX_SAMPLES}</span>
                  </h3>
                  <InputList
                    idPrefix="c-sample"
                    label={(i) => `${t('Entrée de l’exemple', 'Example input')} ${i + 1}`}
                    items={d.sampleInputs}
                    min={1}
                    max={MAX_SAMPLES}
                    maxBytes={SAMPLE_BYTES}
                    onChange={(v) => set('sampleInputs', v)}
                    addLabel={t('Ajouter un exemple', 'Add an example')}
                  />
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium">
                    {t('Tests cachés', 'Hidden tests')} <span className="font-normal text-muted">{d.testInputs.length}/{MAX_TESTS}</span>
                  </h3>
                  <InputList
                    idPrefix="c-test"
                    label={(i) => `${t('Entrée du test caché', 'Hidden test input')} ${i + 1}`}
                    items={d.testInputs}
                    min={MIN_TESTS}
                    max={MAX_TESTS}
                    onChange={(v) => set('testInputs', v)}
                    addLabel={t('Ajouter un test', 'Add a test')}
                  />
                </div>
                <details className="rounded-lg border border-line bg-surface">
                  <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium">
                    <Wand2 className="mr-2 inline size-4 align-[-3px] text-muted" aria-hidden />
                    {t('Générer des tests avec un programme Python', 'Generate tests with a Python program')}
                  </summary>
                  <div className="border-t border-line">
                    <p className="px-4 pt-3 text-sm text-ink-2">
                      {t(
                        'Le programme lit le numéro du test (1, 2, 3…) et affiche une entrée. Chaque sortie devient un test caché, remplaçant les tests vides.',
                        'The program reads the test number (1, 2, 3…) and prints an input. Each output becomes a hidden test, replacing empty ones.',
                      )}
                    </p>
                    <div className="mx-4 mt-3 h-56 overflow-hidden rounded-md border border-line">
                      <CodeEditor value={d.generator} onChange={(v) => set('generator', v)} lang="python" label={t('Générateur de tests', 'Test generator')} />
                    </div>
                    <div className="flex flex-wrap items-end gap-3 p-4">
                      <Field label={t('Nombre de tests', 'Number of tests')} htmlFor="c-gen-count">
                        <Input id="c-gen-count" type="number" min={1} max={MAX_TESTS} value={genCount} onChange={(e) => setGenCount(Math.max(1, Math.min(MAX_TESTS, Number(e.target.value) || 1)))} className="w-24" />
                      </Field>
                      <Button type="button" variant="secondary" onClick={generate} loading={genState?.running} disabled={genState?.running || !d.generator.trim()}>
                        {t('Générer', 'Generate')}
                      </Button>
                      {genState?.error && <p className="w-full text-sm text-bad">{genState.error}</p>}
                    </div>
                  </div>
                </details>
              </Section>

              <Section n={4} title={t('Calculer les sorties', 'Compute the outputs')} lead={t(`Ta solution s’exécute sur les ${d.sampleInputs.length + d.testInputs.length} entrées, avec les limites de temps des élèves.`, `Your solution runs on the ${d.sampleInputs.length + d.testInputs.length} inputs, with the students’ time limits.`)}>
                <div className="flex flex-wrap items-center gap-3">
                  <Button type="button" variant="secondary" onClick={computeOutputs} loading={run?.running} disabled={run?.running || !d.refCode.trim()}>
                    {!run?.running && <Play className="size-4" aria-hidden />}
                    {t('Calculer les sorties', 'Compute the outputs')}
                  </Button>
                  {upToDate && !run?.running && <span className="text-sm text-ok">{t('Sorties à jour pour cette version.', 'Outputs up to date for this version.')}</span>}
                  {verified && !upToDate && !run?.running && <span className="text-sm text-warn">{t('Tests ou solution modifiés : recalcule les sorties.', 'Tests or solution changed: compute the outputs again.')}</span>}
                </div>
                {runItems && (
                  <div aria-live="polite" className="flex flex-col gap-4">
                    <TestStrip results={runItems} size="md" />
                    {run?.compileError && <pre className="max-h-64 overflow-auto rounded-md bg-bad-soft p-3 font-mono text-xs">{run.compileError}</pre>}
                    {run?.error && <p className="text-sm text-bad">{run.error}</p>}
                    {!run?.running && !run?.compileError && (
                      <div className="overflow-x-auto rounded-lg border border-line bg-surface">
                        <table className="w-full text-sm">
                          <thead className="border-b border-line bg-surface-2 text-left text-xs text-muted">
                            <tr>
                              <th scope="col" className="py-2 pl-4 font-medium">#</th>
                              <th scope="col" className="py-2 pr-3 font-medium">{t('Entrée', 'Input')}</th>
                              <th scope="col" className="py-2 pr-3 font-medium">{t('Sortie', 'Output')}</th>
                              <th scope="col" className="py-2 pr-4 text-right font-medium">{t('Temps', 'Time')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {runItems.map((r) => (
                              <tr key={r.index} className="border-b border-line align-top last:border-0">
                                <td className="whitespace-nowrap py-2 pl-4 pr-3 text-muted">
                                  {r.index + 1}
                                  {r.sample && <span className="ml-1 text-xs">{t('ex.', 'ex.')}</span>}
                                </td>
                                <td className="max-w-[16rem] py-2 pr-3 font-mono text-xs text-ink-2">{preview(r.input)}</td>
                                <td className={cx('max-w-[16rem] py-2 pr-3 font-mono text-xs', r.status === 'ok' ? 'text-ink' : 'text-bad')}>
                                  {r.status === 'ok' ? preview(r.stdout) : r.status === 'skipped' ? t('non exécuté', 'not run') : r.stderr.trim().split('\n').slice(-1)[0] || r.status}
                                </td>
                                <td className="whitespace-nowrap py-2 pr-4 text-right tabular text-ink-2">{r.status === 'ok' || r.status === 'timeout' ? `${r.timeMs} ms` : ''}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </Section>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-lg border border-line bg-surface p-4">
            <h2 className="text-sm font-semibold">{t('Avant de publier', 'Before publishing')}</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {checks.map((c) => (
                <li key={c.label} className="flex items-start gap-2.5 text-sm">
                  <Cell state={c.ok ? 'done' : 'empty'} size="md" className="mt-[3px]" label={c.ok ? t('Fait', 'Done') : t('À faire', 'To do')} />
                  <span className={c.ok ? 'text-ink' : 'text-ink-2'}>{c.label}</span>
                </li>
              ))}
            </ul>
            <p className={cx('mt-3 text-xs', totalBytes > TOTAL_BYTES ? 'text-bad' : 'text-muted')}>
              {t('Taille des tests', 'Test size')} : {sizeLabel(totalBytes)} / {sizeLabel(TOTAL_BYTES)}
            </p>
            {saveError && <p className="mt-3 text-sm text-bad">{saveError}</p>}
            <Button className="mt-4 w-full" onClick={publish} disabled={!ready || saving} loading={saving}>
              {isNew ? t('Publier le problème', 'Publish the problem') : t('Enregistrer les modifications', 'Save changes')}
            </Button>
            <p className="mt-3 text-xs text-muted">
              {isNew
                ? t('Publié sous ton pseudo, sans points. Trois signalements le masquent jusqu’à l’avis d’un modérateur.', 'Published under your username, with no points. Three reports hide it until a moderator reviews it.')
                : status === 'hidden'
                  ? t('Masqué par la modération : tes modifications restent invisibles des autres.', 'Hidden by moderators: your changes stay invisible to others.')
                  : t('Les réussites déjà enregistrées sont gardées.', 'Solves already recorded are kept.')}
            </p>
          </div>
          {!isNew && (
            <div className="mt-4 rounded-lg border border-line p-4">
              <h2 className="text-sm font-semibold">{t('Supprimer', 'Delete')}</h2>
              <p className="mt-1 text-xs text-muted">{t('Supprime l’énoncé, les tests, les votes et les réussites.', 'Deletes the statement, tests, votes and solves.')}</p>
              <Button variant="danger" size="sm" className="mt-3" onClick={remove} loading={del.isPending}>
                <Trash2 className="size-4" aria-hidden />
                {t('Supprimer le problème', 'Delete the problem')}
              </Button>
            </div>
          )}
          {saving && <Spinner className="sr-only" label={t('Enregistrement…', 'Saving…')} />}
        </aside>
      </div>
    </div>
  )
}
