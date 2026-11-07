// Choix de l'avatar parmi la liste fixe. Un clic enregistre aussitôt (pas de bouton à valider).
import { useRef, useState, type KeyboardEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Lock } from 'lucide-react'
import { AVATARS, SPECIAL_AVATARS, avatarFor, canUse } from '../lib/avatars'
import { formatPoints, useI18n } from '../lib/i18n'
import { errorText, supabase, type Profile } from '../lib/supabase'
import { AvatarImage } from './UserAvatar'
import { useToast } from './Toast'
import { cx } from './ui'

export function AvatarPicker({ profile }: { profile: Profile }) {
  const { lang, t } = useI18n()
  const qc = useQueryClient()
  const toast = useToast()
  const current = avatarFor(profile.avatar, profile.id).id
  const [value, setValue] = useState(current)
  const [saving, setSaving] = useState<string | null>(null)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  // Le dragon est montré à tous (verrouillé tant que le rang Meijin n'est pas atteint) ; les avatars
  // réservés à l'administrateur ne sont montrés qu'à lui.
  const list = [...SPECIAL_AVATARS.filter((a) => a.unlock !== 'admin' || profile.staff === 'admin'), ...AVATARS]
  const usable = (id: string) => canUse(list.find((a) => a.id === id)!, profile.xp, profile.staff)

  const pick = async (id: string) => {
    if (id === value || saving || !usable(id)) return
    const before = value
    setValue(id)
    setSaving(id)
    const { error } = await supabase.from('profiles').update({ avatar: id }).eq('id', profile.id)
    setSaving(null)
    if (error) {
      setValue(before)
      toast(errorText(error, lang))
      return
    }
    qc.invalidateQueries()
    toast(t('Avatar enregistré.', 'Avatar saved.'), 'ok')
  }

  const onKey = (e: KeyboardEvent, i: number) => {
    const cols = window.matchMedia('(min-width: 640px)').matches ? 8 : 4
    const d = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols }[e.key]
    if (!d) return
    e.preventDefault()
    const j = (i + d + list.length) % list.length
    refs.current[j]?.focus()
    pick(list[j].id)
  }

  return (
    <div role="radiogroup" aria-label={t('Avatar', 'Avatar')} className="grid grid-cols-4 gap-2 sm:grid-cols-8">
      {list.map((a, i) => {
        const on = a.id === value
        const locked = !canUse(a, profile.xp, profile.staff)
        const need = a.unlock && a.unlock !== 'admin' ? a.unlock.minPoints : 0
        const name = `${lang === 'en' ? a.en : a.fr} (${a.kanji})${locked ? t(` : rang Meijin requis, ${formatPoints(lang, need)}`, ` : Meijin rank required, ${formatPoints(lang, need)}`) : ''}`
        return (
          <button
            key={a.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={on}
            aria-disabled={locked || undefined}
            aria-label={name}
            title={name}
            tabIndex={on ? 0 : -1}
            onClick={() => pick(a.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={cx(
              'flex aspect-square items-center justify-center rounded-[14px] transition-[box-shadow,transform] duration-150',
              'relative',
              on ? 'shadow-[0_0_0_2px_var(--accent)]' : locked ? 'cursor-not-allowed' : 'hover:shadow-[0_0_0_1px_var(--line-strong)]',
              saving === a.id && 'animate-pulse',
            )}
          >
            <AvatarImage def={a} size={44} className={locked ? 'opacity-35 grayscale' : undefined} />
            {locked && (
              <span className="absolute inset-0 flex items-center justify-center" aria-hidden>
                <Lock className="size-4 text-ink" />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
