async function e(e){let t=e.getReader(),n=await t.read(),r=new ReadableStream({start(e){n.done?e.close():e.enqueue(n.value)},async pull(e){let n=await t.read();n.done?e.close():e.enqueue(n.value)},cancel(e){return t.cancel(e)}});return!n.done&&n.value.length>=2&&n.value[0]===31&&n.value[1]===139?r.pipeThrough(new DecompressionStream(`gzip`)):r}const t=e=>e.endsWith(`.wasm`)?`application/wasm`:e.endsWith(`.json`)?`application/json`:`application/octet-stream`;async function n(n,r,i){let a=self.fetch.bind(self),o=new URL(`vendor/`,n).href,s=await a(o+`manifest.json`).then(e=>{if(!e.ok)throw Error(`manifest.json introuvable (${e.status})`);return e.json()}),c=Object.entries(s).filter(([e])=>e.startsWith(r+`/`)&&!/\.m?js$/.test(e)).reduce((e,[,t])=>e+t.bytes,0),l=0;i(0,c),self.fetch=async(n,r)=>{let u=typeof n==`string`?n:n instanceof URL?n.href:n.url,d=new URL(u,self.location.href).href;if(!d.startsWith(o))return a(n,r);let f=d.slice(o.length).split(/[?#]/)[0],p=s[f];if(!p)return a(n,r);let m=await a(p.gz?`${o}${f}.gz`:`${o}${f}`,r);if(!m.ok||!m.body)return m;let h=new TransformStream({transform(e,t){l+=e.byteLength,i(Math.min(l,c),c),t.enqueue(e)}}),g=m.body.pipeThrough(h);return p.gz&&(g=await e(g)),new Response(g,{status:200,headers:{"Content-Type":t(f)}})}}const r=e=>self.postMessage(e),i=String.raw`
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
`;let a=null,o=null,s=/* @__PURE__ */ new Uint8Array,c=0;const l=e=>{let t=Math.min(e.length,s.length-c);return e.set(s.subarray(c,c+t)),c+=t,t};self.onmessage=async e=>{let t=e.data;if(t.type===`init`)try{await n(t.base,`pyodide`,(e,t)=>r({type:`progress`,loaded:e,total:t}));let e=await(await import(
/* @vite-ignore */
new URL(`vendor/pyodide/pyodide.mjs`,t.base).href)).loadPyodide({indexURL:new URL(`vendor/pyodide/`,t.base).href,stdout:()=>{},stderr:()=>{}});o=e,e.runPython(i),a=e.globals.get(`__kodo_run`),r({type:`ready`})}catch(e){r({type:`fatal`,message:e instanceof Error?e.message:String(e)})}else if(t.type===`run`){s=new TextEncoder().encode(t.input),c=0;let e=performance.now();try{o.setStdin({read:l});let n=a(t.code,t.input),[i,s,c]=n.toJs();n.destroy(),r({type:`result`,id:t.id,ok:i,stdout:s,stderr:c,timeMs:performance.now()-e})}catch(n){let i=n instanceof Error?`${n.name}: ${n.message}`:String(n);r({type:`result`,id:t.id,ok:!1,stdout:``,stderr:i,timeMs:performance.now()-e,crashed:!0})}}};