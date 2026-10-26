export type PodCategoryRef = {
  readonly id: string
}

export type PodSummary = {
  readonly id: string
  readonly name: string
  readonly avatarUrl: string | null
  readonly category: PodCategoryRef
  readonly subcategory: PodCategoryRef | null
  readonly hasUnread: boolean
}
