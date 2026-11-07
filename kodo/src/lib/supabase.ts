import { createClient } from '@supabase/supabase-js'

// Clé « publishable » : faite pour être publique ; les droits sont gérés par RLS côté serveur.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://bskgiaejgvbjpixijruk.supabase.co'
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_v6HxcdZkbMdzIWB0fi_XzQ_AM05NF3A'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  // PKCE : un lien de connexion ne peut pas ouvrir la session de quelqu'un d'autre (pas de jeton dans l'URL).
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'kodo-auth', flowType: 'pkce' },
})

export interface Profile {
  id: string
  username: string
  display_name: string
  school: string | null
  preferred_language: 'python' | 'cpp'
  xp: number
  solved_count: number
  current_streak: number
  best_streak: number
  last_streak_day: string | null
  created_at: string
}

export interface Solve {
  problem_id: string
  solved_at: string
  xp: number
  first_try: boolean
  daily: boolean
  language: 'python' | 'cpp'
}

export interface Group {
  id: string
  name: string
  kind: 'classe' | 'etablissement' | 'amis'
  join_code: string
  owner_id: string
  created_at: string
}

export interface LeaderRow {
  rank: number
  user_id: string
  username: string
  display_name: string
  school: string | null
  xp: number
  solved: number
  streak: number
  is_me: boolean
}

export interface SubmitResult {
  new_solve: boolean
  xp_gain: number
  first_try: boolean
  daily: boolean
  xp: number
  solved_count: number
  streak: number
}

/** Série en cours : elle tombe à zéro si le dernier jour actif date d'avant-hier. */
export function liveStreak(p: Pick<Profile, 'current_streak' | 'last_streak_day'>) {
  if (!p.last_streak_day) return 0
  const today = parisDay(new Date())
  const last = p.last_streak_day
  const yesterday = parisDay(new Date(Date.now() - 86400_000))
  return last === today || last === yesterday ? p.current_streak : 0
}

/** Date du jour à Paris, au format AAAA-MM-JJ (comme le serveur). */
export function parisDay(d: Date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
}

/** Message d'erreur lisible à partir d'une erreur Supabase / Postgres. */
export function errorText(e: unknown, lang: 'fr' | 'en'): string {
  const err = e as { message?: string; code?: string; status?: number }
  const msg = err?.message ?? String(e)
  const map: [RegExp, string, string][] = [
    [/Invalid login credentials/i, 'Adresse e-mail ou mot de passe incorrect.', 'Wrong email or password.'],
    [/Email not confirmed/i, 'Confirme d’abord ton adresse e-mail avec le lien reçu.', 'Confirm your email address first, using the link we sent you.'],
    [/User already registered/i, 'Un compte existe déjà avec cette adresse. Connecte-toi.', 'An account already exists with this email. Sign in instead.'],
    [/Password should be at least (\d+)/i, 'Le mot de passe doit contenir au moins 8 caractères.', 'The password must be at least 8 characters long.'],
    [/rate limit|too many/i, 'Trop de tentatives. Réessaie dans quelques minutes.', 'Too many attempts. Try again in a few minutes.'],
    [/Unable to validate email address|invalid format/i, 'Cette adresse e-mail n’est pas valide.', 'This email address is not valid.'],
    [/Failed to fetch|NetworkError|Load failed/i, 'Pas de connexion au serveur. Vérifie ta connexion internet puis réessaie.', 'Cannot reach the server. Check your internet connection and try again.'],
    [/duplicate key value.*username/i, 'Ce pseudo est déjà pris.', 'This username is already taken.'],
    [/Trop de soumissions/i, 'Trop de soumissions en une minute. Attends un peu avant de recommencer.', 'Too many submissions in one minute. Wait a moment before trying again.'],
    [/Aucun groupe ne correspond au code (\w+)/i, 'Aucun groupe ne correspond à ce code. Vérifie-le auprès de la personne qui te l’a donné.', 'No group matches this code. Check it with the person who gave it to you.'],
    [/déjà créé 30 groupes/i, 'Tu as déjà créé 30 groupes.', 'You have already created 30 groups.'],
    [/déjà partie de 30 groupes/i, 'Tu fais déjà partie de 30 groupes.', 'You are already in 30 groups.'],
    [/créé un groupe qui a encore des membres/i, 'Tu as créé un groupe qui a encore des membres. Supprime-le d’abord (page du groupe, onglet Membres).', 'You created a group that still has members. Delete it first (group page, Members tab).'],
    [/déjà proposé 5 problèmes/i, 'Tu as déjà proposé 5 problèmes en 24 heures. Réessaie demain.', 'You have already proposed 5 problems in 24 hours. Try again tomorrow.'],
    [/masqué par la modération/i, 'Ce problème a été masqué par la modération : il ne peut pas être republié.', 'This problem was hidden by moderators: it cannot be republished.'],
    [/community_votes_pkey|community_reports_pkey/i, 'C’est déjà fait.', 'Already done.'],
    [/row-level security.*community_votes/i, 'Tu ne peux pas voter pour ton propre problème.', 'You cannot vote for your own problem.'],
  ]
  for (const [re, fr, en] of map) if (re.test(msg)) return lang === 'en' ? en : fr
  return msg
}
