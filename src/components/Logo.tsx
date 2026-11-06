import { Link } from 'react-router-dom'
import { cn } from '../lib/util'
import { useReducedMotion } from '../lib/motion'

// Marque SwimHub : un « S » tracé d'un seul trait — le chemin d'un nageur qui
// enchaîne les longueurs (aller, virage, retour) — et un point, le nageur.
// Au chargement, le point nage le S pendant que la ligne se dessine derrière lui.

export const S_PATH = 'M35 12 H13 A6 6 0 0 0 13 24 H35 A6 6 0 0 1 35 36 H20'
const SWIM_PATH = 'M35 12 H13 A6 6 0 0 0 13 24 H35 A6 6 0 0 1 35 36 H11.5'
const SWIM_MS = 1500

export function LogoMark({ size = 30, className, animate, tile }: { size?: number; className?: string; animate?: boolean; tile?: boolean }) {
  const reduce = useReducedMotion()
  const play = animate && !reduce
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden className={cn('logo-mark shrink-0', play && 'logo-anim', className)}>
      {tile && <rect width="48" height="48" rx="12" fill="var(--ink)" />}
      <path
        className="logo-s"
        pathLength={100}
        d={S_PATH}
        fill="none"
        stroke={tile ? 'var(--surface)' : 'var(--ink)'}
        strokeWidth="5.5"
        strokeLinecap="round"
        style={play ? { animationDuration: `${SWIM_MS}ms` } : undefined}
      />
      {play ? (
        <circle className="logo-dot" r="3.6" fill="#3CC4E4">
          <animateMotion dur={`${SWIM_MS}ms`} fill="freeze" path={SWIM_PATH} calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines="0.6 0 0.25 1" />
        </circle>
      ) : (
        <circle className="logo-dot" cx="11.5" cy="36" r="3.6" fill="#3CC4E4" />
      )}
    </svg>
  )
}

export function Logo({ to = '/', className, light, animate }: { to?: string; className?: string; light?: boolean; animate?: boolean }) {
  return (
    <Link to={to} className={cn('logo-link inline-flex items-center gap-2 rounded-md', className)} aria-label="SwimHub Connect, accueil">
      <LogoMark animate={animate} />
      <span className={cn('text-[19px] leading-none tracking-[-0.02em]', light ? 'text-white' : 'text-ink')}>
        <span className="font-bold">SwimHub</span>
        <span className={cn('ml-1 font-normal', light ? 'text-[#b9d3df]' : 'text-muted')}>Connect</span>
      </span>
    </Link>
  )
}
