import React, { useEffect, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '@/services/api';

/* ================= TYPES ================= */

type OrderStatus = 'PENDING' | 'ACCEPTED' | 'DISPATCHED' | 'DELIVERED';

type Order = {
  _id: string;
  site?: {
    _id: string;
    projectName?: string;
  };
  supplier?: {
    username?: string;
  };
  materials: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  status: OrderStatus;
  createdAt: string;
};

/* ================= COMPONENT ================= */

export default function Orders() {
  const router = useRouter();
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();

  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ORDERS ================= */
  
  const loadOrders = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    const res = await fetch(API('/api/contractor/orders'), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch orders');
    }

    const data = await res.json();

    // ✅ Safety
    setOrders(Array.isArray(data) ? data : []);
  } catch (err) {
    console.log('Failed to load orders', err);
    setOrders([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    loadOrders();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  /* ================= HELPERS ================= */

 const statusColor = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return '#f59e0b';
    case 'ACCEPTED':
      return '#2563eb';
    case 'DISPATCHED':
      return '#7c3aed';
    case 'DELIVERED':
      return '#10b981';
    default:
      return '#64748b';
  }
};


  const filteredOrders = orders.filter((o) => {
    if (projectId && o.site?._id !== projectId) return false;
    if (filter !== 'ALL' && o.status !== filter) return false;

    if (!search) return true;

    return (
      o.supplier?.username?.toLowerCase().includes(search.toLowerCase()) ||
      o.materials.some((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  });

  /* ================= UI ================= */

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.cardHeader}>
        <Text style={styles.orderNo}>
          #{item._id.slice(-6).toUpperCase()}
        </Text>

        <View
          style={[
            styles.statusPill,
            { backgroundColor: statusColor(item.status) + '22' },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: statusColor(item.status) },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      {/* PROJECT */}
      <Text style={styles.project}>
        {item.site?.projectName || 'Project'}
      </Text>

      {/* SUPPLIER */}
      <View style={styles.metaRow}>
        <Ionicons name="business-outline" size={16} color="#64748b" />
        <Text style={styles.metaText}>
          {item.supplier?.username || 'Supplier'}
        </Text>
      </View>

      {/* DATE */}
      <View style={styles.metaRow}>
        <Ionicons name="calendar-outline" size={16} color="#64748b" />
        <Text style={styles.metaText}>
          {new Date(item.createdAt).toDateString()}
        </Text>
      </View>

      {/* MATERIALS */}
      <View style={styles.materialWrap}>
        {item.materials.map((m, i) => (
          <View key={i} style={styles.materialChip}>
            <Text style={styles.materialText}>
              {m.name} ({m.quantity} {m.unit})
            </Text>
          </View>
        ))}
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.amount}>
          {item.materials.length} items
        </Text>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() =>
            router.push(`/(contractor)/orderDetails?id=${item._id}`)
          }
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
          placeholder="Search material or supplier..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* FILTER */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {['ALL', 'PENDING', 'ACCEPTED', 'DISPATCHED', 'DELIVERED'].map(
          (f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterBtn,
                filter === f && styles.filterBtnActive,
              ]}
              onPress={() => setFilter(f as OrderStatus | 'ALL')}
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
          )
        )}
      </ScrollView>

      {/* LIST */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrder}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {loading ? 'Loading orders...' : 'No orders found'}
          </Text>
        }
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

  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginHorizontal: 6,
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
  amount: { fontSize: 18, fontWeight: '800', color: '#0f172a' },

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
