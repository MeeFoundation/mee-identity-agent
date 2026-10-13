import { Hearts, type Icon } from 'react-bootstrap-icons'

import { categoryPath, podCategoryIris } from './catalog/categories'

// Icons stay out of the catalog, which describes the ontology only; a category shows its top-level ancestor's icon.
const iconsByTopCategory: Readonly<Record<string, Icon>> = {
  [podCategoryIris.pets]: Hearts,
}

export const categoryIcon = (categoryIri: string): Icon | undefined => {
  const top = categoryPath(categoryIri)[0]
  return top ? iconsByTopCategory[top.iri] : undefined
}
