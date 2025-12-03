import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { TaskContext } from '../context/TaskContext';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const API_KEY = "."; 

export default function AIScreen() {
  const { tasks, preferences } = useContext(TaskContext);
  const { isDarkMode } = preferences;
  const [report, setReport] = useState("Clique no botão para analisar sua produtividade.");
  const [loading, setLoading] = useState(false);

  const theme = {
    bg: isDarkMode ? '#121212' : '#f5f5f5',
    card: isDarkMode ? '#1e1e1e' : '#fff',
    text: isDarkMode ? '#eee' : '#333',
    primary: '#6c5ce7'
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});

      const completedCount = tasks.filter(t => t.completed).length;
      const totalCount = tasks.length;
      
      const prompt = `Aja como um coach de produtividade. O usuário completou ${completedCount} de ${totalCount} tarefas hoje. As tarefas são: ${tasks.map(t => t.title).join(", ")}. Dê um feedback curto, direto e motivacional de até 300 caracteres. Use emojis.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setReport(response.text());
    } catch (error) {
      setReport("Erro de conexão. Verifique sua internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <MaterialCommunityIcons name="robot-excited" size={60} color={theme.primary} />
        <Text style={[styles.title, { color: theme.text }]}>Coach Virtual</Text>
      </View>

      <View style={[styles.resultBox, { backgroundColor: theme.card }]}>
        <ScrollView>
          <Text style={[styles.text, { color: theme.text }]}>{report}</Text>
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : (
        <TouchableOpacity style={[styles.btn, { backgroundColor: theme.primary }]} onPress={generateReport}>
          <Text style={styles.btnText}>Gerar Relatório</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  resultBox: { flex: 1, padding: 20, borderRadius: 15, marginBottom: 20, elevation: 2 },
  text: { fontSize: 18, lineHeight: 28 },
  btn: { padding: 15, borderRadius: 12, alignItems: 'center', elevation: 3 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});