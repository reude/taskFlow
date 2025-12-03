import React, { useContext, useState } from 'react';
import { View, Text, Button, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { TaskContext } from '../context/TaskContext';
import { GoogleGenerativeAI } from "@google/generative-ai";

// ATENÇÃO: Coloque sua chave aqui (idealmente use variáveis de ambiente)
const API_KEY = "SUA_CHAVE_API_DO_GOOGLE_AQUI"; 

export default function AIScreen() {
  const { tasks } = useContext(TaskContext);
  const [report, setReport] = useState("Clique no botão para gerar um relatório.");
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});

      const completedCount = tasks.filter(t => t.completed).length;
      const totalCount = tasks.length;
      
      const prompt = `Aja como um coach de produtividade. O usuário completou ${completedCount} de ${totalCount} tarefas hoje. As tarefas são: ${tasks.map(t => t.title).join(", ")}. Dê um feedback curto e motivacional de 3 frases.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setReport(response.text());
    } catch (error) {
      setReport("Erro ao conectar com a IA. Verifique sua internet ou a chave API.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Coach Virtual 🤖</Text>
      <ScrollView style={styles.resultBox}>
        <Text style={styles.text}>{report}</Text>
      </ScrollView>
      {loading ? <ActivityIndicator size="large" color="#0000ff" /> : <Button title="Gerar Relatório" onPress={generateReport} />}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  resultBox: { flex: 1, backgroundColor: '#f0f0f0', padding: 15, borderRadius: 10, marginBottom: 20 },
  text: { fontSize: 16, lineHeight: 24 }
});