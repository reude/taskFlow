import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TaskContext } from '../context/TaskContext';

export default function WelcomeScreen({ navigation }) {
  const { setUserName, preferences } = useContext(TaskContext);
  const [nameInput, setNameInput] = useState('');
  
  const isDark = preferences?.isDarkMode;
  const bg = isDark ? '#121212' : '#fff';
  const text = isDark ? '#fff' : '#333';
  const inputBg = isDark ? '#333' : '#f0f0f0';

  const handleStart = () => {
    if (nameInput.trim().length === 0) {
      Alert.alert("Ops!", "Por favor, digite seu nome para continuar.");
      return;
    }
    setUserName(nameInput);
    navigation.replace('Main');
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Text style={{ fontSize: 100, marginBottom: 10 }}>🍅</Text>
      
      <Text style={[styles.title, { color: text }]}>TaskFlow</Text>
      <Text style={[styles.subtitle, { color: text }]}>Organize. Foque. Realize.</Text>
      
      <View style={styles.inputBox}>
        <Text style={[styles.label, { color: text }]}>Como podemos te chamar?</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: inputBg, color: text }]}
          placeholder="Seu nome"
          placeholderTextColor="#999"
          value={nameInput}
          onChangeText={setNameInput}
        />
      </View>

      <TouchableOpacity 
        style={styles.btn} 
        onPress={handleStart}
      >
        <Text style={styles.btnText}>Começar Agora</Text>
        <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" style={{marginLeft: 10}}/>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  title: { fontSize: 42, fontWeight: 'bold', marginTop: 20, marginBottom: 5 },
  subtitle: { fontSize: 18, opacity: 0.6, marginBottom: 50 },
  inputBox: { width: '100%', marginBottom: 40 },
  label: { fontSize: 16, marginBottom: 10, fontWeight: 'bold' },
  input: { width: '100%', padding: 15, borderRadius: 12, fontSize: 18 },
  btn: { flexDirection: 'row', backgroundColor: '#E74C3C', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, alignItems: 'center', elevation: 5 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});