import { describe, expect, it } from 'vitest'

import { podCategoryIris } from './categories'
import { applyTemplate, createPodFromTemplate } from './create-pod'
import { shapeIris } from './templates'

const createGinger = () => createPodFromTemplate({ name: '  Ginger ' })

describe('createPodFromTemplate', () => {
  it('creates a generic pod without a category, breadcrumb or forms', () => {
    expect(createGinger()).toMatchObject({
      avatarLetter: 'G',
      breadcrumb: [],
      category: null,
      forms: [],
      memberCount: 1,
      name: 'Ginger',
    })
  })

  it('keeps a chosen image as the avatar, and has none without one', () => {
    expect(createPodFromTemplate({ avatarSrc: 'blob:ginger', name: 'Ginger' })).toMatchObject({
      avatarLetter: 'G',
      avatarSrc: 'blob:ginger',
    })
    expect(createGinger()).not.toHaveProperty('avatarSrc')
  })

  it('creates a Pets pod from its template with one empty Pet profile form', () => {
    expect(createPodFromTemplate({ category: podCategoryIris.pets, name: 'Ginger' })).toMatchObject({
      breadcrumb: ['Pets'],
      category: podCategoryIris.pets,
      forms: [{ shape: shapeIris.pet }],
    })
  })

  it('uses the taxonomy path as the breadcrumb of a sub-category pod', () => {
    expect(createPodFromTemplate({ category: podCategoryIris.petsMedical, name: 'Medical' }).breadcrumb).toEqual([
      'Pets',
      'Medical',
    ])
  })

  it('gives every pod its own id', () => {
    expect(createGinger().id).not.toBe(createGinger().id)
  })

  it('uppercases the first letter of the name for the avatar', () => {
    expect(createPodFromTemplate({ name: 'luna' }).avatarLetter).toBe('L')
  })

  it('rejects a category outside the catalog', () => {
    expect(() => createPodFromTemplate({ category: 'urn:unknown', name: 'X' })).toThrow()
  })
})

describe('applyTemplate', () => {
  it('adds the Pets category, breadcrumb and Pet profile form to a generic pod', () => {
    const ginger = createGinger()

    expect(applyTemplate(ginger, podCategoryIris.pets)).toEqual({
      ...ginger,
      breadcrumb: ['Pets'],
      category: podCategoryIris.pets,
      forms: [{ shape: shapeIris.pet }],
    })
  })

  it('is a no-op the second time', () => {
    const pet = applyTemplate(createGinger(), podCategoryIris.pets)

    expect(applyTemplate(pet, podCategoryIris.pets)).toBe(pet)
  })

  it('does not duplicate a form the pod already has', () => {
    const pet = createPodFromTemplate({ category: podCategoryIris.pets, name: 'Ginger' })
    const recategorised = applyTemplate({ ...pet, category: null }, podCategoryIris.pets)

    expect(recategorised.forms).toEqual([{ shape: shapeIris.pet }])
  })
})
