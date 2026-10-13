import { useAtom, useAtomValue } from 'jotai'
import { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { toMedicationSummary } from '../../../pods/ginger/medication-fields'
import { medicationAtom } from '../../../pods/ginger/model'
import { useFlowComponents } from '../../../runtime/flow-context'
import { type DoseOrigin, type ExpPet005Components, toastAtom } from '../model'

type DoseToastProps = {
  screen: DoseOrigin
}

// Shown on the screen the dose was given or undone from; arriving on any other screen dismisses it for good.
export const DoseToast = ({ screen }: DoseToastProps) => {
  const { t, i18n } = useTranslation()
  const { Toast } = useFlowComponents<ExpPet005Components>()
  const [toast, setToast] = useAtom(toastAtom)
  const medication = useAtomValue(medicationAtom)

  useLayoutEffect(() => {
    if (toast && toast.screen !== screen) setToast(null)
  }, [toast, screen, setToast])

  if (toast?.screen !== screen) return null

  return (
    <Toast
      onClose={() => setToast(null)}
      title={t(`pods.ginger.dose.toast.${toast.kind}`, {
        name: toMedicationSummary(medication, t, i18n.language).name,
      })}
      variant={toast.kind === 'given' ? 'success' : 'primary'}
    />
  )
}
