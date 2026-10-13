import { GingerTopBar } from '../../../pods/ginger/components/ginger-top-bar'
import type { PodTab } from '../../../pods/ginger/model'
import { useFlowAnalytics, useFlowNavigation } from '../../../runtime/flow-context'
import type { ExpPet003Events, ExpPet003ScreenId } from '../model'

type ExpPet003TopBarProps = {
  tab: Exclude<PodTab, 'chat'>
}

export const ExpPet003TopBar = ({ tab }: ExpPet003TopBarProps) => {
  const { goToScreen } = useFlowNavigation<ExpPet003ScreenId>()
  const { track } = useFlowAnalytics<ExpPet003Events>()

  const selectTab = (next: PodTab) => {
    track('pod_tab_selected', { tab: next })
    if (next === 'notes') goToScreen('ginger-notes')
    if (next === 'info') goToScreen('ginger-info')
  }

  // Home, not history: a direct link to a Ginger tab still has somewhere to go back to.
  return <GingerTopBar onBack={() => goToScreen('home')} onTabSelect={selectTab} tab={tab} />
}
