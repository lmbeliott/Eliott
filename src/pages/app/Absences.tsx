import { useMemo, useState, type FormEvent } from 'react'
import { CalendarX2, Info } from 'lucide-react'
import { Button, EmptyState, Field, FormError, LevelDot, PageHeader, Panel, Select, Textarea } from '../../components/ui'
import { AbsenceStatusBadge } from '../../components/status'
import { useAction, useConfirm, useToast } from '../../components/feedback'
import { useAppCtx } from '../../data/hooks'
import { getDB, useWholeDB } from '../../data/store'
import { absenceStatus, approvedReplacement, cancelAbsence, declareAbsence, eligibleVolunteers, fullName, userById } from '../../data/api'
import { DAYS, fmtLong, fmtRange, fmtShort, isOver, minutes, nextOccurrences, relativeDay } from '../../lib/dates'
import { cn, ucfirst } from '../../lib/util'

export default function Absences() {
  const ctx = useAppCtx()
  const db = useWholeDB()
  const run = useAction()
  const toast = useToast()
  const confirm = useConfirm()
  const [slotId, setSlotId] = useState('')
  const [date, setDate] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  const mySlots = db.creneaux
    .filter((c) => c.clubId === ctx.club.id && c.educatorIds.includes(ctx.user.id))
    .sort((a, b) => a.day - b.day || minutes(a.start) - minutes(b.start))
  const slot = mySlots.find((s) => s.id === slotId)
  const dates = useMemo(() => {
    if (!slot) return []
    return nextOccurrences(slot.day, 7).filter((d) => !isOver(d, slot.end)).slice(0, 6)
  }, [slot])
  const taken = new Set(db.absences.filter((a) => a.creneauId === slotId && a.educatorId === ctx.user.id && a.status !== 'cancelled').map((a) => a.date))

  const history = db.absences
    .filter((a) => a.clubId === ctx.club.id && a.educatorId === ctx.user.id && a.status !== 'cancelled')
    .sort((a, b) => b.date.localeCompare(a.date))
  const upcoming = history.filter((a) => absenceStatus(db, a) === 'open' || !isOver(a.date, '23:59'))
  const past = history.filter((a) => !upcoming.includes(a))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const a = declareAbsence(slotId, date, reason)
      // Les collègues ne sont prévenus que s'ils ont le diplôme et sont libres : ne pas l'annoncer à tort.
      toast(eligibleVolunteers(getDB(), a).length > 0
        ? 'Absence déclarée. Les collègues diplômés et disponibles sont prévenus.'
        : "Absence déclarée. Aucun collègue diplômé n'est disponible pour l'instant : la séance reste à pourvoir dans Remplacements.")
      setDate(''); setReason('')
    } catch (err) { setError((err as Error).message) }
  }

  return (
    <>
      <PageHeader title="Mes absences" description="Déclarez une absence le plus tôt possible : le créneau est aussitôt proposé aux collègues qui ont le bon diplôme et sont libres." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Panel title="Déclarer une absence">
          {mySlots.length === 0 ? (
            <div className="flex gap-3 rounded-xl bg-surface-2 p-4 text-[15px] text-ink-2">
              <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-water" />
              <p>Aucun créneau n'est encore à votre nom. Demandez à un responsable du club de vous affecter à vos groupes depuis la configuration du planning.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5" noValidate>
              <FormError>{error}</FormError>
              <Field label="Créneau" htmlFor="abs-slot">
                <Select id="abs-slot" value={slotId} onChange={(e) => { setSlotId(e.target.value); setDate(''); setError(null) }}>
                  <option value="">Choisir un de vos créneaux…</option>
                  {mySlots.map((s) => {
                    const g = db.groupes.find((x) => x.id === s.groupeId)
                    return <option key={s.id} value={s.id}>{DAYS[s.day]} {fmtRange(s.start, s.end)}, {g?.name}</option>
                  })}
                </Select>
              </Field>
              {slot && (
                <fieldset>
                  <legend className="mb-1.5 text-sm font-semibold text-ink">Séance concernée</legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {dates.map((d) => {
                      const disabled = taken.has(d)
                      return (
                        <label key={d} className={cn(
                          'flex cursor-pointer flex-col rounded-xl border px-3 py-2.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-water-bright',
                          date === d ? 'border-btn bg-btn text-btn-ink' : 'border-line-strong hover:bg-surface-2',
                          disabled && 'cursor-not-allowed opacity-50',
                        )}>
                          <input type="radio" name="abs-date" value={d} checked={date === d} disabled={disabled} onChange={() => { setDate(d); setError(null) }} className="sr-only" />
                          <span className="text-[14px] font-semibold">{ucfirst(fmtShort(d))}</span>
                          <span className={cn('text-[12.5px]', date === d ? 'opacity-80' : 'text-muted')}>{disabled ? 'Déjà déclarée' : relativeDay(d)}</span>
                        </label>
                      )
                    })}
                  </div>
                </fieldset>
              )}
              <Field label="Motif" optional htmlFor="abs-reason" hint="Visible uniquement des responsables du club.">
                <Textarea id="abs-reason" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Maladie, formation, déplacement…" />
              </Field>
              <Button type="submit" disabled={!slotId || !date}>Déclarer l'absence</Button>
            </form>
          )}
        </Panel>

        <Panel title="Suivi de mes absences">
          {history.length === 0 ? (
            <EmptyState compact icon={CalendarX2} title="Aucune absence déclarée">Vos absences et leurs remplaçants apparaîtront ici.</EmptyState>
          ) : (
            <div className="space-y-6">
              {[{ title: 'À venir', list: upcoming }, { title: 'Passées', list: past }].filter((s) => s.list.length).map((section) => (
                <div key={section.title}>
                  <h3 className="mb-2 text-[13px] font-semibold text-muted">{section.title}</h3>
                  <ul className="divide-y divide-line rounded-xl border border-line">
                    {section.list.map((a) => {
                      const s = db.creneaux.find((c) => c.id === a.creneauId)
                      const g = db.groupes.find((x) => x.id === s?.groupeId)
                      const lvl = db.niveaux.find((n) => n.id === g?.niveauId)
                      const status = absenceStatus(db, a)
                      const rp = approvedReplacement(db, a.id)
                      const rpUser = rp && userById(db, rp.volunteerId)
                      // Annulable tant que la séance n'est pas passée, même si un remplaçant est validé.
                      const canCancel = status === 'open' || (status === 'replaced' && !!s && !isOver(a.date, s.end))
                      const candidates = db.remplacements.filter((r) => r.absenceId === a.id && r.status === 'pending').length
                      return (
                        <li key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
                          <div className="min-w-0 flex-1">
                            <p className="flex items-center gap-2 font-semibold text-ink"><LevelDot color={lvl?.color} />{g?.name ?? 'Créneau supprimé'}</p>
                            <p className="text-sm text-muted"><span className="first-letter:uppercase inline-block">{fmtLong(a.date)}</span>{s && <>, <span className="num">{fmtRange(s.start, s.end)}</span></>}</p>
                            {rp && <p className="mt-0.5 text-sm text-kelp">Remplacé·e par {fullName(rpUser)}</p>}
                            {status === 'open' && <p className="mt-0.5 text-sm text-ink-2">{candidates ? `${candidates} volontaire${candidates > 1 ? 's' : ''}, en attente de validation` : 'Aucun volontaire pour le moment'}</p>}
                          </div>
                          <AbsenceStatusBadge status={status} />
                          {canCancel && (
                            <Button size="sm" variant="ghost" onClick={async () => {
                              const body = `Vous assurerez la séance ${g?.name ?? ''} du ${fmtLong(a.date)}.${status === 'replaced' && rpUser ? ` ${rpUser.firstname} sera prévenu·e que son remplacement n'est plus nécessaire.` : ''}`
                              if (await confirm({ title: 'Annuler cette absence ?', body, confirmLabel: "Annuler l'absence", tone: 'primary' })) run(() => cancelAbsence(a.id), 'Absence annulée.')
                            }}>Annuler</Button>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </>
  )
}
