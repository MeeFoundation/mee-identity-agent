import { createContext, useContext } from 'react'

export const OverlayContainerContext = createContext<HTMLElement | null>(null)

// `null` outside a device frame, which makes portals fall back to `document.body`.
export const useOverlayContainer = () => useContext(OverlayContainerContext)
