import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { Avatar } from './Avatar'
import { Card, CardChevron } from './Card'
import { CellInfo } from './CellInfo'
import { Diagram3Icon, PaperclipIcon, PeopleIcon } from './icons'
import { Toast, type ToastType } from './Toast'

const styles = StyleSheet.create({
  caption: {
    color: '#475569',
    fontSize: 12,
    lineHeight: 16,
  },
  column: {
    gap: 8,
  },
  floating: {
    bottom: 24,
    left: 12,
    position: 'absolute',
    right: 12,
  },
  screen: {
    backgroundColor: '#EEF4F4',
    borderRadius: 24,
    height: 560,
    overflow: 'hidden',
  },
  scrolled: {
    gap: 12,
    padding: 20,
    paddingBottom: 120,
  },
  section: {
    gap: 24,
  },
  story: {
    flex: 1,
    padding: 16,
  },
})

const types: ReadonlyArray<ToastType> = ['primary', 'secondary', 'tertiary', 'dark', 'success', 'danger', 'warning']

const closeProps = { closeLabel: 'Dismiss', onClose: () => undefined } as const
const actions = [
  { label: 'Action 1', onPress: () => undefined },
  { label: 'Action 2', onPress: () => undefined },
] as const
const longText =
  'Your changes were saved to every member of the pod, and everyone with access will see them the next time they open it.'

const ToastStory = () => null

const meta = {
  component: ToastStory,
  decorators: [
    (Story) => (
      <View style={styles.story}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ToastStory>

export default meta

type Story = StoryObj<typeof meta>

const navigationItems = [
  { icon: <PaperclipIcon />, name: 'Attachments' },
  { icon: <Diagram3Icon />, name: 'Subpods' },
  { icon: <PeopleIcon />, name: 'Members' },
  { icon: <PaperclipIcon />, name: 'Documents' },
  { icon: <PeopleIcon />, name: 'Guests' },
]

const ScrolledCards = () => (
  <ScrollView contentContainerStyle={styles.scrolled}>
    {navigationItems.map(({ icon, name }) => (
      <Card
        header={() => (
          <CellInfo
            icon={icon}
            name={name}
            onPress={() => undefined}
            trailing={<CardChevron expanded={false} />}
            variant="mini-group"
          />
        )}
        key={name}
      />
    ))}
  </ScrollView>
)

export const Default: Story = { render: () => <Toast {...closeProps} title="Changes saved" /> }

export const Types: Story = {
  render: () => (
    <View style={styles.column}>
      {types.map((type) => (
        <Toast {...closeProps} description="Description" key={type} title={type} type={type} />
      ))}
    </View>
  ),
}

export const TitleOnly: Story = {
  render: () => (
    <View style={styles.column}>
      {types.map((type) => (
        <Toast {...closeProps} key={type} title="Invite link sent to Geo" type={type} />
      ))}
    </View>
  ),
}

export const WithDescription: Story = {
  render: () => <Toast {...closeProps} description="Description" title="Title" type="success" />,
}

export const WithoutIcon: Story = {
  render: () => <Toast {...closeProps} description="Description" icon={null} title="Title" />,
}

export const WithAvatar: Story = {
  render: () => (
    <Toast
      {...closeProps}
      avatar={<Avatar initials="GW" shape="circle" size="m" />}
      description="Description"
      title="Title"
      type="success"
    />
  ),
}

export const ActionsRight: Story = {
  render: () => (
    <View style={styles.column}>
      <Toast {...closeProps} actions={[actions[0]]} description="Description" title="Title" type="success" />
      <Toast {...closeProps} actions={actions} description="Description" title="Title" type="success" />
    </View>
  ),
}

export const ActionsBottom: Story = {
  render: () => (
    <View style={styles.column}>
      <Toast
        {...closeProps}
        actions={[actions[0]]}
        actionsPlacement="bottom"
        description="Description"
        title="Title"
        type="success"
      />
      <Toast
        {...closeProps}
        actions={actions}
        actionsPlacement="bottom"
        description="Description"
        title="Title"
        type="success"
      />
    </View>
  ),
}

export const AllSlots: Story = {
  render: () => (
    <View style={styles.column}>
      {(['right', 'bottom'] as const).map((placement) => (
        <Toast
          {...closeProps}
          actions={actions}
          actionsPlacement={placement}
          avatar={<Avatar initials="GW" shape="circle" size="m" />}
          description="Description"
          key={placement}
          title="Title"
          type="success"
        />
      ))}
    </View>
  ),
}

export const WithoutClose: Story = {
  render: () => <Toast actions={[actions[0]]} description="Description" title="Title" type="warning" />,
}

export const LongText: Story = {
  render: () => (
    <View style={styles.column}>
      <Toast {...closeProps} title={longText} />
      <Toast
        {...closeProps}
        actions={actions}
        actionsPlacement="bottom"
        avatar={<Avatar initials="GW" shape="circle" size="m" />}
        description={longText}
        title="Everything is up to date"
        type="success"
      />
    </View>
  ),
}

export const TellipodPinnedToBottom: Story = {
  render: () => (
    <View style={styles.screen}>
      <View style={styles.floating}>
        <Toast {...closeProps} title="Invite link sent to Geo" type="success" />
      </View>
    </View>
  ),
}

export const TellipodFloatingOverContent: Story = {
  render: () => (
    <View style={styles.screen}>
      <ScrolledCards />
      <View style={styles.floating}>
        <Toast {...closeProps} title="All suggested contact info added" type="success" />
      </View>
    </View>
  ),
}

export const AllTypesAndSlots: Story = {
  render: () => (
    <ScrollView contentContainerStyle={styles.section}>
      {types.map((type) => (
        <View key={type} style={styles.column}>
          <Text style={styles.caption}>{type}</Text>
          <Toast {...closeProps} title="Title" type={type} />
          <Toast {...closeProps} description="Description" title="Title" type={type} />
          <Toast
            {...closeProps}
            actions={actions}
            avatar={<Avatar initials="GW" shape="circle" size="m" />}
            description="Description"
            title="Title"
            type={type}
          />
          <Toast
            {...closeProps}
            actions={actions}
            actionsPlacement="bottom"
            description="Description"
            title="Title"
            type={type}
          />
        </View>
      ))}
    </ScrollView>
  ),
}
