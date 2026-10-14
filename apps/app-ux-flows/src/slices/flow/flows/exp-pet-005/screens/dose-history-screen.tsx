import { DoseHistoryView } from '../../../pods/ginger/components/dose-history-view'
import type { HistoryFilter } from '../../../pods/ginger/dose-history'
import { CURRENT_MEDICATION_ID } from '../../../pods/ginger/model'
import { useFlowAnalytics } from '../../../runtime/flow-context'
import type { ExpPet005Events } from '../model'

const medicationKind = (medicationId: HistoryFilter['medicationId']) =>
  medicationId === 'all' ? 'all' : medicationId === CURRENT_MEDICATION_ID ? 'current' : 'past'

export const DoseHistoryScreen = () => {
  const { track } = useFlowAnalytics<ExpPet005Events>()

  return (
    <DoseHistoryView
      onFilter={(next) =>
        track('dose_history_filtered', { medication: medicationKind(next.medicationId), period: next.period })
      }
      onMenu={() => track('pod_menu_selected', { screen: 'dose-history' })}
      onMoreShown={(shown) => track('dose_history_more_shown', { shown })}
    />
  )
}
