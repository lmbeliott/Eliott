import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Field, Input, Notice } from '../components/ui'
import { useToast } from '../components/Toast'
import { useI18n } from '../lib/i18n'
import { errorText, supabase } from '../lib/supabase'

// Retour après connexion : uniquement un chemin interne (« /… », jamais « //autre-site »).
const safeBack = (v: string | null, fallback: string) => (v && v.startsWith('/') && !v.startsWith('//') ? v : fallback)

const appUrl = (path: string) => `${window.location.origin}${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

function AuthLayout({ title, lead, children, footer }: { title: string; lead: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="mt-2 text-ink-2">{lead}</p>
      <div className="mt-8 rounded-xl border border-line bg-surface p-6 shadow-e1">{children}</div>
      <p className="mt-6 text-center text-sm text-ink-2">{footer}</p>
    </div>
  )
}

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

export function SignIn() {
  const { lang, t } = useI18n()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [mode, setMode] = useState<'login' | 'forgot'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({})
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const back = safeBack(params.get('retour'), '/')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!emailOk(email)) errs.email = t('Entre une adresse e-mail valide, par exemple nom@exemple.fr.', 'Enter a valid email address, for example name@example.com.')
    if (mode === 'login' && !password) errs.password = t('Entre ton mot de passe.', 'Enter your password.')
    setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: appUrl('compte') })
      setBusy(false)
      if (error) setErrors({ form: errorText(error, lang) })
      else setSent(true)
      return
    }
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (error) {
      setErrors({ form: errorText(error, lang) })
      return
    }
    toast(t(`Connecté avec ${email.trim()}.`, `Signed in as ${email.trim()}.`), 'ok')
    navigate(back)
  }

  if (mode === 'forgot' && sent) {
    return (
      <AuthLayout title={t('Vérifie ta boîte mail', 'Check your inbox')} lead={t(`Si un compte existe pour ${email}, un lien pour choisir un nouveau mot de passe vient d’y être envoyé.`, `If an account exists for ${email}, a link to choose a new password has just been sent there.`)} footer={<button type="button" onClick={() => { setMode('login'); setSent(false) }} className="font-medium underline underline-offset-2">{t('Revenir à la connexion', 'Back to sign in')}</button>}>
        <p className="text-sm text-ink-2">{t('Pense à regarder dans les courriers indésirables.', 'Remember to check your spam folder.')}</p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title={mode === 'login' ? t('Se connecter', 'Sign in') : t('Mot de passe oublié', 'Forgot password')}
      lead={mode === 'login' ? t('Tes problèmes réussis, tes points, ta série et tes groupes sont liés à ton compte.', 'Your solved problems, points, streak and groups are tied to your account.') : t('Entre ton adresse : tu recevras un lien pour choisir un nouveau mot de passe.', 'Enter your email: you will receive a link to choose a new password.')}
      footer={
        <>
          {t('Pas encore de compte ?', 'No account yet?')}{' '}
          <Link to="/inscription" className="font-medium text-ink underline underline-offset-2">
            {t('Créer un compte', 'Create an account')}
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        {errors.form && <Notice tone="error">{errors.form}</Notice>}
        <Field label={t('Adresse e-mail', 'Email address')} htmlFor="email" error={errors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setErrors((x) => ({ ...x, email: undefined, form: undefined }))
            }}
            onBlur={() => email && !emailOk(email) && setErrors((x) => ({ ...x, email: t('Cette adresse ne semble pas valide.', 'This address does not look valid.') }))}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
        </Field>
        {mode === 'login' && (
          <Field label={t('Mot de passe', 'Password')} htmlFor="password" error={errors.password}>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setErrors((x) => ({ ...x, password: undefined, form: undefined }))
              }}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
          </Field>
        )}
        <Button type="submit" loading={busy} size="lg" className="mt-2">
          {mode === 'login' ? t('Se connecter', 'Sign in') : t('Envoyer le lien', 'Send the link')}
        </Button>
        <button type="button" onClick={() => { setMode(mode === 'login' ? 'forgot' : 'login'); setErrors({}) }} className="self-start text-sm text-ink-2 underline underline-offset-2 hover:text-ink">
          {mode === 'login' ? t('Mot de passe oublié ?', 'Forgot your password?') : t('Revenir à la connexion', 'Back to sign in')}
        </button>
      </form>
    </AuthLayout>
  )
}

export function SignUp() {
  const { lang, t } = useI18n()
  const navigate = useNavigate()
  // Arrivé depuis un lien d'invitation : on y retourne après l'inscription.
  const [params] = useSearchParams()
  const back = safeBack(params.get('retour'), '/parcours')
  const toast = useToast()
  const [f, setF] = useState({ name: '', username: '', email: '', password: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof typeof f | 'form', string>>>({})
  const [busy, setBusy] = useState(false)
  const [confirmSent, setConfirmSent] = useState(false)

  const validate = (key: keyof typeof f, v: string): string | undefined => {
    if (key === 'name' && v.trim().length < 1) return t('Indique un prénom ou un nom.', 'Enter a first name or a name.')
    if (key === 'username' && !/^[a-z0-9_]{3,20}$/.test(v)) return t('3 à 20 caractères : lettres minuscules, chiffres ou _.', '3 to 20 characters: lowercase letters, digits or _.')
    if (key === 'email' && !emailOk(v)) return t('Entre une adresse e-mail valide, par exemple nom@exemple.fr.', 'Enter a valid email address, for example name@example.com.')
    if (key === 'password' && v.length < 8) return t('Au moins 8 caractères.', 'At least 8 characters.')
  }
  const update = (key: keyof typeof f, v: string) => {
    setF((x) => ({ ...x, [key]: v }))
    setErrors((x) => ({ ...x, [key]: undefined, form: undefined }))
  }
  const blur = async (key: keyof typeof f) => {
    if (!f[key]) return
    const msg = validate(key, f[key])
    if (msg) return setErrors((x) => ({ ...x, [key]: msg }))
    if (key === 'username') {
      const { data } = await supabase.from('profiles').select('id').eq('username', f.username).maybeSingle()
      if (data) setErrors((x) => ({ ...x, username: t('Ce pseudo est déjà pris.', 'This username is already taken.') }))
    }
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    for (const k of Object.keys(f) as (keyof typeof f)[]) {
      const m = validate(k, f[k])
      if (m) errs[k] = m
    }
    if (errors.username) errs.username = errors.username
    setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    const { data, error } = await supabase.auth.signUp({
      email: f.email.trim(),
      password: f.password,
      options: { data: { username: f.username, display_name: f.name.trim() }, emailRedirectTo: appUrl('') },
    })
    setBusy(false)
    if (error) return setErrors({ form: errorText(error, lang) })
    if (!data.session) return setConfirmSent(true)
    toast(t(`Compte @${f.username} créé.`, `Account @${f.username} created.`), 'ok')
    navigate(back)
  }

  if (confirmSent)
    return (
      <AuthLayout
        title={t('Confirme ton adresse', 'Confirm your email')}
        lead={t(`Un lien de confirmation vient d’être envoyé à ${f.email}. Clique dessus pour activer ton compte.`, `A confirmation link has just been sent to ${f.email}. Click it to activate your account.`)}
        footer={<Link to="/connexion" className="font-medium underline underline-offset-2">{t('Aller à la connexion', 'Go to sign in')}</Link>}
      >
        <p className="text-sm text-ink-2">{t('Pense à regarder dans les courriers indésirables. Tes problèmes résolus en invité seront ajoutés à ton compte à la première connexion.', 'Remember to check your spam folder. Problems you solved as a guest will be added to your account when you first sign in.')}</p>
      </AuthLayout>
    )

  const fields: { key: keyof typeof f; label: string; type: string; auto: string; hint?: string }[] = [
    { key: 'name', label: t('Prénom ou nom affiché', 'Display name'), type: 'text', auto: 'given-name', hint: t('Visible dans les classements.', 'Shown on leaderboards.') },
    { key: 'username', label: t('Pseudo', 'Username'), type: 'text', auto: 'username', hint: t('Pour l’adresse de ton profil : minuscules, chiffres, _.', 'For your profile address: lowercase, digits, _.') },
    { key: 'email', label: t('Adresse e-mail', 'Email address'), type: 'email', auto: 'email' },
    { key: 'password', label: t('Mot de passe', 'Password'), type: 'password', auto: 'new-password', hint: t('Au moins 8 caractères.', 'At least 8 characters.') },
  ]
  return (
    <AuthLayout
      title={t('Créer un compte', 'Create an account')}
      lead={t('Ton compte garde tes réussites, tes points et ta série, et te permet de rejoindre le groupe de ta classe. Ce que tu as résolu sans compte sur cet appareil y est transféré.', 'Your account keeps your solves, points and streak, and lets you join your class group. What you solved without an account on this device is transferred to it.')}
      footer={
        <>
          {t('Déjà un compte ?', 'Already have an account?')}{' '}
          <Link to="/connexion" className="font-medium text-ink underline underline-offset-2">
            {t('Se connecter', 'Sign in')}
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        {errors.form && <Notice tone="error">{errors.form}</Notice>}
        {fields.map((x) => (
          <Field key={x.key} label={x.label} htmlFor={`su-${x.key}`} error={errors[x.key]} hint={x.hint}>
            <Input
              id={`su-${x.key}`}
              type={x.type}
              autoComplete={x.auto}
              value={f[x.key]}
              onChange={(e) => update(x.key, x.key === 'username' ? e.target.value.toLowerCase() : e.target.value)}
              onBlur={() => blur(x.key)}
              aria-invalid={!!errors[x.key]}
              aria-describedby={errors[x.key] ? `su-${x.key}-error` : x.hint ? `su-${x.key}-hint` : undefined}
              maxLength={x.key === 'username' ? 20 : x.key === 'name' ? 40 : undefined}
            />
          </Field>
        ))}
        <Button type="submit" loading={busy} size="lg" className="mt-2">
          {t('Créer mon compte', 'Create my account')}
        </Button>
        <p className="text-xs text-muted">
          {t('Ton code et tes résultats sont enregistrés pour ta progression et visibles par les responsables de tes groupes. Ton adresse e-mail n’est jamais affichée.', 'Your code and results are saved for your progress and visible to the leaders of your groups. Your email address is never shown.')}
        </p>
      </form>
    </AuthLayout>
  )
}
