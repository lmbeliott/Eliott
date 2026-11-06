import { LinkButton } from '../components/ui'
import { useI18n } from '../lib/i18n'

export function NotFound() {
  const { t } = useI18n()
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start gap-4 px-4 py-24 sm:px-6">
      <p className="display text-4xl font-semibold">404</p>
      <h1 className="text-2xl font-semibold">{t('Ce sentier ne mène nulle part', 'This trail leads nowhere')}</h1>
      <p className="text-ink-2">
        {t('La page demandée n’existe pas, ou plus. Reprends le parcours depuis le début, ou cherche un problème dans la liste.', 'This page does not exist, or no longer does. Go back to the path, or look for a problem in the list.')}
      </p>
      <div className="flex gap-2">
        <LinkButton to="/parcours">{t('Voir le parcours', 'See the path')}</LinkButton>
        <LinkButton to="/problemes" variant="secondary">
          {t('Tous les problèmes', 'All problems')}
        </LinkButton>
      </div>
    </div>
  )
}
