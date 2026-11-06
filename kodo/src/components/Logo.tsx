import { cx } from './ui'

/** Le K de Kodo : un trait et un chevron de code « < ». */
export function LogoMark({ size = 26, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className={className}>
      <rect width="32" height="32" rx="8" fill="var(--ink)" />
      <path d="M10.5 8v16" stroke="var(--bg)" strokeWidth="3" strokeLinecap="round" />
      <path d="M23 8.5 15 16l8 7.5" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-2', className)}>
      <LogoMark />
      <span className="display text-[1.2rem] font-semibold tracking-[-0.03em]">kodo</span>
    </span>
  )
}
