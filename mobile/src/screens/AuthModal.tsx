import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../theme';
import { loginUser, registerUser } from '../api';
import type { User } from '../types';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export function AuthModal({ visible, onClose, onLoginSuccess }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('chaudharyhit@gmail.com');
  const [password, setPassword] = useState('123456');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickDemo = async () => {
    setIsLoading(true);
    try {
      const res = await loginUser('chaudharyhit@gmail.com', '123456', 'client');
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
        Alert.alert('Welcome Ajay!', 'Logged in as verified Hirer.');
      } else {
        Alert.alert('Login Failed', res.message || 'Unable to authenticate.');
      }
    } catch (err: any) {
      Alert.alert('Connection Error', err.message || 'Could not connect to backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Required', 'Email address is required.');
      return;
    }

    setIsLoading(true);
    try {
      if (isRegister) {
        if (!name.trim()) {
          Alert.alert('Required', 'Full name is required.');
          setIsLoading(false);
          return;
        }
        const res = await registerUser({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          role: 'client',
          city: city.trim(),
        });
        if (res.success && res.user) {
          onLoginSuccess(res.user);
          onClose();
          Alert.alert('Account Created', 'Welcome to PartnerOnRent! You are registered as a Hirer.');
        }
      } else {
        const res = await loginUser(email.trim(), password, 'client');
        if (res.success && res.user) {
          onLoginSuccess(res.user);
          onClose();
          Alert.alert('Signed In', `Welcome back, ${res.user.name}!`);
        }
      }
    } catch (err: any) {
      Alert.alert('Authentication Error', err.message || 'Could not complete request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.brandTitle}>PARTNERONRENT</Text>
              <Text style={styles.modalTitle}>
                {isRegister ? 'Create Hirer Account' : 'Hirer Sign In'}
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.body}>
            {/* Quick Demo Hirer Login */}
            <View style={styles.demoCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.demoCardTitle}>Instant Demo Hirer</Text>
                <Text style={styles.demoCardSub}>Log in instantly as verified client (Ajay)</Text>
              </View>
              <Pressable
                style={[styles.demoBtn, isLoading && styles.btnDisabled]}
                onPress={handleQuickDemo}
                disabled={isLoading}
              >
                <Text style={styles.demoBtnText}>One-Tap Login</Text>
              </Pressable>
            </View>

            <View style={styles.dividerRow}>
              <View style={styles.divLine} />
              <Text style={styles.divText}>or enter credentials</Text>
              <View style={styles.divLine} />
            </View>

            {isRegister && (
              <>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Rahul Sharma"
                  placeholderTextColor={colors.muted}
                  value={name}
                  onChangeText={setName}
                />

                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+91 98765 00000"
                  placeholderTextColor={colors.muted}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />

                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Delhi NCR / Mumbai"
                  placeholderTextColor={colors.muted}
                  value={city}
                  onChangeText={setCity}
                />
              </>
            )}

            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="name@example.com"
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor={colors.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Pressable
              style={[styles.submitBtn, isLoading && styles.btnDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.submitBtnText}>
                  {isRegister ? 'Register Hirer Account' : 'Sign In as Hirer'}
                </Text>
              )}
            </Pressable>

            {/* Switch mode */}
            <Pressable
              style={styles.toggleMode}
              onPress={() => setIsRegister(!isRegister)}
            >
              <Text style={styles.toggleModeText}>
                {isRegister
                  ? 'Already have an account? Sign In'
                  : "Don't have a Hirer account? Create One"}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brandTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 18,
    color: colors.muted,
  },
  body: {
    padding: 20,
    paddingBottom: 36,
  },
  demoCard: {
    backgroundColor: '#FAF0F2',
    borderColor: '#F3DEE3',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  demoCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  demoCardSub: {
    fontSize: 11,
    color: colors.muted,
  },
  demoBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  demoBtnText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  divLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  divText: {
    fontSize: 11,
    color: colors.muted,
    marginHorizontal: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.ink,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  toggleMode: {
    alignItems: 'center',
    marginTop: 16,
    padding: 4,
  },
  toggleModeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
});
