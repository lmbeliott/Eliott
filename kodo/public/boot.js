// Exécuté avant le premier rendu, dans un fichier séparé (la CSP interdit les scripts en ligne).
// Liens profonds sur GitHub Pages : le 404.html du site renvoie ici avec ?chemin=…
// Thème : appliqué tout de suite pour éviter un flash clair/sombre.
;(function () {
  var q = new URLSearchParams(location.search)
  var p = q.get('chemin')
  if (p) history.replaceState(null, '', p)
  try {
    var t = localStorage.getItem('kodo:theme')
    if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t
  } catch (e) {}
})()
