/**
 * Revenue analytics helpers — mirrors services/hisab/src/utils/analytics.ts
 * but adapted for mobile (no browser-specific APIs).
 */

import type { OBTransaction } from "./api";

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

export function formatOMR(amount: number, currency: string = "OMR"): string {
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  return `${formatted} ${currency}`;
}

export function formatCompact(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(amount / 1_000).toFixed(1)}K`;
  return amount.toFixed(0);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function endOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

export function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return startOfDay(d);
}

// ---------------------------------------------------------------------------
// Transaction filters
// ---------------------------------------------------------------------------

export function getTransactionsInRange(
  transactions: OBTransaction[],
  start: Date,
  end: Date
): OBTransaction[] {
  return transactions.filter((t) => {
    const d = new Date(t.BookingDateTime);
    return d >= start && d <= end;
  });
}

export function getThisMonthTransactions(transactions: OBTransaction[]): OBTransaction[] {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0));
  return getTransactionsInRange(transactions, start, end);
}

export function getLastMonthTransactions(transactions: OBTransaction[]): OBTransaction[] {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = endOfDay(new Date(now.getFullYear(), now.getMonth(), 0));
  return getTransactionsInRange(transactions, start, end);
}

export function getTodayTransactions(transactions: OBTransaction[]): OBTransaction[] {
  const today = new Date();
  return transactions.filter((t) => isSameDay(new Date(t.BookingDateTime), today));
}

// ---------------------------------------------------------------------------
// Revenue calculations
// ---------------------------------------------------------------------------

export function sumCredits(transactions: OBTransaction[]): number {
  return transactions
    .filter((t) => t.CreditDebitIndicator === "Credit")
    .reduce((s, t) => s + parseFloat(t.Amount.Amount), 0);
}

export function sumDebits(transactions: OBTransaction[]): number {
  return transactions
    .filter((t) => t.CreditDebitIndicator === "Debit")
    .reduce((s, t) => s + parseFloat(t.Amount.Amount), 0);
}

export function countTransactions(transactions: OBTransaction[]): number {
  return transactions.length;
}

export function averageTransactionValue(transactions: OBTransaction[]): number {
  if (transactions.length === 0) return 0;
  const total = transactions.reduce((s, t) => s + parseFloat(t.Amount.Amount), 0);
  return total / transactions.length;
}

export function percentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// ---------------------------------------------------------------------------
// Time-series aggregations
// ---------------------------------------------------------------------------

export interface DailyRevenue {
  date: string;     // "Mon", "Tue"
  fullDate: string; // "2026-04-12"
  revenue: number;
  count: number;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function getDailyRevenue(
  transactions: OBTransaction[],
  days: number = 7
): DailyRevenue[] {
  const result: DailyRevenue[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = daysAgo(i);
    const dayEnd = endOfDay(d);
    const dayTx = getTransactionsInRange(transactions, d, dayEnd).filter(
      (t) => t.CreditDebitIndicator === "Credit"
    );

    const revenue = dayTx.reduce((s, t) => s + parseFloat(t.Amount.Amount), 0);
    result.push({
      date: DAY_NAMES[d.getDay()],
      fullDate: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      revenue,
      count: dayTx.length,
    });
  }

  return result;
}

export interface MonthlyRevenue {
  month: string;
  year: number;
  revenue: number;
  expenses: number;
  count: number;
}

export function getMonthlyRevenue(
  transactions: OBTransaction[],
  months: number = 6
): MonthlyRevenue[] {
  const result: MonthlyRevenue[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = endOfDay(new Date(now.getFullYear(), now.getMonth() - i + 1, 0));
    const monthTx = getTransactionsInRange(transactions, start, end);

    result.push({
      month: MONTH_NAMES[start.getMonth()],
      year: start.getFullYear(),
      revenue: sumCredits(monthTx),
      expenses: sumDebits(monthTx),
      count: monthTx.length,
    });
  }

  return result;
}

// ---------------------------------------------------------------------------
// Top customers
// ---------------------------------------------------------------------------

export interface TopCustomer {
  name: string;
  totalAmount: number;
  transactionCount: number;
  lastTransaction: string;
}

export function getTopCustomers(
  transactions: OBTransaction[],
  limit: number = 5
): TopCustomer[] {
  const customerMap = new Map<string, TopCustomer>();
  const creditTx = transactions.filter((t) => t.CreditDebitIndicator === "Credit");

  for (const tx of creditTx) {
    const name = tx.MerchantDetails?.MerchantName || tx.TransactionInformation || "Unknown Customer";

    if (!customerMap.has(name)) {
      customerMap.set(name, {
        name,
        totalAmount: 0,
        transactionCount: 0,
        lastTransaction: tx.BookingDateTime,
      });
    }

    const entry = customerMap.get(name);
    if (!entry) continue;
    entry.totalAmount += parseFloat(tx.Amount.Amount);
    entry.transactionCount += 1;
    if (tx.BookingDateTime > entry.lastTransaction) {
      entry.lastTransaction = tx.BookingDateTime;
    }
  }

  return Array.from(customerMap.values())
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// Category breakdown (from MerchantCategoryCode)
// ---------------------------------------------------------------------------

const CATEGORY_LABELS: Record<string, string> = {
  "5411": "Groceries",
  "5812": "Dining",
  "5814": "Fast Food",
  "5541": "Fuel",
  "5912": "Pharmacy",
  "5311": "Retail",
  "5732": "Electronics",
  "5999": "Other retail",
  "4814": "Telecom",
  "4900": "Utilities",
  "6300": "Insurance",
  "4722": "Travel",
  "7011": "Hotels",
  "8011": "Healthcare",
};

function categoryLabel(code: string | undefined): string {
  if (!code) return "Other";
  return CATEGORY_LABELS[code] || `Code ${code}`;
}

export interface CategorySlice {
  label: string;
  amount: number;
  count: number;
}

export function getCategoryBreakdown(transactions: OBTransaction[]): CategorySlice[] {
  const map = new Map<string, CategorySlice>();
  for (const tx of transactions) {
    const label = categoryLabel(tx.MerchantDetails?.MerchantCategoryCode);
    if (!map.has(label)) {
      map.set(label, { label, amount: 0, count: 0 });
    }
    const slice = map.get(label);
    if (!slice) continue;
    slice.amount += parseFloat(tx.Amount.Amount);
    slice.count += 1;
  }
  return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
}

// ---------------------------------------------------------------------------
// Grouped-by-day (for transactions list)
// ---------------------------------------------------------------------------

export interface TransactionGroup {
  dateLabel: string; // "Today", "Yesterday", "Apr 12"
  fullDate: string;
  transactions: OBTransaction[];
  total: number;
}

export function groupByDay(transactions: OBTransaction[]): TransactionGroup[] {
  const today = startOfDay(new Date());
  const yesterday = startOfDay(new Date(Date.now() - 86400_000));

  const groups = new Map<string, TransactionGroup>();

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.BookingDateTime).getTime() - new Date(a.BookingDateTime).getTime()
  );

  for (const tx of sorted) {
    const d = startOfDay(new Date(tx.BookingDateTime));
    const key = d.toISOString();

    let label: string;
    if (d.getTime() === today.getTime()) label = "Today";
    else if (d.getTime() === yesterday.getTime()) label = "Yesterday";
    else label = formatDate(tx.BookingDateTime);

    if (!groups.has(key)) {
      groups.set(key, {
        dateLabel: label,
        fullDate: key,
        transactions: [],
        total: 0,
      });
    }
    const group = groups.get(key);
    if (!group) continue;
    group.transactions.push(tx);
    const signed =
      tx.CreditDebitIndicator === "Credit"
        ? parseFloat(tx.Amount.Amount)
        : -parseFloat(tx.Amount.Amount);
    group.total += signed;
  }

  return Array.from(groups.values());
}
