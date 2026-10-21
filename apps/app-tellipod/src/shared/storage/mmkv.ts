import { MMKV } from 'react-native-mmkv'

const mmkv = new MMKV()

export const mmkvStorage = {
  getItem: (key: string): string | null => mmkv.getString(key) ?? null,
  removeItem: (key: string): void => mmkv.delete(key),
  setItem: (key: string, value: string): void => mmkv.set(key, value),
}
