import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Download, Layers, Menu, ShieldCheck, Smartphone, UserCog, X } from 'lucide-react'
import { Logo } from '../../components/Logo'
import { HeroStage } from '../../components/HeroStage'
import { InstallGuide } from '../../components/InstallGuide'
import { Button, ButtonLink, Segmented } from '../../components/ui'
import { useAction } from '../../components/feedback'
import { loginDemo } from '../../data/api'
import { DEMO_ADMIN_ID } from '../../data/seed'
import { useSession } from '../../data/store'
import { BASE_PRICE, euros, INCLUDED_PROMO, PROMO_MONTHS, quote } from '../../lib/pricing'
import { cn } from '../../lib/util'
import { CountUp, Reveal, RisingWords, useInView } from '../../lib/motion'
import type { CSSProperties } from 'react'

export default function Landing() {
  const [install, setInstall] = useState(false)
  const navigate = useNavigate()
  const run = useAction()
  const session = useSession()
  // Connecté avec un vrai compte : on ouvre son espace au lieu de remplacer la session par la démo.
  const ownSpace = session && !session.demo ? (session.clubId ? '/app' : '/clubs') : null
  const startDemo = () => run(async () => {
    await loginDemo(DEMO_ADMIN_ID)
    navigate('/app')
  })

  return (
    <div className="min-h-dvh">
      <SiteHeader onInstall={() => setInstall(true)} overDark />

      <main>
        {/* ------------------------------------------------ Hero : eau profonde */}
        <div className="deep -mt-16 pt-16">
        <section className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-14 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-10 lg:pb-28 lg:pt-20">
          <div>
            <h1 className="display text-[54px] text-ink sm:text-[78px] lg:text-[86px]">
              <RisingWords text="Chaque ligne d'eau a son éducateur." delay={150} />
            </h1>
            <p className="hero-in mt-7 max-w-[52ch] text-[18px] leading-relaxed text-ink-2 sm:text-[19px]" style={{ animationDelay: '520ms' }}>
              SwimHub Connect centralise les plannings de votre club de natation, propose chaque absence aux collègues
              diplômés et disponibles, et prépare le relevé d'heures du mois pour la paie.
            </p>
            <div className="hero-in mt-9 flex flex-wrap items-center gap-x-7 gap-y-4" style={{ animationDelay: '640ms' }}>
              <ButtonLink to="/inscription" size="lg">Créer mon club</ButtonLink>
              {ownSpace
                ? <ButtonLink to={ownSpace} size="lg" variant="secondary">Ouvrir mon espace</ButtonLink>
                : <Button size="lg" variant="secondary" onClick={startDemo}>Explorer la démo</Button>}
            </div>
            <ul className="hero-in mt-9 flex flex-col gap-2 border-t border-line pt-5 text-[15.5px] text-ink-2 sm:flex-row sm:gap-7" style={{ animationDelay: '760ms' }}>
              <li className="flex items-center gap-2"><Check aria-hidden className="size-4 text-water" strokeWidth={3} />{PROMO_MONTHS} mois avec {INCLUDED_PROMO} accès pour {euros(BASE_PRICE)} par mois</li>
              <li className="flex items-center gap-2"><Check aria-hidden className="size-4 text-water" strokeWidth={3} />Sans engagement</li>
            </ul>
          </div>
          <HeroStage />
        </section>
        </div>

        {/* ------------------------------------------------ Parcours d'une absence */}
        <section className="border-y border-line bg-surface" aria-labelledby="parcours">
          <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:py-24">
            <Reveal className="max-w-[640px]">
              <h2 id="parcours" className="display-md text-[34px] text-ink sm:text-[44px]">De l'absence au remplaçant, sans message de groupe.</h2>
              <p className="mt-4 text-[17px] text-ink-2">Fini les relances sur WhatsApp à 22 h. Le créneau ne s'affiche qu'aux personnes qui peuvent vraiment le prendre.</p>
            </Reveal>
            <StepsLane />
          </div>
        </section>

        {/* ------------------------------------------------ Fonctionnalités */}
        <section id="fonctionnalites" className="mx-auto max-w-[1200px] scroll-mt-20 px-4 py-20 sm:px-6 lg:py-28">
          <Reveal as="h2" className="display-md max-w-[720px] text-[34px] text-ink sm:text-[44px]">Pensé par et pour le monde de la natation.</Reveal>
          <div className="mt-16 space-y-24">
            <Feature
              title="Le planning de la semaine, bassin par bassin"
              text="Groupes, lignes d'eau, éducateurs titulaires : chacun voit qui encadre quoi, et où. Les créneaux sans remplaçant ressortent en rouge avant qu'il ne soit trop tard."
              points={['Vue semaine sur ordinateur, vue jour sur téléphone', 'Filtre par piscine et par éducateur', 'Import de votre planning Excel en copier-coller']}
              visual={<WeekMock />}
            />
            <Feature
              reverse
              title="Des diplômes à jour, vérifiés à chaque remplacement"
              text="Chaque groupe indique le diplôme requis. Un remplacement n'est proposé qu'aux titulaires d'un diplôme valide à la date de la séance, et les recyclages proches sont signalés."
              points={['Catalogue BNSSA, BPJEPS AAN, PSE1… extensible', "Dates de recyclage suivies pour toute l'équipe", "Détection des conflits d'horaires"]}
              visual={<DiplomaMock />}
            />
            <Feature
              title="Le relevé d'heures du mois, prêt pour la paie"
              text="Heures prévues, absences et remplacements effectués : le décompte se calcule tout seul, éducateur par éducateur, et s'exporte pour Excel."
              points={['Export CSV compatible Excel', 'Heures effectives = prévues − absences + remplacements', 'Accès délégable au secrétariat ou à la trésorerie']}
              visual={<HoursMock />}
            />
          </div>

          <ul className="mt-24 grid gap-x-8 gap-y-8 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {EXTRAS.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 90}>
                <Icon aria-hidden className="size-5 text-water" />
                <h3 className="mt-3 font-bold text-ink">{title}</h3>
                <p className="mt-1 text-[15px] text-ink-2">{text}</p>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* ------------------------------------------------ Tarifs */}
        <section id="tarifs" className="scroll-mt-20 border-y border-line bg-surface-2/50">
          <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:py-28">
            <Reveal className="max-w-[640px]">
              <h2 className="display-md text-[34px] text-ink sm:text-[44px]">Un prix qui suit la taille de votre équipe.</h2>
              <p className="mt-4 text-[17px] text-ink-2">Un seul forfait, payé par le club. Les éducateurs créent leur compte gratuitement.</p>
            </Reveal>
            <PricingCalculator />
          </div>
        </section>

        {/* ------------------------------------------------ FAQ */}
        <section id="faq" className="mx-auto max-w-[860px] scroll-mt-20 px-4 py-20 sm:px-6 lg:py-28">
          <Reveal as="h2" className="display-md text-[34px] text-ink sm:text-[44px]">Questions fréquentes</Reveal>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {FAQ.map((f) => (
              <details key={f.q} className="faq group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md py-4 text-[17px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="relative size-4 shrink-0 transition-transform duration-300 ease-[var(--ease-out)] group-open:rotate-180 before:absolute before:inset-x-0 before:top-1/2 before:h-0.5 before:-translate-y-1/2 before:bg-ink-2 after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 after:-translate-x-1/2 after:bg-ink-2 after:transition-transform after:duration-300 group-open:after:scale-y-0" />
                </summary>
                <p className="max-w-[68ch] pb-5 text-[15px] leading-relaxed text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------ Appel final */}
        <section className="deep">
          <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-8 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-24">
            <div>
              <h2 className="display-md text-[34px] text-ink sm:text-[46px]">Testez avec votre vrai planning cette semaine.</h2>
              <p className="mt-3 text-[18px] text-ink-2">Six mois avec cinq accès inclus pour {euros(BASE_PRICE)} par mois, sans engagement.</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
              <ButtonLink to="/inscription" size="lg">Créer mon club</ButtonLink>
              {ownSpace
                ? <ButtonLink to={ownSpace} size="lg" variant="secondary">Ouvrir mon espace</ButtonLink>
                : <Button size="lg" variant="secondary" onClick={startDemo}>Explorer la démo</Button>}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter onInstall={() => setInstall(true)} />
      <InstallGuide open={install} onClose={() => setInstall(false)} />
    </div>
  )
}

// ---------------------------------------------------------------- en-tête / pied

export function SiteHeader({ onInstall, overDark }: { onInstall?: () => void; overDark?: boolean }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const links = [
    { href: '/#fonctionnalites', label: 'Fonctionnalités' },
    { href: '/#tarifs', label: 'Tarifs' },
    { href: '/#faq', label: 'Questions' },
  ]
  return (
    <header className={cn(
      'sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300',
      overDark && !scrolled && !open ? 'on-deep border-transparent bg-transparent' : 'border-line bg-bg/95 shadow-e1 backdrop-blur-sm supports-[backdrop-filter]:bg-bg/85',
    )}>
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <Logo animate />
        <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} to={l.href} className="rounded-[3px] px-3 py-2 text-[16px] font-medium text-ink-2 transition-colors hover:text-ink">{l.label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          {onInstall && <Button variant="ghost" icon={Download} onClick={onInstall}>Installer</Button>}
          <ButtonLink to="/connexion" variant="secondary">Se connecter</ButtonLink>
          <ButtonLink to="/inscription">Créer mon club</ButtonLink>
        </div>
        <button type="button" className="inline-flex size-10 items-center justify-center rounded-md text-ink md:hidden" aria-expanded={open} aria-controls="menu-mobile" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} onClick={() => setOpen((o) => !o)}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <div id="menu-mobile" className="border-t border-line bg-bg px-4 pb-5 pt-2 md:hidden">
          <nav aria-label="Navigation mobile" className="flex flex-col">
            {links.map((l) => (
              <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className="border-b border-line py-3.5 text-[17px] font-medium text-ink">{l.label}</Link>
            ))}
            {onInstall && <button type="button" onClick={() => { setOpen(false); onInstall() }} className="border-b border-line py-3.5 text-left text-[17px] font-medium text-ink">Installer l'application</button>}
          </nav>
          <div className="mt-5 flex items-center gap-6">
            <ButtonLink to="/inscription">Créer mon club</ButtonLink>
            <ButtonLink to="/connexion" variant="secondary">Se connecter</ButtonLink>
          </div>
        </div>
      )}
    </header>
  )
}

