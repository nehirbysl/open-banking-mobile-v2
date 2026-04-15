/**
 * Compact account summary card for the dashboard.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import type { OBAccount, OBBalance } from "../utils/api";
import { formatAmount } from "../utils/format";
import { theme } from "../utils/theme";

interface Props {
  account: OBAccount;
  balance?: OBBalance;
}

export default function AccountCard({ account, balance }: Props) {
  const currency = balance?.Amount?.Currency || account.Currency || "OMR";
  const amount = balance ? parseFloat(balance.Amount.Amount) : 0;
  const isCredit = balance?.CreditDebitIndicator !== "Debit";

  const name =
    account.Nickname ||
    account.Account?.[0]?.Name ||
    `${account.AccountSubType || "Account"}`;
  const identifier = account.Account?.[0]?.Identification || account.AccountId;
  const masked = identifier.length > 4 ? `\u2022\u2022\u2022\u2022 ${identifier.slice(-4)}` : identifier;

  return (
    <LinearGradient
      colors={["#6C5CE7", "#4834d4"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.wrap}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.nickname} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.subtype}>{account.AccountSubType || account.AccountType}</Text>
        </View>
        <View style={styles.logo}>
          <Ionicons name="card" size={18} color="#fff" />
        </View>
      </View>

      <Text style={styles.balanceLabel}>Available Balance</Text>
      <Text style={styles.balance}>
        {isCredit ? "" : "-"}
        {formatAmount(Math.abs(amount), currency)}
      </Text>

      <Text style={styles.account}>{masked}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: theme.radii.lg,
    padding: 18,
    minHeight: 150,
    justifyContent: "space-between",
    ...theme.shadow.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  nickname: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  subtype: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    marginTop: 2,
    textTransform: "capitalize",
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  balanceLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 14,
  },
  balance: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 4,
    fontVariant: ["tabular-nums"],
  },
  account: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginTop: 8,
    letterSpacing: 2,
    fontVariant: ["tabular-nums"],
  },
});
