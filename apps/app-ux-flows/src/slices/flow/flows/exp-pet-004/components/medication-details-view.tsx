import { useAtomValue } from 'jotai'
import { Capsule } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { SubScreenTopBar } from '../../../pods/ginger/components/sub-screen-top-bar'
import { toMedicationSummary } from '../../../pods/ginger/medication-fields'
import { medicationAtom } from '../../../pods/ginger/model'
import { useFlowAnalytics, useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import type { ExpPet004Components, ExpPet004Events, ExpPet004ScreenId } from '../model'
import { MedicationFormFields } from './medication-form-fields'

// The same in every variant: each field is edited in place from its own pencil.
export const MedicationDetailsView = () => {
  const { t, i18n } = useTranslation()
  const { FormCard, PodScreen } = useFlowComponents<ExpPet004Components>()
  const { goToScreen } = useFlowNavigation<ExpPet004ScreenId>()
  const { track } = useFlowAnalytics<ExpPet004Events>()
  const medication = useAtomValue(medicationAtom)

  return (
    <PodScreen
      topBar={
        <SubScreenTopBar
          onMenu={() => track('pod_menu_selected', { screen: 'medication' })}
          title={toMedicationSummary(medication, t, i18n.language).name}
          trail={[t('flows.expPet004.medical.title')]}
        />
      }
    >
      <FormCard icon={Capsule} title={t('pods.ginger.medication.formTitle')}>
        <MedicationFormFields entryPoint="details_edit" onScheduleSaved={() => goToScreen('medication-updated')} />
      </FormCard>
    </PodScreen>
  )
}
