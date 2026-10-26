import { getCategoryIcon, getCategoryLabel } from './category-presentation'
import { i18n } from '@/shared/i18n'
import { HeartsIcon, PeopleIcon } from '@/shared/ui'

describe('getCategoryIcon', () => {
  it('returns the People icon for the people category', () => {
    expect(getCategoryIcon('people')).toEqual(<PeopleIcon />)
  })

  it('returns the Hearts icon for the pets category', () => {
    expect(getCategoryIcon('pets')).toEqual(<HeartsIcon />)
  })

  it('returns no icon for a category without one', () => {
    expect(getCategoryIcon('health-wellness')).toBeNull()
  })

  it('returns no icon for an id that only exists on objects', () => {
    expect(getCategoryIcon('constructor')).toBeNull()
  })
})

describe('getCategoryLabel', () => {
  it.each([
    ['people', 'People'],
    ['pets', 'Pets'],
    ['health-wellness', 'Health & Wellness'],
    ['immediate-family', 'Immediate Family'],
  ])('localizes the %s category', (id, label) => {
    expect(getCategoryLabel(i18n.t, id)).toBe(label)
  })

  it('falls back to the raw identifier when there is no label', () => {
    expect(getCategoryLabel(i18n.t, 'astronomy')).toBe('astronomy')
  })
})
