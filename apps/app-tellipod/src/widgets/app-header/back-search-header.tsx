import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View } from 'react-native'

import { SearchField } from './search-field'
import { ChevronLeftIcon, radii, sizes, spacing } from '@/shared/ui'

export const BackSearchHeader = () => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityLabel={t('header.back')}
        accessibilityRole="button"
        onPress={() => router.back()}
        style={styles.iconButton}
      >
        <ChevronLeftIcon />
      </Pressable>
      <SearchField />
    </View>
  )
}

const styles = StyleSheet.create({
  iconButton: {
    alignItems: 'center',
    borderRadius: radii.xl,
    height: sizes.iconButton,
    justifyContent: 'center',
    width: sizes.iconButton,
  },
  row: { alignItems: 'center', flexDirection: 'row', gap: spacing[2] },
})
