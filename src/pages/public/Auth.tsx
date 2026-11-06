import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, MailCheck } from 'lucide-react'
import { Logo } from '../../components/Logo'
import { PoolScene } from '../../components/PoolScene'
import { Button, Checkbox, Field, FormError, Input } from '../../components/ui'
import { useAction } from '../../components/feedback'
import { login, loginDemo, register } from '../../data/api'
import { getSession } from '../../data/store'
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_ID, DEMO_EDUCATOR_ID, DEMO_PASSWORD } from '../../data/seed'

function AuthLayout({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <div className="grid min-h-dvh bg-bg lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="flex flex-col px-4 py-6 sm:px-10">
        <Logo />
        <main className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-12">
          <h1 className="display-md text-[34px] text-ink sm:text-[40px]">{title}</h1>
          {intro && <p className="mt-2 text-[15px] text-ink-2">{intro}</p>}
          <div className="mt-8">{children}</div>
        </main>
        <p className="text-center text-[13px] text-muted">
          <Link to="/cgv" className="hover:text-ink">Conditions générales</Link>
          <span className="mx-2" aria-hidden>/</span>
          <Link to="/confidentialite" className="hover:text-ink">Confidentialité</Link>
        </p>
      </div>
      <aside aria-hidden className="relative hidden items-center justify-center overflow-hidden bg-water-soft px-12 lg:flex">
        <PoolScene still className="w-full max-w-[520px]" />
      </aside>
    </div>
  )
}

