import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import socket, {
  connectSocket,
  disconnectSocket,
  joinRoom,
  onReceiveMessage,
} from '../../services/socket';

import { API } from '@/services/api';

export default function ContractorChat() {
  const [room, setRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [myId, setMyId] = useState<string | null>(null);

  const flatRef = useRef<FlatList>(null);
  const router = useRouter();

  /* ================= INIT ================= */
  useEffect(() => {
  initChat();

  return () => {
    disconnectSocket(); // ✅ SAFE
  };
}, []);
  /* ================= SOCKET ================= */
  useEffect(() => {
    onReceiveMessage((msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  const initChat = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;

    connectSocket();

    // 🔹 contractor info
    const meRes = await fetch(API('/api/auth/me'), {
      headers: { Authorization: `Bearer ${token}` },
    });
    const me = await meRes.json();
    setMyId(me._id);

    // 🔹 room
    const roomRes = await fetch(API('/api/chat/my-room'), {
      headers: { Authorization: `Bearer ${token}` },
    });
    const roomData = await roomRes.json();
    if (!roomData?._id) return;

    setRoom(roomData);
    joinRoom(roomData._id);

    // 🔹 messages
    const msgRes = await fetch(
      API(`/api/chat/${roomData._id}/messages`),
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setMessages(await msgRes.json());
  };

  const sendMessage = async () => {
    if (!text.trim() || !room?._id) return;

    const token = await AsyncStorage.getItem('token');

    const res = await fetch(API(`/api/chat/${room._id}/message`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });

    const saved = await res.json();
    setMessages((prev) => [...prev, saved]);
    setText('');
  };

  /* ================= UI ================= */
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(contractor)/projects')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={{ marginLeft: 12 }}>
          <Text style={styles.headerTitle}>User Chat</Text>
          <Text style={styles.headerSub}>online</Text>
        </View>
      </View>

      {/* MESSAGES */}
      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 12 }}
        onContentSizeChange={() =>
          flatRef.current?.scrollToEnd({ animated: true })
        }
        renderItem={({ item }) => {
          const isMe = item.sender === myId;

          return (
            <View
              style={[
                styles.bubble,
                isMe ? styles.myBubble : styles.otherBubble,
              ]}
            >
              <Text style={styles.msgText}>{item.text}</Text>
              <Text style={styles.time}>
                {new Date(item.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          );
        }}
      />

      {/* INPUT */}
      <View style={styles.inputBar}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Message"
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ece5dd',
  },

  header: {
    height: 56,
    backgroundColor: '#075e54',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  headerSub: {
    color: '#d1fae5',
    fontSize: 12,
  },

  bubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
  },
  myBubble: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  msgText: {
    fontSize: 15,
    color: '#111827',
  },
  time: {
    fontSize: 10,
    color: '#6b7280',
    alignSelf: 'flex-end',
    marginTop: 4,
  },

  inputBar: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: '#25d366',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
