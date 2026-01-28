import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '@/services/api';

/* ================= TYPES ================= */

type Status = 'PENDING' | 'ACCEPTED' | 'DISPATCHED' | 'DELIVERED';

type OrderItem = {
  name: string;
  quantity: number;
  unit: string;
};

type OrderDetail = {
  _id: string;
  site?: {
    projectName?: string;
    address?: string;
  };
  supplier?: {
    username: string;
    phone?: string;
    email?: string;
  };
  status: Status;
  createdAt: string;
  materials: OrderItem[];
};

/* ================= HELPERS ================= */

const statusColor = (s: Status) =>
  s === 'DELIVERED'
    ? '#10b981'
    : s === 'DISPATCHED'
    ? '#8b5cf6'
    : s === 'ACCEPTED'
    ? '#3b82f6'
    : '#f59e0b';

/* ================= COMPONENT ================= */

export default function OrderDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  /* ================= LOAD ORDER ================= */

  const loadOrder = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(API(`/api/contractor/orders/${id}`), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Order not found');

      const data = await res.json();
      setOrder(data);
    } catch (err) {
      console.log('Failed to load order', err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadOrder();
  }, [id]);

  /* ================= UPDATE STATUS ================= */

  const updateStatus = async (status: Status) => {
    try {
      setUpdating(true);
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(
        API(`/api/contractor/orders/${id}/status`),
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) throw new Error('Failed');

      Alert.alert('Success', `Order marked as ${status}`);
      loadOrder();
    } catch {
      Alert.alert('Error', 'Status update failed');
    } finally {
      setUpdating(false);
    }
  };

  /* ================= UI STATES ================= */

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Loading order details...</Text>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Order not found</Text>
      </SafeAreaView>
    );
  }

  /* ================= RENDER ================= */

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#0f172a" />
          </TouchableOpacity>

          <View>
            <Text style={styles.orderNo}>
              #{order._id.slice(-6).toUpperCase()}
            </Text>
            <View
              style={[
                styles.statusPill,
                { backgroundColor: statusColor(order.status) + '22' },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: statusColor(order.status) },
                ]}
              >
                {order.status}
              </Text>
            </View>
          </View>
        </View>

        {/* INFO */}
        <View style={styles.card}>
          <Info
            icon="briefcase"
            label="Project"
            value={order.site?.projectName || 'Project'}
          />
          <Info
            icon="calendar"
            label="Order Date"
            value={new Date(order.createdAt).toDateString()}
          />
        </View>

        {/* SUPPLIER */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Supplier</Text>
          <Info icon="business" label="Name" value={order.supplier?.username} />
          {order.supplier?.phone && (
            <Info icon="call" label="Phone" value={order.supplier.phone} />
          )}
          {order.supplier?.email && (
            <Info icon="mail" label="Email" value={order.supplier.email} />
          )}
        </View>

        {/* ITEMS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Items</Text>
          <FlatList
            data={order.materials}
            keyExtractor={(_, i) => i.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemMeta}>
                    {item.quantity} {item.unit}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>

        {/* STATUS ACTIONS */}
        <View style={styles.actions}>
          {order.status === 'PENDING' && (
            <ActionBtn
              text="Accept Order"
              onPress={() => updateStatus('ACCEPTED')}
              loading={updating}
            />
          )}

          {order.status === 'ACCEPTED' && (
            <ActionBtn
              text="Mark as Dispatched"
              onPress={() => updateStatus('DISPATCHED')}
              loading={updating}
            />
          )}

          {order.status === 'DISPATCHED' && (
            <ActionBtn
              text="Mark as Delivered"
              onPress={() => updateStatus('DELIVERED')}
              loading={updating}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= SMALL COMPONENTS ================= */

const Info = ({ icon, label, value }: any) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={18} color="#2563eb" />
    <View style={{ marginLeft: 12 }}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const ActionBtn = ({ text, onPress, loading }: any) => (
  <TouchableOpacity
    style={styles.primaryBtn}
    onPress={onPress}
    disabled={loading}
  >
    <Text style={styles.primaryText}>
      {loading ? 'Updating...' : text}
    </Text>
  </TouchableOpacity>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  loading: {
    marginTop: 100,
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
  },

  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  orderNo: { fontSize: 22, fontWeight: '800' },

  statusPill: {
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: { fontSize: 12, fontWeight: '800' },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },

  infoRow: { flexDirection: 'row', marginBottom: 12 },
  infoLabel: { fontSize: 12, color: '#64748b' },
  infoValue: { fontSize: 15, fontWeight: '600' },

  itemRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  itemName: { fontSize: 15, fontWeight: '600' },
  itemMeta: { fontSize: 13, color: '#64748b' },

  actions: { padding: 20 },

  primaryBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700' },
});
