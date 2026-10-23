import type { Meta, StoryObj } from '@storybook/react-native'
import { StyleSheet, Text, View } from 'react-native'

import {
  ChevronDownIcon,
  ChevronRightIcon,
  Diagram3Icon,
  FolderPlusIcon,
  PaperclipIcon,
  PencilIcon,
  PeopleIcon,
  PersonVideoIcon,
  PlusIcon,
} from '.'

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    gap: 8,
    width: 96,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    padding: 16,
  },
  name: {
    fontSize: 10,
  },
})

const icons = {
  ChevronDownIcon,
  ChevronRightIcon,
  Diagram3Icon,
  FolderPlusIcon,
  PaperclipIcon,
  PencilIcon,
  PeopleIcon,
  PersonVideoIcon,
  PlusIcon,
}

const IconGallery = ({ color, size }: { color?: string; size?: number }) => (
  <View style={styles.gallery}>
    {Object.entries(icons).map(([name, Icon]) => (
      <View key={name} style={styles.cell}>
        <Icon color={color} size={size} />
        <Text style={styles.name}>{name}</Text>
      </View>
    ))}
  </View>
)

const meta = {
  argTypes: {
    color: { control: 'color' },
    size: { control: { max: 64, min: 12, step: 2, type: 'number' } },
  },
  component: IconGallery,
} satisfies Meta<typeof IconGallery>

export default meta

type Story = StoryObj<typeof meta>

export const DesignSize: Story = {}

export const Large: Story = { args: { size: 40 } }

export const Tinted: Story = { args: { color: '#B91C1C' } }
