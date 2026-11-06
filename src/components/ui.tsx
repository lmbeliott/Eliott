import { createContext, forwardRef, useContext, useEffect, useId, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation, type LinkProps } from 'react-router-dom'
import { X, type LucideIcon } from 'lucide-react'
import { cn, hueFrom } from '../lib/util'

// ---------------------------------------------------------------- boutons

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'water'
type Size = 'sm' | 'md' | 'lg'

// Boutons « carrés » : action principale pleine à angles vifs, action secondaire en lien souligné.
const base = 'inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap rounded-[2px] transition duration-150 ease-out active:translate-y-px disabled:opacity-50 disabled:pointer-events-none select-none'
const variants: Record<Variant, string> = {
  primary: 'bg-btn text-btn-ink hover:bg-btn-hover shadow-[inset_0_-2px_0_rgb(0_0_0/0.18)]',
  water: 'bg-btn text-btn-ink hover:bg-btn-hover shadow-[inset_0_-2px_0_rgb(0_0_0/0.18)]',
  secondary: 'link-action px-1.5 bg-transparent',
  ghost: 'px-3 text-ink-2 hover:bg-surface-2 hover:text-ink',
  danger: 'bg-rope text-white hover:brightness-110 shadow-[inset_0_-2px_0_rgb(0_0_0/0.2)] dark:text-[#2a0d08]',
}
const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[14px]',
  md: 'h-10 px-4 text-[15px]',
  lg: 'h-12 px-6 text-[16.5px]',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: LucideIcon
  full?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', icon: Icon, full, className, children, type = 'button', ...rest }, ref,
) {
  return (
    <button ref={ref} type={type} className={cn(base, sizes[size], variants[variant], full && 'w-full', className)} {...rest}>
      {Icon && <Icon aria-hidden className={size === 'sm' ? 'size-3.5' : 'size-4'} strokeWidth={2.25} />}
      {children}
    </button>
  )
})

export function ButtonLink({ variant = 'primary', size = 'md', icon: Icon, className, children, full, ...rest }: LinkProps & { variant?: Variant; size?: Size; icon?: LucideIcon; full?: boolean }) {
  return (
    <Link className={cn(base, sizes[size], variants[variant], full && 'w-full', className)} {...rest}>
      {Icon && <Icon aria-hidden className={size === 'sm' ? 'size-3.5' : 'size-4'} strokeWidth={2.25} />}
      {children}
    </Link>
  )
}

export function IconButton({ label, icon: Icon, className, size = 'md', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; icon: LucideIcon; size?: 'sm' | 'md' }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn('inline-flex items-center justify-center rounded-[3px] text-ink-2 hover:bg-surface-2 hover:text-ink transition duration-150 active:translate-y-px', size === 'sm' ? 'size-8' : 'size-10', className)}
      {...rest}
    >
      <Icon aria-hidden className="size-[18px]" strokeWidth={2} />
    </button>
  )
}

// ---------------------------------------------------------------- formulaires

const control = 'w-full rounded-[3px] border border-field-line bg-surface px-3 text-[15px] text-ink placeholder:text-muted transition-colors hover:border-ink-2/80 focus:border-water-bright focus:outline-none focus:ring-3 focus:ring-water-bright/20 disabled:bg-surface-2 disabled:text-muted aria-[invalid=true]:border-rope'

/** Relie l'aide ou l'erreur d'un `Field` à son contrôle (`aria-describedby`), sans rien changer chez l'appelant. */
const FieldDesc = createContext<{ forId?: string; descId?: string }>({})

/** `aria-describedby` du contrôle : celui passé explicitement, sinon l'aide/erreur du `Field` qui le cible (même id). */
function useDescribedBy(id: string | undefined, explicit: string | undefined) {
  const { forId, descId } = useContext(FieldDesc)
  return explicit ?? (id && id === forId ? descId : undefined)
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...rest }, ref) {
  const describedBy = useDescribedBy(rest.id, rest['aria-describedby'])
  return <input ref={ref} className={cn(control, 'h-11', className)} {...rest} aria-describedby={describedBy} />
})

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select({ className, children, ...rest }, ref) {
  const describedBy = useDescribedBy(rest.id, rest['aria-describedby'])
  return (
    <select ref={ref} className={cn(control, 'h-11 pr-9 appearance-none bg-[length:16px] bg-[right_10px_center] bg-no-repeat', className)}
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234d6878' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}
      {...rest}
      aria-describedby={describedBy}
    >
      {children}
    </select>
  )
})

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...rest }, ref) {
  const describedBy = useDescribedBy(rest.id, rest['aria-describedby'])
  return <textarea ref={ref} className={cn(control, 'py-2.5 min-h-24 leading-relaxed', className)} {...rest} aria-describedby={describedBy} />
})

