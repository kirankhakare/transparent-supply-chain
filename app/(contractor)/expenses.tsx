import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '@/services/api';

/* ================= TYPES ================= */

type ExpenseCategory =
  | 'MATERIALS'
  | 'LABOR'
  | 'EQUIPMENT'
  | 'TRANSPORT'
  | 'OTHER';

type Expense = {
  _id: string;
  site?: {
    projectName?: string;
  };
  category: ExpenseCategory;
  description?: string;
  amount: number;
  paidTo?: string;
  payment: 'CASH' | 'BANK' | 'ONLINE';
  createdAt: string;
};

/* ================= COMPONENT ================= */

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD EXPENSES ================= */

  const loadExpenses = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(API('/api/contractor/expenses'), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log('Failed to load expenses', err);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadExpenses();
    setRefreshing(false);
  };

  /* ================= HELPERS ================= */

  const iconByCategory = (c: ExpenseCategory) => {
    switch (c) {
      case 'MATERIALS':
        return 'cube-outline';
      case 'LABOR':
        return 'people-outline';
      case 'EQUIPMENT':
        return 'construct-outline';
      case 'TRANSPORT':
        return 'car-outline';
      default:
        return 'receipt-outline';
    }
  };

  const filtered = expenses.filter((e) => {
    if (!search) return true;

    return (
      e.description?.toLowerCase().includes(search.toLowerCase()) ||
      e.site?.projectName?.toLowerCase().includes(search.toLowerCase()) ||
      e.paidTo?.toLowerCase().includes(search.toLowerCase())
    );
  });

  /* ================= RENDER ITEM ================= */

  const renderItem = ({ item }: { item: Expense }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.categoryPill}>
          <Ionicons
            name={iconByCategory(item.category)}
            size={16}
            color="#2563eb"
          />
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>

        <Text style={styles.amount}>₹ {item.amount}</Text>
      </View>

      <Text style={styles.desc}>
        {item.description || 'Expense'}
      </Text>

      <Text style={styles.project}>
        {item.site?.projectName || 'Project'}
      </Text>

      <View style={styles.metaRow}>
        {item.paidTo && (
          <View style={styles.metaItem}>
            <Ionicons name="person-outline" size={14} />
            <Text style={styles.metaText}>{item.paidTo}</Text>
          </View>
        )}

        <View style={styles.metaItem}>
          <Ionicons name="card-outline" size={14} />
          <Text style={styles.metaText}>{item.payment}</Text>
        </View>
      </View>

      <Text style={styles.date}>
        {new Date(item.createdAt).toDateString()}
      </Text>
    </View>
  );

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Text style={styles.title}>Expenses</Text>

      <TextInput
        placeholder="Search expense..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <FlatList
        data={filtered}
        keyExtractor={(i) => i._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            {loading ? 'Loading expenses...' : 'No expenses found'}
          </Text>
        }
      />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 12 },

  search: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  categoryPill: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },

  categoryText: { fontWeight: '800', color: '#2563eb' },
  amount: { fontSize: 20, fontWeight: '800' },

  desc: { fontSize: 16, fontWeight: '700', marginTop: 10 },
  project: { fontSize: 13, color: '#64748b', marginTop: 2 },

  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },

  metaItem: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  metaText: { color: '#475569', fontWeight: '600' },

  date: {
    marginTop: 6,
    fontSize: 12,
    color: '#94a3b8',
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#94a3b8',
  },
});
