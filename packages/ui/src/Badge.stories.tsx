import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { Badge, type BadgeShape, type BadgeSize, type BadgeType, type BadgeVariant } from './Badge'

const styles = StyleSheet.create({
  column: {
    gap: 8,
  },
  glyph: {
    alignItems: 'center',
    height: 16,
    justifyContent: 'center',
    width: 16,
  },
  glyphText: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 16,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  section: {
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

const types: BadgeType[] = ['primary', 'secondary', 'success', 'danger', 'warning']
const variants: BadgeVariant[] = ['solid', 'light', 'outlined']
const sizes: BadgeSize[] = ['xxs', 'xs', 's', 'm']
const shapes: BadgeShape[] = ['rounded', 'pill', 'circle', 'dot']

const labelFor = (shape: BadgeShape) => (shape === 'circle' ? '9+' : 'Label')

const Glyph = ({ glyph }: { glyph: string }) => (
  <View style={styles.glyph}>
    <Text style={styles.glyphText}>{glyph}</Text>
  </View>
)

const BadgeStory = () => null

const meta = {
  component: BadgeStory,
  decorators: [
    (Story) => (
      <View style={styles.story}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof BadgeStory>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { render: () => <Badge>Label</Badge> }

export const Types: Story = {
  render: () => (
    <View style={styles.column}>
      {variants.map((variant) => (
        <View key={variant} style={styles.row}>
          {types.map((type) => (
            <Badge key={type} type={type} variant={variant}>
              {type}
            </Badge>
          ))}
        </View>
      ))}
    </View>
  ),
}

export const Sizes: Story = {
  render: () => (
    <View style={styles.row}>
      {sizes.map((size) => (
        <Badge key={size} size={size}>
          {size}
        </Badge>
      ))}
    </View>
  ),
}

export const Shapes: Story = {
  render: () => (
    <View style={styles.row}>
      {shapes.map((shape) => (
        <Badge key={shape} shape={shape}>
          {labelFor(shape)}
        </Badge>
      ))}
    </View>
  ),
}

export const WithDotAndIcons: Story = {
  render: () => (
    <Badge dot leadingIcon={<Glyph glyph="✓" />} trailingIcon={<Glyph glyph="i" />}>
      Label
    </Badge>
  ),
}

export const Count: Story = {
  render: () => (
    <View style={styles.row}>
      <Badge shape="circle" type="danger">
        9
      </Badge>
      <Badge shape="circle" type="danger">
        99+
      </Badge>
      <Badge shape="circle" type="primary" variant="light">
        9+
      </Badge>
    </View>
  ),
}

export const DotIndicator: Story = {
  render: () => (
    <View style={styles.row}>
      {sizes.map((size) => (
        <Badge accessibilityLabel="Unread" key={size} shape="dot" size={size} type="danger" />
      ))}
    </View>
  ),
}

export const LongLabel: Story = {
  render: () => (
    <View style={{ width: 120 }}>
      <Badge>A very long badge label that does not fit</Badge>
    </View>
  ),
}

export const AllCombinations: Story = {
  render: () => (
    <ScrollView contentContainerStyle={styles.section}>
      {sizes.map((size) => (
        <View key={size} style={styles.column}>
          <Text style={styles.title}>{size}</Text>
          {variants.map((variant) => (
            <View key={variant} style={styles.row}>
              {types.map((type) =>
                shapes.map((shape) => (
                  <Badge key={`${type}-${shape}`} shape={shape} size={size} type={type} variant={variant}>
                    {labelFor(shape)}
                  </Badge>
                )),
              )}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  ),
}
