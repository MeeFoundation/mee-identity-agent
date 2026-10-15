export type OpenGroupsStorage = {
  read(): ReadonlySet<string>
  write(groupIds: ReadonlySet<string>): void
}

const storageKey = 'ux-flows:home-open-groups'

// Which home page groups are expanded, kept for the tab; anything unreadable counts as none.
export const createOpenGroupsStorage = (getStorage: () => Storage | undefined): OpenGroupsStorage => ({
  read: () => {
    try {
      const raw = getStorage()?.getItem(storageKey)
      if (raw === null || raw === undefined) return new Set()
      const parsed: unknown = JSON.parse(raw)
      return Array.isArray(parsed) && parsed.every((id) => typeof id === 'string') ? new Set(parsed) : new Set()
    } catch {
      return new Set()
    }
  },
  write: (groupIds) => {
    try {
      getStorage()?.setItem(storageKey, JSON.stringify([...groupIds]))
    } catch {
      // Without storage the groups simply start collapsed next time.
    }
  },
})

export const browserOpenGroupsStorage = createOpenGroupsStorage(() => globalThis.sessionStorage)
