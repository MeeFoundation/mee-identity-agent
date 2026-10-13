import type { ReactNode } from 'react'
import { People } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { bogdan } from '../../../pods/people/sharing'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import type { ScPpl003Components, ScPpl003ScreenId } from '../model'

const noop = () => {}

type PodTab = Extract<ScPpl003ScreenId, 'notes' | 'chat' | 'info'>

type SharedPodTopBarProps =
  | { tab: PodTab; subtitle?: never; onBack?: never }
  // A screen inside the pod: no tabs, and the back control leads out of it.
  | { tab?: never; subtitle: ReactNode; onBack: () => void }

export const SharedPodTopBar = ({ tab, subtitle, onBack = noop }: SharedPodTopBarProps) => {
  const { t } = useTranslation()
  const { PodTopBar, SegmentedTabs } = useFlowComponents<ScPpl003Components>()
  const { goToScreen } = useFlowNavigation<ScPpl003ScreenId>()

  return (
    <PodTopBar
      avatar={{ letter: t('flows.scPpl003.pod.avatar') }}
      onBack={onBack}
      onMenu={noop}
      subtitle={
        subtitle ?? (
          <span className="flex items-center gap-1 text-brand-700">
            <People aria-hidden className="shrink-0" size={14} />
            {t('flows.scPpl003.pod.sharedBy', { name: bogdan.name })}
          </span>
        )
      }
      tabs={
        tab && (
          <SegmentedTabs<PodTab>
            items={[
              { label: t('pods.ginger.tabs.notes'), value: 'notes' },
              { label: t('pods.ginger.tabs.chat'), value: 'chat' },
              { label: t('pods.ginger.tabs.info'), value: 'info' },
            ]}
            onSelect={(next) => {
              if (next !== tab) goToScreen(next)
            }}
            value={tab}
          />
        )
      }
      title={t('flows.scPpl003.pod.title')}
    />
  )
}
