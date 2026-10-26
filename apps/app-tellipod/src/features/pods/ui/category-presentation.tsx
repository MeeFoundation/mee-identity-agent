import type { TFunction } from 'i18next'
import type { ReactNode } from 'react'

import { HeartsIcon, PeopleIcon } from '@/shared/ui'

const categoryIcons = new Map<string, () => ReactNode>([
  ['people', () => <PeopleIcon />],
  ['pets', () => <HeartsIcon />],
])

export const getCategoryIcon = (id: string): ReactNode => categoryIcons.get(id)?.() ?? null

export const getCategoryLabel = (t: TFunction, id: string): string => t(`pod.categories.${id}`, { defaultValue: id })
