import { GingerTopBar } from '../../../pods/ginger/components/ginger-top-bar'
import type { PodTab } from '../../../pods/ginger/model'
import { useFlowAnalytics, useFlowNavigation } from '../../../runtime/flow-context'
import type { ExpPet004Events, ExpPet004ScreenId } from '../model'

type ExpPet004TopBarProps = {
  tab: Exclude<PodTab, 'chat'>
}

export const ExpPet004TopBar = ({ tab }: ExpPet004TopBarProps) => {
  const { goToScreen } = useFlowNavigation<ExpPet004ScreenId>()
  const { track } = useFlowAnalytics<ExpPet004Events>()

  const selectTab = (next: PodTab) => {
    track('pod_tab_selected', { tab: next })
    if (next === 'notes') goToScreen('ginger-notes')
    if (next === 'info') goToScreen('ginger-info')
  }

  return (
    <GingerTopBar
      onBack={() => goToScreen('home')}
      onMenu={() => track('pod_menu_selected', { screen: tab === 'notes' ? 'ginger-notes' : 'ginger-info' })}
      onTabSelect={selectTab}
      tab={tab}
    />
  )
}
