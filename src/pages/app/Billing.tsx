import { useState, type FormEvent } from 'react'
import { ExternalLink } from 'lucide-react'
import { Button, Field, FormError, Input, PageHeader, Panel } from '../../components/ui'
import { useToast } from '../../components/feedback'
import { NoAccess } from './Config'
import { useAppCtx } from '../../data/hooks'
import { useWholeDB } from '../../data/store'
import { approvedMembers, setCapacity } from '../../data/api'
import { BASE_PRICE, euros, PROMO_MONTHS, quote } from '../../lib/pricing'
import { fmtLong } from '../../lib/dates'
import { PricingCalculator } from '../public/Landing'

export default function Billing() {
  const ctx = useAppCtx()
  const db = useWholeDB()
  const toast = useToast()
  const [cap, setCap] = useState(String(ctx.club.capacity))
  const [error, setError] = useState<string | null>(null)
  if (!ctx.isAdmin) return <NoAccess adminOnly what="l'abonnement du club" />

  const used = approvedMembers(db, ctx.club.id).length
  // Fin de l'offre : même quantième PROMO_MONTHS mois plus tard, ramené au dernier jour du mois
  // si besoin (31 août → 28 février, et non 3 mars).
  const start = new Date(ctx.club.subscribedAt)
  const promoEnd = new Date(start)
  promoEnd.setDate(1)
  promoEnd.setMonth(promoEnd.getMonth() + PROMO_MONTHS)
  promoEnd.setDate(Math.min(start.getDate(), new Date(promoEnd.getFullYear(), promoEnd.getMonth() + 1, 0).getDate()))
  const inPromo = promoEnd.getTime() > Date.now()
  const q = quote(used, inPromo)
  const pct = Math.min(100, Math.round((used / ctx.club.capacity) * 100))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      setCapacity(Number(cap))
      toast(`Limite fixée à ${cap} accès.`)
    } catch (err) { setError((err as Error).message) }
  }

  return (
    <>
      <PageHeader title="Abonnement" description="Le club est facturé chaque mois selon le nombre de membres actifs." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Panel title="Pack Starter" actions={<span className="text-sm text-muted">{inPromo ? 'Offre de lancement' : 'Tarif normal'}</span>}>
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="display text-5xl text-ink num">{euros(q.total)}</span>
            <span className="basis-full text-muted sm:basis-auto">par mois TTC, estimation pour {used} accès</span>
          </p>
          <p className="mt-2 text-base text-ink-2">
            {inPromo
              ? <>Jusqu'au {fmtLong(promoEnd)}, le socle de {euros(BASE_PRICE)} inclut {q.included} accès.</>
              : <>Le socle de {euros(BASE_PRICE)} inclut {q.included} accès ; les suivants sont facturés par palier.</>}
          </p>
          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-base">
            <div className="flex justify-between gap-4"><dt className="text-ink-2">Socle, {q.included} accès inclus</dt><dd className="font-semibold text-ink num">{euros(BASE_PRICE)}</dd></div>
            {q.lines.map((l) => <div key={l.label} className="flex justify-between gap-4"><dt className="text-ink-2">{l.label} : {l.count} × {euros(l.unit)}</dt><dd className="font-semibold text-ink num">{euros(l.subtotal)}</dd></div>)}
          </dl>
          <div className="mt-6 border-t border-line pt-5">
            <p className="font-semibold text-ink">Factures et moyen de paiement</p>
            <p className="mt-1 text-sm text-ink-2">Téléchargez vos factures, changez de carte bancaire ou résiliez depuis l'espace sécurisé Stripe.</p>
            <Button className="mt-3" variant="secondary" icon={ExternalLink} onClick={() => toast(ctx.demo ? "Le portail Stripe n'est pas disponible en mode démo." : 'Le portail Stripe sera disponible une fois le paiement branché sur le serveur.', 'info')}>Ouvrir le portail Stripe</Button>
          </div>
        </Panel>

        <Panel title="Capacité du club" description="Nombre maximal de membres actifs. Au-delà, les nouvelles adhésions sont bloquées.">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-semibold text-ink-2">Accès utilisés</p>
            <p className="font-bold text-ink num">{used} / {ctx.club.capacity}</p>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-[2px] bg-surface-2" role="progressbar" aria-valuenow={used} aria-valuemin={0} aria-valuemax={ctx.club.capacity} aria-label="Accès utilisés">
            <div className={pct >= 100 ? 'h-full bg-rope-bright' : pct >= 85 ? 'h-full bg-buoy-bright' : 'h-full bg-water-bright'} style={{ width: `${pct}%` }} />
          </div>
          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            <FormError>{error}</FormError>
            <Field label="Nouvelle limite d'accès" htmlFor="cap" hint={`Au moins ${used}, le nombre de membres actifs.`}>
              <Input id="cap" type="number" inputMode="numeric" min={used} value={cap} onChange={(e) => { setCap(e.target.value); setError(null) }} className="w-32" />
            </Field>
            <Button type="submit">Enregistrer la limite</Button>
          </form>
        </Panel>
      </div>

      <Panel title="Simuler un autre effectif" className="mt-6">
        <PricingCalculator compact />
      </Panel>
    </>
  )
}
