import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'

import { DueDoseCard } from '../../../pods/ginger/components/due-dose-card'
import { MedicalDoseView } from '../../../pods/ginger/components/medical-dose-view'
import { toMedicationSummary } from '../../../pods/ginger/medication-fields'
import { CURRENT_MEDICATION_ID, doseHistoryFilterAtom, medicationAtom } from '../../../pods/ginger/model'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { type ScPet002Components, type ScPet002ScreenId, toastAtom } from '../model'

const noop = () => {}

type ViewProps = {
  // Off while a confirmation sheet is shown over this view.
  showToast?: boolean
}

const DoseToast = () => {
  const { t, i18n } = useTranslation()
  const { Toast } = useFlowComponents<ScPet002Components>()
  const [toast, setToast] = useAtom(toastAtom)
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

// Medical is the only place this showcase shows the dose; the medication list and menu are inert.
export const MedicalView = ({ showToast = false }: ViewProps) => {
  const { goToScreen } = useFlowNavigation<ScPet002ScreenId>()
  const setFilter = useSetAtom(doseHistoryFilterAtom)
  const setToast = useSetAtom(toastAtom)

  // The toast belongs to the moment after a sheet; leaving Medical dismisses it.
  const leaveTo = (screen: Exclude<ScPet002ScreenId, 'medical'>) => {
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
          onGive={() => leaveTo('give-dose')}
          onHistory={() => openHistory(CURRENT_MEDICATION_ID)}
          onUndo={() => leaveTo('undo-dose')}
        />
      }
      notice={showToast && <DoseToast />}
      onAddMedication={noop}
      onMenu={noop}
      onOpenHistory={() => openHistory('all')}
      onOpenMedication={noop}
    />
  )
}
