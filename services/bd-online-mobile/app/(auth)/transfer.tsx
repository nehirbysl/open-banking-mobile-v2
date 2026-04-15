/**
 * Transfer — between own accounts, to a saved beneficiary, or to an IBAN.
 */

import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import {
  executeTransfer,
  fetchBeneficiaries,
  fetchCustomerAccounts,
  getStoredUser,
  type BankAccount,
  type Beneficiary,
  type TransferResult,
} from "../../utils/api";
import { colors, gradients, radius, shadow, spacing } from "../../utils/theme";
import { formatBalance, maskIban } from "../../utils/format";
import PrimaryButton from "../../components/PrimaryButton";
import Card from "../../components/Card";
import Skeleton from "../../components/Skeleton";

type Mode = "own" | "beneficiary" | "iban";

export default function TransferScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState<Mode>("own");
  const [fromId, setFromId] = useState<string | null>(null);
  const [toId, setToId] = useState<string | null>(null);
  const [toIban, setToIban] = useState("");
  const [selectedBen, setSelectedBen] = useState<Beneficiary | null>(null);
  const [amountText, setAmountText] = useState("");
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<TransferResult | null>(null);

  useEffect(() => {
    (async () => {
      const u = await getStoredUser();
      if (!u) return;
      setCustomerId(u.customer_id);
      const [accts, bens] = await Promise.all([
        fetchCustomerAccounts(u.customer_id),
        fetchBeneficiaries(u.customer_id),
      ]);
      setAccounts(accts);
      setBeneficiaries(bens);
      setLoading(false);
    })();
  }, []);

  const fromAccount = accounts.find((a) => a.accountId === fromId);
  const toAccount = accounts.find((a) => a.accountId === toId);
  const amount = parseFloat(amountText) || 0;

  const canSubmit = useMemo(() => {
    if (!fromAccount) return false;
    if (amount <= 0 || amount > fromAccount.balance) return false;
    if (reference.trim().length === 0) return false;
    if (mode === "own") return !!toId && toId !== fromId;
    if (mode === "beneficiary") return !!selectedBen;
    if (mode === "iban") return toIban.trim().length >= 16;
    return false;
  }, [fromAccount, amount, reference, mode, toId, fromId, selectedBen, toIban]);

  const handleSubmit = async () => {
    if (!canSubmit || !fromAccount) return;
    setSubmitting(true);
    setError(null);

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);

      if (mode === "own" && toId) {
        const result = await executeTransfer({
          customer_id: customerId,
          source_account_id: fromAccount.accountId,
          target_account_id: toId,
          amount,
          currency: fromAccount.currency || "OMR",
          reference: reference.trim(),
          description: `Transfer from ${fromAccount.description}`,
        });
        setSuccess(result);
      } else {
        // External IBAN / beneficiary — simulated success (no backend target).
        const result: TransferResult = {
          transfer_id: `TRF-${Date.now().toString(36).toUpperCase()}`,
          source_transaction_id: "",
          target_transaction_id: "",
          amount,
          currency: fromAccount.currency || "OMR",
          source_account_id: fromAccount.accountId,
          target_account_id:
            mode === "beneficiary" && selectedBen ? selectedBen.iban : toIban,
          source_balance_after: fromAccount.balance - amount,
          target_balance_after: 0,
          reference: reference.trim(),
          status: "Completed",
          created_at: new Date().toISOString(),
        };
        setSuccess(result);
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => undefined,
      );
    } catch (e) {
      const message = e instanceof Error ? e.message : "Transfer failed";
      setError(message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
        () => undefined,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSuccess(null);
    setFromId(null);
    setToId(null);
    setToIban("");
    setSelectedBen(null);
    setAmountText("");
    setReference("");
    setMode("own");
  };

  if (loading) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + spacing.md, padding: spacing.lg }]}>
        <Skeleton height={64} borderRadius={radius.xl} />
        <View style={{ height: spacing.lg }} />
        <Skeleton height={120} borderRadius={radius.lg} />
        <View style={{ height: spacing.md }} />
        <Skeleton height={120} borderRadius={radius.lg} />
      </View>
    );
  }

  if (success) {
    return (
      <SuccessView
        result={success}
        fromAccount={fromAccount}
        toAccount={toAccount}
        toIban={
          mode === "iban"
            ? toIban
            : mode === "beneficiary" && selectedBen
              ? selectedBen.iban
              : null
        }
        onNew={reset}
        onHome={() => router.replace("/(auth)")}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md }]}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={gradients.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.banner, shadow.hero]}
        >
          <Ionicons name="swap-horizontal" size={28} color={colors.white} />
          <Text style={styles.bannerTitle}>Transfer Funds</Text>
          <Text style={styles.bannerSub}>Move money between accounts or pay anyone</Text>
        </LinearGradient>

        <Card style={styles.section} variant="default">
          <Text style={styles.label}>Transfer Type</Text>
          <View style={styles.modeRow}>
            <ModeChip
              icon="repeat"
              label="My Accounts"
              active={mode === "own"}
              onPress={() => {
                setMode("own");
                setSelectedBen(null);
                setToIban("");
              }}
            />
            <ModeChip
              icon="people"
              label="Beneficiary"
              active={mode === "beneficiary"}
              onPress={() => {
                setMode("beneficiary");
                setToId(null);
                setToIban("");
              }}
            />
            <ModeChip
              icon="card"
              label="IBAN"
              active={mode === "iban"}
              onPress={() => {
                setMode("iban");
                setToId(null);
                setSelectedBen(null);
              }}
            />
          </View>
        </Card>

        {/* From account */}
        <Card style={styles.section}>
          <Text style={styles.label}>From</Text>
          <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
            {accounts.map((a) => {
              const selected = a.accountId === fromId;
              return (
                <Pressable
                  key={a.accountId}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => undefined);
                    setFromId(a.accountId);
                    if (toId === a.accountId) setToId(null);
                  }}
                  style={[styles.accountChip, selected && styles.accountChipActive]}
                >
                  <View style={styles.flex}>
                    <Text style={[styles.accountChipName, selected && { color: colors.primaryDark }]}>
                      {a.description}
                    </Text>
                    <Text style={styles.accountChipIban}>{maskIban(a.iban)}</Text>
                  </View>
                  <Text style={[styles.accountChipBalance, selected && { color: colors.primaryDark }]}>
                    {formatBalance(a.balance, a.currency)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* To account / IBAN / beneficiary */}
        <Card style={styles.section}>
          <Text style={styles.label}>
            {mode === "own" ? "To Account" : mode === "beneficiary" ? "Beneficiary" : "Beneficiary IBAN"}
          </Text>
          <View style={{ marginTop: spacing.sm }}>
            {mode === "own" && (
              <View style={{ gap: spacing.sm }}>
                {accounts
                  .filter((a) => a.accountId !== fromId)
                  .map((a) => {
                    const selected = a.accountId === toId;
                    return (
                      <Pressable
                        key={a.accountId}
                        onPress={() => {
                          Haptics.selectionAsync().catch(() => undefined);
                          setToId(a.accountId);
                        }}
                        style={[styles.accountChip, selected && styles.accountChipActive]}
                      >
                        <View style={styles.flex}>
                          <Text style={[styles.accountChipName, selected && { color: colors.primaryDark }]}>
                            {a.description}
                          </Text>
                          <Text style={styles.accountChipIban}>{maskIban(a.iban)}</Text>
                        </View>
                      </Pressable>
                    );
                  })}
                {accounts.length <= 1 && (
                  <Text style={styles.helperText}>You only have one account.</Text>
                )}
              </View>
            )}

            {mode === "beneficiary" &&
              (beneficiaries.length === 0 ? (
                <View style={styles.emptyInline}>
                  <Ionicons name="people-outline" size={22} color={colors.textFaint} />
                  <Text style={styles.helperText}>
                    No saved beneficiaries. Add one from More.
                  </Text>
                </View>
              ) : (
                <View style={{ gap: spacing.sm }}>
                  {beneficiaries.map((b) => {
                    const selected = selectedBen?.beneficiary_id === b.beneficiary_id;
                    return (
                      <Pressable
                        key={b.beneficiary_id}
                        onPress={() => {
                          Haptics.selectionAsync().catch(() => undefined);
                          setSelectedBen(b);
                        }}
                        style={[styles.accountChip, selected && styles.accountChipActive]}
                      >
                        <View style={styles.flex}>
                          <Text style={[styles.accountChipName, selected && { color: colors.primaryDark }]}>
                            {b.name}
                          </Text>
                          <Text style={styles.accountChipIban}>
                            {maskIban(b.iban)} · {b.bank_name}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              ))}

            {mode === "iban" && (
              <TextInput
                value={toIban}
                onChangeText={(t) => setToIban(t.replace(/\s/g, "").toUpperCase())}
                placeholder="OM02DHOF..."
                placeholderTextColor={colors.textFaint}
                style={styles.textInput}
                autoCapitalize="characters"
                maxLength={27}
              />
            )}
          </View>
        </Card>

        {/* Amount + reference */}
        <Card style={styles.section}>
          <Text style={styles.label}>Amount (OMR)</Text>
          <TextInput
            value={amountText}
            onChangeText={(t) => setAmountText(t.replace(/[^0-9.]/g, ""))}
            placeholder="0.000"
            placeholderTextColor={colors.textFaint}
            style={[styles.textInput, styles.amountInput]}
            keyboardType="decimal-pad"
          />
          {fromAccount && amount > 0 && amount > fromAccount.balance && (
            <Text style={styles.errorInline}>Insufficient balance.</Text>
          )}

          <Text style={[styles.label, { marginTop: spacing.lg }]}>Reference</Text>
          <TextInput
            value={reference}
            onChangeText={setReference}
            placeholder="Payment reference"
            placeholderTextColor={colors.textFaint}
            style={styles.textInput}
            maxLength={140}
          />
        </Card>

        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color={colors.danger} />
            <Text style={styles.errorBoxText}>{error}</Text>
          </View>
        )}

        <PrimaryButton
          label={submitting ? "Processing..." : "Confirm Transfer"}
          onPress={handleSubmit}
          loading={submitting}
          disabled={!canSubmit}
          size="lg"
          fullWidth
          rightIcon={
            !submitting ? (
              <Ionicons name="arrow-forward" size={18} color={colors.white} />
            ) : undefined
          }
          style={{ marginTop: spacing.lg }}
        />

        <Text style={styles.disclaimer}>
          Transfers are subject to Bank Dhofar terms and conditions.
        </Text>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ModeChip({
  icon,
  label,
  active,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => undefined);
        onPress();
      }}
      style={[styles.modeChip, active && styles.modeChipActive]}
    >
      <Ionicons
        name={icon}
        size={18}
        color={active ? colors.white : colors.textMuted}
      />
      <Text style={[styles.modeChipLabel, active && { color: colors.white }]}>
        {label}
      </Text>
    </Pressable>
  );
}

