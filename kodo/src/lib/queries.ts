import { useQuery } from '@tanstack/react-query'
import { parisDay, supabase, type Group, type LeaderRow, type Profile, type Solve } from './supabase'
import { useAuth } from './auth'

/** Défi du jour : un problème par piste (choisi par le serveur, identique pour tous). */
export function useDaily() {
  // Le jour de Paris fait partie de la clé : une page restée ouverte passe minuit avec la
  // nouvelle sélection (les pages qui l'affichent se redessinent avec le compte à rebours).
  return useQuery({
    queryKey: ['daily', parisDay(new Date())],
    staleTime: 10 * 60_000,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('daily_problems')
      if (error) throw error
      return data as { level: string; problem_id: string }[]
    },
  })
}

export type Period = 'all' | 'week'

export function useLeaderboard(period: Period, groupId: string | null = null, limit = 50) {
  const { session } = useAuth()
  return useQuery({
    queryKey: ['leaderboard', period, groupId, limit, session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('leaderboard', { p_period: period, p_group: groupId, p_limit: limit })
      if (error) throw error
      return data as LeaderRow[]
    },
  })
}

export function useProblemStats() {
  return useQuery({
    queryKey: ['problem-stats'],
    staleTime: 5 * 60_000,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('problem_stats')
      if (error) throw error
      return new Map((data as { problem_id: string; solvers: number }[]).map((r) => [r.problem_id, Number(r.solvers)]))
    },
  })
}

export function useActivity(userId: string | undefined) {
  return useQuery({
    queryKey: ['activity', userId],
    enabled: !!userId,
    queryFn: async () => {
      const since = new Date(Date.now() - 371 * 86400_000).toISOString().slice(0, 10)
      const { data, error } = await supabase.from('activity').select('day, submissions, solves').eq('user_id', userId!).gte('day', since)
      if (error) throw error
      return data as { day: string; submissions: number; solves: number }[]
    },
  })
}

export function useProfile(username: string | undefined) {
  return useQuery({
    queryKey: ['profile-by-username', username],
    enabled: !!username,
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('username', username!).maybeSingle()
      if (error) throw error
      return data as Profile | null
    },
  })
}

export function useSolvesOf(userId: string | undefined) {
  return useQuery({
    queryKey: ['solves', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from('solves').select('problem_id, solved_at, xp, first_try, language, daily').eq('user_id', userId!)
      if (error) throw error
      return data as Solve[]
    },
  })
}

export interface MyGroup extends Group {
  role: 'encadrant' | 'membre'
  members: number
}

export function useMyGroups() {
  const { session } = useAuth()
  const uid = session?.user.id
  return useQuery({
    queryKey: ['groups', uid],
    enabled: !!uid,
    queryFn: async () => {
      // Le nombre de membres est compté par le serveur : la liste complète dépasserait vite
      // les 1000 lignes que l'API renvoie au plus.
      const [{ data: groups, error: e1 }, { data: mine, error: e2 }] = await Promise.all([
        supabase.from('groups').select('*, group_members(count)').order('created_at', { ascending: false }),
        supabase.from('group_members').select('group_id, role').eq('user_id', uid!),
      ])
      if (e1) throw e1
      if (e2) throw e2
      const roles = new Map((mine as { group_id: string; role: 'encadrant' | 'membre' }[]).map((m) => [m.group_id, m.role]))
      return (groups as (Group & { group_members: { count: number }[] })[]).map(({ group_members, ...g }) => ({
        ...g,
        role: roles.get(g.id) ?? 'membre',
        members: group_members[0]?.count ?? 0,
      })) as MyGroup[]
    },
  })
}

export interface GroupMember {
  user_id: string
  role: 'encadrant' | 'membre'
  joined_at: string
  profile: Pick<Profile, 'id' | 'username' | 'display_name' | 'school' | 'avatar' | 'staff' | 'xp' | 'solved_count' | 'current_streak' | 'last_streak_day'>
}

export function useGroup(groupId: string | undefined) {
  return useQuery({
    queryKey: ['group', groupId],
    enabled: !!groupId,
    queryFn: async () => {
      const { data: group, error } = await supabase.from('groups').select('*').eq('id', groupId!).maybeSingle()
      if (error) throw error
      if (!group) return null
      const { data: members, error: e2 } = await supabase
        .from('group_members')
        .select('user_id, role, joined_at, profile:profiles(id, username, display_name, school, avatar, staff, xp, solved_count, current_streak, last_streak_day)')
        .eq('group_id', groupId!)
      if (e2) throw e2
      const ids = (members ?? []).map((m) => m.user_id)
      // L'API renvoie au plus 1000 lignes par requête : une classe de 30 élèves en dépasse vite.
      const solves: { user_id: string; problem_id: string; solved_at: string }[] = []
      for (let from = 0; ids.length; from += 1000) {
        const { data, error: e3 } = await supabase.from('solves').select('user_id, problem_id, solved_at').in('user_id', ids).order('solved_at').range(from, from + 999)
        if (e3) throw e3
        solves.push(...(data ?? []))
        if (!data || data.length < 1000) break
      }
      return {
        group: group as Group,
        members: members as unknown as GroupMember[],
        solves: solves as { user_id: string; problem_id: string; solved_at: string }[],
      }
    },
  })
}
