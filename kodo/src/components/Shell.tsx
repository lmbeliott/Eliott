import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, ScrollRestoration, useLocation, useMatches, useNavigate } from 'react-router-dom'
import { Flame, LogOut, Menu, Moon, Settings, Sun, User, X } from 'lucide-react'
import { Logo } from './Logo'
import { Avatar, cx, IconButton, LinkButton, Segmented } from './ui'
import { useAuth } from '../lib/auth'
import { formatPoints, useI18n, type UiLang } from '../lib/i18n'
import { liveStreak, supabase } from '../lib/supabase'
import { useTheme } from '../lib/theme'
import { useGuestSync } from '../lib/progress'
import { useToast } from './Toast'
import { plural } from '../lib/i18n'

function useNav() {
  const { t } = useI18n()
  return [
    { to: '/parcours', label: t('Parcours', 'Path') },
    { to: '/problemes', label: t('Problèmes', 'Problems') },
    { to: '/defi', label: t('Défi du jour', 'Daily') },
    { to: '/classements', label: t('Classements', 'Leaderboards') },
    { to: '/groupes', label: t('Groupes', 'Groups') },
  ]
}

function LangSwitch() {
  const { lang, setLang, t } = useI18n()
  return (
    <Segmented<UiLang>
      size="sm"
      label={t('Langue du site', 'Site language')}
      value={lang}
      onChange={setLang}
      options={[
        { value: 'fr', label: 'FR' },
        { value: 'en', label: 'EN' },
      ]}
    />
  )
}

function ThemeButton() {
  const { t } = useI18n()
  const [theme, toggle] = useTheme()
  return (
    <IconButton label={theme === 'dark' ? t('Passer en thème clair', 'Switch to light theme') : t('Passer en thème sombre', 'Switch to dark theme')} onClick={toggle}>
      {theme === 'dark' ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </IconButton>
  )
}

function AccountMenu() {
  const { profile } = useAuth()
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])
  if (!profile) return null
  const item = 'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-ink hover:bg-surface-2'
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center rounded-full"
        aria-label={t('Mon compte', 'My account')}
      >
        <Avatar name={profile.display_name} size={32} />
      </button>
      {open && (
        <div role="menu" className="anim-rise absolute right-0 top-11 z-40 w-60 rounded-lg border border-line bg-surface p-1.5 shadow-e3">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-medium">{profile.display_name}</p>
            <p className="truncate text-xs text-muted">@{profile.username}</p>
          </div>
          <div className="my-1 h-px bg-line" />
          <Link role="menuitem" to={`/profil/${profile.username}`} className={item} onClick={() => setOpen(false)}>
            <User className="size-4 text-muted" /> {t('Mon profil', 'My profile')}
          </Link>
          <Link role="menuitem" to="/compte" className={item} onClick={() => setOpen(false)}>
            <Settings className="size-4 text-muted" /> {t('Paramètres', 'Settings')}
          </Link>
          <button
            role="menuitem"
            type="button"
            className={item}
            onClick={async () => {
              setOpen(false)
              await supabase.auth.signOut()
              navigate('/')
            }}
          >
            <LogOut className="size-4 text-muted" /> {t('Se déconnecter', 'Sign out')}
          </button>
        </div>
      )}
    </div>
  )
}

function Stats() {
  const { profile } = useAuth()
  const { lang, t } = useI18n()
  if (!profile) return null
  const streak = liveStreak(profile)
  return (
    <Link to={`/profil/${profile.username}`} className="hidden items-center gap-4 rounded-md px-2 py-1 text-sm hover:bg-surface-2 sm:flex">
      <span className="tabular font-medium" title={t('Tes points', 'Your points')}>
        {formatPoints(lang, profile.xp)}
      </span>
      <span className="flex items-center gap-1.5 tabular" title={t('Ta série de jours', 'Your day streak')}>
        <Flame className={cx('size-4', streak > 0 ? 'text-warn' : 'text-muted')} aria-hidden />
        <span className="font-medium">{streak}</span>
        <span className="sr-only">{t('jours de suite', 'days in a row')}</span>
      </span>
    </Link>
  )
}

