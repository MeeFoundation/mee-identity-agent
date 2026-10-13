import { useAtomValue, useSetAtom } from 'jotai'

import { UndoDoseSheet } from '../../../pods/ginger/components/dose-sheets'
import { useDoseSheet } from '../../../pods/ginger/components/use-dose-sheet'
import { type MedicationDose, medicationDoseAtom, undoDoseAtom } from '../../../pods/ginger/model'
import { useFlowNavigation } from '../../../runtime/flow-context'
import { MedicalView } from '../components/medical-view'
import { type ScPet002ScreenId, toastAtom } from '../model'

const isNotGiven = (dose: MedicationDose) => dose.status !== 'given'

export const UndoDoseScreen = () => {
  const { back, complete, goToScreen } = useFlowNavigation<ScPet002ScreenId>()
  const dose = useAtomValue(medicationDoseAtom)
  const undoDose = useSetAtom(undoDoseAtom)
  const setToast = useSetAtom(toastAtom)
  const { settle } = useDoseSheet({ isSpent: isNotGiven })

  if (isNotGiven(dose)) return <MedicalView />

  const confirm = () => {
    settle()
    undoDose()
    setToast('undone')
    goToScreen('medical')
    complete({ showCompletionView: false })
  }

  const cancel = () => {
    settle()
    back()
  }

  return (
    <>
      <MedicalView />
      <UndoDoseSheet onCancel={cancel} onConfirm={confirm} />
    </>
  )
}
