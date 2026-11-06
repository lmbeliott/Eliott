import { lazy, Suspense, useEffect, type ComponentType, type ReactNode } from 'react'
import { createBrowserRouter, createHashRouter, Navigate, Outlet, RouterProvider, ScrollRestoration, useLocation, useMatches, useRouteError } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import { FeedbackProvider } from './components/feedback'
import { Button, ButtonLink, useDocumentTitle } from './components/ui'
import { Logo } from './components/Logo'
import { useSession } from './data/store'
import { useCtx } from './data/hooks'
import { justLoggedOut } from './data/api'
import Landing from './pages/public/Landing'
import { Login, Register, ForgotPassword } from './pages/public/Auth'
import { Terms, Privacy } from './pages/public/Legal'
import NotFound from './pages/public/NotFound'
import ClubChoice from './pages/ClubChoice'
import AppShell from './components/AppShell'

// ---------------------------------------------------------------- pages chargées à la demande

/** Échec de chargement d'un fichier de page (déploiement entre-temps, ou connexion perdue). */
class PageLoadError extends Error {}

const RELOAD_KEY = 'swimhub.chunk-reload'

/**
 * Après un déploiement, les fichiers de l'ancienne version n'existent plus : on recharge la page une fois
 * (la nouvelle version est alors servie). Garde-fou anti-boucle de 10 s ; rien hors ligne, ni sans sessionStorage.
 */
function reloadForNewVersion(): boolean {
  if (!navigator.onLine) return false
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0)
    if (Date.now() - last < 10_000) return false
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
  } catch {
    return false
  }
  window.location.reload()
  return true
}

const pages = {
  Dashboard: () => import('./pages/app/Dashboard'),
  Planning: () => import('./pages/app/Planning'),
  Config: () => import('./pages/app/Config'),
  Absences: () => import('./pages/app/Absences'),
  Replacements: () => import('./pages/app/Replacements'),
  Team: () => import('./pages/app/Team'),
  Reports: () => import('./pages/app/Reports'),
  Billing: () => import('./pages/app/Billing'),
  Support: () => import('./pages/app/Support'),
  Account: () => import('./pages/app/Account'),
}

function lazyPage(load: () => Promise<{ default: ComponentType }>) {
  return lazy(() => load().catch((err: unknown) => {
    // Rechargement en cours : on laisse le squelette affiché plutôt qu'un message d'erreur fugace.
    if (reloadForNewVersion()) return new Promise<never>(() => {})
    throw new PageLoadError('Chargement de la page impossible', { cause: err })
  }))
}

/** Précharge toutes les pages une fois l'application affichée : navigation instantanée, et disponibles hors ligne (service worker). */
function preloadPages() {
  for (const load of Object.values(pages)) load().catch(() => { /* réessayé à la navigation */ })
}

const Dashboard = lazyPage(pages.Dashboard)
const Planning = lazyPage(pages.Planning)
const Config = lazyPage(pages.Config)
const Absences = lazyPage(pages.Absences)
const Replacements = lazyPage(pages.Replacements)
const Team = lazyPage(pages.Team)
const Reports = lazyPage(pages.Reports)
const Billing = lazyPage(pages.Billing)
const Support = lazyPage(pages.Support)
const Account = lazyPage(pages.Account)

// ---------------------------------------------------------------- gardes

function RequireSession({ children }: { children: ReactNode }) {
  const session = useSession()
  const loc = useLocation()
  if (!session) return <Navigate to={justLoggedOut() ? '/' : `/connexion?suite=${encodeURIComponent(loc.pathname + loc.search)}`} replace />
  return <>{children}</>
}

function RequireClub() {
  const session = useSession()
  const ctx = useCtx()
  const loc = useLocation()
  const inApp = !!ctx
  useEffect(() => {
    if (!inApp) return
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(preloadPages, { timeout: 4000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(preloadPages, 1500)
    return () => clearTimeout(id)
  }, [inApp])
  if (!session) return <Navigate to={justLoggedOut() ? '/' : `/connexion?suite=${encodeURIComponent(loc.pathname + loc.search)}`} replace />
  // Pas de club choisi : la page demandée (avec ses paramètres) est rouverte après le choix.
  if (!ctx) return <Navigate to={`/clubs?suite=${encodeURIComponent(loc.pathname + loc.search)}`} replace />
  // Clé sur le compte et le club : un changement (autre onglet, « Voir comme… ») remonte les pages,
  // et aucun formulaire ouvert ne garde l'état d'un autre club.
  // Clé sur la section : nouvelle limite Suspense à chaque page, donc squelette visible pendant le chargement.
  const section = loc.pathname.split('/')[2] ?? ''
  return (
    <AppShell key={`${ctx.user.id}:${ctx.club.id}`}>
      <Suspense key={section} fallback={<PageSkeleton />}><Outlet /></Suspense>
    </AppShell>
  )
}

function GuestOnly({ children }: { children: ReactNode }) {
  const session = useSession()
  if (session) return <Navigate to={session.clubId ? '/app' : '/clubs'} replace />
  return <>{children}</>
}

function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Chargement" className="animate-pulse">
      <div className="h-9 w-64 rounded-md bg-surface-2" />
      <div className="mt-3 h-4 w-96 max-w-full rounded bg-surface-2" />
      <div className="mt-8 h-64 rounded-xl bg-surface-2" />
    </div>
  )
}

