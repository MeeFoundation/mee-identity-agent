import { fireEvent, render, screen } from '@testing-library/react-native'
import type { FC, ReactElement } from 'react'
import { StyleSheet, Text, TextInput, type TextInputInstance, type TextInputProps } from 'react-native'

import { Field, FieldError } from './Field'
import { FieldLabel } from './FieldLabel'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from './InputGroup'
import { withTiming } from './testing/reanimated.mock'

jest.mock('react-native-reanimated', () => require('./testing/reanimated.mock').mockReanimated)

const styleOf = (testID: string) =>
  StyleSheet.flatten(screen.getByTestId(testID, { includeHiddenElements: true }).props.style)

const field = (
  element: ReactElement,
  props: { disabled?: boolean; invalid?: boolean; size?: 'S' | 'M' | 'L' } = {},
) => <Field {...props}>{element}</Field>

const simpleGroup = (size?: 'S' | 'M' | 'L') => (
  <InputGroup size={size} testID="group">
    <InputGroupInput testID="input" />
  </InputGroup>
)

describe('InputGroup box', () => {
  it('has the default appearance at size M', async () => {
    await render(field(simpleGroup()))

    const style = styleOf('group')
    expect(style.height).toBe(36)
    expect(style.backgroundColor).toBe('#FFFFFF')
    expect(style.borderColor).toBe('#CBD5E1')
    expect(style.borderWidth).toBe(1)
    expect(style.borderRadius).toBe(12)
    expect(style.paddingHorizontal).toBe(11)
  })

  it.each([
    ['S', 30],
    ['M', 36],
    ['L', 44],
  ] as const)('is %s high for the %s size', async (size, height) => {
    await render(field(simpleGroup(size)))

    expect(styleOf('group').height).toBe(height)
  })

  it('takes its size from the field when it has none of its own', async () => {
    await render(field(simpleGroup(), { size: 'L' }))

    expect(styleOf('group').height).toBe(44)
  })

  it('renders as a bare input outside a field', async () => {
    await render(simpleGroup())

    expect(styleOf('group').height).toBe(36)
    await fireEvent(screen.getByTestId('input'), 'focus')
    expect(styleOf('group').borderColor).toBe('#3B5B63')
  })

  it('shows the brand border and ring while focused', async () => {
    await render(field(simpleGroup()))

    await fireEvent(screen.getByTestId('input'), 'focus')
    expect(styleOf('group').borderColor).toBe('#3B5B63')
    expect(styleOf('group').boxShadow).toBe('0px 0px 0px 3px #4F868E66')

    await fireEvent(screen.getByTestId('input'), 'blur')
    expect(styleOf('group').borderColor).toBe('#CBD5E1')
    expect(styleOf('group').boxShadow).toBeUndefined()
  })

  it('shows the error border while invalid', async () => {
    await render(field(simpleGroup(), { invalid: true }))

    expect(styleOf('group').borderColor).toBe('#B91C1C')
  })

  it('keeps the error border and uses the error ring while focused and invalid', async () => {
    await render(field(simpleGroup(), { invalid: true }))

    await fireEvent(screen.getByTestId('input'), 'focus')
    expect(styleOf('group').borderColor).toBe('#B91C1C')
    expect(styleOf('group').boxShadow).toBe('0px 0px 0px 3px #EF444466')
  })

  it('shows the grey fill and keeps the border while disabled', async () => {
    await render(field(simpleGroup(), { disabled: true }))

    expect(styleOf('group').backgroundColor).toBe('#F1F5F9')
    expect(styleOf('group').borderColor).toBe('#CBD5E1')
  })
})

