import { fireEvent, render, screen } from '@testing-library/react-native'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'

import { CheckCircleIcon, ExclamationOctagonIcon, ExclamationTriangleIcon, InfoCircleIcon, XIcon } from './icons'
import { Toast, type ToastType } from './Toast'

const palettes: ReadonlyArray<readonly [ToastType, string, string, string, string, string]> = [
  ['primary', '#F3F8F8', '#9AC2C6', '#314248', '#374E53', '#3B5B63'],
  ['secondary', '#FFFFFF', '#E2E8F0', '#0F172A', '#1E293B', '#3B5B63'],
  ['tertiary', '#F8FAFC', '#CBD5E1', '#0F172A', '#1E293B', '#3B5B63'],
  ['dark', '#0F172A', '#334155', '#FFFFFF', '#FFFFFF', '#C3DCDE'],
  ['success', '#F2F7EE', '#A6C492', '#2E3F28', '#35482C', '#3F5932'],
  ['danger', '#FEF2F2', '#FCA5A5', '#7F1D1D', '#991B1B', '#B91C1C'],
  ['warning', '#FEFAEC', '#F6CB53', '#753312', '#8E3D12', '#AE4F0F'],
]

const defaultIcons = [
  ['primary', InfoCircleIcon, '#314248'],
  ['secondary', InfoCircleIcon, '#0F172A'],
  ['tertiary', InfoCircleIcon, '#0F172A'],
  ['dark', InfoCircleIcon, '#FFFFFF'],
  ['success', CheckCircleIcon, '#2E3F28'],
  ['danger', ExclamationOctagonIcon, '#7F1D1D'],
  ['warning', ExclamationTriangleIcon, '#753312'],
] as const

type HostElement = ReturnType<typeof screen.getByText>

const isInAccessibleGroup = (element: HostElement) => {
  for (let node = element.parent; node; node = node.parent) {
    if (node.props.accessible === true) return true
  }
  return false
}

const serialize = async (element: ReactElement) => {
  const { toJSON, unmount } = await render(element)
  const json = JSON.stringify(toJSON())
  await unmount()
  return json
}

