import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'

import type { PodInstance } from '../../../pods/catalog/create-pod'
import { categoryIcon } from '../../../pods/category-icons'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { infoHasDotAtom, podInfoScreenAtom, type ScPet001Components, type ScPet001ScreenId } from '../model'

const noop = () => {}

type PodTab = 'notes' | 'chat' | 'info'

type PodHeaderProps = {
  pod: PodInstance
  tab: Exclude<PodTab, 'chat'>
}

export const PodHeader = ({ pod, tab }: PodHeaderProps) => {
  const { t } = useTranslation()
  const { PodTopBar, SegmentedTabs } = useFlowComponents<ScPet001Components>()
  const { goToScreen } = useFlowNavigation<ScPet001ScreenId>()
  const infoScreen = useAtomValue(podInfoScreenAtom)
  const infoHasDot = useAtomValue(infoHasDotAtom)

  const selectTab = (next: PodTab) => {
    if (next === tab) return
    if (next === 'notes') goToScreen('pod-notes')
    if (next === 'info') goToScreen(infoScreen)
  }

  return (
    <PodTopBar
      avatar={{ letter: pod.avatarLetter }}
      breadcrumb={pod.breadcrumb}
      breadcrumbIcon={pod.category ? categoryIcon(pod.category) : undefined}
      // Home, not history: going back in history would reopen the New Pod sheet the pod came from.
      onBack={() => goToScreen('home')}
      onMenu={noop}
      tabs={
        <SegmentedTabs<PodTab>
          items={[
            { label: t('flows.scPet001.pod.tabs.notes'), value: 'notes' },
            { label: t('flows.scPet001.pod.tabs.chat'), value: 'chat' },
            { dot: tab === 'notes' && infoHasDot, label: t('flows.scPet001.pod.tabs.info'), value: 'info' },
          ]}
          onSelect={selectTab}
          value={tab}
        />
      }
      title={pod.name}
    />
  )
}
