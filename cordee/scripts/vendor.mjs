#!/usr/bin/env node
// Copie Pyodide (Python) et Clang (C/C++) compilés en WebAssembly dans public/vendor/.
// Les gros fichiers sont compressés en .gz : le navigateur les décompresse lui-même
// (DecompressionStream), ce qui marche sur n'importe quel hébergement statique.
//   Python : ~6 Mo téléchargés une fois ; C++ : ~27 Mo, seulement si l'élève choisit C++.

import { createReadStream, createWriteStream, copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createGzip, constants } from 'node:zlib'
import { pipeline } from 'node:stream/promises'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const NM = join(ROOT, 'node_modules')
const OUT = join(ROOT, 'public', 'vendor')

const version = (pkg) => JSON.parse(readFileSync(join(NM, pkg, 'package.json'), 'utf8')).version
const stamp = `pyodide@${version('pyodide')} clang@${version('@yowasp/clang')} v2`
const stampFile = join(OUT, 'VERSION')
if (existsSync(stampFile) && readFileSync(stampFile, 'utf8') === stamp) {
  console.log(`vendor à jour (${stamp})`)
  process.exit(0)
}

rmSync(OUT, { recursive: true, force: true })
mkdirSync(join(OUT, 'pyodide'), { recursive: true })
mkdirSync(join(OUT, 'clang'), { recursive: true })

const gzip = (src, dst) =>
  pipeline(createReadStream(src), createGzip({ level: constants.Z_BEST_COMPRESSION }), createWriteStream(dst))

const files = {}
async function add(src, dir, name, compress) {
  const dst = join(OUT, dir, compress ? `${name}.gz` : name)
  if (compress) await gzip(src, dst)
  else copyFileSync(src, dst)
  files[`${dir}/${name}`] = { gz: compress, bytes: statSync(dst).size }
}

// Pyodide
const py = join(NM, 'pyodide')
await add(join(py, 'pyodide.mjs'), 'pyodide', 'pyodide.mjs', false)
await add(join(py, 'pyodide.asm.mjs'), 'pyodide', 'pyodide.asm.mjs', false)
await add(join(py, 'pyodide-lock.json'), 'pyodide', 'pyodide-lock.json', false)
await add(join(py, 'python_stdlib.zip'), 'pyodide', 'python_stdlib.zip', false)
await add(join(py, 'pyodide.asm.wasm'), 'pyodide', 'pyodide.asm.wasm', true)

// Clang / LLD
const cl = join(NM, '@yowasp', 'clang', 'gen')
await add(join(cl, 'bundle.js'), 'clang', 'bundle.js', false)
for (const f of ['llvm.core.wasm', 'llvm.core2.wasm', 'llvm.core3.wasm', 'llvm.core4.wasm', 'llvm-resources.tar']) {
  await add(join(cl, f), 'clang', f, f === 'llvm.core.wasm' || f === 'llvm-resources.tar')
}

writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(files, null, 1))
writeFileSync(stampFile, stamp)
console.log(`vendor écrit dans public/vendor (${stamp})`)
