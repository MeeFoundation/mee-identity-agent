import { useSetAtom } from 'jotai'

import { DueDoseCard } from '../../../pods/ginger/components/due-dose-card'
import { CURRENT_MEDICATION_ID } from '../../../pods/ginger/model'
import { useFlowAnalytics, useFlowNavigation } from '../../../runtime/flow-context'
import { type DoseOrigin, doseOriginAtom, type ExpPet005Events, type ExpPet005ScreenId, toEntryPoint } from '../model'
import { useOpenHistory } from './use-open-history'

type FlowDoseCardProps = {
  // The screen showing the card, which the confirmation sheets are shown over.
  origin: DoseOrigin
  showPet?: boolean
}

export const FlowDoseCard = ({ origin, showPet }: FlowDoseCardProps) => {
  const { goToScreen } = useFlowNavigation<ExpPet005ScreenId>()
  const { track } = useFlowAnalytics<ExpPet005Events>()
  const setOrigin = useSetAtom(doseOriginAtom)
  const openHistory = useOpenHistory()

  const give = () => {
    track('medication_give_started', { entry_point: toEntryPoint(origin) })
    setOrigin(origin)
    goToScreen('give-dose')
  }

  const undo = () => {
    track('medication_undo_started', { entry_point: toEntryPoint(origin) })
    setOrigin(origin)
    goToScreen('undo-dose')
  }

  return (
    <DueDoseCard
      onGive={give}
      onHistory={() => openHistory('card', CURRENT_MEDICATION_ID)}
      onUndo={undo}
      showPet={showPet}
    />
  )
}
