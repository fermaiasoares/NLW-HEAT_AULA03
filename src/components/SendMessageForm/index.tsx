import React, { useState } from 'react';

import {
  Alert,
  Keyboard,
  TextInput,
  View
} from 'react-native';
import { api } from '../../services/api';
import { COLORS } from '../../theme';
import { Button } from '../Button';

import { styles } from './styles';

export function SendMessageForm(){
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  async function handleMessageSubmit() {
    const messageFormatted = message.trim();

    if (messageFormatted.length > 0) {
      setSendingMessage(true);

      await api.post('messages', { message: messageFormatted });

      setMessage('');
      Keyboard.dismiss();
      
      Alert.alert('Mensagem enviada com sucesso!');
      
      setSendingMessage(false);
    } else {
      Alert.alert('Escreva a messagem para enviar');
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        keyboardAppearance="dark"
        placeholder="Qual sua expectativa para o evento"
        placeholderTextColor={COLORS.GRAY_PRIMARY}
        style={styles.textInput}
        value={message}
        editable={!sendingMessage}
        onChangeText={setMessage}
      />
      <Button 
        title="Enviar mensagem"
        color={COLORS.WHITE}
        backgroundColor={COLORS.PINK}
        isLoading={sendingMessage}
        onPress={handleMessageSubmit}
      />
    </View>
  );
}