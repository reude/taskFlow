import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { TaskContext } from '../context/TaskContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const API_KEY = ","; 

export default function AIScreen() {
  const { tasks, preferences, userName } = useContext(TaskContext);
  const { isDarkMode } = preferences;
  const [report, setReport] = useState("Clique no botão para analisar sua produtividade.");
  const [loading, setLoading] = useState(false);

  const theme = {
    bg: isDarkMode ? '#121212' : '#f5f5f5',
    card: isDarkMode ? '#1e1e1e' : '#fff',
    text: isDarkMode ? '#eee' : '#333',
    primary: '#E74C3C'
  };

  const generateReport = async () => {
    if (!API_KEY || API_KEY.includes(".")) {
        setReport("Erro: Você precisa colar a chave da API no código");
        return;
    }

    setLoading(true);
    try {
      const completedCount = tasks.filter(t => t.completed).length;
      const totalCount = tasks.length;
      const taskNames = tasks.map(t => t.title).join(", ");
      
      const prompt = `Aja como um coach de produtividade. O usuário se chama ${userName || "Estudante"}. Ele completou ${completedCount} de ${totalCount} tarefas hoje. Tarefas: ${taskNames}. Dê um feedback curto e motivacional (max 3 frases) com emojis.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await response.json();

      if (data.error) {
        setReport(`Erro da API: ${data.error.message}`);
      } else if (data.candidates && data.candidates.length > 0) {
        setReport(data.candidates[0].content.parts[0].text);
      } else {
        setReport("A IA não retornou nenhuma resposta. Tente novamente.");
      }

    } catch (error) {
      setReport("Erro de conexão. Verifique sua internet.");
      console.error(error);
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