import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '@/services/api';

/* ================= TYPES ================= */

type Material = {
  name: string;
  quantity: number;
  unit: string;
};

type Order = {
  _id: string;
  orderNumber: string;
  status: 'PENDING' | 'ACCEPTED' | 'DISPATCHED' | 'DELIVERED';
  site: {
    projectName: string;
  };
  contractor: {
    username: string;
  };
  materials: Material[];
  delivery?: {
    imageUrl?: string;
  };
};

/* ================= COMPONENT ================= */

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  /* ================= LOAD ORDERS ================= */

  const loadOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(API('/api/supplier/orders'), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      Alert.alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  /* ================= CAMERA + DELIVER ================= */

  const deliverOrder = async (orderId: string) => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera permission required');
      return;
    }

    const photo = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.7,
    });

    if (photo.canceled) return;

    setUploadingId(orderId);

    try {
      const token = await AsyncStorage.getItem('token');

      /* 1️⃣ Upload image to ImageKit */
      const uploadRes = await fetch(API('/api/upload/image'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          image: photo.assets[0].base64,
        }),
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error('Image upload failed');
      }

      /* 2️⃣ Mark order delivered */
      const deliverRes = await fetch(
        API(`/api/supplier/orders/${orderId}/deliver`),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            imageUrl: uploadData.url,
            message: 'Delivered successfully',
          }),
        }
      );

      if (!deliverRes.ok) {
        throw new Error('Delivery update failed');
      }

      Alert.alert('Order Delivered');
      loadOrders();
    } catch (err) {
      Alert.alert('Delivery failed');
    } finally {
      setUploadingId(null);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.orderNo}>{item.orderNumber}</Text>

          <Text style={styles.site}>
            Site: {item.site?.projectName}
          </Text>

          <Text style={styles.contractor}>
            Contractor: {item.contractor?.username}
          </Text>

          {/* MATERIALS */}
          <View style={styles.materialBox}>
            {item.materials.map(
              (
                m: { name: string; quantity: number; unit: string },
                idx: number
              ) => (
                <View key={idx} style={styles.materialRow}>
                  <Text style={styles.materialName}>{m.name}</Text>
                  <Text style={styles.materialQty}>
                    {m.quantity} {m.unit}
                  </Text>
                </View>
              )
            )}
          </View>

          <Text
            style={[
              styles.status,
              item.status === 'DELIVERED' && { color: '#16a34a' },
            ]}
          >
            Status: {item.status}
          </Text>

          {/* DELIVERY IMAGE */}
          {item.delivery?.imageUrl && (
            <Image
              source={{ uri: item.delivery.imageUrl }}
              style={styles.image}
            />
          )}

          {/* ACTION */}
          {item.status !== 'DELIVERED' && (
            <TouchableOpacity
              style={styles.btn}
              onPress={() => deliverOrder(item._id)}
            >
              {uploadingId === item._id ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>
                  Capture & Deliver
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
  },

  orderNo: { fontSize: 16, fontWeight: '800' },
  site: { marginTop: 4, color: '#475569' },
  contractor: { marginTop: 2, color: '#64748b' },

  materialBox: {
    marginTop: 10,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 10,
  },

  materialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  materialName: { fontWeight: '700' },
  materialQty: { color: '#475569' },

  status: { marginTop: 10, fontWeight: '800' },

  image: {
    height: 160,
    borderRadius: 12,
    marginTop: 10,
  },

  btn: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    alignItems: 'center',
  },

  btnText: { color: '#fff', fontWeight: '800' },
});
