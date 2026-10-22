import { fireEvent, render, screen } from '@testing-library/react-native'
import { Pressable, Text } from 'react-native'

import { Card, CardChevron, type CardProps } from './Card'
import { CellInfo } from './CellInfo'
import { Panel } from './Panel'

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native')
  return {
    __esModule: true,
    default: { View },
    Easing: { cubic: undefined, out: () => undefined },
    ReduceMotion: { System: 'system' },
    useAnimatedStyle: (factory: () => object) => factory(),
    useSharedValue: (initial: number) => ({ value: initial }),
    withTiming: (target: number) => target,
  }
})

const toggleHeader: NonNullable<CardProps['header']> = ({ expanded, toggle }) => (
  <Pressable accessibilityRole="button" accessibilityState={{ expanded }} onPress={toggle}>
    <Text>Header</Text>
  </Pressable>
)

const hiddenOptions = { includeHiddenElements: true }

describe('Card', () => {
  it('renders its children and no header row when no header is given', async () => {
    await render(
      <Card>
        <Text>Body</Text>
      </Card>,
    )

    expect(screen.getByText('Body')).toBeTruthy()
    expect(screen.queryByText('Header')).toBeNull()
  })

  it('calls the header function with the expanded state and a toggle function', async () => {
    const header = jest.fn(() => <Text>Header</Text>)
    await render(<Card header={header} />)

    expect(screen.getByText('Header')).toBeTruthy()
    expect(header).toHaveBeenCalledWith({ expanded: true, toggle: expect.any(Function) })
  })

  it('renders a CellInfo mini-group returned by the header', async () => {
    await render(<Card header={() => <CellInfo icon={<Text>i</Text>} name="Contact info" variant="mini-group" />} />)

    expect(screen.getByText('Contact info')).toBeTruthy()
  })

  describe('footer action', () => {
    it.each([
      'outline',
      'ghost',
    ] as const)('renders the %s footer with icon and label and reports presses', async (variant) => {
      const onPress = jest.fn()
      await render(<Card footer={{ icon: <Text>+</Text>, label: 'Add info', onPress, variant }} />)

      expect(screen.getByText('+')).toBeTruthy()
      await fireEvent.press(screen.getByRole('button', { name: 'Add info' }))

      expect(onPress).toHaveBeenCalledTimes(1)
    })

    it('hides the footer while its own card is collapsed', async () => {
      const footer = { label: 'Add info', onPress: jest.fn(), variant: 'outline' } as const
      const { rerender } = await render(<Card expanded footer={footer} />)
      expect(screen.getByRole('button', { name: 'Add info' })).toBeTruthy()

      await rerender(<Card expanded={false} footer={footer} />)

      expect(screen.queryByRole('button', { name: 'Add info' })).toBeNull()
    })
  })

  describe('expansion', () => {
    it('is expanded by default', async () => {
      await render(
        <Card header={toggleHeader}>
          <Text>Body</Text>
        </Card>,
      )

      expect(screen.getByText('Body')).toBeTruthy()
    })

    it('requests the opposite state when controlled and stays put until the prop changes', async () => {
      const onExpandedChange = jest.fn()
      const { rerender } = await render(
        <Card expanded header={toggleHeader} onExpandedChange={onExpandedChange}>
          <Text>Body</Text>
        </Card>,
      )

      await fireEvent.press(screen.getByRole('button', { name: 'Header' }))

      expect(onExpandedChange).toHaveBeenCalledWith(false)
      expect(screen.getByText('Body')).toBeTruthy()

      await rerender(
        <Card expanded={false} header={toggleHeader} onExpandedChange={onExpandedChange}>
          <Text>Body</Text>
        </Card>,
      )

      expect(screen.queryByText('Body')).toBeNull()
    })

    it('keeps its own state when uncontrolled and reports changes', async () => {
      const onExpandedChange = jest.fn()
      await render(
        <Card defaultExpanded header={toggleHeader} onExpandedChange={onExpandedChange}>
          <Text>Body</Text>
        </Card>,
      )

      await fireEvent.press(screen.getByRole('button', { name: 'Header' }))

      expect(screen.queryByText('Body')).toBeNull()
      expect(onExpandedChange).toHaveBeenCalledWith(false)

      await fireEvent.press(screen.getByRole('button', { name: 'Header' }))

      expect(screen.getByText('Body')).toBeTruthy()
      expect(onExpandedChange).toHaveBeenLastCalledWith(true)
    })

    it('starts collapsed with defaultExpanded false and keeps the header visible', async () => {
      await render(
        <Card defaultExpanded={false} header={toggleHeader}>
          <Text>Body</Text>
        </Card>,
      )

      expect(screen.getByText('Header')).toBeTruthy()
      expect(screen.queryByText('Body')).toBeNull()
      expect(screen.getByText('Body', hiddenOptions)).toBeTruthy()
    })

    it('always shows the body when the header never calls toggle', async () => {
      await render(
        <Card header={() => <Text>Static</Text>}>
          <Text>Body</Text>
        </Card>,
      )

      expect(screen.getByText('Body')).toBeTruthy()
    })

    it('lets the header expose the expanded accessibility state', async () => {
      await render(
        <Card header={toggleHeader}>
          <Text>Body</Text>
        </Card>,
      )
      expect(screen.getByRole('button', { expanded: true, name: 'Header' })).toBeTruthy()

      await fireEvent.press(screen.getByRole('button', { name: 'Header' }))

      expect(screen.getByRole('button', { expanded: false, name: 'Header' })).toBeTruthy()
    })
  })

  describe('inside a panel', () => {
    const cardFooter = { label: 'Add contact info', onPress: jest.fn(), variant: 'outline' } as const
    const panelFooter = { label: 'Create form', onPress: jest.fn(), variant: 'ghost' } as const

    it('shows the card footer and the panel footer', async () => {
      await render(
        <Panel footer={panelFooter}>
          <Card footer={cardFooter} header={toggleHeader}>
            <Text>Body</Text>
          </Card>
        </Panel>,
      )

      expect(screen.getByRole('button', { name: 'Add contact info' })).toBeTruthy()
      expect(screen.getByRole('button', { name: 'Create form' })).toBeTruthy()
    })

    it('keeps the panel footer visible when the card collapses', async () => {
      await render(
        <Panel footer={panelFooter}>
          <Card footer={cardFooter} header={toggleHeader}>
            <Text>Body</Text>
          </Card>
        </Panel>,
      )

      await fireEvent.press(screen.getByRole('button', { name: 'Header' }))

      expect(screen.queryByText('Body')).toBeNull()
      expect(screen.queryByRole('button', { name: 'Add contact info' })).toBeNull()
      expect(screen.getByRole('button', { name: 'Create form' })).toBeTruthy()
    })

    it('does not change the panel when the card is toggled', async () => {
      const onPress = jest.fn()
      await render(
        <Panel footer={{ ...panelFooter, onPress }}>
          <Card header={toggleHeader}>
            <Text>Body</Text>
          </Card>
        </Panel>,
      )

      await fireEvent.press(screen.getByRole('button', { name: 'Header' }))

      expect(onPress).not.toHaveBeenCalled()
      expect(screen.getByRole('button', { name: 'Create form' })).toBeTruthy()
    })
  })

  describe('row dividers', () => {
    const row = <CellInfo key="row" label="Email" value="a@b.c" variant="info" />
    const footer = { label: 'Add', onPress: jest.fn(), variant: 'outline' } as const

    it('clips the header divider of a header-only card', async () => {
      await render(
        <Card header={() => <CellInfo icon={<Text>i</Text>} name="Members" variant="mini-group" />} testID="card" />,
      )

      expect(screen.getByTestId('card-content')).toHaveStyle({ marginBottom: -1 })
    })

    it('clips the divider of the last body row', async () => {
      await render(<Card testID="card">{row}</Card>)

      expect(screen.getByTestId('card-body')).toHaveStyle({ marginBottom: -1 })
    })

    it('clips the divider of the last body row above a footer too', async () => {
      await render(
        <Card footer={footer} testID="card">
          {row}
        </Card>,
      )

      expect(screen.getByTestId('card-body')).toHaveStyle({ marginBottom: -1 })
    })

    it('keeps the header divider above an expanded body', async () => {
      await render(
        <Card header={() => <CellInfo icon={<Text>i</Text>} name="Contact info" variant="mini-group" />} testID="card">
          {row}
        </Card>,
      )

      expect(screen.getByTestId('card-content')).not.toHaveStyle({ marginBottom: -1 })
    })

    it('clips the header divider when the card is collapsed even if it has a body and a footer', async () => {
      await render(
        <Card expanded={false} footer={footer} testID="card">
          {row}
        </Card>,
      )

      expect(screen.getByTestId('card-content')).toHaveStyle({ marginBottom: -1 })
    })
  })
})

