// Vérification anti-robot Cloudflare Turnstile (gratuite) pour la connexion, l'inscription
// et le mot de passe oublié. Active seulement si VITE_TURNSTILE_SITE_KEY est défini au build ;
// le jeton est ensuite vérifié par Supabase (Authentication → Attack Protection → CAPTCHA).
import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from '../lib/i18n'

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined
export const captchaEnabled = !!SITE_KEY

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  reset: (id: string) => void
  remove: (id: string) => void
}
declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

let loading: Promise<TurnstileApi> | null = null
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    s.async = true
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile')))
    s.onerror = () => {
      loading = null
      reject(new Error('turnstile'))
    }
    document.head.appendChild(s)
  })
  return loading
}

/** Widget + jeton. `reset()` après chaque tentative : un jeton ne sert qu'une fois. */
export function useCaptcha() {
  const { lang } = useI18n()
  const box = useRef<HTMLDivElement>(null)
  const id = useRef<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!SITE_KEY || !box.current) return
    let cancelled = false
    loadTurnstile()
      .then((t) => {
        if (cancelled || !box.current) return
        id.current = t.render(box.current, {
          sitekey: SITE_KEY,
          language: lang,
          theme: 'auto',
          size: 'flexible',
          callback: (v: string) => setToken(v),
          'expired-callback': () => setToken(null),
          'error-callback': () => setToken(null),
        })
      })
      .catch(() => setFailed(true))
    return () => {
      cancelled = true
      if (id.current) window.turnstile?.remove(id.current)
      id.current = null
    }
  }, [lang])

  const reset = useCallback(() => {
    setToken(null)
    if (id.current) window.turnstile?.reset(id.current)
  }, [])

  const widget = SITE_KEY ? (
    <div>
      <div ref={box} className="min-h-[65px]" />
      {failed && <p className="mt-1 text-xs text-bad">{lang === 'en' ? 'Anti-bot check unavailable: reload the page.' : 'Vérification anti-robot indisponible : recharger la page.'}</p>}
    </div>
  ) : null

  return { widget, token, reset, ready: !SITE_KEY || !!token }
}
