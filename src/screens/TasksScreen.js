import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { TaskContext } from '../context/TaskContext';
import { Ionicons } from '@expo/vector-icons';

export default function TasksScreen({ navigation }) {
  const { tasks, addTask, toggleTask, deleteTask, preferences } = useContext(TaskContext);
  const { isDarkMode } = preferences;
  const [text, setText] = useState('');

  const theme = {
    container: isDarkMode ? '#121212' : '#f5f5f5',
    text: isDarkMode ? '#eee' : '#333',
    card: isDarkMode ? '#1e1e1e' : '#fff',
    inputBg: isDarkMode ? '#2c2c2c' : '#fff',
    placeholder: isDarkMode ? '#aaa' : '#888',
    accent: '#007AFF'
  };

  const handleAdd = () => {
    if (text.trim()) {
      addTask(text);
      setText('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.container }]}>
      <Text style={[styles.headerTitle, { color: theme.text }]}>Minhas Tarefas</Text>
      
      <View style={styles.inputContainer}>
        <TextInput 
          style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text }]} 
          placeholder="Nova tarefa..." 
          placeholderTextColor={theme.placeholder}
          value={text} 
          onChangeText={setText} 
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })} 
              style={{flex: 1}}
            >
              <View>
                <Text style={[styles.taskText, { color: theme.text }, item.completed && styles.completed]}>
                  {item.title}
                </Text>
                {item.description ? (
                  <Text style={{fontSize: 12, color: theme.placeholder}} numberOfLines={1}>
                    {item.description}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => toggleTask(item.id)} style={{marginRight: 15}}>
               <Ionicons name={item.completed ? "checkbox" : "square-outline"} size={24} color={item.completed ? "gray" : theme.accent} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Ionicons name="trash-outline" size={24} color="#ff4444" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  inputContainer: { flexDirection: 'row', marginBottom: 20, alignItems: 'center' },
  input: { flex: 1, height: 50, paddingHorizontal: 15, borderRadius: 12, marginRight: 10, fontSize: 16, elevation: 2 },
  addButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', elevation: 3 },
  card: { flexDirection: 'row', padding: 15, marginBottom: 10, borderRadius: 12, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  taskText: { fontSize: 16, fontWeight: '500' },
  completed: { textDecorationLine: 'line-through', opacity: 0.5 }
});