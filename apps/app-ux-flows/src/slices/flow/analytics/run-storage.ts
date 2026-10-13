import type { VariantSource } from '@/shared/analytics/analytics-event'

export type RunRecord = {
  runId: string
  variantId: string | null
  variantSource: VariantSource
  // Epoch milliseconds.
  startedAt: number
  status: 'in-progress' | 'completed'
  visitedScreenIds: string[]
}

export type RunStorage = {
  read(flowId: string): RunRecord | null
  write(flowId: string, record: RunRecord): void
  remove(flowId: string): void
  clearAll(): void
}

const keyPrefix = 'ux-flows:analytics-run:'

const variantSources: readonly string[] = ['url', 'stored', 'assigned', 'default', 'none'] satisfies VariantSource[]

const isRunRecord = (value: unknown): value is RunRecord => {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  return (
    typeof record.runId === 'string' &&
    (typeof record.variantId === 'string' || record.variantId === null) &&
    typeof record.variantSource === 'string' &&
    variantSources.includes(record.variantSource) &&
    typeof record.startedAt === 'number' &&
    (record.status === 'in-progress' || record.status === 'completed') &&
    Array.isArray(record.visitedScreenIds) &&
    record.visitedScreenIds.every((id) => typeof id === 'string')
  )
}

export const createRunStorage = (getStorage: () => Storage | undefined): RunStorage => {
  const withStorage = <T>(use: (storage: Storage) => T): T | undefined => {
    try {
      const storage = getStorage()
      return storage ? use(storage) : undefined
    } catch {
      return undefined
    }
  }

  return {
    clearAll: () => {
      withStorage((storage) => {
        const keys = Array.from({ length: storage.length }, (_, index) => storage.key(index))
        for (const key of keys) {
          if (key?.startsWith(keyPrefix)) storage.removeItem(key)
        }
      })
    },
    read: (flowId) =>
      withStorage((storage) => {
        const raw = storage.getItem(keyPrefix + flowId)
        if (raw === null) return null
        const parsed: unknown = JSON.parse(raw)
        return isRunRecord(parsed) ? parsed : null
      }) ?? null,
    remove: (flowId) => {
      withStorage((storage) => storage.removeItem(keyPrefix + flowId))
    },
    write: (flowId, record) => {
      withStorage((storage) => storage.setItem(keyPrefix + flowId, JSON.stringify(record)))
    },
  }
}

export const browserRunStorage = createRunStorage(() => globalThis.sessionStorage)
