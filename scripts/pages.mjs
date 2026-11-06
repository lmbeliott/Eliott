// Prépare dist/ pour GitHub Pages :
// - 404.html = index.html, pour que les liens profonds (/Eliott/app/planning) chargent l'app ;
//   un petit script en tête renvoie les liens profonds de Kodo (/Eliott/kodo/…) vers Kodo ;
// - .nojekyll, pour servir les fichiers tels quels ;
// - si kodo/dist existe, Kodo est publié dans dist/kodo/.
import { cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs'

const kodoRedirect = `<script>
  // Lien profond vers Kodo (servi par ce 404) : on recharge Kodo en lui passant le chemin.
  (function () {
    var base = '/Eliott/kodo/'
    if (location.pathname.indexOf(base) === 0 && location.pathname !== base) {
      location.replace(base + '?chemin=' + encodeURIComponent(location.pathname + location.search + location.hash))
    }
  })()
</script>`

const index = readFileSync('dist/index.html', 'utf8')
writeFileSync('dist/404.html', index.replace('<head>', `<head>\n${kodoRedirect}`))
writeFileSync('dist/.nojekyll', '')
if (existsSync('kodo/dist/index.html')) {
  cpSync('kodo/dist', 'dist/kodo', { recursive: true })
  console.log('Kodo copié dans dist/kodo')
}
console.log('dist/ prêt pour GitHub Pages')
