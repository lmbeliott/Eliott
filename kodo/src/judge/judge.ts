// Le juge : exécute le code de l'élève sur les tests, dans des workers, et rend un verdict.
// Python tourne dans Pyodide ; le C++ est compilé par Clang (WebAssembly) puis exécuté via WASI.
// Un test trop long est arrêté en tuant le worker, qui est relancé pour la suite.

import type { FromWorker, Lang, ToWorker } from './protocol'
import { OUTPUT_LIMIT } from './protocol'

export type { Lang }

export type TestStatus = 'pending' | 'running' | 'ok' | 'wrong' | 'timeout' | 'error' | 'skipped'
export type Verdict = 'accepted' | 'wrong_answer' | 'time_limit' | 'runtime_error' | 'compile_error'

export interface JudgeTest {
  input: string
  /** Sortie attendue en clair (exemples) */
  output?: string
  /** Empreinte de la sortie attendue (tests cachés) */
  hash?: string
  sample: boolean
}

export interface TestResult {
  index: number
  sample: boolean
  status: TestStatus
  timeMs: number
  stdout: string
  stderr: string
  input: string
  expected?: string
}

export interface JudgeReport {
  verdict: Verdict | null // null : exécution libre (sans sortie attendue)
  results: TestResult[]
  compileError?: string
  passed: number
  total: number
  maxTimeMs: number
}

export type JudgeEvent =
  | { kind: 'loading'; lang: Lang; loaded: number; total: number }
  | { kind: 'compiling' }
  | { kind: 'test'; result: TestResult; done: number; total: number }

export type RuntimeState = 'idle' | 'loading' | 'ready' | 'failed'

// ------------------------------------------------------------------ Comparaison

export const normalize = (s: string) => s.split(/\s+/).filter(Boolean).join(' ')

