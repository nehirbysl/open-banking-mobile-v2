import AsyncStorage from "@react-native-async-storage/async-storage";

const CONSENT_ID_KEY = "salalah_pending_consent";
const DEMO_CONSENT_ID = "703b51f7-4dae-437e-b66c-1aecec7d2d07";

export async function storePendingConsent(): Promise<string> {
  await AsyncStorage.setItem(CONSENT_ID_KEY, DEMO_CONSENT_ID);
  return DEMO_CONSENT_ID;
}

export async function getPendingConsentId(): Promise<string | null> {
  const id = await AsyncStorage.getItem(CONSENT_ID_KEY);
  await AsyncStorage.removeItem(CONSENT_ID_KEY);
  return id;
}
