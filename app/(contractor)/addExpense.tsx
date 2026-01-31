import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '@/services/api';

export default function AddExpense() {
  const router = useRouter();
  const { siteId } = useLocalSearchParams<{ siteId: string }>();

  const [category, setCategory] = useState('MATERIALS');
  const [amount, setAmount] = useState('');
  const [paidTo, setPaidTo] = useState('');
  const [description, setDescription] = useState('');
  const [payment, setPayment] = useState('CASH');
  const [loading, setLoading] = useState(false);

  const submitExpense = async () => {
    if (!amount) {
      Alert.alert('Amount is required');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(API('/api/contractor/expenses'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          site: siteId,
          category,
          amount: Number(amount),
          paidTo,
          description,
          payment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert(data.message || 'Failed to add expense');
        return;
      }

      Alert.alert('Expense added successfully');
      router.back();
    } catch {
      Alert.alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Add Expense</Text>

        <TextInput
          placeholder="Category (MATERIALS / LABOR / OTHER)"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
        />

        <TextInput
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
        />

        <TextInput
          placeholder="Paid To"
          value={paidTo}
          onChangeText={setPaidTo}
          style={styles.input}
        />

        <TextInput
          placeholder="Remarks / Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />

        <TextInput
          placeholder="Payment Mode (CASH / BANK / ONLINE)"
          value={payment}
          onChangeText={setPayment}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={submitExpense}
          disabled={loading}
        >
          <Text style={styles.submitText}>
            {loading ? 'Saving...' : 'Save Expense'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  submitBtn: {
    backgroundColor: '#f97316',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});
