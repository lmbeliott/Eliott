import { useMemo } from 'react'
import type { Club, Membership, Permission, User } from './types'
import { useSession, useWholeDB } from './store'
import { permissionsOf } from './api'

export interface Ctx {
  user: User
  club: Club
  membership: Membership
  perms: Set<Permission>
  can: (p: Permission) => boolean
  isAdmin: boolean
  isManager: boolean
  demo: boolean
}

/** Contexte courant (utilisateur + club). Renvoie null hors session/club. */
export function useCtx(): Ctx | null {
  const db = useWholeDB()
  const session = useSession()
  return useMemo(() => {
    if (!session?.clubId) return null
    const user = db.users.find((u) => u.id === session.userId)
    const club = db.clubs.find((c) => c.id === session.clubId)
    const membership = db.memberships.find((m) => m.userId === session.userId && m.clubId === session.clubId && m.status === 'approved')
    if (!user || !club || !membership) return null
    const perms = permissionsOf(db, user.id, club.id)
    return {
      user, club, membership, perms,
      can: (p: Permission) => perms.has(p),
      isAdmin: membership.isAdmin,
      isManager: perms.size > 0,
      demo: !!session.demo,
    }
  }, [db, session])
}

/** Variante pour les écrans sous /app (garantie par le layout). */
export function useAppCtx(): Ctx {
  const ctx = useCtx()
  if (!ctx) throw new Error('useAppCtx hors du layout applicatif')
  return ctx
}

export function useCurrentUser(): User | null {
  const db = useWholeDB()
  const session = useSession()
  return session ? db.users.find((u) => u.id === session.userId) ?? null : null
}
