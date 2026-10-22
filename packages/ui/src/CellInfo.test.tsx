import { fireEvent, render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'

import { CellInfo } from './CellInfo'

describe('CellInfo', () => {
  it('renders the member name, role and initial from props', async () => {
    await render(<CellInfo initial="A" name="Alice" roleLabel="Admin" variant="member" />)

    expect(screen.getByText('Alice')).toBeTruthy()
    expect(screen.getByText('Admin')).toBeTruthy()
    expect(screen.getByText('A')).toBeTruthy()
  })

  it('does not render a role line when the role is omitted', async () => {
    await render(<CellInfo initial="A" name="Alice" variant="member" />)

    expect(screen.queryByText('Admin')).toBeNull()
    expect(screen.getAllByText(/./)).toHaveLength(2)
  })

  it('renders the label and value without placeholder copy', async () => {
    await render(<CellInfo label="Phone" value="555 0100" variant="info" />)

    expect(screen.getByText('Phone')).toBeTruthy()
    expect(screen.getByText('555 0100')).toBeTruthy()
    expect(screen.queryByText('Label')).toBeNull()
    expect(screen.queryByText('Value')).toBeNull()
  })

  it('shows the badge only when requested', async () => {
    const { rerender } = await render(<CellInfo label="Phone" value="555 0100" variant="info" />)
    expect(screen.queryByText('NEW')).toBeNull()

    await rerender(<CellInfo isNew label="Phone" newLabel="NEW" value="555 0100" variant="info" />)
    expect(screen.getByText('NEW')).toBeTruthy()
  })

  it('renders the suggested note, the chat section separator and the trailing slot', async () => {
    await render(
      <CellInfo
        label="Email"
        suggestedLabel="(suggested)"
        trailing={<Text>+</Text>}
        value="a@b.c"
        variant="suggested-info"
      />,
    )
    expect(screen.getByText('(suggested)')).toBeTruthy()

    await render(<CellInfo label="Name" section="Profile" value="Alice" variant="info-added-in-chat" />)
    expect(screen.getByText('Profile')).toBeTruthy()
    expect(screen.getByText('/')).toBeTruthy()
  })

  it('renders add-info-in-chat without a value line', async () => {
    await render(<CellInfo label="Name" section="Profile" variant="add-info-in-chat" />)

    expect(screen.getByText('Profile')).toBeTruthy()
    expect(screen.getByText('Name')).toBeTruthy()
    expect(screen.getAllByText(/./)).toHaveLength(3)
  })

  it('is not a button without onPress', async () => {
    await render(<CellInfo label="Phone" value="555 0100" variant="info" />)

    expect(screen.queryByRole('button')).toBeNull()
  })

  it('is a button named by its text and calls onPress', async () => {
    const onPress = jest.fn()
    await render(<CellInfo label="Phone" onPress={onPress} value="555 0100" variant="info" />)

    await fireEvent.press(screen.getByRole('button', { name: 'Phone, 555 0100' }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('reports the accessibility state of a pressable row and updates it', async () => {
    const { rerender } = await render(
      <CellInfo
        accessibilityState={{ expanded: true }}
        icon={null}
        name="Contact info"
        onPress={jest.fn()}
        variant="mini-group"
      />,
    )
    expect(screen.getByRole('button', { expanded: true, name: 'Contact info' })).toBeTruthy()

    await rerender(
      <CellInfo
        accessibilityState={{ expanded: false }}
        icon={null}
        name="Contact info"
        onPress={jest.fn()}
        variant="mini-group"
      />,
    )

    expect(screen.getByRole('button', { expanded: false, name: 'Contact info' })).toBeTruthy()
  })

  it('reports no state when none is given', async () => {
    await render(<CellInfo label="Phone" onPress={jest.fn()} value="555 0100" variant="info" />)

    expect(screen.getByRole('button', { name: 'Phone, 555 0100' })).toBeTruthy()
    expect(screen.queryByRole('button', { expanded: true })).toBeNull()
    expect(screen.queryByRole('button', { expanded: false })).toBeNull()
  })

  it('does not report a state on a static row', async () => {
    await render(<CellInfo accessibilityState={{ expanded: true }} label="Phone" value="555 0100" variant="info" />)

    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.getByText('Phone')).toBeTruthy()
  })
})
