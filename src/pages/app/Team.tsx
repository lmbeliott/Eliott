import { useEffect, useState, type FormEvent } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Award, Pencil, Plus, Trash2, UserMinus } from 'lucide-react'
import { Avatar, Badge, Button, Checkbox, Drawer, EmptyState, Field, FormError, IconButton, Input, PageHeader, Panel, Select, Table, Tabs } from '../../components/ui'
import { ExpiryBadge, expiryInfo } from '../../components/status'
import { useAction, useConfirm, useToast } from '../../components/feedback'
import { NoAccess } from './Config'
import { useAppCtx } from '../../data/hooks'
import { useWholeDB } from '../../data/store'
import {
  approvedMembers, decideMembership, deleteQualification, deleteRole, fullName, grantQualification, PERMISSIONS, removeMember,
  revokeQualification, saveQualification, saveRole, setMemberAdmin, setMemberRole,
} from '../../data/api'
import { fmtMedium } from '../../lib/dates'
import { normalize, pluralize } from '../../lib/util'
import type { Permission, Qualification, Role, User } from '../../data/types'

export default function Team() {
  const ctx = useAppCtx()
  const db = useWholeDB()
  if (!ctx.can('team') && !ctx.can('roles')) return <NoAccess what="la gestion de l'équipe" />
  const pending = db.memberships.filter((m) => m.clubId === ctx.club.id && m.status === 'pending').length
  const tabs = [
    { to: '/app/equipe', label: 'Membres', end: true },
    ...(ctx.can('team') ? [{ to: '/app/equipe/demandes', label: "Demandes d'adhésion", count: pending }, { to: '/app/equipe/diplomes', label: 'Diplômes' }] : []),
    ...(ctx.can('roles') ? [{ to: '/app/equipe/roles', label: 'Rôles et accès' }] : []),
  ]
  return (
    <>
      <PageHeader title="Équipe" description="Membres du club, diplômes, rôles et demandes d'adhésion." />
      <Tabs items={tabs} />
      <Routes>
        <Route index element={<Members />} />
        <Route path="demandes" element={ctx.can('team') ? <Requests /> : <NoAccess what="les adhésions" />} />
        <Route path="diplomes" element={ctx.can('team') ? <Catalog /> : <NoAccess what="le catalogue des diplômes" />} />
        <Route path="roles" element={ctx.can('roles') ? <Roles /> : <NoAccess what="la gestion des rôles" />} />
      </Routes>
    </>
  )
}

// ================================================================ membres

