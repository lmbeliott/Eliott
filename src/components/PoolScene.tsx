import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { RotateCcw } from 'lucide-react'
import { cn } from '../lib/util'
import { prefersReducedMotion, useInView } from '../lib/motion'

// Le bassin vu de dessus : chaque ligne d'eau porte un créneau.
// À l'entrée dans la fenêtre : le bassin se remplit, les lignes d'eau
// s'installent, les créneaux arrivent, puis une absence est déclarée,
// une collègue diplômée se propose et le remplacement est validé.

interface LaneData {
  time: string
  group: string
  coach: string
  color: string
}

const LANES: LaneData[] = [
  { time: '14h – 14h45', group: 'École de natation 1', coach: 'Hugo P.', color: '#0e9c8e' },
  { time: '14h45 – 15h30', group: 'École de natation 2', coach: 'Yanis R.', color: '#0e9c8e' },
  { time: '17h – 18h30', group: 'Jeunes', coach: 'Léa B.', color: '#e07a1f' },
  { time: '18h30 – 20h', group: 'Juniors – Seniors', coach: 'Manon G.', color: '#e07a1f' },
  { time: '20h – 21h', group: 'Masters', coach: 'Théo L.', color: '#d2478e' },
]
const EVENT_LANE = 2
const INTRO_MS = 1500

type Phase = 0 | 1 | 2 | 3

export function PoolScene({ className, still }: { className?: string; still?: boolean }) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.35, rootMargin: '0px' })
  const [phase, setPhase] = useState<Phase>(still ? 3 : 0)
  const timers = useRef<number[]>([])

  const runSequence = useCallback((lead: number) => {
    timers.current.forEach(clearTimeout)
    if (prefersReducedMotion()) { setPhase(3); return }
    setPhase(0)
    timers.current = [
      window.setTimeout(() => setPhase(1), lead),
      window.setTimeout(() => setPhase(2), lead + 1500),
      window.setTimeout(() => setPhase(3), lead + 3100),
    ]
  }, [])

  useEffect(() => {
    if (still || !inView) return
    runSequence(INTRO_MS + 500)
    return () => timers.current.forEach(clearTimeout)
  }, [still, inView, runSequence])

  return (
    <figure ref={ref} className={cn('relative select-none', !still && 'pool-animated', className)} data-play={!still && inView ? '' : undefined}>
      <figcaption className="mb-3 flex items-center justify-between gap-3 px-1">
        <span className="text-[15px] font-bold text-ink">Piscine des Iris</span>
        <span className="flex items-center gap-1 text-sm text-muted">
          Mercredi, bassin de 25 m
          {!still && (
            <button
              type="button"
              onClick={() => runSequence(250)}
              disabled={phase !== 3}
              aria-label="Rejouer l'exemple de remplacement"
              title="Rejouer"
              className="ml-1 inline-flex size-7 items-center justify-center rounded-full text-muted transition-[opacity,color,transform] duration-300 hover:text-ink disabled:opacity-0 [&:not(:disabled)]:hover:-rotate-90"
            >
              <RotateCcw aria-hidden className="size-3.5" />
            </button>
          )}
        </span>
      </figcaption>
      <span className="sr-only">
        Exemple de planning : cinq lignes d'eau, chacune avec son groupe et son éducateur. Léa B. déclare une absence sur le groupe Jeunes ; Inès M., diplômée et disponible, se propose et le remplacement est validé.
      </span>

      <div aria-hidden className="flex rounded-[22px] bg-surface p-2.5 pl-1.5 shadow-float ring-1 ring-line sm:pl-2">
        {/* Plots de départ numérotés, sur la plage */}
        <div className="flex w-8 shrink-0 flex-col sm:w-9">
          <div className="h-[9px]" />
          {LANES.map((lane, i) => (
            <div key={lane.group} className="pb-[9px]">
              <div className="flex h-[68px] items-center justify-center sm:h-[74px]">
                <span className="pool-block flex size-6 items-center justify-center rounded-md bg-ink text-[12px] font-bold text-surface num sm:size-7 sm:text-[13px]" style={{ '--i': i } as CSSProperties}>{i + 1}</span>
              </div>
            </div>
          ))}
        </div>
        <div
          className="pool-water relative min-w-0 flex-1 overflow-hidden rounded-[14px]"
          style={{
            background:
              'repeating-linear-gradient(0deg, rgb(255 255 255 / 0.07) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, rgb(255 255 255 / 0.07) 0 1px, transparent 1px 24px), linear-gradient(170deg, var(--pool-mid), var(--pool-light))',
          }}
        >
          {!still && <div className="pool-caustics" />}
          <div className="lane-rope opacity-90" style={{ '--i': 0 } as CSSProperties} />
          {LANES.map((lane, i) => (
            <div key={lane.group}>
              <Lane lane={lane} index={i} phase={i === EVENT_LANE ? phase : 0} />
              <div className="lane-rope opacity-90" style={{ '--i': i + 1 } as CSSProperties} />
            </div>
          ))}
        </div>
      </div>
    </figure>
  )
}

