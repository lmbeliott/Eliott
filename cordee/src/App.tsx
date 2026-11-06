import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Shell } from './components/Shell'
import { Spinner } from './components/ui'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'

// Les pages lourdes (éditeur, profils…) sont chargées à la demande.
const Problem = lazy(() => import('./pages/Problem').then((m) => ({ default: m.Problem })))
const Path = lazy(() => import('./pages/Path').then((m) => ({ default: m.Path })))
const ChapterPage = lazy(() => import('./pages/Chapter').then((m) => ({ default: m.ChapterPage })))
const Problems = lazy(() => import('./pages/Problems').then((m) => ({ default: m.Problems })))
const Daily = lazy(() => import('./pages/Daily').then((m) => ({ default: m.Daily })))
const Leaderboards = lazy(() => import('./pages/Leaderboards').then((m) => ({ default: m.Leaderboards })))
const ProfilePage = lazy(() => import('./pages/Profile').then((m) => ({ default: m.ProfilePage })))
const Groups = lazy(() => import('./pages/Groups').then((m) => ({ default: m.Groups })))
const GroupPage = lazy(() => import('./pages/Group').then((m) => ({ default: m.GroupPage })))
const SignIn = lazy(() => import('./pages/Auth').then((m) => ({ default: m.SignIn })))
const SignUp = lazy(() => import('./pages/Auth').then((m) => ({ default: m.SignUp })))
const Account = lazy(() => import('./pages/Account').then((m) => ({ default: m.Account })))
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })))

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
        { path: '/cordees', element: wrap(<Groups />) },
        { path: '/cordees/:id', element: wrap(<GroupPage />) },
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
