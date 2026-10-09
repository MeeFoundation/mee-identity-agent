/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANALYTICS_ENABLED?: string
  readonly VITE_ANALYTICS_DEBUG?: string
  readonly VITE_MATOMO_URL?: string
  readonly VITE_MATOMO_SITE_ID?: string
  readonly VITE_MATOMO_DIMENSION_FLOW_ID?: string
  readonly VITE_MATOMO_DIMENSION_VARIANT_ID?: string
  readonly VITE_MATOMO_DIMENSION_RUN_ID?: string
  readonly VITE_MATOMO_DIMENSION_SCREEN_ID?: string
  readonly VITE_MATOMO_DIMENSION_VARIANT_SOURCE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  // Written by the container at startup; see DEPLOYMENT.md.
  readonly __UX_FLOWS_CONFIG__?: Readonly<Record<string, unknown>>
}
