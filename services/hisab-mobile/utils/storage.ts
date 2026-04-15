/**
 * Thin wrappers over AsyncStorage + SecureStore.
 *
 * - SecureStore is used for anything secret (bank token, consent_id).
 * - AsyncStorage is used for non-sensitive UI state (last-seen date-range,
 *   login email remembered, etc.).
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// ---------------------------------------------------------------------------
// Secure store (web fallback uses AsyncStorage since SecureStore isn't web).
// ---------------------------------------------------------------------------

const isWeb = Platform.OS === "web";

export async function setSecret(key: string, value: string): Promise<void> {
  if (isWeb) {
    await AsyncStorage.setItem(`__secure__${key}`, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function getSecret(key: string): Promise<string | null> {
  if (isWeb) {
    return AsyncStorage.getItem(`__secure__${key}`);
  }
  return SecureStore.getItemAsync(key);
}

export async function deleteSecret(key: string): Promise<void> {
  if (isWeb) {
    await AsyncStorage.removeItem(`__secure__${key}`);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

// ---------------------------------------------------------------------------
// Async storage passthrough.
// ---------------------------------------------------------------------------

export async function setItem(key: string, value: string): Promise<void> {
  await AsyncStorage.setItem(key, value);
}

export async function getItem(key: string): Promise<string | null> {
  return AsyncStorage.getItem(key);
}

export async function removeItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export async function setJSON<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function getJSON<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
