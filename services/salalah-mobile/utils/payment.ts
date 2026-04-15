/**
 * Payment utilities — Sadad gateway deep-link stub.
 *
 * In production this would POST the cart + amount to the Sadad gateway,
 * receive a payment URL, then deep-link into the BD Online auth flow.
 * For the app demo we generate a deterministic receipt id.
 */

export interface PaymentIntent {
  merchantRef: string;
  amount: number;
  currency: 'OMR';
  initiatedAt: string;
}

export function createPaymentIntent(amount: number): PaymentIntent {
  const merchantRef = `SLH-${Date.now().toString(36).toUpperCase()}`;
  return {
    merchantRef,
    amount: +amount.toFixed(3),
    currency: 'OMR',
    initiatedAt: new Date().toISOString(),
  };
}

export function formatMerchantRef(ref: string): string {
  // SLH-ABCDEFGH -> SLH-ABCD-EFGH
  const raw = ref.replace('SLH-', '');
  if (raw.length <= 4) return ref;
  const mid = Math.ceil(raw.length / 2);
  return `SLH-${raw.slice(0, mid)}-${raw.slice(mid)}`;
}
