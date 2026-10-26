import type { Icon } from 'react-bootstrap-icons'

type PodCategoryLabel = {
  label: string
  icon?: Icon
}

// What the pods section shows of one pod; the pod itself stays in the flow's own state.
export type PodSummary = {
  id: string
  name: string
  // Without an image the card shows the first letter of the name.
  avatarSrc: string | null
  category: PodCategoryLabel
  subcategory?: Pick<PodCategoryLabel, 'label'>
  hasUnread: boolean
}
