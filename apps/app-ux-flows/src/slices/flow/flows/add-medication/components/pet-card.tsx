import { useTranslation } from 'react-i18next'

import type { PetCardProps } from '../model'

export const PetCard = ({ pet }: PetCardProps) => {
  const { t } = useTranslation()

  return (
    <article className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
      <span
        aria-hidden
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 text-xl"
      >
        {pet.name.charAt(0)}
      </span>
      <div className="flex flex-col">
        <h2 className="font-semibold text-gray-900 text-lg">{pet.name}</h2>
        <p className="text-muted-foreground text-sm">
          {t('flows.addMedication.petCard.details', { count: pet.ageYears, species: pet.species })}
        </p>
      </div>
    </article>
  )
}
