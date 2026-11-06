#!/usr/bin/env node
// Construit et vérifie le contenu de Kodo (problèmes + cours).
//
//   node scripts/build-content.mjs                 vérifie tout et écrit les fichiers générés
//   node scripts/build-content.mjs --check         vérifie seulement (n'écrit rien)
//   node scripts/build-content.mjs --check --filter n2-   ne traite que les problèmes/cours dont
//                                                  le chapitre ou l'id commence par « n2- »
//   --no-cpp                                       saute la vérification croisée C++
//
// Pour chaque problème : exécute gen.py (liste des entrées), solution.py (sorties attendues),
// compile solution.cpp avec g++ et vérifie qu'elle produit exactement les mêmes sorties.
// Les sorties des tests cachés ne sont publiées que sous forme d'empreinte SHA-256.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, rmSync, mkdtempSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { tmpdir } from 'node:os'
import { parse as parseYaml } from 'yaml'
import { Marked } from 'marked'
import hljs from 'highlight.js/lib/core'
import hljsPython from 'highlight.js/lib/languages/python'
import hljsCpp from 'highlight.js/lib/languages/cpp'
import hljsPlain from 'highlight.js/lib/languages/plaintext'

hljs.registerLanguage('python', hljsPython)
hljs.registerLanguage('cpp', hljsCpp)
hljs.registerLanguage('text', hljsPlain)

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CONTENT = join(ROOT, 'content')
const args = process.argv.slice(2)
const CHECK = args.includes('--check')
const NO_CPP = args.includes('--no-cpp')
// --lenient : écarte les problèmes en erreur au lieu d'échouer (développement uniquement).
const LENIENT = args.includes('--lenient')
const filterIdx = args.indexOf('--filter')
const FILTER = filterIdx >= 0 ? args[filterIdx + 1] : null

export const DIFFICULTIES = ['facile', 'moyen', 'difficile', 'expert']
export const POINTS = { facile: 50, moyen: 100, difficile: 200, expert: 400 }
// Titres de section reconnus, en français (problem.md) et en anglais (problem.en.md).
const SECTIONS = {
  fr: { 'Énoncé': 'statement', 'Entrée': 'input', 'Sortie': 'output', 'Contraintes': 'constraints', 'Indices': 'hints', 'Solution': 'solution' },
  en: { Statement: 'statement', Input: 'input', Output: 'output', Constraints: 'constraints', Hints: 'hints', Solution: 'solution' },
}
const REQUIRED_KEYS = ['statement', 'input', 'output', 'hints', 'solution']
const MAX_INPUT_BYTES = 400_000
const SLOW_PYTHON_MS = 1000

const errors = []
const warnings = []
const badProblems = new Set()
const err = (where, msg) => {
  errors.push(`✗ ${where}: ${msg}`)
  const m = where.match(/^problems\/([^/]+)/)
  if (m) badProblems.add(m[1])
}
const warn = (where, msg) => warnings.push(`! ${where}: ${msg}`)

// ---------------------------------------------------------------- Markdown

const LANG_ALIASES = { py: 'python', python: 'python', cpp: 'cpp', 'c++': 'cpp', c: 'cpp', text: 'text', txt: 'text', '': 'text' }

function makeMarked() {
  const m = new Marked({ gfm: true })
  m.use({
    renderer: {
      code({ text, lang }) {
        const l = LANG_ALIASES[(lang || '').trim().toLowerCase()] ?? 'text'
        const html = hljs.highlight(text, { language: l }).value
        return `<pre data-lang="${l}"><code class="hljs">${html}</code></pre>\n`
      },
    },
  })
  return m
}
const marked = makeMarked()

// Les blocs de code Python et C++ consécutifs deviennent un groupe : le site n'affiche
// que celui du langage choisi par l'élève.
function groupCode(html) {
  return html.replace(/(?:<pre data-lang="(?:python|cpp)">[\s\S]*?<\/pre>\s*){2,}/g, (block) => {
    const langs = [...block.matchAll(/<pre data-lang="(\w+)"/g)].map((x) => x[1])
    if (new Set(langs).size < 2) return block
    return `<div class="code-group">${block.trim()}</div>\n`
  })
}

const md = (src) => groupCode(marked.parse(src.trim()))

