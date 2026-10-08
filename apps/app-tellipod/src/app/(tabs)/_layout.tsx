import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="ask-telli" options={{ title: 'Ask Telli' }} />
      <Tabs.Screen name="navigation" options={{ title: 'Navigation' }} />
    </Tabs>
  );
}
