// Messages échangés entre la page et les workers du juge.

export type Lang = 'python' | 'cpp'

export type ToWorker =
  | { type: 'init'; base: string }
  | { type: 'run'; id: number; code: string; input: string }
  | { type: 'compile'; id: number; code: string }
  | { type: 'exec'; id: number; wasm: ArrayBuffer; programId: string; input: string }

export type FromWorker =
  | { type: 'progress'; loaded: number; total: number }
  | { type: 'ready' }
  | { type: 'fatal'; message: string }
  | { type: 'result'; id: number; ok: boolean; stdout: string; stderr: string; timeMs: number; crashed?: boolean }
  | { type: 'compiled'; id: number; wasm: ArrayBuffer; warnings: string }
  | { type: 'compile_error'; id: number; stderr: string }

/** Taille maximale de sortie conservée (au-delà, la sortie est tronquée et jugée fausse). */
export const OUTPUT_LIMIT = 2_000_000
