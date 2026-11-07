// La bande de tests : une cellule par test, remplie au fil de l'exécution (DESIGN.md §5–6).
import type { TestResult } from '../judge/judge'
import { useI18n } from '../lib/i18n'
import { Cell, type CellState } from './Cell'
import { cx } from './ui'

export const cellStateOf = (s: TestResult['status']): CellState =>
  ({ ok: 'pass', wrong: 'fail', error: 'fail', timeout: 'slow', running: 'running', pending: 'empty', skipped: 'skipped' })[s] as CellState

export function statusText(t: (fr: string, en: string) => string, s: TestResult['status']) {
  return {
    pending: t('en attente', 'pending'),
    running: t('en cours', 'running'),
    ok: t('réussi', 'passed'),
    wrong: t('mauvaise réponse', 'wrong answer'),
    timeout: t('temps dépassé', 'time limit exceeded'),
    error: t('erreur d’exécution', 'runtime error'),
    skipped: t('non exécuté', 'not run'),
  }[s]
}

interface Props {
  results: Pick<TestResult, 'index' | 'status' | 'sample' | 'timeMs'>[]
  selected?: number | null
  onSelect?: (index: number) => void
  size?: 'md' | 'lg'
  className?: string
}

export function TestStrip({ results, selected, onSelect, size = 'lg', className }: Props) {
  const { t } = useI18n()
  return (
    <ul className={cx('flex flex-wrap gap-1.5', className)} aria-label={t('Tests', 'Tests')}>
      {results.map((r) => {
        const label = `${t('Test', 'Test')} ${r.index + 1}${r.sample ? ` (${t('exemple', 'example')})` : ''} : ${statusText(t, r.status)}${r.status === 'ok' || r.status === 'wrong' ? `, ${r.timeMs} ms` : ''}`
        const clickable = onSelect && !['pending', 'running', 'skipped'].includes(r.status)
        return (
          <li key={r.index} className="flex">
            <Cell
              state={cellStateOf(r.status)}
              size={size}
              label={label}
              onClick={clickable ? () => onSelect!(r.index) : undefined}
              selected={selected === r.index}
              className={cx(size === 'lg' && 'size-6', ['ok', 'wrong', 'error', 'timeout'].includes(r.status) && 'anim-pop')}
            />
          </li>
        )
      })}
    </ul>
  )
}
