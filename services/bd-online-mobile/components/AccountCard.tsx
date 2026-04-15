/**
 * AccountCard — visual representation of a bank account with balance.
 * Tappable. Shows account type icon, masked IBAN, balance, optional sparkline.
 */

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radius, shadow, spacing } from "../utils/theme";
import { formatBalance, maskIban } from "../utils/format";
import type { BankAccount } from "../utils/api";
import Sparkline from "./Sparkline";

interface AccountCardProps {
  account: BankAccount;
  onPress?: () => void;
  variant?: "default" | "compact" | "premium";
  trend?: number[];
}

const ACCOUNT_ICON: Record<BankAccount["type"], keyof typeof Ionicons.glyphMap> = {
  CurrentAccount: "wallet-outline",
  SavingsAccount: "trending-up-outline",
  BusinessAccount: "briefcase-outline",
};

const ACCOUNT_LABEL: Record<BankAccount["type"], string> = {
  CurrentAccount: "Current",
  SavingsAccount: "Savings",
  BusinessAccount: "Business",
};

export default function AccountCard({
  account,
  onPress,
  variant = "default",
  trend,
}: AccountCardProps) {
  const handlePress = () => {
    if (!onPress) return;
    Haptics.selectionAsync().catch(() => undefined);
    onPress();
  };

  if (variant === "premium") {
    return (
      <Pressable onPress={handlePress} disabled={!onPress}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.premium, shadow.hero]}
        >
          <View style={styles.premiumHeader}>
            <View>
              <Text style={styles.premiumLabel}>{ACCOUNT_LABEL[account.type]}</Text>
              <Text style={styles.premiumDesc}>{account.description}</Text>
            </View>
            <View style={styles.premiumIcon}>
              <Ionicons
                name={ACCOUNT_ICON[account.type]}
                size={20}
                color={colors.white}
              />
            </View>
          </View>
          <Text style={styles.premiumBalance}>
            {formatBalance(account.balance, account.currency)}
          </Text>
          <Text style={styles.premiumIban}>{maskIban(account.iban)}</Text>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.card,
        variant === "compact" && styles.cardCompact,
        pressed && onPress ? { opacity: 0.85 } : undefined,
      ]}
    >
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Ionicons
            name={ACCOUNT_ICON[account.type]}
            size={20}
            color={colors.primary}
          />
        </View>
        <View style={styles.flex}>
          <Text style={styles.title} numberOfLines={1}>
            {account.description}
          </Text>
          <Text style={styles.iban}>{maskIban(account.iban)}</Text>
        </View>
        <View style={styles.balanceCol}>
          <Text style={styles.balance}>
            {formatBalance(account.balance, account.currency)}
          </Text>
          <Text style={styles.balanceLabel}>{ACCOUNT_LABEL[account.type]}</Text>
        </View>
      </View>
      {trend && trend.length > 1 && (
        <View style={styles.trend}>
          <Sparkline data={trend} width={140} height={32} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  cardCompact: {
    padding: spacing.md,
    ...shadow.card,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  flex: { flex: 1 },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  iban: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    fontFamily: "Courier",
  },
  balanceCol: {
    alignItems: "flex-end",
  },
  balance: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  balanceLabel: {
    fontSize: 11,
    color: colors.textFaint,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  trend: {
    marginTop: spacing.md,
    alignItems: "flex-end",
  },
  premium: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    overflow: "hidden",
  },
  premiumHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.lg,
  },
  premiumLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  premiumDesc: {
    fontSize: 16,
    color: colors.white,
    fontWeight: "700",
    marginTop: 2,
  },
  premiumIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  premiumBalance: {
    fontSize: 26,
    color: colors.white,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  premiumIban: {
    fontSize: 13,
    color: "rgba(255,255,255,0.78)",
    marginTop: spacing.sm,
    fontFamily: "Courier",
  },
});
