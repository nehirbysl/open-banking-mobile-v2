# Masroofi Mobile

Expo (React Native) companion to the Masroofi web PFM app at
`https://masroofi.tnd.bankdhofar.com`. Same backend, same OBIE AISP
endpoints, same BD Online OAuth consent flow — wrapped in a native
mobile experience.

## Stack

- Expo SDK 51 + expo-router (typed routes)
- React Native Reanimated 3 for tab / list animations
- react-native-svg for donut + sparkline charts
- expo-linking for BD Online deep-link handshake
- expo-secure-store for bank credentials at rest

## Screens

| Route | Purpose |
|---|---|
| `/(public)/welcome` | Hero landing + feature showcase |
| `/(public)/signup` | Create Masroofi account |
| `/(public)/login` | Sign in to Masroofi |
| `/(public)/connect` | Launch BD Online consent flow |
| `/(public)/callback` | Handle `masroofi://callback?code=...` deep-link |
| `/(auth)/index` | Dashboard (tab 1) — balance, income vs spending, top categories |
| `/(auth)/transactions` | Transactions (tab 2) — search + category filters |
| `/(auth)/spending` | Spending (tab 3) — donut + merchants + monthly trend |
| `/(auth)/more` | More (tab 4) — bank link, preferences, sign-out |

## Consent flow

1. User taps **Connect Bank Dhofar** on `/(public)/connect`.
2. App POSTs `/api/consent` to create an account-access consent.
3. App opens `bdonline://consent/approve?consent_id=...&redirect_uri=masroofi://callback&state=...` (falls back to the web page if BD Online is not installed).
4. BD Online approves and redirects to `masroofi://callback?code=...&state=...`.
5. Root layout catches the deep link, routes to `/callback`.
6. `/callback` validates state and exchanges the code at `/api/auth-codes/exchange`.
7. Bank credentials go into `SecureStore` + the Masroofi backend record.

## Development

```bash
# Install (run on a real Expo dev machine, NOT the mgmt VM)
yarn install
yarn start

# Type check only
yarn typecheck
```

No Docker image, no helm chart — distribution is via the Expo/EAS
pipeline. The `.gitlab-ci.yml` in the repo root intentionally does
**not** contain a build job for this service.
