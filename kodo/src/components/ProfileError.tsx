import { Button, Notice } from './ui'
import { useAuth } from '../lib/auth'
import { useI18n } from '../lib/i18n'

/** Profil introuvable ou serveur indisponible : un message et un bouton, plutôt qu'un squelette sans fin. */
export function ProfileError() {
  const { t } = useI18n()
  const { retryProfile } = useAuth()
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <Notice
        tone="error"
        action={
          <Button variant="secondary" size="sm" onClick={retryProfile}>
            {t('Réessayer', 'Try again')}
          </Button>
        }
      >
        {t('Chargement du profil impossible. Vérifier la connexion internet puis réessayer.', 'The profile could not be loaded. Check the internet connection, then try again.')}
      </Notice>
    </div>
  )
}
