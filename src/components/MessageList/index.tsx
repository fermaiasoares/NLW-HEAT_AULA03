import React, { useEffect, useState } from 'react';

import {
  ScrollView,
} from 'react-native';
import { io } from 'socket.io-client';
import { api } from '../../services/api';

import { MESSAGES_EXAMPLE } from '../../utils/messages';

import { IMessageProps, Message } from '../Message';

import { styles } from './styles';

const socket = io(String(api.defaults.baseURL));

let messagesQueue: IMessageProps[] = MESSAGES_EXAMPLE;

socket.on('new_message', (newMessage) => {
  messagesQueue.push(newMessage);
});

export function MessageList() {
  const [messages, setMessages] = useState<IMessageProps[]>([]);

  useEffect(() => {
    async function fetchMessages() {
      const messagesResponses = await api.get<IMessageProps[]>('/messages/latest');
      setMessages(messagesResponses.data);
    }

    fetchMessages();
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages(prevState => [messagesQueue[0], prevState[0], prevState[1]]);
        messagesQueue.shift();
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [])

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps='never'
    >
      { messages.map((message) => <Message key={message.id} data={message} />)}
    </ScrollView>
  );
}