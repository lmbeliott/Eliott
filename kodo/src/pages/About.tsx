// Règles et limites du juge : une page de référence, chaque valeur vient du code.
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui'
import { LeagueBadge } from '../components/League'
import { cx } from '../components/ui'
import { formatNumber, formatPoints, useI18n } from '../lib/i18n'
import { LEAGUES, leagueMeaning } from '../lib/leagues'
import { POINTS_TABLE } from '../lib/xp'
import { limitFor } from '../judge/judge'
import { OUTPUT_LIMIT } from '../judge/protocol'
import { problemList } from '../lib/content'

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  const last = head.length - 1
  return (
    <div className="overflow-x-auto rounded-lg bg-surface shadow-[inset_0_0_0_1px_var(--line),var(--edge)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line bg-surface-2 text-left text-xs text-muted">
            {head.map((h, i) => (
              <th key={i} scope="col" className={cx('h-9 px-4 font-medium', i === last && i > 0 && 'text-right')}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, r) => (
            <tr key={r} className="border-b border-line last:border-0">
              {cells.map((c, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="h-11 px-4 text-left font-normal text-ink">
                    {c}
                  </th>
                ) : (
                  <td key={i} className={cx('px-4 text-ink-2', i === last ? 'whitespace-nowrap text-right tabular' : 'text-left')}>
                    {c}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Section({ id, title, lead, children }: { id: string; title: string; lead?: ReactNode; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-6 border-t border-line py-10 first-of-type:border-t-0 first-of-type:pt-2 lg:grid-cols-[18rem_1fr] lg:gap-12">
      <div>
        <h2 id={id} className="text-xl">
          {title}
        </h2>
        {lead && <p className="mt-2 text-sm text-ink-2">{lead}</p>}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

export function About() {
  const { lang, t } = useI18n()
  const ms = (n: number) => `${formatNumber(lang, n / 1000)} s`
  const facts: [string, string][] = [
    [t('Comparaison des sorties', 'Output comparison'), t('Mot à mot : les espaces et retours à la ligne en trop sont ignorés, les majuscules comptent.', 'Word by word: extra spaces and line breaks are ignored, capital letters matter.')],
    [t('Taille de sortie', 'Output size'), t(`Au plus ${formatNumber(lang, OUTPUT_LIMIT / 1e6)} Mo par test ; au-delà, test échoué.`, `At most ${formatNumber(lang, OUTPUT_LIMIT / 1e6)} MB per test; beyond that, the test fails.`)],
    ['input("…")', t('Texte de la question non affiché : la sortie n’est pas faussée.', 'Prompt text not printed: the output is unaffected.')],
    [t('Exceptions en C++', 'C++ exceptions'), t('Désactivées (-fno-exceptions) : try et throw ne compilent pas.', 'Disabled (-fno-exceptions): try and throw do not compile.')],
    [t('Pile en C++', 'C++ stack'), t('32 Mo, pour les parcours récursifs profonds.', '32 MB, for deep recursive traversals.')],
    [t('Tests cachés', 'Hidden tests'), t('Leur entrée est affichée quand ils échouent, jamais leur sortie attendue.', 'Their input is shown when they fail, never their expected output.')],
  ]
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
      <PageHeader
        title={t('Règles et limites du juge', 'Rules and judge limits')}
        lead={t(
          `Notation des ${problemList.length} problèmes, fonctionnement du juge et visibilité du code.`,
          `Scoring of the ${problemList.length} problems, how the judge works, and who can see submitted code.`,
        )}
      />

      <Section id="points" title={t('Points', 'Points')} lead={t('Points attribués une seule fois par problème, à la première réussite.', 'Points awarded once per problem, on the first solve.')}>
        <Table
          head={[t('Difficulté', 'Difficulty'), t('Points', 'Points')]}
          rows={[
            ...POINTS_TABLE.map((x) => [lang === 'en' ? x.en : x.fr, `+${formatPoints(lang, x.points)}`] as [ReactNode, ReactNode]),
            [t('Première soumission acceptée', 'First submission accepted'), '+20 %'],
            [t('Problème du défi du jour, réussi le jour même', 'Daily challenge problem, solved that day'), '+50 %'],
          ]}
        />
      </Section>

      <Section id="rangs" title={t('Rangs', 'Ranks')} lead={t('Rang déterminé par le total de points. Shu, Ha, Ri : les trois étapes classiques de l’apprentissage japonais.', 'Rank set by total points. Shu, Ha, Ri: the three classic stages of Japanese learning.')}>
        <Table
          head={[t('Rang', 'Rank'), t('Sens', 'Meaning'), t('À partir de', 'From')]}
          rows={LEAGUES.map((l) => [<LeagueBadge league={l} />, leagueMeaning(lang, l), formatPoints(lang, l.min)])}
        />
      </Section>

      <Section
        id="serie"
        title={t('Série', 'Streak')}
        lead={t('Les jours changent à minuit, heure de Paris.', 'Days change at midnight, Paris time.')}
      >
        <p className="max-w-[65ch] text-ink-2">
          {t(
            'La série avance d’un jour avec la première réussite d’un problème, ou la réussite d’un problème du défi du jour. Un jour sans réussite la remet à zéro ; le record reste affiché sur le profil.',
            'The streak grows by one day with the first solve of a problem, or a solve of a daily challenge problem. A day without a solve resets it; the record stays on the profile.',
          )}
        </p>
      </Section>

      <Section id="juge" title={t('Le juge', 'The judge')} lead={t('Programme exécuté dans le navigateur, test par test.', 'Runs in the browser, one test at a time.')}>
        <div className="flex flex-col gap-6">
          <Table
            head={[t('Langage', 'Language'), t('Temps par test (énoncé à 1 s)', 'Time per test (1 s statement)')]}
            rows={[
              ['Python 3.14 (Pyodide)', ms(limitFor('python', 1000))],
              ['C++17 (Clang 22, -O2)', ms(limitFor('cpp', 1000))],
            ]}
          />
          <p className="max-w-[65ch] text-sm text-ink-2">
            {t(
              'La limite affichée sur chaque problème est multipliée, car tout s’exécute en WebAssembly : 5 fois pour Python (au moins 3 s), 2 fois pour le C++ (au moins 0,5 s). Au premier lancement, le navigateur télécharge Python (7,5 Mo) ou le compilateur C++ (27,4 Mo), puis les garde en cache.',
              'The limit shown on each problem is multiplied, because everything runs in WebAssembly: 5 times for Python (at least 3 s), 2 times for C++ (at least 0.5 s). On first use, the browser downloads Python (7.5 MB) or the C++ compiler (27.4 MB), then caches them.',
            )}
          </p>
          <dl className="divide-y divide-line overflow-hidden rounded-lg bg-surface shadow-[inset_0_0_0_1px_var(--line),var(--edge)]">
            {facts.map(([k, v]) => (
              <div key={k} className="grid gap-1 px-4 py-3 sm:grid-cols-[14rem_1fr] sm:gap-4">
                <dt className="text-sm font-medium">{k}</dt>
                <dd className="text-sm text-ink-2">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section id="code" title={t('Visibilité du code', 'Code visibility')}>
        <p className="max-w-[65ch] text-ink-2">
          {t(
            'Code visible uniquement par son auteur et par les encadrants de ses groupes. Les autres élèves voient seulement les problèmes réussis, les points et la série. Adresse e-mail jamais affichée. Suppression du compte et de toutes les soumissions depuis les ',
            'Code is visible only to its author and to the leaders of the author’s groups. Other students only see solved problems, points and streak. The email address is never shown. The account and all submissions can be deleted from ',
          )}
          <Link to="/compte" className="text-accent underline underline-offset-2">
            {t('paramètres', 'settings')}
          </Link>
          .
        </p>
      </Section>
    </div>
  )
}
