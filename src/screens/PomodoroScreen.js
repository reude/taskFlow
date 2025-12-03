import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TaskContext } from '../context/TaskContext';

export default function PomodoroScreen({ route }) {
  const { preferences } = useContext(TaskContext);
  const { focusTime, breakTime, isDarkMode } = preferences;

  const taskName = route.params?.taskName || "Foco Total";

  const [seconds, setSeconds] = useState(focusTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus');


  useEffect(() => {
    if (!isActive) {
      setSeconds(mode === 'focus' ? focusTime * 60 : breakTime * 60);
    }
  }, [focusTime, breakTime, mode]);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      handleTimerEnd();
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const handleTimerEnd = () => {
    if (mode === 'focus') {
      Alert.alert("🍅 Parabéns!", "Ciclo de foco concluído. Hora do descanso!");
      setMode('break');
      setSeconds(breakTime * 60);
    } else {
      Alert.alert("🔋 Descanso acabou!", "Bora voltar pro foco?");
      setMode('focus');
      setSeconds(focusTime * 60);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const theme = {
    bg: isDarkMode ? '#1a1a1a' : '#fff',
    text: isDarkMode ? '#fff' : '#333',
    tomato: mode === 'focus' ? '#e74c3c' : '#2ecc71' // Vermelho foco, Verde descanso
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.modeTitle, { color: theme.text }]}>
        {mode === 'focus' ? "Hora de Focar" : "Pausa para Café"}
      </Text>
      
      <Text style={[styles.taskLabel, { color: theme.text }]}>{taskName}</Text>

      <View style={styles.timerContainer}>
        <MaterialCommunityIcons name="timer-sand" size={280} color={theme.tomato} style={{ opacity: 0.1, position: 'absolute' }} />
        <MaterialCommunityIcons name="fruit-cherries" size={60} color={theme.tomato} style={{marginBottom: 20}} />
        <Text style={[styles.timer, { color: theme.tomato }]}>{formatTime(seconds)}</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity 
          style={[styles.btn, { backgroundColor: theme.tomato }]} 
          onPress={() => setIsActive(!isActive)}
        >
          <Text style={styles.btnText}>{isActive ? "PAUSAR" : "INICIAR"}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.btn, { backgroundColor: 'gray' }]} 
          onPress={() => { setIsActive(false); setSeconds(mode === 'focus' ? focusTime * 60 : breakTime * 60); }}
        >
          <Text style={styles.btnText}>RESET</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modeTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  taskLabel: { fontSize: 18, fontStyle: 'italic', marginBottom: 40, opacity: 0.7 },
  timerContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 50 },
  timer: { fontSize: 90, fontWeight: 'bold', fontVariant: ['tabular-nums'] },
  buttons: { flexDirection: 'row', gap: 20 },
  btn: { paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, elevation: 5 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});