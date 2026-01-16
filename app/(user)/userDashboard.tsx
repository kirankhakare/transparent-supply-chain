import { View, Text, StyleSheet } from 'react-native';

export default function UserDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Dashboard</Text>
      <Text>View projects, orders & status</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
