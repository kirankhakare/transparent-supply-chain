import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../../services/api';

type Supplier = {
  _id: string;
  username: string;
  email: string;
  isApproved: boolean;
};

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  /* ================= FETCH ================= */

  const fetchSuppliers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(API('/api/admin/suppliers'), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      console.log('Supplier fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATUS UPDATE ================= */

  const toggleStatus = async (supplier: Supplier) => {
    try {
      const token = await AsyncStorage.getItem('token');

      await fetch(
        API(`/api/admin/suppliers/${supplier._id}/status`),
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isApproved: !supplier.isApproved,
          }),
        }
      );

      fetchSuppliers();
    } catch (err) {
      console.log('Status update error', err);
    }
  };

  /* ================= FILTER ================= */

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.username.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= RENDER ================= */

  const renderSupplier = ({ item }: { item: Supplier }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.name}>{item.username}</Text>
          
        </View>

        <TouchableOpacity
          style={[
            styles.statusBadge,
            {
              backgroundColor: item.isApproved
                ? 'rgba(16,185,129,0.15)'
                : 'rgba(239,68,68,0.15)',
            },
          ]}
          onPress={() => toggleStatus(item)}
        >
          <Text
            style={{
              color: item.isApproved ? '#10b981' : '#ef4444',
              fontWeight: '700',
            }}
          >
            {item.isApproved ? 'ACTIVE' : 'INACTIVE'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Suppliers</Text>
      <Text style={styles.subtitle}>
        All registered suppliers
      </Text>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#94a3b8" />
        <TextInput
          placeholder="Search supplier..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : (
        <FlatList
          data={filteredSuppliers}
          keyExtractor={(item) => item._id}
          renderItem={renderSupplier}
          ListEmptyComponent={
            <Text>No suppliers found</Text>
          }
        />
      )}
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
