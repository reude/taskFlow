import React from 'react';
import { TaskProvider } from './src/context/TaskContext';
import AppNavigator from './src/routes/AppNavigator';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <TaskProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </TaskProvider>
  );
}