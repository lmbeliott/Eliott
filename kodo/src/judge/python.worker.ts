/// <reference lib="webworker" />
// Exécute du Python avec Pyodide (CPython compilé en WebAssembly).
import { installVendorFetch } from './vendor-fetch'
import type { FromWorker, ToWorker } from './protocol'

declare const self: DedicatedWorkerGlobalScope
const post = (m: FromWorker) => self.postMessage(m)

// Chaque exécution part d'un espace de noms neuf. input() n'affiche pas son invite
// (les débutants écrivent souvent input("Nombre ? "), ce qui fausserait la sortie).
const PRELUDE = String.raw`
import sys, io, builtins, traceback, linecache
_default_limit = sys.getrecursionlimit()
_real_input = builtins.input

class _Capped(io.BytesIO):
    # Au-delà de la limite, l'écriture échoue : une boucle d'affichage infinie s'arrête net.
    def write(self, b):
        if self.tell() + len(b) > 2_000_000:
            raise OSError("Sortie trop longue : plus de 2 Mo affichés (boucle infinie ?)")
        return super().write(b)

def __kodo_run(code, data):
    out_bytes, err_bytes = _Capped(), io.BytesIO()
    stdout = io.TextIOWrapper(out_bytes, encoding="utf-8", write_through=True)
    stderr = io.TextIOWrapper(err_bytes, encoding="utf-8", write_through=True)
    stdin = io.TextIOWrapper(io.BytesIO(data.encode("utf-8")), encoding="utf-8")
    def _input(prompt=""):
        line = sys.stdin.readline()
        if not line:
            raise EOFError("EOF when reading a line")
        return line[:-1] if line.endswith("\n") else line
    linecache.cache["solution.py"] = (len(code), None, code.splitlines(True), "solution.py")
    sys.stdin, sys.stdout, sys.stderr = stdin, stdout, stderr
    builtins.input = _input
    sys.setrecursionlimit(_default_limit)
    ok = True
    try:
        exec(compile(code, "solution.py", "exec"), {"__name__": "__main__", "__builtins__": builtins})
    except SystemExit as e:
        if e.code not in (None, 0):
            ok = False
            stderr.write(f"SystemExit: {e.code}\n")
    except BaseException as e:
        ok = False
        tb = [f for f in traceback.extract_tb(e.__traceback__) if f.filename == "solution.py"]
        if tb:
            stderr.write("Traceback (most recent call last):\n" + "".join(traceback.format_list(tb)))
        stderr.write("".join(traceback.format_exception_only(type(e), e)))
    finally:
        try:
            stdout.flush()
            stderr.flush()
        except Exception:
            pass
        sys.stdin, sys.stdout, sys.stderr = sys.__stdin__, sys.__stdout__, sys.__stderr__
        builtins.input = _real_input
    return ok, out_bytes.getvalue().decode("utf-8", "replace"), err_bytes.getvalue().decode("utf-8", "replace")
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let runner: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pyodide: any = null

// Entrée du test en cours, servie aussi au descripteur 0 : open(0) et os.read(0, n)
// lisent les mêmes données que sys.stdin, puis la fin de fichier. Le descripteur est rouvert
// à chaque exécution : open(0) le ferme en fin de lecture.
let stdinBytes = new Uint8Array(0)
let stdinPos = 0
const readStdin = (buf: Uint8Array) => {
  const n = Math.min(buf.length, stdinBytes.length - stdinPos)
  buf.set(stdinBytes.subarray(stdinPos, stdinPos + n))
  stdinPos += n
  return n
}

self.onmessage = async (e: MessageEvent<ToWorker>) => {
  const msg = e.data
  if (msg.type === 'init') {
    try {
      await installVendorFetch(msg.base, 'pyodide', (loaded, total) => post({ type: 'progress', loaded, total }))
      const mod = await import(/* @vite-ignore */ new URL('vendor/pyodide/pyodide.mjs', msg.base).href)
      const py = await mod.loadPyodide({
        indexURL: new URL('vendor/pyodide/', msg.base).href,
        stdout: () => {},
        stderr: () => {},
      })
      pyodide = py
      py.runPython(PRELUDE)
      runner = py.globals.get('__kodo_run')
      post({ type: 'ready' })
    } catch (err) {
      post({ type: 'fatal', message: err instanceof Error ? err.message : String(err) })
    }
    return
  }
  if (msg.type === 'run') {
    stdinBytes = new TextEncoder().encode(msg.input)
    stdinPos = 0
    const t0 = performance.now()
    try {
      pyodide.setStdin({ read: readStdin })
      const res = runner(msg.code, msg.input)
      const [ok, stdout, stderr] = res.toJs()
      res.destroy()
      post({ type: 'result', id: msg.id, ok, stdout, stderr, timeMs: performance.now() - t0 })
    } catch (err) {
      // Débordement de pile WebAssembly ou erreur interne : l'interpréteur est peut-être
      // dans un état incohérent, la page relancera le worker.
      const text = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
      post({ type: 'result', id: msg.id, ok: false, stdout: '', stderr: text, timeMs: performance.now() - t0, crashed: true })
    }
  }
}
