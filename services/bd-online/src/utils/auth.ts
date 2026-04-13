/**
 * BD Online authentication — direct bank login (no Keycloak).
 *
 * Customer credentials are validated against the bank's own customers table
 * via POST /api/bank-auth/login. Session is stored in sessionStorage.
 */

const SESSION_KEY = 'bd_online_user';

export interface User {
  customer_id: string;
  email: string;
  first_name: string;
  last_name: string;
  accounts: string[];
}

export async function login(email: string, password: string): Promise<User> {
  const resp = await fetch('/api/bank-auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: 'Invalid credentials' }));
    throw new Error(err.detail || 'Login failed');
  }
  const user = await resp.json();
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export async function getUser(): Promise<User | null> {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export async function getAccessToken(): Promise<string | null> {
  // No JWT needed — consent_id is used as the access mechanism
  return sessionStorage.getItem(SESSION_KEY) ? 'authenticated' : null;
}

export function getCustomerId(user: User): string {
  return user.customer_id;
}

export function getDisplayName(user: User): string {
  return user.first_name || 'Customer';
}

export function getEmail(user: User): string {
  return user.email;
}

export async function logout(): Promise<void> {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = '/login';
}

export async function isAuthenticated(): Promise<boolean> {
  return sessionStorage.getItem(SESSION_KEY) !== null;
}

// Stubs for compatibility
export function onUserLoaded(_cb: (user: User) => void): void {}
export function onUserUnloaded(_cb: () => void): void {}
export function onAccessTokenExpiring(_cb: () => void): void {}
export function handleSilentRenew(): Promise<void> { return Promise.resolve(); }
export const userManager = null;
