import { useAtomValue } from 'jotai'
import { Hearts } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { type ExpPet002Components, type ExpPet002ScreenId, podAtom } from '../model'

type PodTab = 'notes' | 'chat' | 'info'

const noop = () => {}

type GingerTopBarProps = {
  tab: PodTab
}

export const GingerTopBar = ({ tab }: GingerTopBarProps) => {
  const { t } = useTranslation()
  const { PodTopBar, SegmentedTabs } = useFlowComponents<ExpPet002Components>()
  const { goToScreen } = useFlowNavigation<ExpPet002ScreenId>()
  const pod = useAtomValue(podAtom)

  const selectTab = (next: PodTab) => {
    if (next === 'notes') goToScreen('ginger-notes')
    if (next === 'info') goToScreen('ginger-info')
  }

  return (
    <PodTopBar
      avatarSrc={pod.avatarSrc}
      breadcrumb={pod.breadcrumb}
      breadcrumbIcon={Hearts}
      onBack={noop}
      onMenu={noop}
      tabs={
        <SegmentedTabs<PodTab>
          items={[
            { label: t('flows.expPet002.tabs.notes'), value: 'notes' },
            { label: t('flows.expPet002.tabs.chat'), value: 'chat' },
            { label: t('flows.expPet002.tabs.info'), value: 'info' },
          ]}
          onSelect={selectTab}
          value={tab}
        />
      }
      title={pod.name}
    />
  )
}
