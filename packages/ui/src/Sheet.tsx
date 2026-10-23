import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import { type FC, type PropsWithChildren, type ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'
import { BackHandler, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export type SheetProps = {
  visible: boolean
  onDismiss: () => void
  title: string
  description?: string
  children?: ReactNode
  dismissible?: boolean
  dismissLabel?: string
  testID?: string
}

const colors = {
  description: '#475569',
  grabber: '#E2E8F0',
  shadow: 'rgba(2, 6, 23, 0.1)',
  surface: '#FFFFFF',
  title: '#0F172A',
}

const SIDE_PADDING = 16
const TOP_GAP = 16

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: SIDE_PADDING,
    paddingTop: SIDE_PADDING,
  },
  description: {
    color: colors.description,
    fontFamily: 'PublicSans_400Regular',
    fontSize: 14,
    letterSpacing: 0.07,
    lineHeight: 20,
  },
  grabber: {
    backgroundColor: colors.grabber,
    borderRadius: 2,
    height: 4,
    width: 60,
  },
  grabberHit: {
    alignItems: 'center',
    height: 16,
    paddingTop: 5,
  },
  header: {
    alignSelf: 'stretch',
  },
  surface: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    boxShadow: `0px -1px 30px 0px ${colors.shadow}`,
  },
  title: {
    color: colors.title,
    fontFamily: 'PublicSans_500Medium',
    fontSize: 20,
    letterSpacing: 0.1,
    lineHeight: 30,
  },
  titles: {
    paddingBottom: 8,
    paddingHorizontal: SIDE_PADDING,
    paddingTop: 8,
  },
})

const ModalContainer: FC<PropsWithChildren> = ({ children }) => (
  <View accessibilityViewIsModal pointerEvents="box-none" style={StyleSheet.absoluteFill}>
    {children}
  </View>
)

export const Sheet: FC<SheetProps> = ({
  visible,
  onDismiss,
  title,
  description,
  children,
  dismissible = true,
  dismissLabel = 'Dismiss',
  testID,
}) => {
  const modalRef = useRef<BottomSheetModal>(null)
  const insets = useSafeAreaInsets()
  const presentedRef = useRef(false)
  const visibleRef = useRef(visible)
  const onDismissRef = useRef(onDismiss)
  visibleRef.current = visible
  onDismissRef.current = onDismiss

  useEffect(() => {
    if (visible) {
      presentedRef.current = true
      modalRef.current?.present()
    } else if (presentedRef.current) {
      modalRef.current?.dismiss()
    }
  }, [visible])

  useEffect(() => {
    if (!visible) return undefined

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onDismissRef.current()
      return true
    })
    return () => subscription.remove()
  }, [visible])

  const handleDismiss = useCallback(() => {
    presentedRef.current = false
    if (visibleRef.current) onDismissRef.current()
  }, [])

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior={dismissible ? 'close' : 'none'}
      />
    ),
    [dismissible],
  )

  const renderHandle = useMemo(
    () => () => (
      <View style={styles.header} testID={testID ? `${testID}-header` : undefined}>
        {dismissible ? (
          <Pressable
            accessibilityLabel={dismissLabel}
            accessibilityRole="button"
            onPress={() => onDismissRef.current()}
            style={styles.grabberHit}
            testID={testID ? `${testID}-grabber` : undefined}
          >
            <View style={styles.grabber} />
          </Pressable>
        ) : (
          <View style={styles.grabberHit} testID={testID ? `${testID}-grabber-space` : undefined} />
        )}
        <View style={styles.titles}>
          <Text accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>
      </View>
    ),
    [description, dismissLabel, dismissible, testID, title],
  )

  return (
    <BottomSheetModal
      android_keyboardInputMode="adjustResize"
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.surface}
      containerComponent={ModalContainer}
      enableDynamicSizing
      enablePanDownToClose={dismissible}
      handleComponent={renderHandle}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      onDismiss={handleDismiss}
      ref={modalRef}
      topInset={insets.top + TOP_GAP}
    >
      <BottomSheetScrollView
        contentContainerStyle={[styles.content, { paddingBottom: SIDE_PADDING + insets.bottom }]}
        testID={testID ? `${testID}-content` : undefined}
      >
        {children}
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
}
