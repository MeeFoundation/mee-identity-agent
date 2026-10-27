import type { FC, ReactNode } from 'react'
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native'

import {
  CheckCircleIcon,
  ExclamationOctagonIcon,
  ExclamationTriangleIcon,
  type IconProps,
  InfoCircleIcon,
  XIcon,
} from './icons'

export type ToastType = 'primary' | 'secondary' | 'tertiary' | 'dark' | 'success' | 'danger' | 'warning'
export type ToastActionsPlacement = 'right' | 'bottom'

export type ToastAction = {
  readonly label: string
  readonly onPress: () => void
}

type ToastActions = readonly [ToastAction] | readonly [ToastAction, ToastAction]

type ToastClose =
  | { readonly onClose: () => void; readonly closeLabel: string }
  | { readonly onClose?: undefined; readonly closeLabel?: undefined }

type ToastBaseProps = {
  readonly type?: ToastType
  readonly title?: string
  readonly description?: string
  readonly icon?: ReactNode
  readonly avatar?: ReactNode
  readonly actions?: ToastActions
  readonly actionsPlacement?: ToastActionsPlacement
  readonly style?: ViewStyle
  readonly testID?: string
}

export type ToastProps = ToastBaseProps & ToastClose

type ToastPalette = {
  readonly action: string
  readonly border: string
  readonly description: string
  readonly fill: string
  readonly icon: FC<IconProps>
  readonly title: string
}

const palettes: Record<ToastType, ToastPalette> = {
  danger: {
    action: '#B91C1C',
    border: '#FCA5A5',
    description: '#991B1B',
    fill: '#FEF2F2',
    icon: ExclamationOctagonIcon,
    title: '#7F1D1D',
  },
  dark: {
    action: '#C3DCDE',
    border: '#334155',
    description: '#FFFFFF',
    fill: '#0F172A',
    icon: InfoCircleIcon,
    title: '#FFFFFF',
  },
  primary: {
    action: '#3B5B63',
    border: '#9AC2C6',
    description: '#374E53',
    fill: '#F3F8F8',
    icon: InfoCircleIcon,
    title: '#314248',
  },
  secondary: {
    action: '#3B5B63',
    border: '#E2E8F0',
    description: '#1E293B',
    fill: '#FFFFFF',
    icon: InfoCircleIcon,
    title: '#0F172A',
  },
  success: {
    action: '#3F5932',
    border: '#A6C492',
    description: '#35482C',
    fill: '#F2F7EE',
    icon: CheckCircleIcon,
    title: '#2E3F28',
  },
  tertiary: {
    action: '#3B5B63',
    border: '#CBD5E1',
    description: '#1E293B',
    fill: '#F8FAFC',
    icon: InfoCircleIcon,
    title: '#0F172A',
  },
  warning: {
    action: '#AE4F0F',
    border: '#F6CB53',
    description: '#8E3D12',
    fill: '#FEFAEC',
    icon: ExclamationTriangleIcon,
    title: '#753312',
  },
}

const iconSize = 16
const titleGap = 6
const actionGap = 16
const closeSize = 20
const closeHitSlop = 12
const descriptionInset = iconSize + titleGap
const bottomActionsInset = 4 + actionGap

const styles = StyleSheet.create({
  actionLabel: {
    fontFamily: 'PublicSans_400Regular',
    fontSize: 14,
    letterSpacing: 0.07,
    lineHeight: 20,
  },
  actionsBottom: {
    flexDirection: 'row',
    gap: actionGap,
    paddingTop: titleGap,
  },
  actionsRight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: actionGap,
  },
  avatar: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
  },
  close: {
    alignItems: 'center',
    height: closeSize,
    justifyContent: 'center',
    width: closeSize,
  },
  container: {
    borderRadius: 8,
    borderWidth: 1,
    boxShadow: '0px 2px 6px -1px rgba(2, 6, 23, 0.07), 0px 6px 18px -1px rgba(2, 6, 23, 0.05)',
  },
  content: {
    flex: 1,
    minWidth: 1,
  },
  description: {
    fontFamily: 'PublicSans_400Regular',
    fontSize: 14,
    letterSpacing: 0.07,
    lineHeight: 20,
  },
  iconSlot: {
    alignItems: 'center',
    height: 20,
    justifyContent: 'center',
    width: iconSize,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    flex: 1,
    fontFamily: 'PublicSans_600SemiBold',
    fontSize: 14,
    letterSpacing: 0.07,
    lineHeight: 20,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: titleGap,
  },
  trailing: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: actionGap,
  },
})

type ActionLinkProps = {
  readonly action: ToastAction
  readonly color: string
}

const ActionLink: FC<ActionLinkProps> = ({ action, color }) => (
  <Pressable accessibilityRole="button" onPress={action.onPress}>
    <Text style={[styles.actionLabel, { color }]}>{action.label}</Text>
  </Pressable>
)

export const Toast: FC<ToastProps> = ({
  type = 'primary',
  title,
  description,
  icon,
  avatar,
  actions,
  actionsPlacement = 'right',
  onClose,
  closeLabel,
  style,
  testID,
}) => {
  const palette = palettes[type]
  const DefaultIcon = palette.icon
  const iconNode = icon === undefined ? <DefaultIcon color={palette.title} size={iconSize} /> : icon
  const hasIcon = iconNode !== null && iconNode !== false
  const hasTitleRow = hasIcon || Boolean(title)
  const actionLinks = actions?.map((action) => <ActionLink action={action} color={palette.action} key={action.label} />)
  const rightActions = actionsPlacement === 'right' ? actionLinks : undefined
  const bottomActions = actionsPlacement === 'bottom' ? actionLinks : undefined
  const hasText = hasTitleRow || Boolean(description)

  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[styles.container, { backgroundColor: palette.fill, borderColor: palette.border }, style]}
      testID={testID}
    >
      <View style={styles.row}>
        {avatar ? <View style={styles.avatar}>{avatar}</View> : null}
        <View style={styles.content}>
          {hasText ? (
            <View accessible>
              {hasTitleRow ? (
                <View style={styles.titleRow}>
                  {hasIcon ? <View style={styles.iconSlot}>{iconNode}</View> : null}
                  {title ? <Text style={[styles.title, { color: palette.title }]}>{title}</Text> : null}
                </View>
              ) : null}
              {description ? (
                <Text
                  style={[
                    styles.description,
                    { color: palette.description },
                    hasIcon && { marginLeft: descriptionInset },
                  ]}
                >
                  {description}
                </Text>
              ) : null}
            </View>
          ) : null}
          {bottomActions?.length ? (
            <View style={[styles.actionsBottom, hasIcon && { marginLeft: bottomActionsInset }]}>{bottomActions}</View>
          ) : null}
        </View>
        {rightActions?.length || onClose ? (
          <View style={styles.trailing}>
            {rightActions?.length ? <View style={styles.actionsRight}>{rightActions}</View> : null}
            {onClose ? (
              <Pressable
                accessibilityLabel={closeLabel}
                accessibilityRole="button"
                hitSlop={closeHitSlop}
                onPress={onClose}
                style={styles.close}
              >
                <XIcon color={palette.title} size={closeSize} />
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  )
}
