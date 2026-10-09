import { createContext, type ReactNode, useContext } from 'react'

import type { Analytics } from './analytics-event'
import { noopAnalytics } from './fan-out'

const AnalyticsContext = createContext<Analytics>(noopAnalytics)

type AnalyticsProviderProps = {
  analytics: Analytics
  children: ReactNode
}

export const AnalyticsProvider = ({ analytics, children }: AnalyticsProviderProps) => (
  <AnalyticsContext.Provider value={analytics}>{children}</AnalyticsContext.Provider>
)

export const useAnalytics = () => useContext(AnalyticsContext)
