import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

/* ================= TYPES ================= */

type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'PENDING';

type Project = {
  id: string;
  name: string;
  clientName: string;
  clientEmail: string;
  location: string;
  status: ProjectStatus;
  progress: number;
  endDate: string;
  budget: string;
  completedTasks: number;
  totalTasks: number;
};

/* ================= DUMMY ASSIGNED PROJECTS ================= */

const PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Apartment Construction',
    clientName: 'Rohit Patil',
    clientEmail: 'rohit@gmail.com',
    location: 'Pune, Maharashtra',
    status: 'ACTIVE',
    progress: 65,
    endDate: '30 Jun 2024',
    budget: '₹25,00,000',
    completedTasks: 13,
    totalTasks: 20,
  },
  {
    id: 'p2',
    name: 'Office Renovation',
    clientName: 'Amit Sharma',
    clientEmail: 'amit@gmail.com',
    location: 'Mumbai',
    status: 'ACTIVE',
    progress: 40,
    endDate: '15 Aug 2024',
    budget: '₹18,00,000',
    completedTasks: 8,
    totalTasks: 20,
  },
  {
    id: 'p3',
    name: 'Villa Interior',
    clientName: 'Neha Joshi',
    clientEmail: 'neha@gmail.com',
    location: 'Nagpur',
    status: 'PENDING',
    progress: 10,
    endDate: '31 Oct 2024',
    budget: '₹12,00,000',
    completedTasks: 2,
    totalTasks: 18,
  },
];

export default function Projects() {
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'ALL' | ProjectStatus>('ALL');
  const router = useRouter();

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setRefreshing(false);
  };

  const filteredProjects = PROJECTS.filter((p) => {
    if (filter !== 'ALL' && p.status !== filter) return false;
    if (!search) return true;

    return (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
    );
  });

  const statusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'ACTIVE':
        return '#10b981';
      case 'COMPLETED':
        return '#3b82f6';
      case 'PENDING':
        return '#f59e0b';
    }
  };

  const goToOrders = (projectId: string) => {
    router.push(`/(contractor)/orders?projectId=${projectId}`);
  };

  const renderCard = (p: Project) => (
    <TouchableOpacity
      key={p.id}
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => goToOrders(p.id)}
    >
      {/* HEADER */}
      <View style={styles.cardHeader}>
        <View style={styles.projectTitleBox}>
          <Ionicons name="briefcase-outline" size={22} color="#2563eb" />
          <Text style={styles.projectName}>{p.name}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColor(p.status) + '22' },
          ]}
        >
          <Text style={[styles.statusText, { color: statusColor(p.status) }]}>
            {p.status}
          </Text>
        </View>
      </View>

      {/* CLIENT */}
      <View style={styles.infoRow}>
        <Ionicons name="person-outline" size={16} color="#475569" />
        <Text style={styles.infoText}>{p.clientName}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="mail-outline" size={16} color="#475569" />
        <Text style={styles.infoText}>{p.clientEmail}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={16} color="#475569" />
        <Text style={styles.infoText}>{p.location}</Text>
      </View>

      {/* PROGRESS */}
      <View style={styles.progressBox}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressValue}>{p.progress}%</Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${p.progress}%`, backgroundColor: statusColor(p.status) },
            ]}
          />
        </View>

        <Text style={styles.taskText}>
          {p.completedTasks} / {p.totalTasks} tasks completed
        </Text>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.budget}>{p.budget}</Text>

        <TouchableOpacity style={styles.orderBtn}>
          <Text style={styles.orderBtnText}>View Orders</Text>
          <Ionicons name="arrow-forward-outline" size={16} color="#2563eb" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563eb']}
          />
        }
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>My Projects</Text>
          <Text style={styles.subtitle}>
            Assigned projects with client details
          </Text>
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#94a3b8" />
          <TextInput
            placeholder="Search project..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* FILTER */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {['ALL', 'ACTIVE', 'COMPLETED', 'PENDING'].map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterChip,
                filter === f && styles.filterChipActive,
              ]}
              onPress={() => setFilter(f as any)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* LIST */}
        <View style={{ paddingBottom: 30 }}>
          {filteredProjects.length > 0 ? (
            filteredProjects.map(renderCard)
          ) : (
            <Text style={styles.empty}>No projects found</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  header: { padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a' },
  subtitle: { color: '#64748b', marginTop: 4 },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 46,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15 },

  filterRow: { paddingHorizontal: 20, marginBottom: 16 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterText: { color: '#64748b', fontWeight: '600' },
  filterTextActive: { color: '#fff' },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  projectTitleBox: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  projectName: { fontSize: 16, fontWeight: '700', color: '#0f172a' },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: { fontSize: 12, fontWeight: '700' },

  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  infoText: { marginLeft: 8, fontSize: 13, color: '#475569' },

  progressBox: { marginTop: 14 },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: { fontSize: 13, color: '#475569' },
  progressValue: { fontWeight: '700' },

  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: { height: '100%' },
  taskText: { fontSize: 12, color: '#64748b', marginTop: 4 },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  budget: { fontSize: 17, fontWeight: '800', color: '#0f172a' },

  orderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(37,99,235,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.25)',
  },
  orderBtnText: { color: '#2563eb', fontWeight: '700' },

  empty: {
    textAlign: 'center',
    color: '#94a3b8',
    marginTop: 40,
  },
});
