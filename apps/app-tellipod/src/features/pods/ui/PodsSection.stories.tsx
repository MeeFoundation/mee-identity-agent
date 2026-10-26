import type { Meta, StoryObj } from '@storybook/react-native'
import type { ComponentProps } from 'react'
import { View } from 'react-native'

import type { PodSummary } from '../model/pod-summary'
import { PodsSectionView } from './PodsSectionView'
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
  category: { id: 'health-wellness' },
  hasUnread: false,
  id: 'pod-2',
  name: 'Mom & Dad',
  subcategory: null,
}

const maya: PodSummary = {
  avatarUrl: null,
  category: { id: 'pets' },
  hasUnread: false,
  id: 'pod-3',
  name: 'Maya',
  subcategory: null,
}

type SectionProps = ComponentProps<typeof PodsSectionView>
type HandlerName = 'onAddPod' | 'onDismissEmpty' | 'onPodPress' | 'onRetry' | 'onSeeAll'
type PodsSectionStoryProps = Omit<SectionProps, HandlerName> & Partial<Pick<SectionProps, HandlerName>>

const noop = () => undefined

const PodsSectionStory = ({
  onAddPod = noop,
  onDismissEmpty = noop,
  onPodPress = noop,
  onRetry = noop,
  onSeeAll = noop,
  ...props
}: PodsSectionStoryProps) => (
  <PodsSectionView
    {...props}
    onAddPod={onAddPod}
    onDismissEmpty={onDismissEmpty}
    onPodPress={onPodPress}
    onRetry={onRetry}
    onSeeAll={onSeeAll}
  />
)

const meta = {
  args: {
    hasLoaded: true,
    limit: 2,
    pods: [aboutSofia, momAndDad],
    status: 'idle',
  },
  argTypes: {
    onAddPod: { action: 'addPod' },
    onDismissEmpty: { action: 'dismissEmpty' },
    onPodPress: { action: 'podPressed' },
    onRetry: { action: 'retry' },
    onSeeAll: { action: 'seeAll' },
  },
  component: PodsSectionStory,
  decorators: [
    (Story) => (
      <View style={{ padding: spacing[5] }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof PodsSectionStory>

export default meta

type Story = StoryObj<typeof meta>

export const Rows: Story = {}

export const OverLimit: Story = { args: { pods: [aboutSofia, momAndDad, maya] } }

export const Loading: Story = { args: { hasLoaded: false, pods: [], status: 'loading' } }

export const LoadFailed: Story = { args: { hasLoaded: false, pods: [], status: 'error' } }

export const Empty: Story = { args: { pods: [] } }
