// app/(contractor)/projects.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '@/services/api';

type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'PENDING';

type Project = {
  _id: string;                // ✅ THIS IS siteId
  user: { username: string };
  completedWork: number;
  totalWork: number;
};

export default function Projects() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | ProjectStatus>('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [activeSiteId, setActiveSiteId] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, string>>({});
  const [stageMap, setStageMap] = useState<Record<string, string>>({});
  const [remarksMap, setRemarksMap] = useState<Record<string, string>>({});

  /* ================= LOAD PROJECTS ================= */

  const loadProjects = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(API('/api/contractor/sites'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProjects(data.sites || []);
    } catch {
      Alert.alert('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* ================= PROGRESS UPDATE ================= */

  const submitProgress = async (siteId: string) => {
    const percent = Number(progressMap[siteId]);

    if (isNaN(percent) || percent < 0 || percent > 100) {
      Alert.alert('Progress must be between 0 and 100');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(API('/api/contractor/progress'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          siteId,
          percentageCompleted: percent,
          stage: stageMap[siteId] || 'N/A',
          remarks: remarksMap[siteId] || '',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert(data.message || 'Progress update failed');
        return;
      }

      Alert.alert('Progress updated successfully');
      setActiveSiteId(null);
      loadProjects();
    } catch {
      Alert.alert('Server error');
    }
  };

  /* ================= HELPERS ================= */

  const getStatus = (p: Project): ProjectStatus => {
    if (p.totalWork > 0 && p.completedWork >= p.totalWork) return 'COMPLETED';
    if (p.completedWork > 0) return 'ACTIVE';
    return 'PENDING';
  };

  const filtered = projects.filter((p) => {
    const status = getStatus(p);
    if (filter !== 'ALL' && status !== filter) return false;
    return p.user.username.toLowerCase().includes(search.toLowerCase());
  });

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadProjects} />
        }
      >
        <Text style={styles.title}>My Projects</Text>

        <TextInput
          placeholder="Search project..."
          value={search}
          onChangeText={setSearch}
          style={styles.search}
        />

        {loading ? (
          <Text style={styles.empty}>Loading...</Text>
        ) : (
          filtered.map((p) => {
            const percent =
              p.totalWork > 0
                ? Math.round((p.completedWork / p.totalWork) * 100)
                : 0;

            return (
              <View key={p._id} style={styles.card}>
                <Text style={styles.project}>
                  {p.user.username}'s Project
                </Text>

                <Text style={styles.percent}>{percent}% completed</Text>

                {/* 🔥 CREATE ORDER BUTTON */}
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: '#10b981' }]}
                  onPress={() =>
                    router.push({
                      pathname: '/(contractor)/createOrder',
                      params: { siteId: p._id }, // ✅ PASS siteId
                    })
                  }
                >
                  <Ionicons name="cart-outline" size={16} color="#fff" />
                  <Text style={styles.btnText}>Create Order</Text>
                </TouchableOpacity>

                {/* UPDATE PROGRESS */}
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: '#2563eb' }]}
                  onPress={() =>
                    setActiveSiteId(activeSiteId === p._id ? null : p._id)
                  }
                >
                  <Ionicons name="analytics-outline" size={16} color="#fff" />
                  <Text style={styles.btnText}>Update Progress</Text>
                </TouchableOpacity>

                {activeSiteId === p._id && (
                  <View style={styles.form}>
                    <TextInput
                      placeholder="Progress %"
                      keyboardType="numeric"
                      value={progressMap[p._id] || ''}
                      onChangeText={(v) =>
                        setProgressMap({ ...progressMap, [p._id]: v })
                      }
                      style={styles.input}
                    />

                    <TextInput
                      placeholder="Stage"
                      value={stageMap[p._id] || ''}
                      onChangeText={(v) =>
                        setStageMap({ ...stageMap, [p._id]: v })
                      }
                      style={styles.input}
                    />

                    <TextInput
                      placeholder="Remarks"
                      value={remarksMap[p._id] || ''}
                      onChangeText={(v) =>
                        setRemarksMap({ ...remarksMap, [p._id]: v })
                      }
                      style={styles.input}
                    />

                    <TouchableOpacity
                      style={[styles.btn, { backgroundColor: '#0f172a' }]}
                      onPress={() => submitProgress(p._id)}
                    >
                      <Text style={styles.btnText}>Submit Progress</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 12 },

  search: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
  },

  project: { fontWeight: '800', fontSize: 16 },
  percent: { marginVertical: 6, color: '#475569' },

  btn: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnText: { color: '#fff', fontWeight: '700' },

  form: {
    marginTop: 10,
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 10,
  },

  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },

  empty: { textAlign: 'center', marginTop: 40 },
});
