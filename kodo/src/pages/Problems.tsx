import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Check, Circle, CircleDot, Search, X } from 'lucide-react'
import { Button, DifficultyMark, Input, PageHeader, Select, cx } from '../components/ui'
import { chapters, chapterTitle, DIFFICULTIES, problemList, problemTitle, tagLabel, type Difficulty } from '../lib/content'
import { formatNumber, formatPoints, plural, useI18n } from '../lib/i18n'
import { useProgress } from '../lib/progress'
import { useProblemStats } from '../lib/queries'

type Status = 'tous' | 'a-faire' | 'tentes' | 'reussis'
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export function Problems() {
  const { lang, t } = useI18n()
  const [params, setParams] = useSearchParams()
  const progress = useProgress()
  const stats = useProblemStats()
  const q = params.get('q') ?? ''
  const levelsSel = (params.get('niveaux')?.split(',').filter(Boolean) ?? []) as Difficulty[]
  const chapter = params.get('chapitre') ?? ''
  const tag = params.get('tag') ?? ''
  const status = (params.get('statut') ?? 'tous') as Status

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }
  const toggleLevel = (d: Difficulty) => {
    const next = levelsSel.includes(d) ? levelsSel.filter((x) => x !== d) : [...levelsSel, d]
    set('niveaux', next.join(','))
  }

  const tags = useMemo(() => [...new Set(problemList.flatMap((p) => p.tags))].sort((a, b) => tagLabel(lang, a).localeCompare(tagLabel(lang, b))), [lang])
  const list = problemList.filter((p) => {
    if (levelsSel.length && !levelsSel.includes(p.difficulty)) return false
    if (chapter && p.chapter !== chapter) return false
    if (tag && !p.tags.includes(tag)) return false
    const solved = progress.solved.has(p.id)
    if (status === 'reussis' && !solved) return false
    if (status === 'a-faire' && solved) return false
    if (status === 'tentes' && (solved || !progress.tried.has(p.id))) return false
    if (q && !norm(`${p.title} ${p.titleEn ?? ''} ${p.tags.join(' ')}`).includes(norm(q))) return false
    return true
  })
  const filtered = !!(q || levelsSel.length || chapter || tag || status !== 'tous')
  const solvedCount = problemList.filter((p) => progress.solved.has(p.id)).length

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
      <PageHeader
        title={t('Problèmes', 'Problems')}
        lead={t(
          `${plural(lang, problemList.length, ['problème', 'problèmes'], ['', ''])}${progress.loading ? '' : `, ${solvedCount} réussi${solvedCount > 1 ? 's' : ''}`}. Filtres par difficulté, chapitre, notion et statut.`,
          `${problemList.length} problems${progress.loading ? '' : `, ${solvedCount} solved`}. Filters by difficulty, chapter, topic and status.`,
        )}
      />

      <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-4">
        <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="relative">
            <label htmlFor="recherche" className="sr-only">
              {t('Rechercher un problème', 'Search problems')}
            </label>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <Input id="recherche" type="search" value={q} onChange={(e) => set('q', e.target.value)} placeholder={t('Rechercher', 'Search')} className="pl-9" />
          </div>
          <div>
            <label htmlFor="f-chapitre" className="sr-only">{t('Chapitre', 'Chapter')}</label>
            <Select id="f-chapitre" value={chapter} onChange={(e) => set('chapitre', e.target.value)}>
              <option value="">{t('Tous les chapitres', 'All chapters')}</option>
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {chapterTitle(lang, c)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="f-tag" className="sr-only">{t('Notion', 'Topic')}</label>
            <Select id="f-tag" value={tag} onChange={(e) => set('tag', e.target.value)}>
              <option value="">{t('Toutes les notions', 'All topics')}</option>
              {tags.map((x) => (
                <option key={x} value={x}>
                  {tagLabel(lang, x)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="f-statut" className="sr-only">{t('Statut', 'Status')}</label>
            <Select id="f-statut" value={status} onChange={(e) => set('statut', e.target.value === 'tous' ? null : e.target.value)}>
              <option value="tous">{t('Tous les statuts', 'Any status')}</option>
              <option value="a-faire">{t('À faire', 'To do')}</option>
              <option value="tentes">{t('Tentés, pas encore réussis', 'Attempted, not solved')}</option>
              <option value="reussis">{t('Réussis', 'Solved')}</option>
            </Select>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('Difficulté', 'Difficulty')}>
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={levelsSel.includes(d)}
              onClick={() => toggleLevel(d)}
              className={cx('h-8 rounded-md border px-3 text-sm transition-colors', levelsSel.includes(d) ? 'border-accent bg-accent-soft' : 'border-line hover:border-line-strong')}
            >
              <DifficultyMark difficulty={d} />
            </button>
          ))}
          {filtered && (
            <Button variant="ghost" size="sm" onClick={() => setParams({}, { replace: true })} className="ml-auto">
              <X className="size-4" aria-hidden /> {t('Effacer les filtres', 'Clear filters')}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-surface">
        <table className="w-full text-sm">
          <caption className="sr-only">{t('Liste des problèmes', 'Problem list')}</caption>
          <thead className="border-b border-line bg-surface-2 text-left text-xs text-muted">
            <tr>
              <th scope="col" className="w-12 py-2.5 pl-4 font-medium">
                <span className="sr-only">{t('Statut', 'Status')}</span>
              </th>
              <th scope="col" className="py-2.5 font-medium">{t('Problème', 'Problem')}</th>
              <th scope="col" className="hidden py-2.5 font-medium md:table-cell">{t('Chapitre', 'Chapter')}</th>
              <th scope="col" className="hidden py-2.5 font-medium lg:table-cell">{t('Notions', 'Topics')}</th>
              <th scope="col" className="hidden py-2.5 pr-4 text-right font-medium sm:table-cell">{t('Réussi par', 'Solved by')}</th>
              <th scope="col" className="py-2.5 pr-4 text-right font-medium">{t('Points', 'Points')}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => {
              const solved = progress.solved.has(p.id)
              const tried = !solved && progress.tried.has(p.id)
              const ch = chapters.find((c) => c.id === p.chapter)!
              return (
                <tr key={p.id} className="border-b border-line last:border-0 hover:bg-surface-2/60">
                  <td className="py-3 pl-4">
                    {solved ? (
                      <Check className="size-4 text-ok" aria-label={t('Réussi', 'Solved')} />
                    ) : tried ? (
                      <CircleDot className="size-4 text-accent" aria-label={t('Tenté', 'Attempted')} />
                    ) : (
                      <Circle className="size-4 text-line-strong" aria-label={t('À faire', 'To do')} />
                    )}
                  </td>
                  <td className="py-3 pr-3">
                    <Link to={`/probleme/${p.id}`} className="font-medium text-ink hover:underline">
                      {problemTitle(lang, p)}
                    </Link>
                    <span className="mt-0.5 block">
                      <DifficultyMark difficulty={p.difficulty} className="text-xs" />
                    </span>
                  </td>
                  <td className="hidden py-3 pr-3 text-ink-2 md:table-cell">{chapterTitle(lang, ch)}</td>
                  <td className="hidden py-3 pr-3 text-ink-2 lg:table-cell">{p.tags.map((x) => tagLabel(lang, x)).join(', ')}</td>
                  <td className="hidden py-3 pr-4 text-right tabular text-ink-2 sm:table-cell">{formatNumber(lang, stats.data?.get(p.id) ?? 0)}</td>
                  <td className="py-3 pr-4 text-right tabular">{formatPoints(lang, p.points)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {list.length === 0 && (
          <div className="flex flex-col items-start gap-3 p-6">
            <p className="font-medium">{t('Aucun problème ne correspond à ces filtres.', 'No problem matches these filters.')}</p>
            <Button variant="secondary" size="sm" onClick={() => setParams({}, { replace: true })}>
              {t('Effacer les filtres', 'Clear filters')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
