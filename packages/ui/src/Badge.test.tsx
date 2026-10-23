import { render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'

import { Badge } from './Badge'

const hiddenOptions = { includeHiddenElements: true }

describe('Badge', () => {
  it('defaults to a primary solid medium rounded badge', async () => {
    await render(<Badge testID="badge">New</Badge>)

    expect(screen.getByTestId('badge')).toHaveStyle({
      backgroundColor: '#3B5B63',
      borderColor: '#3B5B63',
      borderRadius: 6,
      height: 28,
    })
    expect(screen.getByText('New')).toHaveStyle({ color: '#FFFFFF', fontSize: 16, lineHeight: 16 })
  })

  it('renders the label exactly as given', async () => {
    await render(<Badge>Custom</Badge>)

    expect(screen.getByText('Custom')).toBeTruthy()
    expect(screen.queryByText('Label')).toBeNull()
  })

  it.each([
    ['primary', '#F3F8F8', '#C3DCDE', '#3B5B63'],
    ['secondary', '#F8FAFC', '#E2E8F0', '#334155'],
    ['success', '#F2F7EE', '#C8DBBB', '#3F5932'],
    ['danger', '#FEF2F2', '#FECACA', '#B91C1C'],
    ['warning', '#FEFAEC', '#F9DF89', '#AE4F0F'],
  ] as const)('uses the %s light colors', async (type, fill, border, text) => {
    await render(
      <Badge testID="badge" type={type} variant="light">
        Tag
      </Badge>,
    )

    expect(screen.getByTestId('badge')).toHaveStyle({ backgroundColor: fill, borderColor: border })
    expect(screen.getByText('Tag')).toHaveStyle({ color: text })
  })

  it('draws the outlined style with no fill', async () => {
    await render(
      <Badge testID="badge" type="success" variant="outlined">
        Tag
      </Badge>,
    )

    expect(screen.getByTestId('badge')).toHaveStyle({ backgroundColor: 'transparent', borderColor: '#C8DBBB' })
    expect(screen.getByText('Tag')).toHaveStyle({ color: '#3F5932' })
  })

  it.each([
    ['xxs', 16, 10],
    ['xs', 20, 12],
    ['s', 24, 14],
    ['m', 28, 16],
  ] as const)('sizes %s to a %ipx height', async (size, height, fontSize) => {
    await render(
      <Badge size={size} testID="badge">
        Tag
      </Badge>,
    )

    expect(screen.getByTestId('badge')).toHaveStyle({ height })
    expect(screen.getByText('Tag')).toHaveStyle({ fontSize, lineHeight: fontSize })
  })

  it('uses the 4px radius below size m', async () => {
    await render(
      <Badge size="s" testID="badge">
        Tag
      </Badge>,
    )

    expect(screen.getByTestId('badge')).toHaveStyle({ borderRadius: 4 })
  })

  it('fully rounds the pill and circle shapes', async () => {
    await render(
      <>
        <Badge shape="pill" testID="pill">
          Tag
        </Badge>
        <Badge shape="circle" testID="circle">
          9+
        </Badge>
      </>,
    )

    expect(screen.getByTestId('pill')).toHaveStyle({ borderRadius: 9999 })
    expect(screen.getByTestId('circle')).toHaveStyle({ borderRadius: 9999 })
  })

  it('keeps a circle at least as wide as it is high', async () => {
    await render(
      <Badge shape="circle" size="m" testID="badge">
        9
      </Badge>,
    )

    expect(screen.getByTestId('badge')).toHaveStyle({ height: 28, minWidth: 28 })
  })

  it.each([
    ['xxs', 4],
    ['xs', 8],
    ['s', 12],
    ['m', 16],
  ] as const)('renders a %s dot as a %ipx disc without text', async (size, dimension) => {
    await render(<Badge shape="dot" size={size} testID="badge" />)

    expect(screen.getByTestId('badge', hiddenOptions)).toHaveStyle({
      borderRadius: 9999,
      height: dimension,
      width: dimension,
    })
    expect(screen.queryByText(/./)).toBeNull()
  })

  it('shows the leading dot, leading icon, label and trailing icon in order', async () => {
    await render(
      <Badge dot leadingIcon={<Text>lead</Text>} testID="badge" trailingIcon={<Text>trail</Text>}>
        Tag
      </Badge>,
    )

    const children = screen.getByTestId('badge').children
    expect(children).toHaveLength(4)
    expect(screen.getByText('lead')).toBeTruthy()
    expect(screen.getByText('trail')).toBeTruthy()
    expect(screen.getByText('Tag')).toBeTruthy()
  })

  it('reserves no space for slots that are not provided', async () => {
    await render(<Badge testID="badge">Tag</Badge>)

    expect(screen.getByTestId('badge').children).toHaveLength(1)
  })

  it('limits the label to one line', async () => {
    await render(<Badge>Very long label text</Badge>)

    expect(screen.getByText('Very long label text').props.numberOfLines).toBe(1)
  })

  it('hides an unlabeled dot from assistive technology', async () => {
    await render(<Badge shape="dot" testID="badge" />)

    expect(screen.getByTestId('badge', hiddenOptions).props.accessible).toBe(false)
  })

  it('exposes a labeled dot to assistive technology', async () => {
    await render(<Badge accessibilityLabel="Unread" shape="dot" />)

    expect(screen.getByLabelText('Unread')).toBeTruthy()
  })

  it('is not exposed as a button', async () => {
    await render(<Badge>New</Badge>)

    expect(screen.queryByRole('button')).toBeNull()
  })

  it('applies the consumer style without changing its own colors', async () => {
    await render(
      <Badge style={{ marginLeft: 12 }} testID="badge">
        Tag
      </Badge>,
    )

    expect(screen.getByTestId('badge')).toHaveStyle({ backgroundColor: '#3B5B63', marginLeft: 12 })
  })
})
