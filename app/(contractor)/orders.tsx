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
import { useRouter, useLocalSearchParams } from 'expo-router';

type Order = {
  id: string;
  orderNumber: string;
  projectId: string;
  projectName: string;
  supplier: string;
  materials: string[];
  totalAmount: string;
  status: 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  expectedDelivery: string;
  items: number;
};

const ORDERS_DATA: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    projectId: '1',
    projectName: 'Modern Residence Construction',
    supplier: 'BuildMart Supplies',
    materials: ['Cement', 'Steel Bars', 'Bricks'],
    totalAmount: '$12,500',
    status: 'delivered',
    orderDate: '2024-01-20',
    expectedDelivery: '2024-01-25',
    items: 15,
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    projectId: '1',
    projectName: 'Modern Residence Construction',
    supplier: 'Electrical World',
    materials: ['Wires', 'Switches', 'Conduits'],
    totalAmount: '$8,750',
    status: 'shipped',
    orderDate: '2024-02-05',
    expectedDelivery: '2024-02-10',
    items: 8,
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    projectId: '2',
    projectName: 'Commercial Office Renovation',
    supplier: 'Plumbing Pros',
    materials: ['PVC Pipes', 'Fittings', 'Fixtures'],
    totalAmount: '$6,200',
    status: 'approved',
    orderDate: '2024-02-15',
    expectedDelivery: '2024-02-20',
    items: 12,
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    projectId: '3',
    projectName: 'Shopping Mall Extension',
    supplier: 'Concrete Masters',
    materials: ['Ready Mix Concrete', 'Rebar'],
    totalAmount: '$25,000',
    status: 'pending',
    orderDate: '2024-03-01',
    expectedDelivery: '2024-03-10',
    items: 5,
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    projectId: '2',
    projectName: 'Commercial Office Renovation',
    supplier: 'Paint & Coatings Inc.',
    materials: ['Paint', 'Primer', 'Thinner'],
    totalAmount: '$3,800',
    status: 'cancelled',
    orderDate: '2024-02-10',
    expectedDelivery: '2024-02-15',
    items: 7,
  },
];

export default function Orders() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled'>('all');
  const router = useRouter();

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const filteredOrders = ORDERS_DATA.filter(order => {
    if (projectId && order.projectId !== projectId) return false;
    if (filter !== 'all' && order.status !== filter) return false;
    if (searchQuery) {
      return order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
             order.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
             order.materials.some(material => material.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return true;
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#3b82f6';
      case 'shipped': return '#8b5cf6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'time-outline';
      case 'approved': return 'checkmark-circle-outline';
      case 'shipped': return 'car-outline';
      case 'delivered': return 'checkmark-done';
      case 'cancelled': return 'close-circle-outline';
      default: return 'ellipse-outline';
    }
  };

  const navigateToOrderDetails = (orderId: string) => {
    router.push(`/(contractor)/orderDetails?id=${orderId}`);
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      activeOpacity={0.9}
      onPress={() => navigateToOrderDetails(item.id)}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <View style={styles.orderNumberContainer}>
            <Text style={styles.orderNumber}>{item.orderNumber}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
              <Ionicons name={getStatusIcon(item.status)} size={14} color={getStatusColor(item.status)} />
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>
          <Text style={styles.projectName} numberOfLines={1}>{item.projectName}</Text>
        </View>
        <Text style={styles.orderAmount}>{item.totalAmount}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="business" size={16} color="#6b7280" />
            <Text style={styles.detailText}>{item.supplier}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="calendar" size={16} color="#6b7280" />
            <Text style={styles.detailText}>{item.orderDate}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="cube" size={16} color="#6b7280" />
            <Text style={styles.detailText}>{item.items} items</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time" size={16} color="#6b7280" />
            <Text style={styles.detailText}>Expected: {item.expectedDelivery}</Text>
          </View>
        </View>
      </View>

      <View style={styles.materialsContainer}>
        {item.materials.slice(0, 3).map((material, index) => (
          <View key={index} style={styles.materialTag}>
            <Text style={styles.materialText}>{material}</Text>
          </View>
        ))}
        {item.materials.length > 3 && (
          <View style={styles.moreMaterials}>
            <Text style={styles.moreMaterialsText}>+{item.materials.length - 3} more</Text>
          </View>
        )}
      </View>

      <TouchableOpacity 
        style={styles.viewDetailsButton}
        onPress={() => navigateToOrderDetails(item.id)}
      >
        <Text style={styles.viewDetailsText}>View Order Details</Text>
        <Ionicons name="arrow-forward" size={16} color="#3b82f6" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Material Orders</Text>
          <Text style={styles.subtitle}>Track and manage your material purchases</Text>
        </View>
        <TouchableOpacity style={styles.newOrderButton}>
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.newOrderText}>New Order</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
        <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
          <Ionicons name="time" size={24} color="#D97706" />
          <Text style={styles.statNumber}>
            {ORDERS_DATA.filter(o => o.status === 'pending').length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#DBEAFE' }]}>
          <Ionicons name="checkmark-circle" size={24} color="#1D4ED8" />
          <Text style={styles.statNumber}>
            {ORDERS_DATA.filter(o => o.status === 'approved').length}
          </Text>
          <Text style={styles.statLabel}>Approved</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#E0E7FF' }]}>
          <Ionicons name="car" size={24} color="#7C3AED" />
          <Text style={styles.statNumber}>
            {ORDERS_DATA.filter(o => o.status === 'shipped').length}
          </Text>
          <Text style={styles.statLabel}>Shipped</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#D1FAE5' }]}>
          <Ionicons name="checkmark-done" size={24} color="#047857" />
          <Text style={styles.statNumber}>
            {ORDERS_DATA.filter(o => o.status === 'delivered').length}
          </Text>
          <Text style={styles.statLabel}>Delivered</Text>
        </View>
      </ScrollView>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          placeholder="Search orders by supplier, material, or order #..."
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
        {(['all', 'pending', 'approved', 'shipped', 'delivered', 'cancelled'] as const).map((status) => (
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

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.ordersList}
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
            <Ionicons name="cart-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Try adjusting your search or filters' : 'No orders placed yet'}
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
  newOrderButton: {
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
  newOrderText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsScroll: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  statCard: {
    width: 120,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
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
  ordersList: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  projectName: {
    fontSize: 14,
    color: '#6b7280',
  },
  orderAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 12,
  },
  orderDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  materialsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  materialTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  materialText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  moreMaterials: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  moreMaterialsText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  viewDetailsText: {
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