function SuccessView({
  result,
  fromAccount,
  toAccount,
  toIban,
  onNew,
  onHome,
}: {
  result: TransferResult;
  fromAccount?: BankAccount;
  toAccount?: BankAccount;
  toIban: string | null;
  onNew: () => void;
  onHome: () => void;
}) {
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(0, { duration: 0 }),
      withSpring(1.1, { damping: 10, stiffness: 120 }),
      withSpring(1, { damping: 12, stiffness: 100 }),
    );
  }, [scale]);

  const animatedCheck = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.xl, alignItems: "stretch" },
      ]}
    >
      <View style={styles.successHeader}>
        <Animated.View style={[styles.successCircle, animatedCheck]}>
          <Ionicons name="checkmark" size={48} color={colors.white} />
        </Animated.View>
        <Text style={styles.successTitle}>Transfer Successful</Text>
        <Text style={styles.successAmount}>
          {formatBalance(result.amount, result.currency)}
        </Text>
      </View>

      <Card style={{ marginTop: spacing.xl }}>
        <SuccessRow label="Reference" value={result.reference} />
        <Divider />
        <SuccessRow label="Transaction ID" value={result.transfer_id} mono />
        <Divider />
        <SuccessRow
          label="From"
          value={fromAccount?.description || result.source_account_id}
          sub={fromAccount ? maskIban(fromAccount.iban) : undefined}
        />
        <Divider />
        <SuccessRow
          label="To"
          value={toAccount?.description || toIban || result.target_account_id}
          sub={
            toAccount ? maskIban(toAccount.iban) : toIban ? maskIban(toIban) : undefined
          }
        />
        <Divider />
        <SuccessRow
          label="Date"
          value={new Date(result.created_at).toLocaleString("en-GB")}
        />
        <Divider />
        <SuccessRow label="Status" value={result.status} valueColor={colors.success} />
      </Card>

      <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.xl }}>
        <View style={styles.flex}>
          <PrimaryButton
            label="Done"
            onPress={onHome}
            variant="outline"
            size="md"
            fullWidth
          />
        </View>
        <View style={styles.flex}>
          <PrimaryButton
            label="New Transfer"
            onPress={onNew}
            size="md"
            fullWidth
          />
        </View>
      </View>
      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
}

