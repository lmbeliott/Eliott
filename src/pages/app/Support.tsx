import { useState, type FormEvent } from 'react'
import { LifeBuoy } from 'lucide-react'
import { Badge, Button, EmptyState, Field, FormError, Input, PageHeader, Panel, Textarea } from '../../components/ui'
import { useToast } from '../../components/feedback'
import { useAppCtx } from '../../data/hooks'
import { useWholeDB } from '../../data/store'
import { createTicket } from '../../data/api'
import { fmtMedium } from '../../lib/dates'

export default function Support() {
  const ctx = useAppCtx()
  const db = useWholeDB()
  const toast = useToast()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const tickets = db.tickets.filter((t) => t.userId === ctx.user.id)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      createTicket(subject, message)
      setSubject(''); setMessage('')
      toast('Demande enregistrée.')
    } catch (err) { setError((err as Error).message) }
  }

  return (
    <>
      <PageHeader title="Support" description="Un problème, une idée d'amélioration ? Décrivez-le ici." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Panel title="Nouvelle demande">
          <form onSubmit={submit} className="space-y-5" noValidate>
            <FormError>{error}</FormError>
            <Field label="Sujet" htmlFor="t-subject"><Input id="t-subject" value={subject} onChange={(e) => { setSubject(e.target.value); setError(null) }} placeholder="Ex. Impossible d'accepter un éducateur" /></Field>
            <Field label="Message" htmlFor="t-message" hint="Indiquez la page concernée et ce que vous attendiez.">
              <Textarea id="t-message" rows={6} value={message} onChange={(e) => { setMessage(e.target.value); setError(null) }} />
            </Field>
            <Button type="submit">Envoyer la demande</Button>
            <p className="text-[13px] text-muted">Cette version fonctionne sans serveur : vos demandes restent dans ce navigateur et ne sont pas transmises à l'équipe SwimHub.</p>
          </form>
        </Panel>
        <Panel title="Mes demandes">
          {tickets.length === 0 ? <EmptyState compact icon={LifeBuoy} title="Aucune demande">Vos échanges avec le support apparaîtront ici.</EmptyState> : (
            <ul className="divide-y divide-line">
              {tickets.map((t) => (
                <li key={t.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-ink">{t.subject}</p>
                    {t.status === 'open' ? <Badge tone="buoy" dot>En cours</Badge> : <Badge tone="kelp">Résolue</Badge>}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-sm text-ink-2">{t.message}</p>
                  <p className="mt-1 text-[13px] text-muted">Envoyée le {fmtMedium(t.createdAt.slice(0, 10))}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  )
}
