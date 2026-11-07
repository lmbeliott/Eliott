import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Field, Input, LinkButton, Notice, PageHeader, Segmented, Skeleton } from '../components/ui'
import { useToast } from '../components/Toast'
import { useAuth } from '../lib/auth'
import { useI18n, type UiLang } from '../lib/i18n'
import { useCodeLang } from '../lib/progress'
import { useTheme } from '../lib/theme'
import { errorText, supabase } from '../lib/supabase'
import type { Lang } from '../judge/protocol'

export function Account() {
  const { lang, setLang, t } = useI18n()
  const { session, profile, ready, recovering, clearRecovering } = useAuth()
  const [codeLang, setCodeLang] = useCodeLang()
  const [theme, toggleTheme] = useTheme()
  const qc = useQueryClient()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ display_name: '', username: '', school: '' })
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [saving, setSaving] = useState(false)
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSaving, setPwSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState('')
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    if (profile) setForm({ display_name: profile.display_name, username: profile.username, school: profile.school ?? '' })
  }, [profile])

  if (ready && !session)
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <PageHeader title={t('Paramètres', 'Settings')} lead={t('Connexion requise pour modifier le profil.', 'Sign-in required to edit the profile.')} />
        <LinkButton to="/connexion">{t('Se connecter', 'Sign in')}</LinkButton>
      </div>
    )
  if (!profile)
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="mt-8 h-64" />
      </div>
    )

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!form.display_name.trim()) errs.display_name = t('Nom affiché requis.', 'Display name required.')
    if (!/^[a-z0-9_]{3,20}$/.test(form.username)) errs.username = t('3 à 20 caractères : lettres minuscules, chiffres ou _.', '3 to 20 characters: lowercase letters, digits or _.')
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: form.display_name.trim(), username: form.username, school: form.school.trim() || null })
      .eq('id', profile.id)
    setSaving(false)
    if (error) {
      if (/username/.test(error.message)) setErrors({ username: t('Ce pseudo est déjà pris.', 'This username is already taken.') })
      else setErrors({ form: errorText(error, lang) })
      return
    }
    qc.invalidateQueries()
    toast(t('Profil enregistré.', 'Profile saved.'), 'ok')
  }

  const savePassword = async (e: FormEvent) => {
    e.preventDefault()
    if (password.length < 8) return setPwError(t('Au moins 8 caractères.', 'At least 8 characters.'))
    setPwSaving(true)
    const { error } = await supabase.auth.updateUser({ password })
    setPwSaving(false)
    if (error) return setPwError(errorText(error, lang))
    setPassword('')
    clearRecovering()
    toast(t('Mot de passe modifié.', 'Password changed.'), 'ok')
  }

  const deleteAccount = async () => {
    setDeleteError(null)
    const { error } = await supabase.rpc('delete_my_account')
    if (error) return setDeleteError(errorText(error, lang))
    await supabase.auth.signOut()
    toast(t('Compte supprimé.', 'Account deleted.'), 'ok')
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <PageHeader title={t('Paramètres', 'Settings')} />

      {recovering && (
        <div className="mb-8">
          <Notice tone="warn">{t('Nouveau mot de passe à définir ci-dessous.', 'Set a new password below.')}</Notice>
        </div>
      )}

      <section className="rounded-xl border border-line bg-surface p-6" aria-labelledby="profil">
        <h2 id="profil" className="text-lg font-semibold">
          {t('Profil public', 'Public profile')}
        </h2>
        <form onSubmit={saveProfile} noValidate className="mt-4 flex flex-col gap-4">
          {errors.form && <Notice tone="error">{errors.form}</Notice>}
          <Field label={t('Nom affiché', 'Display name')} htmlFor="display_name" error={errors.display_name}>
            <Input id="display_name" value={form.display_name} maxLength={40} onChange={(e) => (setForm({ ...form, display_name: e.target.value }), setErrors({ ...errors, display_name: undefined }))} aria-invalid={!!errors.display_name} />
          </Field>
          <Field label={t('Pseudo', 'Username')} htmlFor="username" error={errors.username} hint={t(`Adresse du profil : /profil/${form.username}`, `Profile address: /profil/${form.username}`)}>
            <Input id="username" value={form.username} maxLength={20} onChange={(e) => (setForm({ ...form, username: e.target.value.toLowerCase() }), setErrors({ ...errors, username: undefined }))} aria-invalid={!!errors.username} />
          </Field>
          <Field label={t('Établissement (facultatif)', 'School (optional)')} htmlFor="school" hint={t('Affiché dans les classements.', 'Shown on leaderboards.')}>
            <Input id="school" value={form.school} maxLength={80} onChange={(e) => setForm({ ...form, school: e.target.value })} />
          </Field>
          <Button type="submit" loading={saving} className="self-start">
            {t('Enregistrer le profil', 'Save profile')}
          </Button>
        </form>
      </section>

      <section className="mt-6 rounded-xl border border-line bg-surface p-6" aria-labelledby="preferences">
        <h2 id="preferences" className="text-lg font-semibold">
          {t('Préférences', 'Preferences')}
        </h2>
        <dl className="mt-4 flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <dt>
              <p className="font-medium">{t('Langue du site', 'Site language')}</p>
              <p className="text-sm text-muted">{t('Interface, énoncés et cours.', 'Interface, statements and lessons.')}</p>
            </dt>
            <dd>
              <Segmented<UiLang> label={t('Langue du site', 'Site language')} value={lang} onChange={setLang} options={[{ value: 'fr', label: 'Français' }, { value: 'en', label: 'English' }]} />
            </dd>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <dt>
              <p className="font-medium">{t('Langage de programmation', 'Programming language')}</p>
              <p className="text-sm text-muted">{t('Choisi par défaut dans l’éditeur et les cours.', 'Default in the editor and lessons.')}</p>
            </dt>
            <dd>
              <Segmented<Lang> label={t('Langage de programmation', 'Programming language')} value={codeLang} onChange={setCodeLang} options={[{ value: 'python', label: 'Python' }, { value: 'cpp', label: 'C++' }]} />
            </dd>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <dt>
              <p className="font-medium">{t('Thème', 'Theme')}</p>
            </dt>
            <dd>
              <Segmented label={t('Thème', 'Theme')} value={theme} onChange={(v) => v !== theme && toggleTheme()} options={[{ value: 'light', label: t('Clair', 'Light') }, { value: 'dark', label: t('Sombre', 'Dark') }]} />
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-xl border border-line bg-surface p-6" aria-labelledby="motdepasse">
        <h2 id="motdepasse" className="text-lg font-semibold">
          {t('Mot de passe', 'Password')}
        </h2>
        <form onSubmit={savePassword} noValidate className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-60 flex-1">
            <Field label={t('Nouveau mot de passe', 'New password')} htmlFor="new-password" error={pwError} hint={t('Au moins 8 caractères.', 'At least 8 characters.')}>
              <Input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(e) => (setPassword(e.target.value), setPwError(null))} aria-invalid={!!pwError} autoFocus={recovering} />
            </Field>
          </div>
          <Button type="submit" loading={pwSaving} variant="secondary" className="mb-6">
            {t('Changer le mot de passe', 'Change password')}
          </Button>
        </form>
      </section>

      <section className="mt-6 rounded-xl border border-bad/40 p-6" aria-labelledby="suppression">
        <h2 id="suppression" className="text-lg font-semibold">
          {t('Supprimer mon compte', 'Delete my account')}
        </h2>
        <p className="mt-1 text-sm text-ink-2">
          {t('Profil, soumissions, progression et appartenance aux groupes effacés définitivement.', 'Profile, submissions, progress and group memberships are permanently erased.')}
        </p>
        {deleteError && (
          <div className="mt-3">
            <Notice tone="error">{deleteError}</Notice>
          </div>
        )}
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <Field label={t(`Saisir « ${profile.username} » pour confirmer`, `Type “${profile.username}” to confirm`)} htmlFor="confirm-account">
            <Input id="confirm-account" value={confirmDelete} onChange={(e) => setConfirmDelete(e.target.value)} autoComplete="off" />
          </Field>
          <Button variant="danger" disabled={confirmDelete !== profile.username} onClick={deleteAccount}>
            {t(`Supprimer le compte ${profile.username}`, `Delete account ${profile.username}`)}
          </Button>
        </div>
      </section>
    </div>
  )
}
