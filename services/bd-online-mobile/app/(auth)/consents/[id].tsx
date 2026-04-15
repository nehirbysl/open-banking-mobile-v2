/**
 * Consent detail — full view of one consent with revoke action.
 */

import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import {
  getConsent,
  getConsentHistory,
  getTPP,
  revokeConsent,
  type Consent,
  type ConsentHistoryEntry,
  type TPP,
} from "../../../utils/api";
import { colors, radius, shadow, spacing } from "../../../utils/theme";
import { formatDateTime } from "../../../utils/format";
import {
  CONSENT_TYPE_LABEL,
  STATUS_COLOR,
  STATUS_LABEL,
} from "../../../utils/permissions";
import Card from "../../../components/Card";
import Badge from "../../../components/Badge";
import PermissionList from "../../../components/PermissionList";
import PrimaryButton from "../../../components/PrimaryButton";
import Skeleton from "../../../components/Skeleton";

export default function ConsentDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [consent, setConsent] = useState<Consent | null>(null);
  const [tpp, setTpp] = useState<TPP | null>(null);
  const [history, setHistory] = useState<ConsentHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [revokeReason, setRevokeReason] = useState("");
  const [revoking, setRevoking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const c = await getConsent(id);
      setConsent(c);
      const [t, h] = await Promise.all([getTPP(c.tpp_id), getConsentHistory(id)]);
      setTpp(t);
      setHistory(h);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load consent");
    }
  }, [id]);

  useEffect(() => {
    (async () => {
      await load();
      setLoading(false);
    })();
  }, [load]);

  const handleRevoke = async () => {
    if (!id) return;
    setRevoking(true);
    try {
      const updated = await revokeConsent(id, revokeReason || "Customer revoked");
      setConsent(updated);
      setRevokeOpen(false);
      setRevokeReason("");
      await load();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => undefined,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to revoke");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
        () => undefined,
      );
    } finally {
      setRevoking(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + spacing.md, padding: spacing.lg }]}>
        <Skeleton height={64} borderRadius={radius.xl} />
        <View style={{ height: spacing.lg }} />
        <Skeleton height={120} borderRadius={radius.lg} />
        <View style={{ height: spacing.md }} />
        <Skeleton height={200} borderRadius={radius.lg} />
      </View>
    );
  }

  if (!consent) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + spacing.md, padding: spacing.lg }]}>
        <View style={styles.errorCard}>
          <Ionicons name="alert-circle-outline" size={32} color={colors.danger} />
          <Text style={styles.errorText}>{error || "Consent not found."}</Text>
          <PrimaryButton label="Back to Consents" onPress={() => router.back()} variant="outline" />
        </View>
      </View>
    );
  }

  const tppName = tpp?.tpp_name || consent.tpp_id;
  const statusColor = STATUS_COLOR[consent.status] || colors.textMuted;
  const statusLabel = STATUS_LABEL[consent.status] || consent.status;
  const typeLabel = CONSENT_TYPE_LABEL[consent.consent_type] || consent.consent_type;
  const canRevoke = consent.status === "Authorised";

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md }]}
    >
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Consent</Text>
        <View style={{ width: 38 }} />
      </View>

      <Card>
        <View style={styles.tppRow}>
          <View style={styles.tppIcon}>
            <Ionicons name="business" size={22} color={colors.primary} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.tppName}>{tppName}</Text>
            <Text style={styles.tppMeta}>{typeLabel}</Text>
          </View>
          <Badge label={statusLabel} color={statusColor} variant="soft" size="md" />
        </View>
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <Text style={styles.sectionTitle}>Timeline</Text>
        <DataRow label="Created" value={formatDateTime(consent.creation_time)} />
        {consent.authorization_time && (
          <DataRow label="Authorized" value={formatDateTime(consent.authorization_time)} />
        )}
        {consent.expiration_time && (
          <DataRow label="Expires" value={formatDateTime(consent.expiration_time)} />
        )}
        {consent.revocation_time && (
          <DataRow
            label="Revoked"
            value={formatDateTime(consent.revocation_time)}
            valueColor={colors.danger}
          />
        )}
        {consent.revocation_reason && (
          <DataRow label="Reason" value={consent.revocation_reason} />
        )}
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <Text style={styles.sectionTitle}>Permissions</Text>
        <View style={{ marginTop: spacing.sm }}>
          <PermissionList permissions={consent.permissions} />
        </View>
      </Card>

      {consent.selected_accounts && consent.selected_accounts.length > 0 && (
        <Card style={{ marginTop: spacing.md }}>
          <Text style={styles.sectionTitle}>Shared Accounts</Text>
          <View style={{ marginTop: spacing.sm, gap: 6 }}>
            {consent.selected_accounts.map((acc) => (
              <View key={acc} style={styles.accChip}>
                <Ionicons name="wallet-outline" size={14} color={colors.textMuted} />
                <Text style={styles.accChipText}>{acc}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      <Card style={{ marginTop: spacing.md }}>
        <Text style={styles.sectionTitle}>Consent ID</Text>
        <Text style={styles.consentId} selectable>
          {consent.consent_id}
        </Text>
      </Card>

      {history.length > 0 && (
        <Card style={{ marginTop: spacing.md }}>
          <Text style={styles.sectionTitle}>Audit Log</Text>
          <View style={{ marginTop: spacing.sm }}>
            {history.map((h) => (
              <View key={h.id} style={styles.auditRow}>
                <View style={styles.auditDot} />
                <View style={styles.flex}>
                  <Text style={styles.auditTitle}>
                    {h.event_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Text>
                  <Text style={styles.auditTime}>{formatDateTime(h.event_time)}</Text>
                  {h.previous_status && h.new_status && (
                    <Text style={styles.auditDelta}>
                      {h.previous_status} → {h.new_status}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </Card>
      )}

      {canRevoke && (
        <PrimaryButton
          label="Revoke Access"
          onPress={() => setRevokeOpen(true)}
          variant="danger"
          size="lg"
          fullWidth
          leftIcon={<Ionicons name="shield-half-outline" size={18} color={colors.white} />}
          style={{ marginTop: spacing.xl }}
        />
      )}

      <View style={{ height: spacing.xl }} />

      <Modal
        visible={revokeOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setRevokeOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconCircle}>
              <Ionicons name="warning" size={28} color={colors.danger} />
            </View>
            <Text style={styles.modalTitle}>Revoke Access?</Text>
            <Text style={styles.modalText}>
              {tppName} will immediately lose access to your accounts. This can't be undone.
            </Text>
            <TextInput
              placeholder="Reason (optional)"
              placeholderTextColor={colors.textFaint}
              value={revokeReason}
              onChangeText={setRevokeReason}
              style={styles.modalInput}
              multiline
            />
            <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.md }}>
              <View style={styles.flex}>
                <PrimaryButton
                  label="Cancel"
                  onPress={() => setRevokeOpen(false)}
                  variant="outline"
                  fullWidth
                />
              </View>
              <View style={styles.flex}>
                <PrimaryButton
                  label="Revoke"
                  onPress={handleRevoke}
                  loading={revoking}
                  variant="danger"
                  fullWidth
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function DataRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.dataRow}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={[styles.dataValue, valueColor ? { color: valueColor } : undefined]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  flex: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.card,
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: colors.text },
  tppRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  tppIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  tppName: { fontSize: 17, fontWeight: "700", color: colors.text },
  tppMeta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  dataLabel: { fontSize: 13, color: colors.textMuted },
  dataValue: { fontSize: 13, color: colors.text, fontWeight: "600" },
  accChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
  },
  accChipText: { fontSize: 13, color: colors.text, fontFamily: "Courier" },
  consentId: {
    fontSize: 12,
    color: colors.text,
    fontFamily: "Courier",
    marginTop: spacing.sm,
  },
  auditRow: {
    flexDirection: "row",
    gap: spacing.md,
    paddingVertical: 8,
  },
  auditDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  auditTitle: { fontSize: 13, fontWeight: "600", color: colors.text },
  auditTime: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  auditDelta: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  errorCard: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.lg,
    alignItems: "center",
    gap: spacing.md,
    ...shadow.card,
  },
  errorText: { fontSize: 14, color: colors.text, textAlign: "center" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.55)",
    justifyContent: "center",
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: "center",
  },
  modalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: colors.text },
  modalText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  modalInput: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 14,
    color: colors.text,
    minHeight: 60,
    width: "100%",
    marginTop: spacing.lg,
    textAlignVertical: "top",
  },
});