function TopBar() {
  const nav = useNav()
  const { session, ready } = useAuth()
  const { t } = useI18n()
  const [menu, setMenu] = useState(false)
  const location = useLocation()
  useEffect(() => setMenu(false), [location.pathname])

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-8 px-4 sm:px-6">
        <Link to="/" className="shrink-0 rounded-md" aria-label={t('Kodo, accueil', 'Kodo, home')}>
          <Logo />
        </Link>
        <nav aria-label={t('Navigation principale', 'Main navigation')} className="hidden h-full items-stretch gap-0.5 lg:flex">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cx(
                  'relative flex items-center px-2.5 text-sm font-medium transition-colors',
                  isActive ? 'text-ink after:absolute after:inset-x-2.5 after:-bottom-px after:h-0.5 after:rounded-full after:bg-accent' : 'text-muted hover:text-ink',
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Stats />
          <div className="hidden items-center gap-1 md:flex">
            <LangSwitch />
            <ThemeButton />
          </div>
          {ready && !session && (
            <div className="hidden items-center gap-2 sm:flex">
              <LinkButton to="/connexion" variant="ghost" size="sm">
                {t('Se connecter', 'Sign in')}
              </LinkButton>
              <LinkButton to="/inscription" size="sm">
                {t('Créer un compte', 'Sign up')}
              </LinkButton>
            </div>
          )}
          {session && <AccountMenu />}
          <IconButton label={menu ? t('Fermer le menu', 'Close menu') : t('Ouvrir le menu', 'Open menu')} onClick={() => setMenu((m) => !m)} className="lg:hidden" aria-expanded={menu}>
            {menu ? <X className="size-5" /> : <Menu className="size-5" />}
          </IconButton>
        </div>
      </div>
      {menu && (
        <div className="border-t border-line bg-surface lg:hidden">
          <nav className="mx-auto flex max-w-[1200px] flex-col px-4 py-2 sm:px-6" aria-label={t('Navigation principale', 'Main navigation')}>
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => cx('rounded-md px-3 py-3 text-base font-medium', isActive ? 'bg-surface-2 text-ink' : 'text-ink-2')}>
                {n.label}
              </NavLink>
            ))}
            <div className="mt-2 flex items-center justify-between border-t border-line px-1 pt-3 pb-1">
              <LangSwitch />
              <ThemeButton />
            </div>
            {ready && !session && (
              <div className="grid grid-cols-2 gap-2 py-3">
                <LinkButton to="/connexion" variant="secondary">
                  {t('Se connecter', 'Sign in')}
                </LinkButton>
                <LinkButton to="/inscription">{t('Créer un compte', 'Sign up')}</LinkButton>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

function Footer() {
  const { t } = useI18n()
  const links = [
    { to: '/parcours', label: t('Parcours', 'Path') },
    { to: '/problemes', label: t('Problèmes', 'Problems') },
    { to: '/defi', label: t('Défi du jour', 'Daily challenge') },
    { to: '/classements', label: t('Classements', 'Leaderboards') },
    { to: '/groupes', label: t('Groupes', 'Groups') },
    { to: '/a-propos', label: t('Règles et limites du juge', 'Rules and judge limits') },
  ]
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-10 text-sm sm:px-6 md:grid-cols-[1fr_auto]">
        <div className="max-w-md">
          <Logo />
          <p className="mt-3 text-muted">
            {t(
              'Ton code s’exécute dans ton navigateur : Python 3.14 avec Pyodide, C++17 avec Clang 22 compilé en WebAssembly.',
              'Your code runs in your browser: Python 3.14 with Pyodide, C++17 with Clang 22 compiled to WebAssembly.',
            )}
          </p>
        </div>
        <nav aria-label={t('Pied de page', 'Footer')} className="grid grid-cols-2 gap-x-10 gap-y-2 sm:grid-cols-3">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-ink-2 hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export function Shell() {
  const matches = useMatches()
  const bare = matches.some((m) => (m.handle as { bare?: boolean } | undefined)?.bare)
  const toast = useToast()
  const { lang } = useI18n()
  useGuestSync((n) =>
    toast(
      lang === 'en'
        ? `${plural(lang, n, ['problème', 'problèmes'], ['problem', 'problems'])} solved as a guest are now saved to your account.`
        : `${plural(lang, n, ['problème résolu', 'problèmes résolus'], ['', ''])} en invité ${n > 1 ? 'sont' : 'est'} maintenant enregistré${n > 1 ? 's' : ''} sur ton compte.`,
      'ok',
    ),
  )
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:shadow-e2">
        {lang === 'en' ? 'Skip to content' : 'Aller au contenu'}
      </a>
      <TopBar />
      <main id="contenu" className="flex-1">
        <Outlet />
      </main>
      {!bare && <Footer />}
      <ScrollRestoration />
    </div>
  )
}
