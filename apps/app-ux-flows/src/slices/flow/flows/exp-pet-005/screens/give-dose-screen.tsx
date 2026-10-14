import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'

import { GiveDoseSheet } from '../../../pods/ginger/components/dose-sheets'
import { useDoseSheet } from '../../../pods/ginger/components/use-dose-sheet'
import { giveDoseAtom, type MedicationDose, medicationDoseAtom } from '../../../pods/ginger/model'
import { useFlowAnalytics, useFlowNavigation } from '../../../runtime/flow-context'
import { OriginView } from '../components/origin-view'
import { doseOriginAtom, type ExpPet005Events, type ExpPet005ScreenId, toastAtom, toEntryPoint } from '../model'

const isGiven = (dose: MedicationDose) => dose.status === 'given'

export const GiveDoseScreen = () => {
  const { back, complete, goToScreen } = useFlowNavigation<ExpPet005ScreenId>()
  const { track } = useFlowAnalytics<ExpPet005Events>()
  const origin = useAtomValue(doseOriginAtom)
  const dose = useAtomValue(medicationDoseAtom)
  const giveDose = useSetAtom(giveDoseAtom)
  const setToast = useSetAtom(toastAtom)
  const entryPoint = toEntryPoint(origin)
  const { settle } = useDoseSheet({
    isSpent: isGiven,
    recordCancel: useCallback(
      () => track('medication_give_cancelled', { entry_point: entryPoint }),
      [track, entryPoint],
    ),
  })

  if (isGiven(dose)) return <OriginView origin={origin} />

  const confirm = () => {
    settle()
    track('medication_give_confirmed', { entry_point: entryPoint })
    giveDose(new Date())
    setToast({ kind: 'given', screen: origin })
    goToScreen(origin)
    complete({ showCompletionView: false })
  }

  const cancel = () => {
    settle()
    track('medication_give_cancelled', { entry_point: entryPoint })
    back()
  }

  return (
    <>
      <OriginView origin={origin} />
      <GiveDoseSheet onCancel={cancel} onConfirm={confirm} />
    </>
  )
}
