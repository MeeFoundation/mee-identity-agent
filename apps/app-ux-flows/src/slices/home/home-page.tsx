import { useTranslation } from 'react-i18next'

type VariantChoice = {
  id: string
  nameKey: string
  descriptionKey?: string
}

type FlowLauncher = {
  id: string
  titleKey: string
  variantChoices: readonly VariantChoice[] | null
  assignedVariantId: string | null
}

type HomePageProps = {
  flows: readonly FlowLauncher[]
  onStartFlow: (flowId: string, variantId?: string) => void
  onStartNewSession: () => void
}

export const HomePage = ({ flows, onStartFlow, onStartNewSession }: HomePageProps) => {
  const { t } = useTranslation()

  return (
    <section>
      <h1>{t('home.title')}</h1>
      <ul>
        {flows.map((flow) => (
          <li key={flow.id}>
            <span>{t(flow.titleKey)}</span>{' '}
            {flow.variantChoices ? (
              <>
                <span>{t('home.chooseVariant')}</span>
                <ul>
                  {flow.variantChoices.map((choice) => (
                    <li key={choice.id}>
                      <button onClick={() => onStartFlow(flow.id, choice.id)} type="button">
                        {t(choice.nameKey)}
                      </button>
                      {choice.descriptionKey && <span> {t(choice.descriptionKey)}</span>}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <button onClick={() => onStartFlow(flow.id)} type="button">
                {t('home.start')}
              </button>
            )}
            {flow.assignedVariantId && <small> {t('home.assignedVariant', { variant: flow.assignedVariantId })}</small>}
          </li>
        ))}
      </ul>
      <button onClick={onStartNewSession} type="button">
        {t('home.newSession')}
      </button>
    </section>
  )
}
