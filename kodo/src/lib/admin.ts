// Administration : appels aux fonctions admin_* du serveur et double authentification (TOTP).
// Le serveur refuse tout appel qui ne vient pas d'un compte « admin » en session aal2 :
// ce module ne fait que présenter les données, il ne décide d'aucun droit.

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'

// ------------------------------------------------------------------ Double authentification

export type MfaState =
  | { step: 'loading' }
  | { step: 'enroll' }
  | { step: 'challenge'; factorId: string }
  | { step: 'ok' }
  | { step: 'error'; message: string }

export function useMfa() {
  const [state, setState] = useState<MfaState>({ step: 'loading' })
  const refresh = useCallback(async () => {
    const [aal, factors] = await Promise.all([supabase.auth.mfa.getAuthenticatorAssuranceLevel(), supabase.auth.mfa.listFactors()])
    if (aal.error) return setState({ step: 'error', message: aal.error.message })
    if (factors.error) return setState({ step: 'error', message: factors.error.message })
    const totp = factors.data.totp.find((f) => f.status === 'verified')
    if (aal.data.currentLevel === 'aal2') setState({ step: 'ok' })
    else if (totp) setState({ step: 'challenge', factorId: totp.id })
    else setState({ step: 'enroll' })
  }, [])
  useEffect(() => {
    refresh()
  }, [refresh])
  return { state, refresh }
}

export interface Enrollment {
  factorId: string
  qr: string
  secret: string
}

/** Crée un facteur TOTP (après avoir retiré les essais non validés). */
export async function enrollTotp(): Promise<Enrollment> {
  const list = await supabase.auth.mfa.listFactors()
  for (const f of list.data?.all ?? []) {
    if (f.factor_type === 'totp' && f.status !== 'verified') await supabase.auth.mfa.unenroll({ factorId: f.id })
  }
  const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: `Kodo admin ${new Date().toISOString().slice(0, 10)}` })
  if (error) throw error
  return { factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret }
}

export async function verifyTotp(factorId: string, code: string) {
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code: code.replace(/\s/g, '') })
  if (error) throw error
}

// ------------------------------------------------------------------ Données

async function rpc<T>(fn: string, args?: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.rpc(fn, args)
  if (error) throw error
  return data as T
}

export interface Overview {
  users: number
  users_7d: number
  active_today: number
  active_7d: number
  submissions_24h: number
  solves_24h: number
  solves: number
  banned: number
  moderators: number
  groups: number
  community_published: number
  community_hidden: number
  reports: number
  days: { day: string; signups: number; active: number; submissions: number }[]
}

export interface AdminUserRow {
  id: string
  username: string
  display_name: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  xp: number
  solved_count: number
  staff: 'admin' | 'moderateur' | null
  moderator: boolean
  banned_until: string | null
  total: number
}

export interface AdminUser {
  id: string
  username: string
  display_name: string
  school: string | null
  avatar: string | null
  staff: 'admin' | 'moderateur' | null
  xp: number
  solved_count: number
  best_streak: number
  created_at: string
  banned_until: string | null
  email: string
  email_confirmed_at: string | null
  last_sign_in_at: string | null
  moderator: boolean
  mfa: number
  ban: { until: string; reason: string; at: string } | null
  hints: number
  submissions_total: number
  submissions: { id: number; problem_id: string; language: string; verdict: string; passed: number; total: number; created_at: string }[]
  groups: { id: string; name: string; owner: boolean }[]
  community: { id: string; title: string; status: string }[]
}

export interface AdminCommunityRow {
  id: string
  title: string
  author: string
  status: 'published' | 'hidden' | 'withdrawn'
  created_at: string
  reports: number
  solves: number
  votes: number
}

export interface AdminReport {
  problem_id: string
  title: string
  status: string
  reporter: string
  reason: string
  details: string | null
  created_at: string
}

export interface AdminGroupRow {
  id: string
  name: string
  kind: string
  owner: string
  members: number
  created_at: string
}

export interface AdminLogRow {
  at: string
  admin: string | null
  action: string
  target_user: string | null
  target: string | null
  details: Record<string, unknown> | null
}

export const useOverview = () => useQuery({ queryKey: ['admin', 'overview'], queryFn: () => rpc<Overview>('admin_overview') })

export const useAdminUsers = (search: string, filter: string, page: number) =>
  useQuery({
    queryKey: ['admin', 'users', search, filter, page],
    queryFn: () => rpc<AdminUserRow[]>('admin_users', { p_search: search, p_filter: filter, p_limit: 50, p_offset: page * 50 }),
    placeholderData: (prev) => prev,
  })

export const useAdminUser = (id: string | null) =>
  useQuery({ queryKey: ['admin', 'user', id], enabled: !!id, queryFn: () => rpc<AdminUser>('admin_user', { p_id: id }) })

export const useAdminCommunity = (status: string) =>
  useQuery({ queryKey: ['admin', 'community', status], queryFn: () => rpc<AdminCommunityRow[]>('admin_community', { p_status: status === 'all' ? null : status }) })

export const useAdminReports = () => useQuery({ queryKey: ['admin', 'reports'], queryFn: () => rpc<AdminReport[]>('admin_reports') })

export const useAdminGroups = (search: string) =>
  useQuery({ queryKey: ['admin', 'groups', search], queryFn: () => rpc<AdminGroupRow[]>('admin_groups', { p_search: search }), placeholderData: (prev) => prev })

export const useAdminLog = () => useQuery({ queryKey: ['admin', 'log'], queryFn: () => rpc<AdminLogRow[]>('admin_log', { p_limit: 200 }) })

export const useAnnouncement = () =>
  useQuery({
    queryKey: ['announcement'],
    staleTime: 5 * 60_000,
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'announcement').maybeSingle()
      if (error) throw error
      return (data?.value ?? null) as { text: string; tone: 'info' | 'warn'; id: number } | null
    },
  })

/** Actions : chaque appel rafraîchit les données d'administration. */
export function useAdminAction() {
  const qc = useQueryClient()
  return useCallback(
    async (fn: string, args: Record<string, unknown>) => {
      await rpc<unknown>(fn, args)
      await qc.invalidateQueries({ queryKey: ['admin'] })
      if (fn === 'admin_set_announcement') await qc.invalidateQueries({ queryKey: ['announcement'] })
    },
    [qc],
  )
}

export const submissionCode = (id: number) => rpc<string>('admin_submission_code', { p_id: id })
