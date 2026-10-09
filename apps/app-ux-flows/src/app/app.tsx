import './i18n'

import { RouterProvider } from '@tanstack/react-router'

import { AnalyticsProvider } from '@/shared/analytics/analytics-provider'

import { analytics } from './analytics'
import { router } from '@/routes/router'

export const App = () => (
  <AnalyticsProvider analytics={analytics}>
    <RouterProvider router={router} />
  </AnalyticsProvider>
)
