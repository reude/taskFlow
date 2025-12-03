import React, { useContext } from 'react';
import { View, Text, Switch, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { TaskContext } from '../context/TaskContext';

export default function SettingsScreen() {
  const { preferences, updatePreferences } = useContext(TaskContext);
  const { isDarkMode, focusTime, breakTime } = preferences;

  const theme = {
    bg: isDarkMode ? '#1a1a1a' : '#fff',
    text: isDarkMode ? '#fff' : '#000',
    inputBg: isDarkMode ? '#333' : '#eee'
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.text }]}>Configurações</Text>

      <View style={styles.option}>
        <Text style={{ fontSize: 18, color: theme.text }}>Modo Escuro 🌙</Text>
        <Switch 
          value={isDarkMode} 
          onValueChange={(val) => updatePreferences({ isDarkMode: val })} 
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Temporizador (minutos)</Text>
        
        <View style={styles.inputRow}>
          <Text style={{ color: theme.text }}>Foco:</Text>
          <TextInput 
            style={[styles.input, { color: theme.text, backgroundColor: theme.inputBg }]}
            keyboardType="numeric"
            value={String(focusTime)}
            onChangeText={(val) => updatePreferences({ focusTime: Number(val) || 25 })}
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={{ color: theme.text }}>Descanso:</Text>
          <TextInput 
            style={[styles.input, { color: theme.text, backgroundColor: theme.inputBg }]}
            keyboardType="numeric"
            value={String(breakTime)}
            onChangeText={(val) => updatePreferences({ breakTime: Number(val) || 5 })}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  inputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  input: { width: 80, padding: 10, borderRadius: 8, textAlign: 'center', fontSize: 18 }
});