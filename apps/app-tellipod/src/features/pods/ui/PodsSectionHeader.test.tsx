import { fireEvent, render, screen } from '@testing-library/react-native'

import { PodsSectionHeader } from './PodsSectionHeader'

jest.mock('@gorhom/bottom-sheet', () => ({}))

describe('PodsSectionHeader', () => {
  it('shows the recent pods label and the see all link', async () => {
    await render(<PodsSectionHeader onSeeAll={jest.fn()} />)

    expect(screen.getByText('Recent Pods')).toBeTruthy()
    expect(screen.getByText('See all pods')).toBeTruthy()
  })

  it('calls the handler when the link is pressed', async () => {
    const onSeeAll = jest.fn()
    await render(<PodsSectionHeader onSeeAll={onSeeAll} />)

    await fireEvent.press(screen.getByText('See all pods'))

    expect(onSeeAll).toHaveBeenCalledTimes(1)
  })

  it('shows the label and no link when there is no handler', async () => {
    await render(<PodsSectionHeader />)

    expect(screen.getByText('Recent Pods')).toBeTruthy()
    expect(screen.queryByText('See all pods')).toBeNull()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('exposes the link as a button labelled with its text', async () => {
    await render(<PodsSectionHeader onSeeAll={jest.fn()} />)

    expect(screen.getByRole('button', { name: 'See all pods' })).toBeTruthy()
  })
})
