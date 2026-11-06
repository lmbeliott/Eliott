import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeftRight, Bell, CalendarDays, CalendarX2, CreditCard, Download, FileSpreadsheet, Home, LifeBuoy,
  LogOut, Menu, Repeat, RotateCcw, Settings2, UserRound, Users, type LucideIcon,
} from 'lucide-react'
import { Logo } from './Logo'
import { Avatar, Drawer, IconButton } from './ui'
import { InstallGuide } from './InstallGuide'
import { useAction, useConfirm } from './feedback'
import { useAppCtx } from '../data/hooks'
import { useWholeDB, resetStore } from '../data/store'
import { absenceStatus, eligibility, fullName, leaveClubSelection, loginDemo, logout, markNotificationsRead } from '../data/api'
import { DEMO_ADMIN_EMAIL, DEMO_EDUCATOR_EMAIL } from '../data/seed'
import { cn } from '../lib/util'
import type { Permission } from '../data/types'

interface NavItem { to: string; label: string; icon: LucideIcon; end?: boolean; perm?: Permission | 'admin' | 'team-or-roles'; badge?: number }

export default function AppShell({ children }: { children: ReactNode }) {
  const ctx = useAppCtx()
  const db = useWholeDB()
  const [more, setMore] = useState(false)
  const [install, setInstall] = useState(false)
  const loc = useLocation()
  useEffect(() => setMore(false), [loc.pathname])

  const counts = useMemo(() => {
    const clubAbs = db.absences.filter((a) => a.clubId === ctx.club.id && absenceStatus(db, a) === 'open')
    const openForMe = clubAbs.filter((a) => eligibility(db, ctx.user.id, a).ok && !db.remplacements.some((r) => r.absenceId === a.id && r.volunteerId === ctx.user.id && r.status === 'pending')).length
    const toValidate = ctx.can('replacements') ? db.remplacements.filter((r) => r.status === 'pending' && clubAbs.some((a) => a.id === r.absenceId)).length : 0
    const requests = ctx.can('team') ? db.memberships.filter((m) => m.clubId === ctx.club.id && m.status === 'pending').length : 0
    return { replacements: openForMe + toValidate, requests }
  }, [db, ctx])

  const main: NavItem[] = [
    { to: '/app', label: 'Tableau de bord', icon: Home, end: true },
    { to: '/app/planning', label: 'Planning', icon: CalendarDays },
    { to: '/app/absences', label: 'Mes absences', icon: CalendarX2 },
    { to: '/app/remplacements', label: 'Remplacements', icon: ArrowLeftRight, badge: counts.replacements },
  ]
  const manage: NavItem[] = [
    { to: '/app/configuration', label: 'Configuration', icon: Settings2, perm: 'planning' },
    { to: '/app/equipe', label: 'Équipe', icon: Users, perm: 'team-or-roles', badge: counts.requests },
    { to: '/app/rapports', label: 'Rapports', icon: FileSpreadsheet, perm: 'reports' },
    { to: '/app/abonnement', label: 'Abonnement', icon: CreditCard, perm: 'admin' },
  ].filter((i) => allowed(i as NavItem)) as NavItem[]
  const footer: NavItem[] = [
    { to: '/app/support', label: 'Support', icon: LifeBuoy },
    { to: '/app/compte', label: 'Mon compte', icon: UserRound },
  ]

  function allowed(i: NavItem) {
    if (!i.perm) return true
    if (i.perm === 'admin') return ctx.isAdmin
    if (i.perm === 'team-or-roles') return ctx.can('team') || ctx.can('roles')
    return ctx.can(i.perm)
  }

  const nav = (
    <SidebarNav main={main} manage={manage} footer={footer} />
  )

  return (
    <div className="min-h-dvh bg-bg lg:pl-[264px]">
      {/* Barre latérale (ordinateur) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-line bg-surface lg:flex">
        <div className="flex h-16 items-center px-5"><Logo to="/app" /></div>
        <ClubSwitcher />
        <div className="flex-1 overflow-y-auto px-3 pb-4">{nav}</div>
        <UserBlock />
      </aside>

      {/* En-tête */}
      <header className="sticky top-0 z-20 border-b border-line bg-bg/95 backdrop-blur-[2px] supports-[backdrop-filter]:bg-bg/85">
        {ctx.demo && <DemoBar />}
        <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 lg:hidden">
            <Logo to="/app" className="[&>span]:hidden min-[380px]:[&>span]:inline" />
          </div>
          <p className="hidden min-w-0 truncate text-sm font-semibold text-ink-2 lg:block">{ctx.club.name}</p>
          <div className="flex items-center gap-1">
            <IconButton label="Installer l'application" icon={Download} onClick={() => setInstall(true)} className="hidden sm:inline-flex" />
            <Notifications />
            <IconButton label="Menu" icon={Menu} onClick={() => setMore(true)} className="lg:hidden" />
          </div>
        </div>
      </header>

      <main className="app-main mx-auto w-full max-w-[1240px] px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-8">{children}</main>

      {/* Barre d'onglets (mobile) */}
      <nav aria-label="Navigation rapide" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
        <ul className="grid grid-cols-5">
          {[
            { to: '/app', label: 'Accueil', icon: Home, end: true },
            { to: '/app/planning', label: 'Planning', icon: CalendarDays },
            { to: '/app/absences', label: 'Absences', icon: CalendarX2 },
            { to: '/app/remplacements', label: 'Remplacer', icon: Repeat, badge: counts.replacements },
          ].map((i) => (
            <li key={i.to}>
              <NavLink to={i.to} end={i.end} viewTransition className={({ isActive }) => cn('relative flex h-16 flex-col items-center justify-center gap-1 text-[11.5px] font-semibold transition-colors duration-200 [&>svg]:transition-transform [&>svg]:duration-300 active:[&>svg]:scale-90', isActive ? 'text-water [&>svg]:-translate-y-0.5' : 'text-muted')}>
                <i.icon aria-hidden className="size-[22px]" strokeWidth={2} />
                {i.label}
                {!!i.badge && <span key={i.badge} className="badge-bump absolute left-1/2 top-2 ml-2 rounded-full bg-rope px-1.5 text-[10.5px] font-bold leading-4 text-white dark:text-[#2a0d08]">{i.badge}</span>}
              </NavLink>
            </li>
          ))}
          <li>
            <button type="button" onClick={() => setMore(true)} className="flex h-16 w-full flex-col items-center justify-center gap-1 text-[11.5px] font-semibold text-muted">
              <Menu aria-hidden className="size-[22px]" />
              Plus
            </button>
          </li>
        </ul>
      </nav>

      <Drawer open={more} onClose={() => setMore(false)} title={ctx.club.name} width={360}>
        <div className="-mx-2">
          <ClubSwitcher inDrawer />
          {nav}
          <button type="button" onClick={() => { setMore(false); setInstall(true) }} className="mt-1 flex h-11 w-full items-center gap-3 rounded-lg px-3 text-[15px] font-medium text-ink-2 hover:bg-surface-2 hover:text-ink">
            <Download aria-hidden className="size-[18px]" /> Installer l'application
          </button>
        </div>
        <div className="-mx-5 mt-4 border-t border-line sm:-mx-6"><UserBlock /></div>
      </Drawer>
      <InstallGuide open={install} onClose={() => setInstall(false)} />
    </div>
  )
}

