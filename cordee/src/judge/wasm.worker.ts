/// <reference lib="webworker" />
// Exécute un programme C++ compilé (WebAssembly + WASI) sur une entrée.
import { WASI, File, OpenFile, ConsoleStdout } from '@bjorn3/browser_wasi_shim'
import { OUTPUT_LIMIT, type FromWorker, type ToWorker } from './protocol'

declare const self: DedicatedWorkerGlobalScope
const post = (m: FromWorker) => self.postMessage(m)

let cached: { id: string; module: WebAssembly.Module } | null = null

function collector() {
  const parts: Uint8Array[] = []
  let size = 0
  return {
    write(b: Uint8Array) {
      if (size >= OUTPUT_LIMIT) return
      parts.push(b)
      size += b.byteLength
    },
    text() {
      const all = new Uint8Array(size)
      let o = 0
      for (const p of parts) {
        all.set(p, o)
        o += p.byteLength
      }
      return new TextDecoder('utf-8', { fatal: false }).decode(all)
    },
  }
}

self.onmessage = async (e: MessageEvent<ToWorker>) => {
  const msg = e.data
  if (msg.type === 'init') {
    post({ type: 'ready' })
    return
  }
  if (msg.type !== 'exec') return
  const t0 = performance.now()
  const out = collector()
  const err = collector()
  try {
    if (!cached || cached.id !== msg.programId) cached = { id: msg.programId, module: await WebAssembly.compile(msg.wasm) }
    const fds = [
      new OpenFile(new File(new TextEncoder().encode(msg.input))),
      new ConsoleStdout((b) => out.write(b)),
      new ConsoleStdout((b) => err.write(b)),
    ]
    const wasi = new WASI(['main'], [], fds)
    const instance = (await WebAssembly.instantiate(cached.module, { wasi_snapshot_preview1: wasi.wasiImport })) as WebAssembly.Instance
    const start = performance.now()
    let code = 0
    let trap = ''
    try {
      code = wasi.start(instance as { exports: { memory: WebAssembly.Memory; _start: () => unknown } })
    } catch (x) {
      trap = x instanceof Error ? `${x.name}: ${x.message}` : String(x)
    }
    const stderr = err.text() + (trap ? `\n${trap}` : '') + (code !== 0 ? `\nLe programme s'est arrêté avec le code ${code}.` : '')
    post({ type: 'result', id: msg.id, ok: code === 0 && !trap, stdout: out.text(), stderr: stderr.trim(), timeMs: performance.now() - start })
  } catch (x) {
    post({ type: 'result', id: msg.id, ok: false, stdout: out.text(), stderr: x instanceof Error ? x.message : String(x), timeMs: performance.now() - t0, crashed: true })
  }
}
