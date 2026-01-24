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

/* ================= TYPES ================= */

type AssignedUser = {
  userId: string;
  userName: string;
  userStatus: 'ACTIVE' | 'INACTIVE';
  projectStatus:
    | 'NOT_STARTED'
    | 'IN_PROGRESS'
    | 'DELAYED'
    | 'COMPLETED';
  progress: number;
  deadline: string;
};

type Contractor = {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  users: AssignedUser[];
};

/* ================= SCREEN ================= */

export default function Contractors() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(API('/api/admin/contractors-with-users'), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      setContractors(Array.isArray(json) ? json : []);
    } catch (err) {
      console.log('Contractor fetch error', err);
      setContractors([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= HELPERS ================= */

  const projectStatusColor = (status: AssignedUser['projectStatus']) => {
    switch (status) {
      case 'COMPLETED':
        return '#16a34a';
      case 'IN_PROGRESS':
        return '#2563eb';
      case 'DELAYED':
        return '#dc2626';
      default:
        return '#64748b';
    }
  };

  const filtered = contractors.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= RENDER ================= */

  const renderItem = ({ item }: { item: Contractor }) => (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Text style={styles.name}>{item.name}</Text>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === 'ACTIVE'
                  ? 'rgba(16,185,129,0.15)'
                  : 'rgba(239,68,68,0.15)',
            },
          ]}
        >
          <Text
            style={{
              color: item.status === 'ACTIVE' ? '#10b981' : '#ef4444',
              fontWeight: '700',
            }}
          >
            {item.status}
          </Text>
        </View>
      </View>

      {/* ASSIGNED USERS */}
      {item.users && item.users.length > 0 ? (
        item.users.map((u) => (
          <View key={u.userId} style={styles.siteBox}>
            <View style={styles.row}>
              <Ionicons name="person-outline" size={16} color="#2563eb" />
              <Text style={styles.siteText}>
                User: {u.userName}
              </Text>
            </View>

            <View style={styles.row}>
              <Ionicons
                name="stats-chart-outline"
                size={16}
                color={projectStatusColor(u.projectStatus)}
              />
              <Text
                style={[
                  styles.siteText,
                  {
                    color: projectStatusColor(u.projectStatus),
                    fontWeight: '700',
                  },
                ]}
              >
                {u.projectStatus.replace('_', ' ')}
              </Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="build-outline" size={16} color="#475569" />
              <Text style={styles.siteText}>
                Progress: {u.progress}%
              </Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="calendar-outline" size={16} color="#475569" />
              <Text style={styles.siteText}>
                Deadline: {u.deadline}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noProject}>
          No user / site assigned
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Contractors</Text>
      <Text style={styles.subtitle}>
        Assigned users & project progress
      </Text>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#6b7280" />
        <TextInput
          placeholder="Search contractor..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.empty}>No contractors found</Text>
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
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  siteBox: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  siteText: {
    fontSize: 13,
    color: '#334155',
  },
  noProject: {
    marginTop: 8,
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#64748b',
  },
});
