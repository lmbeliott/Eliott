import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Check, RotateCcw, UserX } from 'lucide-react'
import { cn } from '../lib/util'
import { prefersReducedMotion, useInView } from '../lib/motion'

// Visuel du héros : de vraies cartes du produit, en perspective, sur l'eau profonde.
// Séquence : le planning arrive, Léa signale son absence, Inès se propose,
// le responsable valide, la séance passe au vert.

type Phase = 0 | 1 | 2 | 3

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven']
const SESSIONS: Array<{ d: number; top: number; h: number; g: string; t: string; c: string; key?: 'event' }> = [
  { d: 0, top: 6, h: 30, g: 'École 1', t: '17 h', c: '#2bb5a6' },
  { d: 0, top: 40, h: 40, g: 'Jeunes', t: '18 h', c: '#f0913a' },
  { d: 1, top: 18, h: 34, g: 'Avenirs', t: '17 h 30', c: '#f0913a' },
  { d: 1, top: 58, h: 26, g: 'Aquagym', t: '18 h 30', c: '#9cc23b' },
  { d: 2, top: 6, h: 46, g: 'Jeunes', t: '17 h', c: '#f0913a', key: 'event' },
  { d: 2, top: 56, h: 40, g: 'Juniors', t: '18 h 30', c: '#f0913a' },
  { d: 3, top: 18, h: 34, g: 'Avenirs', t: '17 h 30', c: '#f0913a' },
  { d: 3, top: 54, h: 26, g: 'Masters', t: '19 h', c: '#e2609d' },
  { d: 4, top: 6, h: 30, g: 'École 1', t: '17 h', c: '#2bb5a6' },
  { d: 4, top: 40, h: 44, g: 'Jeunes', t: '18 h', c: '#f0913a' },
]

