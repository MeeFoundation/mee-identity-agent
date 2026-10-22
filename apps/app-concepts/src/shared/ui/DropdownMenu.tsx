import { type MenuAction, MenuView, type NativeActionEvent } from '@react-native-menu/menu'
import { type ReactNode, useCallback, useMemo } from 'react'
import { Platform, View } from 'react-native'
import type { SFSymbol } from 'sf-symbols-typescript'

type DropdownMenuItem = {
  id: string
  title: string
  sfSymbol?: SFSymbol
  checked?: boolean
  destructive?: boolean
  onSelect: () => void
}

type DropdownMenuProps = {
  items: DropdownMenuItem[]
  children: ReactNode
  className?: string
}

const DropdownMenu = ({ items, children, className }: DropdownMenuProps) => {
  const actions = useMemo<MenuAction[]>(
    () =>
      items.map((item) => ({
        attributes: item.destructive ? { destructive: true } : undefined,
        id: item.id,
        image: Platform.OS === 'ios' ? item.sfSymbol : undefined,
        state: item.checked === undefined ? undefined : item.checked ? 'on' : 'off',
        title: item.title,
      })),
    [items],
  )

  const handlePressAction = useCallback(
    ({ nativeEvent }: NativeActionEvent) => {
      items.find((item) => item.id === nativeEvent.event)?.onSelect()
    },
    [items],
  )

  return (
    <MenuView actions={actions} onPressAction={handlePressAction}>
      <View aria-role="button" className={className}>
        {children}
      </View>
    </MenuView>
  )
}

export type { DropdownMenuItem, DropdownMenuProps }
export { DropdownMenu }
