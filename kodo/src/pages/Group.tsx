import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, X } from 'lucide-react'
import { LeaderboardTable } from '../components/LeaderboardTable'
import { Avatar, Button, CopyButton, Field, Input, Notice, Segmented, Skeleton, cx } from '../components/ui'
import { useToast } from '../components/Toast'
import { useAuth } from '../lib/auth'
import { chapters, chapterTitle, problemById, problemTitle } from '../lib/content'
import { formatPoints, plural, timeAgo, useI18n } from '../lib/i18n'
import { useGroup, useLeaderboard, type GroupMember, type Period } from '../lib/queries'
import { errorText, supabase } from '../lib/supabase'
import { KIND_LABEL } from './Groups'
import { NotFound } from './NotFound'

type Tab = 'classement' | 'progression' | 'membres'

const verdictLabel = (t: (fr: string, en: string) => string, v: string) =>
  ({
    accepted: t('Réussi', 'Accepted'),
    wrong_answer: t('Mauvaise réponse', 'Wrong answer'),
    time_limit: t('Temps dépassé', 'Time limit'),
    runtime_error: t('Erreur d’exécution', 'Runtime error'),
    compile_error: t('Erreur de compilation', 'Compile error'),
  })[v] ?? v

/** Soumissions d'un élève (visibles par l'encadrant grâce à RLS). */
function StudentPanel({ member, onClose }: { member: GroupMember; onClose: () => void }) {
  const { lang, t } = useI18n()
  const [open, setOpen] = useState<number | null>(null)
  const subs = useQuery({
    queryKey: ['student-submissions', member.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('id, problem_id, language, code, verdict, passed, total, created_at')
        .eq('user_id', member.user_id)
        .order('created_at', { ascending: false })
        .limit(30)
      if (error) throw error
      return data as { id: number; problem_id: string; language: string; code: string; verdict: string; passed: number; total: number; created_at: string }[]
    },
  })
  return (
    <section className="anim-rise mt-6 rounded-xl border border-line-strong bg-surface p-5" aria-label={t(`Soumissions de ${member.profile.display_name}`, `${member.profile.display_name}’s submissions`)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          {t('Dernières soumissions de', 'Latest submissions by')} {member.profile.display_name}
        </h3>
        <button type="button" onClick={onClose} className="rounded-md p-1 text-muted hover:bg-surface-2 hover:text-ink" aria-label={t('Fermer', 'Close')}>
          <X className="size-5" />
        </button>
      </div>
      {subs.isLoading ? (
        <Skeleton className="mt-4 h-24" />
      ) : !subs.data?.length ? (
        <p className="mt-3 text-sm text-muted">{t('Aucune soumission pour l’instant.', 'No submissions yet.')}</p>
      ) : (
        <ul className="mt-3 divide-y divide-line">
          {subs.data.map((s) => {
            const p = problemById(s.problem_id)
            return (
              <li key={s.id} className="py-2">
                <button type="button" onClick={() => setOpen(open === s.id ? null : s.id)} className="flex w-full items-center justify-between gap-3 text-left text-sm" aria-expanded={open === s.id}>
                  <span className="min-w-0 truncate font-medium">{p ? problemTitle(lang, p) : s.problem_id}</span>
                  <span className="flex shrink-0 items-center gap-3 text-xs">
                    <span className={s.verdict === 'accepted' ? 'text-ok' : 'text-bad'}>
                      {verdictLabel(t, s.verdict)} {s.total > 0 && `(${s.passed}/${s.total})`}
                    </span>
                    <span className="text-muted">{s.language === 'cpp' ? 'C++' : 'Python'}</span>
                    <span className="text-muted">{timeAgo(lang, s.created_at)}</span>
                  </span>
                </button>
                {open === s.id && <pre className="mt-2 max-h-72 overflow-auto rounded-md border border-line bg-code px-3 py-2 text-xs leading-relaxed">{s.code}</pre>}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

function ProgressGrid({ members, solves, onPick, picked }: { members: GroupMember[]; solves: { user_id: string; problem_id: string }[]; onPick: (m: GroupMember) => void; picked: string | null }) {
  const { lang, t } = useI18n()
  const solvedBy = useMemo(() => {
    const m = new Map<string, Set<string>>()
    for (const s of solves) {
      if (!m.has(s.user_id)) m.set(s.user_id, new Set())
      m.get(s.user_id)!.add(s.problem_id)
    }
    return m
  }, [solves])
  const students = members.filter((m) => m.role === 'membre').sort((a, b) => b.profile.xp - a.profile.xp)
  if (!students.length) return <p className="text-sm text-ink-2">{t('Aucun élève pour l’instant. Partage le code du groupe pour qu’ils te rejoignent.', 'No students yet. Share the group code so they can join.')}</p>
  const cols = chapters.filter((c) => c.problems.length > 0)
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="text-sm">
        <caption className="sr-only">{t('Problèmes réussis par élève et par chapitre', 'Problems solved per student and chapter')}</caption>
        <thead>
          <tr className="border-b border-line bg-surface-2 text-xs text-muted">
            <th scope="col" className="sticky left-0 z-10 min-w-48 bg-surface-2 px-4 py-2 text-left font-medium">
              {t('Élève', 'Student')}
            </th>
            {cols.map((c, i) => (
              <th key={c.id} scope="col" className="px-1 py-2 font-medium" title={chapterTitle(lang, c)}>
                <span className="sr-only">{chapterTitle(lang, c)}</span>
                <span aria-hidden>{i + 1}</span>
              </th>
            ))}
            <th scope="col" className="px-4 py-2 text-right font-medium">
              {t('Points', 'Points')}
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((m) => {
            const set = solvedBy.get(m.user_id) ?? new Set()
            return (
              <tr key={m.user_id} className={cx('border-b border-line last:border-0', picked === m.user_id && 'bg-accent-soft')}>
                <th scope="row" className={cx('sticky left-0 z-10 px-4 py-2 text-left font-medium', picked === m.user_id ? 'bg-accent-soft' : 'bg-surface')}>
                  <button type="button" onClick={() => onPick(m)} className="flex items-center gap-2 hover:underline">
                    <Avatar name={m.profile.display_name} size={24} />
                    <span className="truncate">{m.profile.display_name}</span>
                  </button>
                </th>
                {cols.map((c) => {
                  const done = c.problems.filter((p) => set.has(p)).length
                  const ratio = done / c.problems.length
                  return (
                    <td key={c.id} className="px-1 py-1.5 text-center">
                      <span
                        className="inline-flex size-8 items-center justify-center rounded-md text-xs tabular"
                        style={{ background: done ? `color-mix(in oklab, var(--accent) ${18 + ratio * 72}%, var(--surface))` : 'var(--surface-2)', color: ratio > 0.6 ? 'var(--accent-ink)' : 'var(--ink-2)' }}
                        title={`${chapterTitle(lang, c)} : ${done}/${c.problems.length}`}
                      >
                        {done || ''}
                      </span>
                    </td>
                  )
                })}
                <td className="px-4 py-2 text-right tabular">{formatPoints(lang, m.profile.xp)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function GroupPage() {
  const { id = '' } = useParams()
  const { lang, t } = useI18n()
  const { session } = useAuth()
  const q = useGroup(id)
  const qc = useQueryClient()
  const toast = useToast()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('classement')
  const [period, setPeriod] = useState<Period>('week')
  const [picked, setPicked] = useState<GroupMember | null>(null)
  const [confirmName, setConfirmName] = useState('')
  const [rename, setRename] = useState<string | null>(null)
  const board = useLeaderboard(period, id, 200)

  if (q.isLoading)
    return (
      <div className="mx-auto max-w-[1080px] px-4 py-10 sm:px-6">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="mt-6 h-64" />
      </div>
    )
  if (!q.data) return <NotFound />
  const { group, members, solves } = q.data
  const me = members.find((m) => m.user_id === session?.user.id)
  const lead = me?.role === 'encadrant'
  const owner = group.owner_id === session?.user.id
  const shareUrl = `${window.location.origin}${import.meta.env.BASE_URL}rejoindre/${group.join_code}`

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['group', id] })
    qc.invalidateQueries({ queryKey: ['groups'] })
    qc.invalidateQueries({ queryKey: ['leaderboard'] })
  }
  const removeMember = async (m: GroupMember) => {
    if (!window.confirm(t(`Retirer ${m.profile.display_name} du groupe ?`, `Remove ${m.profile.display_name} from the group?`))) return
    const { error } = await supabase.from('group_members').delete().eq('group_id', id).eq('user_id', m.user_id)
    if (error) toast(errorText(error, lang), 'error')
    else {
      toast(t(`${m.profile.display_name} a été retiré du groupe.`, `${m.profile.display_name} was removed from the group.`), 'ok')
      refresh()
    }
  }
  const leave = async () => {
    if (!session || !window.confirm(t(`Quitter « ${group.name} » ?`, `Leave “${group.name}”?`))) return
    const { error } = await supabase.from('group_members').delete().eq('group_id', id).eq('user_id', session.user.id)
    if (error) toast(errorText(error, lang), 'error')
    else {
      refresh()
      navigate('/groupes')
    }
  }
  const remove = async () => {
    const { error } = await supabase.from('groups').delete().eq('id', id)
    if (error) toast(errorText(error, lang), 'error')
    else {
      toast(t(`Groupe « ${group.name} » supprimé.`, `Group “${group.name}” deleted.`), 'ok')
      refresh()
      navigate('/groupes')
    }
  }
  const saveName = async () => {
    if (!rename || rename.trim().length < 2) return
    const { error } = await supabase.from('groups').update({ name: rename.trim() }).eq('id', id)
    if (error) toast(errorText(error, lang), 'error')
    else {
      setRename(null)
      refresh()
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'classement', label: t('Classement', 'Leaderboard') },
    ...(lead ? [{ id: 'progression' as Tab, label: t('Progression', 'Progress') }] : []),
    { id: 'membres', label: `${t('Membres', 'Members')} (${members.length})` },
  ]

  return (
    <div className="mx-auto max-w-[1080px] px-4 py-10 sm:px-6">
      <Link to="/groupes" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> {t('Groupes', 'Groups')}
      </Link>
      <header className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {rename !== null ? (
            <div className="flex items-end gap-2">
              <Field label={t('Nom du groupe', 'Group name')} htmlFor="rename">
                <Input id="rename" value={rename} onChange={(e) => setRename(e.target.value)} maxLength={60} autoFocus onKeyDown={(e) => e.key === 'Enter' && saveName()} />
              </Field>
              <Button onClick={saveName}>{t('Enregistrer', 'Save')}</Button>
              <Button variant="ghost" onClick={() => setRename(null)}>
                {t('Annuler', 'Cancel')}
              </Button>
            </div>
          ) : (
            <h1 className="text-3xl font-semibold">
              {group.name}
              {owner && (
                <button type="button" onClick={() => setRename(group.name)} className="ml-3 align-middle text-sm font-normal text-muted underline-offset-2 hover:text-ink hover:underline">
                  {t('Renommer', 'Rename')}
                </button>
              )}
            </h1>
          )}
          <p className="mt-1 text-ink-2">
            {KIND_LABEL[group.kind][lang === 'en' ? 1 : 0]}, {plural(lang, members.length, ['membre', 'membres'], ['member', 'members'])}
          </p>
        </div>
        <div className="rounded-lg border border-line bg-surface px-4 py-3">
          <p className="text-xs text-muted">{t('Code pour rejoindre', 'Code to join')}</p>
          <div className="flex items-center gap-3">
            <span className="font-mono text-2xl font-semibold tracking-[0.25em]">{group.join_code}</span>
            <CopyButton text={shareUrl} label={t('Copier le lien d’invitation', 'Copy the invite link')} />
          </div>
        </div>
      </header>

      <div role="tablist" aria-label={t('Sections du groupe', 'Group sections')} className="mt-8 flex gap-1 border-b border-line">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            role="tab"
            type="button"
            aria-selected={tab === tb.id}
            onClick={() => setTab(tb.id)}
            className={cx('relative px-3 pb-2.5 text-sm font-medium', tab === tb.id ? 'text-ink after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:bg-ink' : 'text-muted hover:text-ink')}
          >
            {tb.label}
          </button>
        ))}
      </div>

      <div className="mt-6" role="tabpanel">
        {tab === 'classement' && (
          <>
            <Segmented
              label={t('Période', 'Period')}
              value={period}
              onChange={setPeriod}
              options={[
                { value: 'week', label: t('Cette semaine', 'This week') },
                { value: 'all', label: t('Depuis le début', 'All time') },
              ]}
            />
            <div className="mt-4">
              <LeaderboardTable rows={board.data} loading={board.isLoading} empty={<p className="text-sm text-muted">{t('Personne n’a encore marqué de points.', 'Nobody has scored yet.')}</p>} />
            </div>
          </>
        )}
        {tab === 'progression' && lead && (
          <>
            <p className="mb-4 text-sm text-ink-2">
              {t('Chaque case indique le nombre de problèmes réussis dans le chapitre. Clique sur un élève pour voir ses dernières soumissions et son code.', 'Each cell shows how many problems were solved in the chapter. Click a student to see their latest submissions and code.')}
            </p>
            <ProgressGrid members={members} solves={solves} picked={picked?.user_id ?? null} onPick={(m) => setPicked(picked?.user_id === m.user_id ? null : m)} />
            {picked && <StudentPanel member={picked} onClose={() => setPicked(null)} />}
            <p className="mt-3 text-xs text-muted">
              {chapters
                .filter((c) => c.problems.length > 0)
                .map((c, i) => `${i + 1}. ${chapterTitle(lang, c)}`)
                .join(' ; ')}
            </p>
          </>
        )}
        {tab === 'membres' && (
          <div className="flex flex-col gap-8">
            <ul className="overflow-hidden rounded-xl border border-line bg-surface">
              {members
                .slice()
                .sort((a, b) => (a.role === b.role ? a.profile.display_name.localeCompare(b.profile.display_name) : a.role === 'encadrant' ? -1 : 1))
                .map((m) => (
                  <li key={m.user_id} className="flex items-center justify-between gap-3 border-b border-line px-5 py-3 last:border-0">
                    <Link to={`/profil/${m.profile.username}`} className="flex min-w-0 items-center gap-3 hover:underline">
                      <Avatar name={m.profile.display_name} size={32} />
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{m.profile.display_name}</span>
                        <span className="block text-xs text-muted">
                          {m.role === 'encadrant' ? t('Encadrant', 'Leader') : t('Membre', 'Member')}, {t('arrivé', 'joined')} {timeAgo(lang, m.joined_at)}
                        </span>
                      </span>
                    </Link>
                    {lead && m.user_id !== session?.user.id && m.user_id !== group.owner_id && (
                      <Button variant="ghost" size="sm" onClick={() => removeMember(m)}>
                        {t('Retirer', 'Remove')}
                      </Button>
                    )}
                  </li>
                ))}
            </ul>
            {!owner && me && (
              <div>
                <Button variant="danger" onClick={leave}>
                  {t('Quitter le groupe', 'Leave the group')}
                </Button>
              </div>
            )}
            {owner && (
              <section className="rounded-xl border border-bad/40 p-5" aria-labelledby="supprimer">
                <h2 id="supprimer" className="font-semibold">
                  {t('Supprimer le groupe', 'Delete the group')}
                </h2>
                <p className="mt-1 text-sm text-ink-2">
                  {t('Les membres et le classement du groupe disparaissent. Les réussites de chacun restent sur leur profil.', 'Members and the group leaderboard are removed. Everyone keeps their solves on their own profile.')}
                </p>
                <div className="mt-4 flex flex-wrap items-end gap-3">
                  <Field label={t(`Tape « ${group.name} » pour confirmer`, `Type “${group.name}” to confirm`)} htmlFor="confirm-delete">
                    <Input id="confirm-delete" value={confirmName} onChange={(e) => setConfirmName(e.target.value)} autoComplete="off" />
                  </Field>
                  <Button variant="danger" disabled={confirmName.trim() !== group.name} onClick={remove}>
                    {t(`Supprimer « ${group.name} »`, `Delete “${group.name}”`)}
                  </Button>
                </div>
              </section>
            )}
            {!me && <Notice>{t('Tu ne fais pas partie de ce groupe.', 'You are not a member of this group.')}</Notice>}
          </div>
        )}
      </div>
    </div>
  )
}
