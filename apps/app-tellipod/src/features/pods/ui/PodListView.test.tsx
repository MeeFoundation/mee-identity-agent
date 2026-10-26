import { fireEvent, render, screen } from '@testing-library/react-native'

import type { PodSummary } from '../model/pod-summary'
import { PodListView } from './PodListView'
import type { ListStatus } from '@/shared/list'

jest.mock('@gorhom/bottom-sheet', () => ({}))

const pod = (id: string): PodSummary => ({
  avatarUrl: null,
  category: { id: 'people' },
  hasUnread: false,
  id,
  name: `Pod ${id}`,
  subcategory: null,
})

type RenderOptions = {
  readonly pods?: ReadonlyArray<PodSummary>
  readonly hasLoaded?: boolean
  readonly status?: ListStatus
  readonly limit?: number
  readonly onPodPress?: (pod: PodSummary) => void
  readonly onRetry?: () => void
}

const renderView = ({
  pods = [],
  hasLoaded = true,
  status = 'idle',
  limit = 3,
  onPodPress = jest.fn(),
  onRetry = jest.fn(),
}: RenderOptions = {}) =>
  render(
    <PodListView
      hasLoaded={hasLoaded}
      limit={limit}
      onPodPress={onPodPress}
      onRetry={onRetry}
      pods={pods}
      status={status}
      testID="list"
    />,
  )

describe('PodListView', () => {
  it('shows at most the limit of pods', async () => {
    await renderView({ limit: 3, pods: ['1', '2', '3', '4', '5'].map(pod) })

    expect(screen.getByText('Pod 1')).toBeTruthy()
    expect(screen.getByText('Pod 3')).toBeTruthy()
    expect(screen.queryByText('Pod 4')).toBeNull()
  })

  it('shows every pod when there are fewer than the limit', async () => {
    await renderView({ limit: 3, pods: [pod('1'), pod('2')] })

    expect(screen.getByText('Pod 1')).toBeTruthy()
    expect(screen.getByText('Pod 2')).toBeTruthy()
  })

  it('calls the press handler with the pressed pod', async () => {
    const onPodPress = jest.fn()
    await renderView({ onPodPress, pods: [pod('1'), pod('2')] })

    await fireEvent.press(screen.getByText('Pod 2'))

    expect(onPodPress).toHaveBeenCalledWith(pod('2'))
  })

  it('shows one placeholder row per limit while the first page loads', async () => {
    await renderView({ hasLoaded: false, limit: 3, status: 'loading' })

    expect(screen.getByTestId('list-pending')).toBeTruthy()
    expect(screen.getByLabelText('Loading pods')).toBeTruthy()
    expect(screen.getAllByTestId(/^list-pending-row-/, { includeHiddenElements: true })).toHaveLength(3)
    expect(screen.queryByTestId('list-empty')).toBeNull()
    expect(screen.queryByTestId('list-error')).toBeNull()
  })

  it('shows the pending state, not the empty message, before the load starts', async () => {
    await renderView({ hasLoaded: false, status: 'idle' })

    expect(screen.getByTestId('list-pending')).toBeTruthy()
    expect(screen.queryByTestId('list-empty')).toBeNull()
  })

  it('keeps the pods during a refresh', async () => {
    await renderView({ pods: [pod('1')], status: 'refreshing' })

    expect(screen.getByText('Pod 1')).toBeTruthy()
    expect(screen.queryByTestId('list-pending')).toBeNull()
  })

  it('shows the error and retries when the first load fails', async () => {
    const onRetry = jest.fn()
    await renderView({ hasLoaded: false, onRetry, status: 'error' })

    expect(screen.getByText("Couldn't load pods")).toBeTruthy()
    expect(screen.queryByTestId('list-pending')).toBeNull()

    await fireEvent.press(screen.getByText('Try again'))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('keeps the pods and shows the error below them when a refresh fails', async () => {
    const onRetry = jest.fn()
    await renderView({ onRetry, pods: [pod('1')], status: 'error' })

    expect(screen.getByText('Pod 1')).toBeTruthy()
    expect(screen.getByText("Couldn't load pods")).toBeTruthy()

    await fireEvent.press(screen.getByText('Try again'))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('shows the empty message when the list loaded without pods', async () => {
    await renderView({ hasLoaded: true, status: 'idle' })

    expect(screen.getByText('No pods yet')).toBeTruthy()
    expect(screen.queryByTestId('list-pending')).toBeNull()
    expect(screen.queryByTestId('list-error')).toBeNull()
  })
})
