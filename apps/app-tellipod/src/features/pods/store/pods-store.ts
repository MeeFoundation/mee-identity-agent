import { atom, type Getter, type PrimitiveAtom, type Setter } from 'jotai'
import { atomFamily } from 'jotai-family'
import { isEqual } from 'lodash-es'

import { createMockPodsApi } from '../api/mock-pods-api'
import type { PodsApi, PodsApiParams, PodsPage } from '../api/pods-api'
import type { PodListState } from '../model/pod-list'
import { EMPTY_LIST_STATE, isListBusy, type ListAction, type ListStatus } from '@/shared/list'

export type PodListSort = 'last_activity' | 'name_asc'

export type PodListParams = {
  readonly sort: PodListSort
  readonly search?: string
  readonly categoryId?: string
}

export type PodListRequest = {
  readonly params: PodListParams
  readonly limit: number
}

type ListRequestOptions = PodListRequest & {
  readonly action: ListAction
  readonly cursor: string | null
  readonly status: ListStatus
}

export const podsApiAtom = atom<PodsApi>(createMockPodsApi())

export const podListAtomFamily = atomFamily<PodListParams, PrimitiveAtom<PodListState>>(
  () => atom<PodListState>(EMPTY_LIST_STATE),
  isEqual,
)

const toApiParams = ({ categoryId, search, sort }: PodListParams): PodsApiParams => ({
  ...(categoryId === undefined ? {} : { categoryId }),
  ...(search === undefined ? {} : { search }),
  sort,
})

const toError = (cause: unknown) => (cause instanceof Error ? cause : new Error(String(cause)))

const requestPage = async (
  get: Getter,
  set: Setter,
  { action, cursor, limit, params, status }: ListRequestOptions,
  onPage: (list: PodListState, page: PodsPage) => PodListState,
) => {
  // the atom outlives its removal from the family, so a late response cannot revive a removed list
  const listAtom = podListAtomFamily(params)
  set(listAtom, (list) => ({ ...list, error: null, failedAction: null, status }))

  try {
    const page = await get(podsApiAtom).fetchPods({ cursor, limit, params: toApiParams(params) })
    set(listAtom, (list) => ({ ...onPage(list, page), error: null, failedAction: null, status: 'idle' }))
  } catch (cause) {
    set(listAtom, (list) => ({ ...list, error: toError(cause), failedAction: action, status: 'error' }))
  }
}

const replaceWithFirstPage = (list: PodListState, page: PodsPage): PodListState => ({
  ...list,
  nextCursor: page.nextCursor,
  pages: [page.items],
})

export const loadPodsAtom = atom(null, async (get, set, { limit, params }: PodListRequest) => {
  const list = get(podListAtomFamily(params))
  if (list.pages.length > 0 || isListBusy(list)) {
    return
  }

  await requestPage(get, set, { action: 'load', cursor: null, limit, params, status: 'loading' }, replaceWithFirstPage)
})

export const loadMorePodsAtom = atom(null, async (get, set, { limit, params }: PodListRequest) => {
  const list = get(podListAtomFamily(params))

  if (list.pages.length === 0 || list.nextCursor === null || isListBusy(list)) return

  await requestPage(
    get,
    set,
    { action: 'load_more', cursor: list.nextCursor, limit, params, status: 'loading_more' },
    (current, page) => ({ ...current, nextCursor: page.nextCursor, pages: [...current.pages, page.items] }),
  )
})

export const refreshPodsAtom = atom(null, async (get, set, { limit, params }: PodListRequest) => {
  if (isListBusy(get(podListAtomFamily(params)))) return

  await requestPage(
    get,
    set,
    { action: 'refresh', cursor: null, limit, params, status: 'refreshing' },
    replaceWithFirstPage,
  )
})

export const removePodListAtom = atom(null, (_get, _set, params: PodListParams) => podListAtomFamily.remove(params))
