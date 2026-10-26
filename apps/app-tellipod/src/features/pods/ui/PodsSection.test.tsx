import { act, render, screen } from '@testing-library/react-native'
import { createStore, Provider } from 'jotai'

import { createMockPodsApi, MOCK_PODS } from '../api/mock-pods-api'
import { podsApiAtom } from '../store/pods-store'
import { PodsSection } from './PodsSection'

jest.mock('@gorhom/bottom-sheet', () => ({}))

const params = { sort: 'last_activity' } as const

const renderSection = (pods: typeof MOCK_PODS) => {
  const store = createStore()
  store.set(podsApiAtom, createMockPodsApi({ latencyMs: 0, pods }))
  return render(
    <Provider store={store}>
      <PodsSection
        limit={2}
        onAddPod={jest.fn()}
        onDismissEmpty={jest.fn()}
        onPodPress={jest.fn()}
        onSeeAll={jest.fn()}
        params={params}
        testID="section"
      />
    </Provider>,
  )
}

describe('PodsSection', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('loads the recent pods and shows them under the header', async () => {
    await renderSection(MOCK_PODS)

    expect(screen.getByTestId('section-list-pending')).toBeTruthy()

    await act(async () => {
      await jest.runAllTimersAsync()
    })

    expect(screen.getByText('Recent Pods')).toBeTruthy()
    expect(screen.getByText('About Sofia')).toBeTruthy()
    expect(screen.getByText('Mom & Dad')).toBeTruthy()
    expect(screen.queryByText('Maya')).toBeNull()
  })

  it('shows the first-run card when the user has no pods', async () => {
    await renderSection([])

    await act(async () => {
      await jest.runAllTimersAsync()
    })

    expect(screen.getByText('Create your first Pod')).toBeTruthy()
    expect(screen.queryByText('Recent Pods')).toBeNull()
  })
})
