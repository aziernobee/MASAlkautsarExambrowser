import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  BackHandler,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const ADMIN_PASSWORD = '081511';

const LockScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { violationType, violationTime } = route.params || {};

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Format waktu
  const formatTime = (timestamp) => {
    if (!timestamp) return '--';
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Handle unlock
  const handleUnlock = () => {
    if (password === ADMIN_PASSWORD) {
      setError('');
      setPassword('');
      navigation.replace('Exam');
    } else {
      setError('Kode salah! Coba lagi.');
      setPassword('');
    }
  };

  // Handle exit
  const handleExit = () => {
    if (password === ADMIN_PASSWORD) {
      BackHandler.exitApp();
    } else {
      setError('Kode salah! Coba lagi.');
      setPassword('');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <View style={styles.content}>
        <Text style={styles.icon}>🚫</Text>

        <Text style={styles.title}>PELANGGARAN TERDETEKSI!</Text>

        <Text style={styles.violationText}>
          Jenis: {violationType || 'UNKNOWN'}
        </Text>

        <Text style={styles.violationText}>
          Waktu: {formatTime(violationTime)}
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Masukkan kode pengawas:
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Kode pengawas"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            keyboardType="number-pad"
            secureTextEntry={true}
            maxLength={10}
            textAlign="center"
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity 
            style={[styles.button, styles.unlockButton]}
            onPress={handleUnlock}
          >
            <Text style={styles.buttonText}>BUKA KUNCI & LANJUTKAN</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.exitButton]}
            onPress={handleExit}
          >
            <Text style={styles.buttonText}>KELUAR DARI APLIKASI</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          Extraordinary CBT - Al Kautsar Karawang
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7F1D1D',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  violationText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 4,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(185, 28, 28, 0.9)',
    borderRadius: 16,
    padding: 24,
    marginTop: 32,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    color: '#000000',
    marginBottom: 16,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    width: '100%',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  unlockButton: {
    backgroundColor: '#16A34A',
  },
  exitButton: {
    backgroundColor: '#DC2626',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 32,
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.6,
  },
});

export default LockScreen;
