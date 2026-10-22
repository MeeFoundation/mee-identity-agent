import type { Meta, StoryObj } from '@storybook/react-native'
import { type ComponentProps, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { type TabItem, Tabs } from './Tabs'

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    borderColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  circleDot: {
    backgroundColor: '#0F172A',
    borderRadius: 2,
    height: 8,
    width: 8,
  },
  glyph: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  glyphText: {
    color: '#0F172A',
    fontSize: 22,
    lineHeight: 24,
  },
  story: {
    padding: 16,
  },
  toggle: {
    alignSelf: 'flex-start',
    marginTop: 16,
    padding: 8,
  },
})

const PlusIcon = () => (
  <View style={styles.glyph}>
    <Text style={styles.glyphText}>+</Text>
  </View>
)

const StopCircleIcon = () => (
  <View style={styles.circle}>
    <View style={styles.circleDot} />
  </View>
)

const plainItems: TabItem[] = [
  { key: 'one', label: 'Tab label' },
  { key: 'two', label: 'Tab label' },
  { key: 'three', label: 'Tab label' },
]

const variedItems: TabItem[] = [
  { key: 'all', label: 'All' },
  { key: 'connections', label: 'Connections' },
  { key: 'requests', label: 'Pending requests' },
  { key: 'archive', label: 'Archive' },
]

const longItems: TabItem[] = [
  { key: 'one', label: 'A very long tab label that cannot fit' },
  { key: 'two', label: 'Another extremely long tab label' },
  { key: 'three', label: 'Third long label that is cut off' },
]

const manyItems: TabItem[] = Array.from({ length: 10 }, (_, index) => ({
  key: `tab-${index + 1}`,
  label: `Tab ${index + 1}`,
}))

type StoryArgs = Pick<ComponentProps<typeof Tabs>, 'items' | 'size' | 'value' | 'fullWidth'> & { icons: boolean }

const withIcons = (items: TabItem[]): TabItem[] =>
  items.map((item) => ({ ...item, iconLeft: <PlusIcon />, iconRight: <StopCircleIcon /> }))

const StatefulTabs = ({ items, icons, size, fullWidth, value: initialValue }: StoryArgs) => {
  const [value, setValue] = useState(initialValue)

  return (
    <Tabs
      fullWidth={fullWidth}
      items={icons ? withIcons(items) : items}
      onValueChange={setValue}
      size={size}
      value={value}
    />
  )
}

const EditableLabelTabs = ({ items, size, value: initialValue }: StoryArgs) => {
  const [value, setValue] = useState(initialValue)
  const [longLabel, setLongLabel] = useState(false)
  const editedItems = items.map((item) =>
    item.key === initialValue && longLabel ? { ...item, label: 'A much longer label' } : item,
  )

  return (
    <View>
      <Tabs items={editedItems} onValueChange={setValue} size={size} value={value} />
      <Pressable accessibilityRole="button" onPress={() => setLongLabel((current) => !current)} style={styles.toggle}>
        <Text>Toggle first tab label length</Text>
      </Pressable>
    </View>
  )
}

const meta = {
  args: { fullWidth: false, icons: false, items: plainItems, size: 'M', value: 'one' },
  argTypes: {
    fullWidth: { control: 'boolean' },
    icons: { control: 'boolean' },
    size: { control: 'radio', options: ['M', 'L'] },
  },
  decorators: [
    (Story) => (
      <View style={styles.story}>
        <Story />
      </View>
    ),
  ],
  render: (args) => <StatefulTabs {...args} />,
} satisfies Meta<StoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Medium: Story = {}

export const Large: Story = { args: { size: 'L' } }

export const WithIcons: Story = { args: { icons: true } }

export const LargeWithIcons: Story = { args: { icons: true, size: 'L' } }

export const VaryingLabelLengths: Story = { args: { items: variedItems, value: 'all' } }

export const Overflow: Story = { args: { items: manyItems, value: 'tab-1' } }

export const FullWidth: Story = { args: { fullWidth: true } }

export const FullWidthLarge: Story = { args: { fullWidth: true, size: 'L' } }

export const FullWidthTruncated: Story = { args: { fullWidth: true, items: longItems } }

export const FullWidthTruncatedWithIcons: Story = { args: { fullWidth: true, icons: true, items: longItems } }

export const EditableLabel: Story = {
  args: { items: variedItems, value: 'all' },
  render: (args) => <EditableLabelTabs {...args} />,
}
