import { useEffect, useState } from 'react'

import { prefersReducedMotion } from '../motion'

export const useElapsed = (paused: boolean) => {
  const reduced = prefersReducedMotion()
  const [elapsed, setElapsed] = useState(reduced ? Number.POSITIVE_INFINITY : 0)

  useEffect(() => {
    if (paused || reduced) return
    const started = Date.now()
    const id = window.setInterval(() => setElapsed(Date.now() - started), 50)
    return () => window.clearInterval(id)
  }, [paused, reduced])

  return { elapsed, reduced }
}
