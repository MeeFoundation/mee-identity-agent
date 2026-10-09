import { describe, expect, it } from 'vitest'

import { categoryPath, findCategory, narrowerCategories, podCategories, podCategoryIris } from './categories'
import { findTemplate, formLabelKey, podTemplates, shapeIris } from './templates'

describe('pod catalog', () => {
  it('nests Medical and Care & Feeding under Pets, and Veterinarians and Devices under Medical', () => {
    expect(narrowerCategories(podCategoryIris.pets).map((category) => category.label)).toEqual([
      'Medical',
      'Care & Feeding',
    ])
    expect(narrowerCategories(podCategoryIris.petsMedical).map((category) => category.label)).toEqual([
      'Veterinarians',
      'Devices',
    ])
    expect(findCategory(podCategoryIris.pets)?.broader).toBeUndefined()
  })

  it('gives each category its taxonomy path, top first', () => {
    expect(categoryPath(podCategoryIris.pets).map((category) => category.label)).toEqual(['Pets'])
    expect(categoryPath(podCategoryIris.petsVeterinarians).map((category) => category.label)).toEqual([
      'Pets',
      'Medical',
      'Veterinarians',
    ])
    expect(categoryPath('urn:unknown')).toEqual([])
  })

  it('has one template per category, plus one for pods without a category', () => {
    expect(
      podTemplates
        .map((template) => template.category)
        .filter((category) => category !== null)
        .sort(),
    ).toEqual(podCategories.map((category) => category.iri).sort())
    expect(podTemplates.filter((template) => template.category === null)).toHaveLength(1)
  })

  it('creates pods without a category from the user-defined template, with contact info and no forms', () => {
    expect(findTemplate(null)).toEqual({
      category: null,
      forms: [],
      iri: 'http://mee.foundation/ontologies/pod-templates#UserDefinedTemplatePod',
      memberShape: shapeIris.contactInfo,
    })
  })

  it('names the Pet profile form "Pet information"', () => {
    expect(formLabelKey(shapeIris.pet)).toBe('pods.catalog.forms.pet')
    expect(formLabelKey(shapeIris.petMedicationRecord)).toBeUndefined()
  })

  it('declares a form only on the Pets, Medical and Care & Feeding templates', () => {
    expect(findTemplate(podCategoryIris.pets)?.forms).toEqual([shapeIris.pet])
    expect(findTemplate(podCategoryIris.petsMedical)?.forms).toEqual([shapeIris.petMedicationRecord])
    expect(findTemplate(podCategoryIris.petsCareAndFeeding)?.forms).toEqual([shapeIris.petsCareAndFeeding])
    expect(findTemplate(podCategoryIris.petsVeterinarians)?.forms).toEqual([])
    expect(findTemplate(podCategoryIris.petsDevices)?.forms).toEqual([])
  })
})
