import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

// Type definitions
interface CardData {
  title: string;
  count: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
  borderColor: string;
  iconColor: string;
}

interface ActivityData {
  id: number;
  user: string;
  action: string;
  time: string;
}

interface ActionButton {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  bgColor: string;
}

export default function Dashboard(): React.JSX.Element {
  const { width } = Dimensions.get('window');
  const cardWidth: number = (width - 60) / 2; // For 2-column grid

  const cards: CardData[] = [
    {
      title: 'Total Users',
      count: '120',
      icon: 'people',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      iconColor: '#3b82f6',
    },
    {
      title: 'Total Contractors',
      count: '18',
      icon: 'construct',
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
      borderColor: 'rgba(139, 92, 246, 0.3)',
      iconColor: '#8b5cf6',
    },
    {
      title: 'Total Suppliers',
      count: '10',
      icon: 'business',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      iconColor: '#10b981',
    },
    {
      title: 'Active Sessions',
      count: '45',
      icon: 'desktop-outline',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      iconColor: '#f59e0b',
    },
  ];

  const recentActivities: ActivityData[] = [
    { id: 1, user: 'John Doe', action: 'New user registered', time: '10 min ago' },
    { id: 2, user: 'Sarah Smith', action: 'Updated profile', time: '25 min ago' },
    { id: 3, user: 'Mike Johnson', action: 'Created new project', time: '1 hour ago' },
    { id: 4, user: 'Emma Wilson', action: 'Uploaded documents', time: '2 hours ago' },
  ];

  const actionButtons: ActionButton[] = [
    {
      label: 'Add User',
      icon: 'add-circle-outline',
      iconColor: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
    },
    {
      label: 'Generate Report',
      icon: 'document-text-outline',
      iconColor: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      label: 'Settings',
      icon: 'settings-outline',
      iconColor: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
    {
      label: 'Analytics',
      icon: 'analytics-outline',
      iconColor: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
    },
  ];

  const renderCard = (card: CardData, index: number): React.JSX.Element => (
    <View 
      key={index} 
      style={[
        styles.card, 
        { 
          width: cardWidth,
          backgroundColor: card.bgColor,
          borderColor: card.borderColor,
        }
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: card.bgColor }]}>
          <Ionicons name={card.icon} size={24} color={card.iconColor} />
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-horizontal" size={18} color="#94a3b8" />
        </TouchableOpacity>
      </View>
      <Text style={styles.cardCount}>{card.count}</Text>
      <Text style={styles.cardTitle}>{card.title}</Text>
      <View style={styles.trendContainer}>
        <Ionicons name="trending-up" size={16} color={card.iconColor} />
        <Text style={[styles.trendText, { color: card.iconColor }]}>+12% this month</Text>
      </View>
    </View>
  );

  const renderActivity = (activity: ActivityData): React.JSX.Element => (
    <TouchableOpacity key={activity.id} style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <Ionicons name="notifications-outline" size={20} color="#3b82f6" />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityUser}>{activity.user}</Text>
        <Text style={styles.activityAction}>{activity.action}</Text>
      </View>
      <Text style={styles.activityTime}>{activity.time}</Text>
    </TouchableOpacity>
  );

  const renderActionButton = (button: ActionButton, index: number): React.JSX.Element => (
    <TouchableOpacity key={index} style={styles.actionButton}>
      <View style={[styles.actionIcon, { backgroundColor: button.bgColor }]}>
        <Ionicons name={button.icon} size={24} color={button.iconColor} />
      </View>
      <Text style={styles.actionText}>{button.label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back, Admin</Text>
            <Text style={styles.subtitle}>Here's what's happening today</Text>
          </View>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={20} color="#94a3b8" />
            <Text style={styles.dateText}>Today, Nov 15</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.grid}>
            {cards.map(renderCard)}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityList}>
            {recentActivities.map(renderActivity)}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {actionButtons.map(renderActionButton)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dateText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  statsContainer: {
    padding: 24,
    paddingBottom: 8,
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
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    padding: 4,
  },
  cardCount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  activityContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  activityList: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityUser: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  activityAction: {
    fontSize: 13,
    color: '#64748b',
  },
  activityTime: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  actionsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (Dimensions.get('window').width - 72) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'center',
  },
});