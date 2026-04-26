import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";

const STATE_KEY = "salalah_oauth_state";
const CONSENT_ID_KEY = "salalah_pending_consent";
const TPP_ID = "salalah-souq-demo";

const BD_ONLINE_DEEPLINK_NATIVE = "bdonline://consent/approve";
const BD_ONLINE_DEEPLINK_EXPO_GO =
  "exp://expo-bdonline.omtd.bankdhofar.com/--/consent/approve";
const BD_ONLINE_WEB = "https://banking-api.omtd.bankdhofar.com";

const SALALAH_CALLBACK_NATIVE = "salalahsouq://callback";
const SALALAH_CALLBACK_EXPO_GO =
  "exp://expo-salalah.omtd.bankdhofar.com/--/callback";

const DEMO_CONSENT_ID = "703b51f7-4dae-437e-b66c-1aecec7d2d07";

export interface PaymentConsentParams {
  amount: number;
  currency: string;
  merchantRef: string;
  merchantName: string;
}

export interface CreateConsentResponse {
  consent_id: string;
}

export async function createPaymentConsent(
  _params: PaymentConsentParams
): Promise<CreateConsentResponse> {
  return { consent_id: DEMO_CONSENT_ID };
}

function randomState(): string {
  const bytes = new Uint8Array(24);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function buildQuery(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

export async function openBankConsent(consentId: string): Promise<string> {
  const state = randomState();
  await AsyncStorage.setItem(STATE_KEY, state);
  await AsyncStorage.setItem(CONSENT_ID_KEY, consentId);

  const commonParams = {
    consent_id: consentId,
    state,
    client_id: TPP_ID,
  };

  const nativeQuery = buildQuery({
    ...commonParams,
    redirect_uri: SALALAH_CALLBACK_NATIVE,
  });
  const expoGoQuery = buildQuery({
    ...commonParams,
    redirect_uri: SALALAH_CALLBACK_EXPO_GO,
  });

  const deepLink = `${BD_ONLINE_DEEPLINK_NATIVE}?${nativeQuery}`;
  const deepLinkExpoGo = `${BD_ONLINE_DEEPLINK_EXPO_GO}?${expoGoQuery}`;
  const webFallback = `${BD_ONLINE_WEB}/consent/approve?${nativeQuery}`;

  try {
    const canOpen = await Linking.canOpenURL(deepLink);
    if (canOpen) {
      await Linking.openURL(deepLink);
      return deepLink;
    }
  } catch {
    // fall through
  }

  try {
    await Linking.openURL(deepLinkExpoGo);
    return deepLinkExpoGo;
  } catch {
    // fall through
  }

  await Linking.openURL(webFallback);
  return webFallback;
}

export async function validateState(received: string | null): Promise<boolean> {
  const stored = await AsyncStorage.getItem(STATE_KEY);
  await AsyncStorage.removeItem(STATE_KEY);
  if (!stored || !received) return false;
  return stored === received;
}

export async function getPendingConsentId(): Promise<string | null> {
  const id = await AsyncStorage.getItem(CONSENT_ID_KEY);
  await AsyncStorage.removeItem(CONSENT_ID_KEY);
  return id;
}
