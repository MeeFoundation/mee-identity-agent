import { GingerHomeView } from '../../../pods/ginger/components/ginger-home-view'
import { useFlowAnalytics, useFlowNavigation } from '../../../runtime/flow-context'
import type { ExpPet004Events, ExpPet004ScreenId } from '../model'

export const HomeScreen = () => {
  const { goToScreen } = useFlowNavigation<ExpPet004ScreenId>()
  const { track } = useFlowAnalytics<ExpPet004Events>()

  const openPod = () => {
    track('pod_opened')
    goToScreen('ginger-notes')
  }

  return (
    <GingerHomeView
      onAppTabSelect={(tab) => track('app_tab_selected', { tab })}
      onOpenPod={openPod}
      onSearchSelect={() => track('search_selected')}
    />
  )
}
