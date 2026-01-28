import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

/* ================= TYPES ================= */

type OrderStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'DELIVERED';

type Order = {
  _id: string;
  site?: { projectName?: string };
  contractor?: { username?: string };
  materials: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  status: OrderStatus;
  createdAt: string;
};

/* ================= COMPONENT ================= */

export default function SupplierOrders() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  /* ================= API ================= */

  const loadOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(API('/api/supplier/orders'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to load orders');
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

  const updateStatus = async (
    orderId: string,
    status: 'ACCEPTED' | 'REJECTED'
  ) => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${status.toLowerCase()} this order?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              setUpdatingId(orderId);
              const token = await AsyncStorage.getItem('token');

              const res = await fetch(
  API(`/api/supplier/order/${orderId}/status`),
  {
    method: 'PUT', // ✅ FIX
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  }
);

              const data = await res.json();

              if (!res.ok) {
                Alert.alert('Error', data.message || 'Action failed');
                return;
              }

              await loadOrders();
            } catch {
              Alert.alert('Server Error', 'Please try again later');
            } finally {
              setUpdatingId(null);
            }
          },
        },
      ]
    );
  };

  /* ================= HELPERS ================= */

  const statusColor = (s: OrderStatus) => {
    switch (s) {
      case 'PENDING':
        return '#f59e0b';
      case 'ACCEPTED':
        return '#2563eb';
      case 'DELIVERED':
        return '#10b981';
      case 'REJECTED':
        return '#ef4444';
    }
  };

  /* ================= RENDER ================= */

  const renderItem = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>
          #{item._id.slice(-6).toUpperCase()}
        </Text>

        <View
          style={[
            styles.statusPill,
            { backgroundColor: statusColor(item.status) + '22' },
          ]}
        >
          <Text style={{ color: statusColor(item.status), fontWeight: '800' }}>
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.project}>
        {item.site?.projectName || 'Project'}
      </Text>

      <Text style={styles.contractor}>
        Contractor: {item.contractor?.username || '—'}
      </Text>

      {/* MATERIALS */}
      <View style={styles.materials}>
        {item.materials.map((m, i) => (
          <Text key={i} style={styles.materialText}>
            • {m.name} ({m.quantity} {m.unit})
          </Text>
        ))}
      </View>

      {/* ACTIONS */}
      {item.status === 'PENDING' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#10b981' }]}
            disabled={updatingId === item._id}
            onPress={() => updateStatus(item._id, 'ACCEPTED')}
          >
            {updatingId === item._id ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Accept</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#ef4444' }]}
            disabled={updatingId === item._id}
            onPress={() => updateStatus(item._id, 'REJECTED')}
          >
            {updatingId === item._id ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Reject</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {item.status === 'ACCEPTED' && (
        <TouchableOpacity
          style={styles.deliverBtn}
          onPress={() =>
            router.push({
              pathname: '/(supplier)/deliveries',
              params: { orderId: item._id },
            })
          }
        >
          <Ionicons name="car-outline" size={18} color="#fff" />
          <Text style={styles.deliverText}>Mark Delivered</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Orders Received</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(i) => i._id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No orders found</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 10 },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  orderId: { fontWeight: '800' },

  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  project: { marginTop: 6, color: '#64748b' },
  contractor: { fontSize: 13, marginTop: 4 },

  materials: { marginTop: 10 },
  materialText: { fontSize: 13 },

  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },

  btn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  btnText: { color: '#fff', fontWeight: '800' },

  deliverBtn: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },

  deliverText: { color: '#fff', fontWeight: '800' },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#94a3b8',
  },
});
