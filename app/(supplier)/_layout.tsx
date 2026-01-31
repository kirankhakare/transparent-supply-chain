// app/(supplier)/_layout.tsx
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

  useEffect(() => {
    loadSupplier();
  }, []);

  const loadSupplier = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(API('/api/auth/me'), {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setSupplier(data);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace('/login');
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: { backgroundColor: '#047857' },
          headerTintColor: '#fff',
          drawerStyle: { backgroundColor: '#064e3b' },
        }}
        drawerContent={(props) => (
          <SafeAreaView style={styles.drawer}>
            <View style={styles.header}>
              <Ionicons name="business" size={36} color="#34d399" />
              <Text style={styles.name}>
                {supplier?.username || 'Supplier'}
              </Text>
              <Text style={styles.role}>Supplier Panel</Text>
            </View>

            <View style={styles.divider} />

            {props.state.routeNames.map((route, i) => (
              <TouchableOpacity
                key={route}
                onPress={() => props.navigation.navigate(route)}
                style={styles.menuItem}
              >
                <Ionicons
                  name={route === 'orders' ? 'cart-outline' : 'car-outline'}
                  size={20}
                  color="#a7f3d0"
                />
                <Text style={styles.menuText}>{route}</Text>
              </TouchableOpacity>
            ))}

            <View style={{ flex: 1 }} />

            <TouchableOpacity style={styles.logout} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#fca5a5" />
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

const styles = StyleSheet.create({
  drawer: { flex: 1, backgroundColor: '#064e3b' },
  header: { alignItems: 'center', padding: 30 },
  name: { color: '#ecfdf5', fontSize: 18, fontWeight: '700' },
  role: { color: '#a7f3d0', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#14532d', margin: 16 },
  menuItem: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    marginHorizontal: 16,
  },
  menuText: { color: '#a7f3d0', fontSize: 15 },
  logout: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    margin: 16,
    backgroundColor: 'rgba(239,68,68,0.2)',
    borderRadius: 10,
  },
  logoutText: { color: '#fca5a5', fontWeight: '700' },
});
