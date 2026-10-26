import { fireEvent, render, screen } from '@testing-library/react-native'

import type { PodSummary } from '../model/pod-summary'
import { PodsSectionView } from './PodsSectionView'
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
  readonly onSeeAll?: () => void
  readonly onAddPod?: () => void
  readonly onDismissEmpty?: () => void
  readonly hideEmpty?: boolean
}

const renderSection = ({
  pods = [],
  hasLoaded = true,
  status = 'idle',
  limit = 2,
  onPodPress = jest.fn(),
  onRetry = jest.fn(),
  onSeeAll = jest.fn(),
  onAddPod = jest.fn(),
  onDismissEmpty = jest.fn(),
  hideEmpty,
}: RenderOptions = {}) =>
  render(
    <PodsSectionView
      hasLoaded={hasLoaded}
      hideEmpty={hideEmpty}
      limit={limit}
      onAddPod={onAddPod}
      onDismissEmpty={onDismissEmpty}
      onPodPress={onPodPress}
      onRetry={onRetry}
      onSeeAll={onSeeAll}
      pods={pods}
      status={status}
      testID="section"
    />,
  )

describe('PodsSectionView', () => {
  it('shows the header above the pod rows', async () => {
    await renderSection({ pods: [pod('1'), pod('2')] })

    expect(screen.getByText('Recent Pods')).toBeTruthy()
    expect(screen.getByText('See all pods')).toBeTruthy()
    expect(screen.getByText('Pod 1')).toBeTruthy()
    expect(screen.getByText('Pod 2')).toBeTruthy()
    expect(screen.queryByText('Create your first Pod')).toBeNull()
  })

  it('shows at most the limit of pods', async () => {
    await renderSection({ limit: 2, pods: [pod('1'), pod('2'), pod('3')] })

    expect(screen.getByText('Pod 2')).toBeTruthy()
    expect(screen.queryByText('Pod 3')).toBeNull()
  })

  it('reports the pressed pod and the see all press', async () => {
    const onPodPress = jest.fn()
    const onSeeAll = jest.fn()
    await renderSection({ onPodPress, onSeeAll, pods: [pod('1')] })

    await fireEvent.press(screen.getByText('Pod 1'))
    await fireEvent.press(screen.getByText('See all pods'))

    expect(onPodPress).toHaveBeenCalledWith(pod('1'))
    expect(onSeeAll).toHaveBeenCalledTimes(1)
  })

  it('shows the header above the placeholder rows while loading', async () => {
    await renderSection({ hasLoaded: false, status: 'loading' })

    expect(screen.getByText('Recent Pods')).toBeTruthy()
    expect(screen.getByTestId('section-list-pending')).toBeTruthy()
    expect(screen.queryByText('Create your first Pod')).toBeNull()
  })

  it('shows the header above the error and retries when the first load fails', async () => {
    const onRetry = jest.fn()
    await renderSection({ hasLoaded: false, onRetry, status: 'error' })

    expect(screen.getByText('Recent Pods')).toBeTruthy()
    expect(screen.getByText("Couldn't load pods")).toBeTruthy()
    expect(screen.queryByText('Create your first Pod')).toBeNull()

    await fireEvent.press(screen.getByText('Try again'))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('shows the first-run card and no header when the list loaded without pods', async () => {
    await renderSection({ hasLoaded: true, pods: [], status: 'idle' })

    expect(screen.getByText('Create your first Pod')).toBeTruthy()
    expect(screen.queryByText('Recent Pods')).toBeNull()
    expect(screen.queryByText('See all pods')).toBeNull()
    expect(screen.queryByText('No pods yet')).toBeNull()
  })

  it('reports Add Pod and Maybe later and keeps the card shown', async () => {
    const onAddPod = jest.fn()
    const onDismissEmpty = jest.fn()
    await renderSection({ onAddPod, onDismissEmpty })

    await fireEvent.press(screen.getByText('Add Pod'))
    await fireEvent.press(screen.getByText('Maybe later'))

    expect(onAddPod).toHaveBeenCalledTimes(1)
    expect(onDismissEmpty).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Create your first Pod')).toBeTruthy()
  })

  it('renders nothing when hideEmpty is set and the list loaded without pods', async () => {
    await renderSection({ hideEmpty: true })

    expect(screen.queryByTestId('section')).toBeNull()
    expect(screen.queryByText('Create your first Pod')).toBeNull()
    expect(screen.queryByText('Recent Pods')).toBeNull()
  })

  it('still shows pods when hideEmpty is set', async () => {
    await renderSection({ hideEmpty: true, pods: [pod('1')] })

    expect(screen.getByText('Recent Pods')).toBeTruthy()
    expect(screen.getByText('Pod 1')).toBeTruthy()
  })

  it('still shows the pending state when hideEmpty is set', async () => {
    await renderSection({ hasLoaded: false, hideEmpty: true, status: 'loading' })

    expect(screen.getByText('Recent Pods')).toBeTruthy()
    expect(screen.getByTestId('section-list-pending')).toBeTruthy()
  })

  it('still shows the error when hideEmpty is set', async () => {
    await renderSection({ hasLoaded: false, hideEmpty: true, status: 'error' })

    expect(screen.getByText("Couldn't load pods")).toBeTruthy()
  })

  it('shows the label and no link or Add Pod button without the optional handlers', async () => {
    const view = await render(
      <PodsSectionView
        hasLoaded
        limit={2}
        onDismissEmpty={jest.fn()}
        onPodPress={jest.fn()}
        onRetry={jest.fn()}
        pods={[pod('1')]}
        status="idle"
      />,
    )

    expect(screen.getByText('Recent Pods')).toBeTruthy()
    expect(screen.queryByText('See all pods')).toBeNull()

    await view.rerender(
      <PodsSectionView
        hasLoaded
        limit={2}
        onDismissEmpty={jest.fn()}
        onPodPress={jest.fn()}
        onRetry={jest.fn()}
        pods={[]}
        status="idle"
      />,
    )

    expect(screen.getByText('Create your first Pod')).toBeTruthy()
    expect(screen.queryByText('Add Pod')).toBeNull()
    expect(screen.getByText('Maybe later')).toBeTruthy()
  })

  it('replaces the card with the header and rows once pods arrive', async () => {
    const view = await renderSection()
    expect(screen.getByText('Create your first Pod')).toBeTruthy()

    await view.rerender(
      <PodsSectionView
        hasLoaded
        limit={2}
        onAddPod={jest.fn()}
        onDismissEmpty={jest.fn()}
        onPodPress={jest.fn()}
        onRetry={jest.fn()}
        onSeeAll={jest.fn()}
        pods={[pod('1')]}
        status="idle"
        testID="section"
      />,
    )

    expect(screen.queryByText('Create your first Pod')).toBeNull()
    expect(screen.getByText('Recent Pods')).toBeTruthy()
    expect(screen.getByText('Pod 1')).toBeTruthy()
  })
})