describe('CardChevron', () => {
  it('points right when collapsed and down when expanded', async () => {
    const { rerender } = await render(<CardChevron expanded={false} testID="chevron" />)
    expect(screen.getByTestId('chevron', hiddenOptions)).toHaveStyle({ transform: [{ rotate: '0deg' }] })

    await rerender(<CardChevron expanded testID="chevron" />)

    expect(screen.getByTestId('chevron', hiddenOptions)).toHaveStyle({ transform: [{ rotate: '90deg' }] })
  })

  it('lets a CellInfo header announce the expanded state of the card', async () => {
    await render(
      <Card
        header={({ expanded, toggle }) => (
          <CellInfo
            accessibilityState={{ expanded }}
            icon={<Text>i</Text>}
            name="Contact info"
            onPress={toggle}
            variant="mini-group"
          />
        )}
      >
        <Text>Body</Text>
      </Card>,
    )
    expect(screen.getByRole('button', { expanded: true, name: 'Contact info' })).toBeTruthy()

    await fireEvent.press(screen.getByRole('button', { name: 'Contact info' }))

    expect(screen.getByRole('button', { expanded: false, name: 'Contact info' })).toBeTruthy()
    expect(screen.queryByText('Body')).toBeNull()
  })

  it('renders inside the trailing slot of a CellInfo and follows the card state', async () => {
    await render(
      <Card
        header={({ expanded, toggle }) => (
          <CellInfo
            icon={<Text>i</Text>}
            name="Contact info"
            onPress={toggle}
            trailing={<CardChevron expanded={expanded} testID="chevron" />}
            variant="mini-group"
          />
        )}
      />,
    )
    expect(screen.getByTestId('chevron', hiddenOptions)).toHaveStyle({ transform: [{ rotate: '90deg' }] })

    await fireEvent.press(screen.getByRole('button', { name: 'Contact info' }))

    expect(screen.getByTestId('chevron', hiddenOptions)).toHaveStyle({ transform: [{ rotate: '0deg' }] })
  })

  it('is hidden from assistive technology', async () => {
    await render(<CardChevron expanded testID="chevron" />)

    expect(screen.queryByTestId('chevron')).toBeNull()
  })
})
