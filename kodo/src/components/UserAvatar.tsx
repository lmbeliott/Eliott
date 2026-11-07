// Avatar d'un utilisateur : l'image en cellules choisie dans les paramètres (voir lib/avatars.ts).
import { memo } from 'react'
import { avatarFor, type AvatarDef } from '../lib/avatars'
import { cx } from './ui'

export const AvatarImage = memo(function AvatarImage({ def, size, className }: { def: AvatarDef; size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="-1 -1 10 10" shapeRendering="crispEdges" aria-hidden className={cx('shrink-0', className)} style={{ borderRadius: size * 0.28, background: def.bg }}>
      {def.px.flatMap((row, y) =>
        [...row].map((ch, x) => (ch === '.' ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={def.colors[Number(ch) - 1]} />)),
      )}
    </svg>
  )
})

/** seed : l'identifiant du compte, pour un avatar stable quand aucun n'a été choisi. */
export function UserAvatar({ avatar, seed, size = 32, me }: { avatar?: string | null; seed: string; size?: number; me?: boolean }) {
  return <AvatarImage def={avatarFor(avatar, seed)} size={size} className={cx(me && 'ring-2 ring-accent ring-offset-2 ring-offset-surface')} />
}
