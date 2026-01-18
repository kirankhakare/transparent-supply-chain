import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

/* ================= DUMMY SUPPLIERS ================= */

type Supplier = {
  id: string;
  name: string;
  category: string;
  contact: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
};

const DUMMY_SUPPLIERS: Supplier[] = [
  {
    id: '1',
    name: 'BuildMaster Supplies',
    category: 'Construction',
    contact: 'Rohit Patil',
    email: 'rohit@buildmaster.com',
    phone: '9876543210',
    status: 'ACTIVE',
  },
  {
    id: '2',
    name: 'SteelCore Pvt Ltd',
    category: 'Raw Material',
    contact: 'Amit Sharma',
    email: 'amit@steelcore.com',
    phone: '9123456789',
    status: 'INACTIVE',
  },
  {
    id: '3',
    name: 'CementPlus',
    category: 'Construction',
    contact: 'Neha Joshi',
    email: 'neha@cementplus.com',
    phone: '9012345678',
    status: 'ACTIVE',
  },
];

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState(DUMMY_SUPPLIERS);
  const [search, setSearch] = useState('');

  /* ================= TOGGLE STATUS ================= */

  const toggleStatus = (id: string) => {
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
            }
          : s
      )
    );
  };

  /* ================= FILTER ================= */

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contact.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= RENDER ================= */

  const renderSupplier = ({ item }: { item: Supplier }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === 'ACTIVE'
                  ? 'rgba(16,185,129,0.15)'
                  : 'rgba(239,68,68,0.15)',
            },
          ]}
          onPress={() => toggleStatus(item.id)}
        >
          <Text
            style={[
              styles.statusText,
              { color: item.status === 'ACTIVE' ? '#10b981' : '#ef4444' },
            ]}
          >
            {item.status}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="person-outline" size={16} color="#64748b" />
        <Text style={styles.infoText}>{item.contact}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="mail-outline" size={16} color="#64748b" />
        <Text style={styles.infoText}>{item.email}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="call-outline" size={16} color="#64748b" />
        <Text style={styles.infoText}>{item.phone}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* HEADER */}
      <View style={styles.pageHeader}>
        <Text style={styles.title}>Suppliers</Text>
        <Text style={styles.subtitle}>All registered suppliers</Text>
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#94a3b8" />
        <TextInput
          placeholder="Search supplier..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* LIST */}
      <FlatList
        data={filteredSuppliers}
        keyExtractor={(item) => item.id}
        renderItem={renderSupplier}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40 }}>
            No suppliers found
          </Text>
        }
      />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },

  pageHeader: {
    marginBottom: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },

  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },

  category: {
    fontSize: 13,
    color: '#64748b',
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#475569',
  },
});
