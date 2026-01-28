import React, { useEffect, useState } from 'react';
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
import { Picker } from '@react-native-picker/picker';

/* ================= IMAGEKIT CONFIG ================= */
const IMAGEKIT_UPLOAD_URL = 'https://upload.imagekit.io/api/v1/files/upload';
const IMAGEKIT_PUBLIC_KEY = 'YOUR_IMAGEKIT_PUBLIC_KEY';

type Site = {
  _id: string;
  projectName: string;
};

export default function DeliverOrder() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();

  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<string>('');

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  /* ================= LOAD SITES ================= */

  const loadSites = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
     const res = await fetch(API('/api/supplier/sites'), {
  headers: { Authorization: `Bearer ${token}` },
});

      const data = await res.json();
      if (res.ok) setSites(data);
    } catch {
      Alert.alert('Failed to load sites');
    }
  };

  useEffect(() => {
    loadSites();
  }, []);

  /* ================= CAMERA IMAGE ================= */

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera permission required');
      return;
    }

    const res = await ImagePicker.launchCameraAsync({
     mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!res.canceled) {
      setImageUri(res.assets[0].uri);
    }
  };

  /* ================= UPLOAD TO IMAGEKIT ================= */

  const uploadToImageKit = async (): Promise<string | null> => {
    if (!imageUri) return null;

    const formData = new FormData();
    const fileName = `delivery_${Date.now()}.jpg`;

    formData.append('file', {
      uri: imageUri,
      name: fileName,
      type: 'image/jpeg',
    } as any);

    formData.append('fileName', fileName);
    formData.append('publicKey', IMAGEKIT_PUBLIC_KEY);

    try {
      const res = await fetch(IMAGEKIT_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) return null;

      return data.url;
    } catch {
      return null;
    }
  };

  /* ================= SUBMIT DELIVERY ================= */

  const submitDelivery = async () => {
    if (!selectedSite) {
      Alert.alert('Please select site');
      return;
    }

    if (!imageUri) {
      Alert.alert('Please capture delivery image');
      return;
    }

    setUploading(true);

    try {
      const imageUrl = await uploadToImageKit();
      if (!imageUrl) {
        Alert.alert('Image upload failed');
        return;
      }

      const token = await AsyncStorage.getItem('token');

      const res = await fetch(
        API(`/api/supplier/order/${orderId}/deliver`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            siteId: selectedSite,
            imageUrl,
            message,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        Alert.alert(data.message || 'Delivery failed');
        return;
      }

      Alert.alert('Order delivered successfully');
      router.back();
    } catch {
      Alert.alert('Server error');
    } finally {
      setUploading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deliver Order</Text>

      {/* SITE SELECT */}
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={selectedSite}
          onValueChange={(v) => setSelectedSite(v)}
        >
          <Picker.Item label="Select Site" value="" />
          {sites.map((s) => (
            <Picker.Item
              key={s._id}
              label={s.projectName}
              value={s._id}
            />
          ))}
        </Picker>
      </View>

      {/* CAMERA IMAGE */}
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

  pickerBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
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

  input: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },

  btn: {
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  btnText: { color: '#fff', fontWeight: '800' },
});
