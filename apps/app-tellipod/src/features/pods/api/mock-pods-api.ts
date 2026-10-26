import type { PodSummary } from '../model/pod-summary'
import type { PodsApi, PodsApiParams, PodsPageRequest } from './pods-api'

export type MockPod = PodSummary & { readonly lastActivityAt: number }

const CURSOR_PREFIX = 'offset:'
const GENERATED_PODS = 37
const DAY_MS = 24 * 60 * 60 * 1000
const BASE_TIME = Date.UTC(2026, 0, 1)

const GENERATED_CATEGORIES: ReadonlyArray<Pick<MockPod, 'category' | 'subcategory'>> = [
  { category: { id: 'people' }, subcategory: { id: 'immediate-family' } },
  { category: { id: 'health-wellness' }, subcategory: null },
  { category: { id: 'pets' }, subcategory: null },
]

export const MOCK_PODS: ReadonlyArray<MockPod> = [
  {
    avatarUrl: null,
    category: { id: 'people' },
    hasUnread: true,
    id: 'pod-1',
    lastActivityAt: BASE_TIME + (GENERATED_PODS + 3) * DAY_MS,
    name: 'About Sofia',
    subcategory: { id: 'immediate-family' },
  },
  {
    avatarUrl: null,
    category: { id: 'people' },
    hasUnread: false,
    id: 'pod-2',
    lastActivityAt: BASE_TIME + (GENERATED_PODS + 2) * DAY_MS,
    name: 'Mom & Dad',
    subcategory: { id: 'immediate-family' },
  },
  {
    avatarUrl: null,
    category: { id: 'pets' },
    hasUnread: false,
    id: 'pod-3',
    lastActivityAt: BASE_TIME + (GENERATED_PODS + 1) * DAY_MS,
    name: 'Maya',
    subcategory: null,
  },
  ...Array.from({ length: GENERATED_PODS }, (_, index): MockPod => {
    const number = index + 4
    return {
      ...GENERATED_CATEGORIES[index % GENERATED_CATEGORIES.length],
      avatarUrl: null,
      hasUnread: index % 7 === 0,
      id: `pod-${number}`,
      lastActivityAt: BASE_TIME + (GENERATED_PODS - index) * DAY_MS,
      name: `Pod ${String(number).padStart(2, '0')}`,
    }
  }),
]

const compareText = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0)

const matches = (pod: MockPod, params: PodsApiParams) =>
  (params.categoryId === undefined || pod.category.id === params.categoryId) &&
  (params.search === undefined || pod.name.toLowerCase().includes(params.search.toLowerCase()))

const sorted = (pods: MockPod[], sort: PodsApiParams['sort']) =>
  [...pods].sort((a, b) =>
    sort === 'name_asc'
      ? compareText(a.name, b.name) || compareText(a.id, b.id)
      : b.lastActivityAt - a.lastActivityAt || compareText(a.id, b.id),
  )

const parseOffset = (cursor: string | null): number => {
  if (cursor === null) return 0

  const offset = cursor.startsWith(CURSOR_PREFIX) ? Number(cursor.slice(CURSOR_PREFIX.length)) : Number.NaN

  if (!Number.isInteger(offset) || offset < 0) {
    throw new Error(`Invalid cursor: ${cursor}`)
  }

  return offset
}

const toSummary = ({ lastActivityAt: _lastActivityAt, ...summary }: MockPod): PodSummary => summary

export const createMockPodsApi = ({
  latencyMs = 300,
  pods = MOCK_PODS,
}: {
  readonly latencyMs?: number
  readonly pods?: ReadonlyArray<MockPod>
} = {}): PodsApi => ({
  fetchPods: async ({ cursor, limit, params }: PodsPageRequest) => {
    await new Promise<void>((resolve) => setTimeout(resolve, latencyMs))

    const offset = parseOffset(cursor)

    const ordered = sorted(
      pods.filter((pod) => matches(pod, params)),
      params.sort,
    )
    const end = offset + limit
    return {
      items: ordered.slice(offset, end).map(toSummary),
      nextCursor: end < ordered.length ? `${CURSOR_PREFIX}${end}` : null,
    }
  },
})
