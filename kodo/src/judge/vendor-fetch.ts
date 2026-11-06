// Dans un worker : remplace fetch() pour les fichiers de public/vendor/ afin de
//  - télécharger la version .gz quand elle existe et la décompresser (DecompressionStream) ;
//  - compter les octets reçus pour afficher une progression.
// Pyodide et Clang chargent leurs fichiers avec fetch(), ils n'y voient que du feu.

type Manifest = Record<string, { gz: boolean; bytes: number }>

async function gunzipIfNeeded(stream: ReadableStream<Uint8Array>): Promise<ReadableStream<Uint8Array>> {
  const reader = stream.getReader()
  const first = await reader.read()
  const rest = new ReadableStream<Uint8Array>({
    start(ctl) {
      if (first.done) ctl.close()
      else ctl.enqueue(first.value)
    },
    async pull(ctl) {
      const r = await reader.read()
      if (r.done) ctl.close()
      else ctl.enqueue(r.value)
    },
    cancel(reason) {
      return reader.cancel(reason)
    },
  })
  // Certains hébergeurs décompressent déjà les .gz (Content-Encoding) : on vérifie la signature.
  const isGzip = !first.done && first.value.length >= 2 && first.value[0] === 0x1f && first.value[1] === 0x8b
  return isGzip ? rest.pipeThrough(new DecompressionStream('gzip') as unknown as TransformStream<Uint8Array, Uint8Array>) : rest
}

const typeOf = (key: string) =>
  key.endsWith('.wasm') ? 'application/wasm' : key.endsWith('.json') ? 'application/json' : 'application/octet-stream'

export async function installVendorFetch(
  base: string,
  prefix: 'pyodide' | 'clang',
  onProgress: (loaded: number, total: number) => void,
) {
  const nativeFetch = self.fetch.bind(self)
  const vendorRoot = new URL('vendor/', base).href
  const manifest: Manifest = await nativeFetch(vendorRoot + 'manifest.json').then((r) => {
    if (!r.ok) throw new Error(`manifest.json introuvable (${r.status})`)
    return r.json()
  })
  // Les modules .js/.mjs sont chargés par import(), pas par fetch : on ne les compte pas.
  const counted = Object.entries(manifest).filter(([k]) => k.startsWith(prefix + '/') && !/\.m?js$/.test(k))
  const total = counted.reduce((a, [, v]) => a + v.bytes, 0)
  let loaded = 0
  onProgress(0, total)

  self.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    const abs = new URL(url, self.location.href).href
    if (!abs.startsWith(vendorRoot)) return nativeFetch(input, init)
    const key = abs.slice(vendorRoot.length).split(/[?#]/)[0]
    const entry = manifest[key]
    if (!entry) return nativeFetch(input, init)
    const res = await nativeFetch(entry.gz ? `${vendorRoot}${key}.gz` : `${vendorRoot}${key}`, init)
    if (!res.ok || !res.body) return res
    const counter = new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, ctl) {
        loaded += chunk.byteLength
        onProgress(Math.min(loaded, total), total)
        ctl.enqueue(chunk)
      },
    })
    let body = res.body.pipeThrough(counter)
    if (entry.gz) body = await gunzipIfNeeded(body)
    return new Response(body, { status: 200, headers: { 'Content-Type': typeOf(key) } })
  }
}
