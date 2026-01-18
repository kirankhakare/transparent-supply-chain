import { useState } from 'react';
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

/* ================= TYPES ================= */

type User = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'CONTRACTOR' | 'SUPPLIER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
};

/* ================= DUMMY USERS ================= */

const DUMMY_USERS: User[] = [
  {
    id: '1',
    name: 'Rohit Patil',
    email: 'rohit@gmail.com',
    role: 'USER',
    status: 'ACTIVE',
  },
  {
    id: '2',
    name: 'James Wilson',
    email: 'james@contractor.com',
    role: 'CONTRACTOR',
    status: 'ACTIVE',
  },
  {
    id: '3',
    name: 'BuildMaster Pvt Ltd',
    email: 'supplier@buildmaster.com',
    role: 'SUPPLIER',
    status: 'INACTIVE',
  },
];

export default function Users() {
  const [users, setUsers] = useState<User[]>(DUMMY_USERS);
  const [search, setSearch] = useState('');

  /* ================= STATUS CHANGE ================= */

  const changeStatus = (user: User) => {
    Alert.alert(
      'Change Status',
      `Change status for ${user.name}`,
      [
        {
          text: 'ACTIVE',
          onPress: () => updateStatus(user.id, 'ACTIVE'),
        },
        {
          text: 'INACTIVE',
          onPress: () => updateStatus(user.id, 'INACTIVE'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const updateStatus = (id: string, status: User['status']) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status } : u
      )
    );
  };

  /* ================= FILTER ================= */

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= HELPERS ================= */

  const statusColor = (status: User['status']) => {
    switch (status) {
      case 'ACTIVE':
        return '#16a34a';
      case 'PENDING':
        return '#f59e0b';
      default:
        return '#dc2626';
    }
  };

  const roleColor = (role: User['role']) => {
    switch (role) {
      case 'ADMIN':
        return '#7c3aed';
      case 'CONTRACTOR':
        return '#2563eb';
      case 'SUPPLIER':
        return '#059669';
      default:
        return '#475569';
    }
  };

  /* ================= RENDER ================= */

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>

        <View style={styles.row}>
          <Text style={[styles.role, { color: roleColor(item.role) }]}>
            {item.role}
          </Text>

          <TouchableOpacity
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor(item.status) },
            ]}
            onPress={() => changeStatus(item)}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => changeStatus(item)}>
        <Ionicons
          name="ellipsis-vertical"
          size={20}
          color="#64748b"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Users</Text>
        <Text style={styles.subtitle}>
          All system users (Admin / Contractor / Supplier / User)
        </Text>
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#64748b" />
        <TextInput
          placeholder="Search user..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* LIST */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
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
