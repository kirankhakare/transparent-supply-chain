import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  StatusBar,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';

// Enhanced supplier data with more realistic details
const SUPPLIERS = [
  { 
    id: '1', 
    name: 'TechGear Solutions', 
    category: 'Electronics',
    contact: 'Sarah Johnson',
    email: 'sarah@techgear.com',
    phone: '+1 (555) 123-4567',
    status: 'Active',
    orders: 42,
    rating: 4.8
  },
  { 
    id: '2', 
    name: 'Global Material Corp', 
    category: 'Raw Materials',
    contact: 'Michael Chen',
    email: 'michael@globalmat.com',
    phone: '+1 (555) 987-6543',
    status: 'Active',
    orders: 28,
    rating: 4.5
  },
  { 
    id: '3', 
    name: 'FreshProduce Co', 
    category: 'Food & Beverage',
    contact: 'Emma Wilson',
    email: 'emma@freshproduce.com',
    phone: '+1 (555) 456-7890',
    status: 'Pending',
    orders: 15,
    rating: 4.2
  },
  { 
    id: '4', 
    name: 'BuildMaster Supplies', 
    category: 'Construction',
    contact: 'Robert Davis',
    email: 'robert@buildmaster.com',
    phone: '+1 (555) 234-5678',
    status: 'Active',
    orders: 37,
    rating: 4.7
  },
  { 
    id: '5', 
    name: 'MediCare Supplies', 
    category: 'Medical',
    contact: 'Dr. Lisa Wong',
    email: 'lisa@medicare.com',
    phone: '+1 (555) 345-6789',
    status: 'Inactive',
    orders: 0,
    rating: 4.9
  },
];

type Supplier = typeof SUPPLIERS[0];

export default function Suppliers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter suppliers based on search and category
  const filteredSuppliers = SUPPLIERS.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.contact.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || supplier.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = ['All', ...new Set(SUPPLIERS.map(s => s.category))];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const renderSupplierItem = ({ item }: { item: Supplier }) => (
    <TouchableOpacity style={styles.supplierCard} activeOpacity={0.9}>
      <View style={styles.cardHeader}>
        <View style={styles.supplierInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.supplierName}>{item.name}</Text>
            <Text style={styles.supplierCategory}>{item.category}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { 
          backgroundColor: item.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' :
                          item.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' :
                          'rgba(239, 68, 68, 0.1)',
          borderColor: item.status === 'Active' ? '#10b981' :
                       item.status === 'Pending' ? '#f59e0b' :
                       '#ef4444'
        }]}>
          <Text style={[styles.statusText, { 
            color: item.status === 'Active' ? '#10b981' :
                   item.status === 'Pending' ? '#f59e0b' :
                   '#ef4444'
          }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.contactInfo}>
        <View style={styles.contactRow}>
          <Ionicons name="person-outline" size={16} color="#64748b" />
          <Text style={styles.contactText}>{item.contact}</Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="mail-outline" size={16} color="#64748b" />
          <Text style={styles.contactText}>{item.email}</Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="call-outline" size={16} color="#64748b" />
          <Text style={styles.contactText}>{item.phone}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="cart-outline" size={16} color="#3b82f6" />
            <Text style={styles.statValue}>{item.orders}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="star" size={16} color="#f59e0b" />
            <Text style={styles.statValue}>{item.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#64748b" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Suppliers</Text>
          <Text style={styles.subtitle}>Manage your suppliers and inventory</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          placeholder="Search suppliers..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#94a3b8"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      <ScrollableCategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Stats Summary */}
      <View style={styles.statsSummary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{filteredSuppliers.length}</Text>
          <Text style={styles.summaryLabel}>Total Suppliers</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {SUPPLIERS.filter(s => s.status === 'Active').length}
          </Text>
          <Text style={styles.summaryLabel}>Active</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {SUPPLIERS.reduce((acc, s) => acc + s.orders, 0)}
          </Text>
          <Text style={styles.summaryLabel}>Total Orders</Text>
        </View>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>All Suppliers</Text>
        <Text style={styles.sectionCount}>{filteredSuppliers.length} items</Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      <FlatList
        data={filteredSuppliers}
        keyExtractor={(item) => item.id}
        renderItem={renderSupplierItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
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
            <Ionicons name="business-outline" size={64} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No suppliers found</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Try a different search term' : 'Add your first supplier'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// Separate component for category filter
const ScrollableCategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: { 
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}) => (
  <FlatList
    horizontal
    data={categories}
    keyExtractor={(item) => item}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.categoryContainer}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={[
          styles.categoryChip,
          selectedCategory === item && styles.categoryChipActive
        ]}
        onPress={() => onSelectCategory(item)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.categoryText,
          selectedCategory === item && styles.categoryTextActive
        ]}>
          {item}
        </Text>
      </TouchableOpacity>
    )}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 56,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
  categoryContainer: {
    paddingVertical: 8,
    paddingBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryChipActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  statsSummary: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  sectionCount: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  supplierCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
  },
  supplierInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  nameContainer: {
    flex: 1,
  },
  supplierName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  supplierCategory: {
    fontSize: 14,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 16,
  },
  contactInfo: {
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#475569',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginHorizontal: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 20,
  },
  actionButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});