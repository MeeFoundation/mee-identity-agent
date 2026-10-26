import { People } from 'react-bootstrap-icons'

import { podCategoryIris } from '../../pods/catalog/categories'
import { categoryIcon } from '../../pods/category-icons'
import gingerAvatar from '../../pods/ginger/assets/ginger-avatar.png'
import type { PodSummary } from '@/shared/ui/pod-summary'

export const aboutSofia: PodSummary = {
  avatarSrc: null,
  category: { icon: People, label: 'People' },
  hasUnread: false,
  id: 'about-sofia',
  name: 'About Sofia',
  subcategory: { label: 'Immediate family' },
}

export const maya: PodSummary = {
  avatarSrc: gingerAvatar,
  category: { icon: categoryIcon(podCategoryIris.pets), label: 'Pets' },
  hasUnread: true,
  id: 'maya',
  name: 'Maya',
}

export const samplePods: readonly PodSummary[] = [aboutSofia, maya]
