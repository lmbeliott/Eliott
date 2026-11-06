/** CSV au format Excel français : séparateur « ; », BOM UTF-8 pour les accents. */
export function toCSV(rows: Array<Array<string | number>>): string {
  const esc = (v: string | number) => {
    const s = typeof v === 'number' ? String(v).replace('.', ',') : v
    return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return '﻿' + rows.map((r) => r.map(esc).join(';')).join('\r\n')
}

export function download(filename: string, content: string, type = 'text/csv;charset=utf-8') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * Lit un tableau collé depuis Excel/Sheets (tabulations) ou un CSV (« ; » ou « , »).
 * Gère les guillemets et les retours à la ligne dans les cellules.
 */
export function parseTable(text: string): string[][] {
  const clean = text.replace(/^﻿/, '')
  const firstLine = clean.split(/\r?\n/, 1)[0] ?? ''
  const sep = firstLine.includes('\t') ? '\t' : firstLine.split(';').length >= firstLine.split(',').length ? ';' : ','
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i]
    if (quoted) {
      if (c === '"' && clean[i + 1] === '"') { cell += '"'; i++ }
      else if (c === '"') quoted = false
      else cell += c
    } else if (c === '"' && cell === '') quoted = true
    else if (c === sep) { row.push(cell.trim()); cell = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && clean[i + 1] === '\n') i++
      row.push(cell.trim()); cell = ''
      if (row.some((v) => v !== '')) rows.push(row)
      row = []
    } else cell += c
  }
  row.push(cell.trim())
  if (row.some((v) => v !== '')) rows.push(row)
  return rows
}
