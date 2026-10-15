// Production builds are in dev mode when a tab was opened with `?mode=dev`, until it is opened with `?mode=off`.
export type DevMode = {
  on: boolean
  // Turned on through the URL in this tab, rather than by a development build.
  fromUrl: boolean
}

type DevModeInput = {
  devBuild: boolean
  search: string
  storage: () => Storage | undefined
}

const storageKey = 'ux-flows:dev-mode'

export const resolveDevMode = ({ devBuild, search, storage }: DevModeInput): DevMode => {
  if (devBuild) return { fromUrl: false, on: true }

  const mode = new URLSearchParams(search).get('mode')
  let stored = false
  try {
    const tabStorage = storage()
    if (tabStorage) {
      if (mode === 'dev') tabStorage.setItem(storageKey, 'on')
      if (mode === 'off') tabStorage.removeItem(storageKey)
      stored = tabStorage.getItem(storageKey) !== null
    }
  } catch {
    stored = false
  }

  const on = mode === 'dev' || (mode !== 'off' && stored)
  return { fromUrl: on, on }
}

// Decided once per page load; the registry and analytics are built from it.
export const devMode: DevMode = resolveDevMode({
  devBuild: import.meta.env.DEV,
  search: globalThis.location?.search ?? '',
  storage: () => globalThis.sessionStorage,
})
