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

if (import.meta.env.PROD && 'serviceWorker' in navigator && import.meta.env.BASE_URL === '/') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => { /* hors ligne non disponible */ })
  })
}
