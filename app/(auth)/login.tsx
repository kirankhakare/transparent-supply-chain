import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, API } from '../../services/api';

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  /* OPTIONAL: Wake Render server */
  const wakeServer = async () => {
    try {
      await fetch(`${BASE_URL}/health`);
    } catch {}
  };

  const handleLogin = async () => {
    await wakeServer();

    if (!username || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(API('/api/auth/login'), {
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

      // ✅ SAVE TOKEN + ROLE (BACKEND FORMAT)
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('role', data.user.role);

      const role = data.user.role;

      // 🔀 ROLE BASED ROUTING
      if (role === 'admin') {
        router.replace('/(admin)/dashboard');
      } else if (role === 'contractor') {
        router.replace('/(contractor)/projects');
      } else if (role === 'supplier') {
        router.replace('/(supplier)/materials');
      } else {
        router.replace('/(user)/userDashboard');
      }
    } catch (error) {
      Alert.alert(
        'Server Sleeping',
        'Backend is waking up. Please try again in a few seconds.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Username"
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

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
      >
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