function splitFrontmatter(text, where) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!m) {
    err(where, 'frontmatter YAML manquant (bloc --- ... --- en tête de fichier)')
    return [{}, text]
  }
  try {
    return [parseYaml(m[1]) ?? {}, m[2]]
  } catch (e) {
    err(where, `frontmatter YAML invalide : ${e.message}`)
    return [{}, m[2]]
  }
}

function splitSections(body, where, lang) {
  const names = SECTIONS[lang]
  const sections = {}
  const parts = body.split(/^## +/m)
  if (parts[0].trim()) warn(where, 'texte avant la première section « ## » ignoré')
  for (const part of parts.slice(1)) {
    const nl = part.indexOf('\n')
    const name = (nl < 0 ? part : part.slice(0, nl)).trim()
    const content = nl < 0 ? '' : part.slice(nl + 1)
    if (!names[name]) err(where, `section inconnue « ## ${name} » (attendu : ${Object.keys(names).join(', ')})`)
    else sections[names[name]] = content.trim()
  }
  const label = Object.fromEntries(Object.entries(names).map(([k, v]) => [v, k]))
  for (const key of REQUIRED_KEYS) if (!sections[key]) err(where, `section « ## ${label[key]} » manquante ou vide`)
  return sections
}

// Énoncé rendu en HTML, dans une langue.
function renderText(title, sections, where) {
  const hints = (sections.hints || '')
    .split(/^\s*\d+\.\s+/m)
    .map((h) => h.trim())
    .filter(Boolean)
  if (sections.hints && hints.length === 0) err(where, 'indices : au moins un indice numéroté (1. …)')
  return {
    title,
    statement: md(sections.statement || ''),
    input: md(sections.input || ''),
    output: md(sections.output || ''),
    constraints: sections.constraints ? md(sections.constraints) : null,
    hints: hints.map(md),
    solution: md(sections.solution || ''),
  }
}

// ---------------------------------------------------------------- Exécution

const normalize = (out) => out.split(/\s+/).filter(Boolean).join(' ')
export const testHash = (problemId, index, output) =>
  createHash('sha256').update(`${problemId}:${index}:${normalize(output)}`).digest('hex')

function run(cmd, argv, { cwd, input, timeout = 10_000 } = {}) {
  const t0 = performance.now()
  const r = spawnSync(cmd, argv, { cwd, input, timeout, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  return { ...r, ms: performance.now() - t0 }
}

let tmp = null
function compileCpp(file, where) {
  tmp ??= mkdtempSync(join(tmpdir(), 'kodo-'))
  const exe = join(tmp, where.replace(/[^\w-]/g, '_'))
  const r = run('g++', ['-O2', '-std=c++17', '-fno-exceptions', '-o', exe, file], { timeout: 60_000 })
  if (r.status !== 0) {
    err(where, `solution.cpp ne compile pas (g++ -O2 -std=c++17 -fno-exceptions) :\n${(r.stderr || '').slice(0, 1500)}`)
    return null
  }
  return exe
}

// ---------------------------------------------------------------- Curriculum

const curriculum = JSON.parse(readFileSync(join(CONTENT, 'curriculum.json'), 'utf8'))
const chapterInfo = new Map()
for (const level of curriculum.levels) {
  for (const ch of level.chapters) chapterInfo.set(ch.id, { level, chapter: ch })
}
const matches = (id) => !FILTER || id.startsWith(FILTER)

// ---------------------------------------------------------------- Problèmes

const problems = []
const problemDirs = existsSync(join(CONTENT, 'problems'))
  ? readdirSync(join(CONTENT, 'problems'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
  : []

const seenIds = new Set()
for (const dirName of problemDirs) {
  const dir = join(CONTENT, 'problems', dirName)
  const where = `problems/${dirName}`
  if (!existsSync(join(dir, 'problem.md'))) {
    // Avec --filter, un dossier en cours d'écriture par quelqu'un d'autre n'est pas une erreur.
    if (!FILTER || matches(dirName)) err(where, 'problem.md manquant')
    continue
  }
  const [fm, body] = splitFrontmatter(readFileSync(join(dir, 'problem.md'), 'utf8'), where)
  const chapterId = fm.chapter
  if (!matches(dirName) && !(chapterId && matches(chapterId))) continue

  // --- métadonnées
  if (fm.id !== dirName) err(where, `id « ${fm.id} » différent du nom du dossier « ${dirName} »`)
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(dirName)) err(where, 'le nom du dossier doit être en kebab-case ASCII (a-z, 0-9, -)')
  if (seenIds.has(dirName)) err(where, 'id en double')
  seenIds.add(dirName)
  if (!fm.title || typeof fm.title !== 'string') err(where, 'title manquant')
  const info = chapterInfo.get(chapterId)
  if (!info) err(where, `chapitre inconnu « ${chapterId} » (voir content/curriculum.json)`)
  if (!Number.isInteger(fm.order)) err(where, 'order (entier) manquant')
  const difficulty = fm.difficulty ?? info?.level.difficulty
  if (!DIFFICULTIES.includes(difficulty)) err(where, `difficulty invalide « ${difficulty} » (${DIFFICULTIES.join(', ')})`)
  if (fm.tags && (!Array.isArray(fm.tags) || fm.tags.some((t) => typeof t !== 'string'))) err(where, 'tags doit être une liste de chaînes')
  const timeLimitMs = fm.time_limit_ms ?? 1000
  const nSamples = fm.samples ?? 2
  if (!Number.isInteger(nSamples) || nSamples < 1 || nSamples > 4) err(where, 'samples doit être un entier entre 1 et 4')

  const textFr = renderText(fm.title, splitSections(body, where, 'fr'), where)
  let textEn = null
  if (existsSync(join(dir, 'problem.en.md'))) {
    const whereEn = `${where}/problem.en.md`
    const [fmEn, bodyEn] = splitFrontmatter(readFileSync(join(dir, 'problem.en.md'), 'utf8'), whereEn)
    if (!fmEn.title || typeof fmEn.title !== 'string') err(whereEn, 'title manquant')
    textEn = renderText(fmEn.title, splitSections(bodyEn, whereEn, 'en'), whereEn)
    if (textEn.hints.length !== textFr.hints.length) warn(whereEn, `${textEn.hints.length} indice(s) contre ${textFr.hints.length} en français`)
  }

  for (const f of ['gen.py', 'solution.py', 'solution.cpp']) if (!existsSync(join(dir, f))) err(where, `${f} manquant`)
  if (!existsSync(join(dir, 'gen.py')) || !existsSync(join(dir, 'solution.py'))) continue

  // --- tests
  const g = run('python3', ['gen.py'], { cwd: dir, timeout: 60_000 })
  if (g.status !== 0) {
    err(where, `gen.py a échoué :\n${(g.stderr || '').slice(0, 1500)}`)
    continue
  }
  let raw
  try {
    raw = JSON.parse(g.stdout)
  } catch {
    err(where, 'gen.py doit afficher une liste JSON (json.dumps([...]))')
    continue
  }
  if (!Array.isArray(raw) || raw.length < nSamples + 3 || raw.length > 30) {
    err(where, `gen.py doit produire entre ${nSamples + 3} et 30 tests (reçu ${Array.isArray(raw) ? raw.length : '?'})`)
    continue
  }
  const g2 = run('python3', ['gen.py'], { cwd: dir, timeout: 60_000 })
  if (g2.stdout !== g.stdout) err(where, 'gen.py n\'est pas déterministe (fixer random.seed)')

  const inputs = raw.map((t) => {
    const s = typeof t === 'string' ? t : t?.input
    if (typeof s !== 'string') return null
    return s.endsWith('\n') ? s : s + '\n'
  })
  if (inputs.some((s) => s === null)) {
    err(where, 'chaque test doit être une chaîne ou un objet { "input": "..." }')
    continue
  }
  const totalBytes = inputs.reduce((a, s) => a + Buffer.byteLength(s), 0)
  if (totalBytes > MAX_INPUT_BYTES) err(where, `entrées trop lourdes (${Math.round(totalBytes / 1000)} ko > ${MAX_INPUT_BYTES / 1000} ko)`)
  for (let i = 0; i < nSamples; i++) {
    if (inputs[i].length > 400) warn(where, `l'exemple ${i + 1} est long (${inputs[i].length} caractères) : les exemples doivent rester lisibles`)
  }
  if (new Set(inputs).size !== inputs.length) warn(where, 'certains tests sont identiques')

  const outputs = []
  let slowest = 0
  for (const [i, input] of inputs.entries()) {
    const r = run('python3', ['solution.py'], { cwd: dir, input, timeout: 20_000 })
    if (r.status !== 0) {
      err(where, `solution.py échoue sur le test ${i + 1} :\n${(r.stderr || r.error?.message || '').slice(0, 1000)}`)
      outputs.push(null)
      continue
    }
    if (!r.stdout.trim()) err(where, `solution.py n'affiche rien sur le test ${i + 1}`)
    if (/\d\.\d{7,}/.test(r.stdout)) warn(where, `test ${i + 1} : sortie flottante à beaucoup de décimales, évitez les flottants`)
    slowest = Math.max(slowest, r.ms)
    outputs.push(r.stdout)
  }
  if (slowest > SLOW_PYTHON_MS) warn(where, `solution.py met ${Math.round(slowest)} ms sur le test le plus lent (> ${SLOW_PYTHON_MS} ms) : trop lent pour Python dans le navigateur`)

  if (!NO_CPP && existsSync(join(dir, 'solution.cpp'))) {
    const exe = compileCpp(join(dir, 'solution.cpp'), where)
    if (exe) {
      for (const [i, input] of inputs.entries()) {
        if (outputs[i] === null) continue
        const r = run(exe, [], { input, timeout: 10_000 })
        if (r.status !== 0) err(where, `solution.cpp échoue sur le test ${i + 1} (code ${r.status}) ${(r.stderr || '').slice(0, 500)}`)
        else if (normalize(r.stdout) !== normalize(outputs[i])) {
          err(where, `solution.cpp et solution.py diffèrent sur le test ${i + 1} :\n  py : ${normalize(outputs[i]).slice(0, 200)}\n  cpp: ${normalize(r.stdout).slice(0, 200)}`)
        }
      }
    }
  }

  const read = (f) => (existsSync(join(dir, f)) ? readFileSync(join(dir, f), 'utf8') : null)
  problems.push({
    id: dirName,
    title: fm.title,
    titleEn: textEn?.title ?? null,
    chapter: chapterId,
    level: info?.level.id,
    difficulty,
    order: fm.order,
    tags: fm.tags ?? [],
    points: POINTS[difficulty],
    timeLimitMs,
    text: { fr: textFr, en: textEn },
    solutionCode: { python: read('solution.py'), cpp: read('solution.cpp') },
    starter: {
      fr: { python: read('starter.py'), cpp: read('starter.cpp') },
      en: { python: read('starter.en.py') ?? read('starter.py'), cpp: read('starter.en.cpp') ?? read('starter.cpp') },
    },
    samples: inputs.slice(0, nSamples).map((input, i) => ({ input, output: outputs[i] ?? '' })),
    tests: inputs.slice(nSamples).map((input, j) => ({
      input,
      hash: outputs[j + nSamples] === null ? '' : testHash(dirName, j + nSamples, outputs[j + nSamples]),
    })),
  })
}

// ---------------------------------------------------------------- Cours

const lessons = []
for (const level of curriculum.levels) {
  for (const ch of level.chapters) {
    if (!matches(ch.id)) continue
    const file = join(CONTENT, 'lessons', `${ch.id}.md`)
    if (!existsSync(file)) {
      warn(`lessons/${ch.id}.md`, 'cours manquant')
      continue
    }
    const render = (text, name) => {
      // Les « # » des commentaires Python dans les blocs de code ne sont pas des titres.
      if (/^# /m.test(text.replace(/```[\s\S]*?```/g, ''))) warn(`lessons/${name}`, 'pas de titre « # » : le titre du chapitre est affiché par le site')
      return { html: md(text), minutes: Math.max(3, Math.round(text.split(/\s+/).length / 180)) }
    }
    const fileEn = join(CONTENT, 'lessons', `${ch.id}.en.md`)
    lessons.push({
      id: ch.id,
      fr: render(readFileSync(file, 'utf8'), `${ch.id}.md`),
      en: existsSync(fileEn) ? render(readFileSync(fileEn, 'utf8'), `${ch.id}.en.md`) : null,
    })
  }
}

// ---------------------------------------------------------------- Ordre dans les chapitres

for (const [chId] of chapterInfo) {
  const orders = problems.filter((p) => p.chapter === chId).map((p) => p.order)
  if (new Set(orders).size !== orders.length) err(`chapitre ${chId}`, `valeurs « order » en double : ${orders.sort().join(', ')}`)
}

// ---------------------------------------------------------------- Rapport

if (tmp) rmSync(tmp, { recursive: true, force: true })
for (const w of warnings) console.log(w)
for (const e of errors) console.log(e)
console.log(`\n${problems.length} problème(s), ${lessons.length} cours, ${errors.length} erreur(s), ${warnings.length} avertissement(s)`)
console.log(`Traductions anglaises : ${problems.filter((p) => p.text.en).length}/${problems.length} problèmes, ${lessons.filter((l) => l.en).length}/${lessons.length} cours`)
if (errors.length && !LENIENT) process.exit(1)
if (CHECK) process.exit(0)
if (LENIENT && badProblems.size) {
  console.log(`--lenient : ${badProblems.size} problème(s) en erreur écarté(s) : ${[...badProblems].join(', ')}`)
  for (let i = problems.length - 1; i >= 0; i--) if (badProblems.has(problems[i].id)) problems.splice(i, 1)
}
if (FILTER) {
  console.log('--filter sans --check : rien n\'est écrit (les fichiers générés doivent contenir tout le contenu).')
  process.exit(0)
}

// ---------------------------------------------------------------- Écriture

const outPublic = join(ROOT, 'public', 'content')
rmSync(outPublic, { recursive: true, force: true })
mkdirSync(join(outPublic, 'problems'), { recursive: true })
mkdirSync(join(outPublic, 'lessons'), { recursive: true })
for (const p of problems) writeFileSync(join(outPublic, 'problems', `${p.id}.json`), JSON.stringify(p))
for (const l of lessons) writeFileSync(join(outPublic, 'lessons', `${l.id}.json`), JSON.stringify(l))

const byChapter = (chId) => problems.filter((p) => p.chapter === chId).sort((a, b) => a.order - b.order)
const catalog = {
  levels: curriculum.levels.map((level) => ({
    id: level.id,
    difficulty: level.difficulty,
    title: level.title,
    titleEn: level.title_en,
    summary: level.summary,
    summaryEn: level.summary_en,
    chapters: level.chapters.map((ch) => ({
      id: ch.id,
      title: ch.title,
      titleEn: ch.title_en,
      summary: ch.summary,
      summaryEn: ch.summary_en,
      lessonMinutes: lessons.find((l) => l.id === ch.id)?.fr.minutes ?? null,
      problems: byChapter(ch.id).map((p) => p.id),
    })),
  })),
  problems: Object.fromEntries(
    problems.map((p) => [p.id, { id: p.id, title: p.title, titleEn: p.titleEn, chapter: p.chapter, level: p.level, difficulty: p.difficulty, order: p.order, tags: p.tags, points: p.points }]),
  ),
}
mkdirSync(join(ROOT, 'src', 'content'), { recursive: true })
writeFileSync(join(ROOT, 'src', 'content', 'catalog.json'), JSON.stringify(catalog, null, 1))

// Table « problems » côté Supabase : les points sont calculés par le serveur à partir d'elle.
const sqlRows = problems
  .map((p) => `  ('${p.id}', '${p.chapter}', '${p.level}', '${p.difficulty}', ${p.points}, '${String(p.title).replace(/'/g, "''")}')`)
  .join(',\n')
mkdirSync(join(ROOT, 'supabase'), { recursive: true })
writeFileSync(
  join(ROOT, 'supabase', 'problems.sql'),
  `-- Généré par scripts/build-content.mjs : ne pas modifier à la main.\n` +
    `insert into public.problems (id, chapter, level, difficulty, points, title) values\n${sqlRows}\n` +
    `on conflict (id) do update set chapter = excluded.chapter, level = excluded.level, difficulty = excluded.difficulty, points = excluded.points, title = excluded.title;\n`,
)
console.log(`Écrit : public/content (${problems.length} problèmes, ${lessons.length} cours), src/content/catalog.json, supabase/problems.sql`)
