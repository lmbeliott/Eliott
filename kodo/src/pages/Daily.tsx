import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui'
import { DailyList } from '../components/DailyList'
import { plural, useI18n } from '../lib/i18n'
import { useProgress } from '../lib/progress'
import { useDaily } from '../lib/queries'
import { useAuth } from '../lib/auth'
import { liveStreak } from '../lib/supabase'

/** Temps restant jusqu'à minuit, heure de Paris. */
function useUntilMidnight() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [])
  const paris = new Date(new Date(now).toLocaleString('en-US', { timeZone: 'Europe/Paris' }))
  const minutes = 24 * 60 - (paris.getHours() * 60 + paris.getMinutes())
  return { h: Math.floor(minutes / 60), m: minutes % 60 }
}

export function Daily() {
  const { lang, t } = useI18n()
  const daily = useDaily()
  const progress = useProgress()
  const { profile } = useAuth()
  const left = useUntilMidnight()
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
      <PageHeader
        title={t('Défi du jour', 'Daily challenge')}
        lead={t(
          `Chaque jour, un problème par niveau, le même pour tout le monde. Nouveau défi dans ${left.h}\u00a0h\u00a0${String(left.m).padStart(2, '0')}.`,
          `Every day, one problem per level, the same for everyone. New challenge in ${left.h}\u00a0h\u00a0${String(left.m).padStart(2, '0')}\u00a0min.`,
        )}
      />
      <DailyList daily={daily.data} loading={daily.isLoading} solved={progress.solved} />
      <section className="mt-12 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold">{t('Les règles', 'The rules')}</h2>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-ink-2">
            <li>{t('Un défi réussi aujourd’hui rapporte 50 % de points en plus.', 'A challenge solved today earns 50% more points.')}</li>
            <li>{t('La série avance d’un jour dès qu’un nouveau problème ou un défi du jour est réussi.', 'The streak grows by one day as soon as a new problem or a daily challenge is solved.')}</li>
            <li>{t('Un jour sans réussite remet la série à zéro.', 'A day without a solve resets the streak to zero.')}</li>
            <li>{t('Les jours changent à minuit, heure de Paris.', 'Days change at midnight, Paris time.')}</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold">{t('Série', 'Streak')}</h2>
          <p className="mt-3 text-ink-2">
            {profile
              ? t(
                  `Série en cours : ${plural(lang, liveStreak(profile), ['jour', 'jours'], ['day', 'days'])}. Record : ${plural(lang, profile.best_streak, ['jour', 'jours'], ['day', 'days'])}.`,
                  `Current streak: ${plural(lang, liveStreak(profile), ['jour', 'jours'], ['day', 'days'])}. Best: ${plural(lang, profile.best_streak, ['jour', 'jours'], ['day', 'days'])}.`,
                )
              : (
                  <>
                    {t('Le suivi de la série et le bonus nécessitent un compte. ', 'Streak tracking and the bonus require an account. ')}
                    <Link to="/connexion" className="font-medium text-ink underline underline-offset-2 hover:text-accent">
                      {t('Se connecter', 'Sign in')}
                    </Link>
                  </>
                )}
          </p>
        </div>
      </section>
    </div>
  )
}
