import { useTranslation } from 'react-i18next'

import { resolveBlockComponent } from './component-registry'
import type { Flow, FlowComponentRuntimeProps, FlowInstance } from './model'
import { useFlowActions } from './runtime'

type FlowPageProps = {
  flow: Flow
  instance: FlowInstance
  screenId: string
  navigateToScreen: (screenId: string) => void
}

export const FlowPage = ({ flow, instance, screenId, navigateToScreen }: FlowPageProps) => {
  const { t } = useTranslation()
  const actions = useFlowActions(flow)

  if (instance.status === 'completed') {
    const restart = () => navigateToScreen(actions.restart().currentScreenId)

    return (
      <section>
        <h1>{t('flow.completion.title')}</h1>
        <p>{t('flow.completion.body', { title: t(flow.titleKey) })}</p>
        <button onClick={restart} type="button">
          {t('flow.completion.restart')}
        </button>{' '}
        <a href="/">{t('flow.completion.allFlows')}</a>
      </section>
    )
  }

  const screen = flow.screens.find(({ id }) => id === screenId)
  if (!screen) return null

  const runtime: FlowComponentRuntimeProps = {
    completeScreen: () => navigateToScreen(actions.advance().currentScreenId),
    data: instance.data,
    setValue: actions.setValue,
  }

  return (
    <section>
      <h1>{t(flow.titleKey)}</h1>
      {screen.blocks.map((block) => {
        const Component = resolveBlockComponent(block)
        return <Component key={block.id} {...runtime} {...block.props} />
      })}
    </section>
  )
}
