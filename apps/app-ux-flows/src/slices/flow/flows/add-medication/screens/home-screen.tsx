import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { type AddMedicationComponents, type AddMedicationScreenId, medicationsAtom, petAtom } from '../model'

export const HomeScreen = () => {
  const { t } = useTranslation()
  const { Header, PetCard, QuickAction } = useFlowComponents<AddMedicationComponents>()
  const { goToScreen } = useFlowNavigation<AddMedicationScreenId>()
  const pet = useAtomValue(petAtom)
  const medications = useAtomValue(medicationsAtom)

  return (
    <section>
      <Header title={t('flows.addMedication.home.title')} />
      <PetCard pet={pet} />
      <h2>{t('flows.addMedication.home.medicationsTitle')}</h2>
      {medications.length === 0 ? (
        <p>{t('flows.addMedication.home.noMedications')}</p>
      ) : (
        <ul>
          {medications.map((medication) => (
            <li key={medication.id}>
              {t(
                medication.withFood
                  ? 'flows.addMedication.medication.summaryWithFood'
                  : 'flows.addMedication.medication.summary',
                { dosage: medication.dosage, name: medication.name },
              )}
            </li>
          ))}
        </ul>
      )}
      <QuickAction
        description={t('flows.addMedication.home.addMedicationDescription', { name: pet.name })}
        label={t('flows.addMedication.home.addMedication')}
        onClick={() => goToScreen('medication-form')}
      />
    </section>
  )
}
