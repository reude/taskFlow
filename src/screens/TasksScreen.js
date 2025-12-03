import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { TaskContext } from '../context/TaskContext';
import { Ionicons } from '@expo/vector-icons';

export default function TasksScreen() {
  const { tasks, addTask, toggleTask, deleteTask } = useContext(TaskContext);
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (text.trim()) {
      addTask(text);
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Nova tarefa..." 
          value={text} 
          onChangeText={setText} 
        />
        <Button title="Add" onPress={handleAdd} />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => toggleTask(item.id)} style={{flex: 1}}>
              <Text style={[styles.taskText, item.completed && styles.completed]}>
                {item.title}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', marginRight: 10, padding: 8, borderRadius: 5 },
  card: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', marginBottom: 10, borderRadius: 8, alignItems: 'center', elevation: 2 },
  taskText: { fontSize: 16 },
  completed: { textDecorationLine: 'line-through', color: '#aaa' }
});