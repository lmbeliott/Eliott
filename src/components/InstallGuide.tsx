import { useEffect, useState } from 'react'
import { Button, Drawer } from './ui'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferred: BeforeInstallPromptEvent | null = null
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferred = e as BeforeInstallPromptEvent
  })
}

export function InstallGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [canPrompt, setCanPrompt] = useState(false)
  useEffect(() => { if (open) setCanPrompt(!!deferred) }, [open])

  const install = async () => {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    deferred = null
    onClose()
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Installer SwimHub Connect"
      description="Ajoutez l'application à votre écran d'accueil pour l'ouvrir en un geste, comme une application native."
      footer={<Button variant="ghost" onClick={onClose}>Fermer</Button>}
    >
      {canPrompt && (
        <div className="mb-6 rounded-lg bg-water-soft p-4">
          <p className="text-sm text-ink">Votre navigateur peut installer l'application directement.</p>
          <Button className="mt-3" onClick={install}>Installer maintenant</Button>
        </div>
      )}
      <ul className="space-y-5">
        <Step title="iPhone et iPad (Safari)">
          Touchez le bouton <strong>Partager</strong>, puis <strong>« Sur l'écran d'accueil »</strong>, et confirmez avec <strong>« Ajouter »</strong>.
        </Step>
        <Step title="Android (Chrome)">
          Ouvrez le menu <strong>⋮</strong> en haut à droite, puis <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.
        </Step>
        <Step title="Ordinateur (Chrome ou Edge)">
          Cliquez sur l'icône d'installation à droite de la barre d'adresse, puis sur <strong>« Installer »</strong>.
        </Step>
      </ul>
    </Drawer>
  )
}

/** Une plateforme : son nom en gras, puis le geste à faire. */
function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li>
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-base text-ink-2">{children}</p>
    </li>
  )
}
