import { fireEvent, render, screen, userEvent, waitFor } from '@testing-library/react-native'

import type { PodSummary } from '../model/pod-summary'
import { PodCard } from './PodCard'

jest.mock('@gorhom/bottom-sheet', () => ({}))

const hiddenOptions = { includeHiddenElements: true }

const sofia: PodSummary = {
  avatarUrl: 'https://example.com/sofia.png',
  category: { id: 'people' },
  hasUnread: true,
  id: 'pod-1',
  name: 'About Sofia',
  subcategory: { id: 'immediate-family' },
}

const maya: PodSummary = {
  avatarUrl: null,
  category: { id: 'pets' },
  hasUnread: false,
  id: 'pod-3',
  name: 'Maya',
  subcategory: null,
}

const renderCard = (pod: PodSummary, onPress = jest.fn()) =>
  render(<PodCard onPress={onPress} pod={pod} testID="card" />)

describe('PodCard', () => {
  it('shows the name, the category breadcrumb and the trailing chevron', async () => {
    await renderCard(sofia)

    expect(screen.getByText('About Sofia')).toBeTruthy()
    expect(screen.getByText('People')).toBeTruthy()
    expect(screen.getByText('Immediate Family')).toBeTruthy()
    expect(JSON.stringify(screen.toJSON())).toContain('"width":16')
  })

  it('styles the row as a white 16-point card with the first-level shadow', async () => {
    await renderCard(sofia)

    expect(screen.getByTestId('card')).toHaveStyle({
      backgroundColor: '#ffffff',
      borderRadius: 16,
      boxShadow: '0px 0px 0px 1px #0206170d, 0px 1px 20px 1px #0206170d',
      gap: 10,
      paddingLeft: 10,
      paddingRight: 16,
      paddingVertical: 10,
    })
    expect(screen.getByText('About Sofia')).toHaveStyle({
      color: '#0f172a',
      fontFamily: 'PublicSans_500Medium',
      fontSize: 16,
      lineHeight: 24,
    })
  })

  it('keeps a long name on one line', async () => {
    await renderCard({ ...sofia, name: 'A very long pod name that does not fit in the row at all' })

    expect(screen.getByText('A very long pod name that does not fit in the row at all')).toHaveProp('numberOfLines', 1)
  })

  it('shows a 48-point photo for a pod with an avatar URL, giving a 68-point row', async () => {
    await renderCard(sofia)

    expect(screen.getByTestId('card-avatar', hiddenOptions)).toHaveStyle({ borderRadius: 9999, height: 48, width: 48 })
    expect(screen.getByTestId('card-avatar-image', hiddenOptions)).toHaveProp('source', {
      uri: 'https://example.com/sofia.png',
    })
    expect(48 + 2 * 10).toBe(68)
  })

  it('shows a 40-point gray initial for a pod without a photo, giving a 60-point row', async () => {
    await renderCard(maya)

    expect(screen.getByTestId('card-avatar', hiddenOptions)).toHaveStyle({
      backgroundColor: '#F1F5F9',
      borderRadius: 9999,
      height: 40,
      width: 40,
    })
    expect(screen.getByText('M', hiddenOptions)).toHaveStyle({ color: '#64748B' })
    expect(40 + 2 * 10).toBe(60)
  })

  it('uppercases the first character of the name as the initial', async () => {
    await renderCard({ ...maya, name: 'maya' })

    expect(screen.getByText('M', hiddenOptions)).toBeTruthy()
  })

  it('shows a single category item without a subcategory', async () => {
    await renderCard(maya)

    expect(screen.getByText('Pets')).toBeTruthy()
    expect(screen.queryByText('Immediate Family')).toBeNull()
  })

  it('shows the Hearts icon for the pets category', async () => {
    await renderCard(maya)

    expect(JSON.stringify(screen.toJSON())).toContain('M4.31484 0.420851')
  })

  it('shows the category label without an icon when the category has none', async () => {
    await renderCard({ ...maya, category: { id: 'health-wellness' } })

    expect(screen.getByText('Health & Wellness')).toBeTruthy()
    expect(JSON.stringify(screen.toJSON())).not.toContain('M4.31484 0.420851')
  })

  it('colors every breadcrumb item with the brand color', async () => {
    await renderCard(sofia)

    expect(screen.getByText('People')).toHaveStyle({ color: '#3B5B63' })
    expect(screen.getByText('Immediate Family')).toHaveStyle({ color: '#3B5B63' })
  })

  it('shows a red dot with a white border over the avatar corner for an unread pod', async () => {
    await renderCard(sofia)

    expect(screen.getByTestId('card-unread')).toHaveStyle({
      backgroundColor: '#b91c1c',
      borderColor: '#ffffff',
      borderRadius: 9999,
      borderWidth: 2,
      height: 12,
      left: 10,
      position: 'absolute',
      top: 10,
      width: 12,
    })
  })

  it('shows no dot for a pod without unread content', async () => {
    await renderCard(maya)

    expect(screen.queryByTestId('card-unread')).toBeNull()
  })

  it('tints the card gray while it is pressed and restores it on release', async () => {
    await renderCard(sofia)
    const card = screen.getByTestId('card')

    expect(card).toHaveStyle({ backgroundColor: '#ffffff' })

    const user = userEvent.setup()
    const press = user.press(card)

    await waitFor(() => expect(screen.getByTestId('card')).toHaveStyle({ backgroundColor: '#f1f5f9' }))

    await press
    expect(screen.getByTestId('card')).toHaveStyle({ backgroundColor: '#ffffff' })
  })

  it('reports the pressed pod to its owner', async () => {
    const onPress = jest.fn()
    await renderCard(sofia, onPress)

    await fireEvent.press(screen.getByRole('button'))

    expect(onPress).toHaveBeenCalledTimes(1)
    expect(onPress).toHaveBeenCalledWith(sofia)
  })

  it('is a button labelled with the name, the category labels and the unread state', async () => {
    await renderCard(sofia)

    expect(screen.getByRole('button', { name: 'About Sofia, People, Immediate Family, Unread' })).toBeTruthy()
  })

  it('leaves out the unread state from the label of a read pod', async () => {
    await renderCard(maya)

    expect(screen.getByRole('button', { name: 'Maya, Pets' })).toBeTruthy()
  })
})
