import { uniqBy } from 'lodash-es'

export type ListStatus = 'idle' | 'loading' | 'loading_more' | 'refreshing' | 'error'

export type ListAction = 'load' | 'load_more' | 'refresh'

export type ListState<T> = {
  readonly pages: ReadonlyArray<ReadonlyArray<T>>
  readonly nextCursor: string | null
  readonly status: ListStatus
  readonly error: Error | null
  readonly failedAction: ListAction | null
}

export const EMPTY_LIST_STATE: ListState<never> = {
  error: null,
  failedAction: null,
  nextCursor: null,
  pages: [],
  status: 'idle',
}

export const isListBusy = ({ status }: ListState<unknown>) =>
  status === 'loading' || status === 'loading_more' || status === 'refreshing'

export const flattenListPages = <T extends { id: string }>(pages: ListState<T>['pages']): T[] =>
  uniqBy(pages.flat(), 'id')
