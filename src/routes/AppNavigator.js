import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TaskContext } from '../context/TaskContext';

import WelcomeScreen from '../screens/WelcomeScreen';
import TasksScreen from '../screens/TasksScreen';
import PomodoroScreen from '../screens/PomodoroScreen';
import AIScreen from '../screens/AIScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { preferences } = useContext(TaskContext);
  const isDark = preferences.isDarkMode;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#1a1a1a' : '#fff',
          borderTopColor: isDark ? '#333' : '#eee',
        },
        tabBarActiveTintColor: '#E74C3C',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Tarefas') iconName = 'checkbox-marked-outline';
          else if (route.name === 'Pomodoro') iconName = 'clock-outline';
          else if (route.name === 'Relatório IA') iconName = 'robot';
          else if (route.name === 'Config') iconName = 'cog-outline';
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Tarefas" component={TasksScreen} />
      <Tab.Screen name="Pomodoro" component={PomodoroScreen} />
      <Tab.Screen name="Relatório IA" component={AIScreen} />
      <Tab.Screen name="Config" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen 
          name="TaskDetails" 
          component={TaskDetailsScreen} 
          options={{ 
            headerShown: true, 
            title: 'Detalhes',
            headerStyle: { backgroundColor: '#1a1a1a' }, 
            headerTintColor: '#E74C3C' 
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}