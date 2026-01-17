import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
const BASE_URL =  process.env.EXPO_PUBLIC_API_URL;
useEffect(() => {
  fetch(`${BASE_URL}/`)
    .then(() => console.log('Backend warmed up'))
    .catch(() => {});
}, []);

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </>
  );
}
