import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { TaskContext } from '../context/TaskContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const API_KEY = "AIzaSyBjkzw4AMr9HLpFn8UIWD_eLmpTLOGAYJY"; 

export default function AIScreen() {
  const { tasks, preferences, userName } = useContext(TaskContext);
  const { isDarkMode } = preferences;
  const [report, setReport] = useState("Seu assistente pessoal está pronto. Clique abaixo para gerar uma análise.");
  const [loading, setLoading] = useState(false);

  const theme = {
    bg: isDarkMode ? '#121212' : '#f5f5f5',
    card: isDarkMode ? '#1e1e1e' : '#fff',
    text: isDarkMode ? '#eee' : '#333',
    primary: '#E74C3C'
  };

  const generateReport = async () => {
    if (!API_KEY || API_KEY.includes(".")) {
        setReport("Erro: Chave de API não configurada.");
        return;
    }

    setLoading(true);
    
    try {
      const completedTasks = tasks.filter(t => t.completed);
      const taskNames = completedTasks.map(t => t.title).join(", ");
      const totalCount = tasks.length;
      const doneCount = completedTasks.length;

      const prompt = `
        Contexto: App de produtividade TaskFlow.
        Usuário: ${userName || "Aluno"}.
        Progresso: ${doneCount} de ${totalCount} tarefas concluídas.
        Lista das feitas: ${taskNames || "Nenhuma"}.
        
        Missão: 
        1. Dê um feedback motivacional curto.
        2. Se houver tarefas feitas, dê UMA dica prática relacionada ao tema delas.
        
        Estilo: Texto corrido, direto, use emojis. Máximo 300 caracteres.
      `;

      const listResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
      );
      const listData = await listResponse.json();

      let activeModel = "gemini-pro";

      if (listData.models) {
        const foundModel = listData.models.find(m => m.name.includes('gemini-1.5-flash')) 
                        || listData.models.find(m => m.name.includes('gemini-pro'))
                        || listData.models[0];
        
        if (foundModel) {
            activeModel = foundModel.name.replace("models/", "");
        }
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );

      const data = await response.json();

      if (data.error) {
        setReport(`Erro da IA: ${data.error.message}`);
      } else if (data.candidates && data.candidates.length > 0) {
        setReport(data.candidates[0].content.parts[0].text);
      } else {
        setReport("O assistente pensou, mas não respondeu. Tente novamente.");
      }

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
        <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
          <Text style={[styles.text, { color: theme.text }]}>{report}</Text>
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ padding: 15 }} />
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
  text: { fontSize: 17, lineHeight: 26, textAlign: 'left' },
  btn: { padding: 15, borderRadius: 12, alignItems: 'center', elevation: 3 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});