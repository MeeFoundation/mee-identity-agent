import { useSetAtom } from 'jotai'
import { useLayoutEffect } from 'react'

import { useFlowNavigation } from '../../../runtime/flow-context'
import { PodInfoView } from '../components/pod-info-view'
import { addMedicationFormAtom } from '../model'

export const MedicationAddedScreen = () => {
  const addMedicationForm = useSetAtom(addMedicationFormAtom)
  const { complete } = useFlowNavigation()

  // Opening this screen directly by URL also counts as the form having been added, and completes the run in place.
  useLayoutEffect(() => {
    addMedicationForm()
    complete({ showCompletionView: false })
  }, [addMedicationForm, complete])

  return <PodInfoView medicationFormAdded />
}
