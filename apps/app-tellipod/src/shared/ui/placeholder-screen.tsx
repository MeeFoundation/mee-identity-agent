import { StyleSheet, Text, View } from 'react-native'

type PlaceholderScreenProps = {
  name: string
}

export const PlaceholderScreen = ({ name }: PlaceholderScreenProps) => (
  <View style={styles.container}>
    <Text>{name}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: { alignItems: 'center', flex: 1, justifyContent: 'center' },
})
