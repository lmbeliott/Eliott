// Équipe de Kodo : nom en couleur et titre spécial (profiles.staff, modifiable seulement côté base).
import type { ReactNode } from 'react'
import { useI18n } from '../lib/i18n'
import { cx } from './ui'

type Staff = 'admin' | 'moderateur' | null | undefined

/** Nom affiché ; en dégradé or-vermillon pour l'administrateur. */
export function UserName({ name, staff, className }: { name: ReactNode; staff?: Staff; className?: string }) {
  return <span className={cx(staff === 'admin' && 'name-admin', className)}>{name}</span>
}

/** Titre d'équipe, dans le même style que les rangs : 開祖 KAISO, le fondateur d'une école. */
export function StaffTitle({ staff, className }: { staff?: Staff; className?: string }) {
  const { t } = useI18n()
  if (staff !== 'admin') return null
  return (
    <span className={cx('inline-flex items-baseline gap-2 whitespace-nowrap', className)} title={t('開祖 · Le fondateur de l’école : créateur de Kodo', '開祖 · The founder of the school: creator of Kodo')}>
      <span lang="ja" className="rank-kanji name-admin text-[1.1em] leading-none">
        開祖
      </span>
      <span className="rank-name text-[0.7em] leading-none">Kaiso</span>
    </span>
  )
}
