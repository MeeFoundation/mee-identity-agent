import { GingerTopBar } from '../../../pods/ginger/components/ginger-top-bar'
import type { PodTab } from '../../../pods/ginger/model'
import { useFlowAnalytics, useFlowNavigation } from '../../../runtime/flow-context'
import type { ExpPet002Events, ExpPet002ScreenId } from '../model'

type ExpPet002TopBarProps = {
  tab: PodTab
}

export const ExpPet002TopBar = ({ tab }: ExpPet002TopBarProps) => {
  const { goToScreen } = useFlowNavigation<ExpPet002ScreenId>()
  const { track } = useFlowAnalytics<ExpPet002Events>()

  const selectTab = (next: PodTab) => {
    track('pod_tab_selected', { tab: next })
    if (next === 'notes') goToScreen('ginger-notes')
    if (next === 'info') goToScreen('ginger-info')
  }

  return <GingerTopBar onTabSelect={selectTab} tab={tab} />
}
