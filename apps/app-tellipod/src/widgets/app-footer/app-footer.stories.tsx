import type { Meta, StoryObj } from '@storybook/react-native'
import type { BottomTabBarProps } from 'expo-router/js-tabs'
import { createStore, Provider } from 'jotai'
import { View } from 'react-native'

import { AppFooter } from './app-footer'
import { unreadNotificationsAtom } from '@/shared/chrome'

const routeNames = ['index', 'ask-telli', 'notifications', 'navigation']

type FooterStoryProps = {
  activeIndex: number
  navigateToTab?: (key: string) => void
  unread: number
}

const FooterStory = ({ activeIndex, navigateToTab = () => undefined, unread }: FooterStoryProps) => {
  const store = createStore()
  store.set(unreadNotificationsAtom, unread)
  const props = {
    emitter: { emit: () => ({ defaultPrevented: false }) },
    navigateToTab,
    state: { index: activeIndex, routes: routeNames.map((name) => ({ key: name, name })) },
  } as unknown as BottomTabBarProps

  return (
    <Provider store={store}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <AppFooter {...props} />
      </View>
    </Provider>
  )
}

const meta = {
  args: { activeIndex: 0, unread: 0 },
  argTypes: {
    activeIndex: { control: { max: 3, min: 0, step: 1, type: 'number' } },
    navigateToTab: { action: 'navigateToTab' },
    unread: { control: { min: 0, step: 1, type: 'number' } },
  },
  component: FooterStory,
} satisfies Meta<typeof FooterStory>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithUnreadNotifications: Story = { args: { unread: 3 } }
