import { useAtomValue, useSetAtom } from 'jotai'

import { GiveDoseSheet } from '../../../pods/ginger/components/dose-sheets'
import { useDoseSheet } from '../../../pods/ginger/components/use-dose-sheet'
import { giveDoseAtom, type MedicationDose, medicationDoseAtom } from '../../../pods/ginger/model'
import { useFlowNavigation } from '../../../runtime/flow-context'
import { MedicalView } from '../components/medical-view'
import { type ScPet002ScreenId, toastAtom } from '../model'

const isGiven = (dose: MedicationDose) => dose.status === 'given'

export const GiveDoseScreen = () => {
  const { back, complete, goToScreen } = useFlowNavigation<ScPet002ScreenId>()
  const dose = useAtomValue(medicationDoseAtom)
  const giveDose = useSetAtom(giveDoseAtom)
  const setToast = useSetAtom(toastAtom)
  const { settle } = useDoseSheet({ isSpent: isGiven })

  if (isGiven(dose)) return <MedicalView />

  const confirm = () => {
    settle()
    giveDose(new Date())
    setToast('given')
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
      <GiveDoseSheet onCancel={cancel} onConfirm={confirm} />
    </>
  )
}
