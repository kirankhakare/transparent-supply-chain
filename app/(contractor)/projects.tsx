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

type Project = {
  id: string;
  name: string;
  client: string;
  location: string;
  status: 'active' | 'completed' | 'pending';
  progress: number;
  startDate: string;
  endDate: string;
  budget: string;
  completedTasks: number;
  totalTasks: number;
};

const PROJECTS_DATA: Project[] = [
  {
    id: '1',
    name: 'Modern Residence Construction',
    client: 'Johnson Family',
    location: '123 Main St, New York',
    status: 'active',
    progress: 65,
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    budget: '$250,000',
    completedTasks: 13,
    totalTasks: 20,
  },
  {
    id: '2',
    name: 'Commercial Office Renovation',
    client: 'TechCorp Inc.',
    location: '456 Business Ave, Chicago',
    status: 'active',
    progress: 40,
    startDate: '2024-02-01',
    endDate: '2024-08-15',
    budget: '$180,000',
    completedTasks: 8,
    totalTasks: 20,
  },
  {
    id: '3',
    name: 'Shopping Mall Extension',
    client: 'Metro Developers',
    location: '789 Mall Road, Miami',
    status: 'pending',
    progress: 10,
    startDate: '2024-03-01',
    endDate: '2024-10-31',
    budget: '$500,000',
    completedTasks: 2,
    totalTasks: 25,
  },
  {
    id: '4',
    name: 'Hotel Interior Design',
    client: 'Luxury Stays Co.',
    location: '321 Resort Blvd, Las Vegas',
    status: 'completed',
    progress: 100,
    startDate: '2023-11-01',
    endDate: '2024-02-28',
    budget: '$320,000',
    completedTasks: 18,
    totalTasks: 18,
  },
];

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'pending'>('all');
  const router = useRouter();

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const filteredProjects = PROJECTS_DATA.filter(project => {
    if (filter !== 'all' && project.status !== filter) return false;
    if (searchQuery) {
      return project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
             project.location.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'completed': return '#3b82f6';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusBgColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'rgba(16, 185, 129, 0.1)';
      case 'completed': return 'rgba(59, 130, 246, 0.1)';
      case 'pending': return 'rgba(245, 158, 11, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  };

  const navigateToOrders = (projectId: string) => {
    router.push(`/(contractor)/orders?projectId=${projectId}`);
  };

  const renderProjectCard = (project: Project) => (
    <TouchableOpacity 
      key={project.id}
      style={styles.projectCard}
      activeOpacity={0.9}
      onPress={() => navigateToOrders(project.id)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.projectInfo}>
          <View style={styles.projectIcon}>
            <Ionicons name="construct" size={24} color="#3b82f6" />
          </View>
          <View style={styles.projectText}>
            <Text style={styles.projectName} numberOfLines={1}>{project.name}</Text>
            <Text style={styles.projectClient}>{project.client}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(project.status) }]}>
          <Text style={[styles.statusText, { color: getStatusColor(project.status) }]}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.projectDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location" size={16} color="#6b7280" />
          <Text style={styles.detailText} numberOfLines={1}>{project.location}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{project.endDate}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressLabels}>
          <Text style={styles.progressText}>Progress</Text>
          <Text style={styles.progressPercentage}>{project.progress}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${project.progress}%`,
                backgroundColor: getStatusColor(project.status)
              }
            ]} 
          />
        </View>
        <Text style={styles.tasksText}>
          {project.completedTasks} of {project.totalTasks} tasks completed
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.budgetContainer}>
          <Ionicons name="cash" size={16} color="#10b981" />
          <Text style={styles.budgetText}>{project.budget}</Text>
        </View>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigateToOrders(project.id)}
        >
          <Text style={styles.actionButtonText}>View Orders</Text>
          <Ionicons name="arrow-forward" size={16} color="#3b82f6" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
            colors={['#3b82f6']}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Projects</Text>
            <Text style={styles.subtitle}>Manage your construction projects</Text>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{PROJECTS_DATA.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {PROJECTS_DATA.filter(p => p.status === 'active').length}
              </Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            placeholder="Search projects..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {(['all', 'active', 'completed', 'pending'] as const).map((status) => (
            <TouchableOpacity
              key={status}
              style={[styles.filterChip, filter === status && styles.filterChipActive]}
              onPress={() => setFilter(status)}
            >
              <Text style={[styles.filterText, filter === status && styles.filterTextActive]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Projects List */}
        <View style={styles.projectsList}>
          {filteredProjects.length > 0 ? (
            filteredProjects.map(renderProjectCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="construct-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No projects found</Text>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Try a different search term' : 'No projects assigned yet'}
              </Text>
            </View>
          )}
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  headerStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    height: '100%',
  },
  filterScroll: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  projectsList: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  projectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  projectIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  projectText: {
    flex: 1,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  projectClient: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  projectDetails: {
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  tasksText: {
    fontSize: 12,
    color: '#6b7280',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 6,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
    marginRight: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
});