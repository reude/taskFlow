import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { TaskContext } from '../context/TaskContext';
import { Ionicons } from '@expo/vector-icons';

export default function TaskDetailsScreen({ route, navigation }) {
  const { taskId } = route.params;
  const { tasks, updateTask, preferences } = useContext(TaskContext);
  
  const task = tasks.find(t => t.id === taskId);
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');

  const { isDarkMode } = preferences;
  const theme = {
    bg: isDarkMode ? '#1a1a1a' : '#fff',
    text: isDarkMode ? '#fff' : '#000',
    inputBg: isDarkMode ? '#333' : '#f9f9f9'
  };

  const handleSave = () => {
    updateTask(taskId, title, description);
    navigation.goBack();
  };

  const goToPomodoro = () => {
    navigation.navigate('Main', { 
      screen: 'Pomodoro', 
      params: { taskName: title } 
    });
  };

  if (!task) return <View><Text>Tarefa não encontrada</Text></View>;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.label, { color: theme.text }]}>Título:</Text>
      <TextInput 
        style={[styles.input, { color: theme.text, backgroundColor: theme.inputBg }]} 
        value={title} 
        onChangeText={setTitle} 
      />

      <Text style={[styles.label, { color: theme.text }]}>Detalhes/Anotações:</Text>
      <TextInput 
        style={[styles.input, styles.textArea, { color: theme.text, backgroundColor: theme.inputBg }]} 
        value={description} 
        onChangeText={setDescription} 
        multiline 
        numberOfLines={4}
        textAlignVertical="top"
      />

      <View style={{ gap: 15, marginTop: 20 }}>
        <Button title="Salvar Alterações" onPress={handleSave} />
        
        <TouchableOpacity style={styles.pomodoroBtn} onPress={goToPomodoro}>
          <Ionicons name="timer" size={24} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.pomodoroText}>Focar nesta Tarefa (Pomodoro)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, marginBottom: 5, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16 },
  textArea: { height: 100 },
  pomodoroBtn: { backgroundColor: '#e74c3c', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 8 },
  pomodoroText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});