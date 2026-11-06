import { LinkButton, PageHeader } from '../components/ui'
import { formatPoints, useI18n } from '../lib/i18n'
import { LEAGUES, leagueName } from '../lib/leagues'
import { POINTS_TABLE } from '../lib/xp'

export function About() {
  const { lang, t } = useI18n()
  const faq: [string, string][] = [
    [
      t('Où tourne mon code ?', 'Where does my code run?'),
      t(
        'Dans ton navigateur. Python fonctionne grâce à Pyodide (CPython compilé en WebAssembly) ; le C++ est compilé par Clang, lui aussi compilé en WebAssembly. Rien n’est installé sur ton ordinateur, et ça marche hors ligne une fois chargé.',
        'In your browser. Python runs on Pyodide (CPython compiled to WebAssembly); C++ is compiled by Clang, itself compiled to WebAssembly. Nothing is installed on your computer, and it works offline once loaded.',
      ),
    ],
    [
      t('Pourquoi le premier lancement est-il plus long ?', 'Why is the first run slower?'),
      t(
        'Le navigateur télécharge Python (environ 6 Mo) ou le compilateur C++ (environ 27 Mo) une seule fois, puis les garde en cache.',
        'Your browser downloads Python (about 6 MB) or the C++ compiler (about 27 MB) once, then keeps them in its cache.',
      ),
    ],
    [
      t('Comment mon programme est-il jugé ?', 'How is my program judged?'),
      t(
        'Il reçoit chaque test sur son entrée standard. Sa sortie est comparée mot à mot à la réponse attendue : les espaces et retours à la ligne en trop ne comptent pas, mais les majuscules si. Python dispose de 5 fois plus de temps que le C++.',
        'It receives each test on standard input. Its output is compared word by word with the expected answer: extra spaces and line breaks do not matter, but capital letters do. Python gets 5 times more time than C++.',
      ),
    ],
    [
      t('Que peut-on utiliser en C++ ?', 'What can I use in C++?'),
      t(
        'C++17 et toute la bibliothèque standard, y compris <bits/stdc++.h>. Seules les exceptions (try, throw) sont désactivées.',
        'C++17 and the whole standard library, including <bits/stdc++.h>. Only exceptions (try, throw) are disabled.',
      ),
    ],
    [
      t('input("Nombre ?") affiche-t-il la question ?', 'Does input("Number?") print the prompt?'),
      t(
        'Non : sur Kodo, le texte passé à input() n’est pas affiché, pour ne pas fausser ta sortie.',
        'No: on Kodo, the text passed to input() is not printed, so it does not spoil your output.',
      ),
    ],
    [
      t('Qui voit mon code ?', 'Who can see my code?'),
      t(
        'Toi, et les encadrants des groupes dont tu fais partie. Les autres élèves voient seulement quels problèmes tu as réussis.',
        'You, and the leaders of the groups you belong to. Other students only see which problems you solved.',
      ),
    ],
  ]
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageHeader title={t('Comment ça marche', 'How it works')} lead={t('Les points, les ligues, la série, le juge : tout ce qu’il faut savoir.', 'Points, leagues, streaks, the judge: everything you need to know.')} />

      <section>
        <h2 className="text-xl font-semibold">{t('Les points', 'Points')}</h2>
        <p className="mt-2 text-ink-2">
          {t('Chaque problème réussi pour la première fois rapporte des points, selon sa difficulté :', 'Every problem you solve for the first time earns points, depending on its difficulty:')}
        </p>
        <table className="mt-4 w-full max-w-md text-sm">
          <tbody>
            {POINTS_TABLE.map((x) => (
              <tr key={x.difficulty} className="border-b border-line">
                <th scope="row" className="py-2 text-left font-medium">
                  {lang === 'en' ? x.en : x.fr}
                </th>
                <td className="py-2 text-right tabular">+{formatPoints(lang, x.points)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-ink-2">
          {t(
            'Bonus : +20 % si ta toute première soumission est la bonne, +50 % pour le défi du jour. Re-soumettre un problème déjà réussi ne rapporte rien.',
            'Bonuses: +20% if your very first submission is accepted, +50% for the daily challenge. Re-submitting a solved problem earns nothing.',
          )}
        </p>
        <h3 className="mt-8 font-semibold">{t('Les ligues', 'Leagues')}</h3>
        <p className="mt-2 text-ink-2">
          {LEAGUES.map((l) => `${leagueName(lang, l)} (${formatPoints(lang, l.min)})`).join(', ')}.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">{t('Questions fréquentes', 'Frequently asked questions')}</h2>
        <dl className="mt-4 flex flex-col">
          {faq.map(([q, a]) => (
            <div key={q} className="border-b border-line py-4">
              <dt className="font-medium">{q}</dt>
              <dd className="mt-1 text-ink-2">{a}</dd>
            </div>
          ))}
        </dl>
      </section>
      <LinkButton to="/parcours" className="mt-10">
        {t('Commencer le parcours', 'Start the path')}
      </LinkButton>
    </div>
  )
}
