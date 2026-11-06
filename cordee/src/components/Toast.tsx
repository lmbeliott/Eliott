import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cx } from './ui'

interface Toast {
  id: number
  text: ReactNode
  tone: 'info' | 'ok' | 'error'
}
const Ctx = createContext<(text: ReactNode, tone?: Toast['tone']) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = useCallback((text: ReactNode, tone: Toast['tone'] = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t.slice(-2), { id, text, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), tone === 'error' ? 8000 : 5000)
  }, [])
  return (
    <Ctx.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cx(
              'anim-rise pointer-events-auto flex max-w-md items-start gap-3 rounded-lg border bg-surface px-4 py-3 text-sm shadow-e3',
              t.tone === 'error' ? 'border-rouge/50' : t.tone === 'ok' ? 'border-verte/50' : 'border-line-strong',
            )}
            role={t.tone === 'error' ? 'alert' : 'status'}
          >
            <div className="flex-1">{t.text}</div>
            <button type="button" onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))} className="text-muted hover:text-ink" aria-label="Fermer">
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)
