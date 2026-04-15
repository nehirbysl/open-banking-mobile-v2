/**
 * Transaction categorisation rules for Masroofi mobile.
 * Mirrors the web app's categories.ts so users see the same labels
 * and colours on both platforms.
 */

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string; // Ionicons name
  emoji: string;
  patterns: RegExp[];
}

export const CATEGORIES: Category[] = [
  {
    id: "salary",
    name: "Salary & Income",
    color: "#00b894",
    icon: "cash-outline",
    emoji: "\u{1F4B0}",
    patterns: [/salary/i, /payroll/i, /wage/i, /income/i, /bonus/i, /commission/i],
  },
  {
    id: "groceries",
    name: "Groceries",
    color: "#fdcb6e",
    icon: "cart-outline",
    emoji: "\u{1F6D2}",
    patterns: [
      /lulu/i, /carrefour/i, /al.?fair/i, /nesto/i, /spar/i, /grocery/i, /supermarket/i,
      /al.?meera/i, /sultan.?center/i, /al.?safeer/i, /market/i, /hyper/i, /provision/i,
    ],
  },
  {
    id: "telecom",
    name: "Telecom",
    color: "#0984e3",
    icon: "phone-portrait-outline",
    emoji: "\u{1F4F1}",
    patterns: [/omantel/i, /ooredoo/i, /awasr/i, /telecom/i, /internet/i, /mobile/i, /recharge/i],
  },
  {
    id: "transport",
    name: "Transport & Fuel",
    color: "#636e72",
    icon: "car-outline",
    emoji: "\u{1F697}",
    patterns: [
      /shell/i, /petrol/i, /fuel/i, /oomco/i, /al.?maha/i, /taxi/i, /uber/i, /parking/i,
      /transport/i, /careem/i, /gas.?station/i,
    ],
  },
  {
    id: "dining",
    name: "Dining & Food",
    color: "#e17055",
    icon: "restaurant-outline",
    emoji: "\u{1F37D}",
    patterns: [
      /restaurant/i, /kfc/i, /mcdonald/i, /pizza/i, /food/i, /bakery/i, /grill/i,
      /kempinski/i, /chedi/i, /shangri.?la/i, /w.?hotel/i, /rotana/i, /burger/i,
      /subway/i, /domino/i, /shawarma/i, /biryani/i,
    ],
  },
  {
    id: "coffee",
    name: "Coffee & Cafe",
    color: "#e77f67",
    icon: "cafe-outline",
    emoji: "\u2615",
    patterns: [
      /starbucks/i, /costa/i, /tim.?horton/i, /coffee/i, /cafe/i, /caffe/i,
      /second.?cup/i, /%\s*arabica/i, /caribou/i,
    ],
  },
  {
    id: "shopping",
    name: "Shopping",
    color: "#a29bfe",
    icon: "bag-outline",
    emoji: "\u{1F455}",
    patterns: [
      /mall/i, /store/i, /fashion/i, /clothing/i, /zara/i, /h&m/i, /purchase/i,
      /marks.?\&?.?spencer/i, /centrepoint/i, /centerpoint/i, /max\b/i, /splash/i,
      /home.?centre/i, /ikea/i, /daiso/i, /mothercare/i,
    ],
  },
  {
    id: "online",
    name: "Online Shopping",
    color: "#6c5ce7",
    icon: "globe-outline",
    emoji: "\u{1F6CD}",
    patterns: [
      /amazon/i, /netflix/i, /spotify/i, /apple/i, /google.?play/i, /itunes/i,
      /noon/i, /namshi/i, /shein/i, /ali.?express/i, /ebay/i,
    ],
  },
  {
    id: "utilities",
    name: "Utilities",
    color: "#00cec9",
    icon: "flash-outline",
    emoji: "\u26A1",
    patterns: [
      /electricity/i, /water/i, /\bgas\b/i, /utility/i, /bill/i, /muscat.?electricity/i,
      /nama/i, /haya/i, /diam\b/i, /mazoon/i,
    ],
  },
  {
    id: "housing",
    name: "Housing & Rent",
    color: "#55a3e8",
    icon: "home-outline",
    emoji: "\u{1F3E0}",
    patterns: [
      /rent/i, /muscat.?propert/i, /real.?estate/i, /landlord/i, /housing/i,
      /maintenance/i, /property/i,
    ],
  },
  {
    id: "transfers",
    name: "Transfers",
    color: "#74b9ff",
    icon: "swap-horizontal-outline",
    emoji: "\u{1F4E4}",
    patterns: [/transfer/i, /remittance/i, /swift/i, /wire/i, /send money/i],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    color: "#ff7675",
    icon: "heart-outline",
    emoji: "\u{1F4AA}",
    patterns: [
      /hospital/i, /clinic/i, /pharmacy/i, /doctor/i, /medical/i, /health/i,
      /gym/i, /fitness/i, /muscle/i,
    ],
  },
  {
    id: "insurance",
    name: "Insurance",
    color: "#636e72",
    icon: "shield-outline",
    emoji: "\u{1F6E1}",
    patterns: [/insurance/i, /policy/i, /premium/i, /takaful/i, /dhofar.?ins/i],
  },
  {
    id: "education",
    name: "Education",
    color: "#fab1a0",
    icon: "school-outline",
    emoji: "\u{1F393}",
    patterns: [/school/i, /university/i, /college/i, /tuition/i, /education/i, /training/i],
  },
  {
    id: "other",
    name: "Other",
    color: "#b2bec3",
    icon: "apps-outline",
    emoji: "\u{1F4CC}",
    patterns: [],
  },
];

