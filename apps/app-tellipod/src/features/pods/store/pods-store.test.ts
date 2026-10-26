import { createStore } from 'jotai'

import type { PodsApi, PodsPage, PodsPageRequest } from '../api/pods-api'
import type { PodSummary } from '../model/pod-summary'
import {
  loadMorePodsAtom,
  loadPodsAtom,
  type PodListParams,
  podListAtomFamily,
  podsApiAtom,
  refreshPodsAtom,
  removePodListAtom,
} from './pods-store'
import { EMPTY_LIST_STATE, flattenListPages } from '@/shared/list'

const pod = (id: string): PodSummary => ({
  avatarUrl: null,
  category: { id: 'people' },
  hasUnread: false,
  id,
  name: `Pod ${id}`,
  subcategory: null,
})

const page = (ids: string[], nextCursor: string | null): PodsPage => ({ items: ids.map(pod), nextCursor })

type PendingCall = {
  request: PodsPageRequest
  resolve: (value: PodsPage) => void
  reject: (reason: Error) => void
}

const setup = () => {
  const calls: PendingCall[] = []
  const api: PodsApi = {
    fetchPods: (request) =>
      new Promise<PodsPage>((resolve, reject) => {
        calls.push({ reject, request, resolve })
      }),
  }
  const store = createStore()
  store.set(podsApiAtom, api)
  const listOf = (params: PodListParams) => store.get(podListAtomFamily(params))
  const idsOf = (params: PodListParams) => flattenListPages(listOf(params).pages).map((item) => item.id)
  const run = (atom: typeof loadPodsAtom, params: PodListParams, limit = 2) => store.set(atom, { limit, params })
  return { calls, idsOf, listOf, run, store }
}

const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

const A: PodListParams = { sort: 'last_activity' }
const B: PodListParams = { sort: 'name_asc' }

describe('podsApiAtom', () => {
  it('uses the api set on the store', async () => {
    const { calls, run } = setup()
    const loading = run(loadPodsAtom, A)
    expect(calls).toHaveLength(1)
    calls[0].resolve(page([], null))
    await loading
  })
})

describe('loadPodsAtom', () => {
  it('requests the first page with its params and stores it', async () => {
    const { calls, idsOf, listOf, run } = setup()
    const loading = run(loadPodsAtom, A, 2)

    expect(listOf(A).status).toBe('loading')
    expect(calls[0].request).toEqual({ cursor: null, limit: 2, params: { sort: 'last_activity' } })

    calls[0].resolve(page(['1', '2'], 'c1'))
    await loading

    expect(listOf(A).status).toBe('idle')
    expect(listOf(A).nextCursor).toBe('c1')
    expect(idsOf(A)).toEqual(['1', '2'])
  })

  it('makes no request when the list already has pages', async () => {
    const { calls, run } = setup()
    const first = run(loadPodsAtom, A)
    calls[0].resolve(page(['1'], null))
    await first

    await run(loadPodsAtom, A)
    expect(calls).toHaveLength(1)
  })

  it('makes one request when called repeatedly while in progress', async () => {
    const { calls, run } = setup()
    const first = run(loadPodsAtom, A)
    const second = run(loadPodsAtom, A)
    const third = run(loadPodsAtom, A)

    expect(calls).toHaveLength(1)
    calls[0].resolve(page(['1'], null))
    await Promise.all([first, second, third])
  })

  it('shows an error with no pods, then retries the first page', async () => {
    const { calls, idsOf, listOf, run } = setup()
    const failed = run(loadPodsAtom, A)
    calls[0].reject(new Error('offline'))
    await failed

    expect(listOf(A)).toMatchObject({ failedAction: 'load', status: 'error' })
    expect(listOf(A).error?.message).toBe('offline')
    expect(idsOf(A)).toEqual([])

    const retried = run(loadPodsAtom, A)
    expect(calls).toHaveLength(2)
    expect(calls[1].request.cursor).toBeNull()
    calls[1].resolve(page(['1'], null))
    await retried

    expect(listOf(A)).toMatchObject({ error: null, failedAction: null, status: 'idle' })
    expect(idsOf(A)).toEqual(['1'])
  })

  it('stores an empty result as loaded with a null cursor', async () => {
    const { calls, listOf, run } = setup()
    const loading = run(loadPodsAtom, A)
    calls[0].resolve(page([], null))
    await loading

    expect(listOf(A).pages).toEqual([[]])
    expect(listOf(A).nextCursor).toBeNull()

    await run(loadPodsAtom, A)
    expect(calls).toHaveLength(1)
  })

  it('wraps a non-error rejection', async () => {
    const store = createStore()
    store.set(podsApiAtom, { fetchPods: () => Promise.reject('boom') })
    await store.set(loadPodsAtom, { limit: 2, params: A })
    expect(store.get(podListAtomFamily(A)).error).toEqual(new Error('boom'))
  })
})

