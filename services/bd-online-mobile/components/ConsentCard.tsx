/**
 * ConsentCard — preview card for a consent in a list.
 */

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { colors, radius, shadow, spacing } from "../utils/theme";
import { formatDate } from "../utils/format";
import {
  CONSENT_TYPE_LABEL,
  STATUS_COLOR,
  STATUS_LABEL,
} from "../utils/permissions";
import Badge from "./Badge";
import type { Consent } from "../utils/api";

interface ConsentCardProps {
  consent: Consent;
  tppName?: string;
  onPress?: () => void;
}

export default function ConsentCard({ consent, tppName, onPress }: ConsentCardProps) {
  const handlePress = () => {
    if (!onPress) return;
    Haptics.selectionAsync().catch(() => undefined);
    onPress();
  };
  const statusColor = STATUS_COLOR[consent.status] || colors.textMuted;
  const statusLabel = STATUS_LABEL[consent.status] || consent.status;
  const typeLabel = CONSENT_TYPE_LABEL[consent.consent_type] || consent.consent_type;

  return (
    <Pressable
      onPress={handlePress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && onPress ? { opacity: 0.85 } : undefined,
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <Ionicons name="business-outline" size={20} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.tpp} numberOfLines={1}>
            {tppName || consent.tpp_id}
          </Text>
          <Text style={styles.type}>{typeLabel}</Text>
        </View>
        <Badge label={statusLabel} color={statusColor} variant="soft" />
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Created</Text>
          <Text style={styles.metaValue}>{formatDate(consent.creation_time)}</Text>
        </View>
        {consent.expiration_time && (
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Expires</Text>
            <Text style={styles.metaValue}>{formatDate(consent.expiration_time)}</Text>
          </View>
        )}
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Permissions</Text>
          <Text style={styles.metaValue}>{consent.permissions.length}</Text>
        </View>
      </View>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  flex: { flex: 1 },
  tpp: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  type: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    gap: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    color: colors.textFaint,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },
});