export function Field({ label, hint, error, optional, children, className, htmlFor }: {
  label: ReactNode; hint?: ReactNode; error?: string | null; optional?: boolean; children: ReactNode; className?: string; htmlFor?: string
}) {
  const descId = htmlFor && (error || hint) ? `${htmlFor}-desc` : undefined
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
        {label}
        {optional && <span className="ml-1.5 font-normal text-muted">(facultatif)</span>}
      </label>
      <FieldDesc.Provider value={{ forId: htmlFor, descId }}>{children}</FieldDesc.Provider>
      {error ? <p id={descId} role="alert" className="text-[13px] text-rope">{error}</p> : hint ? <p id={descId} className="text-[13px] text-muted">{hint}</p> : null}
    </div>
  )
}

export function Checkbox({ label, hint, className, ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; hint?: ReactNode }) {
  const id = useId()
  return (
    <label htmlFor={id} className={cn('flex items-start gap-3 cursor-pointer', className)}>
      <input id={id} type="checkbox" className="mt-0.5 size-[18px] shrink-0 rounded accent-[var(--water)] cursor-pointer" {...rest} />
      <span className="text-sm leading-snug">
        <span className="font-medium text-ink">{label}</span>
        {hint && <span className="block text-[13px] text-muted mt-0.5">{hint}</span>}
      </span>
    </label>
  )
}

export function FormError({ children }: { children?: ReactNode }) {
  if (!children) return null
  return <div role="alert" className="rounded-md border border-rope/30 bg-rope-soft px-3.5 py-2.5 text-sm text-rope">{children}</div>
}

// ---------------------------------------------------------------- affichage

export type Tone = 'neutral' | 'water' | 'rope' | 'buoy' | 'kelp'
const tones: Record<Tone, string> = {
  neutral: 'bg-surface-2 text-ink-2',
  water: 'bg-water-soft text-water',
  rope: 'bg-rope-soft text-rope',
  buoy: 'bg-buoy-soft text-buoy',
  kelp: 'bg-kelp-soft text-kelp',
}

