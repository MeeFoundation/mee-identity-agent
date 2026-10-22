import { act, fireEvent, render, screen } from '@testing-library/react-native'
import type { BottomTabBarProps } from 'expo-router/js-tabs'
import { createStore, Provider } from 'jotai'

import { AppFooter } from './app-footer'
import { chromeAtom, DEFAULT_CHROME, unreadNotificationsAtom } from '@/shared/chrome'

const names = ['index', 'ask-telli', 'notifications', 'navigation']

const renderFooter = async (activeIndex = 0) => {
  const store = createStore()
  const navigateToTab = jest.fn()
  const emit = jest.fn(() => ({ defaultPrevented: false }))
  const props = {
    emitter: { emit },
    navigateToTab,
    state: { index: activeIndex, routes: names.map((name) => ({ key: `${name}-key`, name })) },
  } as unknown as BottomTabBarProps
  const utils = await render(
    <Provider store={store}>
      <AppFooter {...props} />
    </Provider>,
  )
  return { ...utils, navigate: navigateToTab, store }
}

describe('AppFooter', () => {
  it('shows four tabs in order', async () => {
    await renderFooter()
    expect(screen.getAllByRole('tab')).toHaveLength(4)
    expect(screen.getAllByText(/Home|Ask Telli|Notifications|Navigation/).map((n) => n.props.children)).toEqual([
      'Home',
      'Ask Telli',
      'Notifications',
      'Navigation',
    ])
  })

  it('marks only the active tab as selected', async () => {
    await renderFooter(2)
    const selected = screen.getAllByRole('tab').map((tab) => tab.props.accessibilityState.selected)
    expect(selected).toEqual([false, false, true, false])
  })

  it('navigates when an inactive tab is pressed', async () => {
    const { navigate } = await renderFooter(0)
    await fireEvent.press(screen.getByText('Notifications'))
    expect(navigate).toHaveBeenCalledWith('notifications-key')
  })

  it('does not navigate when the active tab is pressed', async () => {
    const { navigate } = await renderFooter(0)
    await fireEvent.press(screen.getByText('Home'))
    expect(navigate).not.toHaveBeenCalled()
  })

  it('shows the unread indicator only while unread notifications exist', async () => {
    const { store } = await renderFooter(3)
    expect(screen.queryByLabelText('Unread notifications')).toBeNull()

    await act(async () => store.set(unreadNotificationsAtom, 2))
    expect(screen.getByLabelText('Unread notifications')).toBeTruthy()

    await act(async () => store.set(unreadNotificationsAtom, 0))
    expect(screen.queryByLabelText('Unread notifications')).toBeNull()
  })

  it('renders nothing while the footer is hidden and returns when visible again', async () => {
    const { store } = await renderFooter()
    await act(async () => store.set(chromeAtom, { ...DEFAULT_CHROME, footer: 'hidden' }))
    expect(screen.queryAllByRole('tab')).toHaveLength(0)

    await act(async () => store.set(chromeAtom, DEFAULT_CHROME))
    expect(screen.getAllByRole('tab')).toHaveLength(4)
  })
})
