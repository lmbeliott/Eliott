// Problèmes proposés par la communauté (tables community_* dans Supabase).
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Lang } from '../judge/protocol'
import { useAuth } from './auth'
import type { Difficulty, ProblemData, ProblemText } from './content'
import { renderMarkdown } from './markdown'
import { supabase } from './supabase'

export type CommunityStatus = 'published' | 'withdrawn' | 'hidden'

export interface CommunityRow {
  id: string
  author_id: string
  title: string
  statement: string
  input_spec: string
  output_spec: string
  constraints: string | null
  difficulty: Difficulty
  time_limit_ms: number
  samples: { input: string; output: string }[]
  tests: { input: string; hash: string }[]
  status: CommunityStatus
  created_at: string
  updated_at: string
  author?: { username: string; display_name: string } | null
}

export interface CommunityListItem {
  id: string
  title: string
  difficulty: Difficulty
  status: CommunityStatus
  created_at: string
  author_id: string
  author_username: string
  author_name: string
  solves: number
  votes: number
  reports: number
}

export interface CommunityReference {
  problem_id: string
  language: Lang
  code: string
  generator: string | null
}

/** Ce que la page problème affiche en plus pour un problème de la communauté. */
export interface CommunityMeta {
  authorId: string
  authorUsername: string
  authorName: string
  status: CommunityStatus
  createdAt: string
  updatedAt: string
}

// ------------------------------------------------------------------ Lecture

export function useCommunityList() {
  const { session } = useAuth()
  return useQuery({
    queryKey: ['community', 'list', session?.user.id ?? null],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('community_list')
      if (error) throw error
      return (data ?? []).map((r: CommunityListItem) => ({ ...r, solves: Number(r.solves), votes: Number(r.votes), reports: Number(r.reports) })) as CommunityListItem[]
    },
    staleTime: 30_000,
  })
}

export function useCommunityProblem(id: string | undefined) {
  const { session } = useAuth()
  return useQuery({
    queryKey: ['community', 'problem', id, session?.user.id ?? null],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_problems')
        .select('*, author:profiles!community_problems_author_id_fkey(username, display_name)')
        .eq('id', id!)
        .maybeSingle()
      if (error) throw error
      return data as CommunityRow | null
    },
    staleTime: 60_000,
  })
}

export function useCommunityReference(id: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ['community', 'reference', id],
    enabled: !!id && enabled,
    queryFn: async () => {
      const { data, error } = await supabase.from('community_references').select('*').eq('problem_id', id!).maybeSingle()
      if (error) throw error
      return data as CommunityReference | null
    },
  })
}

/** Votes et réussites d'un problème, et ceux de l'utilisateur connecté. */
export function useCommunityCounts(id: string | undefined) {
  const { session } = useAuth()
  const uid = session?.user.id
  return useQuery({
    queryKey: ['community', 'counts', id, uid ?? null],
    enabled: !!id,
    queryFn: async () => {
      const [votes, solves, mine] = await Promise.all([
        supabase.from('community_votes').select('user_id', { count: 'exact', head: true }).eq('problem_id', id!),
        supabase.from('community_solves').select('user_id', { count: 'exact', head: true }).eq('problem_id', id!),
        uid
          ? Promise.all([
              supabase.from('community_votes').select('user_id').eq('problem_id', id!).eq('user_id', uid).maybeSingle(),
              supabase.from('community_solves').select('user_id').eq('problem_id', id!).eq('user_id', uid).maybeSingle(),
              supabase.from('community_reports').select('user_id').eq('problem_id', id!).eq('user_id', uid).maybeSingle(),
            ])
          : Promise.resolve(null),
      ])
      if (votes.error) throw votes.error
      if (solves.error) throw solves.error
      return {
        votes: votes.count ?? 0,
        solves: solves.count ?? 0,
        voted: !!mine?.[0].data,
        solved: !!mine?.[1].data,
        reported: !!mine?.[2].data,
      }
    },
    staleTime: 30_000,
  })
}

/** Problèmes de la communauté réussis par l'utilisateur connecté. */
export function useMyCommunitySolves() {
  const { session } = useAuth()
  const uid = session?.user.id
  return useQuery({
    queryKey: ['community', 'my-solves', uid ?? null],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase.from('community_solves').select('problem_id').eq('user_id', uid!)
      if (error) throw error
      return new Set((data ?? []).map((r) => r.problem_id as string))
    },
    staleTime: 60_000,
  })
}

export function useIsModerator() {
  const { session } = useAuth()
  return useQuery({
    queryKey: ['community', 'moderator', session?.user.id ?? null],
    enabled: !!session,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('is_moderator')
      if (error) throw error
      return data === true
    },
    staleTime: Infinity,
  })
}

