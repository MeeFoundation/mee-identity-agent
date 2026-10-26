import { render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'

import { Breadcrumbs } from './Breadcrumbs'

const hiddenOptions = { includeHiddenElements: true }

describe('Breadcrumbs', () => {
  it('shows the items in order with a chevron between them and none after the last', async () => {
    await render(<Breadcrumbs items={[{ label: 'People' }, { label: 'Immediate Family' }]} testID="crumbs" />)

    expect(screen.getByText('People')).toBeTruthy()
    expect(screen.getByText('Immediate Family')).toBeTruthy()
    expect(screen.getByTestId('crumbs-delimiter-0', hiddenOptions)).toBeTruthy()
    expect(screen.queryByTestId('crumbs-delimiter-1', hiddenOptions)).toBeNull()
  })

  it('shows a single item without a chevron', async () => {
    await render(<Breadcrumbs items={[{ label: 'Pets' }]} testID="crumbs" />)

    expect(screen.getByText('Pets')).toBeTruthy()
    expect(screen.queryByTestId('crumbs-delimiter-0', hiddenOptions)).toBeNull()
  })

  it('renders nothing without items', async () => {
    await render(<Breadcrumbs items={[]} testID="crumbs" />)

    expect(screen.queryByTestId('crumbs')).toBeNull()
  })

  it('sizes each item at 16 points with 2 points of padding and a 12-point label', async () => {
    await render(<Breadcrumbs items={[{ label: 'People' }]} testID="crumbs" />)

    expect(screen.getByTestId('crumbs-item-0')).toHaveStyle({ gap: 4, height: 16, paddingHorizontal: 2 })
    expect(screen.getByText('People')).toHaveStyle({
      fontFamily: 'PublicSans_400Regular',
      fontSize: 12,
      letterSpacing: 0.06,
      lineHeight: 16,
    })
  })

  it('uses the brand color by default', async () => {
    await render(<Breadcrumbs items={[{ label: 'People' }, { label: 'Immediate Family' }]} />)

    expect(screen.getByText('People')).toHaveStyle({ color: '#3B5B63' })
    expect(screen.getByText('Immediate Family')).toHaveStyle({ color: '#3B5B63' })
  })

  it('uses the gray color for the current item', async () => {
    await render(<Breadcrumbs items={[{ label: 'People' }, { current: true, label: 'Immediate Family' }]} />)

    expect(screen.getByText('People')).toHaveStyle({ color: '#3B5B63' })
    expect(screen.getByText('Immediate Family')).toHaveStyle({ color: '#334155' })
  })

  it('draws the chevron at 10 points', async () => {
    await render(<Breadcrumbs items={[{ label: 'People' }, { label: 'Immediate Family' }]} testID="crumbs" />)

    expect(screen.getByTestId('crumbs-delimiter-0', hiddenOptions)).toHaveStyle({ height: 10, width: 10 })
  })

  it.each([
    ['brand', false, 0xff3b5b63],
    ['gray', true, 0xff334155],
  ])('tints the chevron with the %s item color', async (_name, current, opaqueColor) => {
    await render(<Breadcrumbs items={[{ current, label: 'People' }, { label: 'Immediate Family' }]} testID="crumbs" />)

    expect(JSON.stringify(screen.toJSON())).toContain(`"payload":${opaqueColor}`)
  })

  it('puts an icon before the label in a 14-point slot', async () => {
    await render(
      <Breadcrumbs
        items={[{ icon: <Text>icon</Text>, label: 'People' }, { label: 'Immediate Family' }]}
        testID="crumbs"
      />,
    )

    expect(screen.getByTestId('crumbs-icon-0', hiddenOptions)).toHaveStyle({ height: 14, width: 14 })
    expect(screen.getByText('icon', hiddenOptions)).toBeTruthy()
    expect(screen.queryByTestId('crumbs-icon-1', hiddenOptions)).toBeNull()
  })

  it('keeps labels on one line', async () => {
    await render(<Breadcrumbs items={[{ label: 'People' }]} />)

    expect(screen.getByText('People')).toHaveProp('numberOfLines', 1)
  })

  it('reads the labels in order and hides the chevrons', async () => {
    await render(<Breadcrumbs items={[{ label: 'People' }, { label: 'Immediate Family' }]} testID="crumbs" />)

    expect(screen.getAllByText(/./).map((node) => node.props.children)).toEqual(['People', 'Immediate Family'])
    expect(screen.queryByTestId('crumbs-delimiter-0')).toBeNull()
  })
})
