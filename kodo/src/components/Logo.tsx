import { cx } from './ui'

/** Le sentier qui grimpe jusqu'au sommet ; le point jaune, c'est toi. */
export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className={className}>
      <rect width="32" height="32" rx="7" fill="var(--ink)" />
      <path d="M6 24.5 12.5 15l4 5 4.5-9.5 5 14" fill="none" stroke="var(--snow)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="21" cy="10.5" r="3" fill="var(--signal)" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-2', className)}>
      <LogoMark />
      <span className="display text-[1.2rem] font-semibold tracking-tight">Cordée</span>
    </span>
  )
}
