// Mirrors the `podcat:Pets` branch of `pod-categories.ttl` in MeeFoundation/tpod-ontologies.

const podcat = (name: string) => `http://mee.foundation/ontologies/pod-categories#${name}`

export const podCategoryIris = {
  pets: podcat('Pets'),
  petsCareAndFeeding: podcat('PetsCareAndFeeding'),
  petsDevices: podcat('PetsDevices'),
  petsMedical: podcat('PetsMedical'),
  petsVeterinarians: podcat('PetsVeterinarians'),
} as const

export type PodCategory = {
  iri: string
  // The concept's English `skos:prefLabel`.
  label: string
  // The `skos:broader` concept; omitted where the parent lies outside this catalog.
  broader?: string
}

export const podCategories: readonly PodCategory[] = [
  { iri: podCategoryIris.pets, label: 'Pets' },
  { broader: podCategoryIris.pets, iri: podCategoryIris.petsMedical, label: 'Medical' },
  { broader: podCategoryIris.petsMedical, iri: podCategoryIris.petsVeterinarians, label: 'Veterinarians' },
  { broader: podCategoryIris.petsMedical, iri: podCategoryIris.petsDevices, label: 'Devices' },
  { broader: podCategoryIris.pets, iri: podCategoryIris.petsCareAndFeeding, label: 'Care & Feeding' },
]

export const findCategory = (iri: string): PodCategory | undefined =>
  podCategories.find((category) => category.iri === iri)

export const narrowerCategories = (iri: string): readonly PodCategory[] =>
  podCategories.filter((category) => category.broader === iri)

// The category and its ancestors in the catalog, top first: the taxonomy breadcrumb of a pod in that category.
export const categoryPath = (iri: string): readonly PodCategory[] => {
  const category = findCategory(iri)
  if (!category) return []
  return category.broader ? [...categoryPath(category.broader), category] : [category]
}
