import { Link, useSearchParams } from 'react-router-dom'
import { LeaderboardTable } from '../components/LeaderboardTable'
import { LinkButton, PageHeader, Segmented, Select } from '../components/ui'
import { useI18n } from '../lib/i18n'
import { useLeaderboard, useMyGroups, type Period } from '../lib/queries'
import { useAuth } from '../lib/auth'

export function Leaderboards() {
  const { t } = useI18n()
  const { session } = useAuth()
  const [params, setParams] = useSearchParams()
  const period = (params.get('periode') === 'semaine' ? 'week' : 'all') as Period
  const group = params.get('groupe')
  const groups = useMyGroups()
  const board = useLeaderboard(period, group, 100)
  const update = (k: string, v: string | null) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    setParams(next, { replace: true })
  }
  return (
    <div className="mx-auto max-w-[1080px] px-4 py-10 sm:px-6">
      <PageHeader
        title={t('Classements', 'Leaderboards')}
        lead={t(
          'Points par problème réussi : 50 en Facile, 100 en Moyen, 200 en Difficile, 400 en Expert. Bonus de 20 % au premier essai, de 50 % pour le défi du jour.',
          'Points per solved problem: 50 for Easy, 100 for Medium, 200 for Hard, 400 for Expert. 20% bonus on the first try, 50% for the daily challenge.',
        )}
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Segmented
          label={t('Période', 'Period')}
          value={period}
          onChange={(v) => update('periode', v === 'week' ? 'semaine' : null)}
          options={[
            { value: 'all', label: t('Depuis le début', 'All time') },
            { value: 'week', label: t('Cette semaine', 'This week') },
          ]}
        />
        {session && (groups.data?.length ?? 0) > 0 && (
          <div className="w-64">
            <label htmlFor="classement-groupe" className="sr-only">{t('Groupe', 'Group')}</label>
            <Select id="classement-groupe" value={group ?? ''} onChange={(e) => update('groupe', e.target.value || null)}>
              <option value="">{t('Tout le monde', 'Everyone')}</option>
              {groups.data!.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </Select>
          </div>
        )}
      </div>
      <LeaderboardTable
        rows={board.data}
        loading={board.isLoading}
        onRetry={board.isError ? () => board.refetch() : undefined}
        empty={
          <div className="rounded-lg border border-line bg-surface p-6">
            <p className="font-medium">
              {period === 'week' ? t('Aucun point marqué cette semaine.', 'No points scored this week.') : t('Classement vide pour l’instant.', 'Leaderboard empty so far.')}
            </p>
            <p className="mt-1 text-sm text-ink-2">{t('Un problème réussi suffit pour y figurer.', 'One solved problem is enough to appear here.')}</p>
            <LinkButton to="/parcours" size="sm" className="mt-4">
              {t('Ouvrir le parcours', 'Open the path')}
            </LinkButton>
          </div>
        }
      />
      {!session && (
        <p className="mt-4 text-sm text-ink-2">
          {t('Les invités n’apparaissent pas au classement.', 'Guests do not appear on the leaderboard.')}{' '}
          <Link to="/inscription" className="font-medium underline underline-offset-2">
            {t('Créer un compte', 'Create an account')}
          </Link>
        </p>
      )}
    </div>
  )
}
