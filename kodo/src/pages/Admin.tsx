// Panneau d'administration. Accès : compte « admin » + double authentification (TOTP).
// Les droits sont vérifiés par le serveur à chaque appel ; cette page ne fait qu'afficher.
import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Ban, Code2, Search, ShieldCheck, Trash2, UserCog } from 'lucide-react'
import { Button, Field, Input, Notice, PageHeader, Panel, PanelHeader, Segmented, Select, Skeleton, Spinner, Stat, Tabs, cx, inputClass } from '../components/ui'
import { useToast } from '../components/Toast'
import { UserAvatar } from '../components/UserAvatar'
import { useAuth } from '../lib/auth'
import { errorText } from '../lib/supabase'
import {
  enrollTotp,
  submissionCode,
  useAdminAction,
  useAdminCommunity,
  useAdminGroups,
  useAdminLog,
  useAdminReports,
  useAdminUser,
  useAdminUsers,
  useAnnouncement,
  useMfa,
  useOverview,
  verifyTotp,
  type Enrollment,
} from '../lib/admin'
import { NotFound } from './NotFound'

const date = (s: string | null | undefined) => (s ? new Date(s).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—')
const dateTime = (s: string | null | undefined) =>
  s ? new Date(s).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'
const nb = (n: number) => n.toLocaleString('fr-FR')
const isBanned = (until: string | null) => !!until && new Date(until) > new Date()
const forever = (until: string) => new Date(until).getFullYear() - new Date().getFullYear() > 50

/** Lance une action serveur et affiche le résultat dans un message. */
function useRun() {
  const act = useAdminAction()
  const toast = useToast()
  const [busy, setBusy] = useState<string | null>(null)
  const run = async (key: string, fn: string, args: Record<string, unknown>, done: string) => {
    setBusy(key)
    try {
      await act(fn, args)
      toast(done, 'ok')
      return true
    } catch (e) {
      toast(errorText(e, 'fr'), 'error')
      return false
    } finally {
      setBusy(null)
    }
  }
  return { run, busy }
}

/** Bouton en deux temps : un premier clic demande confirmation. */
function ConfirmButton({ label, confirm, onConfirm, busy, danger }: { label: ReactNode; confirm: string; onConfirm: () => void; busy?: boolean; danger?: boolean }) {
  const [asking, setAsking] = useState(false)
  if (!asking)
    return (
      <Button size="sm" variant="secondary" onClick={() => setAsking(true)} disabled={busy}>
        {label}
      </Button>
    )
  return (
    <span className="inline-flex items-center gap-1.5">
      <Button size="sm" variant="ghost" onClick={() => setAsking(false)}>
        Annuler
      </Button>
      <Button
        size="sm"
        variant={danger ? 'danger' : 'primary'}
        loading={busy}
        onClick={() => {
          setAsking(false)
          onConfirm()
        }}
      >
        {confirm}
      </Button>
    </span>
  )
}

// ------------------------------------------------------------------ Double authentification

function MfaGate({ children }: { children: ReactNode }) {
  const { state, refresh } = useMfa()
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (state.step === 'loading')
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner label="Vérification de la session…" />
      </div>
    )
  if (state.step === 'ok') return <>{children}</>
  if (state.step === 'error') return <Notice tone="error">{state.message}</Notice>

  const factorId = state.step === 'challenge' ? state.factorId : enrollment?.factorId
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!factorId) return
    setBusy(true)
    setError(null)
    try {
      await verifyTotp(factorId, code)
      setCode('')
      await refresh()
    } catch (err) {
      setError(/invalid|expired/i.test((err as Error).message) ? 'Code incorrect ou expiré. Saisir le code affiché maintenant.' : errorText(err, 'fr'))
    } finally {
      setBusy(false)
    }
  }
  const start = async () => {
    setBusy(true)
    setError(null)
    try {
      setEnrollment(await enrollTotp())
    } catch (err) {
      setError(errorText(err, 'fr'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Panel className="mx-auto max-w-md p-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="size-5 text-accent" aria-hidden />
        <h2 className="text-lg font-semibold">Double authentification</h2>
      </div>
      {state.step === 'enroll' && !enrollment ? (
        <>
          <p className="mt-3 text-sm text-ink-2">
            Le panneau d’administration exige un second facteur : un code à 6 chiffres généré par une application d’authentification (Google Authenticator, Authy, 1Password, Bitwarden…).
          </p>
          <Button className="mt-5" onClick={start} loading={busy}>
            Configurer l’application
          </Button>
        </>
      ) : (
        <form onSubmit={submit} className="mt-3">
          {enrollment && (
            <>
              <p className="text-sm text-ink-2">Scanner ce code avec l’application, puis saisir le code à 6 chiffres affiché.</p>
              <img src={enrollment.qr} alt="QR code de configuration" className="mx-auto mt-4 size-44 rounded-md bg-white p-2" />
              <p className="mt-3 text-xs text-muted">
                Saisie manuelle : <code className="break-all text-ink">{enrollment.secret}</code>
              </p>
            </>
          )}
          {state.step === 'challenge' && <p className="text-sm text-ink-2">Saisir le code à 6 chiffres de l’application d’authentification.</p>}
          <div className="mt-4">
            <Field label="Code" htmlFor="mfa-code" error={error}>
              <Input
                id="mfa-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                maxLength={7}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^\d ]/g, ''))}
                className="tabular tracking-[0.3em]"
              />
            </Field>
          </div>
          <Button type="submit" className="mt-4 w-full" loading={busy} disabled={code.replace(/\s/g, '').length !== 6}>
            Valider
          </Button>
        </form>
      )}
    </Panel>
  )
}

// ------------------------------------------------------------------ Vue d'ensemble

function OverviewTab() {
  const q = useOverview()
  if (q.isError) return <Notice tone="error">{errorText(q.error, 'fr')}</Notice>
  if (!q.data) return <Skeleton className="h-64" />
  const o = q.data
  const max = Math.max(1, ...o.days.map((d) => d.active))
  return (
    <div className="flex flex-col gap-6">
      <Panel className="p-5">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
          <Stat label="Comptes" value={nb(o.users)} detail={`+${nb(o.users_7d)} en 7 jours`} />
          <Stat label="Actifs aujourd’hui" value={nb(o.active_today)} detail={`${nb(o.active_7d)} sur 7 jours`} />
          <Stat label="Soumissions (24 h)" value={nb(o.submissions_24h)} detail={`${nb(o.solves_24h)} réussites`} />
          <Stat label="Réussites au total" value={nb(o.solves)} />
          <Stat label="Communauté" value={nb(o.community_published)} detail={`${nb(o.community_hidden)} masqués`} />
          <Stat label="Signalements" value={nb(o.reports)} />
          <Stat label="Groupes" value={nb(o.groups)} />
          <Stat label="Équipe / suspendus" value={`${nb(o.moderators)} / ${nb(o.banned)}`} detail="modérateurs / comptes suspendus" />
        </dl>
      </Panel>
      <Panel>
        <PanelHeader title="14 derniers jours" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="text-left text-xs text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Jour</th>
                <th className="px-4 py-2 font-medium">Actifs</th>
                <th className="px-4 py-2 text-right font-medium">Inscriptions</th>
                <th className="px-4 py-2 text-right font-medium">Soumissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {[...o.days].reverse().map((d) => (
                <tr key={d.day}>
                  <td className="px-4 py-2 tabular">{new Date(d.day).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</td>
                  <td className="px-4 py-2">
                    <span className="flex items-center gap-2">
                      <span className="h-2 rounded-full bg-accent" style={{ width: `${Math.max(2, (d.active / max) * 160)}px` }} />
                      <span className="tabular">{d.active}</span>
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right tabular">{d.signups}</td>
                  <td className="px-4 py-2 text-right tabular">{d.submissions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

// ------------------------------------------------------------------ Comptes

function StaffTag({ staff, moderator, banned }: { staff: string | null; moderator: boolean; banned: boolean }) {
  return (
    <span className="flex flex-wrap gap-1">
      {staff === 'admin' && <span className="rounded bg-accent-soft px-1.5 py-0.5 text-xs font-medium text-accent">admin</span>}
      {(staff === 'moderateur' || moderator) && <span className="rounded bg-surface-2 px-1.5 py-0.5 text-xs font-medium">modération</span>}
      {banned && <span className="rounded bg-bad-soft px-1.5 py-0.5 text-xs font-medium text-bad">suspendu</span>}
    </span>
  )
}

function UsersTab() {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'recent' | 'staff' | 'banned'>('all')
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const q = useAdminUsers(query, filter, page)
  useEffect(() => setPage(0), [query, filter])

  if (selected) return <UserDetail id={selected} onBack={() => setSelected(null)} />
  const total = q.data?.[0]?.total ?? 0
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form
          className="flex w-full max-w-md gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            setQuery(search.trim())
          }}
        >
          <label htmlFor="admin-search" className="sr-only">
            Rechercher un compte
          </label>
          <Input id="admin-search" placeholder="pseudo, nom ou e-mail" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button type="submit" variant="secondary">
            <Search className="size-4" aria-hidden /> Rechercher
          </Button>
        </form>
        <Segmented
          label="Filtre"
          size="sm"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'Tous' },
            { value: 'recent', label: 'Récents' },
            { value: 'staff', label: 'Équipe' },
            { value: 'banned', label: 'Suspendus' },
          ]}
        />
      </div>
      {q.isError && <Notice tone="error">{errorText(q.error, 'fr')}</Notice>}
      <Panel className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="text-left text-xs text-muted">
            <tr className="border-b border-line">
              <th className="px-4 py-2.5 font-medium">Compte</th>
              <th className="px-4 py-2.5 font-medium">E-mail</th>
              <th className="px-4 py-2.5 text-right font-medium">Points</th>
              <th className="px-4 py-2.5 text-right font-medium">Réussites</th>
              <th className="px-4 py-2.5 font-medium">Inscription</th>
              <th className="px-4 py-2.5 font-medium">Dernière connexion</th>
              <th className="px-4 py-2.5 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {!q.data &&
              Array.from({ length: 6 }, (_, i) => (
                <tr key={i}>
                  <td colSpan={7} className="px-4 py-2.5">
                    <Skeleton className="h-5" />
                  </td>
                </tr>
              ))}
            {q.data?.map((u) => (
              <tr key={u.id} className="cursor-pointer hover:bg-surface-2" onClick={() => setSelected(u.id)}>
                <td className="px-4 py-2.5">
                  <button type="button" className="text-left font-medium hover:underline" onClick={() => setSelected(u.id)}>
                    {u.display_name}
                  </button>
                  <div className="text-xs text-muted">@{u.username}</div>
                </td>
                <td className="max-w-[220px] truncate px-4 py-2.5 text-ink-2">{u.email}</td>
                <td className="px-4 py-2.5 text-right tabular">{nb(u.xp)}</td>
                <td className="px-4 py-2.5 text-right tabular">{nb(u.solved_count)}</td>
                <td className="px-4 py-2.5 text-ink-2">{date(u.created_at)}</td>
                <td className="px-4 py-2.5 text-ink-2">{dateTime(u.last_sign_in_at)}</td>
                <td className="px-4 py-2.5">
                  <StaffTag staff={u.staff} moderator={u.moderator} banned={isBanned(u.banned_until)} />
                </td>
              </tr>
            ))}
            {q.data?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-2">
                  Aucun compte ne correspond.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>
      {total > 50 && (
        <div className="flex items-center justify-between text-sm text-ink-2">
          <span>
            {page * 50 + 1}–{Math.min(total, page * 50 + 50)} sur {nb(total)}
          </span>
          <span className="flex gap-2">
            <Button size="sm" variant="secondary" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              Précédents
            </Button>
            <Button size="sm" variant="secondary" disabled={(page + 1) * 50 >= total} onClick={() => setPage((p) => p + 1)}>
              Suivants
            </Button>
          </span>
        </div>
      )}
    </div>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 py-1.5 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  )
}

function UserDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const q = useAdminUser(id)
  const { run, busy } = useRun()
  const [banDays, setBanDays] = useState('7')
  const [banReason, setBanReason] = useState('')
  const [rename, setRename] = useState('')
  const [clear, setClear] = useState(false)
  const [typed, setTyped] = useState('')
  const [code, setCode] = useState<{ id: number; text: string } | null>(null)
  const toast = useToast()

  if (q.isError)
    return (
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" className="self-start" onClick={onBack}>
          <ArrowLeft className="size-4" aria-hidden /> Comptes
        </Button>
        <Notice tone="error">{errorText(q.error, 'fr')}</Notice>
      </div>
    )
  if (!q.data) return <Skeleton className="h-96" />
  const u = q.data
  const banned = isBanned(u.banned_until)
  const protectedAccount = u.staff === 'admin'
  const showCode = async (sid: number) => {
    try {
      setCode({ id: sid, text: await submissionCode(sid) })
    } catch (e) {
      toast(errorText(e, 'fr'), 'error')
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Button variant="ghost" size="sm" className="self-start" onClick={onBack}>
        <ArrowLeft className="size-4" aria-hidden /> Comptes
      </Button>
      <div className="flex items-center gap-4">
        <UserAvatar avatar={u.avatar} seed={u.id} size={48} />
        <div className="min-w-0">
          <h2 className="truncate text-xl font-semibold">{u.display_name}</h2>
          <p className="text-sm text-muted">
            <Link to={`/profil/${u.username}`} className="hover:underline">
              @{u.username}
            </Link>
          </p>
        </div>
        <StaffTag staff={u.staff} moderator={u.moderator} banned={banned} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel className="p-5">
          <dl className="divide-y divide-line">
            <Row label="E-mail">{u.email}</Row>
            <Row label="E-mail confirmé">{u.email_confirmed_at ? date(u.email_confirmed_at) : 'non'}</Row>
            <Row label="Inscription">{date(u.created_at)}</Row>
            <Row label="Dernière connexion">{dateTime(u.last_sign_in_at)}</Row>
            <Row label="Double auth.">{u.mfa > 0 ? 'activée' : 'non'}</Row>
            <Row label="Points">{nb(u.xp)}</Row>
            <Row label="Réussites">{nb(u.solved_count)}</Row>
            <Row label="Soumissions">{nb(u.submissions_total)}</Row>
            <Row label="Indices ouverts">{nb(u.hints)}</Row>
            <Row label="Meilleure série">{u.best_streak} jours</Row>
            <Row label="Établissement">{u.school ?? '—'}</Row>
            <Row label="Groupes">{u.groups.length ? u.groups.map((g) => `${g.name}${g.owner ? ' (créateur)' : ''}`).join(', ') : '—'}</Row>
            {u.ban && (
              <Row label="Suspension">
                {forever(u.ban.until) ? 'définitive' : `jusqu’au ${dateTime(u.ban.until)}`} — {u.ban.reason}
              </Row>
            )}
          </dl>
        </Panel>

        <Panel className="flex flex-col gap-5 p-5">
          {protectedAccount ? (
            <p className="text-sm text-ink-2">Compte administrateur : aucune action possible depuis le panneau.</p>
          ) : (
            <>
              <section>
                <h3 className="text-sm font-semibold">Modération</h3>
                <p className="mt-1 text-sm text-ink-2">Un modérateur voit et masque les problèmes de la communauté signalés.</p>
                <div className="mt-2">
                  <ConfirmButton
                    label={<><UserCog className="size-4" aria-hidden /> {u.moderator ? 'Retirer de la modération' : 'Nommer modérateur'}</>}
                    confirm={u.moderator ? 'Confirmer le retrait' : 'Confirmer la nomination'}
                    busy={busy === 'mod'}
                    onConfirm={() => run('mod', 'admin_set_moderator', { p_id: u.id, p_on: !u.moderator }, u.moderator ? 'Modérateur retiré.' : 'Modérateur nommé.')}
                  />
                </div>
              </section>

              <section className="border-t border-line pt-5">
                <h3 className="text-sm font-semibold">Suspension</h3>
                {banned ? (
                  <div className="mt-2">
                    <ConfirmButton label="Lever la suspension" confirm="Confirmer" busy={busy === 'unban'} onConfirm={() => run('unban', 'admin_unban', { p_id: u.id }, 'Suspension levée.')} />
                  </div>
                ) : (
                  <form
                    className="mt-2 flex flex-col gap-3"
                    onSubmit={async (e) => {
                      e.preventDefault()
                      if (await run('ban', 'admin_ban', { p_id: u.id, p_days: banDays === 'perm' ? null : Number(banDays), p_reason: banReason }, 'Compte suspendu.')) setBanReason('')
                    }}
                  >
                    <p className="text-sm text-ink-2">Connexion bloquée, sessions fermées, soumissions refusées, retrait des classements.</p>
                    <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
                      <Field label="Durée" htmlFor="ban-days">
                        <Select id="ban-days" value={banDays} onChange={(e) => setBanDays(e.target.value)}>
                          <option value="1">1 jour</option>
                          <option value="7">7 jours</option>
                          <option value="30">30 jours</option>
                          <option value="365">1 an</option>
                          <option value="perm">Définitive</option>
                        </Select>
                      </Field>
                      <Field label="Motif" htmlFor="ban-reason">
                        <Input id="ban-reason" maxLength={500} value={banReason} onChange={(e) => setBanReason(e.target.value)} placeholder="ex. triche, pseudo injurieux" />
                      </Field>
                    </div>
                    <Button type="submit" variant="danger" size="sm" className="self-start" loading={busy === 'ban'} disabled={!banReason.trim()}>
                      <Ban className="size-4" aria-hidden /> Suspendre
                    </Button>
                  </form>
                )}
              </section>

              <section className="border-t border-line pt-5">
                <h3 className="text-sm font-semibold">Profil</h3>
                <form
                  className="mt-2 flex flex-col gap-3"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    if (await run('profile', 'admin_edit_profile', { p_id: u.id, p_username: rename.trim(), p_clear: clear }, 'Profil modifié.')) {
                      setRename('')
                      setClear(false)
                    }
                  }}
                >
                  <Field label="Nouveau pseudo" htmlFor="rename" hint="3 à 20 caractères : minuscules, chiffres ou _.">
                    <Input id="rename" value={rename} onChange={(e) => setRename(e.target.value.toLowerCase())} pattern="[a-z0-9_]{3,20}" placeholder={u.username} />
                  </Field>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={clear} onChange={(e) => setClear(e.target.checked)} className="size-4 accent-[var(--accent)]" />
                    Effacer le nom affiché, l’établissement et l’avatar
                  </label>
                  <Button type="submit" size="sm" variant="secondary" className="self-start" loading={busy === 'profile'} disabled={!rename.trim() && !clear}>
                    Enregistrer
                  </Button>
                </form>
              </section>

              <section className="border-t border-line pt-5">
                <h3 className="text-sm font-semibold text-bad">Zone sensible</h3>
                <p className="mt-1 text-sm text-ink-2">
                  Saisir <code className="text-ink">{u.username}</code> pour activer ces actions.
                </p>
                <label htmlFor="typed" className="sr-only">
                  Pseudo du compte
                </label>
                <Input id="typed" className="mt-2 max-w-xs" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" />
                <div className="mt-3 flex flex-wrap gap-2">
                  <ConfirmButton
                    label="Remettre la progression à zéro"
                    confirm="Effacer réussites et points"
                    danger
                    busy={busy === 'reset' || typed !== u.username}
                    onConfirm={() => run('reset', 'admin_reset_progress', { p_id: u.id }, 'Progression remise à zéro.')}
                  />
                  <ConfirmButton
                    label={<><Trash2 className="size-4" aria-hidden /> Supprimer le compte</>}
                    confirm="Supprimer définitivement"
                    danger
                    busy={busy === 'delete' || typed !== u.username}
                    onConfirm={async () => {
                      if (await run('delete', 'admin_delete_user', { p_id: u.id }, 'Compte supprimé.')) onBack()
                    }}
                  />
                </div>
              </section>
            </>
          )}
        </Panel>
      </div>

      <Panel>
        <PanelHeader title={`Dernières soumissions (${nb(u.submissions_total)})`} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <tbody className="divide-y divide-line">
              {u.submissions.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-2">
                    <Link to={`/probleme/${s.problem_id}`} className="hover:underline">
                      {s.problem_id}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-ink-2">{s.language === 'cpp' ? 'C++' : 'Python'}</td>
                  <td className={cx('px-4 py-2', s.verdict === 'accepted' ? 'text-ok' : 'text-ink-2')}>
                    {s.verdict} {s.total > 0 && <span className="tabular text-muted">({s.passed}/{s.total})</span>}
                  </td>
                  <td className="px-4 py-2 text-ink-2">{dateTime(s.created_at)}</td>
                  <td className="px-4 py-2 text-right">
                    <Button size="sm" variant="ghost" onClick={() => showCode(s.id)}>
                      <Code2 className="size-4" aria-hidden /> Code
                    </Button>
                  </td>
                </tr>
              ))}
              {u.submissions.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-ink-2">Aucune soumission.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {code && (
          <div className="border-t border-line p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Soumission n° {code.id}</p>
              <Button size="sm" variant="ghost" onClick={() => setCode(null)}>
                Fermer
              </Button>
            </div>
            <pre className="mt-2 max-h-96 overflow-auto rounded-md bg-surface-2 p-3 font-mono text-xs leading-relaxed">{code.text}</pre>
          </div>
        )}
      </Panel>

      {u.community.length > 0 && (
        <Panel>
          <PanelHeader title="Problèmes proposés" />
          <ul className="divide-y divide-line text-sm">
            {u.community.map((c) => (
              <li key={c.id} className="flex items-center justify-between px-4 py-2">
                <Link to={`/communaute/${c.id}`} className="hover:underline">
                  {c.title}
                </Link>
                <span className="text-ink-2">{c.status}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  )
}

// ------------------------------------------------------------------ Communauté

const STATUS: Record<string, string> = { published: 'publié', hidden: 'masqué', withdrawn: 'retiré par l’auteur' }
const REASON: Record<string, string> = { incorrect: 'incorrect', copie: 'copie', inapproprie: 'inapproprié', autre: 'autre' }

function CommunityTab() {
  const [status, setStatus] = useState<'all' | 'published' | 'hidden' | 'withdrawn'>('all')
  const q = useAdminCommunity(status)
  const reports = useAdminReports()
  const { run, busy } = useRun()
  return (
    <div className="flex flex-col gap-6">
      <Panel>
        <PanelHeader title={`Signalements${reports.data ? ` (${reports.data.length})` : ''}`} />
        {reports.isError && <div className="p-4"><Notice tone="error">{errorText(reports.error, 'fr')}</Notice></div>}
        {!reports.data && !reports.isError && <div className="p-4"><Skeleton className="h-16" /></div>}
        {reports.data?.length === 0 && <p className="px-4 py-6 text-sm text-ink-2">Aucun signalement en attente.</p>}
        {!!reports.data?.length && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <tbody className="divide-y divide-line">
                {reports.data.map((r) => (
                  <tr key={`${r.problem_id}-${r.reporter}`}>
                    <td className="px-4 py-2">
                      <Link to={`/communaute/${r.problem_id}`} className="font-medium hover:underline">
                        {r.title}
                      </Link>
                      <div className="text-xs text-muted">{STATUS[r.status] ?? r.status}</div>
                    </td>
                    <td className="px-4 py-2 text-ink-2">@{r.reporter}</td>
                    <td className="px-4 py-2">
                      {REASON[r.reason] ?? r.reason}
                      {r.details && <div className="text-xs text-ink-2">{r.details}</div>}
                    </td>
                    <td className="px-4 py-2 text-ink-2">{dateTime(r.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <div className="flex justify-end">
        <Segmented
          label="Statut"
          size="sm"
          value={status}
          onChange={setStatus}
          options={[
            { value: 'all', label: 'Tous' },
            { value: 'published', label: 'Publiés' },
            { value: 'hidden', label: 'Masqués' },
            { value: 'withdrawn', label: 'Retirés' },
          ]}
        />
      </div>
      {q.isError && <Notice tone="error">{errorText(q.error, 'fr')}</Notice>}
      <Panel className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="text-left text-xs text-muted">
            <tr className="border-b border-line">
              <th className="px-4 py-2.5 font-medium">Problème</th>
              <th className="px-4 py-2.5 font-medium">Auteur</th>
              <th className="px-4 py-2.5 font-medium">Statut</th>
              <th className="px-4 py-2.5 text-right font-medium">Signal.</th>
              <th className="px-4 py-2.5 text-right font-medium">Réussites</th>
              <th className="px-4 py-2.5 text-right font-medium">Votes</th>
              <th className="px-4 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {!q.data && !q.isError && (
              <tr>
                <td colSpan={7} className="p-4">
                  <Skeleton className="h-16" />
                </td>
              </tr>
            )}
            {q.data?.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-2.5">
                  <Link to={`/communaute/${c.id}`} className="font-medium hover:underline">
                    {c.title}
                  </Link>
                  <div className="text-xs text-muted">{date(c.created_at)}</div>
                </td>
                <td className="px-4 py-2.5 text-ink-2">@{c.author}</td>
                <td className="px-4 py-2.5">{STATUS[c.status] ?? c.status}</td>
                <td className={cx('px-4 py-2.5 text-right tabular', c.reports > 0 && 'font-semibold text-bad')}>{c.reports}</td>
                <td className="px-4 py-2.5 text-right tabular">{c.solves}</td>
                <td className="px-4 py-2.5 text-right tabular">{c.votes}</td>
                <td className="px-4 py-2.5">
                  <span className="flex flex-wrap gap-1.5">
                    {c.status === 'published' && (
                      <ConfirmButton label="Masquer" confirm="Masquer" busy={busy === `h${c.id}`} onConfirm={() => run(`h${c.id}`, 'admin_set_community_status', { p_id: c.id, p_status: 'hidden' }, 'Problème masqué.')} />
                    )}
                    {c.status === 'hidden' && (
                      <ConfirmButton label="Rétablir" confirm="Rétablir" busy={busy === `p${c.id}`} onConfirm={() => run(`p${c.id}`, 'admin_set_community_status', { p_id: c.id, p_status: 'published' }, 'Problème rétabli, signalements effacés.')} />
                    )}
                    {c.reports > 0 && c.status === 'published' && (
                      <ConfirmButton label="Classer" confirm="Classer les signalements" busy={busy === `r${c.id}`} onConfirm={() => run(`r${c.id}`, 'admin_dismiss_reports', { p_id: c.id }, 'Signalements classés.')} />
                    )}
                    <ConfirmButton label={<Trash2 className="size-4" aria-label="Supprimer" />} confirm="Supprimer" danger busy={busy === `d${c.id}`} onConfirm={() => run(`d${c.id}`, 'admin_delete_community', { p_id: c.id }, 'Problème supprimé.')} />
                  </span>
                </td>
              </tr>
            ))}
            {q.data?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-2">
                  Aucun problème.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  )
}

// ------------------------------------------------------------------ Groupes

function GroupsTab() {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const q = useAdminGroups(query)
  const { run, busy } = useRun()
  return (
    <div className="flex flex-col gap-4">
      <form
        className="flex w-full max-w-md gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          setQuery(search.trim())
        }}
      >
        <label htmlFor="group-search" className="sr-only">
          Rechercher un groupe
        </label>
        <Input id="group-search" placeholder="nom du groupe ou pseudo du créateur" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button type="submit" variant="secondary">
          <Search className="size-4" aria-hidden /> Rechercher
        </Button>
      </form>
      {q.isError && <Notice tone="error">{errorText(q.error, 'fr')}</Notice>}
      <Panel className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-xs text-muted">
            <tr className="border-b border-line">
              <th className="px-4 py-2.5 font-medium">Groupe</th>
              <th className="px-4 py-2.5 font-medium">Type</th>
              <th className="px-4 py-2.5 font-medium">Créateur</th>
              <th className="px-4 py-2.5 text-right font-medium">Membres</th>
              <th className="px-4 py-2.5 font-medium">Création</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {q.data?.map((g) => (
              <tr key={g.id}>
                <td className="px-4 py-2.5 font-medium">{g.name}</td>
                <td className="px-4 py-2.5 text-ink-2">{g.kind}</td>
                <td className="px-4 py-2.5 text-ink-2">@{g.owner}</td>
                <td className="px-4 py-2.5 text-right tabular">{g.members}</td>
                <td className="px-4 py-2.5 text-ink-2">{date(g.created_at)}</td>
                <td className="px-4 py-2.5 text-right">
                  <ConfirmButton label={<Trash2 className="size-4" aria-label="Supprimer" />} confirm="Supprimer le groupe" danger busy={busy === g.id} onConfirm={() => run(g.id, 'admin_delete_group', { p_id: g.id }, 'Groupe supprimé.')} />
                </td>
              </tr>
            ))}
            {q.data?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-2">
                  Aucun groupe.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  )
}

// ------------------------------------------------------------------ Annonce

function AnnouncementTab() {
  const current = useAnnouncement()
  const [text, setText] = useState('')
  const [tone, setTone] = useState<'info' | 'warn'>('info')
  const { run, busy } = useRun()
  useEffect(() => {
    if (current.data) {
      setText(current.data.text)
      setTone(current.data.tone)
    }
  }, [current.data])
  return (
    <Panel className="max-w-2xl p-5">
      <p className="text-sm text-ink-2">Bandeau affiché en haut de toutes les pages, jusqu’à ce que chaque visiteur le ferme.</p>
      <form
        className="mt-4 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          run('ann', 'admin_set_announcement', { p_text: text, p_tone: tone }, text.trim() ? 'Annonce publiée.' : 'Annonce retirée.')
        }}
      >
        <Field label="Texte" htmlFor="ann-text" hint={`${text.length}/300`}>
          <textarea id="ann-text" rows={3} maxLength={300} value={text} onChange={(e) => setText(e.target.value)} className={cx(inputClass, 'h-auto py-2')} />
        </Field>
        <div className="flex flex-wrap items-center gap-3">
          <Segmented label="Ton" size="sm" value={tone} onChange={setTone} options={[{ value: 'info', label: 'Information' }, { value: 'warn', label: 'Alerte' }]} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" loading={busy === 'ann'} disabled={!text.trim()}>
            Publier
          </Button>
          {current.data && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setText('')
                run('ann', 'admin_set_announcement', { p_text: '', p_tone: 'info' }, 'Annonce retirée.')
              }}
            >
              Retirer l’annonce
            </Button>
          )}
        </div>
      </form>
    </Panel>
  )
}

