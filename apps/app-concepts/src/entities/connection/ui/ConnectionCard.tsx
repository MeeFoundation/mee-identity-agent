import { useMemo } from 'react'
import { type ImageSourcePropType, StyleSheet, View, type ViewStyle } from 'react-native'
import { EllipsisVerticalIcon } from 'react-native-heroicons/outline'
import type { SFSymbol } from 'sf-symbols-typescript'

import { colors } from '@/shared/config'
import { filterNullable } from '@/shared/lib/ts-utils'
import { AppButton } from '@/shared/ui/AppButton'
import { Avatar } from '@/shared/ui/Avatar'
import { DropdownMenu, type DropdownMenuItem } from '@/shared/ui/DropdownMenu'
import { Typography } from '@/shared/ui/Typography'

type Icons = 'pencil' | 'trash' | 'userGroup' | 'link'
export type MenuAction = {
  name: string
  key: 'edit' | 'link' | 'delete' | 'source-profile'
  icon: Icons
  onPress: () => void
}

type Props = {
  logo?: ImageSourcePropType | string
  name: string
  border?: boolean
  style?: ViewStyle
  menuActions?: MenuAction[]
}

const IconToSFSymbolMap: Record<Icons, SFSymbol> = {
  link: 'link',
  pencil: 'square.and.pencil',
  trash: 'trash',
  userGroup: 'person.3',
}

export const ConnectionCard = (props: Props) => {
  const { logo, name, border, style, menuActions } = props
  const menuItems = useMemo<DropdownMenuItem[] | undefined>(
    () =>
      menuActions?.map((action) => ({
        destructive: action.key === 'delete',
        id: action.key,
        onSelect: action.onPress,
        sfSymbol: IconToSFSymbolMap[action.icon],
        title: action.name,
      })),
    [menuActions],
  )
  const containerStyles = StyleSheet.flatten(filterNullable([styles.container, border && styles.border, style]))

  return (
    <View>
      <View style={containerStyles}>
        <Avatar size={48} src={logo} text={name} />
        <Typography className="font-medium" style={styles.name}>
          {name}
        </Typography>

        {menuItems && (
          <DropdownMenu items={menuItems}>
            <AppButton onPress={() => false} size="sm" variant="tertiary">
              <EllipsisVerticalIcon color="black" />
            </AppButton>
          </DropdownMenu>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  border: { borderColor: colors.primary, borderWidth: 2 },
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    padding: 8,
  },
  image: { borderRadius: 9999, height: 48, width: 48 },
  itemText: {
    color: '#FF9800',
    fontSize: 16,
    marginLeft: 8,
  },
  name: { flexGrow: 1 },
  open: { color: colors.link, fontSize: 12 },
})
