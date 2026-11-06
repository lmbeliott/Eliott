import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck2, Check, ChevronRight, Sun } from 'lucide-react'
import { Badge, Button, ButtonLink, EmptyState, LevelDot, PageHeader, Panel } from '../../components/ui'
import { SessionDrawer } from '../../components/SessionDrawer'
import { ExpiryBadge } from '../../components/status'
import { useAction } from '../../components/feedback'
import { useAppCtx } from '../../data/hooks'
import { useWholeDB } from '../../data/store'
import { absenceStatus, approvedMembers, eligibility, fullName, shortName, volunteer } from '../../data/api'
import { buildOccurrence, effectiveCoaches, involves, occurrencesOn, type Occurrence } from '../../data/occurrences'
import { addDays, daysUntil, fmtLong, fmtRange, fmtShort, fmtTime, isOver, relativeDay, today, toISO, startOfWeek } from '../../lib/dates'
import { cn, ucfirst } from '../../lib/util'
import type { Creneau } from '../../data/types'

export default function Dashboard() {
  const ctx = useAppCtx()
  const db = useWholeDB()
  const run = useAction()
  const [selected, setSelected] = useState<{ slot: Creneau; date: string } | null>(null)
  const t = today()
  const clubId = ctx.club.id

  const data = useMemo(() => {
    const days = Array.from({ length: 8 }, (_, i) => toISO(addDays(t, i)))
    const mineUpcoming = days.flatMap((d) => occurrencesOn(db, clubId, d).filter((o) => involves(o, ctx.user.id) || o.absences.some((a) => a.absence.educatorId === ctx.user.id)))
      .filter((o) => !isOver(o.date, o.slot.end))
      .slice(0, 6)
    const todayAll = occurrencesOn(db, clubId, toISO(t))

    const openAbsences = db.absences.filter((a) => a.clubId === clubId && absenceStatus(db, a) === 'open').sort((a, b) => a.date.localeCompare(b.date))
    const forMe = openAbsences
      .filter((a) => eligibility(db, ctx.user.id, a).ok)
      .map((a) => ({ a, o: buildOccurrence(db, db.creneaux.find((c) => c.id === a.creneauId)!, a.date), applied: db.remplacements.some((r) => r.absenceId === a.id && r.volunteerId === ctx.user.id && r.status === 'pending') }))

    const weekStart = startOfWeek(t)
    const weekSessions = Array.from({ length: 7 }, (_, i) => occurrencesOn(db, clubId, toISO(addDays(weekStart, i))).length).reduce((s, n) => s + n, 0)
    const horizon = toISO(addDays(t, 14))
    const uncovered = openAbsences.filter((a) => a.date <= horizon).length
    const pendingCandidatures = db.remplacements.filter((r) => r.status === 'pending' && openAbsences.some((a) => a.id === r.absenceId)).length
    const pendingMembers = db.memberships.filter((m) => m.clubId === clubId && m.status === 'pending').length

    const team = approvedMembers(db, clubId).map((m) => m.user.id)
    const expiring = db.userQualifications
      .filter((uq) => team.includes(uq.userId) && uq.expiresOn && daysUntil(uq.expiresOn) <= 60)
      .sort((a, b) => (a.expiresOn ?? '').localeCompare(b.expiresOn ?? ''))
    const myQuals = db.userQualifications.filter((uq) => uq.userId === ctx.user.id && uq.expiresOn && daysUntil(uq.expiresOn) <= 60)

    const hasSlots = db.creneaux.some((c) => c.clubId === clubId)
    return { hasSlots, mineUpcoming, todayAll, forMe, weekSessions, uncovered, pendingCandidatures, pendingMembers, expiring, myQuals }
  }, [db, clubId, ctx.user.id, t])

  const open = (o: Occurrence) => setSelected({ slot: o.slot, date: o.date })

  return (
    <>
      <PageHeader
        title={`Bonjour ${ctx.user.firstname}`}
        description={<span className="first-letter:uppercase inline-block">{fmtLong(t)}, {ctx.club.name}</span>}
        actions={<ButtonLink to="/app/planning" variant="secondary">Voir le planning</ButtonLink>}
      />

      {ctx.can('planning') && !data.hasSlots && <SetupChecklist />}

      {ctx.isManager && data.hasSlots && (
        <dl className="mb-6 grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-surface lg:grid-cols-4">
          <Kpi to="/app/planning" label="Séances cette semaine" value={data.weekSessions} />
          <Kpi to="/app/remplacements" label="Absences à couvrir (14 j)" value={data.uncovered} alert={data.uncovered > 0} />
          {ctx.can('replacements') && <Kpi to="/app/remplacements" label="Candidatures à valider" value={data.pendingCandidatures} warn={data.pendingCandidatures > 0} />}
          {ctx.can('team') && <Kpi to="/app/equipe/demandes" label="Adhésions en attente" value={data.pendingMembers} warn={data.pendingMembers > 0} />}
        </dl>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Panel title="Mes prochaines séances" actions={<Link to="/app/planning?vue=moi" className="text-sm font-semibold text-water hover:underline">Tout voir</Link>}>
            {data.mineUpcoming.length === 0 ? (
              <EmptyState compact icon={CalendarCheck2} title="Aucune séance dans les 7 prochains jours">
                Vos créneaux apparaîtront ici dès qu'un responsable vous aura affecté·e.
              </EmptyState>
            ) : (
              <ul className="-mx-2 divide-y divide-line">
                {data.mineUpcoming.map((o) => <MySessionRow key={o.key} o={o} me={ctx.user.id} onOpen={() => open(o)} />)}
              </ul>
            )}
          </Panel>

          {ctx.isManager && data.hasSlots && (
            <Panel title="Aujourd'hui au bassin" description={`${data.todayAll.length} séance${data.todayAll.length > 1 ? 's' : ''} programmée${data.todayAll.length > 1 ? 's' : ''}`}>
              {data.todayAll.length === 0 ? (
                <EmptyState compact icon={Sun} title="Pas de séance aujourd'hui">Profitez-en pour préparer la semaine prochaine.</EmptyState>
              ) : (
                <ol className="relative ml-1 border-l-2 border-line">
                  {data.todayAll.map((o) => {
                    const coaches = effectiveCoaches(o)
                    return (
                      <li key={o.key} className="relative pb-4 pl-5 last:pb-0">
                        <span aria-hidden className={cn('absolute -left-[7px] top-1.5 size-3 rounded-full ring-4 ring-surface', o.state === 'open' || o.state === 'unreplaced' ? 'bg-rope-bright' : o.state === 'replaced' ? 'bg-kelp-bright' : 'bg-water-bright')} />
                        <button type="button" onClick={() => open(o)} className="w-full rounded-lg text-left hover:bg-surface-2/60 -mx-2 px-2 py-1">
                          <div className="flex flex-wrap items-baseline gap-x-3">
                            <span className="font-bold text-ink num">{fmtRange(o.slot.start, o.slot.end)}</span>
                            <span className="inline-flex items-center gap-1.5 font-semibold text-ink"><LevelDot color={o.niveau?.color} />{o.groupe?.name}</span>
                          </div>
                          <p className="mt-0.5 text-sm text-muted">
                            {o.piscine?.name}{o.slot.ligne ? `, ${o.slot.ligne}` : ''}
                            {coaches.length > 0 && <> avec {coaches.map((c) => shortName(c.user)).join(' et ')}</>}
                          </p>
                          {o.state === 'open' && <p className="mt-1 text-sm font-semibold text-rope">Éducateur absent, pas encore remplacé</p>}
                        </button>
                      </li>
                    )
                  })}
                </ol>
              )}
            </Panel>
          )}
        </div>

        <div className="space-y-6">
          <Panel title="Remplacements pour vous" actions={<Link to="/app/remplacements" className="text-sm font-semibold text-water hover:underline">Tout voir</Link>}>
            {data.forMe.length === 0 ? (
              <p className="text-sm text-muted">Aucun créneau à pourvoir ne correspond à vos diplômes et disponibilités pour le moment.</p>
            ) : (
              <ul className="space-y-3">
                {data.forMe.slice(0, 3).map(({ a, o, applied }) => (
                  <li key={a.id} className="rounded-xl border border-line p-3.5">
                    <button type="button" onClick={() => open(o)} className="block w-full text-left">
                      <p className="flex items-center gap-2 font-semibold text-ink"><LevelDot color={o.niveau?.color} />{o.groupe?.name}</p>
                      <p className="mt-0.5 text-sm text-ink-2">{ucfirst(fmtShort(a.date))}, <span className="num">{fmtRange(o.slot.start, o.slot.end)}</span></p>
                      <p className="text-[13px] text-muted">{o.piscine?.name}, à la place de {shortName(o.absences.find((x) => x.absence.id === a.id)?.educator)}</p>
                    </button>
                    <div className="mt-3">
                      {applied ? <Badge tone="buoy" dot>Candidature envoyée</Badge>
                        : <Button size="sm" onClick={() => run(() => volunteer(a.id), 'Candidature envoyée.')}>Me proposer</Button>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {data.myQuals.length > 0 && (
            <Panel title="Mes diplômes à renouveler">
              <ul className="space-y-2.5">
                {data.myQuals.map((uq) => (
                  <li key={uq.id} className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-ink">{db.qualifications.find((q) => q.id === uq.qualificationId)?.short}</span>
                    <ExpiryBadge expiresOn={uq.expiresOn} />
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {ctx.can('team') && (
            <Panel title="Diplômes de l'équipe" description="Expirés ou à recycler dans les 60 jours" actions={<Link to="/app/equipe" className="text-sm font-semibold text-water hover:underline">Équipe</Link>}>
              {data.expiring.length === 0 ? <p className="text-sm text-muted">Tous les diplômes sont à jour.</p> : (
                <ul className="divide-y divide-line">
                  {data.expiring.map((uq) => {
                    const u = db.users.find((x) => x.id === uq.userId)
                    return (
                      <li key={uq.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink">{fullName(u)}</p>
                          <p className="text-[13px] text-muted">{db.qualifications.find((q) => q.id === uq.qualificationId)?.short}</p>
                        </div>
                        <ExpiryBadge expiresOn={uq.expiresOn} />
                      </li>
                    )
                  })}
                </ul>
              )}
            </Panel>
          )}
        </div>
      </div>

      <SessionDrawer slot={selected?.slot ?? null} date={selected?.date ?? null} onClose={() => setSelected(null)} />
    </>
  )
}

function SetupChecklist() {
  const ctx = useAppCtx()
  const db = useWholeDB()
  const clubId = ctx.club.id
  const steps = [
    { title: 'Ajoutez vos piscines', text: 'Les bassins où le club a des lignes d’eau.', done: db.piscines.some((p) => p.clubId === clubId), to: '/app/configuration/piscines', cta: 'Ajouter une piscine' },
    { title: 'Créez vos groupes', text: 'Par piscine, avec leur niveau et le diplôme requis.', done: db.groupes.some((g) => g.clubId === clubId), to: '/app/configuration/groupes', cta: 'Créer un groupe' },
    { title: 'Faites venir vos éducateurs', text: `Ils créent leur compte et demandent à rejoindre « ${ctx.club.name} ».`, done: approvedMembers(db, clubId).length > 1, to: '/app/equipe/demandes', cta: 'Voir les demandes' },
    { title: 'Planifiez les créneaux', text: 'Un par un, ou tout le planning d’un coup depuis Excel.', done: db.creneaux.some((c) => c.clubId === clubId), to: '/app/configuration', cta: 'Planifier' },
  ]
  const next = steps.findIndex((s) => !s.done)
  return (
    <Panel title="Mettez votre club à l'eau" description={`${steps.filter((s) => s.done).length} étape${steps.filter((s) => s.done).length > 1 ? 's' : ''} sur ${steps.length}`} className="mb-6">
      <ol className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.title} className={cn('flex flex-col rounded-xl border p-4', i === next ? 'border-water-bright bg-water-soft/50' : 'border-line')}>
            <span className={cn('flex size-8 items-center justify-center rounded-lg text-[15px] font-extrabold num [font-stretch:75%]', s.done ? 'bg-kelp-soft text-kelp' : 'bg-ink text-surface')}>
              {s.done ? <Check aria-hidden className="size-4" strokeWidth={3} /> : i + 1}
            </span>
            <p className={cn('mt-3 font-semibold', s.done ? 'text-muted line-through decoration-1' : 'text-ink')}>{s.title}</p>
            <p className="mt-1 flex-1 text-sm text-muted">{s.text}</p>
            {s.done ? <span className="sr-only">Terminé</span> : <ButtonLink to={s.to} size="sm" variant={i === next ? 'primary' : 'secondary'} className="mt-3 self-start">{s.cta}</ButtonLink>}
          </li>
        ))}
      </ol>
    </Panel>
  )
}

function Kpi({ to, label, value, alert, warn }: { to: string; label: string; value: number; alert?: boolean; warn?: boolean }) {
  return (
    <Link to={to} className="group border-b border-r border-line px-5 py-4 transition-colors hover:bg-surface-2/60 [&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0">
      <dt className="text-[13px] font-medium text-muted">{label}</dt>
      <dd className={cn('display-md mt-1 text-[34px] num', alert ? 'text-rope' : warn ? 'text-buoy' : 'text-ink')}>{value}</dd>
    </Link>
  )
}

function MySessionRow({ o, me, onOpen }: { o: Occurrence; me: string; onOpen: () => void }) {
  const myAbs = o.absences.find((a) => a.absence.educatorId === me)
  const covering = o.absences.find((a) => a.replacement?.id === me)
  return (
    <li>
      <button type="button" onClick={onOpen} className="flex w-full items-center gap-4 rounded-lg px-2 py-3 text-left hover:bg-surface-2/60">
        <div className="w-14 shrink-0 text-center">
          <p className="text-[12px] font-semibold text-muted">{relativeDay(o.date) === "aujourd'hui" ? 'Auj.' : ucfirst(fmtShort(o.date).split(' ')[0])}</p>
          <p className="display-md text-[26px] text-ink num">{o.date.slice(8)}</p>
        </div>
        <span aria-hidden className="h-10 w-1 shrink-0 rounded-full" style={{ background: o.niveau?.color ?? 'var(--line-strong)' }} />
        <div className="min-w-0 flex-1">
          <p className={cn('truncate font-semibold', myAbs ? 'text-muted line-through decoration-rope/60' : 'text-ink')}>{o.groupe?.name}</p>
          <p className="truncate text-sm text-muted"><span className="num">{fmtTime(o.slot.start)} – {fmtTime(o.slot.end)}</span>, {o.piscine?.name}</p>
        </div>
        <div className="hidden shrink-0 sm:block">
          {myAbs ? (myAbs.replacement ? <Badge tone="kelp">Remplacé·e par {myAbs.replacement.firstname}</Badge> : <Badge tone="rope" dot>Absence déclarée</Badge>)
            : covering ? <Badge tone="water">Remplacement</Badge> : null}
        </div>
        <ChevronRight aria-hidden className="size-4 shrink-0 text-muted" />
      </button>
    </li>
  )
}
