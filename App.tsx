import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppLoading from 'expo-app-loading';
import { 
  useFonts, 
  Roboto_700Bold, 
  Roboto_400Regular 
} from '@expo-google-fonts/roboto';

import { Home } from './src/screens/Home/index';
import { AuthProvider } from './src/hooks/auth';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  });

  if (!fontsLoaded) {
    <AppLoading />
  }

  return (
    <AuthProvider>
      <StatusBar 
        style="light"
        backgroundColor="transparent"
        translucent
        />
      <Home />
    </AuthProvider>
  );
}