/**
 * Loan QR scan — placeholder for the auto-loan-origination flow being
 * built in parallel. Scans a QR code from a car listing / dealer poster
 * and POSTs the payload to a future internal endpoint.
 *
 * For now: requests camera permission, scans, displays the scanned value,
 * and shows a stub "Submit application" CTA.
 */

import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions, BarcodeScanningResult } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { colors, gradients, radius, shadow, spacing } from "../../../utils/theme";
import PrimaryButton from "../../../components/PrimaryButton";
import { LinearGradient } from "expo-linear-gradient";

export default function LoanScanScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState<string | null>(null);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleScan = (result: BarcodeScanningResult) => {
    if (scanned) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => undefined,
    );
    setScanned(result.data);
  };

  const handleSubmit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
    // TODO: POST to the auto-loan internal endpoint once available.
    // Placeholder: navigate back to home with a friendly message.
    router.replace("/(auth)");
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="close" size={22} color={colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Scan QR</Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={styles.cameraWrap}>
        {permission?.granted ? (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={scanned ? undefined : handleScan}
          />
        ) : (
          <View style={styles.permissionWrap}>
            <Ionicons name="camera-outline" size={48} color={colors.white} />
            <Text style={styles.permissionTitle}>Camera Access Required</Text>
            <Text style={styles.permissionText}>
              Allow camera access to scan QR codes for car loan applications.
            </Text>
            <PrimaryButton
              label="Grant Permission"
              onPress={() => requestPermission()}
              variant="filled"
              size="md"
              style={{ marginTop: spacing.lg }}
            />
          </View>
        )}

        {/* Scan reticle */}
        {permission?.granted && !scanned && (
          <View pointerEvents="none" style={styles.overlay}>
            <View style={styles.reticle}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
            <Text style={styles.hint}>
              Point your camera at the dealer's QR code
            </Text>
          </View>
        )}
      </View>

      {scanned && (
        <LinearGradient
          colors={gradients.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.scanResult, shadow.hero]}
        >
          <View style={styles.resultIconCircle}>
            <Ionicons name="checkmark-circle" size={28} color={colors.white} />
          </View>
          <Text style={styles.resultTitle}>QR Detected</Text>
          <Text style={styles.resultData} numberOfLines={3}>
            {scanned}
          </Text>
          <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.md }}>
            <View style={{ flex: 1 }}>
              <PrimaryButton
                label="Re-scan"
                onPress={() => setScanned(null)}
                variant="outline"
                fullWidth
                style={{ borderColor: colors.white, backgroundColor: "transparent" }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PrimaryButton
                label="Apply for Loan"
                onPress={handleSubmit}
                variant="filled"
                fullWidth
                style={{ backgroundColor: colors.white }}
              />
            </View>
          </View>
        </LinearGradient>
      )}
    </View>
  );
}

const RETICLE_SIZE = 240;
const CORNER_LEN = 28;
const CORNER_WIDTH = 4;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: colors.white },
  cameraWrap: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#111",
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  reticle: {
    width: RETICLE_SIZE,
    height: RETICLE_SIZE,
  },
  corner: {
    position: "absolute",
    width: CORNER_LEN,
    height: CORNER_LEN,
    borderColor: colors.white,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: CORNER_WIDTH, borderLeftWidth: CORNER_WIDTH, borderTopLeftRadius: 8 },
  cornerTR: { top: 0, right: 0, borderTopWidth: CORNER_WIDTH, borderRightWidth: CORNER_WIDTH, borderTopRightRadius: 8 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: CORNER_WIDTH, borderLeftWidth: CORNER_WIDTH, borderBottomLeftRadius: 8 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: CORNER_WIDTH, borderRightWidth: CORNER_WIDTH, borderBottomRightRadius: 8 },
  hint: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    marginTop: spacing.lg,
    textAlign: "center",
    paddingHorizontal: spacing.xl,
  },
  permissionWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  permissionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    marginTop: spacing.md,
  },
  permissionText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  scanResult: {
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.xl,
    alignItems: "center",
  },
  resultIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  resultTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "800",
  },
  resultData: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontFamily: "Courier",
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: spacing.md,
  },
});
