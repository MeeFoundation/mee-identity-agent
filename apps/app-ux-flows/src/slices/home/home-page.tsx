import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui/button'

import { FlowCard, type FlowLauncher } from './flow-card'
import { groupFlowsByKind } from './group-flows'

const sectionTitleKeys = {
  experiment: 'home.sections.experiments',
  showcase: 'home.sections.showcases',
} as const

type HomePageProps = {
  flows: readonly FlowLauncher[]
  onStartFlow: (flowId: string, variantId?: string) => void
  onStartNewSession: () => void
  screenHref: (flowId: string, screenId: string, variantId: string | null) => string
  onOpenScreen: (href: string) => void
}

export const HomePage = ({ flows, onStartFlow, onStartNewSession, screenHref, onOpenScreen }: HomePageProps) => {
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
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-8">
        {groupFlowsByKind(flows).map((section) => (
          <section aria-labelledby={`flows-${section.kind}`} className="flex flex-col gap-4" key={section.kind}>
            <h2 className="font-semibold text-gray-900 text-xl" id={`flows-${section.kind}`}>
              {t(sectionTitleKeys[section.kind])}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.flows.map((flow) => (
                <FlowCard
                  flow={flow}
                  key={flow.id}
                  onOpenScreen={onOpenScreen}
                  onStartFlow={onStartFlow}
                  screenHref={screenHref}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}
