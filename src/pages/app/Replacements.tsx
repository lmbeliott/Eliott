import { useMemo, useState } from 'react'
import { Inbox, LifeBuoy } from 'lucide-react'
import { Avatar, Badge, Button, EmptyState, LevelDot, PageHeader, Panel, Segmented } from '../../components/ui'
import { ReplacementStatusBadge } from '../../components/status'
import { SessionDrawer } from '../../components/SessionDrawer'
import { useAction, useConfirm } from '../../components/feedback'
import { useAppCtx } from '../../data/hooks'
import { useWholeDB } from '../../data/store'
import { absenceStatus, approvedMembers, cancelAbsence, decideReplacement, eligibility, fullName, hasValidQualification, userById, volunteer, withdraw } from '../../data/api'
import { buildOccurrence, type Occurrence } from '../../data/occurrences'
import { fmtLong, fmtRange, fmtShort, isOver, relativeDay } from '../../lib/dates'
import { cn, pluralize, ucfirst } from '../../lib/util'
import type { Absence, Creneau, User } from '../../data/types'

export default function Replacements() {
  const ctx = useAppCtx()
  const db = useWholeDB()
  const run = useAction()
  const confirm = useConfirm()
  const [filter, setFilter] = useState<'mine' | 'all'>('mine')
  const [selected, setSelected] = useState<{ slot: Creneau; date: string } | null>(null)
  const clubId = ctx.club.id

  const open = useMemo(() => db.absences
    .filter((a) => a.clubId === clubId && absenceStatus(db, a) === 'open')
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((a) => ({ a, o: buildOccurrence(db, db.creneaux.find((c) => c.id === a.creneauId)!, a.date) })), [db, clubId])

  const members = approvedMembers(db, clubId)
  const toValidate = open.filter(({ a }) => db.remplacements.some((r) => r.absenceId === a.id && r.status === 'pending'))
  const withoutVolunteer = open.filter(({ a }) => !db.remplacements.some((r) => r.absenceId === a.id && r.status === 'pending'))
  const listed = open.filter(({ a }) => filter === 'all' || eligibility(db, ctx.user.id, a).ok)
  const mine = db.remplacements
    .filter((r) => r.volunteerId === ctx.user.id && db.absences.some((a) => a.id === r.absenceId && a.clubId === clubId))
    .sort((x, y) => y.createdAt.localeCompare(x.createdAt))

  const show = (o: Occurrence) => setSelected({ slot: o.slot, date: o.date })

  // Un responsable peut annuler l'absence d'un collègue (il revient finalement, par exemple).
  const cancel = async (a: Absence, o: Occurrence, absent?: User) => {
    const who = a.educatorId === ctx.user.id ? 'Vous assurerez' : `${absent?.firstname ?? "L'éducateur"} assurera`
    const volunteers = db.remplacements.some((r) => r.absenceId === a.id && r.status === 'pending')
    if (await confirm({
      title: "Annuler l'absence ?",
      body: `${who} la séance ${o.groupe?.name ?? ''} du ${fmtLong(a.date)}.${volunteers ? ' Les volontaires seront prévenus.' : ''}`,
      confirmLabel: "Annuler l'absence",
      tone: 'primary',
    })) run(() => cancelAbsence(a.id), 'Absence annulée.')
  }

  return (
    <>
      <PageHeader title="Remplacements" description="Les séances à pourvoir s'affichent selon vos diplômes et vos disponibilités. Un responsable valide chaque remplacement." />

      <div className="space-y-6">
        {ctx.can('replacements') && (
          <Panel title="À valider" description={toValidate.length ? `${pluralize(toValidate.length, 'séance')} avec des volontaires` : undefined}>
            {toValidate.length === 0 ? (
              <EmptyState compact icon={Inbox} title="Aucune candidature en attente">Les volontaires apparaîtront ici dès qu'ils se proposeront.</EmptyState>
            ) : (
              <ul className="space-y-4">
                {toValidate.map(({ a, o }) => {
                  const candidates = db.remplacements.filter((r) => r.absenceId === a.id && r.status === 'pending')
                  const absent = o.absences.find((x) => x.absence.id === a.id)?.educator
                  return (
                    <li key={a.id} className="rounded-xl border border-line">
                      <SessionHeader a={a} o={o} absentName={fullName(absent)} onOpen={() => show(o)} showReason>
                        <Button size="sm" variant="ghost" onClick={() => cancel(a, o, absent)}>Annuler l'absence</Button>
                      </SessionHeader>
                      <ul className="divide-y divide-line border-t border-line">
                        {candidates.map((c) => {
                          const v = userById(db, c.volunteerId)
                          const e = eligibility(db, c.volunteerId, a, 'other')
                          return (
                            <li key={c.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                              <Avatar name={fullName(v)} size={32} />
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-ink">{fullName(v)}</p>
                                <p className={cn('text-[13px]', e.ok ? 'text-muted' : 'text-rope')}>{e.ok ? (o.qualification ? `${o.qualification.short} valide, disponible` : 'Disponible') : e.reason}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost" onClick={async () => {
                                  // Un refus est définitif : la personne ne pourra plus se proposer pour cette séance.
                                  if (await confirm({ title: `Refuser la candidature de ${fullName(v)} ?`, body: 'Cette personne sera prévenue et ne pourra plus se proposer pour ce remplacement.', confirmLabel: 'Refuser' })) run(() => decideReplacement(c.id, false), 'Candidature refusée. Le volontaire est prévenu.')
                                }}>Refuser</Button>
                                <Button size="sm" disabled={!e.ok} onClick={() => run(() => decideReplacement(c.id, true), `${v?.firstname} remplacera ${absent?.firstname}. Le planning est à jour.`)}>Valider</Button>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                  )
                })}
              </ul>
            )}
            {withoutVolunteer.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-2 text-sm font-bold text-ink">Sans volontaire</h3>
                <ul className="divide-y divide-line rounded-xl border border-line">
                  {withoutVolunteer.map(({ a, o }) => {
                    const absent = o.absences.find((x) => x.absence.id === a.id)?.educator
                    const possible = members.filter((m) => eligibility(db, m.user.id, a).ok).length
                    // Sans candidat possible : dire si c'est le diplôme ou la disponibilité qui manque.
                    const others = members.filter((m) => m.user.id !== a.educatorId && !o.slot.educatorIds.includes(m.user.id))
                    const qualified = others.filter((m) => hasValidQualification(db, m.user.id, o.groupe?.qualificationId, a.date)).length
                    const label = possible
                      ? `${pluralize(possible, 'éducateur')} éligible${possible > 1 ? 's' : ''}`
                      : others.length === 0
                        ? 'Aucun autre éducateur dans le club'
                        : o.qualification && qualified === 0
                          ? `Personne d'autre n'a le ${o.qualification.short} valide`
                          : 'Aucun éducateur disponible'
                    return (
                      <li key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
                        <button type="button" onClick={() => show(o)} className="min-w-0 flex-1 text-left">
                          <p className="flex items-center gap-2 font-semibold text-ink"><LevelDot color={o.niveau?.color} />{o.groupe?.name}</p>
                          <p className="text-sm text-muted">{ucfirst(fmtShort(a.date))}, <span className="num">{fmtRange(o.slot.start, o.slot.end)}</span>, à la place de {fullName(absent)}</p>
                        </button>
                        <Badge tone={possible ? 'buoy' : 'rope'}>{label}</Badge>
                        <Button size="sm" variant="ghost" onClick={() => cancel(a, o, absent)}>Annuler l'absence</Button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </Panel>
        )}

        <Panel
          title="Séances à pourvoir"
          actions={<Segmented label="Séances affichées" value={filter} onChange={setFilter} options={[{ value: 'mine', label: 'Pour moi' }, { value: 'all', label: 'Toutes' }]} />}
        >
          {listed.length === 0 ? (
            <EmptyState compact icon={LifeBuoy} title={filter === 'mine' ? 'Aucune séance ne vous correspond' : 'Aucune séance à pourvoir'}>
              {filter === 'mine' ? 'Seules les séances dont vous avez le diplôme requis et où vous êtes libre sont listées.' : 'Toutes les absences du club sont couvertes.'}
            </EmptyState>
          ) : (
            <ul className="space-y-3">
              {listed.map(({ a, o }) => {
                const e = eligibility(db, ctx.user.id, a)
                const applied = db.remplacements.find((r) => r.absenceId === a.id && r.volunteerId === ctx.user.id && r.status === 'pending')
                const absent = o.absences.find((x) => x.absence.id === a.id)?.educator
                return (
                  <li key={a.id} className="rounded-xl border border-line">
                    <SessionHeader a={a} o={o} absentName={fullName(absent)} onOpen={() => show(o)}>
                      {applied ? (
                        <div className="flex items-center gap-2">
                          <Badge tone="buoy" dot>Candidature envoyée</Badge>
                          <Button size="sm" variant="ghost" onClick={() => run(() => withdraw(applied.id), 'Candidature retirée.')}>Retirer</Button>
                        </div>
                      ) : e.ok ? (
                        <Button size="sm" onClick={() => run(() => volunteer(a.id), 'Candidature envoyée. Vous serez prévenu·e de la décision.')}>Me proposer</Button>
                      ) : (
                        <span className="text-[13px] text-muted">{e.reason}</span>
                      )}
                    </SessionHeader>
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>

        <Panel title="Mes candidatures">
          {mine.length === 0 ? (
            <p className="text-sm text-muted">Vous ne vous êtes encore proposé·e pour aucun remplacement.</p>
          ) : (
            <ul className="divide-y divide-line">
              {mine.map((r) => {
                const a = db.absences.find((x) => x.id === r.absenceId)!
                const s = db.creneaux.find((c) => c.id === a.creneauId)
                const g = db.groupes.find((x) => x.id === s?.groupeId)
                const future = s && !isOver(a.date, s.start)
                // Candidature restée en attente alors que la séance n'est plus à pourvoir (passée sans décision).
                const stale = r.status === 'pending' && absenceStatus(db, a) !== 'open'
                return (
                  <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-ink">{g?.name}</p>
                      <p className="text-sm text-muted"><span className="first-letter:uppercase inline-block">{fmtLong(a.date)}</span>{s && <>, <span className="num">{fmtRange(s.start, s.end)}</span></>}</p>
                    </div>
                    {stale ? <Badge tone="neutral">Sans suite</Badge> : <ReplacementStatusBadge status={r.status} />}
                    {future && !stale && (r.status === 'pending' || r.status === 'approved') && (
                      <Button size="sm" variant="ghost" onClick={async () => {
                        if (r.status === 'approved' && !(await confirm({ title: 'Vous désister de ce remplacement ?', body: 'La séance redeviendra à pourvoir. La personne absente et les responsables seront prévenus.', confirmLabel: 'Me désister' }))) return
                        run(() => withdraw(r.id), r.status === 'approved' ? 'Désistement enregistré. La personne absente et les responsables sont prévenus.' : 'Candidature retirée.')
                      }}>{r.status === 'approved' ? 'Me désister' : 'Retirer'}</Button>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>
      </div>

      <SessionDrawer slot={selected?.slot ?? null} date={selected?.date ?? null} onClose={() => setSelected(null)} />
    </>
  )
}

function SessionHeader({ a, o, absentName, onOpen, showReason, children }: { a: Absence; o: Occurrence; absentName: string; onOpen: () => void; showReason?: boolean; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3.5">
      <div className="flex w-14 shrink-0 flex-col items-center rounded-md bg-surface-2 py-1.5">
        <span className="text-[11.5px] font-semibold text-muted">{ucfirst(fmtShort(a.date).split(' ')[0])}</span>
        <span className="display-md text-[22px] text-ink num">{a.date.slice(8)}</span>
      </div>
      <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
        <p className="flex items-center gap-2 font-semibold text-ink"><LevelDot color={o.niveau?.color} /><span className="truncate">{o.groupe?.name}</span></p>
        <p className="text-sm text-ink-2"><span className="num">{fmtRange(o.slot.start, o.slot.end)}</span>, {o.piscine?.name}{o.slot.ligne ? `, ${o.slot.ligne}` : ''}</p>
        <p className="text-[13px] text-muted">
          À la place de {absentName}, {relativeDay(a.date)}
          {o.qualification && <>, {o.qualification.short} requis</>}
        </p>
        {showReason && a.reason && <p className="mt-0.5 text-[13px] text-muted">Motif : {a.reason}</p>}
      </button>
      {children && <div className="flex w-full justify-end sm:w-auto">{children}</div>}
    </div>
  )
}
