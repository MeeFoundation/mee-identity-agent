import type { Meta, StoryObj } from '@storybook/react-native'
import { createStore, Provider } from 'jotai'
import { View } from 'react-native'

import { AppHeader } from './app-header'
import { type ChromeConfig, chromeAtom, type PodTab } from '@/shared/chrome'
import { userNameAtom } from '@/shared/user'

type HeaderStoryProps = {
  header: ChromeConfig['header']
  onTabChange?: (tab: PodTab) => void
  podTab: PodTab
  userName: string
}

const HeaderStory = ({ header, onTabChange = () => undefined, podTab, userName }: HeaderStoryProps) => {
  const store = createStore()
  store.set(userNameAtom, userName)
  store.set(chromeAtom, {
    footer: 'visible',
    header,
    owner: null,
    pod: {
      breadcrumb: [{ icon: 'people', label: 'Family' }, { label: 'Home pod' }],
      onTabChange,
      tab: podTab,
      title: 'Home pod',
    },
  })

  return (
    <Provider store={store}>
      <View>
        <AppHeader />
      </View>
    </Provider>
  )
}

const meta = {
  args: { header: 'home', podTab: 'notes', userName: '' },
  argTypes: {
    header: { control: 'radio', options: ['home', 'back-search', 'pod'] },
    onTabChange: { action: 'tabChanged' },
    podTab: { control: 'radio', options: ['notes', 'chat', 'info'] },
  },
  component: HeaderStory,
} satisfies Meta<typeof HeaderStory>

export default meta

type Story = StoryObj<typeof meta>

export const Home: Story = {}

export const HomeWithName: Story = { args: { userName: 'Dmitry' } }

export const BackSearch: Story = { args: { header: 'back-search' } }

export const Pod: Story = { args: { header: 'pod' } }
