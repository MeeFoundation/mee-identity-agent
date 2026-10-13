import { useAtomValue } from 'jotai'

import { GingerHomeView } from '../../../pods/ginger/components/ginger-home-view'
import { useFlowAnalytics, useFlowNavigation } from '../../../runtime/flow-context'
import { type ExpPet003Events, type ExpPet003ScreenId, podOpensOnAtom } from '../model'

export const HomeScreen = () => {
  const { goToScreen } = useFlowNavigation<ExpPet003ScreenId>()
  const { track } = useFlowAnalytics<ExpPet003Events>()
  const podOpensOn = useAtomValue(podOpensOnAtom)

  const openPod = () => {
    track('pod_opened', { tab: podOpensOn })
    goToScreen(podOpensOn === 'notes' ? 'ginger-notes' : 'ginger-info')
  }

  return <GingerHomeView onAppTabSelect={(tab) => track('app_tab_selected', { tab })} onOpenPod={openPod} />
}
