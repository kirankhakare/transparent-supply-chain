import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  specifications: string;
};

type OrderDetail = {
  id: string;
  orderNumber: string;
  projectName: string;
  supplier: {
    name: string;
    contact: string;
    email: string;
    phone: string;
  };
  status: 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  deliveryAddress: string;
  paymentStatus: 'pending' | 'partial' | 'paid';
  subTotal: number;
  tax: number;
  shipping: number;
  totalAmount: number;
  items: OrderItem[];
  notes: string;
  attachments: string[];
  trackingNumber?: string;
  carrier?: string;
};

const ORDER_DETAILS_DATA: OrderDetail = {
  id: '1',
  orderNumber: 'ORD-2024-001',
  projectName: 'Modern Residence Construction',
  supplier: {
    name: 'BuildMart Supplies',
    contact: 'John Supplier',
    email: 'john@buildmart.com',
    phone: '+1 (555) 123-4567',
  },
  status: 'delivered',
  orderDate: '2024-01-20',
  expectedDelivery: '2024-01-25',
  actualDelivery: '2024-01-24',
  deliveryAddress: '123 Main St, New York, NY 10001',
  paymentStatus: 'paid',
  subTotal: 11500,
  tax: 575,
  shipping: 425,
  totalAmount: 12500,
  items: [
    {
      id: '1',
      name: 'Portland Cement (50kg)',
      quantity: 100,
      unit: 'bags',
      unitPrice: 8.5,
      total: 850,
      specifications: 'Grade 53, Waterproof',
    },
    {
      id: '2',
      name: 'Steel Bars (12mm)',
      quantity: 50,
      unit: 'tons',
      unitPrice: 150,
      total: 7500,
      specifications: 'TMT 500D, 12m length',
    },
    {
      id: '3',
      name: 'Red Bricks',
      quantity: 5000,
      unit: 'pieces',
      unitPrice: 0.6,
      total: 3000,
      specifications: 'Clay, 9x4.5x3 inches',
    },
    {
      id: '4',
      name: 'River Sand',
      quantity: 20,
      unit: 'cubic meters',
      unitPrice: 45,
      total: 900,
      specifications: 'Fine aggregate, washed',
    },
    {
      id: '5',
      name: 'Coarse Aggregate',
      quantity: 15,
      unit: 'cubic meters',
      unitPrice: 50,
      total: 750,
      specifications: '20mm size, crushed stone',
    },
  ],
  notes: 'Please ensure all materials are delivered before 2 PM. Contact site manager upon arrival.',
  attachments: ['invoice.pdf', 'delivery-note.pdf'],
  trackingNumber: 'TRK-789456123',
  carrier: 'FedEx Ground',
};

export default function OrderDetails() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const [order] = useState(ORDER_DETAILS_DATA);

  const getStatusColor = (status: OrderDetail['status']) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#3b82f6';
      case 'shipped': return '#8b5cf6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPaymentStatusColor = (status: OrderDetail['paymentStatus']) => {
    switch (status) {
      case 'pending': return '#ef4444';
      case 'partial': return '#f59e0b';
      case 'paid': return '#10b981';
      default: return '#6b7280';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const renderOrderItem = ({ item }: { item: OrderItem }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemTotal}>{formatCurrency(item.total)}</Text>
      </View>
      <View style={styles.itemDetails}>
        <View style={styles.itemDetail}>
          <Text style={styles.detailLabel}>Quantity:</Text>
          <Text style={styles.detailValue}>
            {item.quantity} {item.unit}
          </Text>
        </View>
        <View style={styles.itemDetail}>
          <Text style={styles.detailLabel}>Unit Price:</Text>
          <Text style={styles.detailValue}>{formatCurrency(item.unitPrice)}/{item.unit}</Text>
        </View>
      </View>
      {item.specifications && (
        <Text style={styles.specifications}>
          <Text style={styles.specLabel}>Specifications: </Text>
          {item.specifications}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.orderNumber}>{order.orderNumber}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Project Info */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Project Information</Text>
          <View style={styles.infoRow}>
            <Ionicons name="business" size={20} color="#3b82f6" />
            <Text style={styles.infoText}>{order.projectName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color="#3b82f6" />
            <Text style={styles.infoText}>{order.deliveryAddress}</Text>
          </View>
        </View>

        {/* Supplier Info */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Supplier Details</Text>
          <View style={styles.infoRow}>
            <Ionicons name="person" size={20} color="#3b82f6" />
            <Text style={styles.infoText}>{order.supplier.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call" size={20} color="#3b82f6" />
            <Text style={styles.infoText}>{order.supplier.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="mail" size={20} color="#3b82f6" />
            <Text style={styles.infoText}>{order.supplier.email}</Text>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Order Timeline</Text>
          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#10b981' }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Order Placed</Text>
                <Text style={styles.timelineDate}>{order.orderDate}</Text>
              </View>
            </View>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: order.status === 'delivered' ? '#10b981' : '#3b82f6' }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Approved</Text>
                <Text style={styles.timelineDate}>2024-01-21</Text>
              </View>
            </View>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: order.status === 'delivered' ? '#10b981' : '#8b5cf6' }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Shipped</Text>
                <Text style={styles.timelineDate}>2024-01-22</Text>
                {order.trackingNumber && (
                  <Text style={styles.trackingText}>
                    Tracking: {order.trackingNumber} ({order.carrier})
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: order.status === 'delivered' ? '#10b981' : '#e5e7eb' }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Delivered</Text>
                <Text style={styles.timelineDate}>
                  {order.actualDelivery || 'Pending'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Order Items</Text>
            <Text style={styles.itemsCount}>{order.items.length} items</Text>
          </View>
          <FlatList
            data={order.items}
            keyExtractor={(item) => item.id}
            renderItem={renderOrderItem}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          />
        </View>

        {/* Payment Summary */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Payment Summary</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Subtotal</Text>
            <Text style={styles.paymentValue}>{formatCurrency(order.subTotal)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Tax (5%)</Text>
            <Text style={styles.paymentValue}>{formatCurrency(order.tax)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Shipping</Text>
            <Text style={styles.paymentValue}>{formatCurrency(order.shipping)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.paymentRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>{formatCurrency(order.totalAmount)}</Text>
          </View>
          <View style={[styles.paymentStatus, { backgroundColor: getPaymentStatusColor(order.paymentStatus) + '20' }]}>
            <Text style={[styles.paymentStatusText, { color: getPaymentStatusColor(order.paymentStatus) }]}>
              Payment Status: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
            </Text>
          </View>
        </View>

        {/* Notes & Attachments */}
        {order.notes && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Special Instructions</Text>
            <Text style={styles.notesText}>{order.notes}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionButton, styles.downloadButton]}>
            <Ionicons name="download" size={20} color="#3b82f6" />
            <Text style={styles.downloadButtonText}>Download Invoice</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.contactButton]}>
            <Ionicons name="chatbubble" size={20} color="#ffffff" />
            <Text style={styles.contactButtonText}>Contact Supplier</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  itemsCount: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  timeline: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  trackingText: {
    fontSize: 12,
    color: '#8b5cf6',
    marginTop: 2,
    fontWeight: '600',
  },
  itemCard: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  itemSeparator: {
    height: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  itemDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  itemDetail: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  specifications: {
    fontSize: 12,
    color: '#4b5563',
    fontStyle: 'italic',
    marginTop: 4,
  },
  specLabel: {
    fontWeight: '600',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  paymentValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  paymentStatus: {
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  paymentStatusText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  notesText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  downloadButton: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  contactButton: {
    backgroundColor: '#3b82f6',
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});