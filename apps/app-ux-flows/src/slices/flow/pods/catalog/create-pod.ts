import { categoryPath } from './categories'
import { findTemplate } from './templates'

type PodForm = {
  // The `pod:shape` the form's graph is stamped with.
  shape: string
}

export type PodInstance = {
  id: string
  name: string
  // `null` for a pod created without a category.
  category: string | null
  memberCount: number
  avatarLetter: string
  breadcrumb: readonly string[]
  forms: readonly PodForm[]
}

type CreatePodInput = {
  // Omitted for a generic pod, which gets structure only once a template is applied.
  category?: string
  name: string
}

const requireTemplate = (category: string | null) => {
  const template = findTemplate(category)
  if (!template) throw new Error(`No pod template for category "${category}"`)
  return template
}

// A pod at the top of the tree is shown under its category's taxonomy path until it is moved.
const breadcrumbOf = (category: string) => {
  const path = categoryPath(category)
  if (path.length === 0) throw new Error(`Unknown pod category "${category}"`)
  return path.map((ancestor) => ancestor.label)
}

// Lazy instantiation: the new pod copies the forms its category's template pod declares, still empty.
export const createPodFromTemplate = ({ category, name }: CreatePodInput): PodInstance => {
  const template = requireTemplate(category ?? null)
  const trimmedName = name.trim()
  return {
    avatarLetter: (Array.from(trimmedName)[0] ?? '').toLocaleUpperCase(),
    breadcrumb: category ? breadcrumbOf(category) : [],
    category: category ?? null,
    forms: template.forms.map((shape) => ({ shape })),
    id: crypto.randomUUID(),
    memberCount: 1,
    name: trimmedName,
  }
}

// Gives an existing pod a category and the forms its template declares, keeping everything the pod already has.
export const applyTemplate = (pod: PodInstance, category: string): PodInstance => {
  if (pod.category === category) return pod
  const template = requireTemplate(category)
  const missingForms = template.forms.filter((shape) => !pod.forms.some((form) => form.shape === shape))
  return {
    ...pod,
    breadcrumb: breadcrumbOf(category),
    category,
    forms: [...pod.forms, ...missingForms.map((shape) => ({ shape }))],
  }
}