// ------------------------------------------------------------------ Conversion pour la page problème

const textOf = (r: CommunityRow): ProblemText => ({
  title: r.title,
  statement: renderMarkdown(r.statement),
  input: renderMarkdown(r.input_spec),
  output: renderMarkdown(r.output_spec),
  constraints: r.constraints?.trim() ? renderMarkdown(r.constraints) : null,
  hints: [],
  solution: '',
})

export function toProblemData(r: CommunityRow): ProblemData {
  return {
    id: r.id,
    title: r.title,
    titleEn: null,
    chapter: '',
    level: '',
    difficulty: r.difficulty,
    order: 0,
    tags: [],
    points: 0,
    timeLimitMs: r.time_limit_ms,
    text: { fr: textOf(r), en: null },
    solutionCode: { python: null, cpp: null },
    starter: { fr: { python: null, cpp: null }, en: { python: null, cpp: null } },
    samples: r.samples,
    tests: r.tests,
    community: {
      authorId: r.author_id,
      authorUsername: r.author?.username ?? '',
      authorName: r.author?.display_name ?? '',
      status: r.status,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    },
  }
}

// ------------------------------------------------------------------ Écriture

function useInvalidate() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: ['community'] })
}

export function useVote(id: string) {
  const { session } = useAuth()
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: async (on: boolean) => {
      const uid = session!.user.id
      const { error } = on
        ? await supabase.from('community_votes').insert({ problem_id: id, user_id: uid })
        : await supabase.from('community_votes').delete().eq('problem_id', id).eq('user_id', uid)
      if (error) throw error
    },
    onSettled: invalidate,
  })
}

export type ReportReason = 'incorrect' | 'copie' | 'inapproprie' | 'autre'

export function useReport(id: string) {
  const { session } = useAuth()
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: async ({ reason, details }: { reason: ReportReason; details: string }) => {
      const { error } = await supabase.from('community_reports').insert({ problem_id: id, user_id: session!.user.id, reason, details: details.trim() || null })
      if (error) throw error
    },
    onSettled: invalidate,
  })
}

export function useSetStatus(id: string) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: async (status: 'published' | 'withdrawn') => {
      const { error } = await supabase.from('community_problems').update({ status }).eq('id', id)
      if (error) throw error
    },
    onSettled: invalidate,
  })
}

export function useModerate(id: string) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: async (hide: boolean) => {
      const { error } = await supabase.rpc('moderate_community_problem', { p_id: id, p_hide: hide })
      if (error) throw error
    },
    onSettled: invalidate,
  })
}

export function useDeleteCommunityProblem(id: string) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('community_problems').delete().eq('id', id)
      if (error) throw error
    },
    onSettled: invalidate,
  })
}

/** Réussite d'un problème de la communauté : enregistrée une fois, sans points. */
export async function recordCommunitySolve(problemId: string, userId: string, lang: Lang) {
  const { error } = await supabase.from('community_solves').upsert({ problem_id: problemId, user_id: userId, language: lang }, { onConflict: 'problem_id,user_id', ignoreDuplicates: true })
  if (error) throw error
}

export interface CommunityDraft {
  id: string
  title: string
  statement: string
  input_spec: string
  output_spec: string
  constraints: string
  difficulty: Difficulty
  time_limit_ms: number
  samples: { input: string; output: string }[]
  tests: { input: string; hash: string }[]
  reference: { language: Lang; code: string; generator: string | null }
}

export async function saveCommunityProblem(d: CommunityDraft, userId: string, isNew: boolean) {
  const row = {
    title: d.title.trim(),
    statement: d.statement,
    input_spec: d.input_spec,
    output_spec: d.output_spec,
    constraints: d.constraints.trim() || null,
    difficulty: d.difficulty,
    time_limit_ms: d.time_limit_ms,
    samples: d.samples,
    tests: d.tests,
  }
  let { error } = isNew
    ? await supabase.from('community_problems').insert({ id: d.id, author_id: userId, ...row })
    : await supabase.from('community_problems').update(row).eq('id', d.id)
  // Nouvelle tentative après un échec sur la solution de référence : le problème existe déjà,
  // on le met à jour (les deux écritures ne sont pas dans une même transaction).
  if (isNew && error?.code === '23505' && /community_problems_pkey/.test(error.message)) {
    ;({ error } = await supabase.from('community_problems').update(row).eq('id', d.id).eq('author_id', userId))
  }
  if (error) throw error
  const ref = await supabase.from('community_references').upsert({ problem_id: d.id, language: d.reference.language, code: d.reference.code, generator: d.reference.generator })
  if (ref.error) throw ref.error
}
