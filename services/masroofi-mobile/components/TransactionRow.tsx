/**
 * Single transaction row with category icon, merchant initials + amount.
 * Wrapped in a staggered fade-in animation for list mount transitions.
 */

import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import type { OBTransaction } from "../utils/api";
import { categorizeTransaction } from "../utils/categories";
import { formatAmount, formatDateShort, initials } from "../utils/format";
import { theme } from "../utils/theme";

interface Props {
  transaction: OBTransaction;
  index?: number;
  onPress?: () => void;
}

export default function TransactionRow({ transaction, index = 0, onPress }: Props) {
  const appear = useSharedValue(0);
  useEffect(() => {
    appear.value = withDelay(
      Math.min(index, 12) * 45,
      withTiming(1, { duration: 320 }),
    );
  }, [index, appear]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: appear.value,
    transform: [{ translateY: (1 - appear.value) * 12 }],
  }));

  const category = categorizeTransaction(transaction.TransactionInformation);
  const isDebit = transaction.CreditDebitIndicator === "Debit";
  const amount = parseFloat(transaction.Amount.Amount);
  const currency = transaction.Amount.Currency || "OMR";

  const merchantName =
    transaction.MerchantDetails?.MerchantName ||
    transaction.TransactionInformation ||
    "Unknown";

  const Container: any = onPress ? Pressable : View;

  return (
    <Animated.View style={animatedStyle}>
      <Container
        onPress={onPress}
        style={({ pressed }: { pressed?: boolean }) => [
          styles.row,
          pressed && { backgroundColor: theme.colors.surfaceMuted },
        ]}
      >
        <View
          style={[
            styles.avatar,
            { backgroundColor: `${category.color}22`, borderColor: `${category.color}55` },
          ]}
        >
          <Ionicons
            name={category.icon as keyof typeof Ionicons.glyphMap}
            size={18}
            color={category.color}
          />
        </View>

        <View style={styles.body}>
          <Text style={styles.merchant} numberOfLines={1}>
            {merchantName}
          </Text>
          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: `${category.color}18` }]}>
              <Text style={[styles.badgeText, { color: category.color }]}>
                {category.name}
              </Text>
            </View>
            <Text style={styles.date}>
              {formatDateShort(transaction.BookingDateTime)}
            </Text>
          </View>
        </View>

        <View style={styles.amountWrap}>
          <Text
            style={[
              styles.amount,
              { color: isDebit ? theme.colors.textPrimary : theme.colors.income },
            ]}
          >
            {isDebit ? "-" : "+"}
            {formatAmount(amount, currency)}
          </Text>
          {merchantName && merchantName !== "Unknown" ? (
            <Text style={styles.initials}>{initials(merchantName)}</Text>
          ) : null}
        </View>
      </Container>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  merchant: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radii.pill,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  date: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  amountWrap: {
    alignItems: "flex-end",
    marginLeft: 10,
  },
  amount: {
    fontSize: 14,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  initials: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
    fontVariant: ["tabular-nums"],
  },
});
