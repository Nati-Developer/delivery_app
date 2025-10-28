<<<<<<< HEAD
import {SplashScreen, Stack} from "expo-router";
import { useFonts } from 'expo-font';
import { useEffect} from "react";

import './globals.css';
import useAuthStore from "@/store/auth.store";

export default function RootLayout() {
  const { isLoading, fetchAuthenticatedUser } = useAuthStore();

  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require('../assets/fonts/Quicksand-Bold.ttf'),
    "QuickSand-Medium": require('../assets/fonts/Quicksand-Medium.ttf'),
    "QuickSand-Regular": require('../assets/fonts/Quicksand-Regular.ttf'),
    "QuickSand-SemiBold": require('../assets/fonts/Quicksand-SemiBold.ttf'),
    "QuickSand-Light": require('../assets/fonts/Quicksand-Light.ttf'),
  });

  useEffect(() => {
    if(error) throw error;
    if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  useEffect(() => {
    fetchAuthenticatedUser()
  }, []);

  if(!fontsLoaded || isLoading) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
=======
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
>>>>>>> 865d2fbcf8094de6851405df97b0a80a7d5ca5e0
