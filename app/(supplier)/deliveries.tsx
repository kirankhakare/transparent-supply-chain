import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '@/services/api';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function DeliverOrder() {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const router = useRouter();

  const [siteName, setSiteName] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  /* ================= CAMERA ================= */

   const takePhoto = async () => {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Camera permission required');
    return;
  }

  const res = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'], // 🔥 FINAL FIX
    quality: 0.7,
  });

  if (!res.canceled) {
    setImageUri(res.assets[0].uri);
  }
};



  /* ================= SUBMIT DELIVERY ================= */

  const submitDelivery = async () => {
    if (!orderId) {
      Alert.alert('Invalid order');
      return;
    }

    if (!siteName.trim()) {
      Alert.alert('Please enter site name');
      return;
    }

    if (!imageUri) {
      Alert.alert('Please capture delivery image');
      return;
    }

    setUploading(true);

    try {
      const token = await AsyncStorage.getItem('token');

      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: `delivery_${Date.now()}.jpg`,
        type: 'image/jpeg',
      } as any);

      formData.append('siteName', siteName.trim()); // ✅ SAFE
      formData.append('message', message);

      const res = await fetch(
        API(`/api/supplier/order/${orderId}/deliver`),
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        Alert.alert(data.message || 'Delivery failed');
        return;
      }

      Alert.alert('Order delivered successfully');
      router.back();
    } catch (err) {
      Alert.alert('Server error');
    } finally {
      setUploading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deliver Order</Text>

      <TextInput
        placeholder="Enter Site Name"
        value={siteName}
        onChangeText={setSiteName}
        style={styles.input}
      />

      <TouchableOpacity style={styles.imgBox} onPress={takePhoto}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.img} />
        ) : (
          <Text style={{ color: '#64748b' }}>
            Capture Delivery Image
          </Text>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Message (optional)"
        value={message}
        onChangeText={setMessage}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={submitDelivery}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Mark Delivered</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 12 },

  input: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },

  imgBox: {
    height: 180,
    borderWidth: 1,
    borderColor: '#94a3b8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f8fafc',
  },

  img: { width: '100%', height: '100%', borderRadius: 12 },

  btn: {
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  btnText: { color: '#fff', fontWeight: '800' },
});
