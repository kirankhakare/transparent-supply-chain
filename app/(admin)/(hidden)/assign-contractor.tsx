import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../../../services/api';

type Contractor = {
  _id: string;
  username: string;
};

export default function AssignContractor() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const [contractors, setContractors] = useState<Contractor[]>([]);

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(API('/api/admin/contractors'), {
      headers: { Authorization: `Bearer ${token}` },
    });
    setContractors(await res.json());
  };

  const assign = async (contractorId: string) => {
    const token = await AsyncStorage.getItem('token');

    await fetch(API('/api/admin/assign-contractor'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, contractorId }),
    });

    router.back();
  };

  return (
    <FlatList
      data={contractors}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => assign(item._id)}
        >
          <Text style={styles.name}>{item.username}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
});
