import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

/* ================= TYPES ================= */

type Project = {
  projectId: string;
  projectName: string;
  userName: string;
  userEmail: string;
};

type Contractor = {
  id: string;
  name: string;
  company: string;
  status: 'ACTIVE' | 'INACTIVE';
  project: Project | null;
};

/* ================= DUMMY DATA ================= */

const DUMMY_CONTRACTORS: Contractor[] = [
  {
    id: '1',
    name: 'James Wilson',
    company: 'Wilson Construction',
    status: 'ACTIVE',
    project: {
      projectId: 'p1',
      projectName: 'Apartment Construction',
      userName: 'Rohit Patil',
      userEmail: 'rohit@gmail.com',
    },
  },
  {
    id: '2',
    name: 'Sarah Chen',
    company: 'Chen Electrical',
    status: 'ACTIVE',
    project: {
      projectId: 'p2',
      projectName: 'Office Renovation',
      userName: 'Amit Sharma',
      userEmail: 'amit@gmail.com',
    },
  },
  {
    id: '3',
    name: 'Marcus Rodriguez',
    company: 'Rodriguez Plumbing',
    status: 'INACTIVE',
    project: null,
  },
];

export default function Contractors() {
  const [contractors, setContractors] = useState<Contractor[]>(DUMMY_CONTRACTORS);
  const [search, setSearch] = useState('');

  /* ================= TOGGLE STATUS ================= */

  const toggleStatus = (id: string) => {
    setContractors((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
            }
          : c
      )
    );
  };

  /* ================= FILTER ================= */

  const filtered = contractors.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= RENDER ================= */

  const renderItem = ({ item }: { item: Contractor }) => (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.company}>{item.company}</Text>
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

      {/* PROJECT + USER */}
      {item.project ? (
        <View style={styles.projectBox}>
          <View style={styles.projectRow}>
            <Ionicons name="briefcase-outline" size={16} color="#2563eb" />
            <Text style={styles.projectTitle}>
              {item.project.projectName}
            </Text>
          </View>

          <View style={styles.projectRow}>
            <Ionicons name="person-outline" size={16} color="#475569" />
            <Text style={styles.projectText}>
              Client: {item.project.userName}
            </Text>
          </View>

          <View style={styles.projectRow}>
            <Ionicons name="mail-outline" size={16} color="#475569" />
            <Text style={styles.projectText}>
              {item.project.userEmail}
            </Text>
          </View>
        </View>
      ) : (
        <Text style={styles.noProject}>No project assigned</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.pageHeader}>
        <Text style={styles.title}>Contractors</Text>
        <Text style={styles.subtitle}>
          Contractors with assigned projects & users
        </Text>
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#6b7280" />
        <TextInput
          placeholder="Search contractor..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>No contractors found</Text>
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

  pageHeader: {
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
    fontSize: 15,
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 18,
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
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },

  company: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
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

  projectBox: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },

  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  projectTitle: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '700',
    color: '#1d4ed8',
  },

  projectText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#334155',
  },

  noProject: {
    marginTop: 10,
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
  },

  empty: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 40,
  },
});
