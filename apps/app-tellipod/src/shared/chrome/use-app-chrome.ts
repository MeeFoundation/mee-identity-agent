import { useFocusEffect } from 'expo-router'
import { useSetAtom } from 'jotai'
import { useCallback, useEffect, useId, useRef } from 'react'

import { type ChromeConfig, chromeAtom, DEFAULT_CHROME } from './model'

export const useAppChrome = ({ header, footer = 'visible', pod }: Partial<ChromeConfig>) => {
  const owner = useId()
  const setChrome = useSetAtom(chromeAtom)
  const podRef = useRef(pod)

  useEffect(() => {
    podRef.current = pod
    setChrome((current) => (current.owner === owner ? { ...current, pod } : current))
  }, [owner, pod, setChrome])

  useFocusEffect(
    useCallback(() => {
      setChrome({ footer, header: header ?? DEFAULT_CHROME.header, owner, pod: podRef.current })
      return () => setChrome((current) => (current.owner === owner ? DEFAULT_CHROME : current))
    }, [footer, header, owner, setChrome]),
  )
}
