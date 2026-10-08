import './i18n'

import { RouterProvider } from '@tanstack/react-router'

import { router } from '@/routes/router'

export const App = () => <RouterProvider router={router} />
