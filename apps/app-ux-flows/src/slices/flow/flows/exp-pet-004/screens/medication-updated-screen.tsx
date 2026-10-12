import { useStore } from 'jotai'
import { useLayoutEffect } from 'react'

import { useFlowNavigation } from '../../../runtime/flow-context'
import { MedicalView } from '../components/medical-view'
import { saveScheduleAtom, scheduleSavedAtom, TASK_TARGET_FREQUENCY } from '../model'

export const MedicationUpdatedScreen = () => {
  const store = useStore()
  const { complete } = useFlowNavigation()

  // Opened directly by URL nothing was saved, so the task's target schedule is applied to show the end state.
  useLayoutEffect(() => {
    if (!store.get(scheduleSavedAtom)) store.set(saveScheduleAtom, TASK_TARGET_FREQUENCY)
    complete({ showCompletionView: false })
  }, [store, complete])

  return <MedicalView confirmation />
}
