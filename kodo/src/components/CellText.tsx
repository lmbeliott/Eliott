// Texte dessiné en cellules (5 × 7) : la signature typographique de Kodo.
// Réservé à quelques moments : le mot-marque du pied de page, la page 404.
import { cx } from './ui'

const GLYPHS: Record<string, string[]> = {
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  '0': ['01110', '10011', '10101', '10101', '11001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00110', '01000', '10000', '11111'],
  '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  '6': ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
}

interface Props {
  text: string
  /** Côté d'une cellule en px */
  cell?: number
  gap?: number
  /** Indices (ligne, colonne) des cellules allumées en accent, comme des problèmes réussis */
  lit?: [number, number][]
  className?: string
  /** Cellules hors des lettres : visibles (grille complète) ou masquées */
  grid?: boolean
  label: string
}

export function CellText({ text, cell = 10, gap = 3, lit = [], className, grid = true, label }: Props) {
  const chars = text.toUpperCase().split('')
  const cols = chars.length * 6 - 1
  const litSet = new Set(lit.map(([r, c]) => `${r}:${c}`))
  const cells: { r: number; c: number; on: boolean }[] = []
  chars.forEach((ch, i) => {
    const g = GLYPHS[ch] ?? GLYPHS[' ']
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 6; c++) {
        const col = i * 6 + c
        if (col >= cols) continue
        cells.push({ r, c: col, on: c < 5 && g[r][c] === '1' })
      }
    }
  })
  return (
    <div
      role="img"
      aria-label={label}
      className={cx('inline-grid', className)}
      style={{ gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gridAutoRows: `${cell}px`, gap }}
    >
      {cells.map(({ r, c, on }) => {
        const accent = litSet.has(`${r}:${c}`)
        return (
          <span
            key={`${r}:${c}`}
            aria-hidden
            className={cx(
              'rounded-[2px]',
              accent ? 'bg-accent' : on ? 'bg-ink' : grid ? 'shadow-[inset_0_0_0_1px_var(--line)]' : '',
            )}
            style={{ gridRow: r + 1, gridColumn: c + 1 }}
          />
        )
      })}
    </div>
  )
}
