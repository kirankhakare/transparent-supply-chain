import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../../../services/api';
import { Ionicons } from '@expo/vector-icons';

/* ================= TYPES ================= */

type Report = {
  user: {
    name: string;
    email: string;
    status: 'active' | 'inactive' | 'pending';
  };
  contractor?: {
    _id: string;
    name: string;
  };
  site: {
    totalWork: number;
    completedWork: number;
    deadline: string;
  };
  cost: {
    estimated: number;
    spent: number;
  };
};

export default function UserDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  /* ================= FETCH ================= */

  const fetchReport = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(API(`/api/admin/users/${id}/report`), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.log('User report error', err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ASSIGN CONTRACTOR ================= */

  const assignContractor = () => {
    Alert.alert(
      'Assign Contractor',
      'Open contractor selection screen?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Assign',
          onPress: () => {
            // 👉 NEXT SCREEN
            Alert.alert(
              'Next Step',
              'Contractor selection screen next'
            );
          },
        },
      ]
    );
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text>No data found</Text>
      </View>
    );
  }

  const progress =
    (data.site.completedWork / data.site.totalWork) * 100;

  return (
    <ScrollView style={styles.container}>
      {/* ================= USER INFO ================= */}
      <View style={styles.card}>
        <Ionicons name="person-circle-outline" size={60} color="#2563eb" />
        <Text style={styles.name}>{data.user.name}</Text>
        <Text style={styles.email}>{data.user.email}</Text>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {data.user.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* ================= CONTRACTOR ================= */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Assigned Contractor</Text>

        {data.contractor ? (
          <Text style={styles.value}>{data.contractor.name}</Text>
        ) : (
          <Text style={styles.muted}>Not assigned</Text>
        )}

        <TouchableOpacity
          style={styles.assignBtn}
          onPress={() =>
  router.push(`/(admin)/(hidden)/assign-contractor?userId=${id}`)
}
        >
          <Ionicons name="construct-outline" size={18} color="#fff" />
          <Text style={styles.assignText}>
            {data.contractor ? 'Change Contractor' : 'Assign Contractor'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= SITE PROGRESS ================= */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Site Progress</Text>

        <Text style={styles.value}>
          {data.site.completedWork} / {data.site.totalWork} Units
        </Text>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%` },
            ]}
          />
        </View>

        <Text style={styles.muted}>
          Deadline: {data.site.deadline}
        </Text>
      </View>

      {/* ================= COST ================= */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Cost Summary</Text>

        <Text style={styles.value}>
          Estimated: ₹{data.cost.estimated.toLocaleString()}
        </Text>
        <Text style={styles.value}>
          Spent: ₹{data.cost.spent.toLocaleString()}
        </Text>
      </View>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },

  name: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 10,
    color: '#0f172a',
  },

  email: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },

  statusBadge: {
    marginTop: 10,
    backgroundColor: '#16a34a',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#0f172a',
  },

  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },

  muted: {
    fontSize: 14,
    color: '#64748b',
  },

  assignBtn: {
    marginTop: 12,
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 6,
  },

  assignText: {
    color: '#fff',
    fontWeight: '700',
  },

  progressBar: {
    height: 8,
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    marginTop: 8,
  },

  progressFill: {
    height: 8,
    backgroundColor: '#16a34a',
    borderRadius: 10,
  },
});
