import { useSetAtom } from 'jotai'

import { doseHistoryFilterAtom } from '../../../pods/ginger/model'
import { useFlowAnalytics, useFlowNavigation } from '../../../runtime/flow-context'
import type { ExpPet005Events, ExpPet005ScreenId, HistorySource } from '../model'

// Opens the dose history on one medication, or on all of them, keeping the period already chosen.
export const useOpenHistory = () => {
  const { goToScreen } = useFlowNavigation<ExpPet005ScreenId>()
  const { track } = useFlowAnalytics<ExpPet005Events>()
  const setFilter = useSetAtom(doseHistoryFilterAtom)

  return (source: HistorySource, medicationId: 'all' | string) => {
    track('dose_history_opened', { source })
    setFilter((filter) => ({ ...filter, medicationId }))
    goToScreen('dose-history')
  }
}
