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
      <h2 className="font-semibold text-base text-gray-900">{t('flows.addMedication.home.medicationsTitle')}</h2>
      {medications.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t('flows.addMedication.home.noMedications')}</p>
      ) : (
        <ul className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
          {medications.map((medication) => (
            <li className="px-4 py-3 text-sm" key={medication.id}>
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
