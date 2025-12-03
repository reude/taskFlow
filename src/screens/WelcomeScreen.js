import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TaskContext } from '../context/TaskContext';

export default function WelcomeScreen({ navigation }) {
  const { preferences } = useContext(TaskContext);
  const isDark = preferences?.isDarkMode;

  const bg = isDark ? '#121212' : '#fff';
  const text = isDark ? '#fff' : '#333';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Ionicons name="checkmark-done-circle" size={100} color="#007AFF" />
      <Text style={[styles.title, { color: text }]}>TaskFlow</Text>
      <Text style={[styles.subtitle, { color: text }]}>Organize. Foque. Realize.</Text>
      
      <TouchableOpacity 
        style={styles.btn} 
        onPress={() => navigation.replace('Main')}
      >
        <Text style={styles.btnText}>Começar Agora</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" style={{marginLeft: 10}}/>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 42, fontWeight: 'bold', marginTop: 20, marginBottom: 5 },
  subtitle: { fontSize: 18, opacity: 0.6, marginBottom: 50 },
  btn: { flexDirection: 'row', backgroundColor: '#007AFF', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, alignItems: 'center', elevation: 5 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});