import { render, screen } from '@testing-library/react-native'

import { Avatar, type AvatarSize } from './Avatar'

const hiddenOptions = { includeHiddenElements: true }

// Values read from the Mee Design System Avatar, node 28:1476 (Content=Initials, Circle=False)
const sizeTable: ReadonlyArray<readonly [AvatarSize, number, number, number, number, number]> = [
  ['xl', 64, 8, 20, 30, 0.1],
  ['l', 48, 8, 18, 28, 0.09],
  ['m', 40, 8, 16, 24, 0.08],
  ['s', 32, 4, 14, 20, 0.07],
  ['xs', 24, 2, 12, 16, 0.06],
  ['xxs', 16, 2, 12, 16, 0.06],
]

describe('Avatar', () => {
  it('defaults to a 40-point circular brand initials avatar', async () => {
    await render(<Avatar initials="JD" testID="avatar" />)

    expect(screen.getByTestId('avatar', hiddenOptions)).toHaveStyle({
      backgroundColor: '#DFECEE',
      borderRadius: 9999,
      height: 40,
      width: 40,
    })
    expect(screen.getByText('JD', hiddenOptions)).toHaveStyle({
      color: '#4F868E',
      fontFamily: 'PublicSans_700Bold',
      fontSize: 16,
      letterSpacing: 0.08,
      lineHeight: 24,
    })
  })

  it.each(
    sizeTable,
  )('sizes the %s avatar and its initials', async (size, dimension, radius, fontSize, lineHeight, letterSpacing) => {
    await render(<Avatar initials="J" shape="rounded" size={size} testID="avatar" />)

    expect(screen.getByTestId('avatar', hiddenOptions)).toHaveStyle({
      borderRadius: radius,
      height: dimension,
      width: dimension,
    })
    expect(screen.getByText('J', hiddenOptions)).toHaveStyle({ fontSize, letterSpacing, lineHeight })
  })

  it('is 48 points wide and high at size l', async () => {
    await render(<Avatar initials="JD" size="l" testID="avatar" />)

    expect(screen.getByTestId('avatar', hiddenOptions)).toHaveStyle({ height: 48, width: 48 })
  })

  it('is fully round as a circle and has rounded corners as a rounded square', async () => {
    await render(
      <>
        <Avatar initials="C" shape="circle" size="l" testID="circle" />
        <Avatar initials="R" shape="rounded" size="l" testID="rounded" />
      </>,
    )

    expect(screen.getByTestId('circle', hiddenOptions)).toHaveStyle({ borderRadius: 9999 })
    expect(screen.getByTestId('rounded', hiddenOptions)).toHaveStyle({ borderRadius: 8 })
  })

  it('uses the gray tone colors', async () => {
    await render(<Avatar initials="M" testID="avatar" tone="gray" />)

    expect(screen.getByTestId('avatar', hiddenOptions)).toHaveStyle({ backgroundColor: '#F1F5F9' })
    expect(screen.getByText('M', hiddenOptions)).toHaveStyle({ color: '#64748B' })
  })

  it('fills the avatar with the image, clipped to its shape', async () => {
    const source = { uri: 'https://example.com/face.png' }
    await render(<Avatar size="l" source={source} testID="avatar" />)

    expect(screen.getByTestId('avatar', hiddenOptions)).toHaveStyle({
      borderRadius: 9999,
      height: 48,
      overflow: 'hidden',
      width: 48,
    })
    expect(screen.getByTestId('avatar-image', hiddenOptions)).toHaveProp('source', source)
    expect(screen.getByTestId('avatar-image', hiddenOptions)).toHaveStyle({ height: '100%', width: '100%' })
  })

  it('clips a rounded-square image to rounded corners', async () => {
    await render(<Avatar shape="rounded" size="s" source={{ uri: 'https://example.com/face.png' }} testID="avatar" />)

    expect(screen.getByTestId('avatar', hiddenOptions)).toHaveStyle({ borderRadius: 4, height: 32, width: 32 })
  })

  it('is hidden from assistive technology without a label', async () => {
    await render(<Avatar initials="JD" testID="avatar" />)

    expect(screen.queryByTestId('avatar')).toBeNull()
  })

  it('is exposed with its label when one is provided', async () => {
    await render(<Avatar accessibilityLabel="Sofia" initials="S" />)

    expect(screen.getByLabelText('Sofia')).toBeTruthy()
  })

  it('exposes a labelled image avatar as an image', async () => {
    await render(<Avatar accessibilityLabel="Sofia" source={{ uri: 'https://example.com/face.png' }} />)

    expect(screen.getByRole('image', { name: 'Sofia' })).toBeTruthy()
  })
})
