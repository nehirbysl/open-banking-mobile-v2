/**
 * Sign-up screen — creates a new Hisab account via the backend.
 */

import React, { useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { signup } from "../../utils/auth";
import { colors, radius, spacing } from "../../utils/theme";

export default function SignupScreen() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup() {
    setError("");
    const name = businessName.trim();
    const trimmedEmail = email.trim();
    if (!name) return setError("Please enter your business name");
    if (!trimmedEmail) return setError("Please enter your email");
    if (password.length < 8) return setError("Password must be at least 8 characters");

    setLoading(true);
    const result = await signup(trimmedEmail, password, name);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    router.replace("/(auth)");
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>

          <View style={styles.header}>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>
              Takes 30 seconds. No paperwork, no credit checks.
            </Text>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.field}>
            <Text style={styles.label}>Business name</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="briefcase-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                value={businessName}
                onChangeText={setBusinessName}
                placeholder="Al Sawadi Trading LLC"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                autoCapitalize="words"
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Work email</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@business.com"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Minimum 8 characters"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={handleSignup}
              />
            </View>
          </View>

          <Pressable
            style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={styles.primaryBtnText}>
              {loading ? "Creating account…" : "Create account"}
            </Text>
          </Pressable>

          <Text style={styles.terms}>
            By continuing you agree to Hisab's terms and privacy policy.
          </Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Pressable onPress={() => router.replace("/(public)/login")}>
              <Text style={styles.footerLink}>Sign in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: { marginTop: spacing.lg, marginBottom: spacing.xl },
  title: { fontSize: 28, fontWeight: "800", color: colors.text, letterSpacing: -0.3 },
  subtitle: { marginTop: 6, fontSize: 15, color: colors.textSecondary },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.dangerBg,
    padding: 12,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  errorText: { flex: 1, fontSize: 13, color: colors.danger, fontWeight: "600" },
  field: { marginBottom: spacing.md },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: { paddingLeft: 14 },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 15,
    color: colors.text,
  },
  primaryBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnDisabled: { opacity: 0.7 },
  primaryBtnText: { color: "#FFF", fontSize: 16, fontWeight: "800", letterSpacing: 0.3 },
  terms: {
    marginTop: spacing.sm,
    textAlign: "center",
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
  },
  footer: {
    marginTop: spacing.xl,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  footerText: { color: colors.textSecondary, fontSize: 14 },
  footerLink: { color: colors.primary, fontSize: 14, fontWeight: "700" },
});
