import type { Meta, StoryObj } from '@storybook/react-native'
import { type FC, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { Card, CardChevron } from './Card'
import { CellInfo } from './CellInfo'
import { Diagram3Icon, PaperclipIcon, PencilIcon, PeopleIcon } from './icons'
import { Count, FormCard, FormRows, storyStyles } from './storyParts'

const styles = StyleSheet.create({
  countRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  stack: {
    gap: 12,
  },
})

const ControlledFormCard = () => {
  const [expanded, setExpanded] = useState(true)

  return (
    <Card
      expanded={expanded}
      header={({ expanded: isExpanded, toggle }) => (
        <CellInfo
          accessibilityState={{ expanded: isExpanded }}
          icon={<PaperclipIcon />}
          name="Attachments"
          onPress={toggle}
          trailing={<CardChevron expanded={isExpanded} />}
          variant="mini-group"
        />
      )}
      onExpandedChange={setExpanded}
    >
      <FormRows>
        <CellInfo label="Passport" trailing={<PencilIcon />} value="passport.pdf" variant="info" />
        <CellInfo label="Visa" trailing={<PencilIcon />} value="visa.pdf" variant="info" />
      </FormRows>
    </Card>
  )
}

const navigationItems = [
  { count: 0, icon: <PaperclipIcon />, name: 'Attachments' },
  { count: 0, icon: <Diagram3Icon />, name: 'Subpods' },
  { count: 1, icon: <PeopleIcon />, name: 'Members' },
]

const NavigationCards: FC<{ withCount: boolean }> = ({ withCount }) => (
  <View style={styles.stack}>
    {navigationItems.map(({ icon, name, count }) => (
      <Card
        header={() => (
          <CellInfo
            icon={icon}
            name={name}
            onPress={() => undefined}
            trailing={
              withCount ? (
                <View style={styles.countRow}>
                  <Count value={count} />
                  <CardChevron expanded={false} />
                </View>
              ) : (
                <CardChevron expanded={false} />
              )
            }
            variant="mini-group"
          />
        )}
        key={name}
      />
    ))}
  </View>
)

const CardStory = () => null

const meta = {
  component: CardStory,
  decorators: [
    (Story) => (
      <View style={storyStyles.story}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof CardStory>

export default meta

type Story = StoryObj<typeof meta>

export const ExpandableForm: Story = { render: () => <FormCard /> }

export const CollapsedForm: Story = { render: () => <FormCard defaultExpanded={false} /> }

export const ControlledCard: Story = { render: () => <ControlledFormCard /> }

export const NavigationRows: Story = { render: () => <NavigationCards withCount={false} /> }

export const NavigationRowsWithCount: Story = { render: () => <NavigationCards withCount /> }