// ------------------------------------------------------------------ Journal

const ACTIONS: Record<string, string> = {
  suspension: 'Suspension',
  levee_suspension: 'Levée de suspension',
  moderateur_ajout: 'Modérateur nommé',
  moderateur_retrait: 'Modérateur retiré',
  profil_modifie: 'Profil modifié',
  progression_remise_a_zero: 'Progression remise à zéro',
  compte_supprime: 'Compte supprimé',
  communaute_hidden: 'Problème masqué',
  communaute_published: 'Problème rétabli',
  communaute_supprime: 'Problème supprimé',
  signalements_classes: 'Signalements classés',
  groupe_supprime: 'Groupe supprimé',
  annonce: 'Annonce',
  lecture_code: 'Lecture de code',
}

function LogTab() {
  const q = useAdminLog()
  if (q.isError) return <Notice tone="error">{errorText(q.error, 'fr')}</Notice>
  if (!q.data) return <Skeleton className="h-64" />
  return (
    <Panel className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="text-left text-xs text-muted">
          <tr className="border-b border-line">
            <th className="px-4 py-2.5 font-medium">Date</th>
            <th className="px-4 py-2.5 font-medium">Action</th>
            <th className="px-4 py-2.5 font-medium">Cible</th>
            <th className="px-4 py-2.5 font-medium">Détails</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {q.data.map((l, i) => (
            <tr key={i}>
              <td className="whitespace-nowrap px-4 py-2 text-ink-2">{dateTime(l.at)}</td>
              <td className="px-4 py-2">{ACTIONS[l.action] ?? l.action}</td>
              <td className="px-4 py-2">{l.target_user ? `@${l.target_user}` : (l.target ?? '—')}</td>
              <td className="max-w-[320px] truncate px-4 py-2 text-xs text-muted">{l.details ? JSON.stringify(l.details) : ''}</td>
            </tr>
          ))}
          {q.data.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-ink-2">
                Aucune action enregistrée.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Panel>
  )
}

// ------------------------------------------------------------------ Page

type Tab = 'overview' | 'users' | 'community' | 'groups' | 'announcement' | 'log'

export function Admin() {
  const { ready, session, profile } = useAuth()
  const [tab, setTab] = useState<Tab>('overview')
  if (!ready || (session && !profile))
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    )
  // Page inexistante pour tout autre compte : rien ne signale l'existence du panneau.
  if (!session || profile?.staff !== 'admin') return <NotFound />
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
      <PageHeader title="Administration" lead="Comptes, communauté, groupes et annonces. Chaque action est enregistrée dans le journal." />
      <MfaGate>
        <div className="-mx-4 mb-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <Tabs<Tab>
          className="-ml-2.5 whitespace-nowrap"
          value={tab}
          onChange={setTab}
          label="Sections de l’administration"
          idPrefix="admin"
          tabs={[
            { id: 'overview', label: 'Vue d’ensemble' },
            { id: 'users', label: 'Comptes' },
            { id: 'community', label: 'Communauté' },
            { id: 'groups', label: 'Groupes' },
            { id: 'announcement', label: 'Annonce' },
            { id: 'log', label: 'Journal' },
          ]}
        />
        </div>
        {tab === 'overview' && <OverviewTab />}
        {tab === 'users' && <UsersTab />}
        {tab === 'community' && <CommunityTab />}
        {tab === 'groups' && <GroupsTab />}
        {tab === 'announcement' && <AnnouncementTab />}
        {tab === 'log' && <LogTab />}
      </MfaGate>
    </div>
  )
}
