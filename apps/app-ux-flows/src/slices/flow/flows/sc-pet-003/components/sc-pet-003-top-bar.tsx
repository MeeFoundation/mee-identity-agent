import { GingerTopBar } from '../../../pods/ginger/components/ginger-top-bar'
import type { PodTab } from '../../../pods/ginger/model'
import { useFlowNavigation } from '../../../runtime/flow-context'
import type { ScPet003ScreenId } from '../model'

type ScPet003TopBarProps = {
  tab: Exclude<PodTab, 'notes'>
}

// Info and Chat switch tabs; Notes, back, the breadcrumb and the menu do nothing.
export const ScPet003TopBar = ({ tab }: ScPet003TopBarProps) => {
  const { goToScreen } = useFlowNavigation<ScPet003ScreenId>()

  const selectTab = (next: PodTab) => {
    if (next !== 'notes' && next !== tab) goToScreen(next)
  }

  return <GingerTopBar onTabSelect={selectTab} tab={tab} />
}
