/**
 * A single transaction row — merchant icon, description, amount, status pill.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StatusPill from "./StatusPill";
import { colors, radius, spacing } from "../utils/theme";
import { formatOMR, formatTime, initials } from "../utils/analytics";
import type { OBTransaction } from "../utils/api";

interface Props {
  transaction: OBTransaction;
  showStatus?: boolean;
}

export default function TransactionRow({ transaction, showStatus = true }: Props) {
  const isCredit = transaction.CreditDebitIndicator === "Credit";
  const merchant =
    transaction.MerchantDetails?.MerchantName ||
    transaction.TransactionInformation ||
    "Transaction";
  const amount = parseFloat(transaction.Amount.Amount);
  const signed = `${isCredit ? "+" : "-"}${formatOMR(amount, transaction.Amount.Currency)}`;
  const color = isCredit ? colors.credit : colors.debit;
  const bg = isCredit ? colors.successBg : "#FDECE6";

  return (
    <View style={styles.row}>
      <View style={[styles.avatar, { backgroundColor: bg }]}>
        {isCredit ? (
          <Ionicons name="arrow-down" size={16} color={color} />
        ) : (
          <Text style={[styles.avatarText, { color }]}>{initials(merchant)}</Text>
        )}
      </View>

      <View style={styles.center}>
        <Text style={styles.name} numberOfLines={1}>
          {merchant}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{formatTime(transaction.BookingDateTime)}</Text>
          {showStatus && (
            <>
              <Text style={styles.dot}>•</Text>
              <StatusPill status={transaction.Status} />
            </>
          )}
        </View>
      </View>

      <Text style={[styles.amount, { color }]} numberOfLines={1}>
        {signed}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 13, fontWeight: "700" },
  center: { flex: 1, minWidth: 0 },
  name: { fontSize: 15, fontWeight: "600", color: colors.text },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 2, gap: 6 },
  meta: { fontSize: 12, color: colors.textMuted },
  dot: { color: colors.textMuted, fontSize: 12 },
  amount: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
    fontVariant: ["tabular-nums" as const],
  },
});