export function SiteFooter({ onInstall }: { onInstall?: () => void }) {
  return (
    <footer className="bg-bg">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1fr_auto]">
        <div>
          <Logo />
          <p className="mt-3 max-w-[40ch] text-sm text-muted">Plannings, absences et remplacements pour les clubs de natation.</p>
        </div>
        <nav aria-label="Liens du pied de page" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-2">
          <Link to="/cgv" className="hover:text-ink">Conditions générales (CGV / CGU)</Link>
          <Link to="/confidentialite" className="hover:text-ink">Confidentialité (RGPD)</Link>
          {onInstall && <button type="button" onClick={onInstall} className="hover:text-ink">Installer l'application</button>}
          <Link to="/connexion" className="hover:text-ink">Se connecter</Link>
        </nav>
      </div>
      <div className="mx-auto max-w-[1200px] border-t border-line px-4 py-6 text-[13px] text-muted sm:px-6">© {new Date().getFullYear()} SwimHub Connect. Tous droits réservés.</div>
    </footer>
  )
}

// ---------------------------------------------------------------- contenus

const STEPS = [
  { title: "L'éducateur déclare son absence", text: 'Depuis son téléphone, il choisit la séance concernée. Le motif reste visible des seuls responsables.' },
  { title: 'Les bons collègues sont prévenus', text: "Le créneau n'est proposé qu'aux éducateurs qui ont le diplôme requis, à jour, et qui sont libres à cette heure-là." },
  { title: 'Un volontaire se positionne', text: 'Un clic suffit. Si plusieurs collègues se proposent, leurs candidatures s’affichent côte à côte.' },
  { title: 'Le responsable valide', text: 'Le planning se met à jour pour tout le monde et les heures sont attribuées au remplaçant.' },
]

