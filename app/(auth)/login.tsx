import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE_URL =  process.env.EXPO_PUBLIC_API_URL;

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

 const handleLogin = async () => {
  if (!username || !password) {
    Alert.alert('Error', 'All fields are required');
    return;
  }

  try {
    setLoading(true);

    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      Alert.alert('Login Failed', data.message || 'Invalid credentials');
      return;
    }

    // ✅ SAVE TOKEN + ROLE
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('role', data.role);

    // 🔀 ROLE BASED ROUTING
    if (data.role === 'admin') {
      router.replace('/(admin)/dashboard');
    } else if (data.role === 'contractor') {
      router.replace('/(contractor)/projects');
    } else if (data.role === 'supplier') {
      router.replace('/(supplier)/materials');
    } else {
      router.replace('/(user)/userDashboard');
    }

  } catch (error) {
    Alert.alert(
      'Server Sleeping 😴',
      'Render backend is waking up. Please try again in 10 seconds.'
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="User ID / Email"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.btnText}>
          {loading ? 'Please wait...' : 'Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#0f172a',
  },
  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  link: {
    color: '#93c5fd',
    textAlign: 'center',
    marginTop: 20,
  },
});
