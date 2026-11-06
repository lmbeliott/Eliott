// Kit d'interface Kodo — voir DESIGN.md §5.
import { forwardRef, useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type KeyboardEvent, type ReactNode, type SelectHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { Check, Copy, LoaderCircle } from 'lucide-react'
import { DIFFICULTY_LABEL, difficultyRank, type Difficulty } from '../lib/content'
import { useI18n } from '../lib/i18n'

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

// ------------------------------------------------------------------ Boutons

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-ink hover:bg-accent-hover',
  secondary: 'bg-surface text-ink shadow-[inset_0_0_0_1px_var(--line-strong)] hover:bg-surface-2',
  ghost: 'text-ink-2 hover:bg-surface-2 hover:text-ink',
  danger: 'bg-surface text-bad shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--bad)_45%,transparent)] hover:bg-bad-soft',
}
const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-9 px-3.5 text-sm gap-2',
  lg: 'h-11 px-5 text-base gap-2',
}
export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', extra?: string) =>
  cx(
    'inline-flex items-center justify-center rounded-md font-medium whitespace-nowrap select-none transition-[background-color,color,box-shadow] duration-150 ease-out disabled:opacity-50 disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    extra,
  )

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={buttonClass(variant, size, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
})

export function LinkButton({ variant = 'primary', size = 'md', className, ...rest }: LinkProps & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...rest} />
}

export function IconButton({ label, children, className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx('inline-flex size-8 items-center justify-center rounded-md text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink', className)}
      {...rest}
    >
      {children}
    </button>
  )
}

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return <kbd className={cx('inline-flex h-5 min-w-5 items-center justify-center rounded-[4px] px-1 font-mono text-xs text-muted shadow-[inset_0_0_0_1px_var(--line-strong)]', className)}>{children}</kbd>
}

// ------------------------------------------------------------------ Surfaces

/** Panneau L1 : filet, rayon 8. Pour un tableau, une liste, un éditeur — pas pour décorer. */
export function Panel({ children, className, as: As = 'div', ...rest }: { children: ReactNode; className?: string; as?: 'div' | 'section' | 'article' | 'aside' } & Record<string, unknown>) {
  return (
    <As className={cx('rounded-lg bg-surface shadow-[inset_0_0_0_1px_var(--line),var(--edge)]', className)} {...rest}>
      {children}
    </As>
  )
}

export function PanelHeader({ title, action, id }: { title: ReactNode; action?: ReactNode; id?: string }) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-4 border-b border-line px-4 py-2">
      <h2 id={id} className="text-sm font-medium tracking-normal">
        {title}
      </h2>
      {action && <div className="flex items-center gap-2 text-sm">{action}</div>}
    </div>
  )
}

/** Une donnée : libellé méta + valeur. */
export function Stat({ label, value, detail, className }: { label: ReactNode; value: ReactNode; detail?: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 text-xl font-semibold leading-none tracking-tight">{value}</dd>
      {detail && <dd className="mt-1.5 text-sm text-ink-2">{detail}</dd>}
    </div>
  )
}

// ------------------------------------------------------------------ Difficulté

/** Jauge de difficulté : quatre barres et le mot, jamais la couleur seule. */
export function DifficultyMark({ difficulty, label = true, className }: { difficulty: Difficulty; label?: boolean; className?: string }) {
  const { lang, t } = useI18n()
  const rank = difficultyRank(difficulty)
  const word = DIFFICULTY_LABEL[difficulty][lang]
  return (
    <span className={cx('inline-flex items-center gap-1.5 text-sm text-ink-2', className)} title={label ? undefined : word}>
      <span className="inline-flex items-end gap-[2px]" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={cx('w-[3px] rounded-[1px]', i <= rank ? 'bg-ink-2' : 'bg-surface-3')} style={{ height: 3 + i * 2.5 }} />
        ))}
      </span>
      {label ? <span>{word}</span> : <span className="sr-only">{`${t('Difficulté', 'Difficulty')} : ${word}`}</span>}
    </span>
  )
}

// ------------------------------------------------------------------ Formulaires

export function Field({ label, hint, error, children, htmlFor }: { label: string; hint?: ReactNode; error?: string | null; children: ReactNode; htmlFor: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-sm text-bad" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export const inputClass =
  'h-9 w-full rounded-md bg-surface px-3 text-[0.9375rem] text-ink shadow-[inset_0_0_0_1px_var(--field-line)] placeholder:text-muted transition-shadow focus:outline-none focus:shadow-[inset_0_0_0_1px_var(--accent),0_0_0_3px_color-mix(in_oklab,var(--accent)_22%,transparent)] aria-[invalid=true]:shadow-[inset_0_0_0_1px_var(--bad)]'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...rest }, ref) {
  return <input ref={ref} className={cx(inputClass, className)} {...rest} />
})

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cx(inputClass, 'appearance-none bg-[length:16px] bg-[right_8px_center] bg-no-repeat pr-8', className)} style={{ backgroundImage: 'var(--chevron)' }} {...rest}>
      {children}
    </select>
  )
}

