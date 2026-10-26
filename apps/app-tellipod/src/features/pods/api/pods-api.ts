import type { PodSummary } from '../model/pod-summary'

export type PodsApiSort = 'last_activity' | 'name_asc'

export type PodsApiParams = {
  readonly sort: PodsApiSort
  readonly search?: string
  readonly categoryId?: string
}

export type PodsPageRequest = {
  readonly cursor: string | null
  readonly limit: number
  readonly params: PodsApiParams
}

export type PodsPage = {
  readonly items: ReadonlyArray<PodSummary>
  readonly nextCursor: string | null
}

export type PodsApi = {
  readonly fetchPods: (request: PodsPageRequest) => Promise<PodsPage>
}
