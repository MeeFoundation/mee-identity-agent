import type { Meta, StoryObj } from '@storybook/react-native'
import { View } from 'react-native'

import { CellInfo } from './CellInfo'
import { ChevronRightIcon, FolderPlusIcon, PlusIcon } from './icons'
import { Panel } from './Panel'
import { EmptyFormsCard, FormCard, storyStyles } from './storyParts'

const MemberList = () => (
  <Panel footer={{ icon: <PlusIcon />, label: 'Invite member', onPress: () => undefined, variant: 'outline' }}>
    <CellInfo initial="B" name="Bogdan (You)" roleLabel="Dad" trailing={<ChevronRightIcon />} variant="member" />
    <CellInfo initial="G" name="Geo" roleLabel="Mum" trailing={<ChevronRightIcon />} variant="member" />
    <CellInfo initial="A" name="Andrew" roleLabel="Uncle" trailing={<ChevronRightIcon />} variant="member" />
  </Panel>
)

const FormsPanel = () => (
  <Panel footer={{ icon: <FolderPlusIcon />, label: 'Create form', onPress: () => undefined, variant: 'ghost' }}>
    <FormCard />
  </Panel>
)

const TwoFormsPanel = () => (
  <Panel
    footer={{ icon: <FolderPlusIcon />, label: 'Create form', onPress: () => undefined, variant: 'ghost' }}
    gap={12}
  >
    <FormCard />
    <FormCard
      addLabel="Add address"
      defaultExpanded={false}
      rows={[
        { label: 'Street', value: '318 Fillmore St, Apt 4B' },
        { label: 'City', value: 'San Francisco' },
      ]}
      title="Address"
    />
  </Panel>
)

const EmptyFormsPanel = () => (
  <Panel footer={{ icon: <PlusIcon />, label: 'Add form', onPress: () => undefined, variant: 'ghost' }}>
    <EmptyFormsCard />
  </Panel>
)

const PanelStory = () => null

const meta = {
  component: PanelStory,
  decorators: [
    (Story) => (
      <View style={storyStyles.story}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof PanelStory>

export default meta

type Story = StoryObj<typeof meta>

export const Members: Story = { render: () => <MemberList /> }

export const FormWithCreateFooter: Story = { render: () => <FormsPanel /> }

export const TwoForms: Story = { render: () => <TwoFormsPanel /> }

export const EmptyForms: Story = { render: () => <EmptyFormsPanel /> }
