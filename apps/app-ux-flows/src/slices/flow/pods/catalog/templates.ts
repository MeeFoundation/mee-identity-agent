import { findCategory, type PodCategory, podCategoryIris } from './categories'

// Mirrors the Pets template pods and the category-less template of `pod-category-templates.ttl`
// in MeeFoundation/tpod-ontologies.

const ctpl = (name: string) => `http://mee.foundation/ontologies/pod-templates#${name}`
const petshapes = (name: string) => `http://mee.foundation/ontologies/pets/shapes#${name}`
const pshapes = (name: string) => `http://mee.foundation/ontologies/persona/shapes#${name}`

export const shapeIris = {
  contactInfo: pshapes('ContactInfoShape'),
  pet: petshapes('PetShape'),
  petMedicationRecord: petshapes('PetMedicationRecordShape'),
  petsCareAndFeeding: petshapes('PetsCareAndFeedingShape'),
} as const

export type PodTemplate = {
  iri: string
  // `null` for the template of a pod created without a category.
  category: string | null
  memberShape: string
  // The `pod:formShape` of each Form the template declares via `pod:declaresTool`.
  forms: readonly string[]
  // Heads the structure the template adds to a pod; templates without one show none.
  structureLabelKey?: string
}

export const podTemplates: readonly PodTemplate[] = [
  {
    category: null,
    forms: [],
    iri: ctpl('UserDefinedTemplatePod'),
    memberShape: shapeIris.contactInfo,
  },
  {
    category: podCategoryIris.pets,
    forms: [shapeIris.pet],
    iri: ctpl('PetProfileTemplatePod'),
    memberShape: shapeIris.contactInfo,
    structureLabelKey: 'pods.catalog.templates.pets.structure',
  },
  {
    category: podCategoryIris.petsMedical,
    forms: [shapeIris.petMedicationRecord],
    iri: ctpl('PetMedicationsTemplatePod'),
    memberShape: shapeIris.contactInfo,
  },
  {
    category: podCategoryIris.petsVeterinarians,
    forms: [],
    iri: ctpl('PetsVeterinariansTemplatePod'),
    memberShape: shapeIris.contactInfo,
  },
  {
    category: podCategoryIris.petsDevices,
    forms: [],
    iri: ctpl('PetsDevicesTemplatePod'),
    memberShape: shapeIris.contactInfo,
  },
  {
    category: podCategoryIris.petsCareAndFeeding,
    forms: [shapeIris.petsCareAndFeeding],
    iri: ctpl('PetsCareAndFeedingTemplatePod'),
    memberShape: shapeIris.contactInfo,
  },
]

export const findTemplate = (categoryIri: string | null): PodTemplate | undefined =>
  podTemplates.find((template) => template.category === categoryIri)

const formLabelKeys: Readonly<Record<string, string>> = {
  [shapeIris.pet]: 'pods.catalog.forms.pet',
}

export const formLabelKey = (shape: string): string | undefined => formLabelKeys[shape]

// The categories a pod can be given up front, because their template adds structure to it.
export const categoriesWithStructure = (): readonly PodCategory[] =>
  podTemplates.flatMap((template) => {
    const category = template.category && template.structureLabelKey ? findCategory(template.category) : undefined
    return category ? [category] : []
  })