export function Badge({ tone = 'neutral', children, className, dot }: { tone?: Tone; children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-[3px] px-2 h-6 text-[13px] font-semibold whitespace-nowrap', tones[tone], className)}>
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

export function Avatar({ name, size = 32, className }: { name: string; size?: number; className?: string }) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')
  const h = hueFrom(name)
  return (
    <span
      aria-hidden
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white', className)}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38), background: `oklch(0.52 0.11 ${h})` }}
    >
      {initials}
    </span>
  )
}

export function Panel({ title, description, actions, children, className, bodyClassName, id }: {
  title?: ReactNode; description?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string; bodyClassName?: string; id?: string
}) {
  return (
    <section id={id} className={cn('elev-2 rounded-xl border border-line/70 bg-surface', className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-3 px-5 pt-4 pb-3 sm:px-6">
          <div className="min-w-0">
            {title && <h2 className="text-[17px] font-bold text-ink">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cn(title || actions ? 'px-5 pb-5 sm:px-6' : 'p-5 sm:p-6', bodyClassName)}>{children}</div>
    </section>
  )
}

const APP_NAME = 'SwimHub Connect'
const DEFAULT_TITLE = `${APP_NAME} — plannings et remplacements pour clubs de natation`

/** Titre de l'onglet (« Planning · SwimHub Connect ») ; sans titre, celui de l'accueil. */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${APP_NAME}` : DEFAULT_TITLE
  }, [title])
}

export function PageHeader({ title, description, actions, children }: { title: ReactNode; description?: ReactNode; actions?: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="display-md text-[30px] sm:text-[36px] text-ink">{title}</h1>
          {description && <p className="mt-1.5 max-w-[62ch] text-[15px] text-ink-2">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  )
}

export function EmptyState({ icon: Icon, title, children, action, compact }: { icon?: LucideIcon; title: string; children?: ReactNode; action?: ReactNode; compact?: boolean }) {
  return (
    <div className={cn('flex flex-col items-center text-center', compact ? 'py-8' : 'py-14')}>
      {Icon && (
        <span className="mb-3 inline-flex size-11 items-center justify-center rounded-md bg-water-soft text-water">
          <Icon aria-hidden className="size-5" />
        </span>
      )}
      <p className="font-semibold text-ink">{title}</p>
      {children && <p className="mt-1 max-w-[46ch] text-sm text-muted">{children}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Tabs({ items }: { items: Array<{ to: string; label: string; count?: number; end?: boolean }> }) {
  const list = useRef<HTMLUListElement>(null)
  const { pathname } = useLocation()
  const [bar, setBar] = useState<{ x: number; w: number } | null>(null)
  useLayoutEffect(() => {
    const measure = () => {
      const el = list.current?.querySelector<HTMLElement>('a[aria-current="page"]')
      setBar(el ? { x: el.offsetLeft + 8, w: el.offsetWidth - 16 } : null)
    }
    measure()
    document.fonts?.ready.then(measure).catch(() => {})
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [pathname, items.length])
  return (
    <nav aria-label="Sections" className="-mx-4 mb-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul ref={list} className="relative flex min-w-max gap-1 border-b border-line">
        {items.map((it) => (
          <li key={it.to}>
            <NavLink
              to={it.to}
              end={it.end}
              viewTransition
              className={({ isActive }) => cn('relative flex h-11 items-center gap-2 px-3 text-sm font-semibold transition-colors duration-200', isActive ? 'text-ink' : 'text-muted hover:text-ink')}
            >
              {it.label}
              {!!it.count && <span key={it.count} className="badge-bump rounded-[3px] bg-rope px-1.5 text-[11px] font-bold leading-[18px] text-white dark:text-[#2a0d08]">{it.count}</span>}
            </NavLink>
          </li>
        ))}
        {bar && <span aria-hidden className="slide-indicator -bottom-px left-0 h-[3px] rounded-t bg-water-bright" style={{ transform: `translateX(${bar.x}px)`, width: bar.w }} />}
      </ul>
    </nav>
  )
}

export function Segmented<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: Array<{ value: T; label: string }>; label: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [thumb, setThumb] = useState<{ x: number; w: number } | null>(null)
  useLayoutEffect(() => {
    const measure = () => {
      const el = wrap.current?.querySelector<HTMLElement>('[aria-checked="true"]')
      setThumb(el ? { x: el.offsetLeft, w: el.offsetWidth } : null)
    }
    measure()
    document.fonts?.ready.then(measure).catch(() => {})
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [value, options.length])
  const move = (dir: 1 | -1) => {
    const i = options.findIndex((o) => o.value === value)
    const next = options[(i + dir + options.length) % options.length]
    onChange(next.value)
    requestAnimationFrame(() => wrap.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus())
  }
  return (
    <div ref={wrap} role="radiogroup" aria-label={label} className="relative inline-flex rounded-[3px] border border-line-strong bg-surface p-0.5"
      onKeyDown={(e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); move(1) } if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); move(-1) } }}>
      {thumb && <span aria-hidden className="slide-indicator inset-y-0.5 left-0 rounded-[2px] bg-btn" style={{ transform: `translateX(${thumb.x - 2}px)`, width: thumb.w }} />}
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          tabIndex={value === o.value ? 0 : -1}
          onClick={() => onChange(o.value)}
          className={cn('relative z-[1] h-8 rounded-[2px] px-3 text-[14px] font-semibold transition-colors duration-300', value === o.value ? (thumb ? 'text-btn-ink' : 'bg-btn text-btn-ink') : 'text-ink-2 hover:text-ink')}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('relative -mx-5 overflow-x-auto sm:-mx-6', className)}>
      <table className="w-full min-w-[560px] border-collapse text-sm [&_th]:h-10 [&_th]:px-3 [&_th]:text-left [&_th]:text-[12.5px] [&_th]:font-semibold [&_th]:text-muted [&_th]:border-b [&_th]:border-line [&_th:first-child]:pl-5 sm:[&_th:first-child]:pl-6 [&_th:last-child]:pr-5 sm:[&_th:last-child]:pr-6 [&_td]:px-3 [&_td]:py-3 [&_td]:border-b [&_td]:border-line [&_td]:align-middle [&_td:first-child]:pl-5 sm:[&_td:first-child]:pl-6 [&_td:last-child]:pr-5 sm:[&_td:last-child]:pr-6 [&_tbody_tr:last-child_td]:border-b-0">
        {children}
      </table>
    </div>
  )
}

// ---------------------------------------------------------------- tiroir latéral

const EXIT_MS = 200

export function Drawer({ open, onClose, title, description, children, footer, width = 480 }: {
  open: boolean; onClose: () => void; title: string; description?: ReactNode; children: ReactNode; footer?: ReactNode; width?: number
}) {
  const panel = useRef<HTMLDivElement>(null)
  const restore = useRef<HTMLElement | null>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  const titleId = useId()
  // Garde le dernier contenu affiché pendant l'animation de sortie.
  const shown = useRef({ title, description, children, footer })
  if (open) shown.current = { title, description, children, footer }
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (open) { setMounted(true); setClosing(false); return }
    if (!mounted) return
    setClosing(true)
    const t = setTimeout(() => { setMounted(false); setClosing(false) }, EXIT_MS)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open) return
    restore.current = document.activeElement as HTMLElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => {
      // Premier champ actif (jamais un bouton : une action, parfois destructive, ne doit pas être présélectionnée),
      // sinon le panneau lui-même. `data-autofocus` permet de choisir explicitement.
      const first = panel.current?.querySelector<HTMLElement>('[data-autofocus]')
        ?? panel.current?.querySelector<HTMLElement>('input:not([type=hidden]):not(:disabled), select:not(:disabled), textarea:not(:disabled)')
      ;(first ?? panel.current)?.focus()
    }, 30)
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return
      if (e.key === 'Escape') { e.stopPropagation(); closeRef.current() }
      if (e.key === 'Tab' && panel.current) trapTab(e, panel.current)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
      restore.current?.focus?.()
    }
  }, [open])

  if (!mounted) return null
  const c = shown.current
  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end" inert={closing || undefined}>
      <div
        className={cn('absolute inset-0 bg-[#04121b]/45', closing ? 'animate-[fade-out_200ms_ease-in_both]' : 'animate-[overlay-in_220ms_ease-out]')}
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn('relative flex h-full w-full flex-col bg-surface shadow-float outline-none', closing ? 'animate-[slide-out-right_200ms_var(--ease-in-out)_both]' : 'animate-[slide-in-right_340ms_var(--ease-out)]')}
        style={{ maxWidth: width }}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div>
            <h2 id={titleId} className="text-lg font-bold text-ink">{c.title}</h2>
            {c.description && <p className="mt-0.5 text-sm text-muted">{c.description}</p>}
          </div>
          <IconButton data-close label="Fermer" icon={X} onClick={onClose} className="-mr-2 -mt-1" />
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{c.children}</div>
        {c.footer && <footer className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-3.5 sm:px-6 pb-[max(14px,env(safe-area-inset-bottom))]">{c.footer}</footer>}
      </div>
    </div>,
    document.body,
  )
}

export function trapTab(e: KeyboardEvent, root: HTMLElement) {
  const nodes = [...root.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter((n) => n.offsetParent !== null)
  if (!nodes.length) { e.preventDefault(); root.focus(); return }
  const first = nodes[0]; const last = nodes[nodes.length - 1]
  const active = document.activeElement
  // Focus resté derrière la fenêtre (ou sur le panneau lui-même) : on le ramène dedans.
  if (!active || active === root || !root.contains(active)) { e.preventDefault(); (e.shiftKey ? last : first).focus(); return }
  if (e.shiftKey && active === first) { e.preventDefault(); last.focus() }
  else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus() }
}

/** Point de couleur du niveau (bande de couloir). */
export function LevelDot({ color, className }: { color?: string; className?: string }) {
  return <span aria-hidden className={cn('inline-block size-2.5 shrink-0 rounded-full', className)} style={{ background: color ?? 'var(--line-strong)' }} />
}
