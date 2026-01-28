import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { API } from '@/services/api';

/* ================= TYPES ================= */

type OrderStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'DELIVERED';

type Order = {
  _id: string;
  site?: {
    projectName?: string;
  };
  contractor?: {
    username: string;
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

export default function Deliveries() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ORDERS ================= */

  const loadOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(API('/api/supplier/orders'), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
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

  /* ================= UPDATE STATUS ================= */

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(API(`/api/supplier/order/${id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error();

      loadOrders();
    } catch {
      Alert.alert('Failed to update order');
    }
  };

  /* ================= UI HELPERS ================= */

  const colorByStatus = (s: OrderStatus) =>
    s === 'PENDING'
      ? '#f59e0b'
      : s === 'ACCEPTED'
      ? '#2563eb'
      : s === 'DELIVERED'
      ? '#10b981'
      : '#ef4444';

  /* ================= RENDER ITEM ================= */

  const renderItem = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.orderNo}>
          #{item._id.slice(-6).toUpperCase()}
        </Text>

        <Text
          style={[
            styles.status,
            { color: colorByStatus(item.status) },
          ]}
        >
          {item.status}
        </Text>
      </View>

      {/* PROJECT */}
      <Text style={styles.project}>
        {item.site?.projectName || 'Project'}
      </Text>

      {/* CONTRACTOR */}
      <Text style={styles.meta}>
        Contractor: {item.contractor?.username || '-'}
      </Text>

      {/* MATERIALS */}
      <View style={styles.materials}>
        {item.materials.map((m, i) => (
          <Text key={i} style={styles.material}>
            • {m.name} ({m.quantity} {m.unit})
          </Text>
        ))}
      </View>

      {/* ACTIONS */}
      {item.status === 'PENDING' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#10b981' }]}
            onPress={() => updateStatus(item._id, 'ACCEPTED')}
          >
            <Text style={styles.btnText}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#ef4444' }]}
            onPress={() => updateStatus(item._id, 'REJECTED')}
          >
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.status === 'ACCEPTED' && (
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: '#2563eb', marginTop: 10 }]}
          onPress={() => updateStatus(item._id, 'DELIVERED')}
        >
          <Text style={styles.btnText}>Mark Delivered</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Deliveries</Text>

      <FlatList
        data={orders}
        keyExtractor={(i) => i._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            {loading ? 'Loading...' : 'No deliveries found'}
          </Text>
        }
      />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 12 },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  orderNo: { fontWeight: '800', fontSize: 16 },
  status: { fontWeight: '800' },

  project: { marginTop: 6, color: '#64748b' },
  meta: { marginTop: 4, fontSize: 13 },

  materials: { marginTop: 8 },
  material: { fontSize: 13, color: '#475569' },

  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },

  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  btnText: { color: '#fff', fontWeight: '800' },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#94a3b8',
  },
});
