import { forwardRef, useEffect, useId, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { Check, Copy, LoaderCircle } from 'lucide-react'
import { DIFFICULTY_LABEL, difficultyRank, type Difficulty } from '../lib/content'
import { useI18n } from '../lib/i18n'

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

// ------------------------------------------------------------------ Boutons

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-ink hover:bg-accent-hover shadow-e1',
  secondary: 'bg-surface text-ink border border-line-strong hover:border-ink-2 hover:bg-surface-2',
  ghost: 'text-ink-2 hover:text-ink hover:bg-surface-2',
  danger: 'bg-surface text-bad border border-bad/50 hover:bg-bad-soft',
}
const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-5 text-base gap-2',
}
export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', extra?: string) =>
  cx(
    'inline-flex items-center justify-center rounded-md font-medium whitespace-nowrap select-none transition-[background-color,border-color,color,filter] duration-150 disabled:opacity-50 disabled:pointer-events-none',
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
  { variant = 'primary', size = 'md', loading, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button ref={ref} className={buttonClass(variant, size, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
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
      className={cx('inline-flex size-9 items-center justify-center rounded-md text-ink-2 hover:bg-surface-2 hover:text-ink transition-colors', className)}
      {...rest}
    >
      {children}
    </button>
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
          <span key={i} className={cx('w-[3px] rounded-[1px]', i <= rank ? 'bg-ink-2' : 'bg-line-strong')} style={{ height: 4 + i * 2.5 }} />
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
  'h-10 w-full rounded-md border border-field bg-surface px-3 text-base text-ink placeholder:text-muted/70 transition-[border-color,box-shadow] focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/25 aria-[invalid=true]:border-bad'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...rest }, ref) {
  return <input ref={ref} className={cx(inputClass, className)} {...rest} />
})

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cx(inputClass, 'appearance-none bg-[length:16px] bg-[right_10px_center] bg-no-repeat pr-9', className)} style={{ backgroundImage: 'var(--chevron)' }} {...rest}>
      {children}
    </select>
  )
}

// ------------------------------------------------------------------ Segmented control

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
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-md border border-line bg-surface-2 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cx(
            'rounded-[5px] font-medium transition-colors',
            size === 'sm' ? 'h-7 px-2.5 text-xs' : 'h-8 px-3 text-sm',
            value === o.value ? 'bg-surface text-ink shadow-e1' : 'text-muted hover:text-ink',
          )}
        >
          {o.label}
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

/** Squelette : bloc gris aux dimensions du contenu attendu. */
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
      className="inline-flex h-7 items-center gap-1.5 rounded px-2 text-xs text-muted hover:bg-surface-2 hover:text-ink"
      aria-label={done ? t('Copié', 'Copied') : label}
      title={label}
    >
      {done ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      {done ? t('Copié', 'Copied') : t('Copier', 'Copy')}
    </button>
  )
}

export function Avatar({ name, size = 36, me }: { name: string; size?: number; me?: boolean }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
  // Teinte stable dérivée du nom, dans la gamme froide du site.
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360
  const hue = 220 + (h % 70)
  return (
    <span
      aria-hidden
      className={cx('inline-flex shrink-0 items-center justify-center rounded-full font-semibold', me && 'ring-2 ring-accent ring-offset-2 ring-offset-surface')}
      style={{ width: size, height: size, fontSize: size * 0.38, background: `oklch(0.92 0.03 ${hue})`, color: `oklch(0.35 0.07 ${hue})` }}
    >
      {initials || '?'}
    </span>
  )
}

export function PageHeader({ title, lead, actions }: { title: ReactNode; lead?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
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
    info: 'border-line bg-surface-2 text-ink',
    warn: 'border-warn/40 bg-warn-soft text-ink',
    error: 'border-bad/40 bg-bad-soft text-ink',
    ok: 'border-ok/40 bg-ok-soft text-ink',
  }
  return (
    <div className={cx('flex flex-col gap-3 rounded-lg border px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between', tones[tone])} role={tone === 'error' ? 'alert' : undefined}>
      <div>{children}</div>
      {action}
    </div>
  )
}
