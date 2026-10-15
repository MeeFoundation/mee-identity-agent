import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui/button'

import type { ScreenHref } from './flow-catalogue'
import { type FlowLauncher, FlowRow, type FlowStartChoice } from './flow-row'
import { groupFlowsByKind } from './group-flows'

const sectionTitleKeys = {
  experiment: 'home.sections.experiments',
  showcase: 'home.sections.showcases',
} as const

type HomePageProps = {
  flows: readonly FlowLauncher[]
  onStartFlow: (flowId: string, choice?: FlowStartChoice) => void
  onStartNewSession: () => void
  screenHref: ScreenHref
  onOpenScreen: (href: string) => void
  // Shown when dev mode was turned on through the URL, so reviewers can tell and leave it.
  devModeNote: boolean
  onTurnOffDevMode: () => void
}

export const HomePage = ({
  flows,
  onStartFlow,
  onStartNewSession,
  screenHref,
  onOpenScreen,
  devModeNote,
  onTurnOffDevMode,
}: HomePageProps) => {
  const { t } = useTranslation()

  return (
    <main className="min-h-dvh bg-gray-50">
      <header className="border-gray-200 border-b bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <h1 className="font-semibold text-2xl text-gray-900">{t('home.title')}</h1>
          <div className="flex flex-wrap items-center gap-4">
            {devModeNote && (
              <p className="flex items-center gap-2 text-muted-foreground text-sm">
                {t('home.devMode.label')}
                <Button onClick={onTurnOffDevMode} size="s" tone="tertiary" variant="link">
                  {t('home.devMode.turnOff')}
                </Button>
              </p>
            )}
            <Button onClick={onStartNewSession} tone="tertiary" variant="outlined">
              {t('home.newSession')}
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6">
        {groupFlowsByKind(flows).map((section) => (
          <section aria-labelledby={`flows-${section.kind}`} className="flex flex-col gap-3" key={section.kind}>
            <h2 className="font-semibold text-gray-900 text-lg" id={`flows-${section.kind}`}>
              {t(sectionTitleKeys[section.kind], { count: section.flows.length })}
            </h2>
            <ul className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
              {section.flows.map((flow) => (
                <FlowRow
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
