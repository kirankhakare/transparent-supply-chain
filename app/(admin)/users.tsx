import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../../services/api';
import { useRouter } from 'expo-router';

/* ================= TYPES ================= */

type User = {
  _id: string;
  username: string;
  role: 'admin' | 'contractor' | 'supplier' | 'user';
  isApproved: boolean;
};

/* ================= SCREEN ================= */

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= API ================= */

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(API('/api/admin/users'), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.log('Fetch users error', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (user: User, isApproved: boolean) => {
    try {
      const token = await AsyncStorage.getItem('token');

      await fetch(API(`/api/admin/users/${user._id}/status`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isApproved }),
      });

      fetchUsers();
    } catch (err) {
      console.log('Status update error', err);
    }
  };

  const changeStatus = (user: User) => {
    Alert.alert(
      'Change Status',
      `Update status for ${user.username}`,
      [
        {
          text: 'ACTIVE',
          onPress: () => updateStatus(user, true),
        },
        {
          text: 'INACTIVE',
          onPress: () => updateStatus(user, false),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  /* ================= FILTER ================= */

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= HELPERS ================= */

  const statusColor = (approved: boolean) =>
    approved ? '#16a34a' : '#dc2626';

  const roleColor = (role: User['role']) =>
    role === 'admin'
      ? '#7c3aed'
      : role === 'contractor'
      ? '#2563eb'
      : role === 'supplier'
      ? '#059669'
      : '#475569';

  /* ================= RENDER ================= */

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push(`/(admin)/(hidden)/user-details?id=${item._id}`)
      }
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.username}</Text>

        <View style={styles.row}>
          <Text style={[styles.role, { color: roleColor(item.role) }]}>
            {item.role.toUpperCase()}
          </Text>

          <TouchableOpacity
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor(item.isApproved) },
            ]}
            onPress={() => changeStatus(item)}
          >
            <Text style={styles.statusText}>
              {item.isApproved ? 'ACTIVE' : 'INACTIVE'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Users</Text>
        <Text style={styles.subtitle}>Manage all system users</Text>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#64748b" />
        <TextInput
          placeholder="Search user..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={fetchUsers}
        ListEmptyComponent={
          <Text style={styles.empty}>No users found</Text>
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
    padding: 16,
  },

  header: {
    marginBottom: 16,
  },

  title: {
    fontSize: 26,
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
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    height: 48,
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
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },

  email: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 10,
  },

  role: {
    fontSize: 13,
    fontWeight: '700',
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  statusText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '700',
  },

  empty: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 40,
  },
});
