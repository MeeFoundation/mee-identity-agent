import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { type AddMedicationComponents, type AddMedicationScreenId, medicationsAtom, petAtom } from '../model'

export const AlternativeHomeScreen = () => {
  const { t } = useTranslation()
  const { Header, PetCard, QuickAction } = useFlowComponents<AddMedicationComponents>()
  const { goToScreen } = useFlowNavigation<AddMedicationScreenId>()
  const pet = useAtomValue(petAtom)
  const medications = useAtomValue(medicationsAtom)

  return (
    <section>
      <Header title={t('flows.addMedication.alternativeHome.title', { name: pet.name })} />
      <QuickAction
        description={t('flows.addMedication.home.addMedicationDescription', { name: pet.name })}
        label={t('flows.addMedication.home.addMedication')}
        onClick={() => goToScreen('medication-form')}
      />
      <PetCard pet={pet} />
      <p>{t('flows.addMedication.alternativeHome.medicationCount', { count: medications.length })}</p>
    </section>
  )
}
