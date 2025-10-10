import { Stack } from 'expo-router';

export default function StoryCreationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="hero" />
      <Stack.Screen name="mode" />
      <Stack.Screen name="appearance" />
      <Stack.Screen name="questionnaire" />
      <Stack.Screen name="templates" />
      <Stack.Screen name="template-customization" />
    </Stack>
  );
}