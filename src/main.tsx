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

if (import.meta.env.PROD && 'serviceWorker' in navigator && import.meta.env.VITE_HASH_ROUTER !== '1') {
  window.addEventListener('load', () => {
    const base = import.meta.env.BASE_URL
    navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch(() => { /* hors ligne non disponible */ })
  })
}