function Lane({ lane, index, phase }: { lane: LaneData; index: number; phase: Phase }) {
  const absent = phase === 1 || phase === 2
  const replaced = phase === 3
  return (
    <div className="relative flex h-[68px] items-center px-2.5 sm:h-[74px] sm:px-4">
      {/* Ligne de fond avec son T */}
      <span className="absolute inset-x-[6%] top-1/2 h-[5px] -translate-y-1/2 rounded-full bg-[#0c2a3e]/35" />
      <span className="absolute right-[6%] top-1/2 h-6 w-[5px] -translate-y-1/2 rounded-full bg-[#0c2a3e]/35" />

      <div
        className={cn(
          'pool-card relative flex min-w-0 flex-1 items-center gap-2.5 rounded-xl bg-surface py-2 pl-3 pr-2 shadow-[0_2px_10px_-4px_rgb(4_30_44/0.45)] ring-2 ring-transparent transition-[box-shadow,--tw-ring-color] duration-500 sm:max-w-[94%] sm:gap-3 sm:pl-3.5',
          absent && 'ring-rope-bright',
          replaced && 'ring-kelp-bright',
        )}
        style={{ '--i': index } as CSSProperties}
      >
        <span className="h-8 w-1 shrink-0 rounded-full" style={{ background: lane.color }} />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[14px] font-bold text-ink sm:text-[15px]">{lane.group}</p>
          <p className="text-[12.5px] text-muted num sm:text-[13px]">{lane.time}</p>
        </div>
        <CoachChip coach={lane.coach} phase={phase} />
        {phase === 2 && (
          <span className="absolute -top-3 right-3 rounded-full bg-buoy-bright px-2.5 py-0.5 text-[12px] font-bold text-[#3d2b00] shadow-sm animate-[pop_320ms_var(--ease-spring)]">
            Inès M. se propose
          </span>
        )}
      </div>
    </div>
  )
}

function CoachChip({ coach, phase }: { coach: string; phase: Phase }) {
  const base = 'shrink-0 rounded-full px-2.5 py-1 text-[12.5px] font-semibold'
  if (phase === 0) return <span key="std" className={cn(base, 'bg-surface-2 text-ink-2')}>{coach}</span>
  if (phase === 3) return <span key="ok" className={cn(base, 'bg-kelp-soft text-kelp animate-[pop_320ms_var(--ease-spring)]')}>Inès M. remplace</span>
  return (
    <span key="abs" className={cn(base, 'relative bg-rope-soft text-rope animate-[pop_320ms_var(--ease-spring)]')}>
      <span className="live-dot mr-1.5 inline-block size-1.5 rounded-full bg-rope-bright align-middle" />
      {coach} absente
    </span>
  )
}