const EXTRAS = [
  { icon: Layers, title: 'Plusieurs clubs, un compte', text: 'Un éducateur qui travaille pour deux clubs passe de l’un à l’autre en un clic.' },
  { icon: UserCog, title: 'Rôles sur mesure', text: 'Coordination bassin, secrétariat : déléguez sans donner tous les droits.' },
  { icon: Smartphone, title: "S'installe comme une app", text: 'Sur iPhone, Android ou ordinateur, sans passer par une boutique.' },
  { icon: ShieldCheck, title: 'Données en Union européenne', text: 'Hébergement européen, mots de passe chiffrés, conforme au RGPD.' },
]

const FAQ = [
  { q: "Qu'est-ce qu'un accès ?", a: 'Un compte actif rattaché à votre club, responsable ou éducateur. Les demandes d’adhésion en attente ne sont pas comptées.' },
  { q: 'Les éducateurs doivent-ils payer ?', a: "Non. Le club règle l'abonnement ; les éducateurs créent leur compte gratuitement et demandent à rejoindre le club." },
  { q: 'Un éducateur peut-il travailler pour plusieurs clubs ?', a: 'Oui, avec un seul compte. Les plannings et les données de chaque club restent strictement séparés.' },
  { q: 'Faut-il installer une application ?', a: "Non, SwimHub fonctionne dans le navigateur. Vous pouvez aussi l'ajouter à l'écran d'accueil de votre téléphone pour l'ouvrir comme une application." },
  { q: 'Comment reprendre notre planning actuel ?', a: "Copiez vos lignes depuis Excel ou Google Sheets et collez-les dans l'import. Les piscines, groupes et niveaux manquants sont créés automatiquement." },
  { q: 'Comment résilier ?', a: "Depuis la page Abonnement, à tout moment. La résiliation prend effet à la fin de la période de facturation en cours." },
]

