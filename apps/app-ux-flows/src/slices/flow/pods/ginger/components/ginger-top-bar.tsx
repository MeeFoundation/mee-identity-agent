import { useAtomValue } from 'jotai'
import { Hearts } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { useFlowComponents } from '../../../runtime/flow-context'
import { type GingerPodComponents, type PodTab, podAtom } from '../model'

const noop = () => {}

type GingerTopBarProps = {
  tab: PodTab
  // Each flow decides what a tab does and what it records.
  onTabSelect: (tab: PodTab) => void
  // Without it the back control does nothing.
  onBack?: () => void
}

export const GingerTopBar = ({ tab, onTabSelect, onBack = noop }: GingerTopBarProps) => {
  const { t } = useTranslation()
  const { PodTopBar, SegmentedTabs } = useFlowComponents<GingerPodComponents>()
  const pod = useAtomValue(podAtom)

  return (
    <PodTopBar
      avatar={{ src: pod.avatarSrc }}
      breadcrumb={pod.breadcrumb}
      breadcrumbIcon={Hearts}
      onBack={onBack}
      onMenu={noop}
      tabs={
        <SegmentedTabs<PodTab>
          items={[
            { label: t('pods.ginger.tabs.notes'), value: 'notes' },
            { label: t('pods.ginger.tabs.chat'), value: 'chat' },
            { label: t('pods.ginger.tabs.info'), value: 'info' },
          ]}
          onSelect={onTabSelect}
          value={tab}
        />
      }
      title={pod.name}
    />
  )
}
