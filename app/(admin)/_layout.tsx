import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function AdminLayout() {
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

  // Icon mapping for drawer items
  const getIcon = (routeName: string, focused: boolean) => {
    switch (routeName) {
      case 'dashboard':
        return focused ? 'home' : 'home-outline';
      case 'createUser':
        return focused ? 'person-add' : 'person-add-outline';
      case 'suppliers':
        return focused ? 'business' : 'business-outline';
      case 'contractors':
        return focused ? 'construct' : 'construct-outline';
      case 'users':
        return focused ? 'people' : 'people-outline';
      default:
        return 'ellipse-outline';
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Drawer
        screenOptions={{
          headerStyle: { 
            backgroundColor: '#0f172a',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
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
          drawerActiveTintColor: '#38bdf8',
          drawerInactiveTintColor: '#94a3b8',
          drawerActiveBackgroundColor: 'rgba(56, 189, 248, 0.1)',
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
                <Ionicons name="shield-checkmark" size={32} color="#38bdf8" />
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.welcomeText}>Welcome, Admin</Text>
                <Text style={styles.roleText}>Administrator</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Navigation Items */}
            <View style={styles.drawerItems}>
              {props.state.routeNames.map((route, index) => {
                const focused = index === props.state.index;
                const iconName = getIcon(route, focused);
                
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
                        color={focused ? '#38bdf8' : '#94a3b8'} 
                        style={styles.icon}
                      />
                      <Text
                        style={[
                          styles.drawerItemText,
                          focused && styles.drawerItemTextActive,
                        ]}
                      >
                        {route.charAt(0).toUpperCase() + route.slice(1)}
                      </Text>
                    </View>
                    {focused && (
                      <View style={styles.activeIndicator} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Spacer */}
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
          name="dashboard" 
          options={{ 
            title: 'Dashboard',
            drawerIcon: ({ focused, size }) => (
              <Ionicons 
                name={focused ? 'home' : 'home-outline'} 
                size={size} 
                color={focused ? '#38bdf8' : '#94a3b8'} 
              />
            ),
          }} 
        />
        <Drawer.Screen 
          name="createUser" 
          options={{ 
            title: 'Create User',
            drawerIcon: ({ focused, size }) => (
              <Ionicons 
                name={focused ? 'person-add' : 'person-add-outline'} 
                size={size} 
                color={focused ? '#38bdf8' : '#94a3b8'} 
              />
            ),
          }} 
        />
        <Drawer.Screen 
          name="suppliers" 
          options={{ 
            title: 'Suppliers',
            drawerIcon: ({ focused, size }) => (
              <Ionicons 
                name={focused ? 'business' : 'business-outline'} 
                size={size} 
                color={focused ? '#38bdf8' : '#94a3b8'} 
              />
            ),
          }} 
        />
        <Drawer.Screen 
          name="contractors" 
          options={{ 
            title: 'Contractors',
            drawerIcon: ({ focused, size }) => (
              <Ionicons 
                name={focused ? 'construct' : 'construct-outline'} 
                size={size} 
                color={focused ? '#38bdf8' : '#94a3b8'} 
              />
            ),
          }} 
        />
        <Drawer.Screen 
          name="users" 
          options={{ 
            title: 'Users',
            drawerIcon: ({ focused, size }) => (
              <Ionicons 
                name={focused ? 'people' : 'people-outline'} 
                size={size} 
                color={focused ? '#38bdf8' : '#94a3b8'} 
              />
            ),
          }} 
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.3)',
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
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
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
    color: '#38bdf8',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    right: 0,
    top: 12,
    bottom: 12,
    width: 4,
    backgroundColor: '#38bdf8',
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