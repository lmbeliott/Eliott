import { lazy, Suspense, useEffect, type ReactNode } from 'react'
import { BrowserRouter, HashRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
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

const Router = import.meta.env.VITE_HASH_ROUTER === '1' ? HashRouter : BrowserRouter

function ScrollReset() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

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

export default function App() {
  return (
    <Router>
      <FeedbackProvider>
        <ScrollReset />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/connexion" element={<GuestOnly><Login /></GuestOnly>} />
          <Route path="/inscription" element={<GuestOnly><Register /></GuestOnly>} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
          <Route path="/cgv" element={<Terms />} />
          <Route path="/confidentialite" element={<Privacy />} />
          <Route path="/clubs" element={<RequireSession><ClubChoice /></RequireSession>} />
          <Route path="/app" element={<RequireClub />}>
            <Route index element={<Dashboard />} />
            <Route path="planning" element={<Planning />} />
            <Route path="configuration/*" element={<Config />} />
            <Route path="absences" element={<Absences />} />
            <Route path="remplacements" element={<Replacements />} />
            <Route path="equipe/*" element={<Team />} />
            <Route path="rapports" element={<Reports />} />
            <Route path="abonnement" element={<Billing />} />
            <Route path="support" element={<Support />} />
            <Route path="compte" element={<Account />} />
          </Route>
          {/* Anciennes adresses */}
          <Route path="/login" element={<Navigate to="/connexion" replace />} />
          <Route path="/register" element={<Navigate to="/inscription" replace />} />
          <Route path="/club-choice" element={<Navigate to="/clubs" replace />} />
          <Route path="/dashboard" element={<Navigate to="/app" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </FeedbackProvider>
    </Router>
  )
}
