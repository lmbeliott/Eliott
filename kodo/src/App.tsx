import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Shell } from './components/Shell'
import { Spinner } from './components/ui'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'

// Les pages lourdes (éditeur, profils…) sont chargées à la demande.
// Après un déploiement, un onglet resté ouvert peut demander des fichiers qui n'existent plus :
// on recharge la page une fois pour récupérer la nouvelle version.
function load<T>(f: () => Promise<T>): Promise<T> {
  return f().catch((err) => {
    try {
      if (!sessionStorage.getItem('kodo:reloaded')) {
        sessionStorage.setItem('kodo:reloaded', '1')
        window.location.reload()
      }
    } catch {
      /* stockage indisponible */
    }
    throw err
  })
}

const Problem = lazy(() => load(() => import('./pages/Problem').then((m) => ({ default: m.Problem }))))
const Path = lazy(() => load(() => import('./pages/Path').then((m) => ({ default: m.Path }))))
const ChapterPage = lazy(() => load(() => import('./pages/Chapter').then((m) => ({ default: m.ChapterPage }))))
const Problems = lazy(() => load(() => import('./pages/Problems').then((m) => ({ default: m.Problems }))))
const Daily = lazy(() => load(() => import('./pages/Daily').then((m) => ({ default: m.Daily }))))
const Leaderboards = lazy(() => load(() => import('./pages/Leaderboards').then((m) => ({ default: m.Leaderboards }))))
const ProfilePage = lazy(() => load(() => import('./pages/Profile').then((m) => ({ default: m.ProfilePage }))))
const Groups = lazy(() => load(() => import('./pages/Groups').then((m) => ({ default: m.Groups }))))
const GroupPage = lazy(() => load(() => import('./pages/Group').then((m) => ({ default: m.GroupPage }))))
const SignIn = lazy(() => load(() => import('./pages/Auth').then((m) => ({ default: m.SignIn }))))
const SignUp = lazy(() => load(() => import('./pages/Auth').then((m) => ({ default: m.SignUp }))))
const Account = lazy(() => load(() => import('./pages/Account').then((m) => ({ default: m.Account }))))
const About = lazy(() => load(() => import('./pages/About').then((m) => ({ default: m.About }))))

const wrap = (el: React.ReactNode) => (
  <Suspense
    fallback={
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    }
  >
    {el}
  </Suspense>
)

const router = createBrowserRouter(
  [
    {
      element: <Shell />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/parcours', element: wrap(<Path />) },
        { path: '/parcours/:id', element: wrap(<ChapterPage />) },
        { path: '/probleme/:id', element: wrap(<Problem />), handle: { bare: true } },
        { path: '/problemes', element: wrap(<Problems />) },
        { path: '/defi', element: wrap(<Daily />) },
        { path: '/classements', element: wrap(<Leaderboards />) },
        { path: '/profil/:username', element: wrap(<ProfilePage />) },
        { path: '/groupes', element: wrap(<Groups />) },
        { path: '/groupes/:id', element: wrap(<GroupPage />) },
        { path: '/rejoindre/:code', element: wrap(<Groups />) },
        { path: '/connexion', element: wrap(<SignIn />) },
        { path: '/inscription', element: wrap(<SignUp />) },
        { path: '/compte', element: wrap(<Account />) },
        { path: '/a-propos', element: wrap(<About />) },
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
)

export function App() {
  return <RouterProvider router={router} />
}
