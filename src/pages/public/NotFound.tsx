import { ButtonLink } from '../../components/ui'
import { Logo } from '../../components/Logo'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-bg px-4 py-6 sm:px-10">
      <Logo />
      <main className="mx-auto flex max-w-[520px] flex-1 flex-col items-start justify-center">
        <div aria-hidden className="lane-rope lane-rope-on-light w-40" />
        <h1 className="display mt-6 text-[56px] text-ink">Ligne d'eau introuvable.</h1>
        <p className="mt-4 text-[17px] text-ink-2">Cette page n'existe pas ou a été déplacée. Vérifiez l'adresse, ou repartez de l'accueil.</p>
        <div className="mt-8 flex gap-3">
          <ButtonLink to="/">Revenir à l'accueil</ButtonLink>
          <ButtonLink to="/connexion" variant="secondary">Se connecter</ButtonLink>
        </div>
      </main>
    </div>
  )
}