export function categorizeTransaction(description: string | undefined): Category {
  if (!description) return CATEGORIES[CATEGORIES.length - 1];

  for (const cat of CATEGORIES) {
    if (cat.id === "other") continue;
    for (const pattern of cat.patterns) {
      if (pattern.test(description)) return cat;
    }
  }
  return CATEGORIES[CATEGORIES.length - 1];
}

export interface SpendingSummary {
  category: Category;
  total: number;
  count: number;
  percentage: number;
}

interface AnyTransaction {
  CreditDebitIndicator: "Credit" | "Debit";
  Amount: { Amount: string };
  TransactionInformation?: string;
  MerchantDetails?: { MerchantName?: string };
}

export function buildSpendingSummary(transactions: AnyTransaction[]): SpendingSummary[] {
  const totals = new Map<string, { total: number; count: number }>();

  for (const tx of transactions) {
    if (tx.CreditDebitIndicator !== "Debit") continue;
    const cat = categorizeTransaction(tx.TransactionInformation);
    const existing = totals.get(cat.id) || { total: 0, count: 0 };
    existing.total += parseFloat(tx.Amount.Amount);
    existing.count += 1;
    totals.set(cat.id, existing);
  }

  const grandTotal = Array.from(totals.values()).reduce((s, v) => s + v.total, 0);

  const summary: SpendingSummary[] = [];
  for (const cat of CATEGORIES) {
    const entry = totals.get(cat.id);
    if (entry && entry.total > 0) {
      summary.push({
        category: cat,
        total: entry.total,
        count: entry.count,
        percentage: grandTotal > 0 ? (entry.total / grandTotal) * 100 : 0,
      });
    }
  }

  summary.sort((a, b) => b.total - a.total);
  return summary;
}

export interface MerchantSummary {
  name: string;
  total: number;
  count: number;
  category: Category;
}

export function buildMerchantSummary(
  transactions: AnyTransaction[],
  limit: number = 10,
): MerchantSummary[] {
  const merchants = new Map<
    string,
    { total: number; count: number; category: Category; display: string }
  >();

  for (const tx of transactions) {
    if (tx.CreditDebitIndicator !== "Debit") continue;
    const raw = tx.MerchantDetails?.MerchantName || tx.TransactionInformation || "Unknown";
    const name = raw.trim().replace(/\s+/g, " ").substring(0, 60);
    const key = name.toLowerCase();
    const existing =
      merchants.get(key) ||
      { total: 0, count: 0, category: categorizeTransaction(raw), display: name };
    existing.total += parseFloat(tx.Amount.Amount);
    existing.count += 1;
    if (!merchants.has(key)) merchants.set(key, existing);
    else merchants.set(key, existing);
  }

  return Array.from(merchants.values())
    .map((v) => ({
      name: v.display.replace(/\b\w/g, (c) => c.toUpperCase()),
      total: v.total,
      count: v.count,
      category: v.category,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

/**
 * Build a 30-day daily-spend sparkline for a single category.
 */
export function buildCategorySparkline(
  transactions: AnyTransaction[],
  categoryId: string,
  days: number = 30,
): number[] {
  const now = new Date();
  const buckets = new Array(days).fill(0) as number[];

  for (const tx of transactions) {
    if (tx.CreditDebitIndicator !== "Debit") continue;
    const cat = categorizeTransaction(tx.TransactionInformation);
    if (cat.id !== categoryId) continue;
    const txDate = new Date((tx as { BookingDateTime?: string }).BookingDateTime || now);
    const diffDays = Math.floor((now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0 || diffDays >= days) continue;
    const bucketIdx = days - 1 - diffDays;
    buckets[bucketIdx] += parseFloat(tx.Amount.Amount);
  }

  return buckets;
}

/**
 * Build a per-month spend total for the last N months.
 */
export function buildMonthlyTrend(
  transactions: AnyTransaction[],
  months: number = 6,
): { label: string; total: number }[] {
  const result: { label: string; total: number }[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
    let total = 0;
    for (const tx of transactions) {
      if (tx.CreditDebitIndicator !== "Debit") continue;
      const d = new Date((tx as { BookingDateTime?: string }).BookingDateTime || now);
      if (d >= start && d <= end) total += parseFloat(tx.Amount.Amount);
    }
    result.push({
      label: start.toLocaleDateString("en-GB", { month: "short" }),
      total,
    });
  }

  return result;
}
