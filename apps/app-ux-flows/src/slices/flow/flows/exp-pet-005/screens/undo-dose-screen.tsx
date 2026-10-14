import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'

import { UndoDoseSheet } from '../../../pods/ginger/components/dose-sheets'
import { useDoseSheet } from '../../../pods/ginger/components/use-dose-sheet'
import { type MedicationDose, medicationDoseAtom, undoDoseAtom } from '../../../pods/ginger/model'
import { useFlowAnalytics, useFlowNavigation } from '../../../runtime/flow-context'
import { OriginView } from '../components/origin-view'
import { doseOriginAtom, type ExpPet005Events, type ExpPet005ScreenId, toastAtom, toEntryPoint } from '../model'

const isNotGiven = (dose: MedicationDose) => dose.status !== 'given'

// Reverts a dose marked as given by mistake. The run stays completed: a later give does not complete it again.
export const UndoDoseScreen = () => {
  const { back, goToScreen } = useFlowNavigation<ExpPet005ScreenId>()
  const { track } = useFlowAnalytics<ExpPet005Events>()
  const origin = useAtomValue(doseOriginAtom)
  const dose = useAtomValue(medicationDoseAtom)
  const undoDose = useSetAtom(undoDoseAtom)
  const setToast = useSetAtom(toastAtom)
  const entryPoint = toEntryPoint(origin)
  const { settle } = useDoseSheet({
    isSpent: isNotGiven,
    recordCancel: useCallback(
      () => track('medication_undo_cancelled', { entry_point: entryPoint }),
      [track, entryPoint],
    ),
  })

  if (isNotGiven(dose)) return <OriginView origin={origin} />

  const confirm = () => {
    settle()
    track('medication_undo_confirmed', { entry_point: entryPoint })
    undoDose()
    setToast({ kind: 'undone', screen: origin })
    goToScreen(origin)
  }

  const cancel = () => {
    settle()
    track('medication_undo_cancelled', { entry_point: entryPoint })
    back()
  }

  return (
    <>
      <OriginView origin={origin} />
      <UndoDoseSheet onCancel={cancel} onConfirm={confirm} />
    </>
  )
}
