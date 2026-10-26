import type { FC, ReactNode } from 'react'
import { StyleSheet, Text, View, type ViewStyle } from 'react-native'

import { ChevronRightIcon } from './icons'

export type BreadcrumbItem = {
  readonly label: string
  readonly icon?: ReactNode
  readonly current?: boolean
}

export type BreadcrumbsProps = {
  readonly items: ReadonlyArray<BreadcrumbItem>
  readonly style?: ViewStyle
  readonly testID?: string
}

const colors = {
  textBrandSolid: '#3B5B63',
  textGraySolid: '#334155',
}

const ICON_SLOT_SIZE = 14
const DELIMITER_SIZE = 10

const styles = StyleSheet.create({
  delimiter: {
    alignItems: 'center',
    flexShrink: 0,
    height: DELIMITER_SIZE,
    justifyContent: 'center',
    width: DELIMITER_SIZE,
  },
  icon: {
    alignItems: 'center',
    flexShrink: 0,
    height: ICON_SLOT_SIZE,
    justifyContent: 'center',
    width: ICON_SLOT_SIZE,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
    gap: 4,
    height: 16,
    minWidth: 0,
    paddingHorizontal: 2,
  },
  label: {
    flexShrink: 1,
    fontFamily: 'PublicSans_400Regular',
    fontSize: 12,
    letterSpacing: 0.06,
    lineHeight: 16,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 0,
  },
})

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ items, style, testID }) => {
  if (items.length === 0) return null

  const lastIndex = items.length - 1

  return (
    <View style={[styles.row, style]} testID={testID}>
      {items.map((item, index) => {
        const color = item.current ? colors.textGraySolid : colors.textBrandSolid
        return (
          <View key={item.label} style={styles.item} testID={testID ? `${testID}-item-${index}` : undefined}>
            {item.icon ? (
              <View
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                style={styles.icon}
                testID={testID ? `${testID}-icon-${index}` : undefined}
              >
                {item.icon}
              </View>
            ) : null}
            <Text numberOfLines={1} style={[styles.label, { color }]}>
              {item.label}
            </Text>
            {index < lastIndex ? (
              <View
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                style={styles.delimiter}
                testID={testID ? `${testID}-delimiter-${index}` : undefined}
              >
                <ChevronRightIcon color={color} size={DELIMITER_SIZE} />
              </View>
            ) : null}
          </View>
        )
      })}
    </View>
  )
}
