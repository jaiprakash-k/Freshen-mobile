/**
 * FreshKeep Mobile App
 * Main entry point
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import { AppNavigator } from './src/navigation';
import { colors } from './src/styles/colors';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <StatusBar style="light" backgroundColor={colors.background} />
        <AppNavigator />
      </AppProvider>
    </AuthProvider>
  );
}
