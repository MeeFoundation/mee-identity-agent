import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui/button'

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
    <main className="min-h-dvh bg-gray-50">
      <header className="border-gray-200 border-b bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <h1 className="font-semibold text-2xl text-gray-900">{t('home.title')}</h1>
          <Button onClick={onStartNewSession} tone="tertiary" variant="outlined">
            {t('home.newSession')}
          </Button>
        </div>
      </header>
      <ul className="mx-auto grid max-w-5xl gap-4 px-6 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {flows.map((flow) => (
          <li className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5" key={flow.id}>
            <h2 className="font-semibold text-gray-900 text-lg">{t(flow.titleKey)}</h2>
            {flow.variantChoices ? (
              <div className="flex flex-col gap-3">
                <p className="text-muted-foreground text-sm">{t('home.chooseVariant')}</p>
                <ul className="flex flex-col gap-3">
                  {flow.variantChoices.map((choice) => (
                    <li className="flex flex-col gap-1" key={choice.id}>
                      <Button onClick={() => onStartFlow(flow.id, choice.id)} variant="outlined">
                        {t(choice.nameKey)}
                      </Button>
                      {choice.descriptionKey && (
                        <span className="text-muted-foreground text-xs">{t(choice.descriptionKey)}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Button className="self-start" onClick={() => onStartFlow(flow.id)}>
                {t('home.start')}
              </Button>
            )}
            {flow.assignedVariantId && (
              <small className="text-muted-foreground text-xs">
                {t('home.assignedVariant', { variant: flow.assignedVariantId })}
              </small>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