function Members() {
  const ctx = useAppCtx()
  const db = useWholeDB()
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState<User | null>(null)
  const members = approvedMembers(db, ctx.club.id).filter(({ user }) => !q || normalize(`${fullName(user)} ${user.email}`).includes(normalize(q)))
  const roles = db.roles.filter((r) => r.clubId === ctx.club.id)

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Input aria-label="Rechercher un membre" placeholder="Rechercher un nom ou un e-mail" value={q} onChange={(e) => setQ(e.target.value)} className="h-10 max-w-xs" />
        <p className="text-sm text-muted">{pluralize(approvedMembers(db, ctx.club.id).length, 'membre')} sur {ctx.club.capacity} accès</p>
      </div>
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {members.map(({ user, membership }) => {
          const quals = db.userQualifications.filter((uq) => uq.userId === user.id)
          const role = roles.find((r) => r.id === membership.roleId)
          return (
            <li key={user.id}>
              <button type="button" onClick={() => setEditing(user)} className="flex w-full items-start gap-3.5 rounded-xl border border-line bg-surface p-4 text-left transition-colors hover:border-water-bright">
                <Avatar name={fullName(user)} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 font-semibold text-ink">
                    {fullName(user)}
                    {membership.isAdmin && <Badge tone="water">Administrateur</Badge>}
                    {role && <Badge>{role.name}</Badge>}
                  </p>
                  <p className="truncate text-sm text-muted">{user.email}</p>
                  {user.phone && <p className="truncate text-sm text-muted num">{user.phone}</p>}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {quals.length === 0 ? <span className="text-sm text-muted">Aucun diplôme renseigné</span> : quals.map((uq) => {
                      const qq = db.qualifications.find((x) => x.id === uq.qualificationId)
                      const tone = expiryInfo(uq.expiresOn).tone
                      return <Badge key={uq.id} tone={tone === 'kelp' || tone === 'neutral' ? 'neutral' : tone}>{qq?.short}{tone === 'rope' ? ', expiré' : tone === 'buoy' ? ', à recycler' : ''}</Badge>
                    })}
                  </div>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
      {members.length === 0 && <EmptyState compact title="Aucun membre ne correspond">Vérifiez l'orthographe du nom.</EmptyState>}
      <MemberDrawer user={editing} onClose={() => setEditing(null)} />
    </>
  )
}

function MemberDrawer({ user, onClose }: { user: User | null; onClose: () => void }) {
  const ctx = useAppCtx()
  const db = useWholeDB()
  const run = useAction()
  const confirm = useConfirm()
  const [qualId, setQualId] = useState('')
  const [expires, setExpires] = useState('')
  useEffect(() => { setQualId(''); setExpires('') }, [user])
  if (!user) return <Drawer open={false} onClose={onClose} title="">{null}</Drawer>
  const membership = db.memberships.find((m) => m.userId === user.id && m.clubId === ctx.club.id)
  if (!membership) return null
  const quals = db.userQualifications.filter((uq) => uq.userId === user.id)
  const roles = db.roles.filter((r) => r.clubId === ctx.club.id)
  const isSelf = user.id === ctx.user.id
  const selectedQual = db.qualifications.find((q) => q.id === qualId)

  return (
    <Drawer open onClose={onClose} title={fullName(user)} description={user.phone ? <>{user.email}, <a href={`tel:${user.phone.replace(/[^\d+]/g, '')}`} className="link-action">{user.phone}</a></> : user.email} width={520}
      footer={ctx.can('team') && !isSelf && (!membership.isAdmin || ctx.isAdmin) ? (
        <Button variant="ghost" icon={UserMinus} className="mr-auto text-rope" onClick={async () => {
          if (await confirm({ title: `Retirer ${fullName(user)} du club ?`, body: "Ses créneaux n'auront plus de titulaire et son accès au club sera fermé. Son compte personnel est conservé.", confirmLabel: 'Retirer du club' })) {
            run(() => { removeMember(user.id); onClose() }, `${fullName(user)} ne fait plus partie du club.`)
          }
        }}>Retirer du club</Button>
      ) : undefined}
    >
      {(ctx.can('roles') || ctx.isAdmin) && (
        <section className="mb-7 space-y-4">
          <h3 className="text-sm font-bold text-ink">Accès</h3>
          {ctx.can('roles') && (
            <Field label="Rôle" htmlFor="member-role" hint={membership.isAdmin ? 'Un administrateur a déjà tous les droits.' : undefined}>
              <Select id="member-role" value={membership.roleId ?? ''} disabled={membership.isAdmin} onChange={(e) => run(() => setMemberRole(user.id, e.target.value || undefined), 'Rôle mis à jour.')}>
                <option value="">Éducateur (aucun droit de gestion)</option>
                {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </Select>
            </Field>
          )}
          {ctx.isAdmin && (
            <Checkbox
              checked={membership.isAdmin}
              disabled={isSelf}
              onChange={(e) => run(() => setMemberAdmin(user.id, e.target.checked), e.target.checked ? `${user.firstname} est administrateur.` : `${user.firstname} n'est plus administrateur.`)}
              label="Administrateur du club"
              hint={isSelf ? 'Vous ne pouvez pas retirer vos propres droits.' : 'Tous les droits, y compris l’abonnement.'}
            />
          )}
        </section>
      )}

      <section>
        <h3 className="text-sm font-bold text-ink">Diplômes</h3>
        {quals.length === 0 ? <p className="mt-2 text-sm text-muted">Aucun diplôme renseigné. Sans diplôme, {user.firstname} ne verra que les remplacements sans exigence.</p> : (
          <ul className="mt-2 divide-y divide-line rounded-xl border border-line">
            {quals.map((uq) => {
              const q = db.qualifications.find((x) => x.id === uq.qualificationId)
              return (
                <li key={uq.id} className="flex flex-wrap items-center gap-3 px-3.5 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ink">{q?.short}</p>
                    <p className="truncate text-sm text-muted">{q?.label}</p>
                  </div>
                  <ExpiryBadge expiresOn={uq.expiresOn} />
                  {ctx.can('team') && <IconButton size="sm" label={`Retirer ${q?.short}`} icon={Trash2} className="hover:text-rope" onClick={() => run(() => revokeQualification(uq.id), 'Diplôme retiré.')} />}
                </li>
              )
            })}
          </ul>
        )}
        {ctx.can('team') && (
          <form className="mt-4 rounded-xl bg-surface-2 p-4" onSubmit={(e) => { e.preventDefault(); run(() => { grantQualification(user.id, qualId, expires); setQualId(''); setExpires('') }, 'Diplôme enregistré.') }}>
            <p className="mb-3 text-sm font-semibold text-ink">Ajouter ou mettre à jour un diplôme</p>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <Field label="Diplôme" htmlFor="grant-qual">
                <Select id="grant-qual" value={qualId} onChange={(e) => setQualId(e.target.value)}>
                  <option value="">Choisir…</option>
                  {db.qualifications.map((q) => <option key={q.id} value={q.id}>{q.short}</option>)}
                </Select>
              </Field>
              <Field label="Recyclage le" optional htmlFor="grant-exp">
                <Input id="grant-exp" type="date" value={expires} onChange={(e) => setExpires(e.target.value)} className="sm:w-44" />
              </Field>
            </div>
            {selectedQual?.validityMonths && <p className="mt-2 text-sm text-muted">Validité habituelle : {selectedQual.validityMonths} mois.</p>}
            <Button type="submit" size="sm" className="mt-3" disabled={!qualId} icon={Award}>Enregistrer le diplôme</Button>
          </form>
        )}
      </section>
    </Drawer>
  )
}

// ================================================================ demandes

function Requests() {
  const ctx = useAppCtx()
  const db = useWholeDB()
  const run = useAction()
  const requests = db.memberships.filter((m) => m.clubId === ctx.club.id && m.status === 'pending').sort((a, b) => a.requestedAt.localeCompare(b.requestedAt))
  const used = approvedMembers(db, ctx.club.id).length
  return (
    <Panel title="Demandes d'adhésion" description={`${used} accès utilisé${used > 1 ? 's' : ''} sur ${ctx.club.capacity}. Chaque membre accepté compte comme un accès.`}>
      {requests.length === 0 ? (
        <EmptyState compact title="Aucune demande en attente">Partagez le nom exact du club à vos éducateurs : ils le trouveront après avoir créé leur compte.</EmptyState>
      ) : (
        <ul className="divide-y divide-line">
          {requests.map((m) => {
            const u = db.users.find((x) => x.id === m.userId)
            return (
              <li key={m.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
                <Avatar name={fullName(u)} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink">{fullName(u)}</p>
                  <p className="text-sm text-muted">{u?.email}, demande du {fmtMedium(m.requestedAt.slice(0, 10))}</p>
                </div>
                <div className="flex w-full items-center justify-end gap-4 sm:w-auto">
                  <Button size="sm" variant="ghost" onClick={() => run(() => decideMembership(m.id, false), 'Demande refusée.')}>Refuser</Button>
                  <Button size="sm" onClick={() => run(() => decideMembership(m.id, true), `${u?.firstname} a rejoint le club.`)}>Accepter</Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Panel>
  )
}

// ================================================================ catalogue de diplômes

function Catalog() {
  const db = useWholeDB()
  const run = useAction()
  const confirm = useConfirm()
  const [editing, setEditing] = useState<Qualification | 'new' | null>(null)
  return (
    <>
      <Panel title="Catalogue des diplômes" description="Liste commune aux clubs. Associez un diplôme à un groupe pour filtrer les remplaçants." actions={<Button icon={Plus} onClick={() => setEditing('new')}>Ajouter un diplôme</Button>}>
        {db.qualifications.length === 0 ? <EmptyState compact title="Catalogue vide">Ajoutez par exemple BNSSA, BPJEPS AAN ou PSE1.</EmptyState> : (
          <Table>
            <thead><tr><th>Diplôme</th><th>Validité</th><th>Titulaires</th><th className="w-24"><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {db.qualifications.map((q) => {
                const holders = db.userQualifications.filter((uq) => uq.qualificationId === q.id).length
                return (
                  <tr key={q.id}>
                    <td><p className="font-semibold text-ink">{q.short}</p><p className="text-sm text-muted">{q.label}</p></td>
                    <td className="text-ink-2">{q.validityMonths ? `${q.validityMonths} mois` : 'Permanent'}</td>
                    <td className="text-ink-2 num">{holders}</td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <IconButton size="sm" label={`Modifier ${q.short}`} icon={Pencil} onClick={() => setEditing(q)} />
                        <IconButton size="sm" label={`Supprimer ${q.short}`} icon={Trash2} className="hover:text-rope" onClick={async () => {
                          if (await confirm({ title: `Supprimer ${q.short} du catalogue ?`, body: holders ? `Il sera retiré ${holders > 1 ? `des ${holders} profils qui le possèdent` : 'du profil qui le possède'} et des groupes qui l'exigent.` : undefined, confirmLabel: 'Supprimer le diplôme' })) run(() => deleteQualification(q.id), 'Diplôme supprimé.')
                        }} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        )}
      </Panel>
      <QualificationForm q={editing} onClose={() => setEditing(null)} />
    </>
  )
}

function QualificationForm({ q, onClose }: { q: Qualification | 'new' | null; onClose: () => void }) {
  const toast = useToast()
  const [form, setForm] = useState({ short: '', label: '', validityMonths: '' })
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    if (!q) return
    setError(null)
    setForm(q === 'new' ? { short: '', label: '', validityMonths: '' } : { short: q.short, label: q.label, validityMonths: q.validityMonths ? String(q.validityMonths) : '' })
  }, [q])
  const submit = (e: FormEvent) => {
    e.preventDefault()
    try {
      saveQualification({ id: q && q !== 'new' ? q.id : undefined, short: form.short, label: form.label, validityMonths: Number(form.validityMonths) || undefined })
      toast(q === 'new' ? 'Diplôme ajouté au catalogue.' : 'Diplôme mis à jour.')
      onClose()
    } catch (err) { setError((err as Error).message) }
  }
  return (
    <Drawer open={!!q} onClose={onClose} title={q === 'new' ? 'Ajouter un diplôme' : 'Modifier le diplôme'}
      footer={<><Button variant="secondary" onClick={onClose}>Annuler</Button><Button type="submit" form="qual-form">{q === 'new' ? 'Ajouter le diplôme' : 'Enregistrer'}</Button></>}>
      <form id="qual-form" onSubmit={submit} className="space-y-5" noValidate>
        <FormError>{error}</FormError>
        <Field label="Abréviation" htmlFor="q-short"><Input id="q-short" value={form.short} onChange={(e) => { setForm({ ...form, short: e.target.value }); setError(null) }} placeholder="BNSSA" /></Field>
        <Field label="Intitulé complet" optional htmlFor="q-label"><Input id="q-label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Brevet national de sécurité et de sauvetage aquatique" /></Field>
        <Field label="Validité avant recyclage" optional htmlFor="q-validity" hint="En mois. Laissez vide pour un diplôme permanent.">
          <Input id="q-validity" type="number" inputMode="numeric" min={1} value={form.validityMonths} onChange={(e) => setForm({ ...form, validityMonths: e.target.value })} className="w-32" />
        </Field>
      </form>
    </Drawer>
  )
}

// ================================================================ rôles

function Roles() {
  const ctx = useAppCtx()
  const db = useWholeDB()
  const run = useAction()
  const confirm = useConfirm()
  const [editing, setEditing] = useState<Role | 'new' | null>(null)
  const roles = db.roles.filter((r) => r.clubId === ctx.club.id)
  return (
    <>
      <Panel title="Rôles et accès" description="Déléguez une partie de la gestion sans donner tous les droits. Les administrateurs ont toujours tous les accès." actions={<Button icon={Plus} onClick={() => setEditing('new')}>Créer un rôle</Button>}>
        {roles.length === 0 ? <EmptyState compact title="Aucun rôle personnalisé">Ex. « Coordination bassin » pour gérer le planning et valider les remplacements.</EmptyState> : (
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {roles.map((r) => {
              const count = db.memberships.filter((m) => m.roleId === r.id && m.clubId === ctx.club.id).length
              return (
                <li key={r.id} className="rounded-xl border border-line p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-ink">{r.name}</p>
                      <p className="text-sm text-muted">{pluralize(count, 'membre')}</p>
                    </div>
                    <div className="flex gap-1">
                      <IconButton size="sm" label={`Modifier ${r.name}`} icon={Pencil} onClick={() => setEditing(r)} />
                      <IconButton size="sm" label={`Supprimer ${r.name}`} icon={Trash2} className="hover:text-rope" onClick={async () => {
                        if (await confirm({ title: `Supprimer le rôle ${r.name} ?`, body: count ? (count > 1 ? `${count} membres redeviendront simples éducateurs.` : '1 membre redeviendra simple éducateur.') : undefined, confirmLabel: 'Supprimer le rôle' })) run(() => deleteRole(r.id), 'Rôle supprimé.')
                      }} />
                    </div>
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {r.permissions.length === 0 ? <li className="text-sm text-muted">Aucun droit</li> : r.permissions.map((p) => <li key={p}><Badge tone="water">{PERMISSIONS.find((x) => x.key === p)?.label}</Badge></li>)}
                  </ul>
                </li>
              )
            })}
          </ul>
        )}
      </Panel>
      <RoleForm role={editing} onClose={() => setEditing(null)} />
    </>
  )
}

function RoleForm({ role, onClose }: { role: Role | 'new' | null; onClose: () => void }) {
  const toast = useToast()
  const [name, setName] = useState('')
  const [perms, setPerms] = useState<Permission[]>([])
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    if (!role) return
    setError(null)
    setName(role === 'new' ? '' : role.name)
    setPerms(role === 'new' ? [] : role.permissions)
  }, [role])
  const submit = (e: FormEvent) => {
    e.preventDefault()
    try {
      saveRole({ id: role && role !== 'new' ? role.id : undefined, name, permissions: perms })
      toast(role === 'new' ? 'Rôle créé. Attribuez-le depuis la fiche d’un membre.' : 'Rôle mis à jour.')
      onClose()
    } catch (err) { setError((err as Error).message) }
  }
  return (
    <Drawer open={!!role} onClose={onClose} title={role === 'new' ? 'Créer un rôle' : 'Modifier le rôle'}
      footer={<><Button variant="secondary" onClick={onClose}>Annuler</Button><Button type="submit" form="role-form">{role === 'new' ? 'Créer le rôle' : 'Enregistrer'}</Button></>}>
      <form id="role-form" onSubmit={submit} className="space-y-6" noValidate>
        <FormError>{error}</FormError>
        <Field label="Nom du rôle" htmlFor="role-name"><Input id="role-name" value={name} onChange={(e) => { setName(e.target.value); setError(null) }} placeholder="Ex. Coordination bassin, Secrétariat" /></Field>
        <fieldset className="space-y-4">
          <legend className="mb-3 text-sm font-semibold text-ink">Droits accordés</legend>
          {PERMISSIONS.map((p) => (
            <Checkbox key={p.key} label={p.label} hint={p.hint} checked={perms.includes(p.key)} onChange={(e) => setPerms(e.target.checked ? [...perms, p.key] : perms.filter((x) => x !== p.key))} />
          ))}
        </fieldset>
      </form>
    </Drawer>
  )
}
