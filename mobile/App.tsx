import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { fetchServices, type Service } from './src/api';

export default function App() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadServices = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      setServices(await fetchServices());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load services.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <FlatList
        contentContainerStyle={styles.content}
        data={services}
        keyExtractor={(service) => service.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void loadServices(true)}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <View>
                <Text style={styles.brand}>PARTNERONRENT</Text>
                <Text style={styles.title}>Good company,{'\n'}on your terms.</Text>
              </View>
              <View style={styles.brandMark}>
                <Text style={styles.brandMarkText}>P</Text>
              </View>
            </View>

            <View style={styles.introCard}>
              <Text style={styles.eyebrow}>A LITTLE LESS ALONE</Text>
              <Text style={styles.introTitle}>Find your kind of company.</Text>
              <Text style={styles.introText}>
                Choose an experience and meet a verified companion for the moments that matter.
              </Text>
            </View>

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Explore experiences</Text>
                <Text style={styles.sectionSubtitle}>Thoughtful company for everyday plans</Text>
              </View>
              {services.length > 0 && (
                <Text style={styles.count}>{services.length} options</Text>
              )}
            </View>

            {loading && (
              <View style={styles.messageCard}>
                <ActivityIndicator color={colors.primary} />
                <Text style={styles.messageText}>Loading experiences…</Text>
              </View>
            )}
            {!loading && error && (
              <View style={styles.messageCard}>
                <Text style={styles.errorTitle}>Couldn’t connect to PartnerOnRent</Text>
                <Text style={styles.messageText}>{error}</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void loadServices()}
                  style={styles.retryButton}
                >
                  <Text style={styles.retryText}>Try again</Text>
                </Pressable>
              </View>
            )}
            {!loading && !error && services.length === 0 && (
              <View style={styles.messageCard}>
                <Text style={styles.messageText}>No experiences are available right now.</Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.serviceCard}>
            <View style={[styles.serviceIcon, index % 2 === 0 ? styles.iconRose : styles.iconGold]}>
              <Text style={styles.serviceInitial}>{item.name.charAt(0)}</Text>
            </View>
            <View style={styles.serviceDetails}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.serviceDescription}>{item.tagline}</Text>
              <Text style={styles.price}>From ₹{item.basePrice.toLocaleString('en-IN')} / hour</Text>
            </View>
            <Text accessibilityLabel="Experience details" style={styles.chevron}>›</Text>
          </View>
        )}
        ListFooterComponent={
          <Text style={styles.footer}>Made for meaningful moments. Always platonic.</Text>
        }
      />
    </SafeAreaView>
  );
}

const colors = {
  background: '#FAF7F4',
  ink: '#28211F',
  muted: '#7B706B',
  primary: '#8F3D50',
  border: '#EEE7E2',
  white: '#FFFFFF',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  brand: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2.2,
    marginBottom: 9,
  },
  title: {
    color: colors.ink,
    fontSize: 31,
    fontWeight: '700',
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  brandMark: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandMarkText: {
    color: colors.white,
    fontSize: 23,
    fontWeight: '700',
  },
  introCard: {
    borderRadius: 22,
    padding: 22,
    backgroundColor: '#F0E2DE',
    marginBottom: 30,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginBottom: 10,
  },
  introTitle: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  introText: {
    color: '#635551',
    fontSize: 14,
    lineHeight: 21,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 5,
  },
  count: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  iconRose: {
    backgroundColor: '#F5E7E8',
  },
  iconGold: {
    backgroundColor: '#F5EEDC',
  },
  serviceInitial: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: '700',
  },
  serviceDetails: {
    flex: 1,
  },
  category: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  serviceName: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  serviceDescription: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  price: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  chevron: {
    color: colors.muted,
    fontSize: 27,
    marginLeft: 8,
    marginRight: 2,
  },
  messageCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 22,
    marginBottom: 12,
  },
  messageText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 9,
  },
  errorTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 11,
    marginTop: 16,
  },
  retryText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  footer: {
    color: colors.muted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 14,
  },
});
