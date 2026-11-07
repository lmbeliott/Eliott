// Progression de l'élève : réussites, tentatives, brouillons.
// Connecté : tout vient de Supabase. Invité : tout reste dans le navigateur, puis est
// envoyé au serveur à la première connexion.

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from './auth'
import { supabase, type Solve, type SubmitResult } from './supabase'
import type { Lang } from '../judge/protocol'
import type { Verdict } from '../judge/judge'
import { problemById } from './content'

// ------------------------------------------------------------------ Stockage local

function readLocal<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    return v ? (JSON.parse(v) as T) : fallback
  } catch {
    return fallback
  }
}
function writeLocal(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* stockage plein ou indisponible : on continue sans */
  }
}

interface GuestSolve {
  at: string
  lang: Lang
  code: string
  total: number
}
interface GuestState {
  solved: Record<string, GuestSolve>
  tried: Record<string, true>
}
const GUEST_KEY = 'kodo:guest'
const readGuest = () => readLocal<GuestState>(GUEST_KEY, { solved: {}, tried: {} })

// ------------------------------------------------------------------ Lecture

export interface Progress {
  solved: Map<string, Pick<Solve, 'problem_id' | 'solved_at' | 'xp' | 'first_try' | 'language'>>
  tried: Set<string>
  loading: boolean
  guest: boolean
}

export function useProgress(): Progress {
  const { session } = useAuth()
  const uid = session?.user.id
  const [guest, setGuest] = useState(readGuest)

  useEffect(() => {
    const onChange = () => setGuest(readGuest())
    window.addEventListener('kodo:guest', onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener('kodo:guest', onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [])

  const solves = useQuery({
    queryKey: ['solves', uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase.from('solves').select('problem_id, solved_at, xp, first_try, language, daily').eq('user_id', uid!)
      if (error) throw error
      return data as Solve[]
    },
  })
  const tried = useQuery({
    queryKey: ['tried', uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase.from('submissions').select('problem_id').eq('user_id', uid!).order('created_at', { ascending: false }).limit(2000)
      if (error) throw error
      return new Set((data as { problem_id: string }[]).map((r) => r.problem_id))
    },
  })

  if (!uid) {
    return {
      solved: new Map(
        Object.entries(guest.solved).map(([id, s]) => [
          id,
          { problem_id: id, solved_at: s.at, xp: problemById(id)?.points ?? 0, first_try: false, language: s.lang },
        ]),
      ),
      tried: new Set(Object.keys(guest.tried)),
      loading: false,
      guest: true,
    }
  }
  return {
    solved: new Map((solves.data ?? []).map((s) => [s.problem_id, s])),
    tried: tried.data ?? new Set(),
    loading: solves.isLoading,
    guest: false,
  }
}

// ------------------------------------------------------------------ Écriture

export interface RecordInput {
  problemId: string
  lang: Lang
  code: string
  verdict: Verdict
  passed: number
  total: number
  timeMs: number
}

export function useRecordSubmission() {
  const { session } = useAuth()
  const qc = useQueryClient()
  const uid = session?.user.id
  return useCallback(
    async (r: RecordInput): Promise<SubmitResult | null> => {
      if (!uid) {
        const g = readGuest()
        g.tried[r.problemId] = true
        if (r.verdict === 'accepted' && !g.solved[r.problemId]) {
          g.solved[r.problemId] = { at: new Date().toISOString(), lang: r.lang, code: r.code, total: r.total }
        }
        writeLocal(GUEST_KEY, g)
        window.dispatchEvent(new Event('kodo:guest'))
        return null
      }
      const { data, error } = await supabase.rpc('submit_result', {
        p_problem: r.problemId,
        p_language: r.lang,
        p_code: r.code.slice(0, 65000),
        p_verdict: r.verdict,
        p_passed: r.passed,
        p_total: r.total,
        p_time_ms: Math.round(r.timeMs),
      })
      if (error) throw error
      qc.invalidateQueries({ queryKey: ['solves', uid] })
      qc.invalidateQueries({ queryKey: ['tried', uid] })
      qc.invalidateQueries({ queryKey: ['profile', uid] })
      qc.invalidateQueries({ queryKey: ['leaderboard'] })
      qc.invalidateQueries({ queryKey: ['activity'] })
      return data as SubmitResult
    },
    [uid, qc],
  )
}

/** Après connexion : envoie au serveur les problèmes réussis en invité. */
export function useGuestSync(onSynced: (count: number) => void) {
  const { session } = useAuth()
  const qc = useQueryClient()
  const running = useRef(false)
  const uid = session?.user.id
  useEffect(() => {
    if (!uid || running.current) return
    const g = readGuest()
    const entries = Object.entries(g.solved)
    if (entries.length === 0 && Object.keys(g.tried).length === 0) return
    running.current = true
    ;(async () => {
      let count = 0
      const kept: GuestState = { solved: {}, tried: {} }
      for (const [id, s] of entries) {
        if (!problemById(id)) continue
        const { error } = await supabase.rpc('submit_result', {
          p_problem: id,
          p_language: s.lang,
          p_code: s.code.slice(0, 65000),
          p_verdict: 'accepted',
          p_passed: s.total,
          p_total: s.total,
          p_time_ms: 0,
        })
        if (!error) count++
        else kept.solved[id] = s // échec (réseau…) : on garde la réussite pour la prochaine connexion
      }
      writeLocal(GUEST_KEY, kept)
      window.dispatchEvent(new Event('kodo:guest'))
      qc.invalidateQueries()
      running.current = false
      if (count > 0) onSynced(count)
    })()
  }, [uid, qc, onSynced])
}

// ------------------------------------------------------------------ Brouillons et préférences

export const draftKey = (problemId: string, lang: Lang) => `kodo:draft:${problemId}:${lang}`
export const loadDraft = (problemId: string, lang: Lang) => readLocal<string | null>(draftKey(problemId, lang), null)
export const saveDraft = (problemId: string, lang: Lang, code: string) => writeLocal(draftKey(problemId, lang), code)

const LANG_KEY = 'kodo:code-lang'
export function useCodeLang(): [Lang, (l: Lang) => void] {
  const { profile, session } = useAuth()
  const [lang, setLang] = useState<Lang>(() => readLocal<Lang>(LANG_KEY, 'python'))
  useEffect(() => {
    if (profile?.preferred_language && !localStorage.getItem(LANG_KEY)) setLang(profile.preferred_language)
  }, [profile?.preferred_language])
  const update = useCallback(
    (l: Lang) => {
      writeLocal(LANG_KEY, l)
      window.dispatchEvent(new CustomEvent<Lang>('kodo:code-lang', { detail: l }))
      if (session) supabase.from('profiles').update({ preferred_language: l }).eq('id', session.user.id).then(() => {})
    },
    [session],
  )
  // Tous les composants qui utilisent ce hook restent synchronisés.
  useEffect(() => {
    const on = (e: Event) => setLang((e as CustomEvent<Lang>).detail)
    window.addEventListener('kodo:code-lang', on)
    return () => window.removeEventListener('kodo:code-lang', on)
  }, [])
  useEffect(() => {
    document.documentElement.dataset.langPref = lang
  }, [lang])
  return [lang, update]
}
