/**
 * Products catalogue — full grid with category filter strip,
 * sort modal, and pull-to-refresh.
 */

import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl,
  Pressable,
  TextInput,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import {
  CATEGORIES,
  getByCategory,
  type ProductCategory,
  type Product,
} from '../../../utils/products';
import ProductCard from '../../../components/ProductCard';
import CategoryChip from '../../../components/CategoryChip';
import SkeletonCard from '../../../components/SkeletonCard';
import ScreenHeader from '../../../components/ScreenHeader';
import { theme } from '../../../utils/theme';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating';

export default function ProductsScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const initialCategory = (params.category as ProductCategory) ?? 'all';
  const [category, setCategory] = useState<ProductCategory | 'all'>(initialCategory);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('featured');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo<Product[]>(() => {
    const base = getByCategory(category);
    const q = query.trim().toLowerCase();
    const matched = q
      ? base.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.tagline.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q),
        )
      : base;
    return sortProducts(matched, sort);
  }, [category, query, sort]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      setRefreshing(false);
      setLoading(false);
    }, 600);
  }, []);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScreenHeader title="All treasures" subtitle={`${filtered.length} items`} />

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={theme.colors.textFaint} />
        <TextInput
          placeholder="Search by name or ingredient"
          placeholderTextColor={theme.colors.textFaint}
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {query ? (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={theme.colors.textFaint} />
          </Pressable>
        ) : null}
      </View>

      {/* Category strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        <CategoryChip label="All" emoji="✨" active={category === 'all'} onPress={() => setCategory('all')} />
        {CATEGORIES.map((c) => (
          <CategoryChip
            key={c.id}
            label={c.label}
            emoji={c.emoji}
            active={category === c.id}
            onPress={() => setCategory(c.id)}
          />
        ))}
      </ScrollView>

      {/* Sort bar */}
      <View style={styles.sortBar}>
        {(
          [
            { key: 'featured', label: 'Featured' },
            { key: 'price-asc', label: 'Price ↑' },
            { key: 'price-desc', label: 'Price ↓' },
            { key: 'rating', label: 'Top rated' },
          ] as Array<{ key: SortKey; label: string }>
        ).map((item) => (
          <Pressable
            key={item.key}
            onPress={() => setSort(item.key)}
            style={[styles.sortBtn, sort === item.key && styles.sortBtnActive]}
          >
            <Text style={[styles.sortLabel, sort === item.key && styles.sortLabelActive]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View style={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={styles.gridItem}>
              <SkeletonCard />
            </View>
          ))}
        </View>
      ) : (
        <Animated.View entering={FadeIn} style={{ flex: 1 }}>
          <FlatList
            data={filtered}
            keyExtractor={(p) => p.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.colors.primary}
              />
            }
            renderItem={({ item }) => (
              <View style={styles.gridItem}>
                <ProductCard product={item} />
              </View>
            )}
            ListEmptyComponent={() => (
              <View style={styles.empty}>
                <Ionicons name="search" size={40} color={theme.colors.textFaint} />
                <Text style={styles.emptyTitle}>No matches</Text>
                <Text style={styles.emptyBody}>
                  Try a different search or clear the category filter.
                </Text>
              </View>
            )}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

function sortProducts(list: Product[], key: SortKey): Product[] {
  const copy = [...list];
  switch (key) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'rating':
      return copy.sort((a, b) => b.rating - a.rating);
    case 'featured':
    default:
      return copy.sort(
        (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating,
      );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: theme.colors.text, padding: 0 },
  chipRow: { paddingHorizontal: 16, paddingBottom: 8 },
  sortBar: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  sortBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sortBtnActive: { backgroundColor: theme.colors.gold, borderColor: theme.colors.gold },
  sortLabel: { fontSize: 12, fontWeight: '600', color: theme.colors.textMuted },
  sortLabelActive: { color: '#FFF' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16 },
  gridItem: { width: '48%', marginBottom: 14 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  row: { justifyContent: 'space-between' },

  empty: { alignItems: 'center', padding: 40, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text, marginTop: 8 },
  emptyBody: { color: theme.colors.textMuted, textAlign: 'center' },
});
