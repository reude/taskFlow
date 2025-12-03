import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

export default function PomodoroScreen() {
  const [seconds, setSeconds] = useState(25 * 60); // 25 min
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      Alert.alert("Tempo esgotado!", "Hora de descansar.");
      setSeconds(25 * 60); // Reset
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(seconds)}</Text>
      <View style={styles.buttons}>
        <Button title={isActive ? "Pausar" : "Iniciar"} onPress={() => setIsActive(!isActive)} />
        <View style={{width: 20}} />
        <Button title="Reset" color="red" onPress={() => { setIsActive(false); setSeconds(25*60); }} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  timer: { fontSize: 80, fontWeight: 'bold', marginBottom: 30 },
  buttons: { flexDirection: 'row' }
});