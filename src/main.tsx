import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { initStore } from './data/store'
import { applyTheme } from './lib/theme'
import App from './App'

applyTheme()
window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => applyTheme())

initStore().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})

/**
 * Identifiant du build : noms hachés du bundle et de la feuille de style chargés par index.html.
 * Passé au service worker (sw.js?v=…), il change à chaque déploiement : le navigateur installe alors
 * le nouveau worker, qui recharge le shell (index.html, manifeste, icônes) et supprime l'ancien cache.
 */
function buildId() {
  const files = [...document.querySelectorAll<HTMLScriptElement | HTMLLinkElement>('script[type="module"][src], link[rel="stylesheet"][href]')]
    .map((el) => (el instanceof HTMLScriptElement ? el.src : el.href).split('/').pop() ?? '')
    .join('|')
  let h = 0
  for (let i = 0; i < files.length; i++) h = (Math.imul(h, 31) + files.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

if (import.meta.env.PROD && 'serviceWorker' in navigator && import.meta.env.VITE_HASH_ROUTER !== '1') {
  window.addEventListener('load', () => {
    const base = import.meta.env.BASE_URL
    navigator.serviceWorker.register(`${base}sw.js?v=${buildId()}`, { scope: base }).catch(() => { /* hors ligne non disponible */ })
  })
}
