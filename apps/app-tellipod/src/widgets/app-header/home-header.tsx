import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

import { SearchField } from './search-field'
import { colors, PeopleIcon, radii, ShieldLockIcon, sizes, spacing, typography } from '@/shared/ui'
import { userNameAtom } from '@/shared/user'

export const HomeHeader = () => {
  const { t } = useTranslation()
  const name = useAtomValue(userNameAtom).trim()

  return (
    <>
      <View style={styles.row}>
        <View style={styles.avatar}>
          {name ? (
            <Text style={styles.initial}>{name.charAt(0).toUpperCase()}</Text>
          ) : (
            <PeopleIcon color={colors.textDefaultPlaceholder} size={24} />
          )}
        </View>
        <View style={styles.text}>
          <Text numberOfLines={1} style={styles.greeting}>
            {name ? t('header.welcomeNamed', { name }) : t('header.welcome')}
          </Text>
          <View style={styles.note}>
            <ShieldLockIcon color={colors.textDefaultSubtle} />
            <Text numberOfLines={1} style={styles.noteLabel}>
              {t('header.privacyNote')}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.search}>
        <SearchField />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.surfaceGrayLight,
    borderColor: colors.strokeDefaultMain,
    borderRadius: radii.full,
    borderWidth: 2,
    elevation: 2,
    height: sizes.avatar,
    justifyContent: 'center',
    shadowColor: colors.alphaDark7,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 1.5,
    width: sizes.avatar,
  },
  greeting: { ...typography.xlSemibold, color: colors.textDefaultTitle },
  initial: { ...typography.lgBold, color: colors.textDefaultPlaceholder },
  note: { alignItems: 'center', flexDirection: 'row', gap: spacing[1] },
  noteLabel: { ...typography.xsRegular, color: colors.textDefaultSubtle, flexShrink: 1 },
  row: { alignItems: 'center', flexDirection: 'row', gap: spacing[2] },
  search: { flexDirection: 'row' },
  text: { flex: 1, gap: spacing[0.5], minWidth: 0 },
})
