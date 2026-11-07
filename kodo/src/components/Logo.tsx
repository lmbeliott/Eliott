import { cx } from './ui'

// Marque Kodo : un K monoligne. Le jambage file vers une cellule d'accent, la case
// d'un test réussi (DESIGN.md §1, le motif des cellules). Au chargement, la branche
// se trace puis la cellule s'allume, comme un test qui passe.

const STEM = 'M15 9.5v29'
const ARM = 'M33.5 10 22.6 21.6a3.5 3.5 0 0 0 0 4.8L27.5 31.6'

export function LogoMark({ size = 30, className, animate, tile }: { size?: number; className?: string; animate?: boolean; tile?: boolean }) {
  const ink = tile ? 'var(--bg)' : 'var(--ink)'
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden className={cx('shrink-0', animate && 'logo-anim', className)}>
      {tile && <rect width="48" height="48" rx="12" fill="var(--ink)" />}
      <path d={STEM} stroke={ink} strokeWidth="5" strokeLinecap="round" fill="none" />
      <path className="logo-arm" pathLength={100} d={ARM} stroke={ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect className="logo-cell" x="29.5" y="33.5" width="8" height="8" rx="2.2" fill="var(--accent)" />
    </svg>
  )
}

export function Logo({ className, animate }: { className?: string; animate?: boolean }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5', className)}>
      <LogoMark animate={animate} />
      <span className="display text-[1.2rem] font-semibold leading-none tracking-[-0.03em]">kodo</span>
    </span>
  )
}
