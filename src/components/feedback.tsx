import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { Button, trapTab } from './ui'
import { cn } from '../lib/util'

// ---------------------------------------------------------------- toasts

type ToastTone = 'success' | 'error' | 'info'
interface ToastItem { id: number; text: string; tone: ToastTone; leaving?: boolean }

const ToastCtx = createContext<(text: string, tone?: ToastTone) => void>(() => {})
export const useToast = () => useContext(ToastCtx)

// ---------------------------------------------------------------- confirmation

interface ConfirmOptions {
  title: string
  body?: ReactNode
  confirmLabel: string
  tone?: 'danger' | 'primary'
}
const ConfirmCtx = createContext<(o: ConfirmOptions) => Promise<boolean>>(async () => false)
export const useConfirm = () => useContext(ConfirmCtx)

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [confirm, setConfirm] = useState<(ConfirmOptions & { resolve: (v: boolean) => void }) | null>(null)
  const counter = useRef(0)

  const toast = useCallback((text: string, tone: ToastTone = 'success') => {
    const id = ++counter.current
    const life = tone === 'error' ? 6000 : 3800
    setToasts((t) => [...t.slice(-2), { id, text, tone }])
    setTimeout(() => setToasts((t) => t.map((x) => (x.id === id ? { ...x, leaving: true } : x))), life - 260)
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), life)
  }, [])

  const ask = useCallback((o: ConfirmOptions) => new Promise<boolean>((resolve) => setConfirm({ ...o, resolve })), [])

  return (
    <ToastCtx.Provider value={toast}>
      <ConfirmCtx.Provider value={ask}>
        {children}
        {createPortal(
          <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 pb-[max(16px,env(safe-area-inset-bottom))] sm:items-end">
            {toasts.map((t) => {
              const Icon = t.tone === 'success' ? CheckCircle2 : t.tone === 'error' ? AlertTriangle : Info
              return (
                <div
                  key={t.id}
                  role={t.tone === 'error' ? 'alert' : 'status'}
                  className={cn('pointer-events-auto flex max-w-[420px] items-start gap-2.5 rounded-xl bg-[#0c2a3e] px-4 py-3 text-sm text-white shadow-float dark:bg-[#e6f1f5] dark:text-[#0c2a3e]', t.leaving ? 'animate-[toast-out_260ms_var(--ease-in-out)_both]' : 'animate-[pop_320ms_var(--ease-spring)]')}
                >
                  <Icon aria-hidden className={cn('mt-0.5 size-4 shrink-0', t.tone === 'success' && 'text-[#5fe0a8] dark:text-[#157350]', t.tone === 'error' && 'text-[#ff9a88] dark:text-[#c9361f]', t.tone === 'info' && 'text-[#7fdcf2] dark:text-[#08708f]')} />
                  <span>{t.text}</span>
                </div>
              )
            })}
          </div>,
          document.body,
        )}
        {confirm && (
          <ConfirmDialog
            {...confirm}
            onClose={(v) => { confirm.resolve(v); setConfirm(null) }}
          />
        )}
      </ConfirmCtx.Provider>
    </ToastCtx.Provider>
  )
}

function ConfirmDialog({ title, body, confirmLabel, tone = 'danger', onClose }: ConfirmOptions & { onClose: (v: boolean) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [closing, setClosing] = useState(false)
  const done = useRef(false)
  const finish = useCallback((v: boolean) => {
    if (done.current) return
    done.current = true
    setClosing(true)
    setTimeout(() => onClose(v), 150)
  }, [onClose])
  const finishRef = useRef(finish)
  finishRef.current = finish
  const titleId = useId()
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    ref.current?.querySelector<HTMLElement>('[data-cancel]')?.focus()
    // Phase de capture : le dialogue passe avant un tiroir ouvert en dessous.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finishRef.current(false) }
      if (e.key === 'Tab' && ref.current) { e.stopPropagation(); trapTab(e, ref.current) }
    }
    document.addEventListener('keydown', onKey, true)
    return () => { document.removeEventListener('keydown', onKey, true); prev?.focus?.() }
  }, [])
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center">
      <div aria-hidden className={cn('absolute inset-0 bg-[#04121b]/50', closing ? 'animate-[fade-out_150ms_ease-in_both]' : 'animate-[overlay-in_180ms_ease-out]')} onClick={() => finish(false)} />
      <div ref={ref} role="alertdialog" aria-modal="true" aria-labelledby={titleId} className={cn('relative w-full max-w-[440px] rounded-xl bg-surface p-6 shadow-float', closing ? 'animate-[pop-out_150ms_ease-in_both]' : 'animate-[pop_260ms_var(--ease-spring)]')}>
        <h2 id={titleId} className="text-lg font-bold text-ink">{title}</h2>
        {body && <div className="mt-2 text-[15px] text-ink-2">{body}</div>}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button data-cancel variant="secondary" onClick={() => finish(false)}>Annuler</Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={() => finish(true)}>{confirmLabel}</Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

/** Exécute une action métier : toast de succès ou message d'erreur lisible. */
export function useAction() {
  const toast = useToast()
  return useCallback(async <T,>(fn: () => T | Promise<T>, success?: string): Promise<T | undefined> => {
    try {
      const r = await fn()
      if (success) toast(success)
      return r
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Action impossible pour le moment.', 'error')
      return undefined
    }
  }, [toast])
}
