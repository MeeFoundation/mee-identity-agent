import type { Meta, StoryObj } from '@storybook/react-native'
import { Text, View } from 'react-native'

import {
  ArrowRightIcon,
  BellFilledIcon,
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CookieIcon,
  HeartsIcon,
  HomeFilledIcon,
  HomeIcon,
  type IconProps,
  ListNestedIcon,
  PeopleIcon,
  PlusIcon,
  SearchIcon,
  ShieldLockIcon,
  TelliGuideIcon,
  ThreeDotsVerticalIcon,
} from './index'

const icons = {
  ArrowRightIcon,
  BellFilledIcon,
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CookieIcon,
  HeartsIcon,
  HomeFilledIcon,
  HomeIcon,
  ListNestedIcon,
  PeopleIcon,
  PlusIcon,
  SearchIcon,
  ShieldLockIcon,
  TelliGuideIcon,
  ThreeDotsVerticalIcon,
}

const IconGallery = ({ color, size }: IconProps) => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24, padding: 16 }}>
    {Object.entries(icons).map(([name, Icon]) => (
      <View key={name} style={{ alignItems: 'center', gap: 8, width: 96 }}>
        <Icon color={color} size={size} />
        <Text style={{ fontSize: 10 }}>{name}</Text>
      </View>
    ))}
  </View>
)

const meta = {
  args: { color: '#334155', size: 24 },
  argTypes: {
    color: { control: 'color' },
    size: { control: { max: 64, min: 12, step: 2, type: 'number' } },
  },
  component: IconGallery,
} satisfies Meta<typeof IconGallery>

export default meta

type Story = StoryObj<typeof meta>

export const Gallery: Story = {}
