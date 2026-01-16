import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export default function ContractorLayout() {
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
            backgroundColor: '#1e40af',
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
            backgroundColor: '#0f172a', 
            width: 280,
          },
          drawerActiveTintColor: '#60a5fa',
          drawerInactiveTintColor: '#94a3b8',
          drawerActiveBackgroundColor: 'rgba(96, 165, 250, 0.1)',
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
                <Ionicons name="construct" size={32} color="#60a5fa" />
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.welcomeText}>Contractor Portal</Text>
                <Text style={styles.roleText}>Project Executor</Text>
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
                        color={focused ? '#60a5fa' : '#94a3b8'} 
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
          name="projects" 
          options={{ 
            title: 'My Projects',
            drawerIcon: ({ focused, size }) => (
              <Ionicons 
                name={focused ? 'briefcase' : 'briefcase-outline'} 
                size={size} 
                color={focused ? '#60a5fa' : '#94a3b8'} 
              />
            ),
          }} 
        />
        <Drawer.Screen 
          name="orders" 
          options={{ 
            title: 'Orders',
            drawerIcon: ({ focused, size }) => (
              <Ionicons 
                name={focused ? 'cart' : 'cart-outline'} 
                size={size} 
                color={focused ? '#60a5fa' : '#94a3b8'} 
              />
            ),
          }} 
        />
        <Drawer.Screen 
          name="expenses" 
          options={{ 
            title: 'Expenses',
            drawerIcon: ({ focused, size }) => (
              <Ionicons 
                name={focused ? 'cash' : 'cash-outline'} 
                size={size} 
                color={focused ? '#60a5fa' : '#94a3b8'} 
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
    case 'projects':
      return focused ? 'briefcase' : 'briefcase-outline';
    case 'orders':
      return focused ? 'cart' : 'cart-outline';
    case 'orderDetails':
      return focused ? 'document-text' : 'document-text-outline';
    case 'expenses':
      return focused ? 'cash' : 'cash-outline';
    default:
      return 'ellipse-outline';
  }
};

const getTitleForRoute = (route: string): string => {
  switch (route) {
    case 'projects':
      return 'My Projects';
    case 'orders':
      return 'Material Orders';
    case 'orderDetails':
      return 'Order Details';
    case 'expenses':
      return 'Project Expenses';
    default:
      return route.charAt(0).toUpperCase() + route.slice(1);
  }
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
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
    backgroundColor: 'rgba(96, 165, 250, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(96, 165, 250, 0.3)',
  },
  headerTextContainer: {
    flex: 1,
  },
  welcomeText: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  roleText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
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
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
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
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  drawerItemTextActive: {
    color: '#60a5fa',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    right: 0,
    top: 12,
    bottom: 12,
    width: 4,
    backgroundColor: '#60a5fa',
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