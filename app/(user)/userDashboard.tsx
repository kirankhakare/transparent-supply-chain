import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function UserDashboard() {
  // 🔹 Later this will come from API
  const project = {
    status: 'IN_PROGRESS',
    completedWork: 45,
    totalWork: 100,
    deadline: '31 Mar 2025',
    estimatedCost: 500000,
    spentCost: 180000,
  };

  const progress =
    (project.completedWork / project.totalWork) * 100;

  return (
    <ScrollView style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome 👋</Text>
        <Text style={styles.subtitle}>
          Track your project & progress
        </Text>
      </View>

      {/* ================= STATUS CARD ================= */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>Project Status</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {project.status.replace('_', ' ')}
            </Text>
          </View>
        </View>

        <Text style={styles.progressText}>
          {project.completedWork} / {project.totalWork} units completed
        </Text>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%` },
            ]}
          />
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="calendar-outline"
            size={18}
            color="#64748b"
          />
          <Text style={styles.infoText}>
            Deadline: {project.deadline}
          </Text>
        </View>
      </View>

      {/* ================= COST SUMMARY ================= */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cost Summary</Text>

        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Estimated</Text>
          <Text style={styles.costValue}>
            ₹{project.estimatedCost.toLocaleString()}
          </Text>
        </View>

        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Spent</Text>
          <Text style={[styles.costValue, { color: '#dc2626' }]}>
            ₹{project.spentCost.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* ================= INFO CARD ================= */}
      <View style={styles.infoCard}>
        <Ionicons
          name="information-circle-outline"
          size={22}
          color="#2563eb"
        />
        <Text style={styles.infoNote}>
          Your contractor is regularly updating the project
          progress. You will be notified if there is any delay.
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

  header: {
    marginBottom: 20,
  },

  welcome: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
  },

  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statusBadge: {
    backgroundColor: 'rgba(37,99,235,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: 12,
  },

  progressText: {
    marginTop: 8,
    fontSize: 14,
    color: '#334155',
  },

  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    marginTop: 6,
  },

  progressFill: {
    height: 8,
    backgroundColor: '#16a34a',
    borderRadius: 10,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },

  infoText: {
    fontSize: 13,
    color: '#475569',
  },

  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  costLabel: {
    fontSize: 14,
    color: '#64748b',
  },

  costValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#16a34a',
  },

  infoCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoNote: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
  },
});
