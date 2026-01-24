import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../../../services/api';
import { PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

interface AnalyticsItem {
  _id: number;
  count: number;
}

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsItem[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] =
    useState<'Weekly' | 'Monthly' | 'Yearly'>('Yearly');

  useEffect(() => {
    fetchAnalytics();
  }, [selectedTimeframe]);

  /* ================= FETCH ANALYTICS ================= */

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const res = await fetch(
        API(`/api/admin/user-analytics?type=${selectedTimeframe.toLowerCase()}`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Failed to fetch analytics');

      const response = await res.json();
      const data: AnalyticsItem[] = response.data || [];

      setAnalyticsData(data);

      const colors = [
        '#3b82f6',
        '#10b981',
        '#f59e0b',
        '#ef4444',
        '#8b5cf6',
        '#14b8a6',
        '#ec4899',
      ];

      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ];

      const weekNames = [
        'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
      ];

      const pie = data.map((item, index) => ({
        name:
          selectedTimeframe === 'Yearly'
            ? monthNames[item._id - 1] || `M${item._id}`
            : selectedTimeframe === 'Weekly'
            ? weekNames[item._id - 1] || `D${item._id}`
            : `Day ${item._id}`,
        population: Number(item.count) || 0,
        color: colors[index % colors.length],
        legendFontColor: '#334155',
        legendFontSize: 13,
      }));

      setPieData(pie);
    } catch (error) {
      console.log('Analytics fetch error', error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATS ================= */

  const totalUsers = analyticsData.reduce(
    (sum, item) => sum + Number(item.count || 0),
    0
  );

  /* ================= UI COMPONENTS ================= */

  const TimeButton = ({ label }: { label: 'Weekly' | 'Monthly' | 'Yearly' }) => (
    <TouchableOpacity
      style={[
        styles.timeBtn,
        selectedTimeframe === label && styles.timeBtnActive,
      ]}
      onPress={() => setSelectedTimeframe(label)}
    >
      <Text
        style={[
          styles.timeText,
          selectedTimeframe === label && styles.timeTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>User Analytics</Text>
          <Text style={styles.subtitle}>Distribution overview</Text>
        </View>

        <TouchableOpacity style={styles.refreshBtn} onPress={fetchAnalytics}>
          <Ionicons name="refresh" size={22} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* ================= TIMEFRAME ================= */}
      <View style={styles.timeContainer}>
        <TimeButton label="Weekly" />
        <TimeButton label="Monthly" />
        <TimeButton label="Yearly" />
      </View>

      {/* ================= STATS ================= */}
      <View style={styles.statCard}>
        <Ionicons name="people-outline" size={26} color="#2563eb" />
        <Text style={styles.statValue}>{totalUsers}</Text>
        <Text style={styles.statLabel}>Total Users</Text>
      </View>

      {/* ================= PIE CHART ================= */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>
          {selectedTimeframe} User Distribution
        </Text>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Loading analytics...</Text>
          </View>
        ) : pieData.length > 0 ? (
          <PieChart
            data={pieData}
            width={screenWidth - 40}
            height={260}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            chartConfig={{
              color: () => '#000',
            }}
          />
        ) : (
          <Text style={styles.noData}>No data available</Text>
        )}
      </View>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8fafc',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
  },

  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },

  refreshBtn: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 50,
    elevation: 2,
  },

  timeContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },

  timeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },

  timeBtnActive: {
    backgroundColor: '#2563eb',
  },

  timeText: {
    fontWeight: '600',
    color: '#64748b',
  },

  timeTextActive: {
    color: '#ffffff',
  },

  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },

  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e293b',
    marginTop: 6,
  },

  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },

  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    elevation: 3,
  },

  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1e293b',
  },

  loader: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  loadingText: {
    marginTop: 10,
    color: '#64748b',
  },

  noData: {
    textAlign: 'center',
    color: '#94a3b8',
    paddingVertical: 40,
  },
});
