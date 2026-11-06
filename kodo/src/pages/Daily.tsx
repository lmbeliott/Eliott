import { useEffect, useState } from 'react'
import { PageHeader } from '../components/ui'
import { DailyList } from './Home'
import { useI18n } from '../lib/i18n'
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
  const { t } = useI18n()
  const daily = useDaily()
  const progress = useProgress()
  const { profile } = useAuth()
  const left = useUntilMidnight()
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
      <PageHeader
        title={t('Défi du jour', 'Daily challenge')}
        lead={t(
          `Chaque jour, un problème par piste, le même pour tout le monde. Nouveau défi dans ${left.h} h ${String(left.m).padStart(2, '0')}.`,
          `Every day, one problem per run, the same for everyone. New challenge in ${left.h} h ${String(left.m).padStart(2, '0')} min.`,
        )}
      />
      <DailyList daily={daily.data} loading={daily.isLoading} solved={progress.solved} />
      <section className="mt-12 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold">{t('Les règles', 'The rules')}</h2>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-ink-2">
            <li>{t('Un défi réussi aujourd’hui rapporte 50 % d’altitude en plus.', 'A challenge solved today earns 50% more altitude.')}</li>
            <li>{t('Ta série avance d’un jour dès que tu réussis un nouveau problème ou un défi du jour.', 'Your streak grows by one day as soon as you solve a new problem or a daily challenge.')}</li>
            <li>{t('Un jour sans réussite, et la série repart de zéro.', 'Miss a day, and the streak starts over.')}</li>
            <li>{t('Les jours changent à minuit, heure de Paris.', 'Days change at midnight, Paris time.')}</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold">{t('Ta série', 'Your streak')}</h2>
          <p className="mt-3 text-ink-2">
            {profile
              ? t(`Série en cours : ${liveStreak(profile)} jour(s). Record : ${profile.best_streak} jour(s).`, `Current streak: ${liveStreak(profile)} day(s). Best: ${profile.best_streak} day(s).`)
              : t('Connecte-toi pour suivre ta série et gagner le bonus.', 'Sign in to track your streak and earn the bonus.')}
          </p>
        </div>
      </section>
    </div>
  )
}
