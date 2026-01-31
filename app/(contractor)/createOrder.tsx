import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '@/services/api';

/* ================= TYPES ================= */

type Supplier = {
  _id: string;
  username: string;
};

type Material = {
  name: string;
  quantity: string;
  unit: string;
};

/* ================= COMPONENT ================= */

export default function CreateOrder() {
  const { siteId } = useLocalSearchParams<{ siteId: string }>();
  const router = useRouter();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierId, setSupplierId] = useState('');

  const [materials, setMaterials] = useState<Material[]>([
    { name: '', quantity: '', unit: '' },
  ]);

  const [loading, setLoading] = useState(false);

  /* ================= LOAD SUPPLIERS ================= */

 useEffect(() => {
  const loadSuppliers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(API('/api/contractor/suppliers'), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Failed');
      }

      const data = await res.json();

      // 🔥 SAFETY CHECK
      if (Array.isArray(data)) {
        setSuppliers(data);
      } else if (Array.isArray(data.suppliers)) {
        setSuppliers(data.suppliers);
      } else {
        setSuppliers([]);
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Failed to load suppliers');
      setSuppliers([]);
    }
  };

  loadSuppliers();
}, []);


  /* ================= MATERIAL HANDLERS ================= */

  const updateMaterial = (
    index: number,
    key: keyof Material,
    value: string
  ) => {
    const updated = [...materials];
    updated[index][key] = value;
    setMaterials(updated);
  };

  const addMaterial = () => {
    setMaterials([...materials, { name: '', quantity: '', unit: '' }]);
  };

  /* ================= SUBMIT ================= */

  const submitOrder = async () => {
  if (!siteId) {
    Alert.alert('Invalid site');
    return;
  }

  if (!supplierId) {
    Alert.alert('Please select supplier');
    return;
  }

  for (let m of materials) {
    if (!m.name || !m.unit || !m.quantity) {
      Alert.alert('Please fill all material fields');
      return;
    }

    if (isNaN(Number(m.quantity)) || Number(m.quantity) <= 0) {
      Alert.alert('Quantity must be a valid number');
      return;
    }
  }

  setLoading(true);

  try {
    const token = await AsyncStorage.getItem('token');

    const res = await fetch(API('/api/contractor/orders'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        siteId,
        supplierId,
        materials: materials.map((m) => ({
          name: m.name.trim(),
          quantity: Number(m.quantity),
          unit: m.unit.trim(),
        })),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      Alert.alert(data.message || 'Order failed');
      return;
    }

    Alert.alert(
      'Success',
      'Material order placed successfully',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  } catch {
    Alert.alert('Order failed');
  } finally {
    setLoading(false);
  }
};



  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Create Material Order</Text>

        {/* SUPPLIER */}
        <Text style={styles.label}>Select Supplier</Text>
        {suppliers.length === 0 ? (
  <Text style={{ color: '#64748b' }}>No suppliers found</Text>
) : (
  suppliers.map((s) => (
    <TouchableOpacity
      key={s._id}
      style={[
        styles.supplierItem,
        supplierId === s._id && styles.supplierActive,
      ]}
      onPress={() => setSupplierId(s._id)}
    >
      <Text style={styles.supplierText}>{s.username}</Text>
    </TouchableOpacity>
  ))
)}


        {/* MATERIALS */}
        <Text style={styles.label}>Materials</Text>

        {materials.map((m, i) => (
          <View key={i} style={styles.materialCard}>
            <TextInput
              placeholder="Material name"
              value={m.name}
              onChangeText={(v) => updateMaterial(i, 'name', v)}
              style={styles.input}
            />
            <TextInput
              placeholder="Quantity"
              keyboardType="numeric"
              value={m.quantity}
              onChangeText={(v) => updateMaterial(i, 'quantity', v)}
              style={styles.input}
            />
            <TextInput
              placeholder="Unit (kg, bag)"
              value={m.unit}
              onChangeText={(v) => updateMaterial(i, 'unit', v)}
              style={styles.input}
            />
          </View>
        ))}

        <TouchableOpacity onPress={addMaterial}>
          <Text style={styles.addMore}>+ Add More Material</Text>
        </TouchableOpacity>

        {/* SUBMIT */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={submitOrder}
          disabled={loading}
        >
          <Text style={styles.submitText}>
            {loading ? 'Placing...' : 'Place Order'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 16 },

  label: { fontWeight: '700', marginTop: 14, marginBottom: 6 },

  supplierItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 6,
  },

  supplierActive: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },

  supplierText: { fontWeight: '700' },

  materialCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  input: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },

  addMore: {
    color: '#2563eb',
    fontWeight: '700',
    marginVertical: 10,
  },

  submitBtn: {
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },

  submitText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