export async function sha256Hex(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function matches(problemId: string, index: number, test: JudgeTest, stdout: string) {
  if (stdout.length > OUTPUT_LIMIT) return false
  const got = normalize(stdout)
  if (test.output !== undefined) return got === normalize(test.output)
  if (test.hash) return (await sha256Hex(`${problemId}:${index}:${got}`)) === test.hash
  return true
}

// ------------------------------------------------------------------ Workers

const BASE = new URL(import.meta.env.BASE_URL, window.location.href).href

const makeWorker = {
  python: () => new Worker(new URL('./python.worker.ts', import.meta.url), { type: 'module', name: 'python' }),
  clang: () => new Worker(new URL('./clang.worker.ts', import.meta.url), { type: 'module', name: 'clang' }),
  wasm: () => new Worker(new URL('./wasm.worker.ts', import.meta.url), { type: 'module', name: 'wasm' }),
}

type Kind = keyof typeof makeWorker
type WithoutId<T> = T extends unknown ? Omit<T, 'id'> : never

class Runtime {
  private worker: Worker | null = null
  private ready: Promise<void> | null = null
  private nextId = 1
  private pending = new Map<number, (m: FromWorker) => void>()
  state: RuntimeState = 'idle'
  progress = { loaded: 0, total: 0 }
  private kind: Kind
  private listeners = new Set<() => void>()

  constructor(kind: Kind) {
    this.kind = kind
  }

  subscribe(fn: () => void) {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }
  private emit() {
    for (const fn of this.listeners) fn()
  }

  start(onProgress?: (loaded: number, total: number) => void): Promise<void> {
    if (this.ready) return this.ready
    this.state = 'loading'
    this.emit()
    const w = makeWorker[this.kind]()
    this.worker = w
    this.ready = new Promise<void>((resolve, reject) => {
      w.onmessage = (e: MessageEvent<FromWorker>) => {
        const m = e.data
        if (m.type === 'progress') {
          this.progress = { loaded: m.loaded, total: m.total }
          onProgress?.(m.loaded, m.total)
          this.emit()
        } else if (m.type === 'ready') {
          this.state = 'ready'
          this.emit()
          resolve()
        } else if (m.type === 'fatal') {
          this.state = 'failed'
          this.emit()
          this.kill()
          reject(new Error(m.message))
        } else if ('id' in m) {
          const cb = this.pending.get(m.id)
          this.pending.delete(m.id)
          cb?.(m)
        }
      }
      w.onerror = (e) => {
        this.state = 'failed'
        this.emit()
        this.kill()
        reject(new Error(e.message || 'Le worker du juge a planté'))
      }
    })
    w.postMessage({ type: 'init', base: BASE } satisfies ToWorker)
    return this.ready
  }

  kill() {
    this.worker?.terminate()
    this.worker = null
    this.ready = null
    for (const cb of this.pending.values()) cb({ type: 'fatal', message: 'arrêté' })
    this.pending.clear()
    if (this.state !== 'failed') this.state = 'idle'
    this.emit()
  }

  /** Envoie une requête ; rejette si `timeoutMs` est dépassé (le worker est alors tué). */
  async request(msg: WithoutId<Extract<ToWorker, { id: number }>>, timeoutMs: number, transfer: Transferable[] = []) {
    await this.start()
    const id = this.nextId++
    const w = this.worker!
    return new Promise<FromWorker | 'timeout'>((resolve) => {
      const timer = setTimeout(() => {
        this.pending.delete(id)
        this.kill()
        resolve('timeout')
      }, timeoutMs)
      this.pending.set(id, (m) => {
        clearTimeout(timer)
        resolve(m)
      })
      w.postMessage({ ...msg, id } as ToWorker, transfer)
    })
  }
}

const runtimes = {
  python: new Runtime('python'),
  clang: new Runtime('clang'),
  wasm: new Runtime('wasm'),
}

/** État de chargement d'un langage (pour l'interface). */
export function runtimeFor(lang: Lang) {
  return lang === 'python' ? runtimes.python : runtimes.clang
}

/** Précharge un langage en arrière-plan (sans attendre). */
export function warmUp(lang: Lang) {
  runtimeFor(lang)
    .start()
    .catch(() => {})
  if (lang === 'cpp') runtimes.wasm.start().catch(() => {})
}

// ------------------------------------------------------------------ Limites de temps

/** Limite par test (ms) : le Python du navigateur est bien plus lent que le C++. */
export function limitFor(lang: Lang, timeLimitMs: number) {
  return lang === 'python' ? Math.max(3000, timeLimitMs * 5) : Math.max(1500, timeLimitMs * 2)
}

// ------------------------------------------------------------------ Exécution

export interface RunOptions {
  lang: Lang
  code: string
  problemId: string
  tests: JudgeTest[]
  timeLimitMs: number
  onEvent?: (e: JudgeEvent) => void
  signal?: AbortSignal
}

let programCounter = 0

export async function judge(opts: RunOptions): Promise<JudgeReport> {
  const { lang, code, tests, problemId, onEvent, signal } = opts
  const limit = limitFor(lang, opts.timeLimitMs)
  const results: TestResult[] = tests.map((t, index) => ({
    index,
    sample: t.sample,
    status: 'pending',
    timeMs: 0,
    stdout: '',
    stderr: '',
    input: t.input,
    expected: t.output,
  }))
  const report = (verdict: Verdict | null, compileError?: string): JudgeReport => ({
    verdict,
    results,
    compileError,
    passed: results.filter((r) => r.status === 'ok').length,
    total: results.length,
    maxTimeMs: Math.max(0, ...results.map((r) => r.timeMs)),
  })

  const rt = runtimeFor(lang)
  // Interruption : on arrête le worker qui exécute ce programme, pour qu'il ne bloque
  // (ni ne fasse échouer) l'exécution suivante. Il sera relancé à la demande.
  signal?.addEventListener('abort', () => (lang === 'python' ? runtimes.python : runtimes.wasm).kill(), { once: true })
  await rt.start((loaded, total) => onEvent?.({ kind: 'loading', lang, loaded, total }))

  // --- compilation (C++)
  let wasm: ArrayBuffer | null = null
  const programId = `p${++programCounter}`
  if (lang === 'cpp') {
    onEvent?.({ kind: 'compiling' })
    const res = await runtimes.clang.request({ type: 'compile', code }, 60_000)
    if (res === 'timeout') return report('compile_error', 'La compilation a pris plus d’une minute et a été arrêtée.')
    if (res.type === 'compile_error') return report('compile_error', res.stderr)
    if (res.type !== 'compiled') return report('compile_error', 'Le compilateur a rencontré une erreur interne. Recharge la page puis réessaie.')
    wasm = res.wasm
    await runtimes.wasm.start()
  }

  // --- tests
  let stop = false
  for (const [i, test] of tests.entries()) {
    const r = results[i]
    if (stop || signal?.aborted) {
      r.status = 'skipped'
      onEvent?.({ kind: 'test', result: r, done: i + 1, total: tests.length })
      continue
    }
    r.status = 'running'
    const res =
      lang === 'python'
        ? await runtimes.python.request({ type: 'run', code, input: test.input }, limit + 1500)
        : await runtimes.wasm.request({ type: 'exec', wasm: wasm!.slice(0), programId, input: test.input }, limit + 1000)

    if (res === 'timeout') {
      r.status = 'timeout'
      r.timeMs = limit
      stop = true // chaque dépassement coûte du temps : on n'insiste pas
    } else if (res.type === 'result') {
      r.stdout = res.stdout.length > OUTPUT_LIMIT ? res.stdout.slice(0, OUTPUT_LIMIT) : res.stdout
      r.stderr = res.stderr
      r.timeMs = Math.round(res.timeMs)
      if (res.crashed) (lang === 'python' ? runtimes.python : runtimes.wasm).kill()
      if (!res.ok) r.status = 'error'
      else if (res.timeMs > limit) r.status = 'timeout'
      else if (test.output === undefined && !test.hash) r.status = 'ok'
      else r.status = (await matches(problemId, i, test, res.stdout)) ? 'ok' : 'wrong'
      if (r.status === 'timeout') stop = true
    } else {
      r.status = 'error'
      r.stderr = 'Le juge a été interrompu.'
    }
    onEvent?.({ kind: 'test', result: r, done: i + 1, total: tests.length })
  }

  const freeRun = tests.every((t) => t.output === undefined && !t.hash)
  if (freeRun) return report(null)
  // Le verdict est celui du premier test raté : c'est par lui que l'élève doit commencer.
  const firstBad = results.find((r) => r.status !== 'ok')
  const verdictOf: Record<TestStatus, Verdict> = {
    ok: 'accepted',
    wrong: 'wrong_answer',
    timeout: 'time_limit',
    error: 'runtime_error',
    skipped: 'time_limit',
    pending: 'runtime_error',
    running: 'runtime_error',
  }
  return report(firstBad ? verdictOf[firstBad.status] : 'accepted')
}
