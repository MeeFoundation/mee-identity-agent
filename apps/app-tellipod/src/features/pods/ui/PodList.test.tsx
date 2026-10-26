import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { createStore, Provider } from 'jotai'

import type { PodsApi, PodsPage, PodsPageRequest } from '../api/pods-api'
import type { PodSummary } from '../model/pod-summary'
import { podsApiAtom } from '../store/pods-store'
import { PodList } from './PodList'

jest.mock('@gorhom/bottom-sheet', () => ({}))

const pod = (id: string): PodSummary => ({
  avatarUrl: null,
  category: { id: 'people' },
  hasUnread: false,
  id,
  name: `Pod ${id}`,
  subcategory: null,
})

const page = (ids: string[], nextCursor: string | null = null): PodsPage => ({ items: ids.map(pod), nextCursor })

const params = { sort: 'last_activity' } as const

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
  const renderList = (onPodPress = jest.fn(), limit = 3) =>
    render(
      <Provider store={store}>
        <PodList limit={limit} onPodPress={onPodPress} params={params} testID="list" />
      </Provider>,
    )
  return { calls, renderList }
}

describe('PodList', () => {
  it('requests the first page with the limit on first show and shows the pending state', async () => {
    const { calls, renderList } = setup()
    await renderList()

    expect(calls).toHaveLength(1)
    expect(calls[0].request).toEqual({ cursor: null, limit: 3, params })
    expect(screen.getByTestId('list-pending')).toBeTruthy()

    await act(async () => calls[0].resolve(page(['1', '2'])))

    expect(screen.getByText('Pod 1')).toBeTruthy()
    expect(screen.getByText('Pod 2')).toBeTruthy()
  })

  it('does not request again for params that are already loaded', async () => {
    const { calls, renderList } = setup()
    const first = await renderList()
    await act(async () => calls[0].resolve(page(['1'])))
    await first.unmount()

    await renderList()

    expect(calls).toHaveLength(1)
    expect(screen.getByText('Pod 1')).toBeTruthy()
  })

  it('shows at most the limit and does not request another page', async () => {
    const { calls, renderList } = setup()
    await renderList(jest.fn(), 2)
    await act(async () => calls[0].resolve(page(['1', '2', '3', '4'], 'cursor')))

    expect(screen.getByText('Pod 2')).toBeTruthy()
    expect(screen.queryByText('Pod 3')).toBeNull()
    expect(calls).toHaveLength(1)
  })

  it('repeats the failed request when retry is pressed', async () => {
    const { calls, renderList } = setup()
    await renderList()
    await act(async () => calls[0].reject(new Error('offline')))

    expect(screen.getByText("Couldn't load pods")).toBeTruthy()

    await fireEvent.press(screen.getByText('Try again'))

    expect(calls).toHaveLength(2)
    expect(calls[1].request.cursor).toBeNull()
    expect(screen.getByTestId('list-pending')).toBeTruthy()

    await act(async () => calls[1].resolve(page(['1'])))

    expect(screen.getByText('Pod 1')).toBeTruthy()
  })

  it('shows the empty message when the list loads without pods', async () => {
    const { calls, renderList } = setup()
    await renderList()
    await act(async () => calls[0].resolve(page([])))

    expect(screen.getByText('No pods yet')).toBeTruthy()
  })

  it('reports the pressed pod', async () => {
    const onPodPress = jest.fn()
    const { calls, renderList } = setup()
    await renderList(onPodPress)
    await act(async () => calls[0].resolve(page(['1'])))

    await fireEvent.press(screen.getByText('Pod 1'))

    expect(onPodPress).toHaveBeenCalledWith(pod('1'))
  })
})
