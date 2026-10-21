import { atom } from 'jotai'

export type HeaderVariant = 'none' | 'home' | 'back-search' | 'pod'
export type FooterVisibility = 'visible' | 'hidden'

export type PodTab = 'notes' | 'chat' | 'info'

export type PodBreadcrumbItem = {
  label: string
  icon?: 'people'
}

export type PodHeaderConfig = {
  title: string
  avatarUri?: string
  breadcrumb: PodBreadcrumbItem[]
  tab: PodTab
  onTabChange: (tab: PodTab) => void
}

export type ChromeConfig = {
  header: HeaderVariant
  footer: FooterVisibility
  pod?: PodHeaderConfig
}

export type ChromeState = ChromeConfig & { owner: string | null }

export const DEFAULT_CHROME: ChromeState = { footer: 'visible', header: 'none', owner: null }

export const chromeAtom = atom<ChromeState>(DEFAULT_CHROME)

export const unreadNotificationsAtom = atom(0)
