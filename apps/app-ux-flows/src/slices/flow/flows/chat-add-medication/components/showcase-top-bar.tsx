import { GingerTopBar } from '../../../pods/ginger/components/ginger-top-bar'
import type { PodTab } from '../../../pods/ginger/model'
import { useFlowNavigation } from '../../../runtime/flow-context'
import type { ChatAddMedicationScreenId } from '../model'

const screenByTab: Record<PodTab, ChatAddMedicationScreenId> = {
  chat: 'chat',
  info: 'ginger-info',
  notes: 'ginger-notes',
}

type ShowcaseTopBarProps = {
  tab: PodTab
}

export const ShowcaseTopBar = ({ tab }: ShowcaseTopBarProps) => {
  const { goToScreen } = useFlowNavigation<ChatAddMedicationScreenId>()

  return <GingerTopBar onTabSelect={(next) => goToScreen(screenByTab[next])} tab={tab} />
}
