import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '@/services/api';

type Order = {
  _id: string;
  orderNumber: string;
  status: string;
  site?: { projectName: string };
  supplier?: { username: string };
  contractor?: { username: string };
  materials: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  delivery?: {
    imageUrl?: string;
    message?: string;
    deliveredAt?: string;
  };
};

type Props = {
  endpoint: string; // 🔥 DIFFERENT FOR EACH ROLE
};

export default function OrderTracking({ endpoint }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(API(endpoint), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadOrders} />
        }
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No orders found</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.orderNo}>{item.orderNumber}</Text>

            <Text style={styles.site}>
              Site: {item.site?.projectName || 'N/A'}
            </Text>

            {item.supplier && (
              <Text style={styles.meta}>
                Supplier: {item.supplier.username}
              </Text>
            )}

            {item.contractor && (
              <Text style={styles.meta}>
                Contractor: {item.contractor.username}
              </Text>
            )}

            <Text
              style={[
                styles.status,
                item.status === 'DELIVERED' && { color: '#16a34a' },
              ]}
            >
              {item.status}
            </Text>

            {/* MATERIALS */}
            <View style={styles.materialBox}>
              {item.materials.map((m, idx) => (
                <Text key={idx} style={styles.material}>
                  • {m.name} – {m.quantity} {m.unit}
                </Text>
              ))}
            </View>

            {/* DELIVERY IMAGE */}
            {item.delivery?.imageUrl && (
              <View style={{ marginTop: 12 }}>
                <Text style={styles.deliveryTitle}>Delivery Proof</Text>
                <Image
                  source={{ uri: item.delivery.imageUrl }}
                  style={styles.image}
                />
                {item.delivery.deliveredAt && (
                  <Text style={styles.date}>
                    Delivered on:{' '}
                    {new Date(item.delivery.deliveredAt).toDateString()}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#94a3b8',
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
  },

  orderNo: { fontSize: 16, fontWeight: '800' },
  site: { marginTop: 4, color: '#475569' },
  meta: { fontSize: 13, color: '#64748b' },

  status: {
    marginTop: 6,
    fontWeight: '800',
    color: '#f59e0b',
  },

  materialBox: { marginTop: 10 },
  material: { fontSize: 14, color: '#334155' },

  deliveryTitle: { fontWeight: '800', marginBottom: 6 },

  image: {
    height: 160,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },

  date: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
});
