import { act, renderHook } from '@testing-library/react-native'
import { createStore, Provider } from 'jotai'
import type { ReactNode } from 'react'

import type { PodsApi, PodsPage, PodsPageRequest } from '../api/pods-api'
import type { PodSummary } from '../model/pod-summary'
import type { PodListParams } from './pods-store'
import { podsApiAtom } from './pods-store'
import { usePodList } from './use-pod-list'

const pod = (id: string): PodSummary => ({
  avatarUrl: null,
  category: { id: 'people' },
  hasUnread: false,
  id,
  name: `Pod ${id}`,
  subcategory: null,
})

const page = (ids: string[], nextCursor: string | null): PodsPage => ({ items: ids.map(pod), nextCursor })

const setup = () => {
  const calls: {
    request: PodsPageRequest
    resolve: (value: PodsPage) => void
    reject: (reason: Error) => void
  }[] = []
  const api: PodsApi = {
    fetchPods: (request) =>
      new Promise<PodsPage>((resolve, reject) => {
        calls.push({ reject, request, resolve })
      }),
  }
  const store = createStore()
  store.set(podsApiAtom, api)
  const wrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>
  return { calls, wrapper }
}

describe('usePodList', () => {
  it('loads the first page on mount and reflects the state', async () => {
    const { calls, wrapper } = setup()
    const { result } = await renderHook(() => usePodList({ sort: 'name_asc' }, 2), { wrapper })

    expect(calls).toHaveLength(1)
    expect(calls[0].request).toEqual({ cursor: null, limit: 2, params: { sort: 'name_asc' } })
    expect(result.current.status).toBe('loading')
    expect(result.current.pods).toEqual([])

    await act(async () => calls[0].resolve(page(['1', '2'], 'c1')))

    expect(result.current.status).toBe('idle')
    expect(result.current.pods.map((item) => item.id)).toEqual(['1', '2'])
  })

  it('does not request again when remounted with a loaded list', async () => {
    const { calls, wrapper } = setup()
    const first = await renderHook(() => usePodList({ sort: 'last_activity' }, 2), { wrapper })
    await act(async () => calls[0].resolve(page(['1'], null)))
    await act(async () => first.unmount())

    const second = await renderHook(() => usePodList({ sort: 'last_activity' }, 2), { wrapper })
    expect(calls).toHaveLength(1)
    expect(second.result.current.pods.map((item) => item.id)).toEqual(['1'])
  })

  it('loads more and refreshes for its params', async () => {
    const { calls, wrapper } = setup()
    const { result } = await renderHook(() => usePodList({ categoryId: 'pets', sort: 'last_activity' }, 2), { wrapper })
    await act(async () => calls[0].resolve(page(['1', '2'], 'c1')))

    await act(async () => {
      result.current.loadMore()
    })
    expect(calls[1].request).toEqual({
      cursor: 'c1',
      limit: 2,
      params: { categoryId: 'pets', sort: 'last_activity' },
    })
    expect(result.current.status).toBe('loading_more')
    await act(async () => calls[1].resolve(page(['3'], null)))
    expect(result.current.pods.map((item) => item.id)).toEqual(['1', '2', '3'])

    await act(async () => {
      result.current.refresh()
    })
    expect(calls[2].request.cursor).toBeNull()
    expect(result.current.status).toBe('refreshing')
    await act(async () => calls[2].resolve(page(['9'], null)))
    expect(result.current.pods.map((item) => item.id)).toEqual(['9'])
  })

  it('retries the action that failed', async () => {
    const { calls, wrapper } = setup()
    const params: PodListParams = { sort: 'last_activity' }
    const { result } = await renderHook(() => usePodList(params, 2), { wrapper })

    await act(async () => calls[0].reject(new Error('offline')))
    expect(result.current.status).toBe('error')
    expect(result.current.error?.message).toBe('offline')

    await act(async () => {
      result.current.retry()
    })
    expect(calls[1].request.cursor).toBeNull()
    await act(async () => calls[1].resolve(page(['1'], 'c1')))

    await act(async () => {
      result.current.loadMore()
    })
    await act(async () => calls[2].reject(new Error('offline')))
    await act(async () => {
      result.current.retry()
    })
    expect(calls[3].request.cursor).toBe('c1')
    await act(async () => calls[3].resolve(page(['2'], null)))

    await act(async () => {
      result.current.refresh()
    })
    await act(async () => calls[4].reject(new Error('offline')))
    await act(async () => {
      result.current.retry()
    })
    expect(calls[5].request.cursor).toBeNull()
    expect(result.current.pods.map((item) => item.id)).toEqual(['1', '2'])
  })

  it('switches to another list when the params change and back without a request', async () => {
    const { calls, wrapper } = setup()
    const { rerender, result } = await renderHook(({ params }: { params: PodListParams }) => usePodList(params, 2), {
      initialProps: { params: { sort: 'last_activity' } as PodListParams },
      wrapper,
    })
    await act(async () => calls[0].resolve(page(['a1'], null)))

    await rerender({ params: { sort: 'name_asc' } })
    expect(calls).toHaveLength(2)
    expect(result.current.pods).toEqual([])
    await act(async () => calls[1].resolve(page(['b1'], null)))
    expect(result.current.pods.map((item) => item.id)).toEqual(['b1'])

    await rerender({ params: { sort: 'last_activity' } })
    expect(calls).toHaveLength(2)
    expect(result.current.pods.map((item) => item.id)).toEqual(['a1'])
  })

  it('does not request again for an equal params object with a new identity', async () => {
    const { calls, wrapper } = setup()
    const { rerender } = await renderHook(({ params }: { params: PodListParams }) => usePodList(params, 2), {
      initialProps: { params: { categoryId: 'pets', sort: 'name_asc' } as PodListParams },
      wrapper,
    })

    await rerender({ params: { categoryId: 'pets', sort: 'name_asc' } })
    expect(calls).toHaveLength(1)
  })
})
