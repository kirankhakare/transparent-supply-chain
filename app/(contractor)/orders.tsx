import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

/* ================= TYPES ================= */

type OrderStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

type Order = {
  id: string;
  orderNumber: string;
  projectId: string;
  projectName: string;
  supplier: string;
  materials: string[];
  amount: string;
  status: OrderStatus;
  expectedDelivery: string;
  items: number;
};

/* ================= DUMMY DATA ================= */

const ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    projectId: 'p1',
    projectName: 'Apartment Construction',
    supplier: 'BuildMart',
    materials: ['Cement', 'Steel', 'Bricks'],
    amount: '₹12,500',
    status: 'DELIVERED',
    expectedDelivery: '25 Jan 2024',
    items: 15,
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    projectId: 'p1',
    projectName: 'Apartment Construction',
    supplier: 'Electrical World',
    materials: ['Wires', 'Switches'],
    amount: '₹8,700',
    status: 'SHIPPED',
    expectedDelivery: '10 Feb 2024',
    items: 8,
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    projectId: 'p2',
    projectName: 'Office Renovation',
    supplier: 'Plumbing Pro',
    materials: ['Pipes', 'Fittings'],
    amount: '₹6,200',
    status: 'APPROVED',
    expectedDelivery: '20 Feb 2024',
    items: 10,
  },
];

export default function Orders() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const filteredOrders = ORDERS.filter((o) => {
    if (projectId && o.projectId !== projectId) return false;
    if (filter !== 'ALL' && o.status !== filter) return false;

    if (!search) return true;

    return (
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.supplier.toLowerCase().includes(search.toLowerCase())
    );
  });

  const statusColor = (s: OrderStatus) => {
    switch (s) {
      case 'PENDING': return '#f59e0b';
      case 'APPROVED': return '#2563eb';
      case 'SHIPPED': return '#7c3aed';
      case 'DELIVERED': return '#10b981';
      case 'CANCELLED': return '#ef4444';
    }
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.cardHeader}>
        <Text style={styles.orderNo}>{item.orderNumber}</Text>
        <View style={[styles.statusPill, { backgroundColor: statusColor(item.status) + '22' }]}>
          <Text style={[styles.statusText, { color: statusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.project}>{item.projectName}</Text>

      <View style={styles.metaRow}>
        <Ionicons name="business-outline" size={16} color="#64748b" />
        <Text style={styles.metaText}>{item.supplier}</Text>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="calendar-outline" size={16} color="#64748b" />
        <Text style={styles.metaText}>Delivery: {item.expectedDelivery}</Text>
      </View>

      {/* MATERIALS */}
      <View style={styles.materialWrap}>
        {item.materials.map((m, i) => (
          <View key={i} style={styles.materialChip}>
            <Text style={styles.materialText}>{m}</Text>
          </View>
        ))}
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.amount}>{item.amount}</Text>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push(`/(contractor)/orderDetails?id=${item.id}`)}
        >
          <Text style={styles.primaryBtnText}>View Details</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Material Orders</Text>
        <Text style={styles.subtitle}>Project-wise order tracking</Text>
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#94a3b8" />
        <TextInput
          placeholder="Search order or supplier..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* FILTER SELECTOR */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {['ALL', 'PENDING', 'APPROVED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterBtn,
              filter === f && styles.filterBtnActive,
            ]}
            onPress={() => setFilter(f as any)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* LIST */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(i) => i.id}
        renderItem={renderOrder}
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(false)} />
        }
        ListEmptyComponent={<Text style={styles.empty}>No orders found</Text>}
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

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 48,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15 },

  filterRow: { paddingHorizontal: 20, marginBottom: 8 },
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
  filterText: { fontSize: 13, fontWeight: '700', color: '#64748b' },
  filterTextActive: { color: '#fff' },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  orderNo: { fontSize: 16, fontWeight: '800', color: '#0f172a' },

  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  statusText: { fontSize: 12, fontWeight: '800' },

  project: { fontSize: 14, color: '#64748b', marginBottom: 8 },

  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  metaText: { marginLeft: 8, fontSize: 13, color: '#475569' },

  materialWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  materialChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  materialText: { fontSize: 12, fontWeight: '600', color: '#475569' },

  footer: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: { fontSize: 20, fontWeight: '800', color: '#0f172a' },

  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#94a3b8',
  },
});
