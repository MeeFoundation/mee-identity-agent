import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { Button } from './Button'
import * as Field from './fieldParts'
import * as InputGroup from './inputGroupParts'
import { Sheet, type SheetProps } from './Sheet'

const styles = StyleSheet.create({
  form: {
    gap: 24,
  },
  note: {
    color: '#475569',
    fontFamily: 'PublicSans_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  open: {
    alignSelf: 'flex-start',
    borderColor: '#4F868E',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  openLabel: {
    color: '#4F868E',
    fontFamily: 'PublicSans_600SemiBold',
    fontSize: 16,
  },
  row: {
    color: '#1E293B',
    fontFamily: 'PublicSans_400Regular',
    fontSize: 16,
    paddingVertical: 12,
  },
  story: {
    padding: 16,
  },
})

type Content = 'form' | 'long'

type StoryArgs = Pick<SheetProps, 'title' | 'description' | 'dismissible'> & { content: Content }

const fields = [
  { label: 'Form', value: 'Contact info' },
  { label: 'Label', value: 'First name' },
  { label: 'Value', value: 'Sofia' },
]

const FormContent = ({ onSave }: { onSave: () => void }) => (
  <View style={styles.form}>
    {fields.map((field) => (
      <Field.Root key={field.label} size="L">
        <Field.Label>{field.label}</Field.Label>
        <InputGroup.Root>
          <InputGroup.Input component={BottomSheetTextInput} defaultValue={field.value} />
        </InputGroup.Root>
      </Field.Root>
    ))}
    <Button onPress={onSave} size="lg">
      Save
    </Button>
  </View>
)

const LongRows = () => (
  <View>
    {Array.from({ length: 30 }, (_, index) => (
      <Text key={`row-${index + 1}`} style={styles.row}>
        Row {index + 1}
      </Text>
    ))}
  </View>
)

const StatefulSheet = ({ content, ...props }: StoryArgs) => {
  const [visible, setVisible] = useState(false)
  const close = () => setVisible(false)

  return (
    <View style={styles.story}>
      <Pressable accessibilityRole="button" onPress={() => setVisible(true)} style={styles.open}>
        <Text style={styles.openLabel}>Open sheet</Text>
      </Pressable>
      <Sheet {...props} onDismiss={close} visible={visible}>
        {content === 'form' ? <FormContent onSave={close} /> : <LongRows />}
      </Sheet>
    </View>
  )
}

const meta = {
  args: {
    content: 'form',
    description: 'A personal detail everyone in this pod can see — e.g. your phone or email.',
    dismissible: true,
    title: 'Edit form info',
  },
  argTypes: {
    content: { control: 'radio', options: ['form', 'long'] },
    description: { control: 'text' },
    dismissible: { control: 'boolean' },
    title: { control: 'text' },
  },
  render: (args) => <StatefulSheet {...args} />,
} satisfies Meta<StoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const EditFormInfo: Story = {}

export const Protected: Story = {
  args: {
    description: 'Dragging down and tapping the backdrop do nothing and there is no grabber; Save closes it.',
    dismissible: false,
  },
}

export const LongContent: Story = {
  args: { content: 'long', description: undefined, title: 'Long content' },
}
