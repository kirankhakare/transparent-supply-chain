import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export default function SupplierLayout() {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: { 
            backgroundColor: '#059669',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          drawerStyle: { 
            backgroundColor: '#064e3b', 
            width: 280,
          },
          drawerActiveTintColor: '#34d399',
          drawerInactiveTintColor: '#a7f3d0',
          drawerActiveBackgroundColor: 'rgba(52, 211, 153, 0.1)',
          drawerLabelStyle: {
            marginLeft: -20,
            fontWeight: '500',
            fontSize: 15,
          },
          drawerItemStyle: {
            borderRadius: 10,
            marginHorizontal: 12,
            marginVertical: 4,
            paddingVertical: 2,
          },
        }}
        drawerContent={(props) => (
          <SafeAreaView style={styles.drawerContainer}>
            {/* Drawer Header */}
            <View style={styles.drawerHeader}>
              <View style={styles.avatarContainer}>
                <Ionicons name="business" size={32} color="#34d399" />
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.welcomeText}>Supplier Portal</Text>
                <Text style={styles.roleText}>Material Provider</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Navigation Items */}
            <View style={styles.drawerItems}>
              {props.state.routeNames.map((route, index) => {
                const focused = index === props.state.index;
                const iconName = getIconForRoute(route, focused);
                
                return (
                  <TouchableOpacity
                    key={route}
                    onPress={() => props.navigation.navigate(route)}
                    style={[
                      styles.drawerItem,
                      focused && styles.drawerItemActive,
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.drawerItemContent}>
                      <Ionicons 
                        name={iconName} 
                        size={22} 
                        color={focused ? '#34d399' : '#a7f3d0'} 
                        style={styles.icon}
                      />
                      <Text
                        style={[
                          styles.drawerItemText,
                          focused && styles.drawerItemTextActive,
                        ]}
                      >
                        {getTitleForRoute(route)}
                      </Text>
                    </View>
                    {focused && (
                      <View style={styles.activeIndicator} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.spacer} />

            {/* Logout Button */}
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
              activeOpacity={0.8}
            >
              <View style={styles.logoutContent}>
                <Ionicons name="log-out-outline" size={22} color="#fca5a5" />
                <Text style={styles.logoutText}>Logout</Text>
              </View>
            </TouchableOpacity>
          </SafeAreaView>
        )}
      >
        <Drawer.Screen 
          name="materials" 
          options={{ 
            title: 'Inventory',
            drawerIcon: ({ focused, size }) => (
              <Ionicons 
                name={focused ? 'cube' : 'cube-outline'} 
                size={size} 
                color={focused ? '#34d399' : '#a7f3d0'} 
              />
            ),
          }} 
        />
        <Drawer.Screen 
          name="orders" 
          options={{ 
            title: 'Orders Received',
            drawerIcon: ({ focused, size }) => (
              <Ionicons 
                name={focused ? 'cart' : 'cart-outline'} 
                size={size} 
                color={focused ? '#34d399' : '#a7f3d0'} 
              />
            ),
          }} 
        />
        <Drawer.Screen 
          name="deliveries" 
          options={{ 
            title: 'Deliveries',
            drawerIcon: ({ focused, size }) => (
              <Ionicons 
                name={focused ? 'car' : 'car-outline'} 
                size={size} 
                color={focused ? '#34d399' : '#a7f3d0'} 
              />
            ),
          }} 
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const getIconForRoute = (route: string, focused: boolean): any => {
  switch (route) {
    case 'materials':
      return focused ? 'cube' : 'cube-outline';
    case 'orders':
      return focused ? 'cart' : 'cart-outline';
    case 'deliveries':
      return focused ? 'car' : 'car-outline';
    default:
      return 'ellipse-outline';
  }
};

const getTitleForRoute = (route: string): string => {
  switch (route) {
    case 'materials':
      return 'Inventory';
    case 'orders':
      return 'Orders Received';
    case 'deliveries':
      return 'Delivery Tracking';
    default:
      return route.charAt(0).toUpperCase() + route.slice(1);
  }
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#064e3b',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 40,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  headerTextContainer: {
    flex: 1,
  },
  welcomeText: {
    color: '#f0fdf4',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  roleText: {
    color: '#a7f3d0',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(167, 243, 208, 0.2)',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  drawerItems: {
    paddingVertical: 8,
  },
  drawerItem: {
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 10,
    position: 'relative',
  },
  drawerItemActive: {
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
  },
  drawerItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 16,
    width: 24,
  },
  drawerItemText: {
    color: '#a7f3d0',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  drawerItemTextActive: {
    color: '#34d399',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    right: 0,
    top: 12,
    bottom: 12,
    width: 4,
    backgroundColor: '#34d399',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  spacer: {
    flex: 1,
  },
  logoutButton: {
    marginHorizontal: 12,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(127, 29, 29, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(127, 29, 29, 0.3)',
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  logoutText: {
    color: '#fca5a5',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 16,
  },
});