import type { Meta, StoryObj } from '@storybook/react-native'
import { StyleSheet, View } from 'react-native'

import { Breadcrumbs } from './Breadcrumbs'
import { PeopleIcon } from './icons'

const styles = StyleSheet.create({
  column: {
    gap: 16,
  },
  narrow: {
    width: 160,
  },
  story: {
    flex: 1,
    padding: 16,
  },
})

const brand = '#3B5B63'

const BreadcrumbsStory = () => null

const meta = {
  component: BreadcrumbsStory,
  decorators: [
    (Story) => (
      <View style={styles.story}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof BreadcrumbsStory>

export default meta

type Story = StoryObj<typeof meta>

export const SingleItem: Story = { render: () => <Breadcrumbs items={[{ label: 'Pets' }]} /> }

export const TwoItems: Story = {
  render: () => <Breadcrumbs items={[{ label: 'People' }, { label: 'Immediate Family' }]} />,
}

export const WithIcon: Story = {
  render: () => (
    <View style={styles.column}>
      <Breadcrumbs items={[{ icon: <PeopleIcon color={brand} size={14} />, label: 'People' }]} />
      <Breadcrumbs
        items={[{ icon: <PeopleIcon color={brand} size={14} />, label: 'People' }, { label: 'Immediate Family' }]}
      />
    </View>
  ),
}

export const CurrentItem: Story = {
  render: () => (
    <Breadcrumbs
      items={[
        { icon: <PeopleIcon color={brand} size={14} />, label: 'People' },
        { label: 'Immediate Family' },
        { current: true, label: 'Sofia' },
      ]}
    />
  ),
}

export const ManyItems: Story = {
  render: () => (
    <Breadcrumbs
      items={[
        { label: 'Home' },
        { label: 'People' },
        { label: 'Family' },
        { label: 'Immediate Family' },
        { current: true, label: 'Sofia' },
      ]}
    />
  ),
}

export const NarrowContainer: Story = {
  render: () => (
    <View style={styles.narrow}>
      <Breadcrumbs
        items={[{ icon: <PeopleIcon color={brand} size={14} />, label: 'People' }, { label: 'Immediate Family' }]}
      />
    </View>
  ),
}
