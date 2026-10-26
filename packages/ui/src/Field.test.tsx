import { render, screen } from '@testing-library/react-native'
import { StyleSheet, Text } from 'react-native'

import { Field, FieldCounter, FieldDescription, FieldError, FieldFooter } from './Field'
import { FieldLabel } from './FieldLabel'

jest.mock('react-native-reanimated', () => require('./testing/reanimated.mock').mockReanimated)

const colorOf = (testID: string) => StyleSheet.flatten(screen.getByTestId(testID).props.style).color

describe('Field', () => {
  it('lays its parts out top to bottom', async () => {
    await render(
      <Field testID="field">
        <FieldLabel>Email</FieldLabel>
        <FieldDescription>Helper</FieldDescription>
      </Field>,
    )

    const style = StyleSheet.flatten(screen.getByTestId('field').props.style)
    expect(style.alignSelf).toBe('stretch')
    expect(style.flexDirection).toBeUndefined()
  })

  it('uses the subtle colour for helper text by default', async () => {
    await render(
      <Field>
        <FieldDescription testID="description">Helper</FieldDescription>
        <FieldCounter testID="counter">0 / 20</FieldCounter>
      </Field>,
    )

    expect(colorOf('description')).toBe('#475569')
    expect(colorOf('counter')).toBe('#475569')
  })

  it('applies invalid to nested parts without repeating it', async () => {
    await render(
      <Field invalid>
        <FieldLabel testID="label">Email</FieldLabel>
        <FieldDescription testID="description">Helper</FieldDescription>
        <FieldCounter testID="counter">0 / 20</FieldCounter>
      </Field>,
    )

    expect(colorOf('description')).toBe('#B91C1C')
    expect(colorOf('counter')).toBe('#B91C1C')
    expect(screen.getByText('Email')).toBeTruthy()
    expect(StyleSheet.flatten(screen.getByText('Email').props.style).color).toBe('#B91C1C')
  })

  it('applies disabled to nested parts without repeating it', async () => {
    await render(
      <Field disabled>
        <FieldLabel>Email</FieldLabel>
        <FieldDescription testID="description">Helper</FieldDescription>
        <FieldCounter testID="counter">0 / 20</FieldCounter>
      </Field>,
    )

    expect(colorOf('description')).toBe('#94A3B8')
    expect(colorOf('counter')).toBe('#94A3B8')
    expect(StyleSheet.flatten(screen.getByText('Email').props.style).color).toBe('#94A3B8')
  })

  it('puts the description and counter on one row in a footer', async () => {
    await render(
      <Field>
        <FieldFooter testID="footer">
          <FieldDescription>Helper text</FieldDescription>
          <FieldCounter>0 / 20</FieldCounter>
        </FieldFooter>
      </Field>,
    )

    const style = StyleSheet.flatten(screen.getByTestId('footer').props.style)
    expect(style.flexDirection).toBe('row')
    expect(screen.getByText('Helper text')).toBeTruthy()
    expect(screen.getByText('0 / 20')).toBeTruthy()
  })

  it('shows nothing for an error while the field is valid', async () => {
    await render(
      <Field>
        <FieldError>Enter a valid email</FieldError>
      </Field>,
    )

    expect(screen.queryByText('Enter a valid email')).toBeNull()
  })

  it('shows an error as an alert in the error colour while the field is invalid', async () => {
    await render(
      <Field invalid>
        <FieldError>Enter a valid email</FieldError>
      </Field>,
    )

    const error = screen.getByText('Enter a valid email')
    expect(error.props.accessibilityRole).toBe('alert')
    expect(error.props.accessibilityLiveRegion).toBe('polite')
    expect(StyleSheet.flatten(error.props.style).color).toBe('#B91C1C')
  })

  it('renders helper parts outside a field with their defaults', async () => {
    await render(<FieldDescription testID="description">Helper</FieldDescription>)

    expect(colorOf('description')).toBe('#475569')
  })
})

describe('FieldLabel', () => {
  it('shows a required marker after the text', async () => {
    await render(
      <Field>
        <FieldLabel required>Email</FieldLabel>
      </Field>,
    )

    expect(screen.getByText('Email*')).toBeTruthy()
  })

  it('shows the optional text after the label', async () => {
    await render(
      <Field>
        <FieldLabel optional=" (Optional)">Nickname</FieldLabel>
      </Field>,
    )

    expect(screen.getByText('Nickname (Optional)')).toBeTruthy()
    const optional = screen.getByText(' (Optional)')
    expect(StyleSheet.flatten(optional.props.style).opacity).toBe(0.75)
  })

  it('shows no optional marker without optional text', async () => {
    await render(
      <Field>
        <FieldLabel>Nickname</FieldLabel>
      </Field>,
    )

    expect(screen.queryByText(/Optional/)).toBeNull()
    expect(screen.getByText('Nickname')).toBeTruthy()
  })

  it('shows a tooltip element after the label text', async () => {
    await render(
      <Field>
        <FieldLabel tooltip={<Text>tooltip-icon</Text>}>Email</FieldLabel>
      </Field>,
    )

    expect(screen.getByText('tooltip-icon')).toBeTruthy()
  })

  it('uses the label text colour and the size of the field', async () => {
    await render(
      <Field size="L">
        <FieldLabel>Email</FieldLabel>
      </Field>,
    )

    const style = StyleSheet.flatten(screen.getByText('Email').props.style)
    expect(style.color).toBe('#1E293B')
    expect(style.fontSize).toBe(16)
    expect(style.lineHeight).toBe(24)
  })

  it.each([
    ['S', 16, 0],
    ['M', 20, -2],
    ['L', 24, -4],
  ] as const)('is tall enough for its text line at size %s without changing the layout', async (size, height, margin) => {
    await render(
      <Field size={size}>
        <FieldLabel testID="label">Email</FieldLabel>
      </Field>,
    )

    const style = StyleSheet.flatten(screen.getByTestId('label').props.style)
    expect(style.height).toBe(height)
    expect(style.marginTop + 0).toBe(margin)
  })
})
