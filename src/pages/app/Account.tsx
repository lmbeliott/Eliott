import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Field, FormError, Input, PageHeader, Panel, Segmented } from '../../components/ui'
import { ExpiryBadge } from '../../components/status'
import { useConfirm, useToast } from '../../components/feedback'
import { useAppCtx } from '../../data/hooks'
import { resetStore, useWholeDB } from '../../data/store'
import { changeEmail, changePassword, updateProfile } from '../../data/api'
import { getTheme, setTheme, type ThemePref } from '../../lib/theme'

export default function Account() {
  const ctx = useAppCtx()
  const db = useWholeDB()
  const toast = useToast()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [profile, setProfile] = useState({ firstname: ctx.user.firstname, lastname: ctx.user.lastname, phone: ctx.user.phone ?? '' })
  const [profileErr, setProfileErr] = useState<string | null>(null)
  const [email, setEmail] = useState({ value: '', password: '' })
  const [emailErr, setEmailErr] = useState<string | null>(null)
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' })
  const [pwdErr, setPwdErr] = useState<string | null>(null)
  const [theme, setThemeState] = useState<ThemePref>(getTheme())
  const quals = db.userQualifications.filter((uq) => uq.userId === ctx.user.id)

  const saveProfile = (e: FormEvent) => {
    e.preventDefault()
    try { updateProfile(profile); setProfileErr(null); toast('Profil enregistré.') } catch (err) { setProfileErr((err as Error).message) }
  }
  const saveEmail = async (e: FormEvent) => {
    e.preventDefault()
    try { await changeEmail(email.value, email.password); setEmail({ value: '', password: '' }); setEmailErr(null); toast('Adresse e-mail modifiée.') } catch (err) { setEmailErr((err as Error).message) }
  }
  const savePwd = async (e: FormEvent) => {
    e.preventDefault()
    if (pwd.next !== pwd.confirm) return setPwdErr('Les deux nouveaux mots de passe ne correspondent pas.')
    try { await changePassword(pwd.current, pwd.next); setPwd({ current: '', next: '', confirm: '' }); setPwdErr(null); toast('Mot de passe modifié.') } catch (err) { setPwdErr((err as Error).message) }
  }

  return (
    <>
      <PageHeader title="Mon compte" description={ctx.user.email} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Panel title="Profil">
            <form onSubmit={saveProfile} className="space-y-4" noValidate>
              <FormError>{profileErr}</FormError>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Prénom" htmlFor="p-first"><Input id="p-first" autoComplete="given-name" value={profile.firstname} onChange={(e) => setProfile({ ...profile, firstname: e.target.value })} /></Field>
                <Field label="Nom" htmlFor="p-last"><Input id="p-last" autoComplete="family-name" value={profile.lastname} onChange={(e) => setProfile({ ...profile, lastname: e.target.value })} /></Field>
              </div>
              <Field label="Téléphone" optional htmlFor="p-phone" hint="Visible des responsables, pour les remplacements urgents."><Input id="p-phone" type="tel" autoComplete="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></Field>
              <Button type="submit">Enregistrer le profil</Button>
            </form>
          </Panel>

          <Panel title="Mes diplômes" description="Renseignés par les responsables du club. Signalez une erreur à l'un d'eux.">
            {quals.length === 0 ? <p className="text-sm text-muted">Aucun diplôme enregistré. Demandez à un responsable de les ajouter pour voir les remplacements qui vous correspondent.</p> : (
              <ul className="divide-y divide-line">
                {quals.map((uq) => {
                  const q = db.qualifications.find((x) => x.id === uq.qualificationId)
                  return (
                    <li key={uq.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                      <div><p className="font-semibold text-ink">{q?.short}</p><p className="text-[13px] text-muted">{q?.label}</p></div>
                      <ExpiryBadge expiresOn={uq.expiresOn} />
                    </li>
                  )
                })}
              </ul>
            )}
          </Panel>

          <Panel title="Apparence">
            <Segmented label="Thème" value={theme} onChange={(v) => { setThemeState(v); setTheme(v) }} options={[{ value: 'system', label: 'Système' }, { value: 'light', label: 'Clair' }, { value: 'dark', label: 'Sombre' }]} />
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Adresse e-mail">
            <form onSubmit={saveEmail} className="space-y-4" noValidate>
              <FormError>{emailErr}</FormError>
              <Field label="Nouvelle adresse" htmlFor="e-new"><Input id="e-new" type="email" autoComplete="email" value={email.value} onChange={(e) => setEmail({ ...email, value: e.target.value })} /></Field>
              <Field label="Mot de passe actuel" htmlFor="e-pwd" hint="Pour confirmer qu'il s'agit bien de vous."><Input id="e-pwd" type="password" autoComplete="current-password" value={email.password} onChange={(e) => setEmail({ ...email, password: e.target.value })} /></Field>
              <Button type="submit" variant="secondary" disabled={!email.value || !email.password}>Modifier l'adresse</Button>
            </form>
          </Panel>

          <Panel title="Mot de passe">
            <form onSubmit={savePwd} className="space-y-4" noValidate>
              <FormError>{pwdErr}</FormError>
              <Field label="Mot de passe actuel" htmlFor="pw-cur"><Input id="pw-cur" type="password" autoComplete="current-password" value={pwd.current} onChange={(e) => setPwd({ ...pwd, current: e.target.value })} /></Field>
              <Field label="Nouveau mot de passe" htmlFor="pw-new" hint="8 caractères minimum."><Input id="pw-new" type="password" autoComplete="new-password" value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} /></Field>
              <Field label="Confirmer le nouveau mot de passe" htmlFor="pw-conf"><Input id="pw-conf" type="password" autoComplete="new-password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} /></Field>
              <Button type="submit" variant="secondary" disabled={!pwd.current || !pwd.next}>Modifier le mot de passe</Button>
            </form>
          </Panel>

          {ctx.demo && (
            <Panel title="Données de démonstration">
              <p className="text-sm text-ink-2">Les données de la démo sont stockées dans ce navigateur uniquement.</p>
              <Button className="mt-3" variant="danger" onClick={async () => {
                if (await confirm({ title: 'Réinitialiser la démo ?', body: 'Toutes vos modifications seront effacées.', confirmLabel: 'Réinitialiser la démo' })) { await resetStore(); navigate('/connexion') }
              }}>Réinitialiser la démo</Button>
            </Panel>
          )}
        </div>
      </div>
    </>
  )
}
