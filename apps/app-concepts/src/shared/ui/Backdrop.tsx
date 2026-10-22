import { type ElementRef, type FC, useLayoutEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  Easing,
  type GestureResponderEvent,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native'

type BackdropProps = {
  onClick?: () => void
  color?: string
}

export const Backdrop: FC<BackdropProps> = ({ onClick, color = 'transparent' }) => {
  const mainRef = useRef<ElementRef<typeof Animated.View>>(null)
  const backdropOpacity = new Animated.Value(0)
  const windowWidth = Dimensions.get('window').width
  const windowHeight = Dimensions.get('window').height
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const showBackdrop = () => {
    Animated.timing(backdropOpacity, {
      duration: 300,
      easing: Easing.linear,
      toValue: 0.6,
      useNativeDriver: true,
    }).start()
  }

  const clickHandler = (e: GestureResponderEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (onClick) {
      onClick()
    }
  }

  // TODO Check whether thiere must be an empty dependency array
  // biome-ignore lint/correctness/useExhaustiveDependencies: react only on pos
  useLayoutEffect(() => {
    mainRef.current?.measureInWindow((x, y) => {
      setPos({ x: x > 1 ? -x : pos.x, y: y > 0 ? -y : pos.y })
    })
  }, [])

  return (
    <TouchableWithoutFeedback onPress={clickHandler}>
      <Animated.View
        onLayout={() => {
          showBackdrop()
        }}
        ref={mainRef}
        style={[
          styles.backdrop,
          {
            backgroundColor: color,
            height: windowHeight,
            left: pos.x,
            opacity: backdropOpacity,
            top: pos.y,
            width: windowWidth,
          },
        ]}
      />
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    zIndex: 98,
  },
})
