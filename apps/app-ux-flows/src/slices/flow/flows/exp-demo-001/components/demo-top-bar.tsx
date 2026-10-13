import { GingerTopBar } from '../../../pods/ginger/components/ginger-top-bar'
import type { PodTab } from '../../../pods/ginger/model'
import { useFlowNavigation } from '../../../runtime/flow-context'
import type { ExpDemo001ScreenId } from '../model'

type DemoTopBarProps = {
  tab: PodTab
}

export const DemoTopBar = ({ tab }: DemoTopBarProps) => {
  const { goToScreen } = useFlowNavigation<ExpDemo001ScreenId>()

  const selectTab = (next: PodTab) => {
    if (next === 'notes') goToScreen('ginger-notes')
    if (next === 'info') goToScreen('ginger-info')
  }

  return <GingerTopBar onTabSelect={selectTab} tab={tab} />
}
