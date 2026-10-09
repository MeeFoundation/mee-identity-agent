import { podCategoryIris } from './categories'

// What the app offers when a generic pod looks like it belongs to a category; copy takes the pod's `name`.
export type TemplateSuggestion = {
  category: string
  titleKey: string
  messageKey: string
}

const templateSuggestions: readonly TemplateSuggestion[] = [
  {
    category: podCategoryIris.pets,
    messageKey: 'pods.catalog.suggestions.pets.message',
    titleKey: 'pods.catalog.suggestions.pets.title',
  },
]

export const findSuggestion = (category: string): TemplateSuggestion | undefined =>
  templateSuggestions.find((suggestion) => suggestion.category === category)
