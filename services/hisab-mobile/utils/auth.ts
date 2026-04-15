/**
 * Hisab user authentication — email/password against the Hisab backend.
 * Mirrors the web app (services/hisab/src/utils/auth.ts) but uses
 * AsyncStorage + SecureStore instead of browser storage.
 */

import { getItem, setJSON, getJSON, removeItem } from "./storage";
import { HISAB_API_BASE } from "./api";

export interface HisabUser {
  email: string;
  name: string;
  createdAt: string;
}

const SESSION_KEY = "hisab_session";

interface BackendUser {
  email?: string;
  name: string;
  created_at: string;
  consent_id?: string | null;
  bank_token?: string | null;
}

export type AuthResult =
  | { ok: true; user: HisabUser; consentId: string | null; bankToken: string | null }
  | { ok: false; error: string };

export async function signup(
  email: string,
  password: string,
  name: string
): Promise<AuthResult> {
  try {
    const resp = await fetch(`${HISAB_API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    if (!resp.ok) {
      const body: { detail?: string } | null = await resp.json().catch(() => null);
      return { ok: false, error: body?.detail || "Registration failed" };
    }

    const backend = (await resp.json()) as BackendUser;
    const user: HisabUser = {
      email,
      name,
      createdAt: backend.created_at,
    };
    await setJSON(SESSION_KEY, user);
    return { ok: true, user, consentId: null, bankToken: null };
  } catch {
    return { ok: false, error: "Network error — please try again" };
  }
}

export async function login(email: string, password: string): Promise<AuthResult> {
  try {
    const resp = await fetch(`${HISAB_API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!resp.ok) {
      return { ok: false, error: "Invalid email or password" };
    }

    const backend = (await resp.json()) as BackendUser;
    const user: HisabUser = {
      email,
      name: backend.name,
      createdAt: backend.created_at,
    };
    await setJSON(SESSION_KEY, user);
    return {
      ok: true,
      user,
      consentId: backend.consent_id ?? null,
      bankToken: backend.bank_token ?? backend.consent_id ?? null,
    };
  } catch {
    return { ok: false, error: "Network error — please try again" };
  }
}

export async function logout(): Promise<void> {
  await removeItem(SESSION_KEY);
}

export async function getCurrentUser(): Promise<HisabUser | null> {
  return getJSON<HisabUser>(SESSION_KEY);
}

export async function isLoggedIn(): Promise<boolean> {
  const raw = await getItem(SESSION_KEY);
  return raw !== null;
}

/**
 * Persist the bank connection on the user record so it survives log-in on a
 * fresh device. Best-effort — failures are swallowed because the local store
 * already has the token cached.
 */
export async function updateBankOnBackend(
  email: string,
  consentId: string,
  bankToken: string
): Promise<void> {
  try {
    await fetch(`${HISAB_API_BASE}/auth/update-bank`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        consent_id: consentId,
        bank_token: bankToken,
      }),
    });
  } catch {
    // Swallow — local cache is source of truth on the device.
  }
}