// ---------------------------------------------------------------- blocs illustrés

function StepsLane() {
  const [ref, inView] = useInView<HTMLOListElement>({ threshold: 0.3 })
  return (
    <ol ref={ref} data-shown={inView || undefined} className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
      {/* Ligne continue qui se remplit d'une étape à l'autre */}
      <div aria-hidden className="absolute left-0 right-0 top-[21px] hidden h-[2px] bg-line md:block">
        <div className="steps-fill h-full bg-btn" />
      </div>
      {STEPS.map((s, i) => (
        <li key={s.title} className="relative flex gap-4 md:block">
          <span className="step-num relative z-10 flex size-11 shrink-0 items-center justify-center rounded-[3px] bg-surface text-[19px] font-bold text-ink shadow-[inset_0_0_0_2px_var(--line-strong)] num" style={{ '--i': i } as CSSProperties}>
            {i + 1}
          </span>
          <div className="reveal md:mt-5" data-shown={inView || undefined} style={{ '--reveal-delay': `${300 + i * 700}ms` } as CSSProperties}>
            <h3 className="text-[19px] font-semibold text-ink">{s.title}</h3>
            <p className="mt-1.5 text-[16px] leading-relaxed text-ink-2">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

function Feature({ title, text, points, visual, reverse }: { title: string; text: string; points: string[]; visual: React.ReactNode; reverse?: boolean }) {
  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <Reveal className={cn(reverse && 'lg:order-2')}>
        <h3 className="display-md text-[28px] text-ink sm:text-[32px]">{title}</h3>
        <p className="mt-4 max-w-[52ch] text-[17px] leading-relaxed text-ink-2">{text}</p>
        <ul className="mt-6 space-y-2.5">
          {points.map((p) => (
            <li key={p} className="flex gap-2.5 text-[15px] text-ink">
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-water" strokeWidth={3} />
              {p}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal aria-hidden delay={120} className={cn('mock lg:[perspective:1400px]', reverse && 'lg:order-1')}>
        <div className={cn('elev-3 rounded-xl border border-line/70 bg-surface p-4 sm:p-6', reverse ? 'lg:[transform:rotateY(5deg)_rotateX(2deg)]' : 'lg:[transform:rotateY(-5deg)_rotateX(2deg)]')}>{visual}</div>
      </Reveal>
    </div>
  )
}

function WeekMock() {
  const cols = [
    [{ t: '17h', g: 'École 1', c: '#0e9c8e' }, { t: '18h', g: 'Jeunes', c: '#e07a1f' }, { t: '19h30', g: 'Juniors', c: '#e07a1f' }],
    [{ t: '17h30', g: 'Avenirs', c: '#e07a1f' }, { t: '18h30', g: 'Aquagym', c: '#6f8f1e' }, { t: '19h30', g: 'Adultes', c: '#2f6fdb' }],
    [{ t: '14h', g: 'École 1', c: '#0e9c8e' }, { t: '17h', g: 'Jeunes', c: '#e07a1f', abs: true }, { t: '18h30', g: 'Juniors', c: '#e07a1f' }],
    [{ t: '17h30', g: 'Avenirs', c: '#e07a1f' }, { t: '19h', g: 'Masters', c: '#d2478e', rep: true }],
    [{ t: '17h', g: 'École 1', c: '#0e9c8e' }, { t: '18h', g: 'Jeunes', c: '#e07a1f' }],
  ]
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-bold text-ink">Semaine du 9 novembre</span>
        <span className="rounded-[3px] bg-surface-2 px-2.5 py-1 text-[12px] font-semibold text-ink-2">Toutes les piscines</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'].map((d, i) => (
          <div key={d}>
            <p className="mb-1.5 text-center text-[12px] font-semibold text-muted">{d}</p>
            <div className="space-y-1.5">
              {cols[i].map((s, j) => (
                <div key={s.t + s.g} className={cn('mock-cell rounded-md border-l-[3px] bg-surface-2 px-1.5 py-1.5 sm:px-2', 'abs' in s && s.abs && 'bg-rope-soft', 'rep' in s && s.rep && 'bg-kelp-soft')} style={{ borderColor: s.c, '--i': i * 3 + j } as CSSProperties}>
                  <p className="text-[11px] font-semibold text-muted num sm:text-[12px]">{s.t}</p>
                  <p className="truncate text-[11.5px] font-bold text-ink sm:text-[13px]">{s.g}</p>
                  {'abs' in s && s.abs && <p className="text-[10.5px] font-semibold text-rope sm:text-[11.5px]">À remplacer</p>}
                  {'rep' in s && s.rep && <p className="text-[10.5px] font-semibold text-kelp sm:text-[11.5px]">Remplacé</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DiplomaMock() {
  const rows = [
    { name: 'Inès Moreau', d: 'BNSSA', s: 'Recyclage dans 19 jours', tone: 'buoy' },
    { name: 'Théo Laurent', d: 'PSE1', s: 'Expiré depuis 12 jours', tone: 'rope' },
    { name: 'Léa Bernard', d: 'BPJEPS AAN', s: 'Valide jusqu’en 2030', tone: 'kelp' },
    { name: 'Chloé Fournier', d: 'BNSSA', s: 'Valide jusqu’en 2030', tone: 'kelp' },
  ] as const
  const tone = { buoy: 'bg-buoy-soft text-buoy', rope: 'bg-rope-soft text-rope', kelp: 'bg-kelp-soft text-kelp' }
  return (
    <div>
      <p className="mb-3 text-sm font-bold text-ink">Diplômes de l'équipe</p>
      <ul className="divide-y divide-line">
        {rows.map((r, i) => (
          <li key={r.name + r.d} className="mock-cell flex items-center justify-between gap-3 py-2.5" style={{ '--i': i * 2 } as CSSProperties}>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-ink">{r.name}</p>
              <p className="text-[13px] text-muted">{r.d}</p>
            </div>
            <span className={cn('shrink-0 rounded-[3px] px-2.5 py-1 text-[12px] font-semibold', tone[r.tone])}>{r.s}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function HoursMock() {
  const rows = [
    ['Manon Girard', '42 h', '1 h 30', '—', '40 h 30'],
    ['Léa Bernard', '27 h', '1 h', '2 h 15', '28 h 15'],
    ['Théo Laurent', '17 h', '1 h', '—', '16 h'],
    ['Inès Moreau', '13 h', '45 min', '—', '12 h 15'],
  ]
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-ink">Novembre 2026</p>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-line-strong px-2.5 py-1 text-[12px] font-semibold text-ink"><Download className="size-3.5" />Exporter</span>
      </div>
      <div className="overflow-hidden">
        <table className="w-full text-[12.5px] sm:text-[13.5px]">
          <thead>
            <tr className="text-left text-muted">
              <th className="py-1.5 font-semibold">Éducateur</th>
              <th className="py-1.5 text-right font-semibold">Prévues</th>
              <th className="hidden py-1.5 text-right font-semibold sm:table-cell">Absences</th>
              <th className="hidden py-1.5 text-right font-semibold sm:table-cell">Rempl.</th>
              <th className="py-1.5 text-right font-semibold">Effectives</th>
            </tr>
          </thead>
          <tbody className="num">
            {rows.map((r, i) => (
              <tr key={r[0]} className="mock-cell border-t border-line" style={{ '--i': i * 2 } as CSSProperties}>
                <td className="py-2 font-semibold text-ink">{r[0]}</td>
                <td className="py-2 text-right text-ink-2">{r[1]}</td>
                <td className="hidden py-2 text-right text-ink-2 sm:table-cell">{r[2]}</td>
                <td className="hidden py-2 text-right text-ink-2 sm:table-cell">{r[3]}</td>
                <td className="py-2 text-right font-bold text-ink">{r[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- calculateur

export function PricingCalculator({ compact }: { compact?: boolean }) {
  const [access, setAccess] = useState(12)
  const [period, setPeriod] = useState<'promo' | 'normal'>('promo')
  const q = quote(access, period === 'promo')
  return (
    <div className={cn('grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12', !compact && 'mt-12')}>
      <div className="elev-2 rounded-xl border border-line/70 bg-surface p-5 sm:p-7">
        <label htmlFor="acces" className="flex items-baseline justify-between gap-4">
          <span className="font-semibold text-ink">Nombre d'accès</span>
          <span className="display-md text-[34px] text-ink num">{access}</span>
        </label>
        <input
          id="acces"
          type="range"
          min={1}
          max={40}
          value={access}
          onChange={(e) => setAccess(Number(e.target.value))}
          className="range mt-3 w-full"
          style={{ '--fill': `${((access - 1) / 39) * 100}%` } as CSSProperties}
          aria-describedby="acces-aide"
        />
        <p id="acces-aide" className="mt-2 text-[13px] text-muted">1 accès = 1 compte actif (responsable ou éducateur).</p>
        <div className="mt-6">
          <Segmented
            label="Période"
            value={period}
            onChange={setPeriod}
            options={[{ value: 'promo', label: 'Les 6 premiers mois' }, { value: 'normal', label: 'Ensuite' }]}
          />
        </div>
        <dl className="mt-6 space-y-2 border-t border-line pt-4 text-[15px]">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-2">Pack Starter, {q.included} accès inclus</dt>
            <dd className="font-semibold text-ink num">{euros(BASE_PRICE)}</dd>
          </div>
          {q.lines.map((l) => (
            <div key={l.label} className="flex justify-between gap-4">
              <dt className="text-ink-2">{l.label} : {l.count} × {euros(l.unit)}</dt>
              <dd className="font-semibold text-ink num">{euros(l.subtotal)}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-col justify-between">
        <div>
          <p className="text-[15px] font-semibold text-ink-2">Votre club paiera</p>
          <p className="mt-1 flex items-baseline gap-2">
            <CountUp value={q.total} format={euros} duration={420} className="display text-[64px] text-ink sm:text-[80px]" />
            <span className="text-[17px] text-muted">par mois TTC</span>
          </p>
          <ul className="mt-6 space-y-2.5">
            {['Planning, absences et remplacements illimités', 'Diplômes, rôles et relevé d’heures', 'Support par tickets intégré', 'Sans engagement, résiliable en ligne'].map((p) => (
              <li key={p} className="flex gap-2.5 text-[15px] text-ink">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-water" strokeWidth={3} />
                {p}
              </li>
            ))}
          </ul>
        </div>
        {!compact && (
          <div className="mt-8">
            <ButtonLink to="/inscription" size="lg">Créer mon club</ButtonLink>
            <p className="mt-3 text-[13px] text-muted">Détail des paliers dans les <Link to="/cgv" className="underline underline-offset-2 hover:text-ink">conditions générales</Link>.</p>
          </div>
        )}
      </div>
    </div>
  )
}

