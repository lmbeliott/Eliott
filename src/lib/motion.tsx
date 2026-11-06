import { createElement, Fragment, useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { cn } from './util'

// Boîte à outils d'animation : tout respecte prefers-reduced-motion et
// le contenu reste visible si IntersectionObserver n'existe pas.

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export function useReducedMotion() {
  const [reduce, setReduce] = useState(prefersReducedMotion)
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mq) return
    const on = () => setReduce(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduce
}

/** Vrai dès que l'élément entre dans la fenêtre (une seule fois par défaut). */
export function useInView<T extends Element>(options: { once?: boolean; rootMargin?: string; threshold?: number } = {}) {
  const { once = true, rootMargin = '0px 0px -12% 0px', threshold = 0.15 } = options
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) { setInView(true); return }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        if (once) io.disconnect()
      } else if (!once) setInView(false)
    }, { rootMargin, threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [once, rootMargin, threshold])
  return [ref, inView] as const
}

/** Apparition douce à l'entrée dans la fenêtre. */
export function Reveal({ as = 'div', children, className, delay = 0, style, ...rest }: {
  as?: ElementType; children?: ReactNode; className?: string; delay?: number; style?: CSSProperties; [k: string]: unknown
}) {
  const [ref, inView] = useInView<HTMLElement>()
  return createElement(as, {
    ref,
    className: cn('reveal', className),
    'data-shown': inView || undefined,
    style: { ...style, '--reveal-delay': `${delay}ms` } as CSSProperties,
    ...rest,
  }, children)
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/** Nombre qui glisse vers sa nouvelle valeur (compteurs, prix). */
export function CountUp({ value, format = (n) => String(Math.round(n)), duration = 650, startOnView = false, className }: {
  value: number; format?: (n: number) => string; duration?: number; startOnView?: boolean; className?: string
}) {
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.4 })
  const [shown, setShown] = useState(startOnView ? 0 : value)
  const from = useRef(startOnView ? 0 : value)
  const raf = useRef(0)

  useEffect(() => {
    if (startOnView && !inView) return
    if (prefersReducedMotion()) { setShown(value); from.current = value; return }
    const start = performance.now()
    const a = from.current
    cancelAnimationFrame(raf.current)
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const v = a + (value - a) * easeOutCubic(t)
      setShown(v)
      if (t < 1) raf.current = requestAnimationFrame(tick)
      else from.current = value
    }
    raf.current = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf.current); from.current = value }
  }, [value, duration, startOnView, inView])

  return (
    <span ref={ref} className={cn('num', className)}>
      <span aria-hidden>{format(shown)}</span>
      <span className="sr-only">{format(value)}</span>
    </span>
  )
}

/** Titre dont les mots montent un à un depuis sous la ligne de flottaison. */
export function RisingWords({ text, className, delay = 0, step = 70 }: { text: string; className?: string; delay?: number; step?: number }) {
  const words = text.split(' ')
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="word-mask">
              <span className="word-rise" style={{ animationDelay: `${delay + i * step}ms` }}>{w}</span>
            </span>
            {i < words.length - 1 && ' '}
          </Fragment>
        ))}
      </span>
    </span>
  )
}
