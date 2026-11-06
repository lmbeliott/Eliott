import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, Route, Routes, useSearchParams } from 'react-router-dom'
import { AlertTriangle, CalendarPlus, FileUp, Lock, Pencil, Plus, Trash2, Upload, Waves } from 'lucide-react'
import {
  Badge, Button, ButtonLink, Drawer, EmptyState, Field, FormError, IconButton, Input, LevelDot, PageHeader, Panel, Select, Table, Tabs,
} from '../../components/ui'
import { useAction, useConfirm, useToast } from '../../components/feedback'
import { useAppCtx } from '../../data/hooks'
import { useWholeDB } from '../../data/store'
import {
  approvedMembers, deleteCreneau, deleteGroupe, deleteNiveau, deletePiscine, fullName, hasValidQualification, IMPORT_COLUMNS,
  importSchedule, saveCreneau, saveGroupe, saveNiveau, savePiscine, slotConflicts, staleAbsences, type ImportReport, type SlotInput,
} from '../../data/api'
import { DAYS, DAYS_SHORT, fmtRange, fmtShort, minutes, nextOccurrences } from '../../lib/dates'
import { download, parseRows, toCSV } from '../../lib/csv'
import { cn, normalize, pluralize } from '../../lib/util'
import type { Creneau, Groupe, Piscine, Weekday } from '../../data/types'
import { LEVEL_COLORS } from '../../data/seed'

export default function Config() {
  const ctx = useAppCtx()
  if (!ctx.can('planning')) return <NoAccess what="la configuration du planning" />
  return (
    <>
      <PageHeader title="Configuration" description="Piscines, groupes, niveaux et créneaux de la saison." />
      <Tabs items={[
        { to: '/app/configuration', label: 'Créneaux', end: true },
        { to: '/app/configuration/piscines', label: 'Piscines' },
        { to: '/app/configuration/groupes', label: 'Groupes et niveaux' },
        { to: '/app/configuration/import', label: 'Import Excel' },
      ]} />
      <Routes>
        <Route index element={<Slots />} />
        <Route path="piscines" element={<Pools />} />
        <Route path="groupes" element={<Groups />} />
        <Route path="import" element={<Import />} />
      </Routes>
    </>
  )
}

