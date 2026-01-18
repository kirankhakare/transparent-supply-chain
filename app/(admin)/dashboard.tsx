import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 64) / 2;

interface StatCard {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
}

export default function Dashboard() {
  const stats: StatCard[] = [
    {
      title: 'Users',
      value: '120',
      icon: 'people-outline',
      color: '#2563eb',
      bg: '#eff6ff',
    },
    {
      title: 'Contractors',
      value: '18',
      icon: 'construct-outline',
      color: '#7c3aed',
      bg: '#f5f3ff',
    },
    {
      title: 'Suppliers',
      value: '10',
      icon: 'business-outline',
      color: '#059669',
      bg: '#ecfdf5',
    },
    {
      title: 'Active Sessions',
      value: '45',
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
            <Text style={styles.dateText}>Nov 15</Text>
          </View>
        </View>

        {/* STATS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>

          <View style={styles.grid}>
            {stats.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.card,
                  { width: CARD_WIDTH, backgroundColor: item.bg },
                ]}
              >
                <View style={styles.cardTop}>
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: item.color + '20' },
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color={item.color}
                    />
                  </View>
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
                    +12% this month
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.actions}>
            <ActionButton
              icon="person-add-outline"
              label="Create User"
            />
            <ActionButton
              icon="document-text-outline"
              label="Reports"
            />
            <ActionButton
              icon="analytics-outline"
              label="Analytics"
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
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <TouchableOpacity style={styles.actionCard}>
      <Ionicons name={icon} size={26} color="#2563eb" />
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  header: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  welcome: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },

  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },

  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  dateText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },

  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },

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

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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

  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },

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
