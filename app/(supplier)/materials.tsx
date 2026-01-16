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
  Alert,
  Modal,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type Material = {
  id: string;
  name: string;
  category: 'cement' | 'steel' | 'bricks' | 'aggregate' | 'pipes' | 'electrical' | 'paint';
  unit: 'bags' | 'tons' | 'pieces' | 'cubic meters' | 'meters' | 'liters' | 'rolls';
  quantity: number;
  minStock: number;
  maxStock: number;
  price: number;
  status: 'in stock' | 'low stock' | 'out of stock';
  supplierCode: string;
  location: string;
  lastUpdated: string;
};

const MATERIALS_DATA: Material[] = [
  {
    id: '1',
    name: 'Portland Cement (Grade 53)',
    category: 'cement',
    unit: 'bags',
    quantity: 1250,
    minStock: 200,
    maxStock: 1500,
    price: 8.5,
    status: 'in stock',
    supplierCode: 'CEM-001',
    location: 'Warehouse A, Rack 3',
    lastUpdated: '2024-03-15',
  },
  {
    id: '2',
    name: 'TMT Steel Bars (12mm)',
    category: 'steel',
    unit: 'tons',
    quantity: 42,
    minStock: 10,
    maxStock: 50,
    price: 850,
    status: 'in stock',
    supplierCode: 'STL-012',
    location: 'Warehouse B, Rack 1',
    lastUpdated: '2024-03-14',
  },
  {
    id: '3',
    name: 'Clay Bricks (9x4.5x3")',
    category: 'bricks',
    unit: 'pieces',
    quantity: 15000,
    minStock: 5000,
    maxStock: 20000,
    price: 0.65,
    status: 'low stock',
    supplierCode: 'BRK-045',
    location: 'Yard Section',
    lastUpdated: '2024-03-13',
  },
  {
    id: '4',
    name: 'PVC Pipes (4")',
    category: 'pipes',
    unit: 'meters',
    quantity: 800,
    minStock: 200,
    maxStock: 1000,
    price: 12.5,
    status: 'in stock',
    supplierCode: 'PIP-004',
    location: 'Warehouse A, Rack 5',
    lastUpdated: '2024-03-14',
  },
  {
    id: '5',
    name: 'Copper Wire (2.5mm)',
    category: 'electrical',
    unit: 'meters',
    quantity: 50,
    minStock: 100,
    maxStock: 500,
    price: 4.8,
    status: 'out of stock',
    supplierCode: 'ELC-025',
    location: 'Warehouse B, Rack 7',
    lastUpdated: '2024-03-10',
  },
  {
    id: '6',
    name: 'Waterproof Paint',
    category: 'paint',
    unit: 'liters',
    quantity: 120,
    minStock: 50,
    maxStock: 300,
    price: 25,
    status: 'in stock',
    supplierCode: 'PNT-001',
    location: 'Warehouse A, Rack 9',
    lastUpdated: '2024-03-15',
  },
  {
    id: '7',
    name: 'River Sand',
    category: 'aggregate',
    unit: 'cubic meters',
    quantity: 85,
    minStock: 30,
    maxStock: 100,
    price: 48,
    status: 'in stock',
    supplierCode: 'AGG-001',
    location: 'Yard Section',
    lastUpdated: '2024-03-14',
  },
  {
    id: '8',
    name: 'Electrical Conduits',
    category: 'electrical',
    unit: 'meters',
    quantity: 75,
    minStock: 100,
    maxStock: 400,
    price: 6.2,
    status: 'low stock',
    supplierCode: 'ELC-008',
    location: 'Warehouse B, Rack 8',
    lastUpdated: '2024-03-12',
  },
];

