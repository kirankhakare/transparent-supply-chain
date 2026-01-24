import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { API } from '../../services/api'; // 👈 API helper import

type RoleType = 'user' | 'contractor' | 'supplier';

export default function CreateUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<RoleType>('user');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleCreateUser = async () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Minimum 6 characters required');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(API('/api/admin/create-user'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          password,
          role, // 👈 lowercase role
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Failed', data.message || 'User creation failed');
        return;
      }

      Alert.alert(
        'Success ✅',
        `${role.toUpperCase()} created successfully`,
        [
          {
            text: 'Create Another',
            onPress: () => {
              setUsername('');
              setPassword('');
              setConfirmPassword('');
              setRole('user');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Network Error', 'Server not reachable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.iconBox}>
              <Ionicons name="person-add" size={34} color="#2563eb" />
            </View>
            <Text style={styles.title}>Create System User</Text>
            <Text style={styles.subtitle}>
              Add Contractor, Supplier or User
            </Text>
          </View>

          {/* FORM */}
          <View style={styles.card}>
            {/* ROLE SELECTION */}
            <Text style={styles.label}>Select Role *</Text>

            <View style={styles.roleRow}>
              {[
                { key: 'user', label: 'USER', icon: 'person-outline' },
                {
                  key: 'contractor',
                  label: 'CONTRACTOR',
                  icon: 'construct-outline',
                },
                {
                  key: 'supplier',
                  label: 'SUPPLIER',
                  icon: 'business-outline',
                },
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.roleCard,
                    role === item.key && styles.roleCardActive,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => setRole(item.key as RoleType)}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={18}
                    color={role === item.key ? '#ffffff' : '#475569'}
                    style={{ marginBottom: 6 }}
                  />
                  <Text
                    style={[
                      styles.roleLabel,
                      role === item.key && styles.roleLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* USERNAME */}
            <Text style={styles.label}>Username *</Text>
            <View style={styles.inputBox}>
              <Ionicons name="person-outline" size={20} color="#64748b" />
              <TextInput
                placeholder="Enter username"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            {/* PASSWORD */}
            <Text style={styles.label}>Password *</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color="#64748b" />
              <TextInput
                placeholder="Enter password"
                secureTextEntry={!showPassword}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#64748b"
                />
              </TouchableOpacity>
            </View>

            {/* CONFIRM PASSWORD */}
            <Text style={styles.label}>Confirm Password *</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color="#64748b" />
              <TextInput
                placeholder="Confirm password"
                secureTextEntry={!showConfirmPassword}
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#64748b"
                />
              </TouchableOpacity>
            </View>

            {/* SUBMIT */}
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleCreateUser}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={22}
                    color="#fff"
                  />
                  <Text style={styles.buttonText}>
                    Create {role.toUpperCase()}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 6,
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    marginTop: 16,
  },
  roleRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 24,
},
roleCard: {
  flex: 1,
  backgroundColor: '#ffffff',
  borderRadius: 16,
  paddingVertical: 18,
  alignItems: 'center',
  borderWidth: 1.5,
  borderColor: '#cbd5e1',
},

roleCardActive: {
  backgroundColor: '#2563eb',
  borderColor: '#2563eb',
  shadowColor: '#2563eb',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.25,
  shadowRadius: 10,
  elevation: 6,
},

roleLabel: {
  fontSize: 13,
  fontWeight: '700',
  color: '#334155',
},

roleLabelActive: {
  color: '#ffffff',
},
  roleChip: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
  },
  roleActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 54,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#0f172a',
  },
  button: {
    marginTop: 30,
    marginBottom :20,
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
