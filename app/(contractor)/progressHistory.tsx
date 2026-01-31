import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '@/services/api';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width - 32;

/* ================= TYPES ================= */

type ProgressItem = {
  _id: string;
  percentageCompleted: number;
  stage: string;
  remarks: string;
  createdAt: string;
};

/* ================= COMPONENT ================= */

export default function ProgressHistory() {
  const router = useRouter();
  const { siteId } = useLocalSearchParams<{ siteId: string }>();

  const [history, setHistory] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(API(`/api/contractor/progress/${siteId}`), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert(data.message || 'Failed to load progress history');
        return;
      }

      setHistory(data);
    } catch {
      Alert.alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  /* ================= CHART DATA ================= */

  const labels = [...history]
    .reverse()
    .map((h) =>
      new Date(h.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      })
    );

  const progressValues = [...history]
    .reverse()
    .map((h) => h.percentageCompleted);

  const latest = history[0]?.percentageCompleted || 0;

  const pieData = [
    {
      name: 'Completed',
      population: latest,
      color: '#22c55e',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'Remaining',
      population: 100 - latest,
      color: '#e5e7eb',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
  ];

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Progress History</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* BODY */}
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : history.length === 0 ? (
        <Text style={styles.empty}>No progress updates yet</Text>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          {/* ================= GRAPHS ================= */}
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={styles.graphTitle}>Progress Over Time</Text>
            <LineChart
              data={{
                labels,
                datasets: [{ data: progressValues }],
              }}
              width={screenWidth}
              height={220}
              yAxisSuffix="%"
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />

            <Text style={styles.graphTitle}>Progress Comparison</Text>
            <BarChart
              data={{
                labels,
                datasets: [{ data: progressValues }],
              }}
              width={screenWidth}
              height={220}
              yAxisLabel=""          // ✅ REQUIRED FIX
              yAxisSuffix="%"
              chartConfig={chartConfig}
              style={styles.chart}
            />


            <Text style={styles.graphTitle}>Completion Status</Text>
            <PieChart
              data={pieData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              style={styles.chart}
            />
          </View>

          {/* ================= HISTORY LIST ================= */}
          {history.map((item) => (
            <View key={item._id} style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.percent}>
                  {item.percentageCompleted}%
                </Text>
                <Text style={styles.date}>
                  {new Date(item.createdAt).toDateString()}
                </Text>
              </View>

              <Text style={styles.stage}>
                Stage: {item.stage || 'N/A'}
              </Text>

              {item.remarks ? (
                <Text style={styles.remarks}>{item.remarks}</Text>
              ) : null}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

/* ================= CHART CONFIG ================= */

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
  labelColor: () => '#475569',
  propsForDots: {
    r: '5',
    strokeWidth: '2',
    stroke: '#2563eb',
  },
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },

  title: { fontSize: 18, fontWeight: '800' },

  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#64748b',
  },

  graphTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
    marginTop: 16,
  },

  chart: { borderRadius: 16 },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 14,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  percent: { fontSize: 22, fontWeight: '800', color: '#2563eb' },

  date: { fontSize: 12, color: '#64748b' },

  stage: { marginTop: 6, fontWeight: '600' },

  remarks: { marginTop: 4, color: '#475569' },
});
