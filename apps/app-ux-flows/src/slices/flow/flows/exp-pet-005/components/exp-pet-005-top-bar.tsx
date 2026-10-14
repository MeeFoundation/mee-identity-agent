import { GingerTopBar } from '../../../pods/ginger/components/ginger-top-bar'
import type { PodTab } from '../../../pods/ginger/model'
import { useFlowAnalytics, useFlowNavigation } from '../../../runtime/flow-context'
import type { ExpPet005Events, ExpPet005ScreenId } from '../model'

type ExpPet005TopBarProps = {
  tab: Exclude<PodTab, 'chat'>
}

export const ExpPet005TopBar = ({ tab }: ExpPet005TopBarProps) => {
  const { goToScreen } = useFlowNavigation<ExpPet005ScreenId>()
  const { track } = useFlowAnalytics<ExpPet005Events>()

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
