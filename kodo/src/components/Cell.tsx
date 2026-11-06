// La cellule : le motif de Kodo (DESIGN.md §5). Un problème, un test ou un jour.
import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cx } from './ui'

export type CellState = 'empty' | 'tried' | 'done' | 'pass' | 'fail' | 'slow' | 'running' | 'skipped'
export type CellSize = 'dense' | 'md' | 'lg'

const sizeCls: Record<CellSize, string> = { dense: 'size-3', md: 'size-3.5', lg: 'size-5' }

const stateCls: Record<CellState, string> = {
  empty: 'bg-surface-2 shadow-[inset_0_0_0_1px_var(--line-strong)]',
  tried: 'bg-accent-soft shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--accent)_55%,transparent)]',
  done: 'bg-accent',
  pass: 'bg-ok',
  fail: 'bg-bad',
  slow: 'bg-warn',
  running: 'bg-surface shadow-[inset_0_0_0_1.5px_var(--accent)] animate-pulse',
  skipped: 'bg-surface-2 shadow-[inset_0_0_0_1px_var(--line)] opacity-60',
}

interface CellProps {
  state: CellState
  size?: CellSize
  label: string
  to?: string
  onClick?: () => void
  selected?: boolean
  style?: CSSProperties
  className?: string
  children?: ReactNode
}

export function Cell({ state, size = 'md', label, to, onClick, selected, style, className, children }: CellProps) {
  const cls = cx(
    'relative inline-flex shrink-0 items-center justify-center rounded-[3px] transition-[background-color,box-shadow] duration-150',
    sizeCls[size],
    stateCls[state],
    (to || onClick) && 'outline-offset-2 hover:shadow-[inset_0_0_0_1.5px_var(--ink)]',
    selected && 'ring-2 ring-ink ring-offset-2 ring-offset-surface',
    className,
  )
  if (to) return <Link to={to} className={cls} aria-label={label} title={label} style={style} />
  if (onClick)
    return (
      <button type="button" className={cls} aria-label={label} title={label} aria-pressed={selected} onClick={onClick} style={style}>
        {children}
      </button>
    )
  return <span className={cls} role="img" aria-label={label} title={label} style={style} />
}
