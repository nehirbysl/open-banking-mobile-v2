/**
 * Store landing — hero with parallax, featured carousel, categories,
 * and a curated "What's new" strip. Pull-to-refresh re-mounts featured data.
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  RefreshControl,
  FlatList,
  Dimensions,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CATEGORIES, getFeatured, PRODUCTS } from '../../utils/products';
import { theme } from '../../utils/theme';
import { formatOMR } from '../../utils/format';
import ProductCard from '../../components/ProductCard';
import CategoryChip from '../../components/CategoryChip';
import CartBadge from '../../components/CartBadge';
import ProductArtwork from '../../components/ProductArtwork';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = 260;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function StoreScreen() {
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  }, []);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [-200, 0, 200], [-60, 0, 80]) },
      { scale: interpolate(scrollY.value, [-200, 0], [1.2, 1], 'clamp') },
    ],
  }));

  const heroContentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, HERO_HEIGHT * 0.8], [1, 0], 'clamp'),
  }));

  const featured = getFeatured();
  const newArrivals = PRODUCTS.slice(-4);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.brand}>
          <Ionicons name="storefront" size={22} color={theme.colors.primary} />
          <Text style={styles.brandText}>Salalah Souq</Text>
        </View>
        <View style={styles.topActions}>
          <Pressable onPress={() => router.push('/about')} hitSlop={8} style={styles.topIconBtn}>
            <Ionicons name="information-circle-outline" size={24} color={theme.colors.text} />
          </Pressable>
          <CartBadge />
        </View>
      </View>

      <AnimatedScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hero */}
        <Animated.View style={[styles.hero, heroStyle]}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryDark]}
            style={StyleSheet.absoluteFill}
          />
          <Animated.View style={[styles.heroContent, heroContentStyle]}>
            <Text style={styles.heroEyebrow}>Heritage of Oman · Delivered</Text>
            <Text style={styles.heroTitle}>The Souq of{"\n"}the Land of Frankincense</Text>
            <Text style={styles.heroSubtitle}>
              Handpicked from Dhofar artisans. Pay securely with Bank Dhofar.
            </Text>
            <Pressable
              onPress={() => router.push('/products')}
              style={styles.heroCta}
              testID="hero-shop-all"
            >
              <Text style={styles.heroCtaText}>Shop all products</Text>
              <Ionicons name="arrow-forward" size={16} color={theme.colors.primary} />
            </Pressable>
          </Animated.View>
        </Animated.View>

        {/* Categories */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse by category</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            <CategoryChip
              label="All"
              emoji="✨"
              active
              onPress={() => router.push('/products')}
            />
            {CATEGORIES.map((c) => (
              <CategoryChip
                key={c.id}
                label={c.label}
                emoji={c.emoji}
                onPress={() =>
                  router.push({ pathname: '/products', params: { category: c.id } })
                }
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Featured carousel */}
        <Animated.View entering={FadeInDown.delay(150)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured treasures</Text>
            <Pressable onPress={() => router.push('/products')}>
              <Text style={styles.sectionLink}>See all →</Text>
            </Pressable>
          </View>

          <FlatList
            data={featured}
            horizontal
            keyExtractor={(p) => p.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselInner}
            snapToInterval={SCREEN_WIDTH * 0.75 + 14}
            decelerationRate="fast"
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  router.push({ pathname: '/products/[id]', params: { id: item.id } })
                }
                style={styles.featuredCard}
                testID={`featured-${item.id}`}
              >
                <LinearGradient
                  colors={[theme.colors.bgAccent, '#FFDFB4']}
                  style={styles.featuredArt}
                >
                  <ProductArtwork kind={item.kind} size={160} />
                </LinearGradient>
                <View style={styles.featuredBody}>
                  <Text style={styles.featuredTagline}>{item.tagline}</Text>
                  <Text style={styles.featuredName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <View style={styles.featuredFooter}>
                    <Text style={styles.featuredPrice}>{formatOMR(item.price)}</Text>
                    <View style={styles.featuredBtn}>
                      <Ionicons name="arrow-forward" size={16} color="#FFF" />
                    </View>
                  </View>
                </View>
              </Pressable>
            )}
          />
        </Animated.View>

        {/* Heritage promise */}
        <Animated.View entering={FadeIn.delay(200)} style={styles.promise}>
          <View style={styles.promiseItem}>
            <Ionicons name="leaf-outline" size={22} color={theme.colors.primary} />
            <Text style={styles.promiseLabel}>Wild-harvested</Text>
          </View>
          <View style={styles.promiseItem}>
            <Ionicons name="shield-checkmark-outline" size={22} color={theme.colors.primary} />
            <Text style={styles.promiseLabel}>Secure BD Pay</Text>
          </View>
          <View style={styles.promiseItem}>
            <Ionicons name="boat-outline" size={22} color={theme.colors.primary} />
            <Text style={styles.promiseLabel}>Ships worldwide</Text>
          </View>
        </Animated.View>

        {/* New arrivals grid (2-up) */}
        <Animated.View entering={FadeInDown.delay(250)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New arrivals</Text>
            <Pressable onPress={() => router.push('/products')}>
              <Text style={styles.sectionLink}>See all →</Text>
            </Pressable>
          </View>
          <View style={styles.grid}>
            {newArrivals.map((p) => (
              <View key={p.id} style={styles.gridItem}>
                <ProductCard product={p} />
              </View>
            ))}
          </View>
        </Animated.View>

        <View style={styles.footerStrip}>
          <Text style={styles.footerText}>
            Salalah Souq · A Bank Dhofar Open Banking showcase
          </Text>
        </View>
      </AnimatedScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.bg,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandText: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: 0.3,
  },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  topIconBtn: { padding: 4 },

  hero: {
    height: HERO_HEIGHT,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroContent: { padding: 24 },
  heroEyebrow: {
    color: '#FFE4CC',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
    marginTop: 10,
  },
  heroSubtitle: {
    color: '#FFE4CC',
    fontSize: 14,
    marginTop: 8,
    maxWidth: '90%',
  },
  heroCta: {
    marginTop: 18,
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: theme.radius.round,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroCtaText: { color: theme.colors.primary, fontWeight: '800', fontSize: 14 },

  section: { marginTop: 24 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: theme.typography.heading,
    fontWeight: '800',
    color: theme.colors.text,
  },
  sectionLink: { color: theme.colors.primary, fontWeight: '700' },
  chipRow: { paddingHorizontal: 20, paddingVertical: 4 },

  carouselInner: { paddingHorizontal: 20, gap: 14, paddingRight: 30 },
  featuredCard: {
    width: SCREEN_WIDTH * 0.75,
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    marginRight: 14,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  featuredArt: {
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredBody: { padding: 16, gap: 4 },
  featuredTagline: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  featuredName: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 2,
  },
  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  featuredPrice: { fontSize: 18, fontWeight: '800', color: theme.colors.primary },
  featuredBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  promise: {
    marginTop: 28,
    marginHorizontal: 20,
    flexDirection: 'row',
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.lg,
    padding: 18,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  promiseItem: { alignItems: 'center', gap: 6, flex: 1 },
  promiseLabel: { fontSize: 12, color: theme.colors.textMuted, fontWeight: '600' },

  grid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: { width: '48%', marginBottom: 14 },

  footerStrip: {
    marginTop: 24,
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: { fontSize: 11, color: theme.colors.textFaint },
});