function SuccessRow({
  label,
  value,
  sub,
  mono,
  valueColor,
}: {
  label: string;
  value: string;
  sub?: string;
  mono?: boolean;
  valueColor?: string;
}) {
  return (
    <View style={styles.successRow}>
      <Text style={styles.successRowLabel}>{label}</Text>
      <View style={{ alignItems: "flex-end", flex: 1 }}>
        <Text
          style={[
            styles.successRowValue,
            mono && { fontFamily: "Courier", fontSize: 13 },
            valueColor ? { color: valueColor } : undefined,
          ]}
          numberOfLines={1}
        >
          {value}
        </Text>
        {sub && <Text style={styles.successRowSub}>{sub}</Text>}
      </View>
    </View>
  );
}

function Divider() {
  return <View style={styles.successDivider} />;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  flex: { flex: 1 },
  banner: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: "flex-start",
    gap: 6,
  },
  bannerTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginTop: 6,
  },
  bannerSub: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
  },
  section: { marginTop: spacing.lg },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modeRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  modeChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    justifyContent: "center",
  },
  modeChipActive: {
    backgroundColor: colors.primary,
  },
  modeChipLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
  },
  accountChip: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1.5,
    borderColor: "transparent",
    gap: spacing.md,
  },
  accountChipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  accountChipName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  accountChipIban: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    fontFamily: "Courier",
  },
  accountChipBalance: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  textInput: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    color: colors.text,
    marginTop: spacing.sm,
  },
  amountInput: {
    fontSize: 22,
    fontWeight: "700",
  },
  helperText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  emptyInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  errorInline: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 6,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: "#FEF2F2",
    borderRadius: radius.md,
    marginTop: spacing.lg,
  },
  errorBoxText: {
    color: colors.danger,
    fontSize: 13,
    flex: 1,
  },
  disclaimer: {
    fontSize: 11,
    color: colors.textFaint,
    textAlign: "center",
    marginTop: spacing.md,
  },

  // Success screen
  successHeader: {
    alignItems: "center",
  },
  successCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.hero,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    marginTop: spacing.lg,
  },
  successAmount: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.primary,
    marginTop: 4,
  },
  successRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  successRowLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    flex: 0.5,
  },
  successRowValue: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    textAlign: "right",
  },
  successRowSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  successDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
});
