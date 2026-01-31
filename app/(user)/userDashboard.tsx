import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { API } from '@/services/api';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function UserDashboard() {
  const [userName, setUserName] = useState('');
  const [project, setProject] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [cost, setCost] = useState<any>(null);
  // modals
  const [activeModal, setActiveModal] = useState<
    null | 'contractor' | 'images' | 'materials' | 'cost' | 'progress'
  >(null);

  const [imageModal, setImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading]);

  const fetchCostDetails = async () => {
    const token = await AsyncStorage.getItem('token');

    const res = await fetch(API('/api/user/cost-details'), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setCost(data);
  };

  const fetchDashboard = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      await fetchCostDetails();
      // 🔹 user info
      const userRes = await axios.get(API('/api/auth/me'), { headers });
      // 🔹 project
      const projectRes = await axios.get(API('/api/user/project'), { headers });
      // 🔹 orders
      const ordersRes = await axios.get(API('/api/user/orders'), { headers });

      setUser(userRes.data);
      setProject(projectRes.data);
      setOrders(ordersRes.data);
    } catch (err: any) {
      console.log('USER DASHBOARD ERROR:', err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };


  const logout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          // Add navigation reset here if using React Navigation
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  const progressPercent = project ? (project.completedWork / project.totalWork) * 100 : 0;

  const CostRow = ({ label, value, danger, primary }: any) => (
    <View style={styles.costItem}>
      <Text style={styles.costLabel}>{label}</Text>
      <Text
        style={[
          styles.costValue,
          danger && { color: '#ef4444' },
          primary && { color: '#2563eb' },
        ]}
      >
        ₹{value || 0}
      </Text>
    </View>
  );

  return (
    <>
      {/* ================= HEADER ================= */}
      <LinearGradient
        colors={['#2563eb', '#1d4ed8']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.userName}>{user?.username || 'User'} 👋</Text>
          </View>
          <TouchableOpacity
            onPress={logout}
            style={styles.logoutBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* ================= PROJECT STATUS CARD ================= */}
          <LinearGradient
            colors={['#ffffff', '#f8fafc']}
            style={[styles.card, styles.elevatedCard]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Project Status</Text>
              <View style={[styles.statusBadge, styles.activeBadge]}>
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>
                  {project?.completedWork || 0} / {project?.totalWork || 0} completed
                </Text>
                <Text style={styles.progressPercent}>{progressPercent.toFixed(0)}%</Text>
              </View>

              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progressPercent}%` }]}>
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    style={styles.progressFillGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* ================= QUICK ACTIONS ================= */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.grid}>
              <GridBtn
                icon="person"
                label="Contractor"
                color="#3b82f6"
                onPress={() => setActiveModal('contractor')}
              />
              <GridBtn
                icon="images"
                label="Site Images"
                color="#8b5cf6"
                onPress={() => setActiveModal('images')}
              />
              <GridBtn
                icon="cube"
                label="Materials"
                color="#f59e0b"
                onPress={() => setActiveModal('materials')}
              />
              <GridBtn
                icon="trending-up"
                label="Progress"
                color="#10b981"
                onPress={() => setActiveModal('progress')}
              />
              <GridBtn
                icon="document-text"
                label="Cost Report"
                color="#ef4444"
                onPress={() => setActiveModal('cost')}
              />
              <GridBtn
                icon="chatbubble"
                label="Messages"
                color="#ec4899"
                onPress={() => {
                  setActiveModal(null);
                  router.push('/(user)/chat');
                }}
              />
            </View>
          </View>

          {/* ================= RECENT ORDERS ================= */}
          {orders.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Orders</Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.ordersList}>
                {orders.slice(0, 3).map((order) => (
                  <TouchableOpacity
                    key={order._id}
                    style={styles.orderCard}
                    activeOpacity={0.8}
                  >
                    <View style={styles.orderHeader}>
                      <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
                      <View
                        style={[
                          styles.orderStatus,
                          order.status === 'DELIVERED'
                            ? styles.deliveredStatus
                            : styles.pendingStatus,
                        ]}
                      >
                        <Text style={styles.orderStatusText}>
                          {order.status}
                        </Text>
                      </View>

                    </View>
                    <Text style={styles.orderDescription} numberOfLines={2}>
                      {order.description || 'Material delivery'}
                    </Text>
                    {/* <View style={styles.orderFooter}>
                      <Text style={styles.orderDate}>
                        <Ionicons name="time-outline" size={14} color="#64748b" />
                        {' '}2 days ago
                      </Text>
                      <Text style={styles.orderAmount}>₹{order.amount || '0'}</Text>
                    </View> */}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* ================= MODALS ================= */}

      {/* Contractor Modal */}
      <Modal visible={activeModal === 'contractor'} transparent animationType="slide">
        <ModalBox
          title="Assigned Contractor"
          icon="person"
          close={() => setActiveModal(null)}
        >
          <View style={styles.contractorInfo}>
            <View style={styles.contractorAvatar}>
              <Ionicons name="person-circle" size={60} color="#3b82f6" />
            </View>
            <Text style={styles.contractorName}>
              {project?.contractor?.username || 'Not Assigned'}
            </Text>
            <Text style={styles.contractorRole}>Senior Contractor</Text>

            <View style={styles.contractorDetails}>
              <DetailItem icon="call-outline" label="+91 9876543210" />
              <DetailItem icon="mail-outline" label="contractor@email.com" />
              <DetailItem icon="star-outline" label="4.8 Rating" />
            </View>
          </View>
        </ModalBox>
      </Modal>

      {/* Site Images Modal */}
      {/* ================= SITE IMAGES MODAL ================= */}
      <Modal visible={activeModal === 'images'} transparent animationType="slide">
        <ModalBox
          title="Delivery Proof Images"
          icon="images"
          close={() => setActiveModal(null)}
        >
          <ScrollView style={styles.imagesGrid}>

            {/* 🔹 No images state */}
            {orders.filter(o => o.delivery?.imageUrl).length === 0 && (
              <Text
                style={{
                  textAlign: 'center',
                  color: '#64748b',
                  marginTop: 20,
                  fontSize: 14,
                }}
              >
                No delivery images yet
              </Text>
            )}

            {/* 🔹 Delivery images */}
            {orders
              .filter(o => o.delivery?.imageUrl)
              .map((o) => (
                <TouchableOpacity
                  key={o._id}
                  style={styles.imageCard}
                  activeOpacity={0.9}
                  onPress={() => {
                    setSelectedImage(o.delivery.imageUrl);
                    setImageModal(true);
                  }}
                >
                  <Image
                    source={{ uri: o.delivery.imageUrl }}
                    style={styles.modalImage}
                  />

                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.75)']}
                    style={styles.imageOverlay}
                  >
                    <Text style={styles.imageLabel}>
                      Order #{o.orderNumber}
                    </Text>

                    {o.delivery?.deliveredAt && (
                      <Text
                        style={{
                          color: '#e5e7eb',
                          fontSize: 12,
                          marginTop: 2,
                        }}
                      >
                        {new Date(o.delivery.deliveredAt).toDateString()}
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </ModalBox>
      </Modal>


      {/* Materials Modal */}
      <Modal visible={activeModal === 'materials'} transparent animationType="slide">
        <ModalBox
          title="Material Delivery Status"
          icon="cube"
          close={() => setActiveModal(null)}
        >
          <ScrollView>
            {orders.map((o) => (
              <View key={o._id} style={styles.materialItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.materialName}>
                    Order #{o.orderNumber}
                  </Text>

                  {o.materials?.map((m: any, idx: number) => (
                    <Text key={idx} style={styles.materialDesc}>
                      • {m.name} – {m.quantity} {m.unit}
                    </Text>
                  ))}

                  {o.delivery?.deliveredAt && (
                    <Text style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                      Delivered on {new Date(o.delivery.deliveredAt).toDateString()}
                    </Text>
                  )}
                </View>

                <View
                  style={[
                    styles.materialStatus,
                    o.status === 'DELIVERED'
                      ? styles.successStatus
                      : styles.warningStatus,
                  ]}
                >
                  <Text style={styles.materialStatusText}>
                    {o.status}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </ModalBox>
      </Modal>


      {/* Cost Modal */}
      <Modal visible={activeModal === 'cost'} transparent animationType="slide">
        <ModalBox
          title="Cost Report"
          icon="document-text"
          close={() => setActiveModal(null)}
        >
          {/* SUMMARY */}
          {/* <View style={styles.costCard}>
      <CostRow label="Estimated Budget" value={cost?.estimatedCost} />
      <CostRow label="Amount Spent" value={cost?.spentCost} danger />
      <CostRow label="Remaining" value={cost?.remainingCost} primary />
    </View> */}

          {/* <View style={styles.budgetBar}>
      <View
        style={[
          styles.budgetSpent,
          { width: `${cost?.percentageUsed || 0}%` },
        ]}
      />
    </View> */}

          {/* <Text style={styles.budgetText}>
      {cost?.percentageUsed || 0}% of budget used
    </Text> */}

          {/* EXPENSE LIST */}
          <ScrollView style={{ marginTop: 16 }}>
            {cost?.expenses?.length === 0 && (
              <Text style={{ textAlign: 'center', color: '#64748b' }}>
                No expenses added yet
              </Text>
            )}

            {cost?.expenses?.map((e: any) => (
              <View key={e._id} style={styles.expenseItem}>
                <View>
                  <Text style={styles.expenseCategory}>{e.category}</Text>
                  <Text style={styles.expenseDesc}>
                    {e.description || '—'}
                  </Text>
                  <Text style={styles.expenseMeta}>
                    {e.paidTo} • {e.payment}
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.expenseAmount}>₹{e.amount}</Text>
                  <Text style={styles.expenseDate}>
                    {new Date(e.createdAt).toDateString()}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </ModalBox>
      </Modal>
      {/* Progress Modal */}
      <Modal visible={activeModal === 'progress'} transparent animationType="slide">
        <ModalBox
          title="Progress Status"
          icon="trending-up"
          close={() => setActiveModal(null)}
        >
          <View style={styles.progressCircle}>
            <Text style={styles.progressCircleText}>{progressPercent.toFixed(1)}%</Text>
            <Text style={styles.progressCircleLabel}>Completed</Text>
          </View>

          <View style={styles.milestoneList}>
            <MilestoneItem label="Site Preparation" completed={true} />
            <MilestoneItem label="Foundation" completed={true} />
            <MilestoneItem label="Structure" completed={progressPercent > 40} />
            <MilestoneItem label="Electrical & Plumbing" completed={progressPercent > 60} />
            <MilestoneItem label="Finishing" completed={progressPercent > 80} />
            <MilestoneItem label="Handover" completed={progressPercent >= 100} />
          </View>
        </ModalBox>
      </Modal>

      {/* Full Image Modal */}
      {/* Site Images Modal */}
      <Modal visible={activeModal === 'images'} transparent animationType="slide">
        <ModalBox
          title="Delivery Proof Images"
          icon="images"
          close={() => setActiveModal(null)}
        >
          <ScrollView style={styles.imagesGrid}>
            {orders.filter(o => o.delivery?.imageUrl).length === 0 && (
              <Text style={{ textAlign: 'center', color: '#64748b' }}>
                No delivery images yet
              </Text>
            )}

            {orders.map((o) =>
              o.delivery?.imageUrl ? (
                <TouchableOpacity
                  key={o._id}
                  style={styles.imageCard}
                  activeOpacity={0.9}
                  onPress={() => {
                    setSelectedImage(o.delivery.imageUrl);
                    setImageModal(true);
                  }}
                >
                  <Image
                    source={{ uri: o.delivery.imageUrl }}
                    style={styles.modalImage}
                  />

                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.imageOverlay}
                  >
                    <Text style={styles.imageLabel}>
                      Order #{o.orderNumber}
                    </Text>
                    <Text style={{ color: '#e5e7eb', fontSize: 12 }}>
                      {o.delivery?.deliveredAt
                        ? new Date(o.delivery.deliveredAt).toDateString()
                        : ''}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : null
            )}
          </ScrollView>
        </ModalBox>
      </Modal>

    </>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

const GridBtn = ({ icon, label, color, onPress }: any) => (
  <TouchableOpacity
    style={styles.gridBtn}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <LinearGradient
      colors={[color + '20', color + '10']}
      style={[styles.gridIcon, { borderColor: color + '30' }]}
    >
      <Ionicons name={icon} size={26} color={color} />
    </LinearGradient>
    <Text style={styles.gridLabel}>{label}</Text>
  </TouchableOpacity>
);

const ModalBox = ({ title, icon, children, close }: any) => (
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <View style={styles.modalHeader}>
        <View style={styles.modalTitleContainer}>
          {icon && <Ionicons name={icon} size={24} color="#2563eb" style={styles.modalIcon} />}
          <Text style={styles.modalTitle}>{title}</Text>
        </View>
        <TouchableOpacity onPress={close} style={styles.modalCloseBtn} activeOpacity={0.7}>
          <Ionicons name="close" size={24} color="#64748b" />
        </TouchableOpacity>
      </View>
      <View style={styles.modalContent}>{children}</View>
      <TouchableOpacity onPress={close} style={styles.modalActionBtn} activeOpacity={0.7}>
        <Text style={styles.modalActionText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const DetailItem = ({ icon, label }: any) => (
  <View style={styles.detailItem}>
    <Ionicons name={icon} size={18} color="#64748b" />
    <Text style={styles.detailLabel}>{label}</Text>
  </View>
);

const MilestoneItem = ({ label, completed }: any) => (
  <View style={styles.milestoneItem}>
    <View style={[styles.milestoneDot, completed && styles.milestoneDotCompleted]}>
      {completed && <Ionicons name="checkmark" size={14} color="#fff" />}
    </View>
    <Text style={[styles.milestoneLabel, completed && styles.milestoneLabelCompleted]}>
      {label}
    </Text>
  </View>
);

/* ================= ENHANCED STYLES ================= */

const styles = StyleSheet.create({
  // Base
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  content: {
    padding: 20,
  },

  // Loader
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },

  // Header
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 14,
    color: '#dbeafe',
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '700',
    marginTop: 4,
  },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Cards
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  elevatedCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#dcfce7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
  },

  // Progress
  progressContainer: {
    marginBottom: 20,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '700',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressFillGradient: {
    flex: 1,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridBtn: {
    width: (width - 40) / 3 - 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  gridIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 8,
  },
  gridLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
    textAlign: 'center',
  },

  // Orders
  ordersList: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  orderStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deliveredStatus: {
    backgroundColor: '#dcfce7',
  },
  pendingStatus: {
    backgroundColor: '#fef3c7',
  },
  orderStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  orderDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 20,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalIcon: {
    marginRight: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
    maxHeight: 400,
  },
  modalActionBtn: {
    backgroundColor: '#2563eb',
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalActionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Contractor Modal
  contractorInfo: {
    alignItems: 'center',
  },
  contractorAvatar: {
    marginBottom: 12,
  },
  contractorName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  contractorRole: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  contractorDetails: {
    width: '100%',
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  detailLabel: {
    marginLeft: 10,
    fontSize: 14,
    color: '#475569',
  },

  // Images Modal
  imagesGrid: {
    maxHeight: 400,
  },
  imageCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    height: 180,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  imageLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Materials Modal
  materialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 8,
  },
  materialInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  materialIcon: {
    marginRight: 12,
  },
  materialName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  materialDesc: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  materialStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  successStatus: {
    backgroundColor: '#dcfce7',
  },
  warningStatus: {
    backgroundColor: '#fef3c7',
  },
  materialStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },

  // Cost Modal
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 8,
  },
  expenseCategory: {
    fontWeight: '700',
    color: '#1e293b',
  },
  expenseDesc: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  expenseMeta: {
    fontSize: 12,
    color: '#94a3b8',
  },
  expenseAmount: {
    fontWeight: '700',
    color: '#ef4444',
  },
  expenseDate: {
    fontSize: 11,
    color: '#94a3b8',
  },

  costCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  costItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  costLabel: {
    fontSize: 16,
    color: '#475569',
  },
  costValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#059669',
  },
  spentCost: {
    color: '#ef4444',
  },
  remainingCost: {
    color: '#2563eb',
  },
  costDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
  },
  budgetBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  budgetSpent: {
    height: '100%',
    backgroundColor: '#ef4444',
    borderRadius: 4,
  },
  budgetText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },

  // Progress Modal
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    borderWidth: 6,
    borderColor: '#dbeafe',
  },
  progressCircleText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2563eb',
  },
  progressCircleLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  milestoneList: {
    gap: 12,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  milestoneDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  milestoneDotCompleted: {
    backgroundColor: '#10b981',
  },
  milestoneLabel: {
    fontSize: 16,
    color: '#94a3b8',
  },
  milestoneLabelCompleted: {
    color: '#1e293b',
    fontWeight: '500',
  },

  // Full Image Modal
  fullImageModal: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeImageBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
});