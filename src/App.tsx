import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, createHashRouter, Navigate, Outlet, RouterProvider, ScrollRestoration, useLocation } from 'react-router-dom'
import { FeedbackProvider } from './components/feedback'
import { useSession } from './data/store'
import { useCtx } from './data/hooks'
import { justLoggedOut } from './data/api'
import Landing from './pages/public/Landing'
import { Login, Register, ForgotPassword } from './pages/public/Auth'
import { Terms, Privacy } from './pages/public/Legal'
import NotFound from './pages/public/NotFound'
import ClubChoice from './pages/ClubChoice'
import AppShell from './components/AppShell'

const Dashboard = lazy(() => import('./pages/app/Dashboard'))
const Planning = lazy(() => import('./pages/app/Planning'))
const Config = lazy(() => import('./pages/app/Config'))
const Absences = lazy(() => import('./pages/app/Absences'))
const Replacements = lazy(() => import('./pages/app/Replacements'))
const Team = lazy(() => import('./pages/app/Team'))
const Reports = lazy(() => import('./pages/app/Reports'))
const Billing = lazy(() => import('./pages/app/Billing'))
const Support = lazy(() => import('./pages/app/Support'))
const Account = lazy(() => import('./pages/app/Account'))

function RequireSession({ children }: { children: ReactNode }) {
  const session = useSession()
  const loc = useLocation()
  if (!session) return <Navigate to={justLoggedOut() ? '/' : `/connexion?suite=${encodeURIComponent(loc.pathname)}`} replace />
  return <>{children}</>
}

function RequireClub() {
  const session = useSession()
  const ctx = useCtx()
  const loc = useLocation()
  if (!session) return <Navigate to={justLoggedOut() ? '/' : `/connexion?suite=${encodeURIComponent(loc.pathname)}`} replace />
  if (!ctx) return <Navigate to="/clubs" replace />
  return <AppShell><Suspense fallback={<PageSkeleton />}><Outlet /></Suspense></AppShell>
}

function GuestOnly({ children }: { children: ReactNode }) {
  const session = useSession()
  if (session) return <Navigate to={session.clubId ? '/app' : '/clubs'} replace />
  return <>{children}</>
}

function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Chargement" className="animate-pulse">
      <div className="h-9 w-64 rounded-lg bg-surface-2" />
      <div className="mt-3 h-4 w-96 max-w-full rounded bg-surface-2" />
      <div className="mt-8 h-64 rounded-2xl bg-surface-2" />
    </div>
  )
}

// Routeur « data » : nécessaire pour les transitions de page (View Transitions API).
function Root() {
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

const router = createRouter([
  {
    element: <Root />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/connexion', element: <GuestOnly><Login /></GuestOnly> },
      { path: '/inscription', element: <GuestOnly><Register /></GuestOnly> },
      { path: '/mot-de-passe-oublie', element: <ForgotPassword /> },
      { path: '/cgv', element: <Terms /> },
      { path: '/confidentialite', element: <Privacy /> },
      { path: '/clubs', element: <RequireSession><ClubChoice /></RequireSession> },
      {
        path: '/app',
        element: <RequireClub />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'planning', element: <Planning /> },
          { path: 'configuration/*', element: <Config /> },
          { path: 'absences', element: <Absences /> },
          { path: 'remplacements', element: <Replacements /> },
          { path: 'equipe/*', element: <Team /> },
          { path: 'rapports', element: <Reports /> },
          { path: 'abonnement', element: <Billing /> },
          { path: 'support', element: <Support /> },
          { path: 'compte', element: <Account /> },
        ],
      },
      // Anciennes adresses du site d'origine
      { path: '/login', element: <Navigate to="/connexion" replace /> },
      { path: '/register', element: <Navigate to="/inscription" replace /> },
      { path: '/club-choice', element: <Navigate to="/clubs" replace /> },
      { path: '/dashboard', element: <Navigate to="/app" replace /> },
      { path: '*', element: <NotFound /> },
    ],
  },
], { basename: import.meta.env.VITE_HASH_ROUTER === '1' ? undefined : basename })

export default function App() {
  return <RouterProvider router={router} />
}
