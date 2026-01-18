import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

/* ================= DUMMY ASSIGNED DATA ================= */
// Later replace this with API / AsyncStorage data
const ASSIGNED_PROJECT = {
  projectName: 'Apartment Construction',
  userName: 'Rohit Patil',
  userEmail: 'rohit@gmail.com',
};

export default function ContractorLayout() {
  const router = useRouter();

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
          headerStyle: {
            backgroundColor: '#1e40af',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          drawerStyle: {
            backgroundColor: '#0f172a',
            width: 290,
          },
          drawerActiveTintColor: '#60a5fa',
          drawerInactiveTintColor: '#94a3b8',
        }}
        drawerContent={(props) => (
          <SafeAreaView style={styles.drawerContainer}>
            {/* HEADER */}
            <View style={styles.drawerHeader}>
              <View style={styles.avatar}>
                <Ionicons name="construct" size={30} color="#60a5fa" />
              </View>
              <Text style={styles.contractorTitle}>Contractor Portal</Text>
              <Text style={styles.contractorSub}>
                Project Executor
              </Text>
            </View>

            {/* PROJECT INFO */}
            <View style={styles.projectBox}>
              <View style={styles.projectRow}>
                <Ionicons
                  name="briefcase-outline"
                  size={16}
                  color="#93c5fd"
                />
                <Text style={styles.projectText}>
                  {ASSIGNED_PROJECT.projectName}
                </Text>
              </View>

              <View style={styles.projectRow}>
                <Ionicons
                  name="person-outline"
                  size={16}
                  color="#cbd5e1"
                />
                <Text style={styles.clientText}>
                  {ASSIGNED_PROJECT.userName}
                </Text>
              </View>

              <View style={styles.projectRow}>
                <Ionicons
                  name="mail-outline"
                  size={16}
                  color="#cbd5e1"
                />
                <Text style={styles.clientText}>
                  {ASSIGNED_PROJECT.userEmail}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* NAVIGATION */}
            <View style={styles.drawerItems}>
              {props.state.routeNames.map((route, index) => {
                const focused = index === props.state.index;

                return (
                  <TouchableOpacity
                    key={route}
                    onPress={() => props.navigation.navigate(route)}
                    style={[
                      styles.drawerItem,
                      focused && styles.drawerItemActive,
                    ]}
                  >
                    <Ionicons
                      name={getIcon(route, focused)}
                      size={22}
                      color={focused ? '#60a5fa' : '#94a3b8'}
                      style={{ marginRight: 16 }}
                    />
                    <Text
                      style={[
                        styles.drawerText,
                        focused && styles.drawerTextActive,
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
            <TouchableOpacity
              style={styles.logout}
              onPress={handleLogout}
            >
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
        <Drawer.Screen name="projects" options={{ title: 'My Project' }} />
        <Drawer.Screen name="orders" options={{ title: 'Material Orders' }} />
        <Drawer.Screen name="expenses" options={{ title: 'Expenses' }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}

/* ================= HELPERS ================= */

const getIcon = (route: string, focused: boolean) => {
  switch (route) {
    case 'projects':
      return focused ? 'briefcase' : 'briefcase-outline';
    case 'orders':
      return focused ? 'cart' : 'cart-outline';
    case 'expenses':
      return focused ? 'cash' : 'cash-outline';
    default:
      return 'ellipse-outline';
  }
};

const getTitle = (route: string) => {
  switch (route) {
    case 'projects':
      return 'My Project';
    case 'orders':
      return 'Orders';
    case 'expenses':
      return 'Expenses';
    default:
      return route;
  }
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },

  drawerHeader: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(96,165,250,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  contractorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
  },

  contractorSub: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },

  projectBox: {
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(59,130,246,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.3)',
  },

  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  projectText: {
    marginLeft: 8,
    color: '#bfdbfe',
    fontWeight: '700',
    fontSize: 13,
  },

  clientText: {
    marginLeft: 8,
    color: '#e5e7eb',
    fontSize: 12,
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(148,163,184,0.2)',
    margin: 16,
  },

  drawerItems: {
    paddingHorizontal: 16,
  },

  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 6,
  },

  drawerItemActive: {
    backgroundColor: 'rgba(96,165,250,0.15)',
  },

  drawerText: {
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '500',
  },

  drawerTextActive: {
    color: '#60a5fa',
    fontWeight: '700',
  },

  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 14,
    borderRadius: 10,
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
