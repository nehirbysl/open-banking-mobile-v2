/**
 * Consent approve — handles deep link `bdonline://consent/approve?consent_id=...`
 * Reused by fintech apps redirecting through the OAuth flow.
 *
 * Flow (mirrors the web app):
 * 1. Fetch consent + TPP info
 * 2. Fetch customer accounts
 * 3. Show TPP, requested permissions, account picker
 * 4. On approve: POST authorize, request auth_code, redirect (best-effort)
 * 5. On decline: POST reject, redirect with error=access_denied
 */

import React, { useCallback, useEffect, useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import {
  authorizeConsent,
  fetchCustomerAccounts,
  generateAuthCode,
  getConsent,
  getStoredUser,
  getTPP,
  rejectConsent,
  type BankAccount,
  type Consent,
  type TPP,
} from "../../../utils/api";
import { colors, gradients, radius, shadow, spacing } from "../../../utils/theme";
import { formatDate } from "../../../utils/format";
import { CONSENT_TYPE_LABEL } from "../../../utils/permissions";
import Card from "../../../components/Card";
import Badge from "../../../components/Badge";
import PermissionList from "../../../components/PermissionList";
import AccountPicker from "../../../components/AccountPicker";
import PrimaryButton from "../../../components/PrimaryButton";
import Skeleton from "../../../components/Skeleton";

export default function ConsentApproveScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { consent_id, redirect_uri, state } = useLocalSearchParams<{
    consent_id?: string;
    redirect_uri?: string;
    state?: string;
  }>();

  const [consent, setConsent] = useState<Consent | null>(null);
  const [tpp, setTpp] = useState<TPP | null>(null);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!consent_id) {
      setError("No consent ID provided.");
      return;
    }
    const u = await getStoredUser();
    if (!u) return;
    setCustomerId(u.customer_id);
    try {
      const [c, accts] = await Promise.all([
        getConsent(consent_id),
        fetchCustomerAccounts(u.customer_id),
      ]);
      setConsent(c);
      setAccounts(accts);
      if (c.tpp_id) {
        const t = await getTPP(c.tpp_id);
        setTpp(t);
      }
      if (c.status !== "AwaitingAuthorisation") {
        setError(`This consent has already been ${c.status.toLowerCase()}.`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load consent.");
    }
  }, [consent_id]);

  useEffect(() => {
    (async () => {
      await load();
      setLoading(false);
    })();
  }, [load]);

  const handleRedirect = useCallback(
    async (authCode?: string, errorCode?: string) => {
      if (!redirect_uri) {
        router.replace("/(auth)");
        return;
      }
      try {
        const url = new URL(redirect_uri);
        if (authCode) url.searchParams.set("code", authCode);
        if (errorCode) url.searchParams.set("error", errorCode);
        if (state) url.searchParams.set("state", state);
        await Linking.openURL(url.toString());
      } catch {
        router.replace("/(auth)");
      }
    },
    [redirect_uri, state, router],
  );

  const handleApprove = async () => {
    if (!consent || !consent_id) return;
    if (selected.length === 0) {
      setError("Please select at least one account.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
      await authorizeConsent(consent_id, {
        customer_id: customerId,
        selected_accounts: selected,
      });
      const { code } = await generateAuthCode({
        consent_id,
        customer_id: customerId,
        redirect_uri: redirect_uri || "",
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => undefined,
      );
      await handleRedirect(code);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Authorization failed");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
        () => undefined,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!consent || !consent_id) return;
    setSubmitting(true);
    try {
      await rejectConsent(consent_id, {
        customer_id: customerId,
        reason: "Customer declined",
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
        () => undefined,
      );
      await handleRedirect(undefined, "access_denied");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Rejection failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + spacing.md, padding: spacing.lg }]}>
        <Skeleton height={140} borderRadius={radius.xl} />
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
          <Ionicons name="warning-outline" size={36} color={colors.warning} />
          <Text style={styles.errorTitle}>Unable to Load Consent</Text>
          <Text style={styles.errorText}>{error || "The consent does not exist or has expired."}</Text>
          <PrimaryButton
            label="Go Home"
            onPress={() => router.replace("/(auth)")}
            variant="outline"
            fullWidth
          />
        </View>
      </View>
    );
  }

  const tppName = tpp?.tpp_name || consent.tpp_id;
  const typeLabel = CONSENT_TYPE_LABEL[consent.consent_type] || consent.consent_type;
  const isPayment = ["domestic-payment", "scheduled-payment", "standing-order"].includes(
    consent.consent_type,
  );
  const paymentAmount = consent.payment_details?.instructed_amount as
    | { amount: string; currency: string }
    | undefined;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md }]}
    >
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="close" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Authorize</Text>
        <View style={{ width: 38 }} />
      </View>

      <LinearGradient
        colors={gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.banner, shadow.hero]}
      >
        <View style={styles.bannerIconCircle}>
          <Ionicons name="shield-checkmark" size={28} color={colors.white} />
        </View>
        <Text style={styles.bannerTitle}>Authorize Access</Text>
        <Text style={styles.bannerSub}>
          Review and approve a third-party request
        </Text>
      </LinearGradient>

      <Card style={{ marginTop: spacing.lg }}>
        <View style={styles.tppRow}>
          <View style={styles.tppIcon}>
            <Ionicons name="business" size={22} color={colors.primary} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.tppName}>{tppName}</Text>
            <Text style={styles.tppMeta}>is requesting {typeLabel.toLowerCase()}</Text>
          </View>
        </View>
        <View style={styles.tppBadges}>
          <Badge label={typeLabel} color={colors.info} variant="soft" />
          {tpp?.is_aisp && <Badge label="AISP" color={colors.success} variant="soft" />}
          {tpp?.is_pisp && <Badge label="PISP" color={colors.warning} variant="soft" />}
        </View>
      </Card>

      {isPayment && paymentAmount && (
        <Card style={{ marginTop: spacing.md, borderWidth: 1, borderColor: colors.warning }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
            <Ionicons name="cash-outline" size={18} color={colors.warning} />
            <Text style={styles.sectionTitle}>Payment Details</Text>
          </View>
          <View style={{ marginTop: spacing.sm }}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Amount</Text>
              <Text style={[styles.dataValue, { fontSize: 16, color: colors.warning }]}>
                {paymentAmount.currency} {paymentAmount.amount}
              </Text>
            </View>
          </View>
        </Card>
      )}

      <Card style={{ marginTop: spacing.md }}>
        <Text style={styles.sectionTitle}>Requested Permissions</Text>
        <View style={{ marginTop: spacing.sm }}>
          <PermissionList permissions={consent.permissions} />
        </View>
      </Card>

      {consent.expiration_time && (
        <View style={styles.expiry}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={styles.expiryText}>
            Expires on {formatDate(consent.expiration_time)}
          </Text>
        </View>
      )}

      <Card style={{ marginTop: spacing.md }}>
        <Text style={styles.sectionTitle}>
          {isPayment ? "Pay From" : "Select Accounts to Share"}
        </Text>
        <View style={{ marginTop: spacing.md }}>
          <AccountPicker
            accounts={accounts}
            selectedIds={selected}
            onChange={setSelected}
            multiple={!isPayment}
          />
        </View>
      </Card>

      {error && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={16} color={colors.danger} />
          <Text style={styles.errorBoxText}>{error}</Text>
        </View>
      )}

      <View style={styles.actionsRow}>
        <View style={styles.flex}>
          <PrimaryButton
            label="Decline"
            onPress={handleReject}
            disabled={submitting}
            variant="outline"
            size="lg"
            fullWidth
          />
        </View>
        <View style={styles.flex}>
          <PrimaryButton
            label="Approve"
            onPress={handleApprove}
            loading={submitting}
            disabled={selected.length === 0 || submitting}
            size="lg"
            fullWidth
            rightIcon={
              !submitting ? (
                <Ionicons name="checkmark" size={18} color={colors.white} />
              ) : undefined
            }
          />
        </View>
      </View>

      <Text style={styles.legal}>
        Your data is protected under Central Bank of Oman Open Banking regulations.
      </Text>
      <View style={{ height: spacing.xxl }} />
    </ScrollView>
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
    marginBottom: spacing.md,
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
  banner: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: "center",
  },
  bannerIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  bannerTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  bannerSub: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
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
  tppBadges: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
    flexWrap: "wrap",
  },
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
    paddingVertical: 6,
  },
  dataLabel: { fontSize: 13, color: colors.textMuted },
  dataValue: { fontSize: 13, color: colors.text, fontWeight: "700" },
  expiry: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: spacing.md,
  },
  expiryText: { fontSize: 12, color: colors.textMuted },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: "#FEF2F2",
    borderRadius: radius.md,
    marginTop: spacing.md,
  },
  errorBoxText: { color: colors.danger, fontSize: 13, flex: 1 },
  legal: {
    fontSize: 11,
    color: colors.textFaint,
    textAlign: "center",
    marginTop: spacing.md,
  },
  errorCard: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.lg,
    alignItems: "center",
    gap: spacing.md,
    ...shadow.card,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  errorText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
  },
});