export function HeroStage({ className, still }: { className?: string; still?: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.25, rootMargin: '0px' })
  const [phase, setPhase] = useState<Phase>(still ? 3 : 0)
  const timers = useRef<number[]>([])

  const run = useCallback((lead: number) => {
    timers.current.forEach(clearTimeout)
    if (prefersReducedMotion()) { setPhase(3); return }
    setPhase(0)
    timers.current = [
      window.setTimeout(() => setPhase(1), lead),
      window.setTimeout(() => setPhase(2), lead + 1300),
      window.setTimeout(() => setPhase(3), lead + 3000),
    ]
  }, [])

  useEffect(() => {
    if (still || !inView) return
    run(1500)
    return () => timers.current.forEach(clearTimeout)
  }, [still, inView, run])

  return (
    <div ref={ref} className={cn('stage relative select-none', className)} data-play={still || inView ? '' : undefined}>
      <p className="sr-only">
        Exemple : sur le planning de la semaine, Léa B. signale son absence pour le groupe Jeunes, mercredi à 17 h. Inès M., diplômée et disponible, se propose ; le responsable valide et la séance est remplacée.
      </p>

      <div aria-hidden className="relative mx-auto max-w-[620px] pb-40 pt-8 sm:pb-36 lg:[perspective:1600px]">
        {/* Planning de la semaine (surface marine pleine, en perspective) ; 3 jours sur téléphone */}
        <div
          className="stage-card relative rounded-[4px] border border-white/15 bg-[#0f2c3d] p-4 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6),inset_0_1px_0_rgb(255_255_255/0.08)] sm:mr-6 sm:p-5 lg:origin-left lg:[transform:rotateY(-14deg)_rotateX(6deg)]"
          style={{ '--i': 0 } as CSSProperties}
        >
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[#a3bccb]">Centre aquatique du Parc</p>
              <p className="text-lg font-semibold text-white">Semaine du 16 novembre</p>
            </div>
            <span className="rounded-[3px] border border-white/15 px-2 py-0.5 text-xs font-medium text-[#c6d8e0]">Bassin 25 m</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
            {DAYS.map((d, i) => (
              <div key={d} className={cn((i === 0 || i === 4) && 'max-sm:hidden')}>
                <p className={cn('mb-1.5 text-center text-xs font-semibold', i === 2 ? 'text-[#7adcf2]' : 'text-[#a3bccb]')}>{d}</p>
                <div className="relative h-[150px] rounded-[3px] bg-white/[0.04] sm:h-[170px]">
                  {SESSIONS.filter((s) => s.d === i).map((s) => {
                    const event = s.key === 'event'
                    const absent = event && (phase === 1 || phase === 2)
                    const replaced = event && phase === 3
                    return (
                      <div
                        key={s.g + s.top}
                        className={cn(
                          'absolute inset-x-1 overflow-hidden rounded-[3px] border-l-[3px] px-1.5 py-1 transition-colors duration-500',
                          absent ? 'bg-[#f0563f]/30' : replaced ? 'bg-[#2bb980]/30' : 'bg-white/[0.13]',
                        )}
                        style={{ top: `${s.top}%`, height: `${s.h}%`, borderLeftColor: absent ? '#f0563f' : replaced ? '#2bb980' : s.c }}
                      >
                        <p className="truncate text-xs font-semibold leading-tight text-white">{s.g}</p>
                        <p className="truncate text-xs leading-tight text-[#e0ecf1] num">{s.t}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Absence signalée */}
        <div
          className={cn(
            'absolute -top-1 left-2 flex items-center gap-2 rounded-[4px] bg-white px-3 py-2 text-sm font-semibold text-[#9b2a1b] shadow-[0_12px_30px_-10px_rgb(0_0_0/0.55)] transition-all duration-500 sm:left-6',
            phase >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
            // Sur téléphone, la confirmation « Remplacé » est masquée : on ne finit pas sur la puce rouge.
            phase === 3 && 'max-sm:opacity-0',
          )}
        >
          <span className="flex size-6 items-center justify-center rounded-[3px] bg-[#fbe5e1]"><UserX className="size-3.5" /></span>
          Léa B. absente, mer. 17 h
        </div>

        {/* Proposition de remplacement (carte blanche en relief) */}
        <div
          className={cn(
            'absolute bottom-0 right-0 w-[min(330px,86%)] rounded-[4px] bg-white p-4 text-[#0c2a3e] shadow-[0_2px_4px_rgb(0_0_0/0.15),0_24px_48px_-16px_rgb(0_0_0/0.6),inset_0_1px_0_#fff] transition-all duration-700 sm:-right-6 sm:p-5',
            phase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
          )}
          style={{ transitionTimingFunction: 'var(--ease-out)' }}
        >
          <p className="text-xs font-semibold text-[#4d6878]">Proposition de remplacement</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#0b6f95] text-sm font-bold text-white">IM</span>
            <div className="min-w-0">
              <p className="text-base font-semibold leading-tight">Inès M. se propose</p>
              <p className="text-sm text-[#4d6878]">Jeunes, mer. 17 h – 18 h 30</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5 text-xs font-semibold">
            <span className="inline-flex items-center gap-1 rounded-[3px] bg-[#ddf2e8] px-2 py-0.5 text-[#157350]"><Check className="size-3" strokeWidth={3} />BPJEPS AAN</span>
            <span className="inline-flex items-center gap-1 rounded-[3px] bg-[#ddf2e8] px-2 py-0.5 text-[#157350]"><Check className="size-3" strokeWidth={3} />Libre à cette heure</span>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <span className={cn('inline-flex h-9 items-center rounded-[2px] px-4 text-sm font-semibold text-white shadow-[inset_0_-2px_0_rgb(0_0_0/0.18)] transition-colors duration-300', phase === 3 ? 'bg-[#157350]' : 'bg-[#0b6f95]')}>
              {phase === 3 ? 'Validé' : 'Valider'}
            </span>
            <span className="text-sm font-semibold underline decoration-[#3cc4e4] decoration-2 underline-offset-[5px]">Voir le profil</span>
          </div>
        </div>

        {/* Confirmation */}
        <div
          className={cn(
            'absolute bottom-6 left-0 flex items-center gap-2.5 rounded-[4px] bg-white px-3.5 py-2.5 text-[#0c2a3e] shadow-[0_16px_36px_-12px_rgb(0_0_0/0.6)] transition-all duration-500 max-sm:hidden sm:bottom-10',
            phase === 3 ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-95 opacity-0',
          )}
          style={{ transitionTimingFunction: 'var(--ease-spring)' }}
        >
          <span className="flex size-7 items-center justify-center rounded-[3px] bg-[#1e9b6b] text-white"><Check className="size-4" strokeWidth={3} /></span>
          <span>
            <span className="block text-sm font-semibold leading-tight">Remplacé</span>
            <span className="block text-xs text-[#4d6878]">Inès M. remplace Léa B.</span>
          </span>
        </div>
      </div>

      {!still && (
        <button
          type="button"
          onClick={() => run(200)}
          disabled={phase !== 3}
          className="absolute -bottom-7 right-0 inline-flex items-center gap-1.5 text-sm font-medium text-[#a3bccb] transition-opacity duration-300 hover:text-white disabled:opacity-0"
        >
          <RotateCcw aria-hidden className="size-3.5" />Rejouer
        </button>
      )}
    </div>
  )
}
