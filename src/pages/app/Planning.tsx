import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertTriangle, CalendarPlus, Check, ChevronLeft, ChevronRight, UserX } from 'lucide-react'
import { Button, ButtonLink, EmptyState, IconButton, LevelDot, PageHeader, Segmented, Select } from '../../components/ui'
import { SessionDrawer } from '../../components/SessionDrawer'
import { useAppCtx } from '../../data/hooks'
import { useWholeDB } from '../../data/store'
import { shortName } from '../../data/api'
import { effectiveCoaches, involves, layoutColumns, occurrencesOn, type Occurrence } from '../../data/occurrences'
import { addDays, DAYS_SHORT, fmtLong, fmtRange, fmtTime, fromISO, MONTHS, minutes, nowMinutes, startOfWeek, today, toISO, weekday } from '../../lib/dates'
import { cn, pluralize, ucfirst } from '../../lib/util'
import type { Creneau } from '../../data/types'

const PX_PER_MIN = 1.05

export default function Planning() {
  const ctx = useAppCtx()
  const db = useWholeDB()
  const [params, setParams] = useSearchParams()
  const [selected, setSelected] = useState<{ slot: Creneau; date: string } | null>(null)
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 768px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // Un ?date= illisible (lien tronqué, saisie à la main) ramène à aujourd'hui.
  const rawDate = params.get('date')
  const parsed = rawDate && /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? fromISO(rawDate) : null
  const focus = parsed && !Number.isNaN(parsed.getTime()) ? parsed : today()
  // Sens de navigation : la semaine (ou le jour) suivante arrive par la droite.
  // Il ne change que lorsque la date affichée change, pas à chaque rendu.
  const focusISO = toISO(focus)
  const [nav, setNav] = useState<{ focus: string; dir: 'next' | 'prev' }>({ focus: focusISO, dir: 'next' })
  let dir = nav.dir
  if (nav.focus !== focusISO) {
    dir = focusISO > nav.focus ? 'next' : 'prev'
    setNav({ focus: focusISO, dir })
  }
  const slideClass = dir === 'next' ? 'animate-[slide-from-right_340ms_var(--ease-out)]' : 'animate-[slide-from-left_340ms_var(--ease-out)]'
  const mineOnly = params.get('vue') === 'moi'
  const pools = db.piscines.filter((p) => p.clubId === ctx.club.id)
  // Une piscine supprimée ou d'un autre club (favori, retour arrière) ne filtre rien.
  const rawPool = params.get('piscine') ?? ''
  const pool = pools.some((p) => p.id === rawPool) ? rawPool : ''
  const [mode, setMode] = useState<'week' | 'day'>(wide ? 'week' : 'day')
  const effectiveMode = wide ? mode : 'day'

  const set = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(patch)) v ? next.set(k, v) : next.delete(k)
    setParams(next, { replace: true })
  }

  const weekStart = startOfWeek(focus)
  const days = Array.from({ length: 7 }, (_, i) => toISO(addDays(weekStart, i)))
  const levels = db.niveaux.filter((n) => n.clubId === ctx.club.id)

  const byDay = useMemo(() => {
    const filter = (s: Creneau) => !pool || s.piscineId === pool
    return days.map((d) => occurrencesOn(db, ctx.club.id, d, filter).filter((o) => !mineOnly || involves(o, ctx.user.id) || o.absences.some((a) => a.absence.educatorId === ctx.user.id)))
  }, [db, ctx.club.id, ctx.user.id, days.join(), pool, mineOnly])

  const hasSlots = db.creneaux.some((c) => c.clubId === ctx.club.id)
  const step = effectiveMode === 'week' ? 7 : 1
  const label = weekLabel(weekStart)

  return (
    <>
      <PageHeader
        title="Planning"
        description="Cliquez sur une séance pour voir l'encadrement, déclarer une absence ou vous proposer en remplacement."
        actions={ctx.can('planning') && <ButtonLink to="/app/configuration" variant="secondary" icon={CalendarPlus}>Gérer les créneaux</ButtonLink>}
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <IconButton label={effectiveMode === 'week' ? 'Semaine précédente' : 'Jour précédent'} icon={ChevronLeft} onClick={() => set({ date: toISO(addDays(focus, -step)) })} />
          <Button variant="secondary" size="sm" onClick={() => set({ date: null })}>Aujourd'hui</Button>
          <IconButton label={effectiveMode === 'week' ? 'Semaine suivante' : 'Jour suivant'} icon={ChevronRight} onClick={() => set({ date: toISO(addDays(focus, step)) })} />
        </div>
        <p className="text-base font-bold text-ink">{label}</p>
        <div className="flex w-full flex-wrap items-center gap-2 sm:ml-auto sm:w-auto">
          {wide && <Segmented label="Affichage" value={mode} onChange={setMode} options={[{ value: 'week', label: 'Semaine' }, { value: 'day', label: 'Jour' }]} />}
          <Segmented label="Séances affichées" value={mineOnly ? 'moi' : 'club'} onChange={(v) => set({ vue: v === 'moi' ? 'moi' : null })} options={[{ value: 'club', label: 'Tout le club' }, { value: 'moi', label: 'Mes séances' }]} />
          {pools.length > 1 && (
            <Select aria-label="Filtrer par piscine" value={pool} onChange={(e) => set({ piscine: e.target.value || null })} className="h-9 w-auto min-w-[180px] text-sm">
              <option value="">Toutes les piscines</option>
              {pools.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          )}
        </div>
      </div>

      {!hasSlots ? (
        <div className="elev-1 rounded-xl border border-line bg-surface">
          <EmptyState title="Le planning est vide" action={ctx.can('planning') ? <ButtonLink to="/app/configuration">Créer le premier créneau</ButtonLink> : undefined}>
            {ctx.can('planning') ? 'Ajoutez vos piscines, vos groupes puis vos créneaux, ou importez votre planning Excel.' : "Les responsables du club n'ont pas encore publié de créneaux."}
          </EmptyState>
        </div>
      ) : effectiveMode === 'week' ? (
        <div key={`${days[0]}-${pool}-${mineOnly}`} className={slideClass}>
          <WeekGrid days={days} byDay={byDay} me={ctx.user.id} showPool={!pool && pools.length > 1} onOpen={(o) => setSelected({ slot: o.slot, date: o.date })} />
        </div>
      ) : (
        <DayView
          days={days}
          focus={focusISO}
          byDay={byDay}
          me={ctx.user.id}
          onPick={(d) => set({ date: d })}
          onOpen={(o) => setSelected({ slot: o.slot, date: o.date })}
        />
      )}

      {levels.length > 0 && hasSlots && (
        <ul aria-label="Légende des niveaux" className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-2">
          {levels.map((l) => <li key={l.id} className="inline-flex items-center gap-1.5"><LevelDot color={l.color} />{l.name}</li>)}
          <li className="inline-flex items-center gap-1.5"><AlertTriangle aria-hidden className="size-3.5 text-rope" />À remplacer</li>
          <li className="inline-flex items-center gap-1.5"><Check aria-hidden className="size-3.5 text-kelp" strokeWidth={3} />Remplacé</li>
          <li className="inline-flex items-center gap-1.5"><UserX aria-hidden className="size-3.5 text-muted" />Non remplacé</li>
        </ul>
      )}

      <SessionDrawer slot={selected?.slot ?? null} date={selected?.date ?? null} onClose={() => setSelected(null)} />
    </>
  )
}

