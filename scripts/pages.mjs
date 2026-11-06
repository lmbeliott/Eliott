// Prépare dist/ pour GitHub Pages :
// - 404.html = index.html, pour que les liens profonds (/Eliott/app/planning) chargent l'app ;
// - .nojekyll, pour servir les fichiers tels quels.
import { copyFileSync, writeFileSync } from 'node:fs'

copyFileSync('dist/index.html', 'dist/404.html')
writeFileSync('dist/.nojekyll', '')
console.log('dist/ prêt pour GitHub Pages')
