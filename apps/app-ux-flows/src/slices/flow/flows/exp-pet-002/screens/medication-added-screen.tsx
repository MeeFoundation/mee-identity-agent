import { useSetAtom } from 'jotai'
import { useLayoutEffect } from 'react'

import { PodInfoView } from '../components/pod-info-view'
import { addMedicationFormAtom } from '../model'

export const MedicationAddedScreen = () => {
  const addMedicationForm = useSetAtom(addMedicationFormAtom)

  // Opening this screen directly by URL also counts as the form having been added.
  useLayoutEffect(() => {
    addMedicationForm()
  }, [addMedicationForm])

  return <PodInfoView medicationFormAdded />
}