function PasswordInput({ id, value, onChange, autoComplete, invalid, describedBy }: { id: string; value: string; onChange: (v: string) => void; autoComplete: string; invalid?: boolean; describedBy?: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input id={id} type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} className="pr-12" aria-invalid={invalid || undefined} aria-describedby={describedBy} required />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} title={show ? 'Masquer' : 'Afficher'} className="absolute right-1 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:text-ink">
        {show ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
      </button>
    </div>
  )
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Page de retour après connexion (?suite=) : uniquement une adresse de l'application. */
export const safeSuite = (s: string | null) => (s && (s === '/app' || s.startsWith('/app/') || s.startsWith('/app?')) ? s : null)

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const run = useAction()

  // Avec plusieurs clubs, le choix du club passe d'abord par /clubs, qui garde la page demandée.
  const go = () => {
    const next = safeSuite(params.get('suite'))
    const s = getSession()
    navigate(s?.clubId ? (next ?? '/app') : next ? `/clubs?suite=${encodeURIComponent(next)}` : '/clubs', { replace: true })
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await login(email, password)
      go()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const demo = (who: string) => run(async () => {
    await loginDemo(who)
    navigate('/app', { replace: true })
  })

  return (
    <AuthLayout title="Se connecter" intro="Retrouvez vos plannings et vos remplacements.">
      <form onSubmit={submit} noValidate className="space-y-5">
        <FormError>{error}</FormError>
        <Field label="E-mail" htmlFor="email">
          <Input id="email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(null) }} required />
        </Field>
        {/* Le lien reste à côté du libellé, hors du <label> : sinon il s'ajoute au nom du champ. */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="password" className="text-sm font-semibold text-ink">Mot de passe</label>
            <Link to="/mot-de-passe-oublie" className="text-[13px] font-semibold text-water hover:underline">Mot de passe oublié ?</Link>
          </div>
          <PasswordInput id="password" value={password} onChange={(v) => { setPassword(v); setError(null) }} autoComplete="current-password" />
        </div>
        <Button type="submit" size="lg" full disabled={busy}>{busy ? 'Connexion…' : 'Se connecter'}</Button>
      </form>
      <p className="mt-6 text-center text-[15px] text-ink-2">
        Pas encore de compte ? <Link to="/inscription" className="font-semibold text-water hover:underline">Créer un compte</Link>
      </p>

      <div className="mt-10 rounded-xl border border-line bg-surface p-4">
        <p className="font-semibold text-ink">Explorer la démo</p>
        <p className="mt-1 text-[13px] text-muted">Un club fictif avec deux piscines, huit éducateurs et des absences en cours. Rien n'est envoyé.</p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button variant="secondary" onClick={() => demo(DEMO_ADMIN_ID)}>Responsable de club</Button>
          <Button variant="secondary" onClick={() => demo(DEMO_EDUCATOR_ID)}>Éducatrice</Button>
        </div>
        <p className="mt-3 text-[12.5px] text-muted">Ou connectez-vous avec <span className="font-semibold text-ink-2">{DEMO_ADMIN_EMAIL}</span>, mot de passe <span className="font-semibold text-ink-2">{DEMO_PASSWORD}</span>.</p>
      </div>
    </AuthLayout>
  )
}

export function Register() {
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', password: '' })
  const [accepted, setAccepted] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const errors = {
    firstname: !form.firstname.trim() ? 'Indiquez votre prénom.' : null,
    lastname: !form.lastname.trim() ? 'Indiquez votre nom.' : null,
    email: !EMAIL_RE.test(form.email.trim()) ? 'Saisissez une adresse e-mail au format nom@exemple.fr.' : null,
    password: form.password.length < 8 ? 'Utilisez au moins 8 caractères.' : null,
  }
  const set = (k: keyof typeof form) => (v: string) => { setForm((f) => ({ ...f, [k]: v })); setError(null) }
  const show = (k: keyof typeof errors) => (touched[k] ? errors[k] : null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setTouched({ firstname: true, lastname: true, email: true, password: true, terms: true })
    if (Object.values(errors).some(Boolean) || !accepted) return
    setBusy(true)
    try {
      await register(form)
      navigate('/clubs', { replace: true })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout title="Créer un compte" intro="Responsable ou éducateur, le compte est gratuit. Vous choisirez ensuite votre club.">
      <form onSubmit={submit} noValidate className="space-y-5">
        <FormError>{error}</FormError>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Prénom" htmlFor="firstname" error={show('firstname')}>
            <Input id="firstname" autoComplete="given-name" value={form.firstname} onChange={(e) => set('firstname')(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, firstname: true }))} aria-invalid={!!show('firstname') || undefined} />
          </Field>
          <Field label="Nom" htmlFor="lastname" error={show('lastname')}>
            <Input id="lastname" autoComplete="family-name" value={form.lastname} onChange={(e) => set('lastname')(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, lastname: true }))} aria-invalid={!!show('lastname') || undefined} />
          </Field>
        </div>
        <Field label="E-mail" htmlFor="email" error={show('email')}>
          <Input id="email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={(e) => set('email')(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, email: true }))} aria-invalid={!!show('email') || undefined} />
        </Field>
        <Field label="Mot de passe" htmlFor="password" error={show('password')} hint="8 caractères minimum.">
          <div onBlur={() => setTouched((t) => ({ ...t, password: true }))}>
            <PasswordInput id="password" value={form.password} onChange={set('password')} autoComplete="new-password" invalid={!!show('password')} />
          </div>
        </Field>
        <div>
          <Checkbox
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            label={<>J'accepte les <Link to="/cgv" target="_blank" className="text-water underline underline-offset-2">conditions générales</Link> et la <Link to="/confidentialite" target="_blank" className="text-water underline underline-offset-2">politique de confidentialité</Link>.</>}
          />
          {touched.terms && !accepted && <p role="alert" className="mt-1.5 text-[13px] text-rope">Acceptez les conditions pour créer votre compte.</p>}
        </div>
        <Button type="submit" size="lg" full disabled={busy}>{busy ? 'Création…' : 'Créer mon compte'}</Button>
      </form>
      <p className="mt-6 text-center text-[15px] text-ink-2">
        Déjà inscrit ? <Link to="/connexion" className="font-semibold text-water hover:underline">Se connecter</Link>
      </p>
    </AuthLayout>
  )
}

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) return setError('Saisissez une adresse e-mail au format nom@exemple.fr.')
    setSent(true)
  }
  return (
    <AuthLayout title="Mot de passe oublié" intro="Saisissez votre adresse : nous vous enverrons un lien pour en choisir un nouveau.">
      {sent ? (
        <div className="rounded-xl border border-line bg-surface p-5">
          <MailCheck aria-hidden className="size-6 text-kelp" />
          <p className="mt-3 font-semibold text-ink">Vérifiez votre boîte de réception</p>
          <p className="mt-1 text-[15px] text-ink-2">Si un compte est associé à {email.trim()}, un e-mail de réinitialisation vient de partir. Le lien reste valable une heure.</p>
          <p className="mt-3 text-[13px] text-muted">En mode démonstration, aucun e-mail n'est réellement envoyé.</p>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-5">
          <Field label="E-mail" htmlFor="email" error={error}>
            <Input id="email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(null) }} aria-invalid={!!error || undefined} />
          </Field>
          <Button type="submit" size="lg" full>Envoyer le lien</Button>
        </form>
      )}
      <p className="mt-6 text-center text-[15px]">
        <Link to="/connexion" className="font-semibold text-water hover:underline">Retour à la connexion</Link>
      </p>
    </AuthLayout>
  )
}
