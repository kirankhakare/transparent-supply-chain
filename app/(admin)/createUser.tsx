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
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function CreateUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleCreateUser = async () => {
    // Validation
    if (!username || !password) {
      Alert.alert('Missing Information', 'All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token'); // admin token

      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // 🔐 admin protected
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Registration Failed', data.message || 'Something went wrong');
        return;
      }

      Alert.alert('Success ✅', 'User created successfully', [
        {
          text: 'Create Another',
          onPress: () => {
            setUsername('');
            setPassword('');
            setConfirmPassword('');
          },
        },
        {
          text: 'View Users',
          style: 'cancel',
        },
      ]);
    } catch (error) {
      Alert.alert('Network Error', 'Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="person-add" size={32} color="#3b82f6" />
            </View>
            <Text style={styles.title}>Create New User</Text>
            <Text style={styles.subtitle}>
              Add new users to your system with secure credentials
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Username Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Username <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter username"
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                {username.length > 0 && (
                  <TouchableOpacity onPress={() => setUsername('')}>
                    <Ionicons name="close-circle" size={20} color="#94a3b8" />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.inputHint}>Minimum 4 characters</Text>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Password <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter password"
                  style={[styles.input, styles.passwordInput]}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={22} 
                    color="#64748b" 
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.passwordStrength}>
                <View style={[
                  styles.strengthBar, 
                  { 
                    backgroundColor: password.length < 6 ? '#ef4444' : 
                                    password.length < 8 ? '#f59e0b' : 
                                    '#10b981',
                    width: `${Math.min((password.length / 12) * 100, 100)}%`
                  }
                ]} />
              </View>
              <Text style={styles.inputHint}>
                {password.length < 6 ? 'Weak' : password.length < 8 ? 'Medium' : 'Strong'} password
              </Text>
            </View>

            {/* Confirm Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Confirm Password <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  placeholder="Confirm password"
                  style={[styles.input, styles.passwordInput]}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  editable={!loading}
                />
                <TouchableOpacity 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={22} 
                    color="#64748b" 
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.passwordMatch}>
                <Ionicons 
                  name={password === confirmPassword && confirmPassword.length > 0 ? 'checkmark-circle' : 'alert-circle'} 
                  size={16} 
                  color={password === confirmPassword && confirmPassword.length > 0 ? '#10b981' : '#64748b'} 
                />
                <Text style={[
                  styles.matchText,
                  { color: password === confirmPassword && confirmPassword.length > 0 ? '#10b981' : '#64748b' }
                ]}>
                  {password === confirmPassword && confirmPassword.length > 0 ? 'Passwords match' : 'Passwords must match'}
                </Text>
              </View>
            </View>

            {/* Form Requirements */}
            <View style={styles.requirementsCard}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              <View style={styles.requirementItem}>
                <Ionicons 
                  name={password.length >= 6 ? 'checkmark-circle' : 'ellipse-outline'} 
                  size={16} 
                  color={password.length >= 6 ? '#10b981' : '#94a3b8'} 
                />
                <Text style={styles.requirementText}>At least 6 characters</Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons 
                  name={/[A-Z]/.test(password) ? 'checkmark-circle' : 'ellipse-outline'} 
                  size={16} 
                  color={/[A-Z]/.test(password) ? '#10b981' : '#94a3b8'} 
                />
                <Text style={styles.requirementText}>One uppercase letter (recommended)</Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons 
                  name={/\d/.test(password) ? 'checkmark-circle' : 'ellipse-outline'} 
                  size={16} 
                  color={/\d/.test(password) ? '#10b981' : '#94a3b8'} 
                />
                <Text style={styles.requirementText}>One number (recommended)</Text>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[
                styles.button,
                (!username || !password || !confirmPassword || password !== confirmPassword) && styles.buttonDisabled
              ]} 
              onPress={handleCreateUser}
              disabled={loading || !username || !password || !confirmPassword || password !== confirmPassword}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Ionicons name="person-add" size={22} color="#ffffff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Create User Account</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Quick Tips */}
            <View style={styles.tipsContainer}>
              <Ionicons name="information-circle-outline" size={18} color="#64748b" />
              <Text style={styles.tipsText}>
                User will receive credentials and can change password on first login
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
    paddingVertical: 8,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  inputHint: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 6,
  },
  passwordStrength: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
  },
  passwordMatch: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  matchText: {
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },
  requirementsCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 14,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  tipsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },
  tipsText: {
    fontSize: 13,
    color: '#475569',
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
});