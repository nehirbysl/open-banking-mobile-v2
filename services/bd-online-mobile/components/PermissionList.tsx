/**
 * PermissionList — grouped, human-readable display of OAuth permissions.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "../utils/theme";
import { PERMISSION_GROUPS, describePermission } from "../utils/permissions";

interface PermissionListProps {
  permissions: string[];
}

export default function PermissionList({ permissions }: PermissionListProps) {
  // Group known perms; collect unknown into "Other"
  const groups: Array<{ label: string; perms: string[] }> = [];
  const seen = new Set<string>();
  for (const [, group] of Object.entries(PERMISSION_GROUPS)) {
    const intersect = group.perms.filter((p) => permissions.includes(p));
    if (intersect.length > 0) {
      groups.push({ label: group.label, perms: intersect });
      intersect.forEach((p) => seen.add(p));
    }
  }
  const other = permissions.filter((p) => !seen.has(p));
  if (other.length) groups.push({ label: "Other", perms: other });

  return (
    <View style={styles.root}>
      {groups.map((g) => (
        <View key={g.label} style={styles.group}>
          <Text style={styles.groupTitle}>{g.label}</Text>
          {g.perms.map((p) => (
            <View key={p} style={styles.row}>
              <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
              <Text style={styles.label}>{describePermission(p)}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.lg },
  group: {
    backgroundColor: colors.surfaceMuted,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: 4,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
});
