import { createInstance } from 'i18next'
import { beforeAll, describe, expect, it } from 'vitest'

import { en } from '@/app/locales/en'

import { podCategoryIris } from './categories'
import { findSuggestion } from './suggestions'

const i18n = createInstance()

beforeAll(async () => {
  await i18n.init({ interpolation: { escapeValue: false }, lng: 'en', resources: { en: { translation: en } } })
})

describe('template suggestions', () => {
  it('asks whether the pod is a pet, by the pod’s own name', () => {
    const suggestion = findSuggestion(podCategoryIris.pets)

    expect(suggestion && i18n.t(suggestion.titleKey, { name: 'Luna' })).toBe('Is Luna a pet?')
    expect(suggestion && i18n.t(suggestion.messageKey)).toBe(
      'Add a Pet template to keep medical, care and feeding information organized.',
    )
  })

  it('has no suggestion for a category without one', () => {
    expect(findSuggestion(podCategoryIris.petsDevices)).toBeUndefined()
  })
})
