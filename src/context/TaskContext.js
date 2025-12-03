import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [userName, setUserName] = useState('');
  
  const [preferences, setPreferences] = useState({
    focusTime: 25,
    breakTime: 5,
    isDarkMode: false
  });

  useEffect(() => {
    const loadData = async () => {
      const storedTasks = await AsyncStorage.getItem('@taskflow_tasks');
      const storedPrefs = await AsyncStorage.getItem('@taskflow_prefs');
      const storedName = await AsyncStorage.getItem('@taskflow_username');
      
      if (storedTasks) setTasks(JSON.parse(storedTasks));
      if (storedPrefs) setPreferences(JSON.parse(storedPrefs));
      if (storedName) setUserName(storedName);
    };
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@taskflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    AsyncStorage.setItem('@taskflow_prefs', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    AsyncStorage.setItem('@taskflow_username', userName);
  }, [userName]);

  const addTask = (title) => {
    const newTask = { 
      id: uuidv4(), 
      title, 
      description: '', 
      completed: false 
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id, newTitle, newDescription) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, title: newTitle, description: newDescription } : t));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updatePreferences = (newPrefs) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, addTask, toggleTask, deleteTask, updateTask,
      preferences, updatePreferences,
      userName, setUserName
    }}>
      {children}
    </TaskContext.Provider>
  );
};