describe('loadMorePodsAtom', () => {
  const loaded = async () => {
    const context = setup()
    const first = context.run(loadPodsAtom, A)
    context.calls[0].resolve(page(['1', '2'], 'c1'))
    await first
    return context
  }

  it('appends the next page using the cursor', async () => {
    const { calls, idsOf, listOf, run } = await loaded()
    const more = run(loadMorePodsAtom, A)

    expect(listOf(A).status).toBe('loading_more')
    expect(calls[1].request.cursor).toBe('c1')

    calls[1].resolve(page(['3', '4'], null))
    await more

    expect(idsOf(A)).toEqual(['1', '2', '3', '4'])
    expect(listOf(A)).toMatchObject({ nextCursor: null, status: 'idle' })
  })

  it('makes one request when triggered repeatedly while in progress', async () => {
    const { calls, run } = await loaded()
    const a = run(loadMorePodsAtom, A)
    const b = run(loadMorePodsAtom, A)
    const c = run(loadMorePodsAtom, A)

    expect(calls).toHaveLength(2)
    calls[1].resolve(page(['3'], null))
    await Promise.all([a, b, c])
  })

  it('makes no request at the end of the list', async () => {
    const { calls, run } = await loaded()
    const more = run(loadMorePodsAtom, A)
    calls[1].resolve(page(['3'], null))
    await more

    await run(loadMorePodsAtom, A)
    expect(calls).toHaveLength(2)
  })

  it('makes no request for a list that was never loaded', async () => {
    const { calls, run } = setup()
    await run(loadMorePodsAtom, A)
    expect(calls).toHaveLength(0)
  })

  it('keeps pages and cursor on failure and retries the same page', async () => {
    const { calls, idsOf, listOf, run } = await loaded()
    const failed = run(loadMorePodsAtom, A)
    calls[1].reject(new Error('offline'))
    await failed

    expect(listOf(A)).toMatchObject({ failedAction: 'load_more', nextCursor: 'c1', status: 'error' })
    expect(idsOf(A)).toEqual(['1', '2'])

    const retried = run(loadMorePodsAtom, A)
    expect(calls[2].request.cursor).toBe('c1')
    calls[2].resolve(page(['3'], null))
    await retried

    expect(idsOf(A)).toEqual(['1', '2', '3'])
  })

  it('lists a pod repeated across pages once', async () => {
    const { calls, idsOf, run } = await loaded()
    const more = run(loadMorePodsAtom, A)
    calls[1].resolve(page(['2', '3'], null))
    await more

    expect(idsOf(A)).toEqual(['1', '2', '3'])
  })
})

describe('refreshPodsAtom', () => {
  const loadedTwoPages = async () => {
    const context = setup()
    const first = context.run(loadPodsAtom, A)
    context.calls[0].resolve(page(['1', '2'], 'c1'))
    await first
    const more = context.run(loadMorePodsAtom, A)
    context.calls[1].resolve(page(['3', '4'], 'c2'))
    await more
    return context
  }

  it('replaces all pages with the first page and keeps old pods readable meanwhile', async () => {
    const { calls, idsOf, listOf, run } = await loadedTwoPages()
    const refreshing = run(refreshPodsAtom, A)

    expect(listOf(A).status).toBe('refreshing')
    expect(idsOf(A)).toEqual(['1', '2', '3', '4'])
    expect(calls[2].request.cursor).toBeNull()

    calls[2].resolve(page(['9', '1'], 'c9'))
    await refreshing

    expect(idsOf(A)).toEqual(['9', '1'])
    expect(listOf(A)).toMatchObject({ nextCursor: 'c9', status: 'idle' })
  })

  it('keeps the previous pods when refreshing fails', async () => {
    const { calls, idsOf, listOf, run } = await loadedTwoPages()
    const refreshing = run(refreshPodsAtom, A)
    calls[2].reject(new Error('offline'))
    await refreshing

    expect(idsOf(A)).toEqual(['1', '2', '3', '4'])
    expect(listOf(A)).toMatchObject({ failedAction: 'refresh', nextCursor: 'c2', status: 'error' })
  })

  it('makes no second request while one is in progress', async () => {
    const { calls, run } = await loadedTwoPages()
    const a = run(refreshPodsAtom, A)
    const b = run(refreshPodsAtom, A)

    expect(calls).toHaveLength(3)
    calls[2].resolve(page(['1'], null))
    await Promise.all([a, b])
  })
})

