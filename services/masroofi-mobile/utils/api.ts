/**
 * OBIE AISP API client for the mobile app.
 *
 * Mirrors services/masroofi/src/utils/api.ts but with React-Native-friendly
 * storage access and an absolute base URL (no Vite proxy).
 */

import { API_BASE, getStoredBankToken, getStoredConsentId } from "./auth";

const OBIE_PATH = "/api/obie";

function generateInteractionId(): string {
  // RFC 4122-ish v4 UUID without requiring a crypto polyfill.
  const hex = () => Math.floor(Math.random() * 16).toString(16);
  const segment = (n: number) => Array.from({ length: n }, hex).join("");
  return `${segment(8)}-${segment(4)}-4${segment(3)}-${["8", "9", "a", "b"][Math.floor(Math.random() * 4)]}${segment(
    3,
  )}-${segment(12)}`;
}

async function apiCall<T>(path: string): Promise<T> {
  const consentId = await getStoredConsentId();
  const token = await getStoredBankToken();
  if (!consentId && !token) {
    throw new Error("No access token. Please connect your bank account first.");
  }

  const response = await fetch(`${API_BASE}${OBIE_PATH}${path}`, {
    headers: {
      Authorization: `Bearer ${consentId || token}`,
      "x-fapi-interaction-id": generateInteractionId(),
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`API error ${response.status}: ${text || response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Types (mirror OBIE shapes used by the web app)
// ---------------------------------------------------------------------------

export interface OBAccount {
  AccountId: string;
  Currency: string;
  AccountType: string;
  AccountSubType: string;
  Nickname?: string;
  Account?: Array<{
    SchemeName: string;
    Identification: string;
    Name?: string;
  }>;
}

export interface OBBalance {
  AccountId: string;
  Amount: { Amount: string; Currency: string };
  CreditDebitIndicator: "Credit" | "Debit";
  Type: string;
  DateTime: string;
}

export interface OBTransaction {
  AccountId: string;
  TransactionId: string;
  Amount: { Amount: string; Currency: string };
  CreditDebitIndicator: "Credit" | "Debit";
  Status: string;
  BookingDateTime: string;
  ValueDateTime?: string;
  TransactionInformation?: string;
  Balance?: {
    Amount: { Amount: string; Currency: string };
    CreditDebitIndicator: "Credit" | "Debit";
    Type: string;
  };
  MerchantDetails?: {
    MerchantName?: string;
    MerchantCategoryCode?: string;
  };
}

interface AccountsResponse {
  Data: { Account: OBAccount[] };
}
interface BalancesResponse {
  Data: { Balance: OBBalance[] };
}
interface TransactionsResponse {
  Data: { Transaction: OBTransaction[] };
}

// ---------------------------------------------------------------------------
// Public methods
// ---------------------------------------------------------------------------

export async function getAccounts(): Promise<OBAccount[]> {
  const res = await apiCall<AccountsResponse>("/accounts");
  return res.Data?.Account || [];
}

export async function getAllBalances(): Promise<OBBalance[]> {
  const res = await apiCall<BalancesResponse>("/balances");
  return res.Data?.Balance || [];
}

export async function getAllTransactions(): Promise<OBTransaction[]> {
  const res = await apiCall<TransactionsResponse>("/transactions");
  return res.Data?.Transaction || [];
}

export async function getTransactions(accountId: string): Promise<OBTransaction[]> {
  const res = await apiCall<TransactionsResponse>(
    `/accounts/${accountId}/transactions`,
  );
  return res.Data?.Transaction || [];
}
