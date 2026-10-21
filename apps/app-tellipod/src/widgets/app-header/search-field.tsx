import { useTranslation } from 'react-i18next'
import { StyleSheet, TextInput, View } from 'react-native'

import { colors, radii, SearchIcon, sizes, spacing, typography } from '@/shared/ui'

export const SearchField = () => {
  const { t } = useTranslation()

  return (
    <View style={styles.field}>
      <SearchIcon />
      <TextInput
        editable={false}
        placeholder={t('header.searchPlaceholder')}
        placeholderTextColor={colors.textDefaultPlaceholder}
        style={styles.input}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  field: {
    alignItems: 'center',
    backgroundColor: colors.surfaceDefaultMain,
    borderColor: colors.strokeGrayAccent,
    borderRadius: radii.xl,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: spacing[2],
    height: sizes.field,
    padding: spacing[3],
  },
  input: { ...typography.baseRegular, flex: 1, padding: 0 },
})
