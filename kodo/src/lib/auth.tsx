import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase, type Profile } from './supabase'

interface AuthState {
  session: Session | null
  ready: boolean
  profile: Profile | null
  /** Arrivée par le lien « mot de passe oublié » */
  recovering: boolean
  clearRecovering: () => void
}

const Ctx = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)
  const [recovering, setRecovering] = useState(false)
  const qc = useQueryClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s)
      setReady(true)
      if (event === 'PASSWORD_RECOVERY') setRecovering(true)
      // Déconnexion : on efface les données privées du compte précédent (ordinateur partagé).
      if (event === 'SIGNED_OUT') qc.clear()
      if (event === 'SIGNED_IN') qc.invalidateQueries()
    })
    return () => data.subscription.unsubscribe()
  }, [qc])

  const uid = session?.user.id
  const profileQuery = useQuery({
    queryKey: ['profile', uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', uid!).single()
      if (error) throw error
      return data as Profile
    },
  })

  const value = useMemo<AuthState>(
    () => ({ session, ready, profile: profileQuery.data ?? null, recovering, clearRecovering: () => setRecovering(false) }),
    [session, ready, profileQuery.data, recovering],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAuth hors de AuthProvider')
  return v
}
