import { useTranslation } from 'react-i18next'

import type { PetCardProps } from '../model'

export const PetCard = ({ pet }: PetCardProps) => {
  const { t } = useTranslation()

  return (
    <article>
      <h2>{pet.name}</h2>
      <p>{t('flows.addMedication.petCard.details', { count: pet.ageYears, species: pet.species })}</p>
    </article>
  )
}
