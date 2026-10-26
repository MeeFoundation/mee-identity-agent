import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useMemo } from 'react'

import { loadMorePodsAtom, loadPodsAtom, type PodListParams, podListAtomFamily, refreshPodsAtom } from './pods-store'
import { flattenListPages } from '@/shared/list'

export const usePodList = (params: PodListParams, limit: number) => {
  const listAtom = podListAtomFamily(params)
  const list = useAtomValue(listAtom)
  const load = useSetAtom(loadPodsAtom)
  const loadMoreList = useSetAtom(loadMorePodsAtom)
  const refreshList = useSetAtom(refreshPodsAtom)

  const request = useMemo(() => ({ limit, params }), [params, limit])

  useEffect(() => {
    load(request)
  }, [load, request])

  const loadMore = useCallback(() => loadMoreList(request), [loadMoreList, request])
  const refresh = useCallback(() => refreshList(request), [refreshList, request])

  const retry = useCallback(() => {
    switch (list.failedAction) {
      case 'load':
        return load(request)
      case 'load_more':
        return loadMoreList(request)
      case 'refresh':
        return refreshList(request)
      default:
        return undefined
    }
  }, [list.failedAction, load, loadMoreList, refreshList, request])

  const pods = useMemo(() => flattenListPages(list.pages), [list.pages])

  return { error: list.error, loadMore, pods, refresh, retry, status: list.status }
}
