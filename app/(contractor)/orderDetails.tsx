import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

/* ================= TYPES ================= */

type Status = 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled';
type PaymentStatus = 'pending' | 'partial' | 'paid';

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  specifications?: string;
};

type OrderDetail = {
  orderNumber: string;
  projectName: string;
  supplier: string;
  phone: string;
  email: string;
  status: Status;
  paymentStatus: PaymentStatus;
  orderDate: string;
  deliveryDate: string;
  address: string;
  items: OrderItem[];
  subTotal: number;
  tax: number;
  shipping: number;
  total: number;
  notes?: string;
};

/* ================= DUMMY DATA ================= */

const ORDER: OrderDetail = {
  orderNumber: 'ORD-2024-001',
  projectName: 'Modern Residence Construction',
  supplier: 'BuildMart Supplies',
  phone: '+1 555 123 456',
  email: 'support@buildmart.com',
  status: 'delivered',
  paymentStatus: 'paid',
  orderDate: '20 Jan 2024',
  deliveryDate: '24 Jan 2024',
  address: '123 Main Street, New York',
  items: [
    {
      id: '1',
      name: 'Cement (50kg)',
      quantity: 100,
      unit: 'bags',
      unitPrice: 8.5,
      total: 850,
    },
    {
      id: '2',
      name: 'Steel Bars (12mm)',
      quantity: 50,
      unit: 'tons',
      unitPrice: 150,
      total: 7500,
      specifications: 'TMT 500D',
    },
  ],
  subTotal: 8350,
  tax: 420,
  shipping: 380,
  total: 9150,
  notes: 'Deliver before 2 PM. Inform site supervisor.',
};

/* ================= HELPERS ================= */

const statusColor = (s: Status) =>
  s === 'delivered'
    ? '#10b981'
    : s === 'shipped'
    ? '#8b5cf6'
    : s === 'approved'
    ? '#3b82f6'
    : s === 'pending'
    ? '#f59e0b'
    : '#ef4444';

const payColor = (s: PaymentStatus) =>
  s === 'paid' ? '#10b981' : s === 'partial' ? '#f59e0b' : '#ef4444';

/* ================= COMPONENT ================= */

export default function OrderDetails() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#0f172a" />
          </TouchableOpacity>

          <View>
            <Text style={styles.orderNo}>{ORDER.orderNumber}</Text>
            <View style={[styles.statusPill, { backgroundColor: statusColor(ORDER.status) + '22' }]}>
              <Text style={[styles.statusText, { color: statusColor(ORDER.status) }]}>
                {ORDER.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* INFO */}
        <View style={styles.card}>
          <Info icon="briefcase" label="Project" value={ORDER.projectName} />
          <Info icon="location" label="Delivery Address" value={ORDER.address} />
          <Info icon="calendar" label="Order Date" value={ORDER.orderDate} />
          <Info icon="checkmark-circle" label="Delivered On" value={ORDER.deliveryDate} />
        </View>

        {/* SUPPLIER */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Supplier</Text>
          <Info icon="business" label="Name" value={ORDER.supplier} />
          <Info icon="call" label="Phone" value={ORDER.phone} />
          <Info icon="mail" label="Email" value={ORDER.email} />
        </View>

        {/* ITEMS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Items</Text>
          <FlatList
            data={ORDER.items}
            keyExtractor={(i) => i.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemMeta}>
                    {item.quantity} {item.unit} × ${item.unitPrice}
                  </Text>
                  {item.specifications && (
                    <Text style={styles.itemSpec}>{item.specifications}</Text>
                  )}
                </View>
                <Text style={styles.itemAmount}>${item.total}</Text>
              </View>
            )}
          />
        </View>

        {/* PAYMENT */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Summary</Text>

          <Row label="Subtotal" value={`$${ORDER.subTotal}`} />
          <Row label="Tax" value={`$${ORDER.tax}`} />
          <Row label="Shipping" value={`$${ORDER.shipping}`} />

          <View style={styles.divider} />

          <Row label="Total" value={`$${ORDER.total}`} bold />

          <View style={[styles.payStatus, { backgroundColor: payColor(ORDER.paymentStatus) + '22' }]}>
            <Text style={[styles.payText, { color: payColor(ORDER.paymentStatus) }]}>
              PAYMENT {ORDER.paymentStatus.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* NOTES */}
        {ORDER.notes && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notes</Text>
            <Text style={styles.notes}>{ORDER.notes}</Text>
          </View>
        )}

        {/* ACTIONS */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Ionicons name="download-outline" size={18} color="#2563eb" />
            <Text style={styles.secondaryText}>Invoice</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryBtn}>
            <Ionicons name="chatbubble-outline" size={18} color="#fff" />
            <Text style={styles.primaryText}>Contact Supplier</Text>
          </TouchableOpacity>
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

const Row = ({ label, value, bold }: any) => (
  <View style={styles.row}>
    <Text style={[styles.rowLabel, bold && styles.bold]}>{label}</Text>
    <Text style={[styles.rowValue, bold && styles.bold]}>{value}</Text>
  </View>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

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
  orderNo: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  statusPill: { marginTop: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
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

  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoLabel: { fontSize: 12, color: '#64748b' },
  infoValue: { fontSize: 15, fontWeight: '600', color: '#0f172a' },

  itemRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  itemName: { fontSize: 15, fontWeight: '600' },
  itemMeta: { fontSize: 13, color: '#64748b' },
  itemSpec: { fontSize: 12, color: '#475569' },
  itemAmount: { fontSize: 16, fontWeight: '800' },

  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  rowLabel: { color: '#64748b' },
  rowValue: { fontWeight: '600' },
  bold: { fontWeight: '800', fontSize: 16 },

  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 12 },

  payStatus: { padding: 12, borderRadius: 14, marginTop: 10 },
  payText: { textAlign: 'center', fontWeight: '700' },

  notes: { color: '#475569', lineHeight: 22 },

  actions: { flexDirection: 'row', padding: 20, gap: 12 },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryText: { color: '#2563eb', fontWeight: '700' },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  primaryText: { color: '#fff', fontWeight: '700' },
});
