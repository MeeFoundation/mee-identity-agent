import type { Meta, StoryObj } from '@storybook/react-native'
import { Text, View } from 'react-native'

import type { PodSummary } from '../model/pod-summary'
import { PodListView } from './PodListView'
import { spacing } from '@/shared/ui'

const aboutSofia: PodSummary = {
  avatarUrl: 'https://picsum.photos/id/64/128',
  category: { id: 'people' },
  hasUnread: true,
  id: 'pod-1',
  name: 'About Sofia',
  subcategory: { id: 'immediate-family' },
}

const momAndDad: PodSummary = {
  avatarUrl: 'https://picsum.photos/id/1011/128',
  category: { id: 'people' },
  hasUnread: false,
  id: 'pod-2',
  name: 'Mom & Dad',
  subcategory: { id: 'immediate-family' },
}

const maya: PodSummary = {
  avatarUrl: null,
  category: { id: 'pets' },
  hasUnread: false,
  id: 'pod-3',
  name: 'Maya',
  subcategory: null,
}

const extra: PodSummary = { ...maya, id: 'pod-4', name: 'Extra pod' }

const noop = () => undefined

const meta = {
  args: {
    hasLoaded: true,
    limit: 3,
    onPodPress: noop,
    onRetry: noop,
    pods: [aboutSofia, momAndDad, maya],
    status: 'idle',
  },
  component: PodListView,
  decorators: [
    (Story) => (
      <View style={{ padding: spacing[5] }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof PodListView>

export default meta

type Story = StoryObj<typeof meta>

export const Rows: Story = {}

export const OverLimit: Story = { args: { pods: [aboutSofia, momAndDad, maya, extra] } }

export const Pending: Story = { args: { hasLoaded: false, pods: [], status: 'loading' } }

export const LoadFailed: Story = { args: { hasLoaded: false, pods: [], status: 'error' } }

export const InlineError: Story = { args: { status: 'error' } }

export const Empty: Story = { args: { pods: [] } }

export const CustomEmpty: Story = {
  args: { pods: [] },
  render: (args) => <PodListView {...args} empty={<Text>Nothing here yet</Text>} />,
}
