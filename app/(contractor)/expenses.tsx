import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

/* ================= TYPES ================= */

type ExpenseStatus = 'VERIFIED' | 'PENDING' | 'REJECTED';
type ExpenseCategory = 'MATERIALS' | 'LABOR' | 'EQUIPMENT' | 'TRANSPORT' | 'OTHER';

type Expense = {
  id: string;
  project: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  status: ExpenseStatus;
  paidTo: string;
  payment: 'CASH' | 'BANK' | 'ONLINE';
};

/* ================= DUMMY DATA ================= */

const EXPENSES: Expense[] = [
  {
    id: '1',
    project: 'Apartment Construction',
    category: 'MATERIALS',
    description: 'Cement & Steel Purchase',
    amount: 4250,
    date: '15 Jan 2024',
    status: 'VERIFIED',
    paidTo: 'BuildMart',
    payment: 'BANK',
  },
  {
    id: '2',
    project: 'Apartment Construction',
    category: 'LABOR',
    description: 'Masonry Work',
    amount: 3200,
    date: '22 Jan 2024',
    status: 'VERIFIED',
    paidTo: 'Local Workers',
    payment: 'CASH',
  },
  {
    id: '3',
    project: 'Office Renovation',
    category: 'EQUIPMENT',
    description: 'Crane Rental',
    amount: 1500,
    date: '01 Feb 2024',
    status: 'PENDING',
    paidTo: 'Heavy Rentals',
    payment: 'ONLINE',
  },
];

/* ================= COMPONENT ================= */

export default function Expenses() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'ALL' | ExpenseStatus>('ALL');
  const [category, setCategory] = useState<'ALL' | ExpenseCategory>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = EXPENSES.filter((e) => {
    if (status !== 'ALL' && e.status !== status) return false;
    if (category !== 'ALL' && e.category !== category) return false;

    if (!search) return true;
    return (
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.project.toLowerCase().includes(search.toLowerCase()) ||
      e.paidTo.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalAmount = EXPENSES.reduce((s, e) => s + e.amount, 0);

  const colorByStatus = (s: ExpenseStatus) =>
    s === 'VERIFIED' ? '#10b981' : s === 'PENDING' ? '#f59e0b' : '#ef4444';

  const iconByCategory = (c: ExpenseCategory) => {
    switch (c) {
      case 'MATERIALS': return 'cube';
      case 'LABOR': return 'people';
      case 'EQUIPMENT': return 'construct';
      case 'TRANSPORT': return 'car';
      default: return 'receipt';
    }
  };

  const renderItem = ({ item }: { item: Expense }) => (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.cardHeader}>
        <View style={styles.categoryPill}>
          <Ionicons name={iconByCategory(item.category)} size={14} color="#2563eb" />
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>

        <View style={[styles.statusPill, { backgroundColor: colorByStatus(item.status) + '22' }]}>
          <Text style={[styles.statusText, { color: colorByStatus(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.project}>{item.project}</Text>

      <View style={styles.meta}>
        <View style={styles.metaRow}>
          <Ionicons name="person-outline" size={16} color="#64748b" />
          <Text style={styles.metaText}>{item.paidTo}</Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={16} color="#64748b" />
          <Text style={styles.metaText}>{item.date}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.amount}>₹ {item.amount}</Text>
        <View style={styles.paymentPill}>
          <Ionicons name="card-outline" size={14} color="#475569" />
          <Text style={styles.paymentText}>{item.payment}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Expenses</Text>
        <Text style={styles.subtitle}>Project expense tracking</Text>
      </View>

      {/* SUMMARY */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Spent</Text>
          <Text style={styles.summaryValue}>₹ {totalAmount}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Verified</Text>
          <Text style={styles.summaryValue}>
            ₹ {EXPENSES.filter(e => e.status === 'VERIFIED').reduce((s, e) => s + e.amount, 0)}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Pending</Text>
          <Text style={styles.summaryValue}>
            ₹ {EXPENSES.filter(e => e.status === 'PENDING').reduce((s, e) => s + e.amount, 0)}
          </Text>
        </View>
      </ScrollView>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#94a3b8" />
        <TextInput
          placeholder="Search expense..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* STATUS FILTER */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {['ALL', 'VERIFIED', 'PENDING', 'REJECTED'].map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.filterBtn, status === s && styles.filterBtnActive]}
            onPress={() => setStatus(s as any)}
          >
            <Text style={[styles.filterText, status === s && styles.filterTextActive]}>
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* CATEGORY FILTER */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {['ALL', 'MATERIALS', 'LABOR', 'EQUIPMENT', 'TRANSPORT', 'OTHER'].map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.filterBtn, category === c && styles.filterBtnActiveAlt]}
            onPress={() => setCategory(c as any)}
          >
            <Text style={[styles.filterText, category === c && styles.filterTextActiveAlt]}>
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(false)} />
        }
        ListEmptyComponent={<Text style={styles.empty}>No expenses found</Text>}
      />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  header: { padding: 20 },
  title: { fontSize: 30, fontWeight: '800', color: '#0f172a' },
  subtitle: { color: '#64748b', marginTop: 4 },

  summaryRow: { paddingHorizontal: 20, marginBottom: 12 },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryLabel: { fontSize: 12, color: '#64748b' },
  summaryValue: { fontSize: 20, fontWeight: '800', color: '#0f172a' },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 48,
  },
  searchInput: { flex: 1, marginLeft: 8 },

  filterRow: { paddingHorizontal: 20, marginBottom: 10 },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
  },
  filterBtnActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterBtnActiveAlt: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  filterText: { fontSize: 13, fontWeight: '700', color: '#64748b' },
  filterTextActive: { color: '#fff' },
  filterTextActiveAlt: { color: '#fff' },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },

  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  categoryText: { fontSize: 12, fontWeight: '800', color: '#2563eb' },

  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  statusText: { fontSize: 12, fontWeight: '800' },

  desc: { fontSize: 16, fontWeight: '700', marginTop: 10, color: '#0f172a' },
  project: { fontSize: 13, color: '#64748b', marginBottom: 8 },

  meta: { marginTop: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  metaText: { marginLeft: 8, fontSize: 13, color: '#475569' },

  footer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: { fontSize: 20, fontWeight: '800', color: '#0f172a' },

  paymentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  paymentText: { fontSize: 12, fontWeight: '700', color: '#475569' },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#94a3b8',
  },
});