// ---------------------------------------------------------------- erreurs

/** Remplace la page qui a échoué (dans l'application, la navigation reste visible). Jamais de trace technique. */
function RouteError({ full }: { full?: boolean }) {
  const error = useRouteError()
  const session = useSession()
  const loadFailed = error instanceof PageLoadError
  const body = (
    <div role="alert" className="max-w-[520px]">
      <h1 className="display-md text-2xl text-ink sm:text-3xl">Une erreur est survenue</h1>
      <p className="mt-3 text-base text-ink-2">
        {loadFailed
          ? 'Impossible de charger cette page (mise à jour ou connexion perdue). Rechargez pour réessayer.'
          : "Cette page n'a pas pu s'afficher. Rechargez-la pour réessayer."}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button icon={RotateCcw} onClick={() => window.location.reload()}>Recharger</Button>
        <ButtonLink to={session ? '/app' : '/'} variant="secondary">{session ? 'Revenir au tableau de bord' : "Revenir à l'accueil"}</ButtonLink>
      </div>
    </div>
  )
  if (!full) return body
  return (
    <div className="flex min-h-dvh flex-col bg-bg px-4 py-6 sm:px-10">
      <Logo to={session ? '/app' : '/'} />
      <main className="mx-auto flex w-full max-w-[520px] flex-1 flex-col justify-center">{body}</main>
    </div>
  )
}

// ---------------------------------------------------------------- routeur

interface RouteHandle { title?: string }

/** Titre de l'onglet : celui de la route la plus précise qui en déclare un (`handle.title`). */
function useRouteTitle() {
  const matches = useMatches()
  const title = [...matches].reverse().map((m) => (m.handle as RouteHandle | undefined)?.title).find(Boolean)
  useDocumentTitle(title)
}

// Routeur « data » : nécessaire pour les transitions de page (View Transitions API).
function Root() {
  useRouteTitle()
  return (
    <FeedbackProvider>
      <ScrollRestoration />
      <Outlet />
    </FeedbackProvider>
  )
}

const createRouter = import.meta.env.VITE_HASH_ROUTER === '1' ? createHashRouter : createBrowserRouter

// Sous-dossier de déploiement (ex. GitHub Pages : /Eliott/), sans la barre finale.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

/** Page de l'application : titre d'onglet, et erreur affichée sous la navigation plutôt qu'en plein écran. */
const page = (title: string, element: ReactNode) => ({ element, handle: { title } satisfies RouteHandle, errorElement: <RouteError /> })
const titled = (title: string) => ({ handle: { title } satisfies RouteHandle })

const router = createRouter([
  {
    element: <Root />,
    errorElement: <RouteError full />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/connexion', element: <GuestOnly><Login /></GuestOnly>, ...titled('Connexion') },
      { path: '/inscription', element: <GuestOnly><Register /></GuestOnly>, ...titled('Créer un compte') },
      { path: '/mot-de-passe-oublie', element: <ForgotPassword />, ...titled('Mot de passe oublié') },
      { path: '/cgv', element: <Terms />, ...titled('Conditions générales') },
      { path: '/confidentialite', element: <Privacy />, ...titled('Politique de confidentialité') },
      { path: '/clubs', element: <RequireSession><ClubChoice /></RequireSession>, ...titled('Choisir un club') },
      {
        path: '/app',
        element: <RequireClub />,
        children: [
          { index: true, ...page('Tableau de bord', <Dashboard />) },
          { path: 'planning', ...page('Planning', <Planning />) },
          { path: 'configuration/*', ...page('Configuration', <Config />) },
          { path: 'absences', ...page('Mes absences', <Absences />) },
          { path: 'remplacements', ...page('Remplacements', <Replacements />) },
          { path: 'equipe/*', ...page('Équipe', <Team />) },
          { path: 'rapports', ...page('Rapports', <Reports />) },
          { path: 'abonnement', ...page('Abonnement', <Billing />) },
          { path: 'support', ...page('Support', <Support />) },
          { path: 'compte', ...page('Mon compte', <Account />) },
        ],
      },
      // Anciennes adresses du site d'origine
      { path: '/login', element: <Navigate to="/connexion" replace /> },
      { path: '/register', element: <Navigate to="/inscription" replace /> },
      { path: '/club-choice', element: <Navigate to="/clubs" replace /> },
      { path: '/dashboard', element: <Navigate to="/app" replace /> },
      { path: '*', element: <NotFound />, ...titled('Page introuvable') },
    ],
  },
], { basename: import.meta.env.VITE_HASH_ROUTER === '1' ? undefined : basename })

export default function App() {
  return <RouterProvider router={router} />
}
