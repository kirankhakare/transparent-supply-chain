import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { API } from '@/services/api';

export default function ContractorLayout() {
  const router = useRouter();

  const [contractor, setContractor] = useState<any>(null);
  const [site, setSite] = useState<any>(null);

  /* ================= API ================= */

  const fetchContractor = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(API('/api/auth/me'), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load contractor');
    return res.json();
  };

  const fetchAssignedSites = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(API('/api/contractor/sites'), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load sites');
    return res.json();
  };

  useEffect(() => {
    loadDrawerData();
  }, []);

  const loadDrawerData = async () => {
    try {
      const [contractorData, siteData] = await Promise.all([
        fetchContractor(),
        fetchAssignedSites(),
      ]);

      setContractor(contractorData);

      if (siteData?.sites?.length > 0) {
        setSite(siteData.sites[0]); // current project summary
      }
    } catch (err) {
      console.log('Drawer load failed', err);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          router.replace('/login');
        },
      },
    ]);
  };

  /* ================= UI ================= */

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: { backgroundColor: '#0b1c3d' },
          headerTintColor: '#fff',
          drawerStyle: { backgroundColor: '#050b1a', width: 280 },
          drawerActiveTintColor: '#60a5fa',
          drawerInactiveTintColor: '#94a3b8',
        }}
        drawerContent={(props) => (
          <SafeAreaView style={styles.drawer}>
            {/* HEADER */}
            <View style={styles.header}>
              <View style={styles.avatar}>
                <Ionicons name="hammer" size={28} color="#60a5fa" />
              </View>
              <Text style={styles.name}>
                {contractor?.username || 'Contractor'}
              </Text>
              <Text style={styles.role}>Contractor Portal</Text>
            </View>

            {/* PROJECT SUMMARY */}
            {site ? (
              <View style={styles.projectBox}>
                <Row icon="briefcase-outline" text={site.projectName || 'Project'} />
                <Row
                  icon="stats-chart-outline"
                  text={`${site.completedWork} / ${site.totalWork} completed`}
                />
              </View>
            ) : (
              <Text style={styles.noProject}>No project assigned</Text>
            )}

            <View style={styles.divider} />

            {/* MENU */}
            {props.state.routeNames.map((route, index) => {
              if (route === 'orderDetails') return null;
              const focused = index === props.state.index;

              return (
                <TouchableOpacity
                  key={route}
                  onPress={() => props.navigation.navigate(route)}
                  style={[styles.menuItem, focused && styles.menuActive]}
                >
                  <Ionicons
                    name={getIcon(route, focused)}
                    size={22}
                    color={focused ? '#60a5fa' : '#94a3b8'}
                  />
                  <Text style={[styles.menuText, focused && styles.menuTextActive]}>
                    {getTitle(route)}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <View style={{ flex: 1 }} />

            {/* LOGOUT */}
            <TouchableOpacity style={styles.logout} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color="#f87171" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </SafeAreaView>
        )}
      >
        <Drawer.Screen name="projects" options={{ title: 'My Projects' }} />
        <Drawer.Screen name="orders" options={{ title: 'Orders' }} />
        <Drawer.Screen name="expenses" options={{ title: 'Expenses' }} />
        <Drawer.Screen
          name="orderDetails"
          options={{ drawerItemStyle: { display: 'none' } }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

/* ================= HELPERS ================= */

const Row = ({ icon, text }: any) => (
  <View style={styles.row}>
    <Ionicons name={icon} size={16} color="#cbd5e1" />
    <Text style={styles.rowText}>{text}</Text>
  </View>
);

const getIcon = (route: string, focused: boolean) => {
  if (route === 'projects') return focused ? 'briefcase' : 'briefcase-outline';
  if (route === 'orders') return focused ? 'cart' : 'cart-outline';
  if (route === 'expenses') return focused ? 'cash' : 'cash-outline';
  return 'ellipse-outline';
};

const getTitle = (route: string) =>
  route === 'projects' ? 'My Projects' : route[0].toUpperCase() + route.slice(1);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  drawer: { flex: 1, backgroundColor: '#050b1a' },

  header: { alignItems: 'center', paddingVertical: 32 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(96,165,250,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: { color: '#f8fafc', fontSize: 18, fontWeight: '700' },
  role: { color: '#94a3b8', fontSize: 13 },

  projectBox: {
    margin: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(59,130,246,0.1)',
  },

  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  rowText: { marginLeft: 8, color: '#e5e7eb', fontSize: 12 },

  noProject: {
    textAlign: 'center',
    color: '#94a3b8',
    marginVertical: 20,
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(148,163,184,0.2)',
    marginVertical: 16,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 6,
  },
  menuActive: { backgroundColor: 'rgba(96,165,250,0.15)' },
  menuText: { marginLeft: 14, color: '#94a3b8', fontSize: 15 },
  menuTextActive: { color: '#60a5fa', fontWeight: '700' },

  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(239,68,68,0.15)',
  },
  logoutText: {
    marginLeft: 14,
    color: '#f87171',
    fontWeight: '700',
    fontSize: 15,
  },
});
