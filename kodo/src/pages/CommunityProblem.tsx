// Page d'un problème de la communauté : même double panneau que les problèmes officiels,
// plus les actions propres à la communauté (utile, signaler, modifier, retirer, modérer).
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { EyeOff, Flag, Pencil, ThumbsUp } from 'lucide-react'
import { Button, cx, LinkButton, Notice, Segmented, Skeleton, useDelayed } from '../components/ui'
import { useToast } from '../components/Toast'
import { StatementPanel, Workspace } from './Problem'
import { recordCommunitySolve, toProblemData, useCommunityCounts, useCommunityProblem, useIsModerator, useModerate, useReport, useSetStatus, useVote, type ReportReason } from '../lib/community'
import { useAuth } from '../lib/auth'
import { useI18n } from '../lib/i18n'
import { useCodeLang, type RecordInput } from '../lib/progress'
import { errorText } from '../lib/supabase'

function ReportForm({ id, onDone }: { id: string; onDone: () => void }) {
  const { t, lang } = useI18n()
  const [reason, setReason] = useState<ReportReason>('incorrect')
  const [details, setDetails] = useState('')
  const report = useReport(id)
  const toast = useToast()
  const first = useRef<HTMLInputElement>(null)
  useEffect(() => first.current?.focus(), [])
  const reasons: [ReportReason, string][] = [
    ['incorrect', t('Tests ou énoncé faux', 'Wrong tests or statement')],
    ['copie', t('Copié d’un autre site', 'Copied from another site')],
    ['inapproprie', t('Contenu inapproprié', 'Inappropriate content')],
    ['autre', t('Autre raison', 'Other reason')],
  ]
  return (
    <form
      className="absolute right-0 top-full z-20 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-line bg-surface p-4 shadow-lg"
      onKeyDown={(e) => e.key === 'Escape' && onDone()}
      onSubmit={(e) => {
        e.preventDefault()
        report.mutate(
          { reason, details },
          {
            onSuccess: () => {
              toast(t('Signalement envoyé. Trois signalements masquent le problème jusqu’à l’avis d’un modérateur.', 'Report sent. Three reports hide the problem until a moderator reviews it.'))
              onDone()
            },
          },
        )
      }}
    >
      <fieldset>
        <legend className="text-sm font-medium">{t('Pourquoi signaler ce problème ?', 'Why report this problem?')}</legend>
        <div className="mt-2 flex flex-col gap-1">
          {reasons.map(([v, label], i) => (
            <label key={v} className="flex min-h-8 items-center gap-2 text-sm text-ink-2">
              <input ref={i === 0 ? first : undefined} type="radio" name="raison" value={v} checked={reason === v} onChange={() => setReason(v)} className="size-4 accent-[var(--accent)]" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <label htmlFor="report-details" className="mt-3 block text-sm font-medium">
        {t('Précisions (facultatif)', 'Details (optional)')}
      </label>
      <textarea
        id="report-details"
        value={details}
        maxLength={500}
        rows={3}
        onChange={(e) => setDetails(e.target.value)}
        className="mt-1 block w-full resize-y rounded-md bg-surface px-3 py-2 text-sm shadow-[inset_0_0_0_1px_var(--field-line)] focus:shadow-[inset_0_0_0_1px_var(--accent)] focus:outline-none"
      />
      {report.isError && <p className="mt-2 text-sm text-bad">{errorText(report.error, lang)}</p>}
      <div className="mt-3 flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onDone}>
          {t('Annuler', 'Cancel')}
        </Button>
        <Button type="submit" size="sm" loading={report.isPending}>
          {t('Envoyer le signalement', 'Send report')}
        </Button>
      </div>
    </form>
  )
}

function Actions({ id, authorId, status }: { id: string; authorId: string; status: string }) {
  const { t, lang } = useI18n()
  const { session } = useAuth()
  const uid = session?.user.id
  const counts = useCommunityCounts(id)
  const vote = useVote(id)
  const setStatus = useSetStatus(id)
  const moderate = useModerate(id)
  const moderator = useIsModerator()
  const toast = useToast()
  const [reporting, setReporting] = useState(false)
  const mine = uid === authorId
  const c = counts.data
  const onError = (e: unknown) => toast(errorText(e, lang))
  const iconBtn = 'inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-sm text-ink-2 hover:bg-surface-2 hover:text-ink disabled:opacity-50'

  return (
    <div className="relative flex shrink-0 items-center gap-0.5">
      {mine ? (
        <span className={cx(iconBtn, 'hover:bg-transparent')} title={t('Votes « utile »', '“Useful” votes')}>
          <ThumbsUp className="size-4" aria-hidden />
          <span className="tabular">{c?.votes ?? '–'}</span>
          <span className="sr-only">{t('votes « utile »', '“useful” votes')}</span>
        </span>
      ) : (
        <button
          type="button"
          className={cx(iconBtn, c?.voted && 'text-accent hover:text-accent')}
          aria-pressed={!!c?.voted}
          disabled={!session || vote.isPending || !c}
          title={session ? t('Problème utile', 'Useful problem') : t('Connecte-toi pour voter', 'Sign in to vote')}
          onClick={() => vote.mutate(!c?.voted, { onError })}
        >
          <ThumbsUp className="size-4" aria-hidden />
          <span className="tabular">{c?.votes ?? '–'}</span>
          <span className="sr-only">{t('Utile', 'Useful')}</span>
        </button>
      )}
      {mine && (
        <>
          <Link to={`/communaute/${id}/modifier`} className={iconBtn}>
            <Pencil className="size-4" aria-hidden />
            <span className="hidden sm:inline">{t('Modifier', 'Edit')}</span>
          </Link>
          {status !== 'hidden' && (
            <button
              type="button"
              className={iconBtn}
              disabled={setStatus.isPending}
              onClick={() => setStatus.mutate(status === 'published' ? 'withdrawn' : 'published', { onError })}
            >
              <EyeOff className="size-4" aria-hidden />
              <span className="hidden sm:inline">{status === 'published' ? t('Retirer', 'Withdraw') : t('Republier', 'Republish')}</span>
            </button>
          )}
        </>
      )}
      {!mine && session && (
        <button type="button" className={iconBtn} disabled={!!c?.reported} aria-expanded={reporting} onClick={() => setReporting((v) => !v)} title={c?.reported ? t('Tu l’as déjà signalé', 'You already reported it') : undefined}>
          <Flag className="size-4" aria-hidden />
          <span className="hidden sm:inline">{c?.reported ? t('Signalé', 'Reported') : t('Signaler', 'Report')}</span>
        </button>
      )}
      {moderator.data && (
        <Button variant="secondary" size="sm" className="ml-1" loading={moderate.isPending} onClick={() => moderate.mutate(status !== 'hidden', { onError })}>
          {status === 'hidden' ? t('Rétablir', 'Restore') : t('Masquer', 'Hide')}
        </Button>
      )}
      {reporting && <ReportForm id={id} onDone={() => setReporting(false)} />}
    </div>
  )
}

export function CommunityProblem() {
  const { id = '' } = useParams()
  const { t, lang } = useI18n()
  const { session } = useAuth()
  const uid = session?.user.id
  const q = useCommunityProblem(id)
  const counts = useCommunityCounts(id)
  const qc = useQueryClient()
  const [codeLang] = useCodeLang()
  const [mobilePane, setMobilePane] = useState<'statement' | 'code'>('statement')
  const [solvedNow, setSolvedNow] = useState(false)
  const showSkeleton = useDelayed(q.isLoading)
  const data = q.data ? toProblemData(q.data) : null

  useEffect(() => {
    if (q.data) document.title = `${q.data.title} · Kodo`
  }, [q.data])
  useEffect(() => setSolvedNow(false), [id])

  const record = useCallback(
    async (r: RecordInput) => {
      if (uid && r.verdict === 'accepted') {
        await recordCommunitySolve(r.problemId, uid, r.lang)
        qc.invalidateQueries({ queryKey: ['community'] })
      }
      return null
    },
    [uid, qc],
  )

  if (q.isError)
    return (
      <div className="mx-auto max-w-[1200px] p-6">
        <Notice tone="error" action={<Button variant="secondary" size="sm" onClick={() => q.refetch()}>{t('Réessayer', 'Try again')}</Button>}>
          {errorText(q.error, lang)}
        </Notice>
      </div>
    )
  if (q.data === null)
    return (
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-4 px-4 py-20 sm:px-6">
        <h1 className="display text-2xl">{t('Ce problème n’est pas disponible', 'This problem is not available')}</h1>
        <p className="max-w-[60ch] text-ink-2">
          {t('Son auteur l’a retiré ou supprimé, ou la modération l’a masqué.', 'Its author withdrew or deleted it, or moderators hid it.')}
        </p>
        <LinkButton to="/communaute">{t('Voir les problèmes de la communauté', 'See community problems')}</LinkButton>
      </div>
    )
  if (!data)
    return showSkeleton ? (
      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-full min-h-60" />
      </div>
    ) : null

  const meta = data.community!
  const solved = solvedNow || !!counts.data?.solved

  return (
    <div className="flex h-[calc(100dvh-57px)] flex-col">
      {meta.status !== 'published' && (
        <div className={cx('border-b px-4 py-2 text-sm sm:px-6', meta.status === 'hidden' ? 'border-bad/30 bg-bad-soft' : 'border-line bg-surface-2')}>
          {meta.status === 'hidden'
            ? t('Masqué par la modération après des signalements : seuls toi et les modérateurs le voient.', 'Hidden by moderators after reports: only you and the moderators can see it.')
            : t('Retiré : seul toi le vois. Republie-le pour qu’il réapparaisse dans la liste.', 'Withdrawn: only you can see it. Republish it to bring it back to the list.')}
        </div>
      )}
      <div className="flex items-center justify-between gap-2 border-b border-line bg-surface px-3 py-1.5 lg:hidden">
        <Segmented
          size="sm"
          label={t('Affichage', 'View')}
          value={mobilePane}
          onChange={setMobilePane}
          options={[
            { value: 'statement', label: t('Énoncé', 'Statement') },
            { value: 'code', label: t('Code', 'Code') },
          ]}
        />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,44fr)_minmax(0,56fr)]">
        <div className={cx('min-h-0 border-line bg-bg lg:block lg:border-r', mobilePane === 'statement' ? 'block' : 'hidden')}>
          <StatementPanel
            key={id}
            data={data}
            solved={solved}
            codeLang={codeLang}
            initialTab="statement"
            index={-1}
            solversOverride={counts.data?.solves}
            aside={<Actions id={id} authorId={meta.authorId} status={meta.status} />}
          />
        </div>
        <div className={cx('min-h-0 bg-surface lg:block', mobilePane === 'code' ? 'block' : 'hidden')}>
          <Workspace data={data} record={record} onSolved={(pid) => pid === id && setSolvedNow(true)} onShowSolution={() => {}} />
        </div>
      </div>
    </div>
  )
}
