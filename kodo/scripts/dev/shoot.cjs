// Capture d'écran d'une page de Kodo (développement).
//   node scripts/dev/shoot.cjs --path /parcours --as eleve --vp mobile --scheme dark --lang en --out /tmp/x.png [--full] [--wait 1500]
// --as : guest (défaut), eleve, prof (comptes de test *@kodo.test). Le serveur de dev doit tourner sur :5173.
const { chromium } = require('playwright')
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d }
const has = (k) => process.argv.includes('--' + k)
const URL_ = 'https://bskgiaejgvbjpixijruk.supabase.co'
const KEY = 'sb_publishable_v6HxcdZkbMdzIWB0fi_XzQ_AM05NF3A'
;(async () => {
  const who = arg('as', 'guest')
  let session = null
  if (who !== 'guest') {
    // curl plutôt que fetch : il passe par le proxy de l'environnement.
    const body = JSON.stringify({ email: `${who}.test@kodo.test`, password: 'motdepasse-test-123' })
    session = JSON.parse(require('node:child_process').execFileSync('curl', ['-sS', '-X', 'POST', `${URL_}/auth/v1/token?grant_type=password`, '-H', `apikey: ${KEY}`, '-H', 'Content-Type: application/json', '-d', body], { encoding: 'utf8' }))
    if (!session.access_token) throw new Error('connexion impossible : ' + JSON.stringify(session))
    session.expires_at = Math.floor(Date.now() / 1000) + session.expires_in
  }
  const browser = await chromium.launch()
  const mobile = arg('vp', 'desktop') === 'mobile'
  const ctx = await browser.newContext({ viewport: mobile ? { width: 375, height: 812 } : { width: 1440, height: 900 }, colorScheme: arg('scheme', 'light'), deviceScaleFactor: 1 })
  await ctx.addInitScript(([s, lang]) => {
    try {
      localStorage.setItem('kodo:lang', lang)
      if (s) localStorage.setItem('kodo-auth', JSON.stringify(s))
    } catch {}
  }, [session, arg('lang', 'fr')])
  const page = await ctx.newPage()
  page.on('pageerror', (e) => console.log('pageerror:', e.message))
  page.on('console', (m) => { if (m.type() === 'error' && !/401|Failed to load resource/.test(m.text())) console.log('console error:', m.text().slice(0, 200)) })
  await page.goto('http://localhost:5173' + arg('path', '/'), { waitUntil: 'networkidle' })
  await page.waitForTimeout(Number(arg('wait', '1200')))
  const out = arg('out', '/tmp/shot.png')
  await page.screenshot({ path: out, fullPage: has('full') })
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  console.log(out, overflow ? 'HORIZONTAL OVERFLOW' : 'ok')
  await browser.close()
})().catch((e) => { console.error(e.message); process.exit(1) })
