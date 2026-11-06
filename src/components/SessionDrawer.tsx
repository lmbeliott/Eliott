import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, Clock, MapPin, Waves } from 'lucide-react'
import { Badge, Button, Drawer, Field, LevelDot, Textarea, Avatar } from './ui'
import { useAction, useConfirm, useToast } from './feedback'
import { useAppCtx } from '../data/hooks'
import { getDB, useWholeDB } from '../data/store'
import { buildOccurrence } from '../data/occurrences'
import { cancelAbsence, declareAbsence, decideReplacement, eligibility, eligibleVolunteers, fullName, userById, volunteer } from '../data/api'
import { fmtLong, fmtRange, isOver, relativeDay } from '../lib/dates'
import type { Creneau } from '../data/types'
import { AbsenceStatusBadge } from './status'
import { ucfirst } from '../lib/util'

/** Détail d'une séance (créneau + date) avec les actions possibles pour l'utilisateur. */
export function SessionDrawer({ slot, date, onClose }: { slot: Creneau | null; date: string | null; onClose: () => void }) {
  const ctx = useAppCtx()
  const db = useWholeDB()
  const run = useAction()
  const confirm = useConfirm()
  const toast = useToast()
  const navigate = useNavigate()
  const [declaring, setDeclaring] = useState(false)
  const [reason, setReason] = useState('')

  const open = !!slot && !!date
  const o = open ? buildOccurrence(db, db.creneaux.find((c) => c.id === slot!.id) ?? slot!, date!) : null
  const close = () => { setDeclaring(false); setReason(''); onClose() }

  if (!o) return <Drawer open={false} onClose={close} title="">{null}</Drawer>

  const past = isOver(o.date, o.slot.end)
  const mine = o.slot.educatorIds.includes(ctx.user.id)
  const myAbsence = o.absences.find((a) => a.absence.educatorId === ctx.user.id)

  return (
    <Drawer
      open={open}
      onClose={close}
      title={o.groupe?.name ?? 'Séance'}
      description={`${ucfirst(fmtLong(o.date))} (${relativeDay(o.date)})`}
      footer={ctx.can('planning') ? <Button variant="secondary" onClick={() => { close(); navigate(`/app/configuration?modifier=${o.slot.id}`) }}>Modifier le créneau</Button> : undefined}
    >
      <dl className="grid gap-3 text-base">
        <Row icon={Clock} label="Horaires"><span className="num">{fmtRange(o.slot.start, o.slot.end)}</span></Row>
        <Row icon={MapPin} label="Piscine">{o.piscine?.name ?? '—'}{o.slot.ligne ? `, ${o.slot.ligne}` : ''}</Row>
        <Row icon={Waves} label="Niveau"><span className="inline-flex items-center gap-2"><LevelDot color={o.niveau?.color} />{o.niveau?.name ?? 'Sans niveau'}</span></Row>
        <Row icon={Award} label="Diplôme requis">{o.qualification ? `${o.qualification.short}` : 'Aucun'}</Row>
      </dl>

      <h3 className="mt-7 text-sm font-bold text-ink">Encadrement</h3>
      {o.educators.length === 0 && <p className="mt-2 text-sm text-muted">Aucun éducateur affecté à ce créneau.</p>}
      <ul className="mt-2 space-y-2">
        {o.educators.map((u) => {
          const abs = o.absences.find((a) => a.absence.educatorId === u.id)
          return (
            <li key={u.id} className="rounded-lg border border-line p-3">
              <div className="flex items-center gap-3">
                <Avatar name={fullName(u)} size={30} />
                <span className="min-w-0 flex-1 truncate font-semibold text-ink">{fullName(u)}{u.id === ctx.user.id && <span className="font-normal text-muted"> (vous)</span>}</span>
                {abs ? <AbsenceStatusBadge status={abs.status} /> : <Badge tone="neutral">Titulaire</Badge>}
              </div>
              {abs?.replacement && <p className="mt-2 pl-[42px] text-sm text-kelp">Remplacé·e par <strong>{fullName(abs.replacement)}</strong></p>}
              {abs && !abs.replacement && abs.status === 'open' && (
                <p className="mt-2 pl-[42px] text-sm text-ink-2">{abs.candidates.length ? `${abs.candidates.length} volontaire${abs.candidates.length > 1 ? 's' : ''} en attente de validation` : 'Aucun volontaire pour le moment'}</p>
              )}
              {abs?.absence.reason && (ctx.can('replacements') || abs.absence.educatorId === ctx.user.id) && (
                <p className="mt-1 pl-[42px] text-sm text-muted">Motif (visible des responsables) : {abs.absence.reason}</p>
              )}
              {/* Validation rapide pour les responsables */}
              {abs && abs.status === 'open' && ctx.can('replacements') && abs.candidates.length > 0 && (
                <ul className="mt-3 space-y-2 border-t border-line pt-3">
                  {abs.candidates.map((c) => {
                    const v = userById(db, c.volunteerId)
                    // Motif à la 3e personne : le responsable lit la situation du volontaire, pas la sienne.
                    const e = eligibility(db, c.volunteerId, abs.absence, 'other')
                    return (
                      <li key={c.id} className="flex flex-wrap items-center justify-between gap-2">
                        <span className="min-w-0 text-sm text-ink">
                          {fullName(v)} se propose
                          {!e.ok && <span className="block text-sm text-rope">{e.reason}</span>}
                        </span>
                        <span className="flex items-center gap-4">
                          <Button size="sm" variant="ghost" onClick={async () => {
                            if (await confirm({ title: `Refuser la candidature de ${fullName(v)} ?`, body: 'Cette personne sera prévenue et ne pourra plus se proposer pour ce remplacement.', confirmLabel: 'Refuser' })) run(() => decideReplacement(c.id, false), 'Candidature refusée.')
                          }}>Refuser</Button>
                          <Button size="sm" disabled={!e.ok} onClick={() => run(() => decideReplacement(c.id, true), `${fullName(v)} remplacera ${u.firstname}.`)}>Valider</Button>
                        </span>
                      </li>
                    )
                  })}
                </ul>
              )}
              {/* Un responsable peut annuler l'absence d'un collègue (il revient), même si un remplaçant est validé. */}
              {abs && !past && ctx.can('replacements') && abs.absence.educatorId !== ctx.user.id && (abs.status === 'open' || abs.status === 'replaced') && (
                <Button size="sm" variant="ghost" className="mt-2 text-rope" onClick={async () => {
                  const notice = abs.replacement ? ` ${fullName(abs.replacement)} sera prévenu·e que son remplacement est annulé.` : abs.candidates.length ? ' Les volontaires seront prévenus.' : ''
                  if (await confirm({ title: `Annuler l'absence de ${u.firstname} ?`, body: `${u.firstname} assurera la séance du ${fmtLong(o.date)}.${notice}`, confirmLabel: "Annuler l'absence", tone: 'primary' })) {
                    run(() => cancelAbsence(abs.absence.id), `Absence annulée. ${u.firstname} reçoit une notification.`)
                  }
                }}>Annuler l'absence</Button>
              )}
            </li>
          )
        })}
      </ul>

      {/* Actions personnelles */}
      <div className="mt-7 space-y-3">
        {o.absences.filter((a) => a.status === 'open' && a.absence.educatorId !== ctx.user.id).map((a) => {
          const e = eligibility(db, ctx.user.id, a.absence)
          const already = a.candidates.some((c) => c.volunteerId === ctx.user.id)
          return (
            <div key={a.absence.id} className="rounded-lg bg-rope-soft p-4">
              <p className="font-semibold text-ink">{a.educator?.firstname} cherche un remplaçant</p>
              {already ? <p className="mt-1 text-sm text-ink-2">Votre candidature est envoyée. Un responsable va la valider.</p>
                : e.ok ? (
                  <Button className="mt-3" onClick={() => run(() => volunteer(a.absence.id), 'Candidature envoyée. Vous serez prévenu·e de la décision.')}>Me proposer pour ce remplacement</Button>
                ) : <p className="mt-1 text-sm text-ink-2">Vous ne pouvez pas vous proposer. {e.reason}.</p>}
            </div>
          )
        })}

        {mine && !past && !myAbsence && !declaring && (
          <Button variant="secondary" onClick={() => setDeclaring(true)}>Je serai absent·e à cette séance</Button>
        )}
        {mine && declaring && (
          <div className="rounded-lg border border-line p-4">
            <Field label="Motif" optional hint="Visible uniquement des responsables du club." htmlFor="motif">
              <Textarea id="motif" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Maladie, formation, déplacement…" />
            </Field>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
              <Button onClick={async () => {
                const a = await run(() => declareAbsence(o.slot.id, o.date, reason))
                if (!a) return
                setDeclaring(false); setReason('')
                // N'annoncer des collègues prévenus que s'il y en a (diplômés et libres).
                toast(eligibleVolunteers(getDB(), a).length > 0
                  ? 'Absence déclarée. Les collègues diplômés et disponibles sont prévenus.'
                  : "Absence déclarée. Aucun collègue diplômé n'est disponible pour l'instant : la séance reste à pourvoir dans Remplacements.")
              }}>Déclarer l'absence</Button>
              <Button variant="ghost" onClick={() => setDeclaring(false)}>Annuler</Button>
            </div>
          </div>
        )}
        {myAbsence && !past && (myAbsence.status === 'open' || myAbsence.status === 'replaced') && (
          <Button variant="ghost" className="text-rope" onClick={async () => {
            const notice = myAbsence.replacement ? `${fullName(myAbsence.replacement)}, qui devait vous remplacer, sera prévenu·e.` : 'Les volontaires éventuels seront prévenus.'
            if (await confirm({ title: 'Annuler votre absence ?', body: `Vous assurerez la séance${o.groupe ? ` ${o.groupe.name}` : ''} du ${fmtLong(o.date)}. ${notice}`, confirmLabel: "Annuler l'absence", tone: 'primary' })) run(() => cancelAbsence(myAbsence.absence.id), 'Absence annulée.')
          }}>Annuler mon absence</Button>
        )}
      </div>
    </Drawer>
  )
}

function Row({ icon: Icon, label, children }: { icon: typeof Clock; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icon aria-hidden className="mt-0.5 size-[18px] shrink-0 text-muted" />
      <dt className="w-32 shrink-0 text-muted">{label}</dt>
      <dd className="min-w-0 font-medium text-ink">{children}</dd>
    </div>
  )
}
