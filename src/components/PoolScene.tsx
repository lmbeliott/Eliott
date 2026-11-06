import { useEffect, useState } from 'react'
import { cn } from '../lib/util'

// Le bassin vu de dessus : chaque ligne d'eau porte un créneau.
// Une seule séquence animée au chargement : une absence est déclarée,
// une collègue diplômée se propose, le remplacement est validé.

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

type Phase = 0 | 1 | 2 | 3

export function PoolScene({ className, still }: { className?: string; still?: boolean }) {
  const [phase, setPhase] = useState<Phase>(still ? 3 : 0)

  useEffect(() => {
    if (still) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setPhase(3); return }
    const timers = [
      setTimeout(() => setPhase(1), 1300),
      setTimeout(() => setPhase(2), 2700),
      setTimeout(() => setPhase(3), 4300),
    ]
    return () => timers.forEach(clearTimeout)
  }, [still])

  return (
    <figure className={cn('relative select-none', className)}>
      <figcaption className="mb-3 flex items-baseline justify-between gap-3 px-1">
        <span className="text-[15px] font-bold text-ink">Piscine des Iris</span>
        <span className="text-sm text-muted">Mercredi, bassin de 25 m</span>
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
                <span className="flex size-6 items-center justify-center rounded-md bg-ink text-[12px] font-bold text-surface num sm:size-7 sm:text-[13px]">{i + 1}</span>
              </div>
            </div>
          ))}
        </div>
        <div
          className="relative min-w-0 flex-1 overflow-hidden rounded-[14px]"
          style={{
            background:
              'repeating-linear-gradient(0deg, rgb(255 255 255 / 0.07) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, rgb(255 255 255 / 0.07) 0 1px, transparent 1px 24px), linear-gradient(170deg, var(--pool-mid), var(--pool-light))',
          }}
        >
          <div className="lane-rope opacity-90" />
          {LANES.map((lane, i) => (
            <div key={lane.group}>
              <Lane lane={lane} phase={i === EVENT_LANE ? phase : 0} />
              <div className="lane-rope opacity-90" />
            </div>
          ))}
        </div>
      </div>
    </figure>
  )
}

function Lane({ lane, phase }: { lane: LaneData; phase: Phase }) {
  const absent = phase >= 1
  const replaced = phase === 3
  return (
    <div className="relative flex h-[68px] items-center px-2.5 sm:h-[74px] sm:px-4">
      {/* Ligne de fond avec son T */}
      <span className="absolute inset-x-[6%] top-1/2 h-[5px] -translate-y-1/2 rounded-full bg-[#0c2a3e]/35" />
      <span className="absolute right-[6%] top-1/2 h-6 w-[5px] -translate-y-1/2 rounded-full bg-[#0c2a3e]/35" />

      <div
        className={cn(
          'relative flex min-w-0 flex-1 items-center gap-2.5 rounded-xl bg-surface py-2 pl-3 pr-2 shadow-[0_2px_10px_-4px_rgb(4_30_44/0.45)] transition-[box-shadow] duration-300 sm:max-w-[94%] sm:gap-3 sm:pl-3.5',
          absent && !replaced && 'ring-2 ring-rope-bright',
          replaced && 'ring-2 ring-kelp-bright',
        )}
      >
        <span className="h-8 w-1 shrink-0 rounded-full" style={{ background: lane.color }} />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[14px] font-bold text-ink sm:text-[15px]">{lane.group}</p>
          <p className="text-[12.5px] text-muted num sm:text-[13px]">{lane.time}</p>
        </div>
        <CoachChip coach={lane.coach} phase={phase} />
        {phase === 2 && (
          <span className="absolute -top-3 right-3 rounded-full bg-buoy-bright px-2.5 py-0.5 text-[12px] font-bold text-[#3d2b00] shadow-sm animate-[pop_220ms_var(--ease-swim)]">
            Inès M. se propose
          </span>
        )}
      </div>
    </div>
  )
}

function CoachChip({ coach, phase }: { coach: string; phase: Phase }) {
  if (phase === 0) {
    return <span className="shrink-0 rounded-full bg-surface-2 px-2.5 py-1 text-[12.5px] font-semibold text-ink-2">{coach}</span>
  }
  if (phase === 3) {
    return (
      <span key="ok" className="shrink-0 rounded-full bg-kelp-soft px-2.5 py-1 text-[12.5px] font-semibold text-kelp animate-[pop_220ms_var(--ease-swim)]">
        Inès M. remplace
      </span>
    )
  }
  return (
    <span key="abs" className="shrink-0 rounded-full bg-rope-soft px-2.5 py-1 text-[12.5px] font-semibold text-rope animate-[pop_220ms_var(--ease-swim)]">
      {coach} absente
    </span>
  )
}
