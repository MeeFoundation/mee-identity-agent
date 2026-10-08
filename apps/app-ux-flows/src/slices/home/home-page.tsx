import { useTranslation } from 'react-i18next'

type FlowSummary = {
  id: string
  titleKey: string
}

type HomePageProps = {
  flows: readonly FlowSummary[]
  onStartFlow: (flowId: string) => void
}

export const HomePage = ({ flows, onStartFlow }: HomePageProps) => {
  const { t } = useTranslation()

  return (
    <section>
      <h1>{t('home.title')}</h1>
      <ul>
        {flows.map((flow) => (
          <li key={flow.id}>
            <span>{t(flow.titleKey)}</span>{' '}
            <button onClick={() => onStartFlow(flow.id)} type="button">
              {t('home.start')}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
