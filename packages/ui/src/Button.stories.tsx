import type { Meta, StoryObj } from '@storybook/react-native'
import { View } from 'react-native'

import { Button } from './Button'

const meta = {
  args: { children: 'Button', disabled: false, size: 'md', variant: 'primary' },
  argTypes: {
    onPress: { action: 'pressed' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'radio', options: ['primary', 'secondary', 'danger'] },
  },
  component: Button,
  decorators: [
    (Story) => (
      <View style={{ alignItems: 'flex-start', padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Secondary: Story = { args: { variant: 'secondary' } }

export const Danger: Story = { args: { variant: 'danger' } }

export const Small: Story = { args: { size: 'sm' } }

export const Large: Story = { args: { size: 'lg' } }

export const Disabled: Story = { args: { disabled: true } }
