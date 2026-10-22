import type { Meta, StoryObj } from '@storybook/react-native'
import { StyleSheet, Text, View } from 'react-native'

import { CellInfo, type CellInfoProps } from './CellInfo'

const styles = StyleSheet.create({
  chevron: {
    borderColor: '#0F172A',
    borderRightWidth: 1.5,
    borderTopWidth: 1.5,
    height: 8,
    marginLeft: -3,
    transform: [{ rotate: '45deg' }],
    width: 8,
  },
  filledCircle: {
    alignItems: 'center',
    backgroundColor: '#4F868E',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  filledCircleText: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 20,
  },
  glyph: {
    alignItems: 'center',
    height: 16,
    justifyContent: 'center',
    width: 16,
  },
  glyphText: {
    color: '#0F172A',
    fontSize: 14,
    lineHeight: 16,
  },
  groupGlyph: {
    alignItems: 'center',
    height: 18,
    justifyContent: 'center',
    width: 18,
  },
  largeGlyph: {
    alignItems: 'center',
    borderColor: '#B91C1C',
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  largeGlyphText: {
    color: '#B91C1C',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
  story: {
    padding: 16,
  },
})

const SmallIcon = ({ glyph }: { glyph: string }) => (
  <View style={styles.glyph}>
    <Text style={styles.glyphText}>{glyph}</Text>
  </View>
)

const ChevronIcon = () => (
  <View style={styles.glyph}>
    <View style={styles.chevron} />
  </View>
)

const SuggestedAddIcon = () => (
  <View style={styles.filledCircle}>
    <Text style={styles.filledCircleText}>+</Text>
  </View>
)

const ConflictIcon = () => (
  <View style={styles.largeGlyph}>
    <Text style={styles.largeGlyphText}>!</Text>
  </View>
)

const GroupIcon = () => (
  <View style={styles.groupGlyph}>
    <Text style={styles.glyphText}>◫</Text>
  </View>
)

const variants = {
  'add-info-in-chat': {
    label: 'Label',
    section: 'Section',
    trailing: <SmallIcon glyph="+" />,
    variant: 'add-info-in-chat',
  },
  'another-user-submitted': {
    initial: 'G',
    label: 'Label',
    value: 'Value',
    variant: 'another-user-submitted',
  },
  'conflicting-data': {
    label: 'Label',
    trailing: <ConflictIcon />,
    value: 'Value',
    variant: 'conflicting-data',
  },
  info: {
    label: 'Label',
    trailing: <SmallIcon glyph="✎" />,
    value: 'Value',
    variant: 'info',
  },
  'info-added-in-chat': {
    label: 'Label',
    section: 'Section',
    trailing: <SmallIcon glyph="✎" />,
    value: 'Value',
    variant: 'info-added-in-chat',
  },
  member: {
    initial: 'M',
    name: 'FirstName',
    roleLabel: 'Role',
    trailing: <ChevronIcon />,
    variant: 'member',
  },
  'mini-group': {
    icon: <GroupIcon />,
    name: 'Passport',
    trailing: <ChevronIcon />,
    variant: 'mini-group',
  },
  'suggested-info': {
    label: 'Label',
    suggestedLabel: '(suggested)',
    trailing: <SuggestedAddIcon />,
    value: 'Value',
    variant: 'suggested-info',
  },
} satisfies Record<CellInfoProps['variant'], CellInfoProps>

const variantOrder: CellInfoProps['variant'][] = [
  'member',
  'mini-group',
  'info',
  'suggested-info',
  'another-user-submitted',
  'conflicting-data',
  'info-added-in-chat',
  'add-info-in-chat',
]

const CellInfoStory = () => null

const meta = {
  component: CellInfoStory,
  decorators: [
    (Story) => (
      <View style={styles.story}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof CellInfoStory>

export default meta

type Story = StoryObj<typeof meta>

export const Member: Story = { render: () => <CellInfo {...variants.member} /> }

export const MiniGroup: Story = { render: () => <CellInfo {...variants['mini-group']} /> }

export const Info: Story = { render: () => <CellInfo {...variants.info} /> }

export const InfoWithNewBadge: Story = { render: () => <CellInfo {...variants.info} isNew newLabel="NEW" /> }

export const SuggestedInfo: Story = { render: () => <CellInfo {...variants['suggested-info']} /> }

export const AnotherUserSubmitted: Story = { render: () => <CellInfo {...variants['another-user-submitted']} /> }

export const ConflictingData: Story = { render: () => <CellInfo {...variants['conflicting-data']} /> }

export const InfoAddedInChat: Story = { render: () => <CellInfo {...variants['info-added-in-chat']} /> }

export const AddInfoInChat: Story = { render: () => <CellInfo {...variants['add-info-in-chat']} /> }

export const MemberWithoutRole: Story = { render: () => <CellInfo {...variants.member} roleLabel={undefined} /> }

export const LongText: Story = {
  render: () => (
    <CellInfo
      {...variants.info}
      label="A very long label that cannot fit in the row width"
      value="A very long value that cannot fit in the row width and is cut off with an ellipsis"
    />
  ),
}

export const Pressable: Story = { render: () => <CellInfo {...variants.info} onPress={() => undefined} /> }

export const AllVariants: Story = {
  render: () => (
    <View>
      {variantOrder.map((variant) => (
        <CellInfo key={variant} {...variants[variant]} />
      ))}
    </View>
  ),
}
