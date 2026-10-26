import type { Meta, StoryObj } from '@storybook/react-native'
import { View } from 'react-native'

import type { PodSummary } from '../model/pod-summary'
import { PodCard } from './PodCard'
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

const longName: PodSummary = {
  ...aboutSofia,
  id: 'pod-4',
  name: 'A very long pod name that does not fit in the row at all',
}

const noop = () => undefined

type PodCardListProps = { readonly pods: ReadonlyArray<PodSummary> }

const PodCardList = ({ pods }: PodCardListProps) => (
  <View style={{ gap: spacing[3], padding: spacing[5] }}>
    {pods.map((pod) => (
      <PodCard key={pod.id} onPress={noop} pod={pod} />
    ))}
  </View>
)

const meta = {
  args: { pods: [aboutSofia, momAndDad, maya] },
  component: PodCardList,
} satisfies Meta<typeof PodCardList>

export default meta

type Story = StoryObj<typeof meta>

export const Rows: Story = {}

export const LongName: Story = { args: { pods: [longName] } }

export const CategoryOnly: Story = {
  args: { pods: [{ ...maya, category: { id: 'health-wellness' }, id: 'pod-5', name: 'Health' }] },
}