describe('InputGroupInput', () => {
  it('passes native text input props through', async () => {
    await render(
      field(
        <InputGroup>
          <InputGroupInput keyboardType="email-address" maxLength={20} secureTextEntry testID="input" />
        </InputGroup>,
      ),
    )

    const props = screen.getByTestId('input').props
    expect(props.secureTextEntry).toBe(true)
    expect(props.keyboardType).toBe('email-address')
    expect(props.maxLength).toBe(20)
  })

  it('renders a different text input component with the same behaviour', async () => {
    const Custom: FC<TextInputProps> = (props) => <TextInput {...props} testID="custom" />
    await render(
      field(
        <>
          <FieldLabel>Email</FieldLabel>
          <InputGroup testID="group">
            <InputGroupInput component={Custom} placeholder="name@example.com" />
          </InputGroup>
        </>,
      ),
    )

    const custom = screen.getByTestId('custom')
    expect(custom.props.placeholder).toBe('name@example.com')
    expect(custom.props.accessibilityLabel).toBe('Email')
    await fireEvent(custom, 'focus')
    expect(styleOf('group').borderColor).toBe('#3B5B63')
  })

  it('calls the consumer handlers', async () => {
    const onFocus = jest.fn()
    const onBlur = jest.fn()
    const onChangeText = jest.fn()
    await render(
      field(
        <InputGroup>
          <InputGroupInput onBlur={onBlur} onChangeText={onChangeText} onFocus={onFocus} testID="input" />
        </InputGroup>,
      ),
    )

    await fireEvent(screen.getByTestId('input'), 'focus')
    await fireEvent.changeText(screen.getByTestId('input'), 'hello')
    await fireEvent(screen.getByTestId('input'), 'blur')

    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onChangeText).toHaveBeenCalledWith('hello')
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('is named by the field label', async () => {
    await render(
      field(
        <>
          <FieldLabel>Email</FieldLabel>
          {simpleGroup()}
        </>,
      ),
    )

    expect(screen.getByTestId('input').props.accessibilityLabel).toBe('Email')
  })

  it('prefers an explicit accessibility label', async () => {
    await render(
      field(
        <>
          <FieldLabel>Email</FieldLabel>
          <InputGroup>
            <InputGroupInput accessibilityLabel="Work email" testID="input" />
          </InputGroup>
        </>,
      ),
    )

    expect(screen.getByTestId('input').props.accessibilityLabel).toBe('Work email')
  })

  it('exposes the error message as a hint while invalid', async () => {
    await render(
      field(
        <>
          {simpleGroup()}
          <FieldError>Enter a valid email</FieldError>
        </>,
        { invalid: true },
      ),
    )

    expect(screen.getByTestId('input').props.accessibilityHint).toBe('Enter a valid email')
  })

  it('has no hint while valid', async () => {
    await render(
      field(
        <>
          {simpleGroup()}
          <FieldError>Enter a valid email</FieldError>
        </>,
      ),
    )

    expect(screen.getByTestId('input').props.accessibilityHint).toBeUndefined()
  })

  it('is not editable and reports disabled when the field is disabled', async () => {
    await render(field(simpleGroup(), { disabled: true }))

    const props = screen.getByTestId('input').props
    expect(props.editable).toBe(false)
    expect(props['aria-disabled']).toBe(true)
  })

  it('focuses the input when the box is pressed', async () => {
    let instance: TextInputInstance | null = null
    await render(
      field(
        <InputGroup testID="group">
          <InputGroupInput
            ref={(node) => {
              instance = node
            }}
          />
        </InputGroup>,
      ),
    )
    const focus = jest.spyOn(instance as unknown as TextInputInstance, 'focus')

    await fireEvent.press(screen.getByTestId('group'))

    expect(focus).toHaveBeenCalledTimes(1)
  })

  it('does not respond to presses on the box while disabled', async () => {
    await render(field(simpleGroup(), { disabled: true }))

    const box = screen.getByTestId('group')
    expect(box.props.accessibilityState).toEqual({ disabled: true })
    expect(box.props.onStartShouldSetResponder()).toBe(false)
  })
})

const orderOf = (...needles: string[]) => {
  const json = JSON.stringify(screen.toJSON())
  return needles.map((needle) => json.indexOf(needle))
}

describe('InputGroupAddon and InputGroupText', () => {
  it('shows a leading icon and prefix before the text, and trailing add-ons after it', async () => {
    await render(
      field(
        <InputGroup>
          <InputGroupAddon align="start">
            <Text>lead-icon</Text>
          </InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
          <InputGroupInput testID="input" />
          <InputGroupAddon align="end">
            <Text>badge-one</Text>
            <Text>badge-two</Text>
            <Text>chevron</Text>
          </InputGroupAddon>
        </InputGroup>,
      ),
    )

    const [lead, prefix, input, one, two, chevron] = orderOf(
      'lead-icon',
      'https://',
      '"testID":"input"',
      'badge-one',
      'badge-two',
      'chevron',
    )
    expect(lead).toBeGreaterThan(-1)
    expect(lead).toBeLessThan(prefix)
    expect(prefix).toBeLessThan(input)
    expect(input).toBeLessThan(one)
    expect(one).toBeLessThan(two)
    expect(two).toBeLessThan(chevron)
  })

  it('spaces addon children by 8px and separates addons from the input by 8px', async () => {
    await render(
      field(
        <InputGroup>
          <InputGroupAddon align="start" testID="start">
            <Text>a</Text>
          </InputGroupAddon>
          <InputGroupInput />
          <InputGroupAddon align="end" testID="end">
            <Text>b</Text>
          </InputGroupAddon>
        </InputGroup>,
      ),
    )

    expect(styleOf('start').gap).toBe(8)
    expect(styleOf('start').marginRight).toBe(8)
    expect(styleOf('end').marginLeft).toBe(8)
  })

  it('shows the prefix in the placeholder colour', async () => {
    await render(
      field(
        <InputGroup>
          <InputGroupText testID="prefix">https://</InputGroupText>
          <InputGroupInput />
        </InputGroup>,
      ),
    )

    expect(styleOf('prefix').color).toBe('#64748B')
  })

  it('shows the alert icon after the input and before the end addon while invalid', async () => {
    await render(
      field(
        <InputGroup>
          <InputGroupInput testID="input" />
          <InputGroupAddon align="end">
            <Text>badge-one</Text>
          </InputGroupAddon>
        </InputGroup>,
        { invalid: true },
      ),
    )

    const json = JSON.stringify(screen.toJSON())
    const alert = json.indexOf('"bbWidth":14')
    expect(alert).toBeGreaterThan(json.indexOf('"testID":"input"'))
    expect(alert).toBeLessThan(json.indexOf('badge-one'))
  })

  it('shows no alert icon while valid', async () => {
    await render(
      field(
        <InputGroup>
          <InputGroupInput />
        </InputGroup>,
      ),
    )

    expect(JSON.stringify(screen.toJSON())).not.toContain('"bbWidth"')
  })
})

describe('floating labels', () => {
  const labelled = (
    placement: 'edge' | 'inside',
    size: 'S' | 'M' | 'L' = 'M',
    inputProps: { defaultValue?: string; placeholder?: string; value?: string } = {},
  ) =>
    field(
      <InputGroup testID="group">
        <FieldLabel placement={placement} required testID="label">
          Label
        </FieldLabel>
        <InputGroupInput testID="input" {...inputProps} />
      </InputGroup>,
      { size },
    )

  const transform = (testID: string) => {
    const entries = styleOf(testID).transform as Record<string, number>[]
    return Object.assign({}, ...entries) as { scale: number; translateX: number; translateY: number }
  }

  it('shows the label like placeholder text while resting', async () => {
    await render(labelled('edge'))

    expect(screen.getByText('Label*', { includeHiddenElements: true })).toBeTruthy()
    expect(StyleSheet.flatten(screen.getByText('Label*', { includeHiddenElements: true }).props.style).color).toBe(
      '#64748B',
    )
    expect(transform('label').scale).toBe(1)
    expect(transform('label').translateY).toBe(7)
  })

  it('floats an edge label onto the top border without changing the box height', async () => {
    await render(labelled('edge'))

    await fireEvent(screen.getByTestId('input'), 'focus')

    expect(transform('label').translateY).toBe(-10.5)
    expect(transform('label').scale).toBeCloseTo(12 / 14)
    expect(styleOf('group').height).toBe(36)
    expect(styleOf('label-mask').backgroundColor).toBe('#FFFFFF')
    expect(styleOf('label-mask').opacity).toBe(1)
    expect(StyleSheet.flatten(screen.getByText('Label*', { includeHiddenElements: true }).props.style).color).toBe(
      '#1E293B',
    )
  })

  it('masks the whole height of a floated edge label so the border and ring do not cross it', async () => {
    await render(labelled('edge'))

    const mask = styleOf('label-mask')
    expect(mask.top).toBe(0)
    expect(mask.bottom).toBe(0)
  })

  it('does not set a line height on the text input so the text stays centred', async () => {
    await render(labelled('edge'))

    const style = StyleSheet.flatten(screen.getByTestId('input').props.style)
    expect(style.lineHeight).toBeUndefined()
    expect(style.height).toBe(20)
  })

  it('keeps the edge mask transparent while resting', async () => {
    await render(labelled('edge'))

    expect(styleOf('label-mask').opacity).toBe(0)
  })

  it.each([
    ['S', 40, 4 + 8 - 1 - 8, 1],
    ['M', 48, 6 + 8 - 1 - 10, 12 / 14],
    ['L', 56, 8 + 8 - 1 - 12, 12 / 16],
  ] as const)('moves an inside label to the top at size %s keeping the %spx box', async (size, height, floatedY, scale) => {
    await render(labelled('inside', size))

    expect(styleOf('group').height).toBe(height)
    await fireEvent(screen.getByTestId('input'), 'focus')

    expect(styleOf('group').height).toBe(height)
    expect(transform('label').translateY).toBe(floatedY)
    expect(transform('label').scale).toBeCloseTo(scale)
  })

  it('moves the text of an inside label down 8px while floated', async () => {
    await render(labelled('inside'))
    const holder = () => screen.getByTestId('input').parent

    expect(StyleSheet.flatten(holder()?.props.style).transform).toEqual([{ translateY: 0 }])
    await fireEvent(screen.getByTestId('input'), 'focus')

    expect(StyleSheet.flatten(holder()?.props.style).transform).toEqual([{ translateY: 8 }])
  })

  it('floats the label once the field has a value and returns it when cleared', async () => {
    await render(labelled('inside'))

    await fireEvent.changeText(screen.getByTestId('input'), 'hello')
    expect(transform('label').translateY).toBe(3)
    expect(transform('label').scale).toBeCloseTo(12 / 14)

    await fireEvent.changeText(screen.getByTestId('input'), '')
    expect(transform('label').translateY).toBe(13)
    expect(transform('label').scale).toBe(1)
  })

  it('shows a floated label immediately when first rendered with a value', async () => {
    withTiming.mockClear()
    await render(labelled('edge', 'M', { value: 'hello' }))

    expect(transform('label').translateY).toBe(-10.5)
    expect(withTiming).not.toHaveBeenCalledWith(1, expect.anything())
  })

  it('animates the float and respects the system reduce motion setting', async () => {
    await render(labelled('edge'))
    withTiming.mockClear()

    await fireEvent(screen.getByTestId('input'), 'focus')

    expect(withTiming).toHaveBeenCalledWith(1, expect.objectContaining({ duration: 150, reduceMotion: 'system' }))
  })

  it('shows the placeholder only while an edge or inside label is floated', async () => {
    await render(labelled('inside', 'M', { placeholder: 'name@example.com' }))
    expect(screen.getByTestId('input').props.placeholder).toBeUndefined()

    await fireEvent(screen.getByTestId('input'), 'focus')
    expect(screen.getByTestId('input').props.placeholder).toBe('name@example.com')
  })

  it('always shows the placeholder with an above label', async () => {
    await render(
      field(
        <>
          <FieldLabel>Label</FieldLabel>
          <InputGroup>
            <InputGroupInput placeholder="name@example.com" testID="input" />
          </InputGroup>
        </>,
      ),
    )

    expect(screen.getByTestId('input').props.placeholder).toBe('name@example.com')
  })

  it('uses the error colour for the label while invalid', async () => {
    await render(
      field(
        <InputGroup>
          <FieldLabel placement="inside">Label</FieldLabel>
          <InputGroupInput />
        </InputGroup>,
        { invalid: true },
      ),
    )

    expect(StyleSheet.flatten(screen.getByText('Label', { includeHiddenElements: true }).props.style).color).toBe(
      '#B91C1C',
    )
  })

  it('fails when a floating label is placed outside an input group', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined)

    await expect(
      render(
        <Field>
          <FieldLabel placement="edge">Label</FieldLabel>
        </Field>,
      ),
    ).rejects.toThrow('must be placed inside an InputGroup')

    consoleError.mockRestore()
  })
})
