import type { FC, ReactNode } from 'react'
import {
  type AccessibilityState,
  Pressable,
  type StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native'

type CellInfoBase = {
  onPress?: () => void
  accessibilityState?: AccessibilityState
  style?: StyleProp<ViewStyle>
}

type WithTrailing = { trailing?: ReactNode }

export type CellInfoProps =
  | (CellInfoBase & WithTrailing & { variant: 'member'; name: string; roleLabel?: string; initial: string })
  | (CellInfoBase & WithTrailing & { variant: 'mini-group'; name: string; icon: ReactNode })
  | (CellInfoBase &
      WithTrailing & { variant: 'info'; label: string; value: string; isNew?: boolean; newLabel?: string })
  | (CellInfoBase & WithTrailing & { variant: 'suggested-info'; label: string; suggestedLabel: string; value: string })
  | (CellInfoBase & { variant: 'another-user-submitted'; label: string; value: string; initial: string })
  | (CellInfoBase & WithTrailing & { variant: 'conflicting-data'; label: string; value: string })
  | (CellInfoBase & WithTrailing & { variant: 'info-added-in-chat'; section: string; label: string; value: string })
  | (CellInfoBase & WithTrailing & { variant: 'add-info-in-chat'; section: string; label: string })

type Variant = CellInfoProps['variant']

const colors = {
  strokeGrayLight: '#E2E8F0',
  strokeGraySoft: '#F1F5F9',
  surfaceBrandLight: '#DFECEE',
  surfaceBrandMain: '#4F868E',
  surfaceErrorSolid: '#B91C1C',
  surfaceGrayLight: '#F1F5F9',
  textBrandOnSolidBackground: '#FFFFFF',
  textDefaultBody: '#1E293B',
  textDefaultPlaceholder: '#64748B',
  textDefaultSubtle: '#475569',
  textDefaultTitle: '#0F172A',
  textErrorSolid: '#B91C1C',
}

const variantStyles: Record<Variant, ViewStyle> = {
  'add-info-in-chat': {
    borderColor: colors.strokeGraySoft,
    gap: 12,
    paddingLeft: 0,
    paddingRight: 8,
    paddingVertical: 10,
  },
  'another-user-submitted': {
    borderColor: colors.strokeGraySoft,
    gap: 12,
    paddingHorizontal: 0,
    paddingVertical: 12,
  },
  'conflicting-data': {
    borderColor: colors.strokeGraySoft,
    gap: 12,
    paddingLeft: 0,
    paddingRight: 4,
    paddingVertical: 12,
  },
  info: {
    borderColor: colors.strokeGraySoft,
    gap: 12,
    paddingLeft: 0,
    paddingRight: 8,
    paddingVertical: 12,
  },
  'info-added-in-chat': {
    borderColor: colors.strokeGraySoft,
    gap: 12,
    paddingLeft: 0,
    paddingRight: 8,
    paddingVertical: 10,
  },
  member: {
    borderColor: colors.strokeGrayLight,
    gap: 12,
    minHeight: 72,
    paddingLeft: 12,
    paddingRight: 16,
    paddingVertical: 12,
  },
  'mini-group': {
    borderColor: colors.strokeGrayLight,
    gap: 8,
    paddingLeft: 8,
    paddingRight: 16,
    paddingVertical: 8,
  },
  'suggested-info': {
    borderColor: colors.strokeGraySoft,
    gap: 12,
    paddingLeft: 0,
    paddingRight: 4,
    paddingVertical: 12,
  },
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    borderRadius: 9999,
    justifyContent: 'center',
  },
  avatarBrand: {
    backgroundColor: colors.surfaceBrandLight,
    height: 32,
    width: 32,
  },
  avatarGroup: {
    backgroundColor: colors.surfaceGrayLight,
    height: 32,
    width: 32,
  },
  avatarInitialBrand: {
    color: colors.surfaceBrandMain,
    fontFamily: 'PublicSans_700Bold',
    fontSize: 14,
    letterSpacing: 0.07,
    lineHeight: 20,
  },
  avatarInitialMember: {
    color: colors.textDefaultPlaceholder,
    fontFamily: 'PublicSans_700Bold',
    fontSize: 18,
    letterSpacing: 0.09,
    lineHeight: 28,
  },
  avatarMember: {
    backgroundColor: colors.surfaceGrayLight,
    height: 48,
    width: 48,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: colors.surfaceErrorSolid,
    borderColor: colors.surfaceErrorSolid,
    borderRadius: 9999,
    borderWidth: 1,
    height: 16,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: colors.textBrandOnSolidBackground,
    fontFamily: 'PublicSans_600SemiBold',
    fontSize: 10,
    letterSpacing: 0.05,
    lineHeight: 14,
  },
  chatLabelLine: {
    color: colors.textDefaultBody,
    fontFamily: 'PublicSans_400Regular',
    fontSize: 16,
    letterSpacing: 0.08,
    lineHeight: 24,
  },
  chatSectionLine: {
    color: colors.textDefaultSubtle,
    fontFamily: 'PublicSans_400Regular',
    fontSize: 16,
    letterSpacing: 0.08,
    lineHeight: 24,
  },
  label: {
    color: colors.textDefaultSubtle,
    fontFamily: 'PublicSans_400Regular',
    fontSize: 12,
    letterSpacing: 0.06,
    lineHeight: 16,
  },
  labelBold: {
    fontFamily: 'PublicSans_600SemiBold',
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  labelShrink: {
    flexShrink: 1,
  },
  name: {
    color: colors.textDefaultTitle,
    fontFamily: 'PublicSans_500Medium',
    fontSize: 16,
    letterSpacing: 0.08,
    lineHeight: 24,
  },
  role: {
    color: colors.textDefaultSubtle,
    fontFamily: 'PublicSans_400Regular',
    fontSize: 14,
    letterSpacing: 0.07,
    lineHeight: 20,
  },
  row: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  slot: {
    flexShrink: 0,
  },
  suggested: {
    color: colors.textErrorSolid,
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  value: {
    color: colors.textDefaultBody,
    fontFamily: 'PublicSans_500Medium',
    fontSize: 16,
    letterSpacing: 0.08,
    lineHeight: 24,
  },
})

const Initial: FC<{ initial: string; size: 'member' | 'brand' }> = ({ initial, size }) => (
  <View style={[styles.avatar, size === 'member' ? styles.avatarMember : styles.avatarBrand]}>
    <Text style={size === 'member' ? styles.avatarInitialMember : styles.avatarInitialBrand}>{initial}</Text>
  </View>
)

const Slot: FC<{ children: ReactNode }> = ({ children }) =>
  children ? <View style={styles.slot}>{children}</View> : null

const LabelValue: FC<{ label: string; value: string; labelExtra?: ReactNode }> = ({ label, value, labelExtra }) => (
  <View style={styles.text}>
    <View style={[styles.labelRow, { gap: 4 }]}>
      <Text numberOfLines={1} style={[styles.label, styles.labelShrink]}>
        {label}
      </Text>
      {labelExtra}
    </View>
    <Text numberOfLines={1} style={styles.value}>
      {value}
    </Text>
  </View>
)

const SectionLine: FC<{ section: string; label: string; value?: string }> = ({ section, label, value }) => (
  <View style={styles.text}>
    <View style={[styles.labelRow, { gap: 2 }]}>
      <Text numberOfLines={1} style={[styles.label, styles.labelShrink]}>
        {section}
      </Text>
      <Text style={styles.label}>/</Text>
      <Text numberOfLines={1} style={[styles.label, styles.labelBold, styles.labelShrink]}>
        {label}
      </Text>
    </View>
    <Text numberOfLines={1} style={styles.value}>
      {value}
    </Text>
  </View>
)

const renderContent = (props: CellInfoProps): { content: ReactNode; accessibilityLabel: string } => {
  switch (props.variant) {
    case 'member':
      return {
        accessibilityLabel: props.roleLabel ? `${props.name}, ${props.roleLabel}` : props.name,
        content: (
          <>
            <Initial initial={props.initial} size="member" />
            <View style={styles.text}>
              <Text numberOfLines={1} style={styles.name}>
                {props.name}
              </Text>
              {props.roleLabel ? (
                <Text numberOfLines={1} style={styles.role}>
                  {props.roleLabel}
                </Text>
              ) : null}
            </View>
            <Slot>{props.trailing}</Slot>
          </>
        ),
      }
    case 'mini-group':
      return {
        accessibilityLabel: props.name,
        content: (
          <>
            <View style={[styles.avatar, styles.avatarGroup]}>{props.icon}</View>
            <View style={styles.text}>
              <Text numberOfLines={1} style={styles.name}>
                {props.name}
              </Text>
            </View>
            <Slot>{props.trailing}</Slot>
          </>
        ),
      }
    case 'info':
      return {
        accessibilityLabel: `${props.label}, ${props.value}`,
        content: (
          <>
            <LabelValue
              label={props.label}
              labelExtra={
                props.isNew && props.newLabel ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{props.newLabel}</Text>
                  </View>
                ) : null
              }
              value={props.value}
            />
            <Slot>{props.trailing}</Slot>
          </>
        ),
      }
    case 'suggested-info':
      return {
        accessibilityLabel: `${props.label} ${props.suggestedLabel}, ${props.value}`,
        content: (
          <>
            <View style={styles.text}>
              <View style={[styles.labelRow, { gap: 2 }]}>
                <Text numberOfLines={1} style={[styles.label, styles.labelShrink]}>
                  {props.label}
                </Text>
                <Text style={[styles.label, styles.suggested]}>{props.suggestedLabel}</Text>
              </View>
              <Text numberOfLines={1} style={styles.value}>
                {props.value}
              </Text>
            </View>
            <Slot>{props.trailing}</Slot>
          </>
        ),
      }
    case 'another-user-submitted':
      return {
        accessibilityLabel: `${props.label}, ${props.value}`,
        content: (
          <>
            <LabelValue label={props.label} value={props.value} />
            <Initial initial={props.initial} size="brand" />
          </>
        ),
      }
    case 'conflicting-data':
      return {
        accessibilityLabel: `${props.label}, ${props.value}`,
        content: (
          <>
            <LabelValue label={props.label} value={props.value} />
            <Slot>{props.trailing}</Slot>
          </>
        ),
      }
    case 'info-added-in-chat':
      return {
        accessibilityLabel: `${props.section} / ${props.label}, ${props.value}`,
        content: (
          <>
            <SectionLine label={props.label} section={props.section} value={props.value} />
            <Slot>{props.trailing}</Slot>
          </>
        ),
      }
    case 'add-info-in-chat':
      return {
        accessibilityLabel: `${props.section} / ${props.label}`,
        content: (
          <>
            <View style={[styles.text, styles.labelRow, { gap: 2 }]}>
              <Text numberOfLines={1} style={[styles.chatSectionLine, styles.labelShrink]}>
                {props.section}
              </Text>
              <Text style={styles.chatSectionLine}>/</Text>
              <Text numberOfLines={1} style={[styles.chatLabelLine, styles.labelShrink]}>
                {props.label}
              </Text>
            </View>
            <Slot>{props.trailing}</Slot>
          </>
        ),
      }
  }
}

export const CellInfo: FC<CellInfoProps> = (props) => {
  const { content, accessibilityLabel } = renderContent(props)
  const rowStyle = [styles.row, variantStyles[props.variant], props.style]

  if (props.onPress) {
    return (
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={props.accessibilityState}
        onPress={props.onPress}
        style={rowStyle}
      >
        {content}
      </Pressable>
    )
  }

  return <View style={rowStyle}>{content}</View>
}
