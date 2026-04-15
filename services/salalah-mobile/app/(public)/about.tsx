/**
 * About — brand story, heritage, partnership with Bank Dhofar.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import { theme } from '../../utils/theme';

const FACTS: Array<{ icon: any; label: string; value: string }> = [
  { icon: 'leaf-outline', label: 'Artisans', value: '60+' },
  { icon: 'map-outline', label: 'Regions', value: 'Dhofar · Muscat · Nizwa' },
  { icon: 'trophy-outline', label: 'UNESCO', value: 'Land of Frankincense' },
  { icon: 'globe-outline', label: 'Shipping', value: 'Worldwide' },
];

const PILLARS: Array<{ icon: any; title: string; body: string }> = [
  {
    icon: 'hand-left-outline',
    title: 'Fair trade, always',
    body: 'Every purchase pays the artisan directly. No middlemen, no commission skimming.',
  },
  {
    icon: 'leaf-outline',
    title: 'Wild, not farmed',
    body: 'Our resins, honey, and rosewater come from wild-harvested sources tended by families for generations.',
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Bank Dhofar trust',
    body: 'Secure payments via Bank Dhofar Sadad — no card data leaves your device, and every order is protected under PSD2-style SCA.',
  },
];

export default function AboutScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScreenHeader title="Our story" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInDown}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryDark]}
            style={styles.hero}
          >
            <Text style={styles.heroEyebrow}>Salalah Souq</Text>
            <Text style={styles.heroTitle}>A living marketplace{"\n"}of the Land of Frankincense</Text>
            <Text style={styles.heroBody}>
              Born in the souqs of Salalah, carried on the old caravan routes, brought to your door by Bank Dhofar.
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Facts grid */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.factsRow}>
          {FACTS.map((f) => (
            <View key={f.label} style={styles.fact}>
              <Ionicons name={f.icon} size={22} color={theme.colors.primary} />
              <Text style={styles.factValue}>{f.value}</Text>
              <Text style={styles.factLabel}>{f.label}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150)} style={styles.storyBlock}>
          <Text style={styles.h2}>Where it began</Text>
          <Text style={styles.body}>
            For over 3,000 years the mountains of Dhofar have produced the world's finest frankincense. The old souq of Salalah — where Bedouin traders still meet coastal merchants — has been the meeting point for silver, dates, honey, and fragrance. Salalah Souq brings that souq to your phone, one curated piece at a time.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.storyBlock}>
          <Text style={styles.h2}>What we stand for</Text>
          {PILLARS.map((p) => (
            <View key={p.title} style={styles.pillar}>
              <View style={styles.pillarIcon}>
                <Ionicons name={p.icon} size={20} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pillarTitle}>{p.title}</Text>
                <Text style={styles.pillarBody}>{p.body}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(260)} style={styles.partnership}>
          <Ionicons name="business" size={24} color={theme.colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.partnershipTitle}>In partnership with Bank Dhofar</Text>
            <Text style={styles.partnershipBody}>
              Salalah Souq is built on Bank Dhofar's open-banking APIs. Paying through the BD Online flow means we never see your card details — you authorise the amount directly in your bank.
            </Text>
          </View>
        </Animated.View>

        <Text style={styles.footer}>© {new Date().getFullYear()} Salalah Souq · All rights reserved</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  scroll: { paddingBottom: 40 },
  hero: {
    padding: 24,
    margin: 16,
    borderRadius: theme.radius.xl,
  },
  heroEyebrow: {
    color: '#FFE4CC',
    fontWeight: '700',
    letterSpacing: 1.5,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 10,
    lineHeight: 30,
  },
  heroBody: { color: '#FFE4CC', marginTop: 8, lineHeight: 20, fontSize: 13 },

  factsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
    gap: 12,
    marginBottom: 8,
  },
  fact: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.md,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  factValue: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 6,
    textAlign: 'center',
  },
  factLabel: { fontSize: 11, color: theme.colors.textMuted, marginTop: 2 },

  storyBlock: { paddingHorizontal: 20, marginTop: 18 },
  h2: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginBottom: 10 },
  body: { fontSize: 14, color: theme.colors.textMuted, lineHeight: 22 },

  pillar: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 10,
  },
  pillarIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarTitle: { fontSize: 14, fontWeight: '800', color: theme.colors.text },
  pillarBody: { fontSize: 12, color: theme.colors.textMuted, lineHeight: 18, marginTop: 2 },

  partnership: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: theme.colors.bgMuted,
    margin: 16,
    padding: 16,
    borderRadius: theme.radius.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  partnershipTitle: { fontWeight: '800', color: theme.colors.text, fontSize: 14 },
  partnershipBody: { color: theme.colors.textMuted, fontSize: 12, marginTop: 4, lineHeight: 18 },

  footer: { textAlign: 'center', color: theme.colors.textFaint, fontSize: 11, marginTop: 20 },
});
