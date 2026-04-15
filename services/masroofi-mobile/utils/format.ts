/**
 * Formatting helpers shared across screens.
 */

export function formatAmount(amount: number, currency: string = "OMR"): string {
  return `${amount.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })} ${currency}`;
}

export function formatAmountShort(amount: number, currency: string = "OMR"): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M ${currency}`;
  }
  if (abs >= 10_000) {
    return `${(amount / 1_000).toFixed(1)}K ${currency}`;
  }
  return formatAmount(amount, currency);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

export function monthLabel(date: Date): string {
  return date.toLocaleDateString("en-GB", { month: "short" });
}
