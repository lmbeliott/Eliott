import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, Clock, MapPin, Waves } from 'lucide-react'
import { Badge, Button, Drawer, Field, LevelDot, Textarea, Avatar } from './ui'
import { useAction, useConfirm } from './feedback'
import { useAppCtx } from '../data/hooks'
import { useWholeDB } from '../data/store'
import { buildOccurrence } from '../data/occurrences'
import { cancelAbsence, declareAbsence, decideReplacement, eligibility, fullName, userById, volunteer } from '../data/api'
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
      <dl className="grid gap-3 text-[15px]">
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
            <li key={u.id} className="rounded-xl border border-line p-3">
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
                <p className="mt-1 pl-[42px] text-[13px] text-muted">Motif (visible des responsables) : {abs.absence.reason}</p>
              )}
              {/* Validation rapide pour les responsables */}
              {abs && abs.status === 'open' && ctx.can('replacements') && abs.candidates.length > 0 && (
                <ul className="mt-3 space-y-2 border-t border-line pt-3">
                  {abs.candidates.map((c) => {
                    const v = userById(db, c.volunteerId)
                    return (
                      <li key={c.id} className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm text-ink">{fullName(v)} se propose</span>
                        <span className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => run(() => decideReplacement(c.id, false), 'Candidature refusée.')}>Refuser</Button>
                          <Button size="sm" onClick={() => run(() => decideReplacement(c.id, true), `${fullName(v)} remplacera ${u.firstname}.`)}>Valider</Button>
                        </span>
                      </li>
                    )
                  })}
                </ul>
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
            <div key={a.absence.id} className="rounded-xl bg-rope-soft p-4">
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
          <div className="rounded-xl border border-line p-4">
            <Field label="Motif" optional hint="Visible uniquement des responsables du club." htmlFor="motif">
              <Textarea id="motif" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Maladie, formation, déplacement…" />
            </Field>
            <div className="mt-3 flex gap-2">
              <Button onClick={() => run(() => { declareAbsence(o.slot.id, o.date, reason); setDeclaring(false); setReason('') }, 'Absence déclarée. Les collègues diplômés et disponibles sont prévenus.')}>Déclarer l'absence</Button>
              <Button variant="ghost" onClick={() => setDeclaring(false)}>Annuler</Button>
            </div>
          </div>
        )}
        {myAbsence && myAbsence.status === 'open' && (
          <Button variant="ghost" className="text-rope" onClick={async () => {
            if (await confirm({ title: 'Annuler votre absence ?', body: `Vous assurerez la séance ${o.groupe?.name} du ${fmtLong(o.date)}. Les volontaires éventuels seront prévenus.`, confirmLabel: "Annuler l'absence", tone: 'primary' })) run(() => cancelAbsence(myAbsence.absence.id), 'Absence annulée.')
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
