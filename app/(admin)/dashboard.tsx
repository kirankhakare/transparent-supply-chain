import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { API } from '../../services/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 64) / 2;

interface StatCard {
  title: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    users: 0,
    contractors: 0,
    suppliers: 0,
    activeSessions: 0,
  });

  /* 🔹 Fetch dashboard stats */
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(API('/api/admin/dashboard-stats'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setStats(data);
      }
    } catch (err) {
      console.log('Dashboard fetch error');
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 Current date + time (12 hr) */
  const currentDateTime = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const statCards: StatCard[] = [
    {
      title: 'Users',
      value: stats.users,
      icon: 'people-outline',
      color: '#2563eb',
      bg: '#eff6ff',
    },
    {
      title: 'Contractors',
      value: stats.contractors,
      icon: 'construct-outline',
      color: '#7c3aed',
      bg: '#f5f3ff',
    },
    {
      title: 'Suppliers',
      value: stats.suppliers,
      icon: 'business-outline',
      color: '#059669',
      bg: '#ecfdf5',
    },
    {
      title: 'Active Sessions',
      value: stats.activeSessions,
      icon: 'desktop-outline',
      color: '#d97706',
      bg: '#fffbeb',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Welcome, Admin 👋</Text>
            <Text style={styles.subtitle}>
              Monitor system activity & users
            </Text>
          </View>

          <View style={styles.dateChip}>
            <Ionicons name="calendar-outline" size={18} color="#64748b" />
            <Text style={styles.dateText}>{currentDateTime}</Text>
          </View>
        </View>

        {/* OVERVIEW */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#2563eb" />
          ) : (
            <View style={styles.grid}>
              {statCards.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.card,
                    { width: CARD_WIDTH, backgroundColor: item.bg },
                  ]}
                >
                  <View style={styles.iconBox}>
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color={item.color}
                    />
                  </View>

                  <Text style={styles.cardValue}>{item.value}</Text>
                  <Text style={styles.cardTitle}>{item.title}</Text>

                  <View style={styles.trend}>
                    <Ionicons
                      name="trending-up"
                      size={14}
                      color={item.color}
                    />
                    <Text style={[styles.trendText, { color: item.color }]}>
                      Live
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.actions}>
            <ActionButton
              icon="person-add-outline"
              label="Create User"
              onPress={() => router.push('/(admin)/createUser')}
            />
            <ActionButton
              icon="document-text-outline"
              label="Reports"
            />
            <ActionButton
              icon="analytics-outline"
              label="Analytics"
              onPress={() => router.push('/(admin)/(hidden)/analytics')}
            />
            <ActionButton
              icon="settings-outline"
              label="Settings"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- COMPONENT ---------------- */

function ActionButton({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <Ionicons name={icon} size={26} color="#2563eb" />
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  header: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  welcome: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },

  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  dateText: { fontSize: 13, color: '#64748b', fontWeight: '600' },

  section: { paddingHorizontal: 24, paddingTop: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 12,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 4,
  },

  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },

  trendText: { fontSize: 12, fontWeight: '600' },

  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  actionCard: {
    width: (width - 72) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  actionText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
});
