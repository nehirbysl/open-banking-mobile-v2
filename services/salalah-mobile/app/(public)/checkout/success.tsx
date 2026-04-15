/**
 * Checkout success — confetti, receipt card, and path back to the store.
 *
 * The cart is cleared on mount (payment succeeded; the items have shipped into the order).
 */

import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCart } from '../../../utils/cart';
import { formatOMR } from '../../../utils/format';
import { formatMerchantRef } from '../../../utils/payment';
import { theme } from '../../../utils/theme';
import Confetti from '../../../components/Confetti';
import PrimaryButton from '../../../components/PrimaryButton';

export default function CheckoutSuccessScreen() {
  const router = useRouter();
  const { ref, total } = useLocalSearchParams<{ ref?: string; total?: string }>();
  const clear = useCart((s) => s.clear);

  // Clear cart exactly once on successful landing
  useEffect(() => {
    clear();
  }, [clear]);

  const amount = total ? parseFloat(total) : 0;
  const receiptRef = useMemo(() => formatMerchantRef(ref || 'SLH-XXXX-XXXX'), [ref]);

  // Subtle pulse for the check icon
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.12, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [pulse]);
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <Confetti count={45} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.headerWrap}>
          <Animated.View style={[styles.checkWrap, pulseStyle]}>
            <LinearGradient
              colors={['#43A047', '#1B5E20']}
              style={styles.checkCircle}
            >
              <Ionicons name="checkmark" size={54} color="#FFF" />
            </LinearGradient>
          </Animated.View>
          <Text style={styles.title}>Thank you!</Text>
          <Text style={styles.subtitle}>
            Your Bank Dhofar payment was approved and your Omani treasures are on their way.
          </Text>
        </Animated.View>

        {/* Receipt card */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.receipt}>
          <View style={styles.receiptHeader}>
            <Ionicons name="receipt" size={22} color={theme.colors.primary} />
            <Text style={styles.receiptTitle}>Receipt</Text>
          </View>

          <Row label="Merchant reference" value={receiptRef} />
          <Row label="Paid via" value="Bank Dhofar Sadad" />
          <Row label="Status" value="APPROVED" highlight />
          <Row label="Date" value={new Date().toLocaleString('en-GB')} />
          <View style={styles.divider} />
          <Row label="Total" value={formatOMR(amount)} bold />

          <View style={styles.dashedDivider} />
          <View style={styles.footerRow}>
            <Ionicons name="shield-checkmark" size={14} color={theme.colors.success} />
            <Text style={styles.footerText}>
              Transaction protected under BD Open Banking PSP-SCA
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500)} style={styles.next}>
          <Text style={styles.nextTitle}>What happens next</Text>
          <StepRow icon="mail-outline" text="We've emailed a confirmation to you" />
          <StepRow icon="cube-outline" text="Artisans will pack your order within 24h" />
          <StepRow icon="airplane-outline" text="Shipped via Oman Post · tracking within 48h" />
        </Animated.View>

        <View style={styles.ctas}>
          <PrimaryButton
            title="Back to souq"
            icon="storefront-outline"
            onPress={() => router.replace('/store')}
            fullWidth
            testID="success-home"
          />
          <PrimaryButton
            title="Browse more products"
            icon="grid-outline"
            variant="outline"
            onPress={() => router.replace('/products')}
            fullWidth
            style={{ marginTop: 10 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text
        style={[
          styles.rowValue,
          bold && styles.rowValueBold,
          highlight && styles.rowValueHighlight,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function StepRow({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepIcon}>
        <Ionicons name={icon} size={16} color={theme.colors.primary} />
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  scroll: { padding: 20, paddingBottom: 40 },
  headerWrap: { alignItems: 'center', marginTop: 30 },
  checkWrap: { marginBottom: 20 },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2E7D32',
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    marginHorizontal: 20,
    lineHeight: 20,
  },

  receipt: {
    marginTop: 30,
    padding: 20,
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  receiptHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  receiptTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rowLabel: { color: theme.colors.textMuted, fontSize: 13 },
  rowValue: { color: theme.colors.text, fontSize: 13, fontWeight: '700' },
  rowValueBold: { color: theme.colors.primary, fontSize: 18, fontWeight: '800' },
  rowValueHighlight: { color: theme.colors.success, fontWeight: '800' },
  divider: { height: 1, backgroundColor: theme.colors.border, marginVertical: 8 },
  dashedDivider: {
    marginTop: 14,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
    paddingTop: 10,
  },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerText: { flex: 1, color: theme.colors.textMuted, fontSize: 11 },

  next: { marginTop: 20 },
  nextTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 10,
    letterSpacing: 0.4,
  },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: { flex: 1, color: theme.colors.textMuted, fontSize: 13 },

  ctas: { marginTop: 24 },
});
