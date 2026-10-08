import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { type AddMedicationComponents, type AddMedicationScreenId, medicationsAtom, petAtom } from '../model'

export const ConfirmationScreen = () => {
  const { t } = useTranslation()
  const { Button, Header, PetCard } = useFlowComponents<AddMedicationComponents>()
  const { complete, goToScreen, restart } = useFlowNavigation<AddMedicationScreenId>()
  const pet = useAtomValue(petAtom)
  const lastMedication = useAtomValue(medicationsAtom).at(-1)

  if (!lastMedication) {
    return (
      <section>
        <Header title={t('flows.addMedication.confirmation.emptyTitle')} />
        <PetCard pet={pet} />
        <p>{t('flows.addMedication.confirmation.emptyBody', { name: pet.name })}</p>
        <Button onClick={() => goToScreen('medication-form')}>
          {t('flows.addMedication.confirmation.addMedication')}
        </Button>
      </section>
    )
  }

  return (
    <section>
      <Header title={t('flows.addMedication.confirmation.title')} />
      <PetCard pet={pet} />
      <p>
        {t(
          lastMedication.withFood
            ? 'flows.addMedication.medication.summaryWithFood'
            : 'flows.addMedication.medication.summary',
          { dosage: lastMedication.dosage, name: lastMedication.name },
        )}
      </p>
      <Button onClick={() => goToScreen('home')}>{t('flows.addMedication.confirmation.backToPet')}</Button>{' '}
      <Button onClick={restart}>{t('flows.addMedication.confirmation.startOver')}</Button>{' '}
      <Button onClick={complete}>{t('flows.addMedication.confirmation.finish')}</Button>
    </section>
  )
}
