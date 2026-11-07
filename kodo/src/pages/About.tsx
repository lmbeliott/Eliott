// Règles et limites du juge : une page de référence, chaque valeur vient du code.
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui'
import { LeagueBadge } from '../components/League'
import { formatNumber, formatPoints, useI18n } from '../lib/i18n'
import { LEAGUES } from '../lib/leagues'
import { POINTS_TABLE } from '../lib/xp'
import { limitFor } from '../judge/judge'
import { OUTPUT_LIMIT } from '../judge/protocol'
import { problemList } from '../lib/content'

function Table({ head, rows }: { head: [string, string]; rows: [ReactNode, ReactNode][] }) {
  return (
    <div className="overflow-hidden rounded-lg bg-surface shadow-[inset_0_0_0_1px_var(--line),var(--edge)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line bg-surface-2 text-left text-xs text-muted">
            <th scope="col" className="h-9 px-4 font-medium">
              {head[0]}
            </th>
            <th scope="col" className="h-9 px-4 text-right font-medium">
              {head[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b], i) => (
            <tr key={i} className="border-b border-line last:border-0">
              <th scope="row" className="h-11 px-4 text-left font-normal text-ink">
                {a}
              </th>
              <td className="px-4 text-right text-ink-2 tabular">{b}</td>
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
    [t('Taille de sortie', 'Output size'), t(`Au plus ${formatNumber(lang, OUTPUT_LIMIT / 1e6)} Mo par test ; au-delà, le test est faux.`, `At most ${formatNumber(lang, OUTPUT_LIMIT / 1e6)} MB per test; beyond that, the test fails.`)],
    ['input("…")', t('Le texte de la question n’est pas affiché : il ne fausse pas ta sortie.', 'The prompt text is not printed, so it does not spoil your output.')],
    [t('Exceptions en C++', 'C++ exceptions'), t('Désactivées (-fno-exceptions) : try et throw ne compilent pas.', 'Disabled (-fno-exceptions): try and throw do not compile.')],
    [t('Pile en C++', 'C++ stack'), t('32 Mo, pour les parcours récursifs profonds.', '32 MB, for deep recursive traversals.')],
    [t('Tests cachés', 'Hidden tests'), t('Leur entrée est affichée quand ils échouent, jamais leur sortie attendue.', 'Their input is shown when they fail, never their expected output.')],
  ]
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
      <PageHeader
        title={t('Règles et limites du juge', 'Rules and judge limits')}
        lead={t(
          `Comment les ${problemList.length} problèmes sont notés, ce que le juge accepte, et qui voit ton code.`,
          `How the ${problemList.length} problems are scored, what the judge accepts, and who sees your code.`,
        )}
      />

      <Section id="points" title={t('Points', 'Points')} lead={t('Un problème rapporte ses points une seule fois, à sa première réussite.', 'A problem pays its points once, the first time you solve it.')}>
        <Table
          head={[t('Difficulté', 'Difficulty'), t('Points', 'Points')]}
          rows={[
            ...POINTS_TABLE.map((x) => [lang === 'en' ? x.en : x.fr, `+${formatPoints(lang, x.points)}`] as [ReactNode, ReactNode]),
            [t('Première soumission acceptée', 'First submission accepted'), '+20 %'],
            [t('Problème du défi du jour, réussi le jour même', 'Daily challenge problem, solved that day'), '+50 %'],
          ]}
        />
      </Section>

      <Section id="ligues" title={t('Ligues', 'Leagues')} lead={t('Ta ligue dépend de ton total de points.', 'Your league depends on your total points.')}>
        <Table head={[t('Ligue', 'League'), t('À partir de', 'From')]} rows={LEAGUES.map((l) => [<LeagueBadge league={l} className="font-normal" />, formatPoints(lang, l.min)])} />
      </Section>

      <Section
        id="serie"
        title={t('Série', 'Streak')}
        lead={t('Les jours changent à minuit, heure de Paris.', 'Days change at midnight, Paris time.')}
      >
        <p className="max-w-[65ch] text-ink-2">
          {t(
            'Ta série avance d’un jour quand tu réussis un problème que tu n’avais jamais réussi, ou un problème du défi du jour. Un jour sans réussite la remet à zéro ; ton record reste sur ton profil.',
            'Your streak grows by one day when you solve a problem you had never solved, or a daily challenge problem. A day without a solve resets it; your record stays on your profile.',
          )}
        </p>
      </Section>

      <Section id="juge" title={t('Le juge', 'The judge')} lead={t('Ton programme s’exécute dans ton navigateur, test par test.', 'Your program runs in your browser, one test at a time.')}>
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
              'La limite affichée sur chaque problème vaut pour le C++ ; Python a 5 fois plus (au moins 3 s), le C++ 2 fois plus (au moins 1,5 s), car tout s’exécute en WebAssembly. Au premier lancement, le navigateur télécharge Python (7,5 Mo) ou le compilateur C++ (27,4 Mo), puis les garde en cache.',
              'The limit shown on each problem is the C++ one; Python gets 5 times more (at least 3 s) and C++ twice as much (at least 1.5 s), because everything runs in WebAssembly. On first use, your browser downloads Python (7.5 MB) or the C++ compiler (27.4 MB), then keeps them cached.',
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

      <Section id="code" title={t('Qui voit ton code', 'Who sees your code')}>
        <p className="max-w-[65ch] text-ink-2">
          {t(
            'Toi, et les encadrants des groupes dont tu fais partie. Les autres élèves voient seulement quels problèmes tu as réussis, tes points et ta série. Ton adresse e-mail n’est affichée nulle part. Tu peux supprimer ton compte et toutes tes soumissions depuis les ',
            'You, and the leaders of the groups you belong to. Other students only see which problems you solved, your points and your streak. Your email address is never shown. You can delete your account and all your submissions from ',
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
