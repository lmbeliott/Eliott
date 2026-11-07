// Liste des problèmes proposés par la communauté (DESIGN.md §8, motif « liste »).
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Check, Circle, Plus } from 'lucide-react'
import { Button, cx, DifficultyMark, LinkButton, Notice, PageHeader, Segmented, Skeleton, useDelayed, SectionCell } from '../components/ui'
import { DIFFICULTIES, DIFFICULTY_LABEL, type Difficulty } from '../lib/content'
import { useCommunityList, useIsModerator, useMyCommunitySolves, type CommunityListItem, type CommunityStatus } from '../lib/community'
import { useAuth } from '../lib/auth'
import { formatDate, formatNumber, useI18n } from '../lib/i18n'
import { errorText } from '../lib/supabase'

type Sort = 'recents' | 'utiles' | 'reussis'

export function StatusLabel({ status }: { status: CommunityStatus }) {
  const { t } = useI18n()
  if (status === 'published') return <span className="text-ink-2">{t('Publié', 'Published')}</span>
  if (status === 'withdrawn') return <span className="text-muted">{t('Retiré', 'Withdrawn')}</span>
  return <span className="text-bad">{t('Masqué par la modération', 'Hidden by moderators')}</span>
}

function Rows({ items, solved, show }: { items: CommunityListItem[]; solved?: Set<string>; show: 'public' | 'mine' | 'moderation' }) {
  const { lang, t } = useI18n()
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <table className="w-full text-sm">
        <thead className="border-b border-line bg-surface-2 text-left text-xs text-muted">
          <tr>
            {show === 'public' && (
              <th scope="col" className="w-12 py-2.5 pl-4 font-medium">
                <span className="sr-only">{t('Statut', 'Status')}</span>
              </th>
            )}
            <th scope="col" className={cx('py-2.5 font-medium', show !== 'public' && 'pl-4')}>
              {t('Problème', 'Problem')}
            </th>
            {show !== 'mine' && <th scope="col" className="hidden py-2.5 pr-3 font-medium md:table-cell">{t('Auteur', 'Author')}</th>}
            {show !== 'public' && <th scope="col" className="py-2.5 pr-3 font-medium">{t('État', 'State')}</th>}
            {show === 'moderation' && <th scope="col" className="py-2.5 pr-3 text-right font-medium">{t('Signalements', 'Reports')}</th>}
            <th scope="col" className="hidden py-2.5 pr-3 text-right font-medium sm:table-cell">{t('Réussi par', 'Solved by')}</th>
            <th scope="col" className="hidden py-2.5 pr-3 text-right font-medium sm:table-cell">{t('Utile', 'Useful')}</th>
            <th scope="col" className="hidden py-2.5 pr-4 text-right font-medium lg:table-cell">{t('Proposé le', 'Proposed on')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => {
            const done = solved?.has(p.id)
            return (
              <tr key={p.id} className="border-b border-line last:border-0 hover:bg-surface-2/60">
                {show === 'public' && (
                  <td className="py-3 pl-4">
                    {done ? <Check className="size-4 text-ok" aria-label={t('Réussi', 'Solved')} /> : <Circle className="size-4 text-line-strong" aria-label={t('À faire', 'To do')} />}
                  </td>
                )}
                <td className={cx('py-3 pr-3', show !== 'public' && 'pl-4')}>
                  <Link to={`/communaute/${p.id}`} className="font-medium text-ink hover:underline">
                    {p.title}
                  </Link>
                  <span className="mt-0.5 block">
                    <DifficultyMark difficulty={p.difficulty} className="text-xs" />
                  </span>
                </td>
                {show !== 'mine' && (
                  <td className="hidden py-3 pr-3 text-ink-2 md:table-cell">
                    <Link to={`/profil/${p.author_username}`} className="hover:text-ink hover:underline">
                      {p.author_name}
                    </Link>
                  </td>
                )}
                {show !== 'public' && (
                  <td className="py-3 pr-3">
                    <StatusLabel status={p.status} />
                  </td>
                )}
                {show === 'moderation' && <td className="py-3 pr-3 text-right tabular">{p.reports}</td>}
                <td className="hidden py-3 pr-3 text-right tabular text-ink-2 sm:table-cell">{formatNumber(lang, p.solves)}</td>
                <td className="hidden py-3 pr-3 text-right tabular text-ink-2 sm:table-cell">{formatNumber(lang, p.votes)}</td>
                <td className="hidden py-3 pr-4 text-right text-ink-2 lg:table-cell">{formatDate(lang, new Date(p.created_at), { day: 'numeric', month: 'short', year: 'numeric' })}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function Community() {
  const { lang, t } = useI18n()
  const { session } = useAuth()
  const uid = session?.user.id
  const [params, setParams] = useSearchParams()
  const sort = (params.get('tri') ?? 'recents') as Sort
  const level = (params.get('difficulte') ?? '') as Difficulty | ''
  const list = useCommunityList()
  const mySolves = useMyCommunitySolves()
  const moderator = useIsModerator()
  const showSkeleton = useDelayed(list.isLoading)

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const all = list.data ?? []
  const published = useMemo(() => {
    const rows = all.filter((p) => p.status === 'published' && (!level || p.difficulty === level))
    if (sort === 'utiles') rows.sort((a, b) => b.votes - a.votes || b.solves - a.solves)
    if (sort === 'reussis') rows.sort((a, b) => b.solves - a.solves || b.votes - a.votes)
    return rows
  }, [all, sort, level])
  const mine = all.filter((p) => p.author_id === uid)
  const toReview = moderator.data ? all.filter((p) => p.status === 'hidden' || (p.reports > 0 && p.status === 'published')) : []
  const proposeTo = session ? '/communaute/proposer' : `/connexion?retour=${encodeURIComponent('/communaute/proposer')}`

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
      <PageHeader
        title={t('Problèmes de la communauté', 'Community problems')}
        lead={t(
          'Écrits par des élèves et des encadrants. Sortie de chaque test calculée par la solution de l’auteur avant publication. Aucun point attribué.',
          'Written by students and teachers. Each test’s output is computed by the author’s solution before publication. No points awarded.',
        )}
        actions={
          <LinkButton to={proposeTo}>
            <Plus className="size-4" aria-hidden />
            {t('Proposer un problème', 'Propose a problem')}
          </LinkButton>
        }
      />

      {list.isError ? (
        <Notice
          tone="error"
          action={
            <Button variant="secondary" size="sm" onClick={() => list.refetch()}>
              {t('Réessayer', 'Try again')}
            </Button>
          }
        >
          {errorText(list.error, lang)}
        </Notice>
      ) : !list.data ? (
        showSkeleton ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10" />
            <Skeleton className="h-40" />
          </div>
        ) : null
      ) : (
        <div className="flex flex-col gap-12">
          {toReview.length > 0 && (
            <section aria-labelledby="a-examiner">
              <h2 id="a-examiner" className="mb-3 text-lg font-semibold">
          <SectionCell />
                {t('À examiner', 'To review')}
              </h2>
              <Rows items={toReview} show="moderation" />
            </section>
          )}

          {mine.length > 0 && (
            <section aria-labelledby="mes-problemes">
              <h2 id="mes-problemes" className="mb-3 text-lg font-semibold">
          <SectionCell />
                {t('Mes problèmes', 'My problems')}
              </h2>
              <Rows items={mine} show="mine" />
            </section>
          )}

          <section aria-labelledby="publies">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 id="publies" className="text-lg font-semibold">
          <SectionCell />
                {t(`Publiés`, `Published`)} <span className="font-normal text-muted">{formatNumber(lang, published.length)}</span>
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <Segmented<Difficulty | ''>
                  size="sm"
                  label={t('Difficulté', 'Difficulty')}
                  value={level}
                  onChange={(v) => set('difficulte', v || null)}
                  options={[{ value: '', label: t('Toutes', 'All') }, ...DIFFICULTIES.map((d) => ({ value: d, label: DIFFICULTY_LABEL[d][lang] }))]}
                />
                <Segmented<Sort>
                  size="sm"
                  label={t('Trier', 'Sort')}
                  value={sort}
                  onChange={(v) => set('tri', v === 'recents' ? null : v)}
                  options={[
                    { value: 'recents', label: t('Récents', 'Recent') },
                    { value: 'utiles', label: t('Utiles', 'Useful') },
                    { value: 'reussis', label: t('Réussis', 'Solved') },
                  ]}
                />
              </div>
            </div>
            {published.length > 0 ? (
              <Rows items={published} solved={mySolves.data} show="public" />
            ) : (
              <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-line-strong p-6">
                <p className="font-medium">
                  {level ? t('Aucun problème publié à cette difficulté.', 'No published problem at this difficulty.') : t('Aucun problème publié pour l’instant.', 'No published problem yet.')}
                </p>
                <p className="max-w-[60ch] text-sm text-ink-2">
                  {t(
                    'Requis pour proposer un problème : un énoncé, au moins un exemple, trois tests cachés et une solution de référence en Python ou en C++. Sorties attendues calculées dans le navigateur.',
                    'Required to propose a problem: a statement, at least one example, three hidden tests and a reference solution in Python or C++. Expected outputs computed in the browser.',
                  )}
                </p>
                <LinkButton to={proposeTo} variant="secondary" size="sm">
                  {t('Proposer un problème', 'Propose a problem')}
                </LinkButton>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
