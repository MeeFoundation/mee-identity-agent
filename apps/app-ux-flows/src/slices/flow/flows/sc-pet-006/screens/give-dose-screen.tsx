import { useAtomValue, useSetAtom } from 'jotai'

import { GiveDoseSheet } from '../../../pods/ginger/components/dose-sheets'
import { useDoseSheet } from '../../../pods/ginger/components/use-dose-sheet'
import { giveDoseAtom, type MedicationDose, medicationDoseAtom } from '../../../pods/ginger/model'
import { canLogDoses } from '../../../pods/people/sharing'
import { useFlowNavigation } from '../../../runtime/flow-context'
import { MedicalView } from '../components/medical-view'
import { accessAtom, doseToastAtom, goalAtom, type ScPet006ScreenId } from '../model'

const isGiven = (dose: MedicationDose) => dose.status === 'given'

export const GiveDoseScreen = () => {
  const { back, complete, goToScreen } = useFlowNavigation<ScPet006ScreenId>()
  const dose = useAtomValue(medicationDoseAtom)
  const access = useAtomValue(accessAtom)
  const goal = useAtomValue(goalAtom)
  const giveDose = useSetAtom(giveDoseAtom)
  const setToast = useSetAtom(doseToastAtom)
  const { settle } = useDoseSheet({ isSpent: isGiven })

  // Someone who can only read never gets the sheet, even from a direct link.
  if (isGiven(dose) || !canLogDoses(access)) return <MedicalView />

  const confirm = () => {
    settle()
    giveDose(new Date())
    setToast('given')
    goToScreen('medical')
    if (goal === 'dose') complete({ showCompletionView: false })
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
