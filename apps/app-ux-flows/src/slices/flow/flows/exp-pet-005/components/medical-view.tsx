import { MedicalDoseView } from '../../../pods/ginger/components/medical-dose-view'
import { useFlowAnalytics, useFlowNavigation } from '../../../runtime/flow-context'
import type { ExpPet005Events, ExpPet005ScreenId } from '../model'
import { DoseToast } from './dose-toast'
import { FlowDoseCard } from './flow-dose-card'
import { useOpenHistory } from './use-open-history'

type ViewProps = {
  // Off while a confirmation sheet is shown over this view.
  showToast?: boolean
}

// The same in every variant: the baseline place to give the dose.
export const MedicalView = ({ showToast = false }: ViewProps) => {
  const openHistory = useOpenHistory()
  const { goToScreen } = useFlowNavigation<ExpPet005ScreenId>()
  const { track } = useFlowAnalytics<ExpPet005Events>()

  const openDetails = () => {
    track('medication_viewed')
    goToScreen('medication')
  }

  return (
    <MedicalDoseView
      doseCard={<FlowDoseCard origin="medical" />}
      notice={showToast && <DoseToast screen="medical" />}
      // Shown so the list looks as in the product; this scenario only gives a dose, so a tap is just recorded.
      onAddMedication={() => track('add_medication_selected')}
      onMenu={() => track('pod_menu_selected', { screen: 'medical' })}
      onOpenHistory={() => openHistory('medical', 'all')}
      onOpenMedication={openDetails}
    />
  )
}