function SidebarNav({ main, manage, footer }: { main: NavItem[]; manage: NavItem[]; footer: NavItem[] }) {
  const ref = useRef<HTMLElement>(null)
  const { pathname } = useLocation()
  const [hl, setHl] = useState<{ y: number; h: number } | null>(null)
  useLayoutEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>('a[aria-current="page"]')
    if (!el || !ref.current) { setHl(null); return }
    const a = el.getBoundingClientRect(); const b = ref.current.getBoundingClientRect()
    setHl({ y: a.top - b.top, h: a.height })
  }, [pathname, main.length, manage.length])
  return (
    <nav ref={ref} aria-label="Navigation de l'application" className="relative flex flex-col gap-5">
      {hl && (
        <span aria-hidden className="slide-indicator inset-x-0 top-0 rounded-lg bg-water-soft" style={{ transform: `translateY(${hl.y}px)`, height: hl.h }}>
          <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r bg-water-bright" />
        </span>
      )}
      <NavGroup items={main} />
      {manage.length > 0 && <NavGroup title="Gestion du club" items={manage} />}
      <NavGroup items={footer} />
    </nav>
  )
}

function NavGroup({ title, items }: { title?: string; items: NavItem[] }) {
  return (
    <div>
      {title && <p className="mb-1 px-3 text-[12.5px] font-semibold text-muted">{title}</p>}
      <ul className="flex flex-col gap-0.5">
        {items.map((i) => (
          <li key={i.to}>
            <NavLink
              to={i.to}
              end={i.end}
              viewTransition
              className={({ isActive }) => cn(
                'relative flex h-10 items-center gap-3 rounded-lg px-3 text-[15px] font-medium transition-colors duration-200',
                isActive ? 'text-ink font-semibold' : 'text-ink-2 hover:bg-surface-2/70 hover:text-ink',
              )}
            >
              <i.icon aria-hidden className="size-[18px] shrink-0" strokeWidth={2} />
              <span className="flex-1 truncate">{i.label}</span>
              {!!i.badge && <span key={i.badge} className="badge-bump rounded-full bg-rope px-1.5 text-[11.5px] font-bold leading-5 text-white dark:text-[#2a0d08]" aria-label={`${i.badge} en attente`}>{i.badge}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ClubSwitcher({ inDrawer }: { inDrawer?: boolean }) {
  const ctx = useAppCtx()
  const db = useWholeDB()
  const navigate = useNavigate()
  const count = db.memberships.filter((m) => m.userId === ctx.user.id).length
  return (
    <div className={cn(inDrawer ? 'mb-4 px-2' : 'mx-3 mb-4')}>
      <div className="rounded-xl border border-line bg-bg px-3 py-2.5">
        <p className="truncate text-[14px] font-bold text-ink">{ctx.club.name}</p>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p className="truncate text-[12.5px] text-muted">{ctx.isAdmin ? 'Administrateur' : db.roles.find((r) => r.id === ctx.membership.roleId)?.name ?? 'Éducateur'}</p>
          <button type="button" onClick={() => { leaveClubSelection(); navigate('/clubs') }} className="shrink-0 text-[12.5px] font-semibold text-water hover:underline">
            {count > 1 ? 'Changer de club' : 'Mes clubs'}
          </button>
        </div>
      </div>
    </div>
  )
}

function UserBlock() {
  const ctx = useAppCtx()
  const name = fullName(ctx.user)
  return (
    <div className="flex items-center gap-3 border-t border-line px-4 py-3">
      <Avatar name={name} size={34} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{name}</p>
        <p className="truncate text-[12.5px] text-muted">{ctx.user.email}</p>
      </div>
      <IconButton label="Se déconnecter" icon={LogOut} size="sm" onClick={logout} />
    </div>
  )
}

function DemoBar() {
  const ctx = useAppCtx()
  const navigate = useNavigate()
  const run = useAction()
  const confirm = useConfirm()
  const isEducator = ctx.user.email === DEMO_EDUCATOR_EMAIL
  const switchTo = (email: string) => run(async () => { await loginDemo(email); navigate('/app') }, email === DEMO_ADMIN_EMAIL ? 'Vous voyez le club comme Camille, responsable.' : 'Vous voyez le club comme Léa, éducatrice.')
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-[#0c2a3e] px-4 py-2 text-[13px] text-[#cfe3ec] sm:px-6 lg:px-8">
      <p><span className="font-semibold text-white">Mode démo.</span> Les données restent dans ce navigateur.</p>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => switchTo(isEducator ? DEMO_ADMIN_EMAIL : DEMO_EDUCATOR_EMAIL)} className="font-semibold text-[#7fdcf2] hover:underline">
          {isEducator ? 'Voir comme responsable' : 'Voir comme éducatrice'}
        </button>
        <button type="button" onClick={async () => {
          if (await confirm({ title: 'Réinitialiser la démo ?', body: 'Toutes vos modifications seront effacées et les données d’exemple restaurées.', confirmLabel: 'Réinitialiser' })) {
            await resetStore(); await loginDemo(ctx.user.email); navigate('/app')
          }
        }} className="inline-flex items-center gap-1 font-semibold text-[#7fdcf2] hover:underline">
          <RotateCcw aria-hidden className="size-3.5" />Réinitialiser
        </button>
      </div>
    </div>
  )
}

function Notifications() {
  const ctx = useAppCtx()
  const db = useWholeDB()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const items = db.notifications.filter((n) => n.userId === ctx.user.id && n.clubId === ctx.club.id).slice(0, 12)
  const unread = items.filter((n) => !n.read)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={unread.length ? `Notifications, ${unread.length} non lues` : 'Notifications'}
        title="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="relative inline-flex size-10 items-center justify-center rounded-lg text-ink-2 hover:bg-surface-2 hover:text-ink"
      >
        <Bell aria-hidden className="size-[18px]" />
        {unread.length > 0 && <span key={unread.length} className="badge-bump absolute right-2 top-2 size-2.5 rounded-full bg-rope-bright ring-2 ring-bg" />}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-40 w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-line bg-surface shadow-float animate-[pop_140ms_var(--ease-swim)]">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-bold text-ink">Notifications</p>
            {unread.length > 0 && <button type="button" className="text-[13px] font-semibold text-water hover:underline" onClick={() => markNotificationsRead(unread.map((n) => n.id))}>Tout marquer comme lu</button>}
          </div>
          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">Rien de nouveau. Les absences, remplacements et adhésions apparaîtront ici.</p>
          ) : (
            <ul className="max-h-[60vh] overflow-y-auto">
              {items.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => { markNotificationsRead([n.id]); setOpen(false); if (n.href) navigate(n.href) }}
                    className="flex w-full gap-3 border-b border-line px-4 py-3 text-left last:border-0 hover:bg-surface-2"
                  >
                    <span aria-hidden className={cn('mt-1.5 size-2 shrink-0 rounded-full', n.read ? 'bg-transparent' : 'bg-water-bright')} />
                    <span className="min-w-0">
                      <span className={cn('block text-[14px]', n.read ? 'text-ink-2' : 'font-semibold text-ink')}>{n.text}</span>
                      <span className="mt-0.5 block text-[12.5px] text-muted">{timeAgo(n.createdAt)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 60000
  if (diff < 1) return "à l'instant"
  if (diff < 60) return `il y a ${Math.round(diff)} min`
  if (diff < 60 * 24) return `il y a ${Math.round(diff / 60)} h`
  const d = Math.round(diff / 60 / 24)
  return d === 1 ? 'hier' : `il y a ${d} jours`
}
