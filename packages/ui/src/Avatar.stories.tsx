import type { Meta, StoryObj } from '@storybook/react-native'
import { StyleSheet, Text, View } from 'react-native'

import { Avatar, type AvatarShape, type AvatarSize, type AvatarTone } from './Avatar'

const styles = StyleSheet.create({
  column: {
    gap: 16,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  story: {
    flex: 1,
    padding: 16,
  },
  title: {
    color: '#475569',
    fontSize: 12,
    lineHeight: 16,
  },
})

const sizes: ReadonlyArray<AvatarSize> = ['xl', 'l', 'm', 's', 'xs', 'xxs']
const shapes: ReadonlyArray<AvatarShape> = ['circle', 'rounded']
const tones: ReadonlyArray<AvatarTone> = ['brand', 'gray']

const photo = { uri: 'https://picsum.photos/128' }

const AvatarStory = () => null

const meta = {
  component: AvatarStory,
  decorators: [
    (Story) => (
      <View style={styles.story}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof AvatarStory>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { render: () => <Avatar initials="JD" /> }

export const Sizes: Story = {
  render: () => (
    <View style={styles.column}>
      {shapes.map((shape) => (
        <View key={shape} style={styles.row}>
          {sizes.map((size) => (
            <Avatar initials="JD" key={size} shape={shape} size={size} />
          ))}
        </View>
      ))}
    </View>
  ),
}

export const Tones: Story = {
  render: () => (
    <View style={styles.column}>
      {tones.map((tone) => (
        <View key={tone} style={styles.row}>
          <Text style={styles.title}>{tone}</Text>
          {sizes.map((size) => (
            <Avatar initials="M" key={size} size={size} tone={tone} />
          ))}
        </View>
      ))}
    </View>
  ),
}

export const Images: Story = {
  render: () => (
    <View style={styles.column}>
      {shapes.map((shape) => (
        <View key={shape} style={styles.row}>
          {sizes.map((size) => (
            <Avatar key={size} shape={shape} size={size} source={photo} />
          ))}
        </View>
      ))}
    </View>
  ),
}
