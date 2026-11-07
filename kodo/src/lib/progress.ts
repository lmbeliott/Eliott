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
  /** Indices ouverts avant la réussite, envoyés au serveur à la connexion */
  hints?: Record<string, number>
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
  const { session, ready } = useAuth()
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

  // Session pas encore lue : ni invité ni progression vide, seulement « en chargement ».
  if (!ready) return { solved: new Map(), tried: new Set(), loading: true, guest: false }
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
    loading: solves.isLoading || tried.isLoading,
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
      qc.invalidateQueries({ queryKey: ['problem-stats'] })
      return data as SubmitResult
    },
    [uid, qc],
  )
}

/** Après connexion : envoie au serveur les problèmes réussis en invité. */
export function useGuestSync(onSynced: (count: number) => void) {
  const { session } = useAuth()
  const qc = useQueryClient()
  const uid = session?.user.id
  // Le rappel change à chaque rendu : on garde le dernier sans relancer l'envoi.
  const notify = useRef(onSynced)
  notify.current = onSynced
  const doneFor = useRef<string | null>(null)
  useEffect(() => {
    if (!uid) {
      doneFor.current = null
      return
    }
    if (doneFor.current === uid) return
    doneFor.current = uid
    let timer: ReturnType<typeof setTimeout> | undefined
    const sync = async () => {
      if (doneFor.current !== uid) return // déconnecté entre-temps
      const g = readGuest()
      const entries = Object.entries(g.solved)
      const guestHints = Object.entries(g.hints ?? {})
      if (entries.length === 0 && Object.keys(g.tried).length === 0 && guestHints.length === 0) return
      // Indices ouverts en invité : enregistrés avant les réussites, pour que leur coût s'applique.
      const keptHints: Record<string, number> = {}
      for (const [id, n] of guestHints) {
        if (!problemById(id)) continue
        for (let i = 1; i <= n; i++) {
          const { error } = await supabase.rpc('unlock_hint', { p_problem: id, p_index: i })
          if (error && error.code !== '22023') {
            keptHints[id] = n
            break
          }
        }
      }
      let count = 0
      let sent = 0
      let limited = false
      const kept: GuestState = { solved: {}, tried: {}, hints: keptHints }
      for (const [id, s] of entries) {
        if (!problemById(id)) continue
        // Le serveur accepte 20 soumissions par minute : on en garde pour l'élève, le reste part plus tard.
        if (limited || sent >= GUEST_BATCH || keptHints[id]) {
          kept.solved[id] = s
          continue
        }
        sent++
        const { data, error } = await supabase.rpc('submit_result', {
          p_problem: id,
          p_language: s.lang,
          p_code: s.code.slice(0, 65000),
          p_verdict: 'accepted',
          p_passed: s.total,
          p_total: s.total,
          p_time_ms: 0,
        })
        if (!error) {
          if ((data as SubmitResult | null)?.new_solve) count++
        } else if (error.code !== '22023') {
          // Échec passager (réseau, limite) : on garde la réussite pour plus tard.
          // Un problème inconnu du serveur (22023) ne passera jamais : on l'abandonne.
          kept.solved[id] = s
          if (error.code === '54000') limited = true
        }
      }
      writeLocal(GUEST_KEY, kept)
      window.dispatchEvent(new Event('kodo:guest'))
      qc.invalidateQueries()
      if (count > 0) notify.current(count)
      if (Object.keys(kept.solved).length > 0 || Object.keys(keptHints).length > 0) timer = setTimeout(sync, 61_000)
    }
    sync()
    return () => clearTimeout(timer)
  }, [uid, qc])
}

const GUEST_BATCH = 15

// ------------------------------------------------------------------ Indices payants

/** Pourcentage des points retiré selon le nombre d'indices ouverts avant la réussite. */
const HINT_PENALTY = [0, 15, 35, 60]
export const hintPenalty = (opened: number) => HINT_PENALTY[Math.min(Math.max(opened, 0), HINT_PENALTY.length - 1)]
/** Points de base d'un problème après les indices ouverts (même arrondi que le serveur). */
export const pointsAfterHints = (points: number, opened: number) => Math.floor((points * (100 - hintPenalty(opened))) / 100)

export interface HintUnlocks {
  /** Indices visibles */
  opened: number
  /** Indices qui comptent dans le coût (0 une fois le problème réussi) */
  charged: number
  loading: boolean
  open: (index: number) => Promise<void>
}

/** Indices ouverts d'un problème. Connecté : stockés sur le serveur (une déconnexion ne rend pas
 *  les points) ; invité : dans le navigateur, puis envoyés à la connexion. Gratuits après la réussite. */
export function useHintUnlocks(problemId: string, solved: boolean): HintUnlocks {
  const { session, ready } = useAuth()
  const uid = session?.user.id
  const qc = useQueryClient()
  const [guestCount, setGuestCount] = useState(() => readGuest().hints?.[problemId] ?? 0)
  const [free, setFree] = useState(0)
  useEffect(() => {
    setGuestCount(readGuest().hints?.[problemId] ?? 0)
    setFree(0)
  }, [problemId])
  const q = useQuery({
    queryKey: ['hints', uid, problemId],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase.from('hint_unlocks').select('hints').eq('user_id', uid!).eq('problem_id', problemId).maybeSingle()
      if (error) throw error
      return (data as { hints: number } | null)?.hints ?? 0
    },
  })
  const recorded = uid ? (q.data ?? 0) : guestCount
  const open = useCallback(
    async (index: number) => {
      if (solved) {
        setFree((n) => Math.max(n, index))
        return
      }
      if (!uid) {
        const g = readGuest()
        g.hints = { ...(g.hints ?? {}), [problemId]: Math.max(g.hints?.[problemId] ?? 0, index) }
        writeLocal(GUEST_KEY, g)
        setGuestCount(g.hints[problemId])
        return
      }
      const { data, error } = await supabase.rpc('unlock_hint', { p_problem: problemId, p_index: index })
      if (error) throw error
      const r = data as { hints: number; solved: boolean }
      if (r.solved) setFree((n) => Math.max(n, index))
      else qc.setQueryData(['hints', uid, problemId], r.hints)
    },
    [solved, uid, problemId, qc],
  )
  return {
    opened: Math.max(recorded, free),
    charged: solved ? 0 : recorded,
    loading: !ready || (!!uid && q.isLoading),
    open,
  }
}

// ------------------------------------------------------------------ Brouillons et préférences

export const draftKey = (problemId: string, lang: Lang) => `kodo:draft:${problemId}:${lang}`
export const loadDraft = (problemId: string, lang: Lang) => readLocal<string | null>(draftKey(problemId, lang), null)
export const saveDraft = (problemId: string, lang: Lang, code: string) => writeLocal(draftKey(problemId, lang), code)
export function clearDraft(problemId: string, lang: Lang) {
  try {
    localStorage.removeItem(draftKey(problemId, lang))
  } catch {
    /* stockage indisponible */
  }
}

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