// ------------------------------------------------------------------ Choix

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  size = 'md',
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: ReactNode }[]
  label: string
  size?: 'sm' | 'md'
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const j = (i + d + options.length) % options.length
    onChange(options[j].value)
    refs.current[j]?.focus()
  }
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-md bg-surface-2 p-0.5 shadow-[inset_0_0_0_1px_var(--line)]">
      {options.map((o, i) => (
        <button
          key={o.value}
          ref={(el) => {
            refs.current[i] = el
          }}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          tabIndex={value === o.value ? 0 : -1}
          onClick={() => onChange(o.value)}
          onKeyDown={(e) => onKey(e, i)}
          className={cx(
            'rounded-[5px] font-medium transition-colors',
            size === 'sm' ? 'h-7 px-2.5 text-xs' : 'h-8 px-3 text-sm',
            value === o.value ? 'bg-surface text-ink shadow-[0_1px_2px_rgb(0_0_0/0.06),inset_0_0_0_1px_var(--line)]' : 'text-muted hover:text-ink',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

/** Onglets accessibles : flèches gauche/droite, Début/Fin. */
export function Tabs<T extends string>({
  value,
  onChange,
  tabs,
  label,
  idPrefix,
  className,
}: {
  value: T
  onChange: (v: T) => void
  tabs: { id: T; label: ReactNode }[]
  label: string
  idPrefix: string
  className?: string
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent, i: number) => {
    let j = -1
    if (e.key === 'ArrowRight') j = (i + 1) % tabs.length
    if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length
    if (e.key === 'Home') j = 0
    if (e.key === 'End') j = tabs.length - 1
    if (j < 0) return
    e.preventDefault()
    onChange(tabs[j].id)
    refs.current[j]?.focus()
  }
  return (
    <div role="tablist" aria-label={label} className={cx('flex gap-1', className)}>
      {tabs.map((tb, i) => (
        <button
          key={tb.id}
          ref={(el) => {
            refs.current[i] = el
          }}
          id={`${idPrefix}-tab-${tb.id}`}
          role="tab"
          type="button"
          aria-selected={value === tb.id}
          aria-controls={`${idPrefix}-panel`}
          tabIndex={value === tb.id ? 0 : -1}
          onClick={() => onChange(tb.id)}
          onKeyDown={(e) => onKey(e, i)}
          className={cx(
            'relative -mb-px inline-flex h-10 items-center gap-1.5 px-2.5 text-sm font-medium transition-colors',
            value === tb.id ? 'text-ink after:absolute after:inset-x-2.5 after:bottom-0 after:h-0.5 after:rounded-full after:bg-accent' : 'text-muted hover:text-ink',
          )}
        >
          {tb.label}
        </button>
      ))}
    </div>
  )
}

// ------------------------------------------------------------------ Divers

export function Spinner({ label, className }: { label?: string; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-2 text-sm text-muted', className)} role="status">
      <LoaderCircle className="size-4 animate-spin" aria-hidden />
      {label}
    </span>
  )
}

/** Squelette : bloc aux dimensions du contenu attendu. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cx('animate-pulse rounded-md bg-surface-2', className)} aria-hidden />
}

/** N'affiche le squelette qu'après 300 ms, pour éviter le clignotement. */
export function useDelayed(active: boolean, ms = 300) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (!active) {
      setShow(false)
      return
    }
    const t = setTimeout(() => setShow(true), ms)
    return () => clearTimeout(t)
  }, [active, ms])
  return show
}

export function CopyButton({ text, label }: { text: string; label: string }) {
  const { t } = useI18n()
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setDone(true)
          setTimeout(() => setDone(false), 1500)
        })
      }}
      className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-muted transition-colors hover:bg-surface-2 hover:text-ink"
      aria-label={done ? t('Copié', 'Copied') : label}
      title={label}
    >
      {done ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      {done ? t('Copié', 'Copied') : t('Copier', 'Copy')}
    </button>
  )
}

export function Avatar({ name, size = 32, me }: { name: string; size?: number; me?: boolean }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
  // Teinte stable dérivée du nom, dans une gamme froide et peu saturée.
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360
  const hue = 220 + (h % 70)
  return (
    <span
      aria-hidden
      className={cx('inline-flex shrink-0 items-center justify-center rounded-full font-medium', me && 'ring-2 ring-accent ring-offset-2 ring-offset-surface')}
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.38), background: `oklch(0.93 0.025 ${hue})`, color: `oklch(0.38 0.06 ${hue})` }}
    >
      {initials || '?'}
    </span>
  )
}

/** En-tête de page : titre, une phrase factuelle, actions. Filet dessous. */
export function PageHeader({ title, lead, actions, meta }: { title: ReactNode; lead?: ReactNode; actions?: ReactNode; meta?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {meta && <div className="mb-2 text-sm text-muted">{meta}</div>}
        <h1 className="display text-2xl leading-tight">{title}</h1>
        {lead && <p className="mt-2 text-ink-2">{lead}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  )
}

export function useAutoId(prefix: string) {
  return `${prefix}-${useId().replace(/:/g, '')}`
}

export function Notice({ tone = 'info', children, action }: { tone?: 'info' | 'warn' | 'error' | 'ok'; children: ReactNode; action?: ReactNode }) {
  const tones = {
    info: 'bg-surface-2 text-ink shadow-[inset_0_0_0_1px_var(--line)]',
    warn: 'bg-warn-soft text-ink shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--warn)_35%,transparent)]',
    error: 'bg-bad-soft text-ink shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--bad)_35%,transparent)]',
    ok: 'bg-ok-soft text-ink shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ok)_35%,transparent)]',
  }
  return (
    <div className={cx('flex flex-col gap-3 rounded-lg px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between', tones[tone])} role={tone === 'error' ? 'alert' : undefined}>
      <div>{children}</div>
      {action}
    </div>
  )
}
