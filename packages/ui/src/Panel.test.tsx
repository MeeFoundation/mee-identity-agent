import { fireEvent, render, screen } from '@testing-library/react-native'
import { Text, View } from 'react-native'

import { Card } from './Card'
import { CellInfo } from './CellInfo'
import { Panel, type PanelFooter } from './Panel'

jest.mock('react-native-reanimated', () => {
  const { View: MockView } = require('react-native')
  return {
    __esModule: true,
    default: { View: MockView },
    Easing: { cubic: undefined, out: () => undefined },
    ReduceMotion: { System: 'system' },
    useAnimatedStyle: (factory: () => object) => factory(),
    useSharedValue: (initial: number) => ({ value: initial }),
    withTiming: (target: number) => target,
  }
})

const row = <CellInfo label="Email" value="a@b.c" variant="info" />
const footer: PanelFooter = { icon: <Text>+</Text>, label: 'Invite member', onPress: jest.fn(), variant: 'outline' }

describe('Panel', () => {
  it('renders arbitrary content', async () => {
    await render(
      <Panel>
        <Text>You have no forms yet</Text>
        <View accessibilityLabel="photo" />
      </Panel>,
    )

    expect(screen.getByText('You have no forms yet')).toBeTruthy()
    expect(screen.getByLabelText('photo')).toBeTruthy()
  })

  it('renders an empty surface without children or footer', async () => {
    await render(<Panel testID="panel" />)

    expect(screen.getByTestId('panel')).toBeTruthy()
    expect(screen.queryByTestId('panel-body')).toBeNull()
    expect(screen.queryByRole('button')).toBeNull()
  })

  describe('footer action', () => {
    it.each([
      'outline',
      'ghost',
    ] as const)('renders the %s footer with icon and label and reports presses', async (variant) => {
      const onPress = jest.fn()
      await render(<Panel footer={{ ...footer, onPress, variant }} />)

      expect(screen.getByText('+')).toBeTruthy()
      await fireEvent.press(screen.getByRole('button', { name: 'Invite member' }))

      expect(onPress).toHaveBeenCalledTimes(1)
    })

    it('is always visible', async () => {
      await render(
        <Panel footer={footer}>
          <Text>Body</Text>
        </Panel>,
      )

      expect(screen.getByRole('button', { name: 'Invite member' })).toBeTruthy()
    })
  })

  describe('row dividers', () => {
    it('hides the last row divider at the bottom edge', async () => {
      await render(<Panel testID="panel">{row}</Panel>)

      expect(screen.getByTestId('panel-body')).toHaveStyle({ marginBottom: -1 })
    })

    it('hides the last row divider above a footer', async () => {
      await render(
        <Panel footer={footer} testID="panel">
          {row}
        </Panel>,
      )

      expect(screen.getByTestId('panel-body')).toHaveStyle({ marginBottom: -1 })
    })

    it('covers the overlapped divider pixel with the footer', async () => {
      await render(
        <Panel footer={footer} testID="panel">
          {row}
        </Panel>,
      )

      expect(screen.getByTestId('panel-footer-cover')).toHaveStyle({ backgroundColor: '#FFFFFF', height: 1 })
    })
  })

  describe('contained surfaces', () => {
    const Wrapped = () => <Card>{row}</Card>

    it.each([
      ['a card', <Card key="c">{row}</Card>],
      ['a panel', <Panel key="p">{row}</Panel>],
      ['a component that renders a card', <Wrapped key="w" />],
      ['rows', row],
    ])('adds no clipping view around %s', async (_name, content) => {
      await render(
        <Panel footer={footer} testID="panel">
          {content}
        </Panel>,
      )

      expect(screen.getByTestId('panel-body').parent).toBe(screen.getByTestId('panel'))
    })
  })

  describe('content spacing', () => {
    it('applies the gap between cards', async () => {
      await render(
        <Panel gap={12} testID="panel">
          <Card>{row}</Card>
          <Card>{row}</Card>
        </Panel>,
      )

      expect(screen.getByTestId('panel-body')).toHaveStyle({ gap: 12 })
    })

    it('applies the gap between rows', async () => {
      await render(
        <Panel gap={8} testID="panel">
          {row}
          {row}
        </Panel>,
      )

      expect(screen.getByTestId('panel-body')).toHaveStyle({ gap: 8 })
    })

    it('has no gap by default', async () => {
      await render(
        <Panel testID="panel">
          <Card>{row}</Card>
          <Card>{row}</Card>
        </Panel>,
      )

      expect(screen.getByTestId('panel-body')).not.toHaveStyle({ gap: 12 })
    })
  })
})
