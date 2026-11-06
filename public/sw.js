// Service worker minimal : met en cache le shell de l'application pour un
// démarrage instantané et un fonctionnement hors ligne de base.
const CACHE = 'swimhub-v2'
const SHELL = ['/', '/index.html', '/favicon.svg', '/manifest.json']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return
  // Navigation : réseau d'abord, repli sur le shell (permet les liens profonds hors ligne).
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/index.html')))
    return
  }
  // Assets : cache d'abord, puis réseau (les fichiers Vite sont versionnés par hash).
  event.respondWith(
    caches.match(request).then((hit) => hit || fetch(request).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(request, copy)) }
      return res
    })),
  )
})
