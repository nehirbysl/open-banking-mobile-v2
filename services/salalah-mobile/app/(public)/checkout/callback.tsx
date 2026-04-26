import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { getPendingConsentId } from '../../../utils/consent';
import { formatMerchantRef } from '../../../utils/payment';
import { theme } from '../../../utils/theme';

type Phase = 'connecting' | 'authorizing' | 'approved';

export default function CheckoutCallbackScreen() {
  const router = useRouter();
  const { ref, total } = useLocalSearchParams<{ ref?: string; total?: string }>();
  const [phase, setPhase] = useState<Phase>('connecting');

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      await new Promise((r) => setTimeout(r, 1200));
      if (cancelled) return;
      setPhase('authorizing');

      await new Promise((r) => setTimeout(r, 1400));
      if (cancelled) return;
      setPhase('approved');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

      const consentId = await getPendingConsentId();

      await new Promise((r) => setTimeout(r, 1500));
      if (cancelled) return;
      router.replace({
        pathname: '/checkout/success',
        params: { ref: ref || consentId || 'BD-PAY', total: total || '0' },
      });
    };

    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.card}>
        {phase === 'connecting' && (
          <Animated.View entering={FadeIn} style={styles.center}>
            <LinearGradient colors={['#4D9134', '#2E7D32']} style={styles.iconCircle}>
              <Ionicons name="business" size={36} color="#FFF" />
            </LinearGradient>
            <Text style={styles.title}>Connecting to Bank Dhofar</Text>
            <Text style={styles.desc}>Opening secure payment channel...</Text>
            <View style={styles.dots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </Animated.View>
        )}

        {phase === 'authorizing' && (
          <Animated.View entering={FadeInDown} style={styles.center}>
            <LinearGradient colors={['#1565C0', '#0D47A1']} style={styles.iconCircle}>
              <Ionicons name="shield-checkmark" size={36} color="#FFF" />
            </LinearGradient>
            <Text style={styles.title}>Authorizing payment</Text>
            <Text style={styles.desc}>Bank Dhofar is verifying your account...</Text>
            {ref && (
              <Text style={styles.refText}>Ref: {formatMerchantRef(ref)}</Text>
            )}
            <View style={styles.dots}>
              <View style={[styles.dot, styles.dotDone]} />
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
            </View>
          </Animated.View>
        )}

        {phase === 'approved' && (
          <Animated.View entering={FadeInDown} style={styles.center}>
            <LinearGradient colors={['#43A047', '#1B5E20']} style={styles.iconCircle}>
              <Ionicons name="checkmark" size={44} color="#FFF" />
            </LinearGradient>
            <Text style={styles.title}>Payment approved!</Text>
            <Text style={styles.desc}>Bank Dhofar has confirmed your payment.</Text>
            <View style={styles.dots}>
              <View style={[styles.dot, styles.dotDone]} />
              <View style={[styles.dot, styles.dotDone]} />
              <View style={[styles.dot, styles.dotDone]} />
            </View>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.colors.bgCard,
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  center: { alignItems: 'center' },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 14,
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 20,
  },
  refText: {
    fontSize: 12,
    color: theme.colors.textFaint,
    fontFamily: 'monospace',
    marginTop: 8,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.border,
  },
  dotActive: {
    backgroundColor: theme.colors.primary,
  },
  dotDone: {
    backgroundColor: theme.colors.success,
  },
});
