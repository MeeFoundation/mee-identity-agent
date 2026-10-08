import { Button } from '@mee/ui'
import { Text, View } from 'react-native'

export default function HomeScreen() {
  return (
    <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
      <Text>Home</Text>
      <Button>button</Button>
    </View>
  )
}
