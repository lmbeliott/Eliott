/// <reference lib="webworker" />
// Compile du C++ en WebAssembly avec Clang/LLD (eux-mêmes compilés en WebAssembly).
import { installVendorFetch } from './vendor-fetch'
import type { FromWorker, ToWorker } from './protocol'

declare const self: DedicatedWorkerGlobalScope
const post = (m: FromWorker, transfer: Transferable[] = []) => self.postMessage(m, transfer)

// La bibliothèque standard de Clang (libc++) n'a pas <bits/stdc++.h>, très utilisé en concours.
const STDCXX = [
  'algorithm', 'array', 'bitset', 'cassert', 'cctype', 'cfloat', 'climits', 'cmath', 'cstdint', 'cstdio',
  'cstdlib', 'cstring', 'deque', 'functional', 'iomanip', 'iostream', 'istream', 'iterator', 'limits',
  'list', 'map', 'memory', 'numeric', 'ostream', 'queue', 'random', 'set', 'sstream', 'stack', 'string',
  'string_view', 'tuple', 'unordered_map', 'unordered_set', 'utility', 'vector', 'chrono', 'complex',
  'optional', 'variant', 'valarray', 'bit', 'climits',
].map((h) => `#include <${h}>`).join('\n')

export const CPP_FLAGS = [
  '-O2',
  '-std=c++17',
  '-fno-exceptions',
  '-Iinc',
  // Pile de 32 Mo : la pile WebAssembly par défaut (64 ko) casse les DFS récursifs.
  '-Wl,-z,stack-size=33554432',
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let clang: any = null
const decoder = () => new TextDecoder('utf-8', { fatal: false })

self.onmessage = async (e: MessageEvent<ToWorker>) => {
  const msg = e.data
  if (msg.type === 'init') {
    try {
      await installVendorFetch(msg.base, 'clang', (loaded, total) => post({ type: 'progress', loaded, total }))
      clang = await import(/* @vite-ignore */ new URL('vendor/clang/bundle.js', msg.base).href)
      // Premier appel : télécharge et prépare le compilateur.
      await clang.runClang(['clang++', '--version'], {}, { stdout: () => {}, stderr: () => {} })
      post({ type: 'ready' })
    } catch (err) {
      post({ type: 'fatal', message: err instanceof Error ? err.message : String(err) })
    }
    return
  }
  if (msg.type === 'compile') {
    const dec = decoder()
    let stderr = ''
    try {
      const out = await clang.runClang(
        ['clang++', ...CPP_FLAGS, 'main.cpp', '-o', 'main.wasm'],
        { 'main.cpp': msg.code, inc: { bits: { 'stdc++.h': STDCXX } } },
        { stdout: () => {}, stderr: (b: Uint8Array | null) => { if (b) stderr += dec.decode(b, { stream: true }) } },
      )
      const bytes: Uint8Array = out['main.wasm']
      const wasm = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
      post({ type: 'compiled', id: msg.id, wasm, warnings: stderr }, [wasm])
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (err && typeof (err as any).code === 'number') post({ type: 'compile_error', id: msg.id, stderr: stderr || String(err) })
      else post({ type: 'fatal', message: err instanceof Error ? err.message : String(err) })
    }
  }
}
