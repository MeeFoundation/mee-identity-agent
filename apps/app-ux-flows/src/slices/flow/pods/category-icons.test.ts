import { Hearts } from 'react-bootstrap-icons'
import { describe, expect, it } from 'vitest'

import { podCategoryIris } from './catalog/categories'
import { categoryIcon } from './category-icons'

describe('categoryIcon', () => {
  it('shows the top-level category icon for a category and its sub-categories', () => {
    expect(categoryIcon(podCategoryIris.pets)).toBe(Hearts)
    expect(categoryIcon(podCategoryIris.petsVeterinarians)).toBe(Hearts)
  })

  it('has no icon for an unknown category', () => {
    expect(categoryIcon('urn:unknown')).toBeUndefined()
  })
})
