// Service worker minimal : met en cache le shell de l'application pour un
// démarrage instantané et un fonctionnement hors ligne de base.
// La version du build arrive dans l'URL d'enregistrement (sw.js?v=…, voir main.tsx) : chaque déploiement
// installe un nouveau worker avec son propre cache, et l'activation supprime ceux des versions précédentes.
const VERSION = new URL(self.location.href).searchParams.get('v') || 'dev'
const CACHE = `swimhub-${VERSION}`
// Chemins relatifs au dossier du service worker (fonctionne à la racine comme sous /Eliott/).
const SHELL = ['./', './index.html', './favicon.svg', './manifest.json'].map((p) => new URL(p, self.registration.scope).href)
const INDEX = new URL('./index.html', self.registration.scope).href

const isHTML = (res) => (res.headers.get('content-type') || '').includes('text/html')

self.addEventListener('install', (event) => {
  // `reload` : contourne le cache HTTP pour précharger la version qui vient d'être déployée.
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((url) => new Request(url, { cache: 'reload' })))).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('swimhub-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return
  // Navigation : réseau d'abord, repli sur le shell (permet les liens profonds hors ligne).
  // Chaque page reçue en ligne remplace le shell en cache : le repli hors ligne pointe vers le dernier build utilisé.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then((res) => {
        if (res.ok && isHTML(res)) { const copy = res.clone(); event.waitUntil(caches.open(CACHE).then((c) => c.put(INDEX, copy))) }
        return res
      }).catch(() => caches.match(INDEX)),
    )
    return
  }
  // Assets : cache d'abord, puis réseau (les fichiers Vite sont versionnés par hash).
  // Un fichier disparu après un déploiement peut revenir sous forme d'index.html (réécriture SPA, statut 200) :
  // on ne le met jamais en cache sous l'URL d'un asset.
  event.respondWith(
    caches.match(request).then((hit) => hit || fetch(request).then((res) => {
      if (res.ok && !isHTML(res)) { const copy = res.clone(); event.waitUntil(caches.open(CACHE).then((c) => c.put(request, copy))) }
      return res
    })),
  )
})
