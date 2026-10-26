import type { PodSummary } from '../model/pod-summary'
import { createMockPodsApi, MOCK_PODS } from './mock-pods-api'
import type { PodsApi, PodsApiParams } from './pods-api'

const api = createMockPodsApi({ latencyMs: 0 })

const readAll = async (params: PodsApiParams, limit: number, source: PodsApi = api) => {
  const items: PodSummary[] = []
  let cursor: string | null = null
  let pages = 0
  do {
    const page = await source.fetchPods({ cursor, limit, params })
    items.push(...page.items)
    cursor = page.nextCursor ?? null
    pages += 1
  } while (cursor !== null)
  return { items, pages }
}

describe('createMockPodsApi', () => {
  it('pages through the whole dataset by last activity without gaps or repeats', async () => {
    const { items, pages } = await readAll({ sort: 'last_activity' }, 8)
    const expected = [...MOCK_PODS].sort((a, b) => b.lastActivityAt - a.lastActivityAt).map((pod) => pod.id)
    expect(items.map((pod) => pod.id)).toEqual(expected)
    expect(pages).toBe(Math.ceil(MOCK_PODS.length / 8))
  })

  it('pages through the whole dataset by name ascending without gaps or repeats', async () => {
    const { items } = await readAll({ sort: 'name_asc' }, 7)
    const names = items.map((pod) => pod.name)
    expect(new Set(items.map((pod) => pod.id)).size).toBe(MOCK_PODS.length)
    expect(names).toEqual([...names].sort())
  })

  it('does not expose the activity timestamp', async () => {
    const page = await api.fetchPods({ cursor: null, limit: 1, params: { sort: 'last_activity' } })
    expect(page.items[0]).not.toHaveProperty('lastActivityAt')
  })

  it('returns a null cursor on the last page', async () => {
    const page = await api.fetchPods({ cursor: null, limit: MOCK_PODS.length, params: { sort: 'name_asc' } })
    expect(page.items).toHaveLength(MOCK_PODS.length)
    expect(page.nextCursor).toBeNull()
  })

  it('returns an empty page with a null cursor when nothing matches', async () => {
    const page = await api.fetchPods({ cursor: null, limit: 10, params: { categoryId: 'nothing', sort: 'name_asc' } })
    expect(page).toEqual({ items: [], nextCursor: null })
  })

  it('filters by category and by name search', async () => {
    const pets = await readAll({ categoryId: 'pets', sort: 'name_asc' }, 5)
    expect(pets.items.every((pod) => pod.category.id === 'pets')).toBe(true)

    const search = await readAll({ search: 'sofia', sort: 'name_asc' }, 5)
    expect(search.items.map((pod) => pod.name)).toEqual(['About Sofia'])
  })

  it('rejects a cursor it did not issue', async () => {
    await expect(api.fetchPods({ cursor: 'bogus', limit: 5, params: { sort: 'name_asc' } })).rejects.toThrow(
      'Invalid cursor',
    )
  })
})
