import { useAuth } from '../lib/auth'
import { Dashboard } from './Dashboard'
import { Landing } from './Landing'

export function Home() {
  const { session, ready } = useAuth()
  if (!ready) return null
  return session ? <Dashboard /> : <Landing />
}
