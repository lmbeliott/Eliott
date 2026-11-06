import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronRight, Users } from 'lucide-react'
import { Button, Field, Input, LinkButton, PageHeader, Skeleton, cx } from '../components/ui'
import { useToast } from '../components/Toast'
import { useAuth } from '../lib/auth'
import { plural, useI18n } from '../lib/i18n'
import { useMyGroups } from '../lib/queries'
import { errorText, supabase, type Group } from '../lib/supabase'

export const KIND_LABEL: Record<Group['kind'], [string, string]> = {
  classe: ['Classe', 'Class'],
  etablissement: ['Établissement', 'School'],
  amis: ['Amis', 'Friends'],
}

export function Groups() {
  const { lang, t } = useI18n()
  const { session, ready } = useAuth()
  const params = useParams()
  const groups = useMyGroups()
  const qc = useQueryClient()
  const toast = useToast()
  const navigate = useNavigate()

  const [code, setCode] = useState((params.code ?? '').toUpperCase())
  const [joinError, setJoinError] = useState<string | null>(null)
  const [joining, setJoining] = useState(false)
  const [name, setName] = useState('')
  const [kind, setKind] = useState<Group['kind']>('classe')
  const [nameError, setNameError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (params.code) setCode(params.code.toUpperCase())
  }, [params.code])

  if (ready && !session) {
    return (
      <div className="mx-auto max-w-[1080px] px-4 py-10 sm:px-6">
        <PageHeader
          title={t('Groupes', 'Groups')}
          lead={t(
            'Un groupe, c’est une classe, un établissement ou des amis. Il a son propre classement, et l’encadrant suit la progression de chacun.',
            'A group climbs together: a class, a school or friends. It has its own leaderboard, and the teacher can follow everyone’s progress.',
          )}
        />
        <div className="rounded-xl border border-line bg-surface p-6">
          <p className="font-medium">
            {params.code
              ? t(`Connecte-toi pour rejoindre le groupe ${params.code.toUpperCase()}.`, `Sign in to join group ${params.code.toUpperCase()}.`)
              : t('Connecte-toi pour créer ou rejoindre un groupe.', 'Sign in to create or join a group.')}
          </p>
          <div className="mt-4 flex gap-2">
            <LinkButton to={`/connexion?retour=${encodeURIComponent(window.location.pathname.replace(import.meta.env.BASE_URL.replace(/\/$/, ''), ''))}`}>
              {t('Se connecter', 'Sign in')}
            </LinkButton>
            <LinkButton to="/inscription" variant="secondary">
              {t('Créer un compte', 'Sign up')}
            </LinkButton>
          </div>
        </div>
      </div>
    )
  }

  const join = async (e: FormEvent) => {
    e.preventDefault()
    const c = code.trim().toUpperCase()
    if (!/^[A-Z2-9]{6}$/.test(c)) {
      setJoinError(t('Le code fait 6 caractères (lettres et chiffres).', 'The code is 6 characters long (letters and digits).'))
      return
    }
    setJoining(true)
    const { data, error } = await supabase.rpc('join_group', { p_code: c })
    setJoining(false)
    if (error) {
      setJoinError(errorText(error, lang))
      return
    }
    await qc.invalidateQueries({ queryKey: ['groups'] })
    const g = data as Group
    toast(t(`Tu as rejoint « ${g.name} ».`, `You joined “${g.name}”.`), 'ok')
    navigate(`/groupes/${g.id}`)
  }

  const create = async (e: FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2) {
      setNameError(t('Donne un nom d’au moins 2 caractères.', 'Use a name of at least 2 characters.'))
      return
    }
    setCreating(true)
    const { data, error } = await supabase.rpc('create_group', { p_name: name.trim(), p_kind: kind })
    setCreating(false)
    if (error) {
      setNameError(errorText(error, lang))
      return
    }
    await qc.invalidateQueries({ queryKey: ['groups'] })
    const g = data as Group
    toast(t(`Groupe « ${g.name} » créé. Partage le code ${g.join_code}.`, `Group “${g.name}” created. Share the code ${g.join_code}.`), 'ok')
    navigate(`/groupes/${g.id}`)
  }

  return (
    <div className="mx-auto max-w-[1080px] px-4 py-10 sm:px-6">
      <PageHeader title={t('Groupes', 'Groups')} lead={t('Ta classe, ton établissement, tes amis : chaque groupe a son classement.', 'Your class, your school, your friends: each group has its own leaderboard.')} />

      <section aria-labelledby="mes-cordees">
        <h2 id="mes-cordees" className="text-lg font-semibold">
          {t('Mes groupes', 'My groups')}
        </h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-line bg-surface">
          {groups.isLoading ? (
            <Skeleton className="m-4 h-12" />
          ) : groups.data?.length ? (
            <ul>
              {groups.data.map((g) => (
                <li key={g.id} className="border-b border-line last:border-0">
                  <Link to={`/groupes/${g.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-2">
                    <Users className="size-5 shrink-0 text-muted" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{g.name}</span>
                      <span className="block text-sm text-muted">
                        {KIND_LABEL[g.kind][lang === 'en' ? 1 : 0]}, {plural(lang, g.members, ['membre', 'membres'], ['member', 'members'])}
                        {g.role === 'encadrant' && `, ${t('tu encadres', 'you lead it')}`}
                      </span>
                    </span>
                    <ChevronRight className="size-5 text-muted" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-4 text-sm text-ink-2">{t('Tu ne fais partie d’aucun groupe pour l’instant. Rejoins-en un avec un code, ou crée le tien.', 'You are not in any group yet. Join one with a code, or create your own.')}</p>
          )}
        </div>
      </section>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <form onSubmit={join} noValidate className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-6" aria-labelledby="rejoindre">
          <h2 id="rejoindre" className="text-lg font-semibold">
            {t('Rejoindre un groupe', 'Join a group')}
          </h2>
          <Field label={t('Code du groupe', 'Group code')} htmlFor="code" error={joinError} hint={t('6 caractères, donnés par ton prof ou un ami.', '6 characters, from your teacher or a friend.')}>
            <Input
              id="code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))
                setJoinError(null)
              }}
              autoComplete="off"
              autoFocus={!!params.code}
              aria-invalid={!!joinError}
              aria-describedby={joinError ? 'code-error' : 'code-hint'}
              className="font-mono text-lg tracking-[0.3em] uppercase"
            />
          </Field>
          <Button type="submit" loading={joining} className="self-start">
            {t('Rejoindre', 'Join')}
          </Button>
        </form>

        <form onSubmit={create} noValidate className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-6" aria-labelledby="creer">
          <h2 id="creer" className="text-lg font-semibold">
            {t('Créer un groupe', 'Create a group')}
          </h2>
          <Field label={t('Nom', 'Name')} htmlFor="nom-cordee" error={nameError} hint={t('Par exemple : 2nde B, lycée Jean Moulin', 'For example: Year 10 B, Jean Moulin High')}>
            <Input
              id="nom-cordee"
              value={name}
              maxLength={60}
              onChange={(e) => {
                setName(e.target.value)
                setNameError(null)
              }}
              onBlur={() => name && name.trim().length < 2 && setNameError(t('Donne un nom d’au moins 2 caractères.', 'Use a name of at least 2 characters.'))}
              aria-invalid={!!nameError}
              aria-describedby={nameError ? 'nom-cordee-error' : 'nom-cordee-hint'}
            />
          </Field>
          <fieldset>
            <legend className="text-sm font-medium">{t('Type', 'Type')}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(KIND_LABEL) as Group['kind'][]).map((k) => (
                <label key={k} className={cx('flex h-9 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm', kind === k ? 'border-ink bg-surface-2' : 'border-line')}>
                  <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} className="accent-[var(--ink)]" />
                  {KIND_LABEL[k][lang === 'en' ? 1 : 0]}
                </label>
              ))}
            </div>
          </fieldset>
          <Button type="submit" loading={creating} className="self-start">
            {t('Créer le groupe', 'Create the group')}
          </Button>
        </form>
      </div>
    </div>
  )
}
