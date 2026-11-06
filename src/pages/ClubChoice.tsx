import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronRight, Clock, LogOut, Search } from 'lucide-react'
import { Logo } from '../components/Logo'
import { Badge, Button, EmptyState, Field, FormError, Input, Panel } from '../components/ui'
import { useAction, useConfirm } from '../components/feedback'
import { approvedMembers, cancelJoinRequest, createClub, logout, requestJoin, selectClub } from '../data/api'
import { useCurrentUser } from '../data/hooks'
import { useWholeDB } from '../data/store'
import { BASE_PRICE, euros } from '../lib/pricing'
import { normalize, pluralize } from '../lib/util'
import { safeSuite } from './public/Auth'

export default function ClubChoice() {
  const db = useWholeDB()
  const user = useCurrentUser()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const run = useAction()
  const confirm = useConfirm()
  const [query, setQuery] = useState('')
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [createError, setCreateError] = useState<string | null>(null)

  const mine = useMemo(() => (user ? db.memberships.filter((m) => m.userId === user.id) : []), [db, user])
  const approved = mine.filter((m) => m.status === 'approved')
  const pending = mine.filter((m) => m.status === 'pending')
  const others = db.clubs
    .filter((c) => !mine.some((m) => m.clubId === c.id))
    .filter((c) => !query || normalize(`${c.name} ${c.city ?? ''}`).includes(normalize(query)))

  if (!user) return null

  // Revient sur la page demandée avant la connexion (?suite=), sinon sur le tableau de bord.
  const open = (clubId: string) => run(() => { selectClub(clubId); navigate(safeSuite(params.get('suite')) ?? '/app') })
  const create = async (e: FormEvent) => {
    e.preventDefault()
    setCreateError(null)
    try {
      createClub(name, city)
      navigate('/app')
    } catch (err) {
      setCreateError((err as Error).message)
    }
  }

  return (
    <div className="min-h-dvh bg-bg">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-4 sm:px-6">
          <Logo to="/clubs" />
          <Button variant="ghost" icon={LogOut} onClick={logout}>Se déconnecter</Button>
        </div>
      </header>
      <main className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="display-md text-[34px] text-ink sm:text-[42px]">Bonjour {user.firstname}, choisissez votre club</h1>
        <p className="mt-2 text-[15px] text-ink-2">Un seul compte pour tous vos clubs : les plannings restent séparés.</p>

        <section aria-labelledby="mes-clubs" className="mt-10">
          <h2 id="mes-clubs" className="text-lg font-bold text-ink">Mes clubs</h2>
          {approved.length === 0 && pending.length === 0 ? (
            <p className="mt-3 text-[15px] text-muted">Vous n'êtes inscrit dans aucun club pour l'instant. Rejoignez celui de votre structure ou créez le vôtre ci-dessous.</p>
          ) : (
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {approved.map((m) => {
                const club = db.clubs.find((c) => c.id === m.clubId)!
                const role = m.isAdmin ? 'Administrateur' : db.roles.find((r) => r.id === m.roleId)?.name ?? 'Éducateur'
                return (
                  <li key={m.id}>
                    <button type="button" onClick={() => open(club.id)} className="group flex w-full items-center gap-4 rounded-xl border border-line bg-surface p-4 text-left transition-colors hover:border-water-bright sm:p-5">
                      <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-ink text-lg font-extrabold text-surface">
                        {club.name.split(/\s+/).filter((w) => w.length > 2).slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-bold text-ink">{club.name}</span>
                        <span className="mt-0.5 block text-sm text-muted">{role}, {pluralize(approvedMembers(db, club.id).length, 'membre')}{club.city ? `, ${club.city}` : ''}</span>
                      </span>
                      <ChevronRight aria-hidden className="size-5 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
                    </button>
                  </li>
                )
              })}
              {pending.map((m) => {
                const club = db.clubs.find((c) => c.id === m.clubId)!
                return (
                  <li key={m.id} className="flex items-center gap-4 rounded-xl border border-dashed border-line-strong bg-surface/60 p-4 sm:p-5">
                    <Clock aria-hidden className="size-5 shrink-0 text-buoy" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold text-ink">{club.name}</span>
                      <span className="mt-0.5 block text-sm text-muted">Demande envoyée, en attente de validation par un responsable.</span>
                    </span>
                    <Button size="sm" variant="ghost" onClick={async () => {
                      if (await confirm({ title: `Annuler la demande pour ${club.name} ?`, confirmLabel: 'Annuler la demande' })) run(() => cancelJoinRequest(club.id), 'Demande annulée.')
                    }}>Annuler</Button>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel title="Rejoindre un club" description="Votre demande sera validée par un responsable du club.">
            <div className="relative">
              <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <Input aria-label="Rechercher un club" placeholder="Nom du club ou ville" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
            </div>
            {others.length === 0 ? (
              <EmptyState compact title={query ? 'Aucun club ne correspond' : 'Aucun autre club disponible'}>
                {query ? 'Vérifiez l’orthographe, ou créez le club s’il n’existe pas encore.' : 'Créez votre club pour commencer.'}
              </EmptyState>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {others.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{c.name}</p>
                      {c.city && <p className="text-sm text-muted">{c.city}</p>}
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => run(() => requestJoin(c.id), `Demande envoyée à ${c.name}.`)}>Demander l'accès</Button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Créer un club" description={<>6 premiers mois avec 5 accès inclus pour {euros(BASE_PRICE)} par mois. Vous en serez l'administrateur.</>}>
            <form onSubmit={create} className="space-y-4" noValidate>
              <FormError>{createError}</FormError>
              <Field label="Nom du club" htmlFor="club-name">
                <Input id="club-name" placeholder="Ex. Cercle des nageurs de Lyon" value={name} onChange={(e) => { setName(e.target.value); setCreateError(null) }} />
              </Field>
              <Field label="Ville" htmlFor="club-city" optional>
                <Input id="club-city" value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" />
              </Field>
              <div className="flex items-center gap-3">
                <Button type="submit">Créer le club</Button>
                <Badge tone="water">Sans engagement</Badge>
              </div>
            </form>
          </Panel>
        </div>
      </main>
    </div>
  )
}
