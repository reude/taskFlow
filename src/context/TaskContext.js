import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  
  // Novas configurações globais
  const [preferences, setPreferences] = useState({
    focusTime: 25,   // em minutos
    breakTime: 5,    // em minutos
    isDarkMode: false
  });

  // Carregar dados
  useEffect(() => {
    const loadData = async () => {
      const storedTasks = await AsyncStorage.getItem('@taskflow_tasks');
      const storedPrefs = await AsyncStorage.getItem('@taskflow_prefs');
      if (storedTasks) setTasks(JSON.parse(storedTasks));
      if (storedPrefs) setPreferences(JSON.parse(storedPrefs));
    };
    loadData();
  }, []);

  // Salvar dados
  useEffect(() => {
    AsyncStorage.setItem('@taskflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    AsyncStorage.setItem('@taskflow_prefs', JSON.stringify(preferences));
  }, [preferences]);

  // --- Ações de Tarefas ---
  const addTask = (title) => {
    const newTask = { 
      id: uuidv4(), 
      title, 
      description: '', // Novo campo
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

  // --- Ações de Preferências ---
  const updatePreferences = (newPrefs) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, addTask, toggleTask, deleteTask, updateTask, // Adicionado updateTask
      preferences, updatePreferences // Adicionados para settings
    }}>
      {children}
    </TaskContext.Provider>
  );
};