describe('removePodListAtom', () => {
  it('drops one list so it loads from the first page again, leaving others untouched', async () => {
    const { calls, idsOf, run, store } = setup()
    const loadA = run(loadPodsAtom, A)
    calls[0].resolve(page(['1'], null))
    await loadA
    const loadB = run(loadPodsAtom, B)
    calls[1].resolve(page(['2'], null))
    await loadB

    store.set(removePodListAtom, A)
    expect(idsOf(A)).toEqual([])
    expect(idsOf(B)).toEqual(['2'])

    const reload = run(loadPodsAtom, A)
    expect(calls).toHaveLength(3)
    expect(calls[2].request.cursor).toBeNull()
    calls[2].resolve(page(['1'], null))
    await reload
  })

  it('ignores a response that arrives for a removed list', async () => {
    const { calls, idsOf, listOf, run, store } = setup()
    const loading = run(loadPodsAtom, A)
    store.set(removePodListAtom, A)
    calls[0].resolve(page(['1'], null))
    await loading

    expect(listOf(A)).toEqual(EMPTY_LIST_STATE)
    expect(idsOf(A)).toEqual([])
  })

  it('ignores the response of a removed request once the list is loading again', async () => {
    const { calls, idsOf, run, store } = setup()
    const stale = run(loadPodsAtom, A)
    store.set(removePodListAtom, A)
    const fresh = run(loadPodsAtom, A)

    calls[0].resolve(page(['stale'], null))
    await stale
    expect(idsOf(A)).toEqual([])

    calls[1].resolve(page(['fresh'], null))
    await fresh
    expect(idsOf(A)).toEqual(['fresh'])
  })
})

describe('independent lists', () => {
  it('keeps separate state per params and switches back without a request', async () => {
    const { calls, idsOf, listOf, run } = setup()
    const loadA = run(loadPodsAtom, A)
    calls[0].resolve(page(['1'], 'a1'))
    await loadA

    const loadB = run(loadPodsAtom, B)
    expect(listOf(A).status).toBe('idle')
    expect(listOf(B).status).toBe('loading')
    calls[1].resolve(page(['2'], null))
    await loadB

    expect(idsOf(A)).toEqual(['1'])
    expect(idsOf(B)).toEqual(['2'])

    await run(loadPodsAtom, A)
    expect(calls).toHaveLength(2)
  })

  it('treats params in a different key order as the same list', async () => {
    const { calls, run } = setup()
    const bySort = { sort: 'name_asc' } as const
    const byCategory = { categoryId: 'pets' } as const
    const sortFirst: PodListParams = { ...bySort, ...byCategory }
    const categoryFirst: PodListParams = { ...byCategory, ...bySort }

    const first = run(loadPodsAtom, sortFirst)
    calls[0].resolve(page(['1'], null))
    await first

    await run(loadPodsAtom, categoryFirst)
    expect(calls).toHaveLength(1)
  })

  it('applies a late response only to the list it was requested for', async () => {
    const { calls, idsOf, listOf, run } = setup()
    const loadA = run(loadPodsAtom, A)
    const loadB = run(loadPodsAtom, B)

    calls[1].resolve(page(['b1'], null))
    await loadB
    expect(idsOf(B)).toEqual(['b1'])
    expect(listOf(A).status).toBe('loading')

    calls[0].resolve(page(['a1'], null))
    await loadA
    await flush()

    expect(idsOf(A)).toEqual(['a1'])
    expect(idsOf(B)).toEqual(['b1'])
  })

  it('applies a late load-more response to its own list after switching params', async () => {
    const { calls, idsOf, run } = setup()
    const loadA = run(loadPodsAtom, A)
    calls[0].resolve(page(['a1'], 'a-next'))
    await loadA

    const moreA = run(loadMorePodsAtom, A)
    const loadB = run(loadPodsAtom, B)
    calls[2].resolve(page(['b1'], null))
    await loadB

    calls[1].resolve(page(['a2'], null))
    await moreA

    expect(idsOf(A)).toEqual(['a1', 'a2'])
    expect(idsOf(B)).toEqual(['b1'])
  })
})
