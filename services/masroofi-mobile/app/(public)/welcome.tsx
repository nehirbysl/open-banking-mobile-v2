/**
 * Welcome / hero landing screen.
 *
 * Mirrors the web Masroofi Landing page but tuned for a small screen:
 * big headline, four features, "Sign in" + "Create account" CTAs.
 */

import React, { useEffect } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import PrimaryButton from "../../components/PrimaryButton";
import { theme } from "../../utils/theme";

const { width: W } = Dimensions.get("window");

const FEATURES: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
  color: string;
}[] = [
  {
    icon: "pie-chart",
    title: "Spending Insights",
    desc: "See where every rial goes with automatic categories.",
    color: "#6C5CE7",
  },
  {
    icon: "wallet",
    title: "All Accounts",
    desc: "Every Bank Dhofar account, one beautiful view.",
    color: "#00b894",
  },
  {
    icon: "search",
    title: "Smart Search",
    desc: "Find any transaction by merchant, amount or date.",
    color: "#0984e3",
  },
  {
    icon: "shield-checkmark",
    title: "Bank-Grade Security",
    desc: "Secure Open Banking consent. Your data stays at the bank.",
    color: "#e17055",
  },
];

function AnimatedFeature({
  index,
  icon,
  title,
  desc,
  color,
}: {
  index: number;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
  color: string;
}) {
  const appear = useSharedValue(0);
  useEffect(() => {
    appear.value = withDelay(index * 120, withTiming(1, { duration: 420 }));
  }, [index, appear]);

  const style = useAnimatedStyle(() => ({
    opacity: appear.value,
    transform: [{ translateY: (1 - appear.value) * 14 }],
  }));

  return (
    <Animated.View style={[styles.feature, style]}>
      <View style={[styles.featureIcon, { backgroundColor: `${color}22` }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
      </View>
    </Animated.View>
  );
}

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#6C5CE7", "#4834d4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <SafeAreaView edges={["top"]} style={styles.heroInner}>
      {/* BUILD_BADGE_INJECTED — remove once verified on device */}
      <View style={{position:"absolute",top:4,right:8,zIndex:10,backgroundColor:"#F59E0B",paddingHorizontal:8,paddingVertical:3,borderRadius:6}}>
        <Text style={{color:"white",fontSize:10,fontWeight:"700"}}>v2 · 2026-04-16 14:23 Oman</Text>
      </View>
          <View style={styles.pillsRow}>
            <View style={styles.pill}>
              <Ionicons name="sparkles" size={12} color="#fff" />
              <Text style={styles.pillText}>Personal Finance</Text>
            </View>
          </View>
          <Text style={styles.h1}>Masroofi</Text>
          <Text style={styles.h2}>Your money, clearer than ever.</Text>
          <Text style={styles.tagline}>
            Connect your Bank Dhofar accounts securely and finally understand
            where your money goes.
          </Text>

          <View style={styles.statsRow}>
            <StatBubble label="Open Banking" value="CBO" />
            <StatBubble label="Read Only" value="Secure" />
            <StatBubble label="Renewable" value="90 days" />
          </View>
        </SafeAreaView>

        {/* decorative blobs */}
        <View style={[styles.blob, styles.blobA]} />
        <View style={[styles.blob, styles.blobB]} />
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.featureList}>
          {FEATURES.map((f, i) => (
            <AnimatedFeature key={f.title} index={i} {...f} />
          ))}
        </View>

        <View style={styles.ctaBlock}>
          <PrimaryButton
            label="Create account"
            iconRight="arrow-forward"
            onPress={() => router.push("/signup")}
          />
          <Pressable
            onPress={() => router.push("/login")}
            style={styles.secondary}
            hitSlop={10}
          >
            <Text style={styles.secondaryText}>
              Already have an account? <Text style={styles.secondaryLink}>Sign in</Text>
            </Text>
          </Pressable>
        </View>

        <Text style={styles.footnote}>
          Powered by Bank Dhofar Open Banking \u00b7 Compliant with CBO regulations.
        </Text>
      </ScrollView>
    </View>
  );
}

function StatBubble({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBubble}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  hero: {
    paddingBottom: 36,
    overflow: "hidden",
  },
  heroInner: {
    paddingHorizontal: 24,
    paddingTop: 18,
  },
  pillsRow: { flexDirection: "row", marginBottom: 18 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: theme.radii.pill,
  },
  pillText: { color: "#fff", fontSize: 11, fontWeight: "700", letterSpacing: 1 },
  h1: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: -1,
  },
  h2: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
    opacity: 0.95,
  },
  tagline: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
    maxWidth: W - 60,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 22,
  },
  statBubble: {
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radii.md,
    flex: 1,
  },
  statValue: { color: "#fff", fontSize: 14, fontWeight: "800" },
  statLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 2,
  },
  blob: {
    position: "absolute",
    borderRadius: 9999,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  blobA: { width: 220, height: 220, top: -80, right: -80 },
  blobB: { width: 140, height: 140, bottom: -50, left: -50 },
  scroll: { padding: 20, paddingBottom: 40 },
  featureList: { gap: 12, marginTop: 4 },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: 14,
    ...theme.shadow.sm,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  featureDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  ctaBlock: { marginTop: 24, gap: 14 },
  secondary: { alignItems: "center", paddingVertical: 8 },
  secondaryText: { color: theme.colors.textSecondary, fontSize: 14 },
  secondaryLink: { color: theme.colors.primary, fontWeight: "700" },
  footnote: {
    textAlign: "center",
    color: theme.colors.textMuted,
    fontSize: 11,
    marginTop: 22,
  },
});
