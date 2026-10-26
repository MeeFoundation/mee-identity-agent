import type { Meta, StoryObj } from '@storybook/react-native'
import { type FC, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import type { FieldSize } from './Field'
import * as Field from './fieldParts'
import { ChevronDownIcon, QuestionCircleIcon, SearchIcon } from './icons'
import * as InputGroup from './inputGroupParts'

type Placement = 'above' | 'edge' | 'inside'

type DemoProps = {
  adornments: boolean
  counter: boolean
  description: string
  disabled: boolean
  error: string
  invalid: boolean
  label: string
  optional: boolean
  placeholder: string
  placement: Placement
  required: boolean
  size: FieldSize
  value: string
}

const iconSizes = { L: 20, M: 16, S: 14 }

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderRadius: 4,
    borderWidth: 1,
    height: 20,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: '#334155',
    fontFamily: 'PublicSans_600SemiBold',
    fontSize: 12,
    letterSpacing: 0.06,
    lineHeight: 16,
  },
  caption: {
    color: '#475569',
    fontFamily: 'PublicSans_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
  },
  column: {
    gap: 24,
  },
  story: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    paddingTop: 24,
  },
})

const Badge: FC<{ children: string }> = ({ children }) => (
  <View style={styles.badge}>
    <Text style={styles.badgeText}>{children}</Text>
  </View>
)

const FieldDemo: FC<DemoProps> = ({
  adornments,
  counter,
  description,
  disabled,
  error,
  invalid,
  label,
  optional,
  placeholder,
  placement,
  required,
  size,
  value: initialValue,
}) => {
  const [value, setValue] = useState(initialValue)
  const iconSize = iconSizes[size]
  const labelProps = { optional: optional ? ' (Optional)' : undefined, required }

  return (
    <Field.Root disabled={disabled} invalid={invalid} size={size}>
      {placement === 'above' ? (
        <Field.Label {...labelProps} tooltip={<QuestionCircleIcon size={iconSize - 4} />}>
          {label}
        </Field.Label>
      ) : null}
      <InputGroup.Root>
        {placement !== 'above' ? (
          <Field.Label {...labelProps} placement={placement}>
            {label}
          </Field.Label>
        ) : null}
        {adornments ? (
          <InputGroup.Addon align="start">
            <SearchIcon size={iconSize} />
          </InputGroup.Addon>
        ) : null}
        {adornments ? <InputGroup.Text>https://</InputGroup.Text> : null}
        <InputGroup.Input onChangeText={setValue} placeholder={placeholder} value={value} />
        {adornments ? (
          <InputGroup.Addon align="end">
            <Badge>A-1</Badge>
            <Badge>A-2</Badge>
            <ChevronDownIcon size={iconSize} />
          </InputGroup.Addon>
        ) : null}
      </InputGroup.Root>
      <Field.Footer>
        <Field.Description>{description}</Field.Description>
        {counter ? <Field.Counter>{`${value.length} / 20`}</Field.Counter> : null}
      </Field.Footer>
      <Field.Error>{error}</Field.Error>
    </Field.Root>
  )
}

const meta = {
  args: {
    adornments: false,
    counter: false,
    description: 'Helper text',
    disabled: false,
    error: 'Enter a valid email address',
    invalid: false,
    label: 'Label',
    optional: false,
    placeholder: 'name@example.com',
    placement: 'above',
    required: true,
    size: 'M',
    value: '',
  },
  argTypes: {
    placement: { control: 'radio', options: ['above', 'edge', 'inside'] },
    size: { control: 'radio', options: ['S', 'M', 'L'] },
  },
  decorators: [
    (Story) => (
      <View style={styles.story}>
        <Story />
      </View>
    ),
  ],
  render: (args) => <FieldDemo {...args} />,
} satisfies Meta<DemoProps>

export default meta

type Story = StoryObj<typeof meta>

export const LabelAbove: Story = {}

export const LabelOnEdge: Story = { args: { placement: 'edge' } }

export const LabelInside: Story = { args: { placement: 'inside' } }

export const Small: Story = { args: { size: 'S' } }

export const Large: Story = { args: { size: 'L' } }

export const Filled: Story = { args: { value: 'name@example.com' } }

export const WithAdornments: Story = { args: { adornments: true, counter: true } }

export const WithCounter: Story = { args: { counter: true, value: 'name' } }

export const Invalid: Story = { args: { invalid: true, value: 'name@' } }

export const InvalidLabelOnEdge: Story = { args: { invalid: true, placement: 'edge', value: 'name@' } }

export const InvalidLabelInside: Story = { args: { invalid: true, placement: 'inside', value: 'name@' } }

export const Disabled: Story = { args: { disabled: true, value: 'name@example.com' } }

export const DisabledLabelInside: Story = { args: { disabled: true, placement: 'inside' } }

export const Optional: Story = { args: { optional: true, required: false } }

const placements: Placement[] = ['above', 'edge', 'inside']
const sizes: FieldSize[] = ['S', 'M', 'L']

export const AllPlacementsAndSizes: Story = {
  render: (args) => (
    <View style={styles.column}>
      {sizes.map((size) =>
        placements.map((placement) => (
          <View key={`${size}-${placement}`}>
            <Text style={styles.caption}>{`Size ${size} - label ${placement}`}</Text>
            <FieldDemo {...args} adornments counter placement={placement} size={size} />
          </View>
        )),
      )}
    </View>
  ),
}
