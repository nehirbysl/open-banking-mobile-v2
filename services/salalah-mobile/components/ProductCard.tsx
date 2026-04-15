/**
 * ProductCard — grid tile with press animation and add-to-cart button.
 */

import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import type { Product } from '../utils/products';
import { formatOMR } from '../utils/format';
import { useCart } from '../utils/cart';
import ProductArtwork from './ProductArtwork';
import StarRating from './StarRating';
import { theme } from '../utils/theme';

interface Props {
  product: Product;
  /** When true, card takes full parent width (list layout). */
  wide?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ProductCard({ product, wide = false }: Props) {
  const router = useRouter();
  const addToCart = useCart((s) => s.add);
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12 });
  };

  const handleAdd = (e: any) => {
    e?.stopPropagation?.();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    addToCart(product, 1);
  };

  return (
    <AnimatedPressable
      onPress={() => router.push({ pathname: '/products/[id]', params: { id: product.id } })}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card, wide && styles.wide, animStyle]}
      testID={`product-card-${product.id}`}
    >
      <LinearGradient
        colors={[theme.colors.bgMuted, theme.colors.bgAccent]}
        style={styles.art}
      >
        <ProductArtwork kind={product.kind} size={wide ? 110 : 120} />
        {product.featured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="sparkles" size={10} color="#FFF" />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
      </LinearGradient>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.tagline} numberOfLines={1}>
          {product.tagline}
        </Text>
        <View style={styles.ratingRow}>
          <StarRating value={product.rating} size={12} />
          <Text style={styles.ratingText}>
            {product.rating.toFixed(1)} · {product.reviewCount}
          </Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.price}>{formatOMR(product.price)}</Text>
          <Pressable
            onPress={handleAdd}
            style={styles.addBtn}
            hitSlop={10}
            testID={`add-${product.id}`}
          >
            <Ionicons name="add" size={20} color="#FFF" />
          </Pressable>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    shadowColor: theme.colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  wide: { flexDirection: 'row', alignItems: 'stretch' },
  art: {
    aspectRatio: 1.1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.round,
    gap: 3,
  },
  featuredText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  body: { padding: 12, gap: 4 },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    lineHeight: 18,
  },
  tagline: { fontSize: 11, color: theme.colors.textFaint, fontStyle: 'italic' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 4 },
  ratingText: { fontSize: 11, color: theme.colors.textMuted },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  price: { fontSize: 16, fontWeight: '800', color: theme.colors.primary },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