function weekLabel(start: Date) {
  const end = addDays(start, 6)
  const sameMonth = start.getMonth() === end.getMonth()
  return sameMonth
    ? `Du ${start.getDate()} au ${end.getDate()} ${MONTHS[end.getMonth()].toLowerCase()} ${end.getFullYear()}`
    : `Du ${start.getDate()} ${MONTHS[start.getMonth()].toLowerCase()} au ${end.getDate()} ${MONTHS[end.getMonth()].toLowerCase()} ${end.getFullYear()}`
}

// ---------------------------------------------------------------- semaine

function WeekGrid({ days, byDay, me, showPool, onOpen }: { days: string[]; byDay: Occurrence[][]; me: string; showPool: boolean; onOpen: (o: Occurrence) => void }) {
  const all = byDay.flat()
  const minH = Math.min(8, ...all.map((o) => Math.floor(minutes(o.slot.start) / 60)))
  const maxH = Math.max(21, ...all.map((o) => Math.ceil(minutes(o.slot.end) / 60)))
  const height = (maxH - minH) * 60 * PX_PER_MIN
  const todayISO = toISO(today())
  const [now, setNow] = useState(nowMinutes())
  useEffect(() => { const t = setInterval(() => setNow(nowMinutes()), 60_000); return () => clearInterval(t) }, [])
  // La grille défile dans sa propre boîte (en-tête des jours collant) : on l'ouvre sur la première séance.
  const scroller = useRef<HTMLDivElement>(null)
  const first = all.length ? Math.min(...all.map((o) => minutes(o.slot.start))) : null
  useEffect(() => {
    if (scroller.current && first !== null) scroller.current.scrollTop = Math.max(0, (first - minH * 60) * PX_PER_MIN - 12)
    // Une seule fois par semaine affichée (le parent remonte la grille à chaque changement).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={scroller} className="max-h-[max(360px,calc(100dvh-12rem))] elev-1 overflow-auto rounded-xl border border-line bg-surface">
      <div className="min-w-[860px]">
        <div className="sticky top-0 z-10 grid grid-cols-[56px_repeat(7,minmax(0,1fr))] border-b border-line bg-surface">
          <div />
          {days.map((d, i) => {
            const isToday = d === todayISO
            return (
              <div key={d} className={cn('border-l border-line px-2 py-2.5 text-center', isToday && 'bg-water-soft')}>
                <p className={cn('text-xs font-semibold', isToday ? 'text-water' : 'text-muted')}>{DAYS_SHORT[i]}</p>
                <p className={cn('display-md text-xl num', isToday ? 'text-water' : 'text-ink')}>{fromISO(d).getDate()}</p>
              </div>
            )
          })}
        </div>
        <div className="grid grid-cols-[56px_repeat(7,minmax(0,1fr))]">
          <div className="relative" style={{ height }}>
            {Array.from({ length: maxH - minH }, (_, i) => (
              <span key={i} className="absolute right-2 -translate-y-1/2 text-xs font-medium text-muted num" style={{ top: i * 60 * PX_PER_MIN }}>
                {i === 0 ? '' : `${minH + i}h`}
              </span>
            ))}
          </div>
          {days.map((d, di) => (
            <div key={d} className={cn('relative border-l border-line', d === todayISO && 'bg-water-soft/40')} style={{ height }}>
              {Array.from({ length: maxH - minH }, (_, i) => (
                <div key={i} aria-hidden className="absolute inset-x-0 border-t border-line/70" style={{ top: i * 60 * PX_PER_MIN }} />
              ))}
              {d === todayISO && now >= minH * 60 && now <= maxH * 60 && (
                <div aria-hidden className="absolute inset-x-0 z-[5] h-0.5 bg-rope-bright" style={{ top: (now - minH * 60) * PX_PER_MIN }}>
                  <span className="absolute -left-1 -top-[3px] size-2 rounded-full bg-rope-bright" />
                </div>
              )}
              {layoutColumns(byDay[di]).map((o) => (
                <WeekEvent key={o.key} o={o} me={me} showPool={showPool} minH={minH} onOpen={() => onOpen(o)} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WeekEvent({ o, me, showPool, minH, onOpen }: { o: Occurrence & { col: number; cols: number }; me: string; showPool: boolean; minH: number; onOpen: () => void }) {
  const top = (minutes(o.slot.start) - minH * 60) * PX_PER_MIN
  const h = Math.max(28, (minutes(o.slot.end) - minutes(o.slot.start)) * PX_PER_MIN - 2)
  const coaches = effectiveCoaches(o)
  const mine = involves(o, me)
  // Séances qui se chevauchent : colonne étroite, on garde l'heure de début et le nom du groupe en entier
  // (sur autant de lignes que la hauteur le permet) plutôt qu'une suite de fragments tronqués.
  // Bloc étroit et court : l'heure se lit déjà sur la grille, la place va au nom (2 lignes).
  const narrow = o.cols > 1
  const tall = h >= 56 && !narrow
  const hideTime = narrow && h < 56
  const nameLines = narrow ? Math.min(3, Math.floor((h - (hideTime ? 8 : 22)) / 15)) : 1
  const coachNames = coaches.map((c) => shortName(c.user)).join(', ')
  // Nom accessible complet : la date et l'état ne se lisent pas autrement dans la grille.
  const stateLabel = o.state === 'open' ? 'à remplacer'
    : o.state === 'unreplaced' ? 'non remplacé'
      : o.state === 'replaced' ? `remplacé, ${coachNames}`
        : coachNames || 'sans éducateur'
  const label = [
    ucfirst(fmtLong(o.date)),
    o.groupe?.name,
    fmtRange(o.slot.start, o.slot.end),
    showPool ? o.piscine?.name : null,
    stateLabel,
    coaches.some((c) => c.user.id === me) ? 'vous encadrez' : null,
  ].filter(Boolean).join(', ')
  const StateIcon = o.state === 'open' ? AlertTriangle : o.state === 'replaced' ? Check : o.state === 'unreplaced' ? UserX : null
  const stateIcon = StateIcon && <StateIcon aria-hidden strokeWidth={o.state === 'replaced' ? 3 : 2} className={cn('size-3 shrink-0', o.state === 'open' ? 'text-rope' : o.state === 'replaced' ? 'text-kelp' : 'text-muted')} />
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        'absolute flex flex-col justify-start overflow-hidden rounded-[3px] border-l-[3px] px-1.5 py-1 text-left transition-[filter] hover:brightness-[0.97] focus-visible:z-10',
        o.state === 'open' ? 'bg-rope-soft' : o.state === 'replaced' ? 'bg-kelp-soft' : 'bg-surface-2',
        mine && 'ring-1 ring-inset ring-water-bright/50',
      )}
      style={{
        top: top + 1,
        height: h,
        left: `calc(${(o.col / o.cols) * 100}% + 2px)`,
        width: `calc(${100 / o.cols}% - 4px)`,
        borderLeftColor: o.state === 'open' ? 'var(--rope-bright)' : o.state === 'unreplaced' ? 'var(--rope)' : o.niveau?.color ?? 'var(--line-strong)',
      }}
      aria-label={label}
    >
      {!hideTime && (
        <p className="flex items-center gap-0.5 text-xs font-semibold leading-tight text-muted num">
          {stateIcon}
          <span className="truncate">{fmtTime(o.slot.start)}{tall && ` – ${fmtTime(o.slot.end)}`}</span>
        </p>
      )}
      <p className={cn('text-xs font-bold leading-tight text-ink', nameLines >= 3 ? 'line-clamp-3 break-words' : nameLines === 2 ? 'line-clamp-2 break-words' : 'truncate')}>
        {hideTime && stateIcon && <span className="mr-0.5 inline-block align-[-2px]">{stateIcon}</span>}
        {o.groupe?.name}
      </p>
      {tall && showPool && h >= 76 && <p className="truncate text-xs leading-tight text-muted">{o.piscine?.name}</p>}
      {tall && (
        o.state === 'open' ? <p className="truncate text-xs font-semibold leading-tight text-rope">À remplacer</p>
          : o.state === 'unreplaced' ? <p className="truncate text-xs font-semibold leading-tight text-ink-2">Non remplacé</p>
            : <p className={cn('truncate text-xs leading-tight', o.state === 'replaced' ? 'font-semibold text-kelp' : 'text-ink-2')}>{coachNames || 'Sans éducateur'}</p>
      )}
    </button>
  )
}

// ---------------------------------------------------------------- jour

function DayView({ days, focus, byDay, me, onPick, onOpen }: { days: string[]; focus: string; byDay: Occurrence[][]; me: string; onPick: (d: string) => void; onOpen: (o: Occurrence) => void }) {
  const idx = Math.max(0, days.indexOf(focus))
  const items = byDay[idx] ?? []
  const todayISO = toISO(today())
  const byPool = new Map<string, Occurrence[]>()
  for (const o of items) {
    const k = o.piscine?.name ?? 'Piscine'
    byPool.set(k, [...(byPool.get(k) ?? []), o])
  }
  return (
    <div>
      <div role="group" aria-label="Jour de la semaine" className="elev-1 mb-5 grid grid-cols-7 gap-1 rounded-xl border border-line bg-surface p-1.5">
        {days.map((d, i) => {
          const active = d === days[idx]
          const count = byDay[i].length
          const alert = byDay[i].some((o) => o.state === 'open')
          return (
            <button
              key={d}
              type="button"
              aria-pressed={active}
              aria-current={d === todayISO ? 'date' : undefined}
              onClick={() => onPick(d)}
              className={cn('relative flex flex-col items-center rounded-[3px] py-2 transition-colors', active ? 'bg-btn text-btn-ink' : 'text-ink hover:bg-surface-2')}
            >
              <span className={cn('text-xs font-semibold', active ? 'opacity-80' : 'text-muted')}>{DAYS_SHORT[i]}</span>
              <span className={cn('display-md text-xl num', d === todayISO && !active && 'text-water')}>{fromISO(d).getDate()}</span>
              <span aria-hidden className={cn('mt-0.5 size-1.5 rounded-full', count === 0 ? 'bg-transparent' : alert ? 'bg-rope-bright' : active ? 'bg-btn-ink/70' : 'bg-water-bright')} />
              <span className="sr-only">{pluralize(count, 'séance')}{alert ? ', dont au moins une à remplacer' : ''}</span>
            </button>
          )
        })}
      </div>

      <div key={days[idx]} className="animate-[rise_320ms_var(--ease-out)]">
      {items.length === 0 ? (
        <div className="elev-1 rounded-xl border border-line bg-surface">
          <EmptyState compact title={`Aucune séance ${weekday(fromISO(days[idx])) >= 5 ? 'ce jour-là' : 'ce jour'}`}>Choisissez un autre jour ou affichez tout le club.</EmptyState>
        </div>
      ) : (
        <div className="space-y-6">
          {[...byPool.entries()].map(([poolName, list]) => (
            <section key={poolName}>
              <h2 className="mb-2.5 text-sm font-bold text-ink-2">{poolName}</h2>
              <ul className="elev-1 overflow-hidden rounded-xl border border-line bg-surface">
                {list.map((o) => {
                  const coaches = effectiveCoaches(o)
                  const mine = involves(o, me)
                  return (
                    <li key={o.key} className="border-b border-line last:border-0">
                      <button type="button" onClick={() => onOpen(o)} className="flex w-full items-stretch gap-3 px-4 py-3.5 text-left hover:bg-surface-2/60">
                        <div className="w-[62px] shrink-0 pt-0.5">
                          <p className="font-bold text-ink num">{fmtTime(o.slot.start)}</p>
                          <p className="text-sm text-muted num">{fmtTime(o.slot.end)}</p>
                        </div>
                        <span aria-hidden className="w-1 shrink-0 rounded-full" style={{ background: o.state === 'open' ? 'var(--rope-bright)' : o.niveau?.color ?? 'var(--line-strong)' }} />
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-2 font-semibold text-ink">
                            <span className="truncate">{o.groupe?.name}</span>
                            {mine && <span className="shrink-0 rounded-[3px] bg-water-soft px-2 text-xs font-bold leading-5 text-water">Vous</span>}
                          </p>
                          <p className="truncate text-sm text-muted">{o.slot.ligne ?? o.niveau?.name ?? ''}</p>
                          {o.state === 'open' ? (
                            <p className="mt-1 text-sm font-semibold text-rope">{o.absences.find((a) => a.status === 'open')?.educator?.firstname} absent·e, à remplacer</p>
                          ) : o.state === 'unreplaced' ? (
                            <p className="mt-1 text-sm font-semibold text-ink-2">{o.absences.find((a) => a.status === 'unreplaced')?.educator?.firstname} absent·e, non remplacé·e</p>
                          ) : (
                            <p className={cn('mt-1 text-sm', o.state === 'replaced' ? 'text-kelp' : 'text-ink-2')}>
                              {coaches.length ? coaches.map((c) => c.replacing ? `${shortName(c.user)} (remplace ${c.replacing.firstname})` : shortName(c.user)).join(', ') : 'Sans éducateur'}
                            </p>
                          )}
                        </div>
                        <ChevronRight aria-hidden className="mt-1 size-4 shrink-0 self-center text-muted" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