export function NoAccess({ what, adminOnly }: { what: string; adminOnly?: boolean }) {
  return (
    <div className="rounded-2xl border border-line bg-surface">
      <EmptyState icon={Lock} title="Accès réservé">
        {adminOnly
          ? <>Cette page est réservée aux administrateurs du club. Un administrateur peut vous donner ce statut depuis Équipe, Membres.</>
          : <>Votre rôle ne permet pas d'ouvrir {what}. Un administrateur du club peut vous attribuer un rôle qui le permet.</>}
      </EmptyState>
    </div>
  )
}

// ================================================================ créneaux

function Slots() {
  const ctx = useAppCtx()
  const db = useWholeDB()
  const run = useAction()
  const confirm = useConfirm()
  const [params, setParams] = useSearchParams()
  const [editing, setEditing] = useState<Creneau | 'new' | null>(null)
  const [pool, setPool] = useState('')

  useEffect(() => {
    const id = params.get('modifier')
    if (id) {
      // Uniquement un créneau du club courant (lien venu d'un autre onglet ou d'un autre club).
      const s = db.creneaux.find((c) => c.id === id && c.clubId === ctx.club.id)
      if (s) setEditing(s)
      params.delete('modifier')
      setParams(params, { replace: true })
    }
  }, [params, db.creneaux, setParams, ctx.club.id])

  const clubId = ctx.club.id
  const pools = db.piscines.filter((p) => p.clubId === clubId)
  const groups = db.groupes.filter((g) => g.clubId === clubId)
  const members = approvedMembers(db, clubId)
  const slots = db.creneaux.filter((c) => c.clubId === clubId && (!pool || c.piscineId === pool))
  const missing = [
    !pools.length && { label: 'au moins une piscine', to: '/app/configuration/piscines' },
    !groups.length && { label: 'au moins un groupe', to: '/app/configuration/groupes' },
  ].filter(Boolean) as Array<{ label: string; to: string }>

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {pools.length > 1 && (
            <Select aria-label="Filtrer par piscine" value={pool} onChange={(e) => setPool(e.target.value)} className="h-10 w-auto min-w-[200px] text-sm">
              <option value="">Toutes les piscines</option>
              {pools.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          )}
          <p className="text-sm text-muted">{pluralize(slots.length, 'créneau', 'créneaux')} par semaine</p>
        </div>
        <Button icon={CalendarPlus} onClick={() => setEditing('new')} disabled={missing.length > 0}>Planifier un créneau</Button>
      </div>

      {missing.length > 0 && (
        <div className="mb-5 flex gap-3 rounded-xl border border-buoy-bright/40 bg-buoy-soft p-4 text-[15px] text-ink">
          <AlertTriangle aria-hidden className="mt-0.5 size-5 shrink-0 text-buoy" />
          <p>Avant de planifier, créez {missing.map((m, i) => <span key={m.to}>{i > 0 && ' et '}<Link to={m.to} className="font-semibold underline underline-offset-2">{m.label}</Link></span>)}. Les éducateurs doivent aussi avoir rejoint le club.</p>
        </div>
      )}

      {slots.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface">
          <EmptyState icon={CalendarPlus} title="Aucun créneau" action={<ButtonLink to="/app/configuration/import" variant="secondary" icon={Upload}>Importer depuis Excel</ButtonLink>}>
            Planifiez vos créneaux un par un, ou importez tout le planning de la saison en une fois.
          </EmptyState>
        </div>
      ) : (
        <div className="space-y-5">
          {DAYS.map((dayName, day) => {
            const list = slots.filter((s) => s.day === day).sort((a, b) => minutes(a.start) - minutes(b.start))
            if (!list.length) return null
            return (
              <Panel key={dayName} title={dayName} description={pluralize(list.length, 'créneau', 'créneaux')}>
                <Table>
                  <thead>
                    <tr><th>Horaires</th><th>Groupe</th><th>Piscine</th><th>Éducateurs</th><th className="w-24"><span className="sr-only">Actions</span></th></tr>
                  </thead>
                  <tbody>
                    {list.map((s) => {
                      const g = groups.find((x) => x.id === s.groupeId)
                      const lvl = db.niveaux.find((n) => n.id === g?.niveauId)
                      const p = pools.find((x) => x.id === s.piscineId)
                      return (
                        <tr key={s.id}>
                          <td className="font-semibold text-ink num whitespace-nowrap">{fmtRange(s.start, s.end)}</td>
                          <td><span className="inline-flex items-center gap-2 font-semibold text-ink"><LevelDot color={lvl?.color} />{g?.name}</span></td>
                          <td className="text-ink-2">{p?.name}{s.ligne && <span className="block text-[13px] text-muted">{s.ligne}</span>}</td>
                          <td className="text-ink-2">{s.educatorIds.length ? s.educatorIds.map((id) => fullName(members.find((m) => m.user.id === id)?.user)).join(', ') : <Badge tone="buoy">À affecter</Badge>}</td>
                          <td>
                            <div className="flex justify-end gap-1">
                              <IconButton size="sm" label={`Modifier ${g?.name} ${dayName}`} icon={Pencil} onClick={() => setEditing(s)} />
                              <IconButton size="sm" label={`Supprimer ${g?.name} ${dayName}`} icon={Trash2} className="hover:text-rope" onClick={async () => {
                                if (await confirm({ title: `Supprimer ${g?.name}, ${dayName.toLowerCase()} ${fmtRange(s.start, s.end)} ?`, body: 'Le créneau disparaît du planning de la semaine, ainsi que ses absences et remplacements.', confirmLabel: 'Supprimer le créneau' })) run(() => deleteCreneau(s.id), 'Créneau supprimé.')
                              }} />
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </Panel>
            )
          })}
        </div>
      )}

      <SlotForm slot={editing} onClose={() => setEditing(null)} />
    </>
  )
}

function SlotForm({ slot, onClose }: { slot: Creneau | 'new' | null; onClose: () => void }) {
  const ctx = useAppCtx()
  const db = useWholeDB()
  const toast = useToast()
  const clubId = ctx.club.id
  const empty: SlotInput = { groupeId: '', day: 0, start: '17:00', end: '18:00', ligne: '', educatorIds: [] }
  const [form, setForm] = useState<SlotInput>(empty)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')

  useEffect(() => {
    if (!slot) return
    setError(null); setQ('')
    setForm(slot === 'new' ? empty : { id: slot.id, groupeId: slot.groupeId, day: slot.day, start: slot.start, end: slot.end, ligne: slot.ligne ?? '', educatorIds: slot.educatorIds })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slot])

  const pools = db.piscines.filter((p) => p.clubId === clubId)
  const groups = db.groupes.filter((g) => g.clubId === clubId)
  const group = groups.find((g) => g.id === form.groupeId)
  const qual = db.qualifications.find((x) => x.id === group?.qualificationId)
  const members = approvedMembers(db, clubId).filter((m) => !q || normalize(fullName(m.user)).includes(normalize(q)))
  const conflicts = form.groupeId && minutes(form.end) > minutes(form.start) ? slotConflicts(db, clubId, form) : []
  // Absences à venir que l'enregistrement annulera (jour changé ou éducateur absent retiré).
  const stale = slot && slot !== 'new' ? staleAbsences(db, form) : []
  const nextDate = nextOccurrences(form.day, 1)[0]

  const submit = (e: FormEvent) => {
    e.preventDefault()
    try {
      saveCreneau(form)
      // Seuls les autres éducateurs affectés reçoivent une notification.
      toast(slot === 'new' ? (form.educatorIds.some((id) => id !== ctx.user.id) ? 'Créneau planifié. Les éducateurs affectés sont prévenus.' : 'Créneau planifié.') : 'Créneau mis à jour.')
      onClose()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <Drawer
      open={!!slot}
      onClose={onClose}
      title={slot === 'new' ? 'Planifier un créneau' : 'Modifier le créneau'}
      description="Le créneau se répète chaque semaine."
      width={520}
      footer={<><Button variant="secondary" onClick={onClose}>Annuler</Button><Button type="submit" form="slot-form">{slot === 'new' ? 'Planifier le créneau' : 'Enregistrer'}</Button></>}
    >
      <form id="slot-form" onSubmit={submit} className="space-y-5" noValidate>
        <FormError>{error}</FormError>
        <Field label="Groupe" htmlFor="slot-group" hint={group ? `${pools.find((p) => p.id === group.piscineId)?.name}${qual ? `, diplôme requis : ${qual.short}` : ''}` : undefined}>
          <Select id="slot-group" value={form.groupeId} onChange={(e) => { setForm({ ...form, groupeId: e.target.value }); setError(null) }}>
            <option value="">Choisir un groupe…</option>
            {pools.map((p) => (
              <optgroup key={p.id} label={p.name}>
                {groups.filter((g) => g.piscineId === p.id).map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </optgroup>
            ))}
          </Select>
        </Field>
        <fieldset>
          <legend className="mb-1.5 text-sm font-semibold text-ink">Jour</legend>
          <div className="grid grid-cols-7 gap-1">
            {DAYS_SHORT.map((d, i) => (
              <button key={d} type="button" aria-pressed={form.day === i} onClick={() => setForm({ ...form, day: i as Weekday })}
                className={cn('h-10 rounded-lg border text-[13px] font-semibold transition-colors', form.day === i ? 'border-btn bg-btn text-btn-ink' : 'border-line-strong text-ink-2 hover:bg-surface-2')}>
                {d}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Début" htmlFor="slot-start"><Input id="slot-start" type="time" step={300} value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} /></Field>
          <Field label="Fin" htmlFor="slot-end"><Input id="slot-end" type="time" step={300} value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} aria-invalid={minutes(form.end) <= minutes(form.start) || undefined} /></Field>
        </div>
        <Field label="Lignes d'eau" optional htmlFor="slot-lane" hint="Ex. Lignes 1–3, petit bassin.">
          <Input id="slot-lane" value={form.ligne} onChange={(e) => setForm({ ...form, ligne: e.target.value })} />
        </Field>
        <fieldset>
          <legend className="mb-1.5 text-sm font-semibold text-ink">Éducateurs titulaires</legend>
          {approvedMembers(db, clubId).length > 6 && <Input aria-label="Rechercher un éducateur" placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} className="mb-2 h-10" />}
          <ul className="max-h-72 divide-y divide-line overflow-y-auto rounded-xl border border-line">
            {members.map(({ user }) => {
              const checked = form.educatorIds.includes(user.id)
              const lacks = group?.qualificationId && !hasValidQualification(db, user.id, group.qualificationId, nextDate)
              return (
                <li key={user.id}>
                  <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-surface-2/60">
                    <input type="checkbox" className="size-[18px] accent-[var(--water)]" checked={checked} onChange={(e) => setForm({ ...form, educatorIds: e.target.checked ? [...form.educatorIds, user.id] : form.educatorIds.filter((x) => x !== user.id) })} />
                    <span className="flex-1 text-[15px] text-ink">{fullName(user)}</span>
                    {lacks && <Badge tone="buoy">Sans {qual?.short}</Badge>}
                  </label>
                </li>
              )
            })}
          </ul>
        </fieldset>
        {conflicts.length > 0 && (
          <div role="alert" className="flex gap-3 rounded-xl bg-rope-soft p-3.5 text-sm text-rope">
            <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" />
            <div>{conflicts.map((c) => <p key={c}>{c}</p>)}</div>
          </div>
        )}
        {stale.length > 0 && (
          <div role="status" className="flex gap-3 rounded-xl border border-buoy-bright/40 bg-buoy-soft p-3.5 text-sm text-ink">
            <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0 text-buoy" />
            <p>
              {stale.length > 1 ? `${stale.length} absences déclarées seront annulées` : "L'absence déclarée sera annulée"}
              {' '}({stale.map((a) => `${fullName(db.users.find((u) => u.id === a.educatorId))}, ${fmtShort(a.date)}`).join(' ; ')}). Les personnes concernées seront prévenues.
            </p>
          </div>
        )}
      </form>
    </Drawer>
  )
}

// ================================================================ piscines

function Pools() {
  const ctx = useAppCtx()
  const db = useWholeDB()
  const run = useAction()
  const confirm = useConfirm()
  const [editing, setEditing] = useState<Piscine | 'new' | null>(null)
  const pools = db.piscines.filter((p) => p.clubId === ctx.club.id)

  return (
    <>
      <div className="mb-5 flex justify-end"><Button icon={Plus} onClick={() => setEditing('new')}>Ajouter une piscine</Button></div>
      {pools.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface">
          <EmptyState icon={Waves} title="Aucune piscine" action={<Button icon={Plus} onClick={() => setEditing('new')}>Ajouter une piscine</Button>}>Commencez par les bassins où votre club a des créneaux.</EmptyState>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {pools.map((p) => {
            const groups = db.groupes.filter((g) => g.piscineId === p.id)
            const slots = db.creneaux.filter((c) => c.piscineId === p.id)
            return (
              <li key={p.id} className="rounded-2xl border border-line bg-surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-bold text-ink">{p.name}</h3>
                    {p.address && <p className="mt-0.5 text-sm text-muted">{p.address}</p>}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <IconButton size="sm" label={`Modifier ${p.name}`} icon={Pencil} onClick={() => setEditing(p)} />
                    <IconButton size="sm" label={`Supprimer ${p.name}`} icon={Trash2} className="hover:text-rope" onClick={async () => {
                      if (await confirm({
                        title: `Supprimer ${p.name} ?`,
                        body: groups.length ? `${pluralize(groups.length, 'groupe')} et ${pluralize(slots.length, 'créneau', 'créneaux')} rattachés seront aussi supprimés.` : 'Cette piscine n’a aucun groupe rattaché.',
                        confirmLabel: 'Supprimer la piscine',
                      })) run(() => deletePiscine(p.id), 'Piscine supprimée.')
                    }} />
                  </div>
                </div>
                <div aria-hidden className="lane-rope lane-rope-on-light my-4" />
                <dl className="flex gap-6 text-sm">
                  <div><dt className="text-muted">Lignes d'eau</dt><dd className="font-semibold text-ink num">{p.lanes ?? '—'}</dd></div>
                  <div><dt className="text-muted">Groupes</dt><dd className="font-semibold text-ink num">{groups.length}</dd></div>
                  <div><dt className="text-muted">Créneaux / semaine</dt><dd className="font-semibold text-ink num">{slots.length}</dd></div>
                </dl>
              </li>
            )
          })}
        </ul>
      )}
      <PoolForm pool={editing} onClose={() => setEditing(null)} />
    </>
  )
}

function PoolForm({ pool, onClose }: { pool: Piscine | 'new' | null; onClose: () => void }) {
  const toast = useToast()
  const [form, setForm] = useState({ name: '', address: '', lanes: '' })
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    if (!pool) return
    setError(null)
    setForm(pool === 'new' ? { name: '', address: '', lanes: '' } : { name: pool.name, address: pool.address ?? '', lanes: pool.lanes ? String(pool.lanes) : '' })
  }, [pool])
  const submit = (e: FormEvent) => {
    e.preventDefault()
    try {
      savePiscine({ id: pool && pool !== 'new' ? pool.id : undefined, name: form.name, address: form.address, lanes: Number(form.lanes) || undefined })
      toast(pool === 'new' ? 'Piscine ajoutée.' : 'Piscine mise à jour.')
      onClose()
    } catch (err) { setError((err as Error).message) }
  }
  return (
    <Drawer open={!!pool} onClose={onClose} title={pool === 'new' ? 'Ajouter une piscine' : 'Modifier la piscine'}
      footer={<><Button variant="secondary" onClick={onClose}>Annuler</Button><Button type="submit" form="pool-form">{pool === 'new' ? 'Ajouter la piscine' : 'Enregistrer'}</Button></>}>
      <form id="pool-form" onSubmit={submit} className="space-y-5" noValidate>
        <FormError>{error}</FormError>
        <Field label="Nom de la piscine" htmlFor="pool-name"><Input id="pool-name" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setError(null) }} placeholder="Ex. Piscine municipale du Centre" /></Field>
        <Field label="Adresse" optional htmlFor="pool-address"><Input id="pool-address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} autoComplete="street-address" /></Field>
        <Field label="Nombre de lignes d'eau" optional htmlFor="pool-lanes"><Input id="pool-lanes" type="number" inputMode="numeric" min={1} max={12} value={form.lanes} onChange={(e) => setForm({ ...form, lanes: e.target.value })} className="w-32" /></Field>
      </form>
    </Drawer>
  )
}

// ================================================================ groupes & niveaux

function Groups() {
  const ctx = useAppCtx()
  const db = useWholeDB()
  const run = useAction()
  const confirm = useConfirm()
  const [editing, setEditing] = useState<Groupe | 'new' | null>(null)
  const [levelName, setLevelName] = useState('')
  const clubId = ctx.club.id
  const pools = db.piscines.filter((p) => p.clubId === clubId)
  const groups = db.groupes.filter((g) => g.clubId === clubId)
  const levels = db.niveaux.filter((n) => n.clubId === clubId)

  return (
    <div className="space-y-6">
      <Panel title="Niveaux du club" description="Ils colorent le planning. Ex. Jardin aquatique, École de natation, Compétition, Masters.">
        <ul className="flex flex-wrap gap-2">
          {levels.map((l) => (
            <li key={l.id} className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-bg pl-2 pr-1">
              <label className="relative inline-flex size-5 cursor-pointer items-center justify-center rounded-full has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-water-bright has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-bg" style={{ background: l.color }} title="Changer la couleur">
                <span className="sr-only">Couleur de {l.name}</span>
                <select className="absolute inset-0 cursor-pointer opacity-0" value={l.color} onChange={(e) => run(() => saveNiveau({ id: l.id, name: l.name, color: e.target.value }))}>
                  {LEVEL_COLORS.map((c, i) => <option key={c} value={c}>Couleur {i + 1}</option>)}
                </select>
              </label>
              <span className="text-sm font-semibold text-ink">{l.name}</span>
              <IconButton size="sm" label={`Supprimer le niveau ${l.name}`} icon={Trash2} className="size-7 hover:text-rope" onClick={async () => {
                const used = groups.filter((g) => g.niveauId === l.id).length
                if (await confirm({ title: `Supprimer le niveau ${l.name} ?`, body: used ? `${pluralize(used, 'groupe')} n'${used > 1 ? 'auront' : 'aura'} plus de niveau.` : undefined, confirmLabel: 'Supprimer le niveau' })) run(() => deleteNiveau(l.id), 'Niveau supprimé.')
              }} />
            </li>
          ))}
        </ul>
        <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); run(() => { saveNiveau({ name: levelName }); setLevelName('') }, 'Niveau ajouté.') }}>
          <Input aria-label="Nom du nouveau niveau" placeholder="Nouveau niveau, ex. Pré-compétition" value={levelName} onChange={(e) => setLevelName(e.target.value)} className="h-10 max-w-sm" />
          <Button type="submit" variant="secondary" icon={Plus} disabled={!levelName.trim()}>Ajouter</Button>
        </form>
      </Panel>

      <Panel title="Groupes" description="Un groupe appartient à une piscine. Le diplôme requis filtre les remplaçants possibles." actions={<Button icon={Plus} onClick={() => setEditing('new')} disabled={!pools.length}>Créer un groupe</Button>}>
        {!pools.length ? (
          <EmptyState compact title="Créez d'abord une piscine" action={<ButtonLink to="/app/configuration/piscines" variant="secondary">Ajouter une piscine</ButtonLink>} />
        ) : groups.length === 0 ? (
          <EmptyState compact title="Aucun groupe" action={<Button icon={Plus} onClick={() => setEditing('new')}>Créer un groupe</Button>}>Ex. Bébés nageurs, École de natation 1, Masters.</EmptyState>
        ) : (
          <Table>
            <thead><tr><th>Groupe</th><th>Piscine</th><th>Diplôme requis</th><th>Créneaux</th><th className="w-24"><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {groups.map((g) => {
                const lvl = levels.find((n) => n.id === g.niveauId)
                const q = db.qualifications.find((x) => x.id === g.qualificationId)
                const count = db.creneaux.filter((c) => c.groupeId === g.id).length
                return (
                  <tr key={g.id}>
                    <td>
                      <p className="flex items-center gap-2 font-semibold text-ink"><LevelDot color={lvl?.color} />{g.name}</p>
                      <p className="pl-[18px] text-[13px] text-muted">{lvl?.name ?? 'Sans niveau'}</p>
                    </td>
                    <td className="text-ink-2">{pools.find((p) => p.id === g.piscineId)?.name}</td>
                    <td>{q ? <Badge tone="water">{q.short}</Badge> : <span className="text-muted">Aucun</span>}</td>
                    <td className="text-ink-2 num">{count}</td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <IconButton size="sm" label={`Modifier ${g.name}`} icon={Pencil} onClick={() => setEditing(g)} />
                        <IconButton size="sm" label={`Supprimer ${g.name}`} icon={Trash2} className="hover:text-rope" onClick={async () => {
                          if (await confirm({ title: `Supprimer le groupe ${g.name} ?`, body: count ? (count > 1 ? `Ses ${count} créneaux seront aussi supprimés.` : 'Son créneau sera aussi supprimé.') : undefined, confirmLabel: 'Supprimer le groupe' })) run(() => deleteGroupe(g.id), 'Groupe supprimé.')
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
      <GroupForm group={editing} onClose={() => setEditing(null)} />
    </div>
  )
}

function GroupForm({ group, onClose }: { group: Groupe | 'new' | null; onClose: () => void }) {
  const ctx = useAppCtx()
  const db = useWholeDB()
  const toast = useToast()
  const clubId = ctx.club.id
  const pools = db.piscines.filter((p) => p.clubId === clubId)
  const levels = db.niveaux.filter((n) => n.clubId === clubId)
  const [form, setForm] = useState({ name: '', piscineId: '', niveauId: '', qualificationId: '' })
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    if (!group) return
    setError(null)
    setForm(group === 'new' ? { name: '', piscineId: pools[0]?.id ?? '', niveauId: '', qualificationId: '' } : { name: group.name, piscineId: group.piscineId, niveauId: group.niveauId ?? '', qualificationId: group.qualificationId ?? '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group])
  const submit = (e: FormEvent) => {
    e.preventDefault()
    try {
      saveGroupe({ id: group && group !== 'new' ? group.id : undefined, ...form })
      toast(group === 'new' ? 'Groupe créé.' : 'Groupe mis à jour.')
      onClose()
    } catch (err) { setError((err as Error).message) }
  }
  return (
    <Drawer open={!!group} onClose={onClose} title={group === 'new' ? 'Créer un groupe' : 'Modifier le groupe'}
      footer={<><Button variant="secondary" onClick={onClose}>Annuler</Button><Button type="submit" form="group-form">{group === 'new' ? 'Créer le groupe' : 'Enregistrer'}</Button></>}>
      <form id="group-form" onSubmit={submit} className="space-y-5" noValidate>
        <FormError>{error}</FormError>
        <Field label="Nom du groupe" htmlFor="grp-name"><Input id="grp-name" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setError(null) }} placeholder="Ex. Bébés nageurs, Adultes" /></Field>
        <Field label="Piscine" htmlFor="grp-pool">
          <Select id="grp-pool" value={form.piscineId} onChange={(e) => setForm({ ...form, piscineId: e.target.value })}>
            {pools.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
        </Field>
        <Field label="Niveau" optional htmlFor="grp-level">
          <Select id="grp-level" value={form.niveauId} onChange={(e) => setForm({ ...form, niveauId: e.target.value })}>
            <option value="">Sans niveau</option>
            {levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </Select>
        </Field>
        <Field label="Diplôme requis pour encadrer" optional htmlFor="grp-qual" hint="Seuls les titulaires de ce diplôme, à jour, verront les remplacements de ce groupe.">
          <Select id="grp-qual" value={form.qualificationId} onChange={(e) => setForm({ ...form, qualificationId: e.target.value })}>
            <option value="">Aucun diplôme exigé</option>
            {db.qualifications.map((q) => <option key={q.id} value={q.id}>{q.short} — {q.label}</option>)}
          </Select>
        </Field>
      </form>
    </Drawer>
  )
}

// ================================================================ import

const TEMPLATE: string[][] = [
  [...IMPORT_COLUMNS],
  ['Piscine des Iris', 'École de natation 1', 'École de natation', 'Lundi', '17:00', '17:45', 'Lignes 1–2', 'hugo.petit@exemple.fr'],
  ['Centre aquatique du Parc', 'Masters', 'Masters', 'Jeudi', '19h', '20h', 'Lignes 5–8', 'theo.laurent@exemple.fr'],
]

function Import() {
  const [text, setText] = useState('')
  const [report, setReport] = useState<ImportReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Numéros de ligne du tableur (lignes vides comprises) : le rapport d'import pointe la bonne ligne.
  const rows = useMemo(() => (text.trim() ? parseRows(text) : []), [text])
  const header = rows[0]?.cells.some((c) => ['piscine', 'groupe'].includes(normalize(c)))
  const body = header ? rows.slice(1) : rows

  const onFile = async (file: File) => {
    if (/\.xlsx?$/i.test(file.name)) {
      setError("Les fichiers .xlsx ne peuvent pas être lus directement. Dans Excel, choisissez Fichier, Enregistrer sous, CSV (séparateur : point-virgule), ou copiez les cellules et collez-les ci-dessous.")
      return
    }
    setError(null)
    setText(await file.text())
  }

  const submit = () => {
    try {
      setReport(importSchedule(rows))
      setText('')
    } catch (err) { setError((err as Error).message) }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <Panel title="Importer votre planning" description="Copiez les lignes depuis Excel ou Google Sheets et collez-les ici, ou choisissez un fichier CSV.">
        <FormError>{error}</FormError>
        <label htmlFor="import-text" className="sr-only">Données à importer</label>
        <textarea
          id="import-text"
          value={text}
          onChange={(e) => { setText(e.target.value); setReport(null); setError(null) }}
          placeholder={TEMPLATE.map((r) => r.join('\t')).join('\n')}
          className="mt-2 h-44 w-full rounded-xl border border-line-strong bg-bg p-3 font-sans text-[13px] leading-relaxed text-ink placeholder:text-muted focus:border-water-bright focus:outline-none focus:ring-3 focus:ring-water-bright/20"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-line-strong bg-surface px-4 text-sm font-semibold text-ink hover:bg-surface-2 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-water-bright has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-surface">
            <FileUp aria-hidden className="size-4" />Choisir un fichier CSV
            <input type="file" accept=".csv,.tsv,.txt,.xlsx,.xls" className="sr-only" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          </label>
          <Button onClick={submit} disabled={!body.length} icon={Upload}>{body.length ? `Importer ${pluralize(body.length, 'ligne')}` : 'Importer'}</Button>
        </div>

        {body.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-ink">Aperçu</p>
            <Table>
              <thead><tr>{IMPORT_COLUMNS.map((c) => <th key={c}>{c}</th>)}</tr></thead>
              <tbody>
                {body.slice(0, 6).map((r) => <tr key={r.line}>{IMPORT_COLUMNS.map((_, j) => <td key={j} className="text-ink-2">{r.cells[j] ?? ''}</td>)}</tr>)}
              </tbody>
            </Table>
            {body.length > 6 && <p className="mt-2 text-[13px] text-muted">… et {pluralize(body.length - 6, 'autre ligne', 'autres lignes')}.</p>}
          </div>
        )}

        {report && (
          <div className="mt-5 rounded-xl border border-line p-4" role="status">
            <p className="font-semibold text-ink">{report.created.creneaux > 0 ? `${pluralize(report.created.creneaux, 'créneau importé', 'créneaux importés')}.` : 'Aucun créneau importé.'}</p>
            <p className="mt-1 text-sm text-ink-2">Créés au passage : {pluralize(report.created.piscines, 'piscine')}, {pluralize(report.created.groupes, 'groupe')}, {pluralize(report.created.niveaux, 'niveau', 'niveaux')}.</p>
            {report.skipped.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-semibold text-rope">{pluralize(report.skipped.length, 'ligne ignorée', 'lignes ignorées')}</p>
                <ul className="mt-1 space-y-0.5 text-sm text-ink-2">
                  {report.skipped.map((s) => <li key={s.line}>Ligne {s.line} : {s.reason}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </Panel>

      <Panel title="Format attendu">
        <ol className="space-y-2 text-[15px] text-ink-2">
          {IMPORT_COLUMNS.map((c, i) => (
            <li key={c} className="flex gap-3">
              <span className="w-5 shrink-0 text-right font-bold text-ink num">{String.fromCharCode(65 + i)}</span>
              <span><strong className="text-ink">{c}</strong>{COLUMN_HINTS[i] && <span className="text-muted"> : {COLUMN_HINTS[i]}</span>}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-muted">Les piscines, groupes et niveaux absents sont créés automatiquement. Chaque e-mail doit appartenir à un membre du club.</p>
        <Button variant="secondary" className="mt-4" icon={FileUp} onClick={() => download('modele-planning-swimhub.csv', toCSV(TEMPLATE))}>Télécharger le modèle</Button>
      </Panel>
    </div>
  )
}

const COLUMN_HINTS = ['', '', 'facultatif', 'lundi à dimanche', 'ex. 17:00, 17h ou 17:00:00', 'ex. 18:30', 'facultatif', 'séparés par des virgules']
