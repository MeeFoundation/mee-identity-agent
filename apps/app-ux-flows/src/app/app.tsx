import './i18n'

import { RouterProvider } from '@tanstack/react-router'

import { analytics } from './analytics'
import { router } from '@/routes/router'
import { AnalyticsProvider } from '@/shared/analytics/analytics-provider'

export const App = () => (
  <AnalyticsProvider analytics={analytics}>
    <RouterProvider router={router} />
  </AnalyticsProvider>
)
