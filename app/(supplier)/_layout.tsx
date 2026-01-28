import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { API } from '@/services/api';

export default function SupplierLayout() {
  const router = useRouter();
  const [supplier, setSupplier] = useState<any>(null);

  /* ================= LOAD SUPPLIER ================= */

  const loadSupplier = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(API('/api/auth/me'), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed');

      const data = await res.json();
      setSupplier(data);
    } catch (err) {
      console.log('Failed to load supplier profile');
    }
  };

  useEffect(() => {
    loadSupplier();
  }, []);

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: { backgroundColor: '#059669' },
          headerTintColor: '#fff',
          drawerStyle: {
            backgroundColor: '#064e3b',
            width: 280,
          },
          drawerActiveTintColor: '#34d399',
          drawerInactiveTintColor: '#a7f3d0',
        }}
        drawerContent={(props) => (
          <SafeAreaView style={styles.drawerContainer}>
            {/* HEADER */}
            <View style={styles.drawerHeader}>
              <View style={styles.avatar}>
                <Ionicons name="business" size={30} color="#34d399" />
              </View>

              <Text style={styles.name}>
                {supplier?.username || 'Supplier'}
              </Text>

              <Text style={styles.email}>
                {supplier?.email || 'Material Provider'}
              </Text>
            </View>

            <View style={styles.divider} />

            {/* MENU */}
            <View style={styles.menu}>
              {props.state.routeNames.map((route, index) => {
                const focused = index === props.state.index;

                return (
                  <TouchableOpacity
                    key={route}
                    onPress={() => props.navigation.navigate(route)}
                    style={[
                      styles.menuItem,
                      focused && styles.menuItemActive,
                    ]}
                  >
                    <Ionicons
                      name={getIcon(route, focused)}
                      size={22}
                      color={focused ? '#34d399' : '#a7f3d0'}
                      style={{ marginRight: 14 }}
                    />
                    <Text
                      style={[
                        styles.menuText,
                        focused && styles.menuTextActive,
                      ]}
                    >
                      {getTitle(route)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={{ flex: 1 }} />

            {/* LOGOUT */}
            <TouchableOpacity style={styles.logout} onPress={handleLogout}>
              <Ionicons
                name="log-out-outline"
                size={22}
                color="#fca5a5"
              />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </SafeAreaView>
        )}
      >
        <Drawer.Screen name="orders" options={{ title: 'Orders' }} />
        <Drawer.Screen name="deliveries" options={{ title: 'Deliveries' }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}

/* ================= HELPERS ================= */

const getIcon = (route: string, focused: boolean) => {
  switch (route) {
    case 'orders':
      return focused ? 'cart' : 'cart-outline';
    case 'deliveries':
      return focused ? 'car' : 'car-outline';
    default:
      return 'ellipse-outline';
  }
};

const getTitle = (route: string) => {
  switch (route) {
    case 'orders':
      return 'Orders Received';
    case 'deliveries':
      return 'Deliveries';
    default:
      return route;
  }
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  drawerContainer: { flex: 1, backgroundColor: '#064e3b' },

  drawerHeader: {
    alignItems: 'center',
    paddingVertical: 32,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(52,211,153,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  name: {
    color: '#f0fdf4',
    fontSize: 18,
    fontWeight: '700',
  },

  email: {
    color: '#a7f3d0',
    fontSize: 13,
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(167,243,208,0.2)',
    marginVertical: 16,
    marginHorizontal: 16,
  },

  menu: { paddingHorizontal: 16 },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 6,
  },

  menuItemActive: {
    backgroundColor: 'rgba(52,211,153,0.1)',
  },

  menuText: {
    fontSize: 15,
    color: '#a7f3d0',
    fontWeight: '500',
  },

  menuTextActive: {
    color: '#34d399',
    fontWeight: '700',
  },

  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },

  logoutText: {
    marginLeft: 14,
    color: '#fca5a5',
    fontWeight: '700',
    fontSize: 15,
  },
});
