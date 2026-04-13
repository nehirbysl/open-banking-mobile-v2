/**
 * Payment flow utilities for OBIE domestic-payment consents.
 *
 * Flow:
 * 1. Create domestic-payment consent via consent-service (POST /consents)
 * 2. Redirect user to BD Online for approval
 * 3. BD Online executes payment on approval, redirects back with consent_id + code
 * 4. Sadad shows payment confirmation / receipt
 */

const CONSENT_SERVICE_URL = '/api/consent';
const BD_ONLINE_BASE = 'https://banking.tnd.bankdhofar.com';
const SADAD_REDIRECT_URI = 'https://sadad.tnd.bankdhofar.com/payment/callback';
const CLIENT_ID = 'sadad-payment-gateway';

const STATE_KEY = 'sadad_payment_state';
const CONSENT_KEY = 'sadad_consent_id';
const ORDER_REF_KEY = 'sadad_order_ref';

/** Merchant account details */
export const MERCHANT = {
  name: 'Salalah Electronics',
  nameAr: '\u0635\u0644\u0627\u0644\u0629 \u0644\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A',
  iban: 'OM02DHOF0001020099887701',
  accountId: 'DHOF-20001',
  customerId: 'CUST-SALEL',
};

export interface ConsentResponse {
  consent_id: string;
  status: string;
  created_at: string;
}

/**
 * Generate a unique order reference.
 */
export function generateOrderRef(): string {
  const now = new Date();
  const year = now.getFullYear();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `INV-${year}-${rand}`;
}

/**
 * Generate a cryptographic random state parameter for CSRF protection.
 */
function generateState(): string {
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a domestic-payment consent via the consent service.
 */
export async function createPaymentConsent(
  amount: number,
  reference: string
): Promise<ConsentResponse> {
  const response = await fetch(CONSENT_SERVICE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      consent_type: 'domestic-payment',
      tpp_id: CLIENT_ID,
      permissions: [],
      payment_details: {
        instructed_amount: {
          amount: amount.toFixed(3),
          currency: 'OMR',
        },
        creditor_account: {
          iban: MERCHANT.iban,
          name: MERCHANT.name,
        },
        reference,
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to create payment consent: ${response.status} ${text}`);
  }

  return response.json();
}

/**
 * Build the URL to redirect the user to BD Online for payment approval.
 */
export function buildPaymentRedirectUrl(consentId: string): string {
  const state = generateState();
  localStorage.setItem(STATE_KEY, state);

  const params = new URLSearchParams({
    consent_id: consentId,
    redirect_uri: SADAD_REDIRECT_URI,
    state,
    client_id: CLIENT_ID,
  });

  return `${BD_ONLINE_BASE}/consent/approve?${params.toString()}`;
}

/**
 * Validate the state parameter from the callback.
 */
export function validateState(receivedState: string): boolean {
  const stored = localStorage.getItem(STATE_KEY);
  localStorage.removeItem(STATE_KEY);
  return stored === receivedState;
}

/**
 * Store consent ID and order reference for the payment flow.
 */
export function storePaymentContext(consentId: string, orderRef: string): void {
  localStorage.setItem(CONSENT_KEY, consentId);
  localStorage.setItem(ORDER_REF_KEY, orderRef);
}

/**
 * Retrieve stored consent ID.
 */
export function getStoredConsentId(): string | null {
  return localStorage.getItem(CONSENT_KEY);
}

/**
 * Retrieve stored order reference.
 */
export function getStoredOrderRef(): string | null {
  return localStorage.getItem(ORDER_REF_KEY);
}

/**
 * Clear payment context after completion.
 */
export function clearPaymentContext(): void {
  localStorage.removeItem(CONSENT_KEY);
  localStorage.removeItem(ORDER_REF_KEY);
  localStorage.removeItem(STATE_KEY);
}

/**
 * Fetch transactions for the merchant account (for the dashboard).
 */
export async function fetchMerchantTransactions(): Promise<MerchantTransaction[]> {
  const response = await fetch(`/api/banking/accounts/${MERCHANT.accountId}/transactions`);
  if (!response.ok) {
    // Return mock data for demo if API not available
    return generateMockTransactions();
  }
  const data = await response.json();
  return data.transactions || data;
}

export interface MerchantTransaction {
  id: string;
  date: string;
  reference: string;
  customer_name: string;
  amount: number;
  currency: string;
  status: string;
  type: 'credit' | 'debit';
}

/**
 * Generate mock transactions for demo purposes when banking API is unavailable.
 */
function generateMockTransactions(): MerchantTransaction[] {
  const customers = [
    'Ahmed Al-Rawahi',
    'Fatima Al-Balushi',
    'Khalid Al-Habsi',
    'Maryam Al-Kindi',
    'Said Al-Mahri',
    'Layla Al-Zadjali',
    'Omar Al-Busaidi',
    'Noura Al-Rashdi',
  ];

  const products = [
    { name: 'Frankincense Gift Set', price: 12.5 },
    { name: 'Khanjar Display Stand', price: 85.0 },
    { name: 'Coffee Set with Dallah', price: 45.0 },
    { name: 'Dhofar Honey 1kg', price: 28.0 },
    { name: 'Muscat Dates Premium Box', price: 18.5 },
    { name: 'Bukhoor Burner Set', price: 35.0 },
  ];

  const txns: MerchantTransaction[] = [];
  const now = new Date();

  for (let i = 0; i < 15; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now.getTime() - daysAgo * 86400000);
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const qty = Math.floor(Math.random() * 3) + 1;
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();

    txns.push({
      id: `TXN-${i + 1}`,
      date: date.toISOString(),
      reference: `INV-2026-${rand}`,
      customer_name: customer,
      amount: product.price * qty,
      currency: 'OMR',
      status: 'completed',
      type: 'credit',
    });
  }

  // Sort by date descending
  txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return txns;
}