describe('Toast', () => {
  it('defaults to a primary toast', async () => {
    await render(<Toast description="Body" testID="toast" title="Saved" />)

    expect(screen.getByTestId('toast')).toHaveStyle({
      backgroundColor: '#F3F8F8',
      borderColor: '#9AC2C6',
      borderRadius: 8,
      borderWidth: 1,
    })
    expect(screen.getByText('Saved')).toHaveStyle({
      color: '#314248',
      fontFamily: 'PublicSans_600SemiBold',
      fontSize: 14,
      lineHeight: 20,
    })
    expect(screen.getByText('Body')).toHaveStyle({
      color: '#374E53',
      fontFamily: 'PublicSans_400Regular',
      fontSize: 14,
      lineHeight: 20,
    })
  })

  it.each(
    palettes,
  )('%s uses its fill, border, text and action colors', async (type, fill, border, title, description, action) => {
    await render(
      <Toast
        actions={[{ label: 'Undo', onPress: jest.fn() }]}
        description="Body"
        testID="toast"
        title="Saved"
        type={type}
      />,
    )

    expect(screen.getByTestId('toast')).toHaveStyle({ backgroundColor: fill, borderColor: border })
    expect(screen.getByText('Saved')).toHaveStyle({ color: title })
    expect(screen.getByText('Body')).toHaveStyle({ color: description })
    expect(screen.getByText('Undo')).toHaveStyle({ color: action, fontFamily: 'PublicSans_400Regular', fontSize: 14 })
  })

  it.each(defaultIcons)('%s shows its default icon in the title color', async (type, Icon, color) => {
    const toast = await serialize(<Toast title="Saved" type={type} />)
    const icon = await serialize(<Icon color={color} size={16} />)

    expect(toast).toContain(icon)
  })

  it('replaces the default icon with the given one', async () => {
    await render(<Toast icon={<Text>custom</Text>} title="Saved" />)

    expect(screen.getByText('custom')).toBeTruthy()
  })

  it('hides the icon and lets the text start at the card padding', async () => {
    const withIcon = await serialize(<Toast description="Body" title="Saved" />)
    const withoutIcon = await serialize(<Toast description="Body" icon={null} title="Saved" />)
    const icon = await serialize(<InfoCircleIcon color="#314248" size={16} />)

    expect(withIcon).toContain(icon)
    expect(withIcon).toContain('"marginLeft":22')
    expect(withoutIcon).not.toContain(icon)
    expect(withoutIcon).not.toContain('"marginLeft":22')
  })

  it('renders a title-only toast without a description', async () => {
    await render(<Toast title="Invite link sent to Geo" />)

    expect(screen.getByText('Invite link sent to Geo')).toBeTruthy()
    expect(screen.queryByText('Body')).toBeNull()
  })

  it('wraps long text instead of clipping it', async () => {
    const long = 'A very long confirmation message that does not fit on a single line of the toast'
    await render(<Toast title={long} />)

    expect(screen.getByText(long).props.numberOfLines).toBeUndefined()
    expect(screen.getByText(long)).toHaveStyle({ flex: 1 })
  })

  it('shows the avatar before the content', async () => {
    await render(<Toast avatar={<View testID="avatar" />} title="Saved" />)

    expect(screen.getByTestId('avatar')).toBeTruthy()
  })

  it('places actions on the right by default, before the close button', async () => {
    const json = await serialize(
      <Toast
        actions={[
          { label: 'First', onPress: jest.fn() },
          { label: 'Second', onPress: jest.fn() },
        ]}
        closeLabel="Dismiss"
        onClose={jest.fn()}
        title="Saved"
      />,
    )

    expect(json.indexOf('First')).toBeGreaterThan(json.indexOf('Saved'))
    expect(json.indexOf('Second')).toBeGreaterThan(json.indexOf('First'))
    expect(json.indexOf('Dismiss')).toBeGreaterThan(json.indexOf('Second'))
    expect(json).not.toContain('"paddingTop":6')
  })

  it('places actions at the bottom under the title text', async () => {
    const json = await serialize(
      <Toast
        actions={[
          { label: 'First', onPress: jest.fn() },
          { label: 'Second', onPress: jest.fn() },
        ]}
        actionsPlacement="bottom"
        description="Body"
        title="Saved"
      />,
    )

    expect(json.indexOf('First')).toBeGreaterThan(json.indexOf('Body'))
    expect(json).toContain('"paddingTop":6')
    expect(json).toContain('"marginLeft":20')
  })

  it('runs only the pressed action', async () => {
    const first = jest.fn()
    const second = jest.fn()
    await render(
      <Toast
        actions={[
          { label: 'First', onPress: first },
          { label: 'Second', onPress: second },
        ]}
        title="Saved"
      />,
    )

    await fireEvent.press(screen.getByRole('button', { name: 'Second' }))

    expect(second).toHaveBeenCalledTimes(1)
    expect(first).not.toHaveBeenCalled()
  })

  it('shows a labelled close button that calls the handler', async () => {
    const onClose = jest.fn()
    await render(<Toast closeLabel="Dismiss" onClose={onClose} title="Saved" />)

    const close = screen.getByRole('button', { name: 'Dismiss' })
    await fireEvent.press(close)

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(close.props.hitSlop).toBe(12)
  })

  it('shows no close button without a handler', async () => {
    await render(<Toast title="Saved" />)

    expect(screen.queryByRole('button')).toBeNull()
  })

  it('draws the close glyph at 20px in the title color', async () => {
    const toast = await serialize(<Toast closeLabel="Dismiss" onClose={jest.fn()} title="Saved" type="dark" />)
    const glyph = await serialize(<XIcon color="#FFFFFF" size={20} />)

    expect(toast).toContain(glyph)
  })

  it('is announced as a polite status message with title and description as one unit', async () => {
    await render(<Toast description="Body" testID="toast" title="Saved" />)

    const toast = screen.getByTestId('toast')
    expect(toast.props.accessibilityRole).toBe('alert')
    expect(toast.props.accessibilityLiveRegion).toBe('polite')
    expect(isInAccessibleGroup(screen.getByText('Saved'))).toBe(true)
    expect(isInAccessibleGroup(screen.getByText('Body'))).toBe(true)
  })
})
