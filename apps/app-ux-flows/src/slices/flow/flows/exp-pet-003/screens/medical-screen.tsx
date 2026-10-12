import { useTranslation } from 'react-i18next'

import { useFlowAnalytics, useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { AddMedicationAction } from '../components/add-medication-action'
import { MedicationRow } from '../components/medication-row'
import { SubScreenTopBar } from '../components/sub-screen-top-bar'
import type { ExpPet003Components, ExpPet003Events, ExpPet003ScreenId } from '../model'

export const MedicalScreen = () => {
  const { t } = useTranslation()
  const { PodScreen, SectionLabel } = useFlowComponents<ExpPet003Components>()
  const { goToScreen } = useFlowNavigation<ExpPet003ScreenId>()
  const { track } = useFlowAnalytics<ExpPet003Events>()

  const openMedication = () => {
    track('medication_opened', { entry_point: 'medical_screen' })
    goToScreen('medication')
  }

  return (
    <PodScreen topBar={<SubScreenTopBar title={t('flows.expPet003.medical.title')} />}>
      <section className="flex flex-col gap-3">
        <SectionLabel>{t('flows.expPet003.medical.medications')}</SectionLabel>
        <MedicationRow onOpen={openMedication} />
        <AddMedicationAction entryPoint="medical_screen" />
      </section>
    </PodScreen>
  )
}
