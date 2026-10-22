import { act, fireEvent, render, screen } from '@testing-library/react-native'
import type { BottomTabBarProps } from 'expo-router/js-tabs'
import { createStore, Provider } from 'jotai'

import { AppFooter } from './app-footer'
import { FooterTab, timing } from './footer-tab'
import { chromeAtom, DEFAULT_CHROME, unreadNotificationsAtom } from '@/shared/chrome'
import { BellFilledIcon, BellIcon, colors } from '@/shared/ui'

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
    expect(screen.getAllByText(/Home|Telli Guide|Notifications|Navigation/).map((n) => n.props.children)).toEqual([
      'Home',
      'Telli Guide',
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

  it('keeps the animated active layer out of the accessibility tree', async () => {
    await renderFooter(1)
    expect(screen.getAllByText('Telli Guide')).toHaveLength(1)
    expect(screen.getAllByRole('tab')).toHaveLength(4)
  })

  it('leaves exactly one selected tab and one announced label per tab after switching twice quickly', async () => {
    const { rerender } = await renderFooter(0)
    const store = createStore()
    const props = (activeIndex: number) =>
      ({
        emitter: { emit: () => ({ defaultPrevented: false }) },
        navigateToTab: jest.fn(),
        state: { index: activeIndex, routes: names.map((name) => ({ key: `${name}-key`, name })) },
      }) as unknown as BottomTabBarProps

    await rerender(
      <Provider store={store}>
        <AppFooter {...props(1)} />
      </Provider>,
    )
    await rerender(
      <Provider store={store}>
        <AppFooter {...props(2)} />
      </Provider>,
    )

    const selected = screen.getAllByRole('tab').map((tab) => tab.props.accessibilityState.selected)
    expect(selected).toEqual([false, false, true, false])
    for (const label of ['Home', 'Telli Guide', 'Notifications', 'Navigation']) {
      expect(screen.getAllByText(label)).toHaveLength(1)
    }
  })

  it('animates color with the system reduce-motion setting', () => {
    expect(timing.reduceMotion).toBe('system')
  })

  it('renders nothing while the footer is hidden and returns when visible again', async () => {
    const { store } = await renderFooter()
    await act(async () => store.set(chromeAtom, { ...DEFAULT_CHROME, footer: 'hidden' }))
    expect(screen.queryAllByRole('tab')).toHaveLength(0)

    await act(async () => store.set(chromeAtom, DEFAULT_CHROME))
    expect(screen.getAllByRole('tab')).toHaveLength(4)
  })
})

describe('FooterTab', () => {
  const icons = { filled: BellFilledIcon, outline: BellIcon }

  it.each([
    [false, 0],
    [true, 1],
  ])('shows the active layer at the focused opacity (focused: %s)', async (focused, opacity) => {
    await render(<FooterTab focused={focused} icons={icons} label="Bell" showBadge={false} unreadLabel="Unread" />)
    expect(screen.getByTestId('footer-tab-active-layer', { includeHiddenElements: true })).toHaveStyle({ opacity })
  })

  it('renders the inactive layer in slate and the active layer in brand color', async () => {
    await render(<FooterTab focused={false} icons={icons} label="Bell" showBadge={false} unreadLabel="Unread" />)
    const [inactive, active] = screen.getAllByText('Bell', { includeHiddenElements: true })
    expect(inactive).toHaveStyle({ color: colors.textGraySolid })
    expect(active).toHaveStyle({ color: colors.textBrandMain })
  })
})
