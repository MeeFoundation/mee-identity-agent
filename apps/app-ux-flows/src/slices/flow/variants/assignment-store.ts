export type AssignmentStore = {
  read(flowId: string): string | null
  write(flowId: string, variantId: string): void
  clear(): void
}

const keyPrefix = 'ux-flows:variant:'

export const createAssignmentStore = (getStorage: () => Storage | undefined): AssignmentStore => {
  // Keeps assignments consistent for the page session when browser storage is unavailable.
  const memory = new Map<string, string>()

  const withStorage = <T>(use: (storage: Storage) => T): T | undefined => {
    try {
      const storage = getStorage()
      return storage ? use(storage) : undefined
    } catch {
      return undefined
    }
  }

  return {
    clear: () => {
      memory.clear()
      withStorage((storage) => {
        const keys = Array.from({ length: storage.length }, (_, index) => storage.key(index))
        for (const key of keys) {
          if (key?.startsWith(keyPrefix)) storage.removeItem(key)
        }
      })
    },
    read: (flowId) => withStorage((storage) => storage.getItem(keyPrefix + flowId)) ?? memory.get(flowId) ?? null,
    write: (flowId, variantId) => {
      const stored = withStorage((storage) => {
        storage.setItem(keyPrefix + flowId, variantId)
        return true
      })
      if (stored) memory.delete(flowId)
      else memory.set(flowId, variantId)
    },
  }
}

export const browserAssignmentStore = createAssignmentStore(() => globalThis.localStorage)
