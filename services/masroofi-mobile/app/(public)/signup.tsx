/**
 * Create a Masroofi account — email + name + password.
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
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import PrimaryButton from "../../components/PrimaryButton";
import { signup } from "../../utils/auth";
import { theme } from "../../utils/theme";

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    if (!trimmedEmail || !trimmedName || !password) {
      setError("All fields are required");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    const result = await signup(trimmedEmail, password, trimmedName);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color={theme.colors.textPrimary} />
          </Pressable>

          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            It takes under a minute. We\u2019ll connect your bank in the next step.
          </Text>

          {error ? (
            <View style={styles.error}>
              <Ionicons name="alert-circle" size={18} color={theme.colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Field
            label="Full name"
            icon="person-outline"
            value={name}
            onChangeText={setName}
            placeholder="Ahmed Al-Balushi"
            editable={!loading}
            autoCapitalize="words"
          />

          <Field
            label="Email"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            editable={!loading}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.inputWrap}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={theme.colors.textMuted}
              />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="At least 8 characters"
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry={!showPassword}
                editable={!loading}
                returnKeyType="go"
                onSubmitEditing={handleSubmit}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={10}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color={theme.colors.textMuted}
                />
              </Pressable>
            </View>
          </View>

          <PrimaryButton
            label="Create account"
            onPress={handleSubmit}
            loading={loading}
            iconRight="arrow-forward"
            style={{ marginTop: 12 }}
          />

          <Pressable
            onPress={() => router.replace("/login")}
            style={styles.switchAction}
          >
            <Text style={styles.switchText}>
              Already have an account?{" "}
              <Text style={styles.switchLink}>Sign in</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface FieldProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  editable?: boolean;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
}

function Field(props: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{props.label}</Text>
      <View style={styles.inputWrap}>
        <Ionicons name={props.icon} size={18} color={theme.colors.textMuted} />
        <TextInput
          style={styles.input}
          value={props.value}
          onChangeText={props.onChangeText}
          placeholder={props.placeholder}
          placeholderTextColor={theme.colors.textMuted}
          keyboardType={props.keyboardType}
          autoCapitalize={props.autoCapitalize}
          autoCorrect={props.autoCorrect ?? true}
          editable={props.editable}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  scroll: { padding: 24, paddingBottom: 40 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    ...theme.shadow.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 6,
    marginBottom: 24,
  },
  error: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFE5E5",
    padding: 12,
    borderRadius: theme.radii.md,
    marginBottom: 14,
  },
  errorText: { color: theme.colors.danger, fontSize: 13, flex: 1 },
  field: { marginBottom: 14 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textPrimary,
    paddingVertical: 14,
  },
  switchAction: { marginTop: 20, alignItems: "center" },
  switchText: { color: theme.colors.textSecondary, fontSize: 14 },
  switchLink: { color: theme.colors.primary, fontWeight: "700" },
});
