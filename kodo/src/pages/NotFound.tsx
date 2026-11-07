import { useLocation } from 'react-router-dom'
import { CellText } from '../components/CellText'
import { LinkButton } from '../components/ui'
import { openList, problemList, problemTitle } from '../lib/content'
import { useI18n } from '../lib/i18n'

export function NotFound() {
  const { lang, t } = useI18n()
  const { pathname } = useLocation()
  const first = problemList[0] ?? openList[0]
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-6 px-4 py-20 sm:px-6">
      <CellText text="404" cell={16} gap={4} lit={[[6, 5]]} label="404" className="hidden sm:inline-grid" />
      <CellText text="404" cell={9} gap={3} lit={[[6, 5]]} label="404" className="sm:hidden" />
      <div className="max-w-xl">
        <h1 className="display text-2xl">{t('Aucune page à cette adresse', 'No page at this address')}</h1>
        <p className="mt-2 text-ink-2">
          {t('Kodo n’a rien à ', 'Kodo has nothing at ')}
          <code className="rounded-sm bg-surface-2 px-1.5 py-0.5 font-mono text-sm">{pathname}</code>
          {t('. Le lien est peut-être ancien : les problèmes ont été renommés d’après leur tâche.', '. The link may be old: problems were renamed after their task.')}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <LinkButton to="/parcours">{t('Ouvrir le parcours', 'Open the path')}</LinkButton>
        <LinkButton to={`/probleme/${first.id}`} variant="secondary">
          {t(`Commencer par ${problemTitle(lang, first)}`, `Start with ${problemTitle(lang, first)}`)}
        </LinkButton>
      </div>
    </div>
  )
}
