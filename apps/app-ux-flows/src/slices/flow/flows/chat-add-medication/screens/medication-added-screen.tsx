import { useSetAtom } from 'jotai'
import { useLayoutEffect } from 'react'

import { addMedicationFormAtom } from '../../../pods/ginger/model'
import { useFlowNavigation } from '../../../runtime/flow-context'
import { ShowcaseInfoView } from '../components/showcase-info-view'

export const MedicationAddedScreen = () => {
  const addMedicationForm = useSetAtom(addMedicationFormAtom)
  const { complete } = useFlowNavigation()

  // Opening this screen directly by URL also counts as the form having been added, and completes the run in place.
  useLayoutEffect(() => {
    addMedicationForm()
    complete({ showCompletionView: false })
  }, [addMedicationForm, complete])

  return <ShowcaseInfoView medicationFormAdded />
}
