import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { useRouter } from 'expo-router'
import { createStore, Provider } from 'jotai'

import { createMockPodsApi, MOCK_PODS } from '@/features/pods/api/mock-pods-api'
import { podsApiAtom } from '@/features/pods'
import { HomePods } from './HomePods'

jest.mock('@gorhom/bottom-sheet', () => ({}))

const renderHome = async (pods: typeof MOCK_PODS) => {
  const push = jest.fn()
  jest.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>)
  const store = createStore()
  store.set(podsApiAtom, createMockPodsApi({ latencyMs: 0, pods }))
  await render(
    <Provider store={store}>
      <HomePods />
    </Provider>,
  )
  await act(async () => {
    await jest.runAllTimersAsync()
  })
  return { push }
}

describe('HomePods', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('shows the two most recent pods without a see all link', async () => {
    await renderHome(MOCK_PODS)

    expect(screen.getByText('Recent Pods')).toBeTruthy()
    expect(screen.getByText('About Sofia')).toBeTruthy()
    expect(screen.getByText('Mom & Dad')).toBeTruthy()
    expect(screen.queryByText('Maya')).toBeNull()
    expect(screen.queryByText('See all pods')).toBeNull()
  })

  it('opens the pod screen with the pressed pod id', async () => {
    const { push } = await renderHome(MOCK_PODS)

    await fireEvent.press(screen.getByText('Mom & Dad'))

    expect(push).toHaveBeenCalledWith({ params: { id: 'pod-2' }, pathname: '/pods/[id]' })
  })

  it('shows the first-run card without an Add Pod button when there are no pods', async () => {
    await renderHome([])

    expect(screen.getByText('Create your first Pod')).toBeTruthy()
    expect(screen.getByText('Maybe later')).toBeTruthy()
    expect(screen.queryByText('Add Pod')).toBeNull()
  })

  it('hides the first-run card after Maybe later', async () => {
    await renderHome([])

    await fireEvent.press(screen.getByText('Maybe later'))

    expect(screen.queryByText('Create your first Pod')).toBeNull()
  })
})
