/**
 * Product detail — image carousel, rating, highlights, reviews,
 * quantity stepper, add-to-cart, native share.
 */

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Alert,
  FlatList,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getProduct, PRODUCTS, type Product } from '../../../utils/products';
import { useCart } from '../../../utils/cart';
import { formatOMR } from '../../../utils/format';
import { theme } from '../../../utils/theme';
import ProductArtwork from '../../../components/ProductArtwork';
import StarRating from '../../../components/StarRating';
import ProductCard from '../../../components/ProductCard';
import PrimaryButton from '../../../components/PrimaryButton';
import CartBadge from '../../../components/CartBadge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_HEIGHT = 320;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const product = useMemo(() => (id ? getProduct(id) : undefined), [id]);

  const addToCart = useCart((s) => s.add);
  const scrollY = useSharedValue(0);
  const [qty, setQty] = useState(1);
  const [slide, setSlide] = useState(0);
  const [favourite, setFavourite] = useState(false);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const artStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [-200, 0, 200], [-60, 0, 100]) },
      { scale: interpolate(scrollY.value, [-200, 0], [1.15, 1], 'clamp') },
    ],
  }));

  const headerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [120, 200], [0, 1], 'clamp'),
  }));

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={40} color={theme.colors.textFaint} />
          <Text style={styles.notFoundTitle}>Product not found</Text>
          <PrimaryButton
            title="Back to souq"
            icon="arrow-back"
            variant="outline"
            onPress={() => router.replace('/products')}
          />
        </View>
      </SafeAreaView>
    );
  }

  const relatedItems = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 4);

  const shareable = async () => {
    try {
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert('Share', `${product.name} — ${formatOMR(product.price)}`);
        return;
      }
      Alert.alert('Share', `${product.name} ready to share`);
    } catch {
      Alert.alert('Share', `${product.name} — ${formatOMR(product.price)}`);
    }
  };

  const handleAdd = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    addToCart(product, qty);
    Alert.alert('Added to cart', `${qty} × ${product.name}`, [
      { text: 'Keep shopping', style: 'cancel' },
      { text: 'View cart', onPress: () => router.push('/cart') },
    ]);
  };

  const handleBuyNow = () => {
    Haptics.selectionAsync().catch(() => {});
    addToCart(product, qty);
    router.push('/checkout');
  };

  return (
    <View style={styles.container}>
      {/* Floating header (appears on scroll) */}
      <Animated.View style={[styles.floatingHeader, headerStyle]} pointerEvents="box-none">
        <SafeAreaView edges={['top']} style={styles.floatingHeaderInner}>
          <Text numberOfLines={1} style={styles.floatingTitle}>
            {product.name}
          </Text>
        </SafeAreaView>
      </Animated.View>

      {/* Top controls (always visible) */}
      <SafeAreaView edges={['top']} style={styles.topControls}>
        <Pressable style={styles.topBtn} onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </Pressable>
        <View style={styles.topRight}>
          <Pressable
            style={styles.topBtn}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              setFavourite((v) => !v);
            }}
            hitSlop={8}
          >
            <Ionicons
              name={favourite ? 'heart' : 'heart-outline'}
              size={22}
              color={favourite ? theme.colors.danger : theme.colors.text}
            />
          </Pressable>
          <Pressable style={styles.topBtn} onPress={shareable} hitSlop={8}>
            <Ionicons name="share-outline" size={22} color={theme.colors.text} />
          </Pressable>
          <CartBadge />
        </View>
      </SafeAreaView>

      <AnimatedScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image carousel with parallax */}
        <Animated.View style={[styles.carouselWrap, artStyle]}>
          <LinearGradient
            colors={[theme.colors.bgMuted, theme.colors.bgAccent]}
            style={StyleSheet.absoluteFill}
          />
          <FlatList
            data={[0, 1, 2]}
            keyExtractor={(i) => String(i)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              setSlide(Math.round(x / SCREEN_WIDTH));
            }}
            renderItem={({ item }) => (
              <View style={styles.slide}>
                <ProductArtwork
                  kind={product.kind}
                  size={item === 1 ? 220 : item === 2 ? 180 : 240}
                />
              </View>
            )}
          />
          <View style={styles.dots}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[styles.dot, slide === i && styles.dotActive]}
              />
            ))}
          </View>
        </Animated.View>

        {/* Details card overlapping the carousel */}
        <Animated.View entering={FadeInDown} style={styles.detailsCard}>
          <Text style={styles.category}>
            {product.category.toUpperCase()}
            {product.featured ? ' · FEATURED' : ''}
          </Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.tagline}>{product.tagline}</Text>
          <View style={styles.ratingRow}>
            <StarRating value={product.rating} size={16} />
            <Text style={styles.ratingText}>
              {product.rating.toFixed(1)} · {product.reviewCount} reviews
            </Text>
            <View style={styles.stockPill}>
              <Ionicons name="cube-outline" size={12} color={theme.colors.success} />
              <Text style={styles.stockText}>{product.stock} in stock</Text>
            </View>
          </View>

          <View style={styles.priceBlock}>
            <Text style={styles.price}>{formatOMR(product.price)}</Text>
            <Text style={styles.priceNote}>VAT included · Free returns</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.body}>{product.description}</Text>

          <View style={styles.heritageBlock}>
            <Ionicons name="sparkles" size={16} color={theme.colors.gold} />
            <Text style={styles.heritageText}>{product.heritage}</Text>
          </View>

          <Text style={styles.sectionTitle}>Highlights</Text>
          {product.highlights.map((h, i) => (
            <Animated.View
              key={i}
              entering={FadeIn.delay(150 + i * 60)}
              style={styles.highlightRow}
            >
              <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} />
              <Text style={styles.highlightText}>{h}</Text>
            </Animated.View>
          ))}

          <Text style={styles.sectionTitle}>Customer reviews</Text>
          {product.reviews.map((r) => (
            <View key={r.id} style={styles.review}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>
                    {r.author.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewAuthor}>{r.author}</Text>
                  <Text style={styles.reviewDate}>{r.date}</Text>
                </View>
                <StarRating value={r.rating} size={13} />
              </View>
              <Text style={styles.reviewBody}>{r.comment}</Text>
            </View>
          ))}

          {relatedItems.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>You may also like</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedRow}
              >
                {relatedItems.map((p) => (
                  <View key={p.id} style={styles.relatedItem}>
                    <ProductCard product={p} />
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          <View style={{ height: 100 }} />
        </Animated.View>
      </AnimatedScrollView>

      {/* Sticky purchase bar */}
      <View style={styles.stickyBar}>
        <View style={styles.qty}>
          <Pressable
            onPress={() => setQty((q) => Math.max(1, q - 1))}
            style={styles.qtyBtn}
            hitSlop={6}
            accessibilityLabel="Decrease quantity"
          >
            <Ionicons name="remove" size={18} color={theme.colors.primary} />
          </Pressable>
          <Text style={styles.qtyLabel}>{qty}</Text>
          <Pressable
            onPress={() => setQty((q) => Math.min(product.stock, q + 1))}
            style={styles.qtyBtn}
            hitSlop={6}
            accessibilityLabel="Increase quantity"
          >
            <Ionicons name="add" size={18} color={theme.colors.primary} />
          </Pressable>
        </View>
        <View style={styles.stickyActions}>
          <PrimaryButton
            title="Add"
            variant="outline"
            icon="bag-add"
            onPress={handleAdd}
            style={{ flex: 1 }}
            testID="add-to-cart"
          />
          <PrimaryButton
            title="Buy now"
            icon="flash"
            onPress={handleBuyNow}
            style={{ flex: 1 }}
            testID="buy-now"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  scrollContent: { paddingBottom: 100 },

  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  topRight: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    zIndex: 5,
  },
  floatingHeaderInner: {
    paddingHorizontal: 64,
    paddingVertical: 14,
    alignItems: 'center',
  },
  floatingTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.text,
  },

  carouselWrap: {
    height: CAROUSEL_HEIGHT,
    overflow: 'hidden',
  },
  slide: {
    width: SCREEN_WIDTH,
    height: CAROUSEL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(211, 84, 0, 0.35)',
  },
  dotActive: { backgroundColor: theme.colors.primary, width: 18 },

  detailsCard: {
    marginTop: -24,
    paddingTop: 22,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  category: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 6,
    lineHeight: 30,
  },
  tagline: {
    fontSize: 14,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 10,
    flexWrap: 'wrap',
  },
  ratingText: { fontSize: 12, color: theme.colors.textMuted },
  stockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#E8F5E9',
    borderRadius: theme.radius.round,
  },
  stockText: { fontSize: 11, color: theme.colors.success, fontWeight: '700' },

  priceBlock: { marginTop: 16 },
  price: { fontSize: 28, fontWeight: '800', color: theme.colors.primary },
  priceNote: { fontSize: 12, color: theme.colors.textFaint, marginTop: 2 },

  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 20,
  },

  sectionTitle: {
    fontSize: theme.typography.subheading,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 18,
    marginBottom: 10,
  },
  body: {
    fontSize: 14,
    color: theme.colors.textMuted,
    lineHeight: 22,
  },
  heritageBlock: {
    marginTop: 14,
    padding: 14,
    backgroundColor: theme.colors.bgMuted,
    borderRadius: theme.radius.md,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.gold,
  },
  heritageText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textMuted,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  highlightText: { flex: 1, fontSize: 13, color: theme.colors.text },

  review: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reviewAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarText: { color: '#FFF', fontWeight: '800' },
  reviewAuthor: { fontWeight: '700', color: theme.colors.text, fontSize: 13 },
  reviewDate: { fontSize: 11, color: theme.colors.textFaint },
  reviewBody: { color: theme.colors.textMuted, fontSize: 13, lineHeight: 19 },

  relatedRow: { gap: 12, paddingRight: 20 },
  relatedItem: { width: 180, marginRight: 12 },

  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.bg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qty: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 4,
  },
  qtyBtn: { padding: 8 },
  qtyLabel: {
    minWidth: 22,
    textAlign: 'center',
    fontWeight: '800',
    color: theme.colors.text,
  },
  stickyActions: { flex: 1, flexDirection: 'row', gap: 8 },

  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 20 },
  notFoundTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text },
});
