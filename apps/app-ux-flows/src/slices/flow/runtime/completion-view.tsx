import { useTranslation } from 'react-i18next'

type CompletionViewProps = {
  titleKey: string
  onRestart: () => void
  onExit: () => void
}

export const CompletionView = ({ titleKey, onRestart, onExit }: CompletionViewProps) => {
  const { t } = useTranslation()

  return (
    <section>
      <h1>{t('flow.completion.title')}</h1>
      <p>{t('flow.completion.body', { title: t(titleKey) })}</p>
      <button onClick={onRestart} type="button">
        {t('flow.completion.restart')}
      </button>{' '}
      <button onClick={onExit} type="button">
        {t('flow.completion.allFlows')}
      </button>
    </section>
  )
}
