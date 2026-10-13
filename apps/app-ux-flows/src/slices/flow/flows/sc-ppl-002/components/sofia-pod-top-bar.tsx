import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { useFlowComponents } from '../../../runtime/flow-context'
import type { ScPpl002Components } from '../model'

const noop = () => {}

type PodTab = 'notes' | 'chat' | 'info'

type SofiaPodTopBarProps = {
  subtitle: ReactNode
  // With it the pod's tabs are shown and this one is selected; only Info exists in this showcase.
  tab?: 'info'
  onBack?: () => void
}

export const SofiaPodTopBar = ({ subtitle, tab, onBack = noop }: SofiaPodTopBarProps) => {
  const { t } = useTranslation()
  const { PodTopBar, SegmentedTabs } = useFlowComponents<ScPpl002Components>()

  return (
    <PodTopBar
      avatar={{ letter: t('flows.scPpl002.pod.avatar') }}
      onBack={onBack}
      onMenu={noop}
      subtitle={subtitle}
      tabs={
        tab && (
          <SegmentedTabs<PodTab>
            items={[
              { label: t('pods.ginger.tabs.notes'), value: 'notes' },
              { label: t('pods.ginger.tabs.chat'), value: 'chat' },
              { label: t('pods.ginger.tabs.info'), value: 'info' },
            ]}
            onSelect={noop}
            value={tab}
          />
        )
      }
      title={t('flows.scPpl002.pod.title')}
    />
  )
}

export const MembersSubtitle = ({ count }: { count: number }) => {
  const { t } = useTranslation()
  const { CountBadge } = useFlowComponents<ScPpl002Components>()

  return (
    <>
      <span>{t('flows.scPpl002.pod.members')}</span>
      <CountBadge count={count} />
    </>
  )
}
