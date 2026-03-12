import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Mudamos para o ImagePicker (mais estável)

export default function App() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [imagem, setImagem] = useState(null);

  // Função corrigida para tirar foto
  const tirarFoto = async () => {
    // Pede permissão
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert("Permissão necessária", "Precisamos de acesso à câmera para o trabalho!");
      return;
    }

    // Abre a câmera
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri); // Salva o caminho da foto
    }
  };

  const enviarDenuncia = async () => {
    if (!titulo || !descricao) {
      Alert.alert("Atenção", "Preencha o título e a descrição.");
      return;
    }

    try {
      const response = await fetch('http://192.168.0.133:3000/denuncias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, descricao, localizacao, foto: imagem })
      });

      if (response.ok) {
        Alert.alert("Sucesso!", "Denúncia enviada com foto!");
        setTitulo(''); setDescricao(''); setLocalizacao(''); setImagem(null);
      }
    } catch (error) {
      Alert.alert("Erro", "Servidor offline ou IP mudou.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Cidadão Consciente 🏙️</Text>
      
      <TextInput style={styles.input} placeholder="Título" value={titulo} onChangeText={setTitulo} />
      <TextInput style={styles.input} placeholder="Onde?" value={localizacao} onChangeText={setLocalizacao} />
      <TextInput style={[styles.input, { height: 80 }]} placeholder="Descrição..." multiline value={descricao} onChangeText={setDescricao} />

      <TouchableOpacity style={styles.buttonCamera} onPress={tirarFoto}>
        <Text style={styles.buttonText}>📸 Tirar Foto</Text>
      </TouchableOpacity>

      {imagem && <Image source={{ uri: imagem }} style={styles.preview} />}

      <TouchableOpacity style={styles.buttonEnviar} onPress={enviarDenuncia}>
        <Text style={styles.buttonText}>Enviar Denúncia</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 30, paddingTop: 60, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#2e7d32' },
  input: { backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8, marginBottom: 10 },
  buttonCamera: { backgroundColor: '#777', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  buttonEnviar: { backgroundColor: '#2e7d32', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  preview: { width: '100%', height: 200, borderRadius: 8, marginBottom: 10 }
});