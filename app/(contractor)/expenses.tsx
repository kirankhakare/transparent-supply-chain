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
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type Expense = {
  id: string;
  projectId: string;
  projectName: string;
  category: 'materials' | 'labor' | 'equipment' | 'transport' | 'other';
  description: string;
  amount: number;
  date: string;
  status: 'verified' | 'pending' | 'rejected';
  receipt?: string;
  paidTo: string;
  paymentMethod: 'cash' | 'bank' | 'online';
};

const EXPENSES_DATA: Expense[] = [
  {
    id: '1',
    projectId: '1',
    projectName: 'Modern Residence Construction',
    category: 'materials',
    description: 'Cement purchase for foundation',
    amount: 4250,
    date: '2024-01-15',
    status: 'verified',
    paidTo: 'BuildMart Supplies',
    paymentMethod: 'bank',
  },
  {
    id: '2',
    projectId: '1',
    projectName: 'Modern Residence Construction',
    category: 'labor',
    description: 'Masonry work - Week 3',
    amount: 3200,
    date: '2024-01-22',
    status: 'verified',
    paidTo: 'Smith Construction Crew',
    paymentMethod: 'cash',
  },
  {
    id: '3',
    projectId: '1',
    projectName: 'Modern Residence Construction',
    category: 'equipment',
    description: 'Crane rental for steel work',
    amount: 1500,
    date: '2024-02-01',
    status: 'pending',
    paidTo: 'Heavy Equipment Rentals',
    paymentMethod: 'online',
  },
  {
    id: '4',
    projectId: '2',
    projectName: 'Commercial Office Renovation',
    category: 'materials',
    description: 'Drywall and insulation materials',
    amount: 2800,
    date: '2024-02-10',
    status: 'verified',
    paidTo: 'Interior Supplies Co.',
    paymentMethod: 'bank',
  },
  {
    id: '5',
    projectId: '2',
    projectName: 'Commercial Office Renovation',
    category: 'labor',
    description: 'Electrical installation team',
    amount: 4500,
    date: '2024-02-12',
    status: 'pending',
    paidTo: 'Electric Masters',
    paymentMethod: 'bank',
  },
  {
    id: '6',
    projectId: '3',
    projectName: 'Shopping Mall Extension',
    category: 'transport',
    description: 'Material delivery - Round 1',
    amount: 1200,
    date: '2024-03-05',
    status: 'rejected',
    paidTo: 'Fast Transport Services',
    paymentMethod: 'cash',
  },
];

export default function Expenses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'materials' | 'labor' | 'equipment' | 'transport' | 'other'>('all');

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const filteredExpenses = EXPENSES_DATA.filter(expense => {
    if (filter !== 'all' && expense.status !== filter) return false;
    if (categoryFilter !== 'all' && expense.category !== categoryFilter) return false;
    if (searchQuery) {
      return expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
             expense.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             expense.paidTo.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalExpenses = () => {
    return EXPENSES_DATA.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getStatusColor = (status: Expense['status']) => {
    switch (status) {
      case 'verified': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category: Expense['category']) => {
    switch (category) {
      case 'materials': return '#3b82f6';
      case 'labor': return '#8b5cf6';
      case 'equipment': return '#f59e0b';
      case 'transport': return '#10b981';
      case 'other': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: Expense['category']) => {
    switch (category) {
      case 'materials': return 'cube';
      case 'labor': return 'people';
      case 'equipment': return 'construct';
      case 'transport': return 'car';
      case 'other': return 'receipt';
      default: return 'receipt';
    }
  };

  const getPaymentMethodIcon = (method: Expense['paymentMethod']) => {
    switch (method) {
      case 'cash': return 'cash';
      case 'bank': return 'card';
      case 'online': return 'globe';
      default: return 'cash';
    }
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <View style={styles.expenseCard}>
      <View style={styles.expenseHeader}>
        <View style={styles.categoryBadge}>
          <Ionicons 
            name={getCategoryIcon(item.category)} 
            size={16} 
            color={getCategoryColor(item.category)} 
          />
          <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.projectName}>{item.projectName}</Text>

      <View style={styles.expenseDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="person" size={16} color="#6b7280" />
            <Text style={styles.detailText}>{item.paidTo}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name={getPaymentMethodIcon(item.paymentMethod)} size={16} color="#6b7280" />
            <Text style={styles.detailText}>
              {item.paymentMethod.charAt(0).toUpperCase() + item.paymentMethod.slice(1)}
            </Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar" size={16} color="#6b7280" />
            <Text style={styles.detailText}>{item.date}</Text>
          </View>
          <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Project Expenses</Text>
          <Text style={styles.subtitle}>Track and manage your project costs</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.summaryScroll}>
        <View style={[styles.summaryCard, { backgroundColor: '#F0F9FF' }]}>
          <Ionicons name="trending-up" size={24} color="#0EA5E9" />
          <Text style={styles.summaryAmount}>{formatCurrency(getTotalExpenses())}</Text>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#F0FDF4' }]}>
          <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
          <Text style={styles.summaryAmount}>
            {formatCurrency(EXPENSES_DATA.filter(e => e.status === 'verified').reduce((sum, e) => sum + e.amount, 0))}
          </Text>
          <Text style={styles.summaryLabel}>Verified</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#FEFCE8' }]}>
          <Ionicons name="time" size={24} color="#EAB308" />
          <Text style={styles.summaryAmount}>
            {formatCurrency(EXPENSES_DATA.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0))}
          </Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>
      </ScrollView>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          placeholder="Search expenses..."
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

      {/* Status Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilterScroll}>
        {(['all', 'verified', 'pending', 'rejected'] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.statusChip, filter === status && styles.statusChipActive]}
            onPress={() => setFilter(status)}
          >
            <Text style={[styles.statusFilterText, filter === status && styles.statusFilterTextActive]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilterScroll}>
        {(['all', 'materials', 'labor', 'equipment', 'transport', 'other'] as const).map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              categoryFilter === category && { backgroundColor: getCategoryColor(category) + '20' }
            ]}
            onPress={() => setCategoryFilter(category)}
          >
            <Ionicons 
              name={getCategoryIcon(category)} 
              size={16} 
              color={categoryFilter === category ? getCategoryColor(category) : '#6b7280'} 
            />
            <Text style={[
              styles.categoryFilterText,
              categoryFilter === category && { color: getCategoryColor(category) }
            ]}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Expenses List */}
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        renderItem={renderExpenseItem}
        contentContainerStyle={styles.expensesList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
            colors={['#3b82f6']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No expenses found</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Try adjusting your search or filters' : 'No expenses recorded yet'}
            </Text>
          </View>
        }
      />
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
    maxWidth: 220,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  summaryScroll: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  summaryCard: {
    width: 160,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
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
  statusFilterScroll: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  statusChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statusChipActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  statusFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  statusFilterTextActive: {
    color: '#ffffff',
  },
  categoryFilterScroll: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginLeft: 6,
  },
  expensesList: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  expenseCard: {
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
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
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
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  projectName: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  expenseDetails: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },
  amount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
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