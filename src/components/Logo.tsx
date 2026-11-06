import { Link } from 'react-router-dom'
import { cn } from '../lib/util'

export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  const floats = [6, 11, 16, 21, 26]
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className={cn('shrink-0', className)}>
      <rect width="32" height="32" rx="8" fill="#0C2A3E" />
      {[7.5, 24.5].map((y) => floats.map((x, i) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.9" fill={i === 0 || i === 4 ? '#E0412E' : '#FFFFFF'} />
      )))}
      <path d="M6.5 16h16.5M23 12v8" stroke="#3CC4E4" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ to = '/', className, light }: { to?: string; className?: string; light?: boolean }) {
  return (
    <Link to={to} className={cn('inline-flex items-center gap-2.5 rounded-md', className)} aria-label="SwimHub Connect, accueil">
      <LogoMark />
      <span className={cn('text-[19px] leading-none font-extrabold tracking-tight [font-stretch:80%]', light ? 'text-white' : 'text-ink')}>
        SwimHub <span className={cn('font-semibold', light ? 'text-[#7fdcf2]' : 'text-water')}>Connect</span>
      </span>
    </Link>
  )
}
