import { createRouter } from '@tanstack/react-router'

import { flowRoute } from './flow'
import { flowScreenRoute } from './flow.$screenId'
import { homeRoute } from './home'
import { rootRoute } from './root'
import { NotFoundPage } from '@/slices/not-found/not-found-page'

export const router = createRouter({
  defaultNotFoundComponent: NotFoundPage,
  routeTree: rootRoute.addChildren([homeRoute, flowRoute, flowScreenRoute]),
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
