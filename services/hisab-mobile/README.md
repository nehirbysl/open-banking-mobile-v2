# Hisab Mobile

Expo (React Native) mobile app for **Hisab** — the B2B / SME revenue analytics product
powered by Bank Dhofar Open Banking.

This is the mobile companion to the web app at
`https://hisab.tnd.bankdhofar.com`. It reuses the same backend APIs:

- **Hisab auth** — email/password against `/api/auth/*` on the Hisab service
- **Consent service** — `https://qantara.tnd.bankdhofar.com/consents` for creating
  an OBIE account-access consent
- **BD Online approval** — browser-based OAuth step at
  `https://banking.tnd.bankdhofar.com/consent/approve` with deep-link
  callback `hisab://callback`
- **OBIE AISP** — account / balance / transaction data via
  `https://qantara.tnd.bankdhofar.com/open-banking/v4.0/aisp`

## Features

- **Welcome / Signup / Login** — clean public entry for SMEs
- **Dashboard** — hero KPI strip (today / MTD revenue, txn count, avg ticket),
  live revenue counter, sparklines, recent transactions
- **Transactions** — filterable list with status pills and date headers
- **Customers** — top-customer ranking with avatar monograms, total spend, last seen
- **Analytics** — revenue area chart, category donut, customer cohort bars,
  date-range picker
- **More** — connect / disconnect bank, profile, sign out

## Design

- Teal primary `#00B894`, accent `#00CEC9` — premium B2B "Stripe Atlas" feel
- Pull-to-refresh on every data screen
- Skeleton loaders during fetch
- Tabular figures for numbers (`fontVariant: ["tabular-nums"]`)
- English only

## Running locally

```bash
cd services/hisab-mobile
npm install
npx expo start
```

Then scan the QR with the Expo Go app.

## Type-check

```bash
npx tsc --noEmit
```

## Project structure

```
app/
  _layout.tsx            Root layout with auth gating
  (public)/
    _layout.tsx
    welcome.tsx          Landing / value proposition
    signup.tsx           Register SME account
    login.tsx            Email + password login
    connect.tsx          Start OAuth flow to BD Online
    callback.tsx         Deep-link handler (hisab://callback)
  (auth)/
    _layout.tsx          Bottom tab navigator
    index.tsx            Dashboard — KPIs, sparklines, recent tx
    transactions.tsx     Filterable transaction list
    customers.tsx        Top customers ranking
    analytics.tsx        Charts + date-range picker
    more.tsx             Profile, connect/disconnect, sign out
components/
  KpiCard.tsx            Hero KPI with delta %
  Sparkline.tsx          SVG 7-day mini-chart
  RevenueCounter.tsx     Animated live-ticking revenue number
  TransactionRow.tsx     List row with merchant + amount + status pill
  StatusPill.tsx         Colored badge for Booked / Pending / Rejected
  AreaChart.tsx          victory-native area chart
  DonutChart.tsx         victory-native donut
  BarChart.tsx           victory-native bar
  Skeleton.tsx           Shimmer placeholder
  EmptyState.tsx         CTA when no data
  DateRangePicker.tsx    7d / 30d / 90d / custom
utils/
  theme.ts               Teal color tokens, spacing, radius
  auth.ts                Email/password login, session
  consent.ts             OBIE consent + OAuth deep-link flow
  api.ts                 AISP client (accounts / balances / transactions)
  analytics.ts           Revenue calcs, top customers, time series
  storage.ts             AsyncStorage/SecureStore wrappers
```
