/**
 * AccountPicker — multi-select list of accounts for consent authorisation.
 */

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { colors, radius, spacing } from "../utils/theme";
import { formatBalance, maskIban } from "../utils/format";
import type { BankAccount } from "../utils/api";

interface AccountPickerProps {
  accounts: BankAccount[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  multiple?: boolean;
}

export default function AccountPicker({
  accounts,
  selectedIds,
  onChange,
  multiple = true,
}: AccountPickerProps) {
  const toggle = (id: string) => {
    Haptics.selectionAsync().catch(() => undefined);
    if (multiple) {
      onChange(
        selectedIds.includes(id)
          ? selectedIds.filter((x) => x !== id)
          : [...selectedIds, id],
      );
    } else {
      onChange([id]);
    }
  };

  return (
    <View style={styles.root}>
      {accounts.map((a) => {
        const selected = selectedIds.includes(a.accountId);
        return (
          <Pressable
            key={a.accountId}
            onPress={() => toggle(a.accountId)}
            style={[styles.row, selected && styles.rowSelected]}
          >
            <View style={[styles.checkbox, selected && styles.checkboxOn]}>
              {selected && <Ionicons name="checkmark" size={14} color={colors.white} />}
            </View>
            <View style={styles.flex}>
              <Text style={styles.name}>{a.description}</Text>
              <Text style={styles.iban}>{maskIban(a.iban)}</Text>
            </View>
            <Text style={styles.balance}>
              {formatBalance(a.balance, a.currency)}
            </Text>
          </Pressable>
        );
      })}
      {accounts.length === 0 && (
        <Text style={styles.empty}>No accounts available.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.sm },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  rowSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  checkboxOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  flex: { flex: 1 },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  iban: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    fontFamily: "Courier",
  },
  balance: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  empty: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    paddingVertical: spacing.lg,
  },
});
