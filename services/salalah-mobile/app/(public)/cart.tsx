/**
 * Cart screen — line items with quantity steppers, animated subtotal,
 * empty state, and checkout CTA.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import Animated, {
  FadeIn,
  Layout,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useCart, computeTotals, type CartLine } from '../../utils/cart';
import { formatOMR } from '../../utils/format';
import { theme } from '../../utils/theme';
import ProductArtwork from '../../components/ProductArtwork';
import ScreenHeader from '../../components/ScreenHeader';
import PrimaryButton from '../../components/PrimaryButton';

export default function CartScreen() {
  const router = useRouter();
  const lines = useCart((s) => s.lines);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);

  const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.price, 0);
  const totals = computeTotals(subtotal);

  if (lines.length === 0) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <ScreenHeader title="Your cart" showCart={false} />
        <View style={styles.empty}>
          <Ionicons name="bag-outline" size={54} color={theme.colors.textFaint} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyBody}>
            Add some Omani treasures and come back here to check out.
          </Text>
          <PrimaryButton
            title="Browse the souq"
            icon="storefront-outline"
            onPress={() => router.replace('/store')}
            style={{ marginTop: 20 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScreenHeader title="Your cart" subtitle={`${lines.length} items`} showCart={false} />

      <FlatList
        data={lines}
        keyExtractor={(l) => l.productId}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <CartLineRow
            line={item}
            onDec={() => {
              Haptics.selectionAsync().catch(() => {});
              setQuantity(item.productId, item.quantity - 1);
            }}
            onInc={() => {
              Haptics.selectionAsync().catch(() => {});
              setQuantity(item.productId, item.quantity + 1);
            }}
            onRemove={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
              remove(item.productId);
            }}
          />
        )}
        ListFooterComponent={
          <View style={{ marginTop: 20 }}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
                clear();
              }}
              style={styles.clearBtn}
            >
              <Ionicons name="trash-outline" size={16} color={theme.colors.danger} />
              <Text style={styles.clearText}>Clear cart</Text>
            </Pressable>
          </View>
        }
      />

      <Animated.View entering={FadeIn} style={styles.summary}>
        <Row label="Subtotal" value={formatOMR(totals.subtotal)} />
        <Row label="Shipping" value={formatOMR(totals.shipping)} />
        <Row label="VAT (5%)" value={formatOMR(totals.vat)} />
        <View style={styles.summaryDivider} />
        <Row label="Total" value={formatOMR(totals.total)} bold />
        <PrimaryButton
          title="Proceed to checkout"
          icon="arrow-forward"
          onPress={() => router.push('/checkout')}
          style={{ marginTop: 14 }}
          testID="checkout-btn"
        />
      </Animated.View>
    </SafeAreaView>
  );
}

function CartLineRow({
  line,
  onDec,
  onInc,
  onRemove,
}: {
  line: CartLine;
  onDec: () => void;
  onInc: () => void;
  onRemove: () => void;
}) {
  return (
    <Animated.View
      entering={SlideInRight.springify()}
      exiting={SlideOutLeft.duration(250)}
      layout={Layout.springify()}
      style={styles.row}
    >
      <View style={styles.artWrap}>
        <ProductArtwork kind={line.kind} size={70} />
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowName} numberOfLines={2}>
          {line.name}
        </Text>
        <Text style={styles.rowPrice}>{formatOMR(line.price)}</Text>
        <View style={styles.rowFooter}>
          <View style={styles.qty}>
            <Pressable onPress={onDec} style={styles.qtyBtn} hitSlop={8}>
              <Ionicons
                name={line.quantity === 1 ? 'trash-outline' : 'remove'}
                size={16}
                color={theme.colors.primary}
              />
            </Pressable>
            <Text style={styles.qtyValue}>{line.quantity}</Text>
            <Pressable onPress={onInc} style={styles.qtyBtn} hitSlop={8}>
              <Ionicons name="add" size={16} color={theme.colors.primary} />
            </Pressable>
          </View>
          <Text style={styles.rowLineTotal}>
            {formatOMR(line.quantity * line.price)}
          </Text>
        </View>
      </View>
      <Pressable onPress={onRemove} hitSlop={8} style={styles.removeBtn}>
        <Ionicons name="close" size={18} color={theme.colors.textFaint} />
      </Pressable>
    </Animated.View>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, bold && styles.summaryLabelBold]}>{label}</Text>
      <Text style={[styles.summaryValue, bold && styles.summaryValueBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  list: { padding: 16 },
  row: {
    flexDirection: 'row',
    backgroundColor: theme.colors.bgCard,
    padding: 12,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  artWrap: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: { flex: 1, gap: 4 },
  rowName: { fontSize: 14, fontWeight: '700', color: theme.colors.text },
  rowPrice: { fontSize: 12, color: theme.colors.textMuted },
  rowFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  qty: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.round,
    paddingHorizontal: 4,
  },
  qtyBtn: { padding: 6 },
  qtyValue: {
    minWidth: 20,
    textAlign: 'center',
    fontWeight: '800',
    color: theme.colors.text,
  },
  rowLineTotal: { fontWeight: '800', color: theme.colors.primary },
  removeBtn: { padding: 4 },

  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    padding: 10,
  },
  clearText: { color: theme.colors.danger, fontWeight: '700' },

  summary: {
    padding: 20,
    paddingBottom: 28,
    backgroundColor: theme.colors.bgCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 6,
    gap: 2,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  summaryLabel: { color: theme.colors.textMuted, fontSize: 14 },
  summaryLabelBold: { color: theme.colors.text, fontWeight: '800', fontSize: 16 },
  summaryValue: { color: theme.colors.text, fontWeight: '600' },
  summaryValueBold: { color: theme.colors.primary, fontWeight: '800', fontSize: 18 },
  summaryDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 8,
  },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginTop: 16 },
  emptyBody: { color: theme.colors.textMuted, textAlign: 'center' },
});
