import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'

import { DueDoseCard } from '../../../pods/ginger/components/due-dose-card'
import { MedicalDoseView } from '../../../pods/ginger/components/medical-dose-view'
import { toMedicationSummary } from '../../../pods/ginger/medication-fields'
import { CURRENT_MEDICATION_ID, doseHistoryFilterAtom, medicationAtom } from '../../../pods/ginger/model'
import { canLogDoses } from '../../../pods/people/sharing'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { accessAtom, doseToastAtom, type ScPet006Components, type ScPet006ScreenId } from '../model'

const noop = () => {}

type ViewProps = {
  // Off while a confirmation sheet is shown over this view.
  showToast?: boolean
}

const DoseToast = () => {
  const { t, i18n } = useTranslation()
  const { Toast } = useFlowComponents<ScPet006Components>()
  const [toast, setToast] = useAtom(doseToastAtom)
  const medication = useAtomValue(medicationAtom)

  if (!toast) return null

  return (
    <Toast
      onClose={() => setToast(null)}
      title={t(`pods.ginger.dose.toast.${toast}`, { name: toMedicationSummary(medication, t, i18n.language).name })}
      variant={toast === 'given' ? 'success' : 'primary'}
    />
  )
}

// Medical as the member's access allows: giving a dose needs "Can log doses", and nobody here can add medication.
export const MedicalView = ({ showToast = false }: ViewProps) => {
  const { goToScreen } = useFlowNavigation<ScPet006ScreenId>()
  const access = useAtomValue(accessAtom)
  const setFilter = useSetAtom(doseHistoryFilterAtom)
  const setToast = useSetAtom(doseToastAtom)
  const mayLog = canLogDoses(access)

  // The toast belongs to the moment after a sheet; leaving Medical dismisses it.
  const leaveTo = (screen: Exclude<ScPet006ScreenId, 'medical'>) => {
    setToast(null)
    goToScreen(screen)
  }

  const openHistory = (medicationId: 'all' | string) => {
    setFilter((filter) => ({ ...filter, medicationId }))
    leaveTo('dose-history')
  }

  return (
    <MedicalDoseView
      doseCard={
        <DueDoseCard
          onGive={mayLog ? () => leaveTo('give-dose') : undefined}
          onHistory={() => openHistory(CURRENT_MEDICATION_ID)}
        />
      }
      notice={showToast && <DoseToast />}
      onMenu={noop}
      onOpenHistory={() => openHistory('all')}
      onOpenMedication={noop}
    />
  )
}
