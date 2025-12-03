import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  // Carregar tarefas ao abrir o app
  useEffect(() => {
    const loadTasks = async () => {
      const storedTasks = await AsyncStorage.getItem('@taskflow_tasks');
      if (storedTasks) setTasks(JSON.parse(storedTasks));
    };
    loadTasks();
  }, []);

  // Salvar tarefas sempre que houver mudança
  useEffect(() => {
    const saveTasks = async () => {
      await AsyncStorage.setItem('@taskflow_tasks', JSON.stringify(tasks));
    };
    saveTasks();
  }, [tasks]);

  const addTask = (title) => {
    const newTask = { id: uuidv4(), title, completed: false, focusMinutes: 0 };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};