export default function Materials() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'in stock' | 'low stock' | 'out of stock'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | Material['category']>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'price'>('name');

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const filteredAndSortedMaterials = MATERIALS_DATA.filter(material => {
    if (filter !== 'all' && material.status !== filter) return false;
    if (categoryFilter !== 'all' && material.category !== categoryFilter) return false;
    if (searchQuery) {
      return material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             material.supplierCode.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'quantity') return b.quantity - a.quantity;
    if (sortBy === 'price') return b.price - a.price;
    return 0;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: Material['status']) => {
    switch (status) {
      case 'in stock': return '#10b981';
      case 'low stock': return '#f59e0b';
      case 'out of stock': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category: Material['category']) => {
    switch (category) {
      case 'cement': return '#3b82f6';
      case 'steel': return '#6b7280';
      case 'bricks': return '#ef4444';
      case 'aggregate': return '#f59e0b';
      case 'pipes': return '#8b5cf6';
      case 'electrical': return '#ec4899';
      case 'paint': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStockPercentage = (material: Material) => {
    const range = material.maxStock - material.minStock;
    const available = material.quantity - material.minStock;
    return Math.min(100, Math.max(0, (available / range) * 100));
  };

  const openMaterialDetails = (material: Material) => {
    setSelectedMaterial(material);
    setModalVisible(true);
  };

  const handleUpdateStock = (materialId: string, newQuantity: number) => {
    Alert.alert(
      'Update Stock',
      `Update quantity to ${newQuantity} units?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Update', onPress: () => {
          Alert.alert('Success', 'Stock updated successfully');
        }},
      ]
    );
  };

  const renderMaterialItem = ({ item }: { item: Material }) => {
    const stockPercentage = getStockPercentage(item);
    const isLowStock = item.status === 'low stock' || item.status === 'out of stock';
    
    return (
      <TouchableOpacity
        style={styles.materialCard}
        activeOpacity={0.9}
        onPress={() => openMaterialDetails(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.materialInfo}>
            <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(item.category) + '20' }]}>
              <Ionicons 
                name={item.category === 'electrical' ? 'flash' : 
                      item.category === 'paint' ? 'brush' : 
                      item.category === 'pipes' ? 'water' : 'cube'} 
                size={20} 
                color={getCategoryColor(item.category)} 
              />
            </View>
            <View style={styles.materialText}>
              <Text style={styles.materialName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.materialCode}>{item.supplierCode}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.quantityRow}>
          <View style={styles.quantityInfo}>
            <Text style={styles.quantityLabel}>Available:</Text>
            <Text style={[styles.quantityValue, isLowStock && styles.lowStockText]}>
              {item.quantity.toLocaleString()} {item.unit}
            </Text>
          </View>
          <Text style={styles.priceText}>{formatCurrency(item.price)}/{item.unit}</Text>
        </View>

        {/* Stock Level Indicator */}
        <View style={styles.stockContainer}>
          <View style={styles.stockLabels}>
            <Text style={styles.stockLabel}>Min: {item.minStock}</Text>
            <Text style={styles.stockLabel}>Max: {item.maxStock}</Text>
          </View>
          <View style={styles.stockBar}>
            <View 
              style={[
                styles.stockFill, 
                { 
                  width: `${stockPercentage}%`,
                  backgroundColor: getStatusColor(item.status)
                }
              ]} 
            />
          </View>
          <View style={styles.stockPercentage}>
            <Text style={styles.percentageText}>
              {Math.round(stockPercentage)}% of capacity
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.locationText}>
            <Ionicons name="location" size={14} color="#6b7280" /> {item.location}
          </Text>
          <TouchableOpacity 
            style={styles.updateButton}
            onPress={() => handleUpdateStock(item.id, item.quantity + 100)}
          >
            <Ionicons name="add" size={16} color="#059669" />
            <Text style={styles.updateButtonText}>Replenish</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0fdf4" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Inventory</Text>
          <Text style={styles.subtitle}>Manage your materials and stock levels</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
        <View style={[styles.statCard, { backgroundColor: '#D1FAE5' }]}>
          <Ionicons name="cube" size={24} color="#059669" />
          <Text style={styles.statNumber}>{MATERIALS_DATA.length}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
          <Ionicons name="alert-circle" size={24} color="#D97706" />
          <Text style={styles.statNumber}>
            {MATERIALS_DATA.filter(m => m.status === 'low stock' || m.status === 'out of stock').length}
          </Text>
          <Text style={styles.statLabel}>Need Attention</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#DBEAFE' }]}>
          <Ionicons name="trending-up" size={24} color="#1D4ED8" />
          <Text style={styles.statNumber}>
            {MATERIALS_DATA.reduce((acc, m) => acc + (m.quantity * m.price), 0).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
            })}
          </Text>
          <Text style={styles.statLabel}>Total Value</Text>
        </View>
      </ScrollView>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          placeholder="Search materials by name or code..."
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {(['all', 'in stock', 'low stock', 'out of stock'] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterChip, filter === status && styles.filterChipActive]}
            onPress={() => setFilter(status)}
          >
            <Text style={[styles.filterText, filter === status && styles.filterTextActive]}>
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {(['all', 'cement', 'steel', 'bricks', 'aggregate', 'pipes', 'electrical', 'paint'] as const).map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              categoryFilter === category && { backgroundColor: getCategoryColor(category as any) + '20' }
            ]}
            onPress={() => setCategoryFilter(category)}
          >
            <Ionicons 
              name={category === 'all' ? 'apps' : 
                    category === 'electrical' ? 'flash' : 
                    category === 'paint' ? 'brush' : 
                    category === 'pipes' ? 'water' : 'cube'} 
              size={16} 
              color={categoryFilter === category ? getCategoryColor(category as any) : '#6b7280'} 
            />
            <Text style={[
              styles.categoryText,
              categoryFilter === category && { color: getCategoryColor(category as any) }
            ]}>
              {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortScroll}>
          {['name', 'quantity', 'price'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.sortChip, sortBy === option && styles.sortChipActive]}
              onPress={() => setSortBy(option as any)}
            >
              <Text style={[styles.sortText, sortBy === option && styles.sortTextActive]}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Materials List */}
      <FlatList
        data={filteredAndSortedMaterials}
        keyExtractor={(item) => item.id}
        renderItem={renderMaterialItem}
        contentContainerStyle={styles.materialsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#059669"
            colors={['#059669']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No materials found</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Try a different search term' : 'Add your first material to get started'}
            </Text>
          </View>
        }
      />

      {/* Material Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMaterial && (
              <>
                <View style={styles.modalHeader}>
                  <View style={[styles.modalIcon, { backgroundColor: getCategoryColor(selectedMaterial.category) + '20' }]}>
                    <Ionicons 
                      name={selectedMaterial.category === 'electrical' ? 'flash' : 
                            selectedMaterial.category === 'paint' ? 'brush' : 
                            selectedMaterial.category === 'pipes' ? 'water' : 'cube'} 
                      size={32} 
                      color={getCategoryColor(selectedMaterial.category)} 
                    />
                  </View>
                  <View style={styles.modalTitleContainer}>
                    <Text style={styles.modalName}>{selectedMaterial.name}</Text>
                    <Text style={styles.modalCode}>{selectedMaterial.supplierCode}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalStats}>
                  <View style={styles.modalStat}>
                    <Text style={styles.modalStatLabel}>Current Stock</Text>
                    <Text style={[styles.modalStatValue, { color: getStatusColor(selectedMaterial.status) }]}>
                      {selectedMaterial.quantity.toLocaleString()} {selectedMaterial.unit}
                    </Text>
                  </View>
                  <View style={styles.modalStat}>
                    <Text style={styles.modalStatLabel}>Price</Text>
                    <Text style={styles.modalStatValue}>{formatCurrency(selectedMaterial.price)}/{selectedMaterial.unit}</Text>
                  </View>
                  <View style={styles.modalStat}>
                    <Text style={styles.modalStatLabel}>Status</Text>
                    <View style={[styles.modalStatusBadge, { backgroundColor: getStatusColor(selectedMaterial.status) + '20' }]}>
                      <Text style={[styles.modalStatusText, { color: getStatusColor(selectedMaterial.status) }]}>
                        {selectedMaterial.status}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Stock Levels</Text>
                  <View style={styles.stockInfo}>
                    <View style={styles.stockItem}>
                      <Text style={styles.stockLabel}>Minimum</Text>
                      <Text style={styles.stockValue}>{selectedMaterial.minStock} {selectedMaterial.unit}</Text>
                    </View>
                    <View style={styles.stockItem}>
                      <Text style={styles.stockLabel}>Maximum</Text>
                      <Text style={styles.stockValue}>{selectedMaterial.maxStock} {selectedMaterial.unit}</Text>
                    </View>
                    <View style={styles.stockItem}>
                      <Text style={styles.stockLabel}>Capacity</Text>
                      <Text style={styles.stockValue}>{getStockPercentage(selectedMaterial).toFixed(1)}%</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Details</Text>
                  <View style={styles.detailItem}>
                    <Ionicons name="location" size={18} color="#6b7280" />
                    <Text style={styles.detailText}>{selectedMaterial.location}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar" size={18} color="#6b7280" />
                    <Text style={styles.detailText}>Last updated: {selectedMaterial.lastUpdated}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="pricetag" size={18} color="#6b7280" />
                    <Text style={styles.detailText}>Category: {selectedMaterial.category}</Text>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.editButton]}
                    onPress={() => {
                      setModalVisible(false);
                      handleUpdateStock(selectedMaterial.id, selectedMaterial.quantity + 100);
                    }}
                  >
                    <Ionicons name="add-circle" size={20} color="#059669" />
                    <Text style={styles.editButtonText}>Replenish Stock</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.updateButton]}
                    onPress={() => Alert.alert('Edit', 'Edit material details')}
                  >
                    <Ionicons name="create" size={20} color="#ffffff" />
                    <Text style={styles.updateButtonText}>Edit Details</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
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
    color: '#064e3b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#047857',
    maxWidth: 220,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#059669',
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
  statsScroll: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  statCard: {
    width: 140,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#064e3b',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#047857',
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
    borderColor: '#d1fae5',
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#064e3b',
    height: '100%',
  },
  filterScroll: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  filterChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#047857',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  categoryScroll: {
    paddingHorizontal: 20,
    marginBottom: 12,
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
    borderColor: '#d1fae5',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginLeft: 6,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#064e3b',
    marginRight: 12,
  },
  sortScroll: {
    flex: 1,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  sortChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  sortText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
  },
  sortTextActive: {
    color: '#ffffff',
  },
  materialsList: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  materialCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d1fae5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  materialInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  materialText: {
    flex: 1,
  },
  materialName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#064e3b',
    marginBottom: 4,
  },
  materialCode: {
    fontSize: 14,
    color: '#047857',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  quantityLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 6,
  },
  quantityValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#064e3b',
  },
  lowStockText: {
    color: '#ef4444',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  stockContainer: {
    marginBottom: 16,
  },
  stockLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stockLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  stockBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  stockFill: {
    height: '100%',
    borderRadius: 4,
  },
  stockPercentage: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  percentageText: {
    fontSize: 12,
    color: '#6b7280',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    color: '#6b7280',
    flex: 1,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  updateButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#064e3b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#047857',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#064e3b',
    marginBottom: 4,
  },
  modalCode: {
    fontSize: 14,
    color: '#047857',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalStat: {
    alignItems: 'center',
  },
  modalStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  modalStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#064e3b',
  },
  modalStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modalStatusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  modalSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#064e3b',
    marginBottom: 12,
  },
  stockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  stockItem: {
    alignItems: 'center',
  },
  stockValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#064e3b',
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  editButton: {
    backgroundColor: '#d1fae5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  // updateButton: {
  //   backgroundColor: '#059669',
  // },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  // updateButtonText: {
  //   fontSize: 16,
  //   fontWeight: '600',
  //   color: '#ffffff',
  // },
});