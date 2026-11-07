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
  avatar: string | null
  /** Rôle d'équipe, modifiable seulement côté base */
  staff: 'admin' | 'moderateur' | null
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
  avatar: string | null
  staff: 'admin' | 'moderateur' | null
  xp: number
  /** Total de points (le rang), même pour le classement de la semaine */
  total_xp: number
  solved: number
  streak: number
  is_me: boolean
}

export interface SubmitResult {
  new_solve: boolean
  xp_gain: number
  /** Bonus de fin de chapitre du parcours (0 sinon) */
  chapter_bonus?: number
  /** Pourcentage retiré pour les indices ouverts avant la réussite */
  hint_penalty?: number
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

/** Jour en cours à Paris (l'activité est datée ainsi), ancré à midi heure locale pour les calendriers. */
export function parisToday() {
  const [y, m, d] = parisDay(new Date()).split('-').map(Number)
  return new Date(y, m - 1, d, 12)
}

/** Clé AAAA-MM-JJ d'un jour construit en heure locale (voir parisToday). */
export function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Message d'erreur lisible à partir d'une erreur Supabase / Postgres. */
export function errorText(e: unknown, lang: 'fr' | 'en'): string {
  const err = e as { message?: string; code?: string; status?: number }
  const msg = err?.message ?? String(e)
  const map: [RegExp, string, string][] = [
    [/User is banned|Compte suspendu/i, 'Compte suspendu. Pour toute question, contacter l’administration du site.', 'Account suspended. For any question, contact the site administration.'],
    [/Double authentification requise/i, 'Double authentification requise : recharger la page et saisir le code.', 'Two-factor authentication required: reload the page and enter the code.'],
    [/captcha/i, 'Vérification anti-robot échouée. Recharger la page et réessayer.', 'Anti-bot check failed. Reload the page and try again.'],
    [/Invalid login credentials/i, 'Adresse e-mail ou mot de passe incorrect.', 'Wrong email or password.'],
    [/Email not confirmed/i, 'Adresse e-mail non confirmée. Ouvrir le lien de confirmation reçu par e-mail, puis réessayer.', 'Email address not confirmed. Open the confirmation link sent by email, then try again.'],
    [/User already registered/i, 'Un compte existe déjà avec cette adresse. Se connecter à la place.', 'An account already exists with this email. Sign in instead.'],
    [/Password should be at least (\d+)/i, 'Mot de passe trop court : 8 caractères minimum.', 'Password too short: 8 characters minimum.'],
    [/rate limit|too many/i, 'Trop de tentatives. Réessayer dans quelques minutes.', 'Too many attempts. Try again in a few minutes.'],
    [/Unable to validate email address|invalid format/i, 'Cette adresse e-mail n’est pas valide.', 'This email address is not valid.'],
    [/Failed to fetch|NetworkError|Load failed/i, 'Connexion au serveur impossible. Vérifier la connexion internet puis réessayer.', 'Cannot reach the server. Check the internet connection and try again.'],
    [/duplicate key value.*username/i, 'Ce pseudo est déjà pris.', 'This username is already taken.'],
    [/Trop de soumissions/i, 'Trop de soumissions en une minute. Patienter un instant avant de réessayer.', 'Too many submissions in one minute. Wait a moment before trying again.'],
    [/Aucun groupe ne correspond au code (\w+)/i, 'Aucun groupe ne correspond à ce code. Vérifier le code auprès de la personne qui l’a fourni.', 'No group matches this code. Check it with the person who shared it.'],
    [/déjà créé 30 groupes/i, 'Limite de 30 groupes créés atteinte. Supprimer un groupe pour en créer un autre.', 'Limit of 30 created groups reached. Delete a group to create another.'],
    [/déjà partie de 30 groupes/i, 'Limite de 30 groupes atteinte. Quitter un groupe pour en rejoindre un autre.', 'Limit of 30 groups reached. Leave a group to join another.'],
    [/créé un groupe qui a encore des membres/i, 'Un groupe créé par ce compte a encore des membres. Le supprimer d’abord (page du groupe, onglet Membres).', 'A group created by this account still has members. Delete it first (group page, Members tab).'],
    [/rang Meijin/i, 'Avatar réservé au rang Meijin (120 000 points).', 'Avatar reserved for the Meijin rank (120,000 points).'],
    [/Avatar réservé/i, 'Avatar réservé.', 'Reserved avatar.'],
    [/déjà proposé 5 problèmes/i, 'Limite de 5 problèmes proposés en 24 heures atteinte. Réessayer demain.', 'Limit of 5 problems proposed in 24 hours reached. Try again tomorrow.'],
    [/masqué par la modération/i, 'Problème masqué par la modération : republication impossible.', 'Problem hidden by moderators: it cannot be republished.'],
    [/community_votes_pkey|community_reports_pkey/i, 'Déjà enregistré.', 'Already recorded.'],
    [/community_problems_size/i, 'Tests trop volumineux une fois enregistrés : réduire ou retirer des tests.', 'Tests too large once stored: shrink or remove some tests.'],
    [/community_problems_samples_check/i, 'Un exemple dépasse 4 000 octets (entrée ou sortie) : le raccourcir.', 'An example exceeds 4,000 bytes (input or output): shorten it.'],
    [/community_problems_tests_check/i, 'Tests cachés invalides : recalculer les sorties puis réessayer.', 'Invalid hidden tests: recompute the outputs, then try again.'],
    [/community_references_(code|generator)_check/i, 'Solution de référence ou générateur trop long : 64 Ko au plus.', 'Reference solution or generator too long: 64 KB at most.'],
    [/row-level security.*community_votes/i, 'Vote impossible sur un problème dont on est l’auteur.', 'Authors cannot vote for their own problem.'],
  ]
  for (const [re, fr, en] of map) if (re.test(msg)) return lang === 'en' ? en : fr
  return msg
}
