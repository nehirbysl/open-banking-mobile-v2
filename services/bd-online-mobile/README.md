# Bank Dhofar Online — Mobile

Expo (React Native) mobile companion to the [bd-online](../bd-online) web banking
app at https://banking.tnd.bankdhofar.com.

English-only. Bank Dhofar green theme. Premium banking-app UX.

## Tech

- Expo SDK 51 + expo-router (file-based routing)
- expo-secure-store for the `manara_session` cookie on native
- expo-camera for QR scanning (auto-loan flow)
- expo-haptics for tactile feedback
- expo-linear-gradient + react-native-svg for hero gradients & sparklines
- react-native-reanimated for animated balance count-up & success transitions

## Routes

| Path                              | Purpose                                              |
| --------------------------------- | ---------------------------------------------------- |
| `(public)/login`                  | Email + password sign-in (`/api/bank-auth/login`)    |
| `(auth)/index`                    | Home: hero balance, accounts, recent activity        |
| `(auth)/transfer`                 | Transfer between accounts / beneficiary / IBAN       |
| `(auth)/consents`                 | Open Banking consent list (All / Active / Pending)   |
| `(auth)/consents/[id]`            | Consent detail with revoke action                    |
| `(auth)/consent/approve`          | Deep-link consent approval — `bdonline://consent/approve?consent_id=...` |
| `(auth)/accounts/[id]`            | Account detail with full transaction history        |
| `(auth)/loan/scan`                | QR scanner for the auto-loan-origination flow       |
| `(auth)/more`                     | Beneficiaries, settings, sign-out                   |

## Backend

All HTTP requests target `https://banking.tnd.bankdhofar.com/api/...` and
`/banking/...` — same APIs as the web app. CORS is allowed for the mobile
origins. Authentication is session-cookie based (`manara_session`).

## Develop

```bash
cd services/bd-online-mobile
npx expo install
npx expo start --web   # web preview for sanity
# Mobile preview: load via the DMZ Expo Metro proxy (issue #379)
```

## Type-check

```bash
npx tsc --noEmit
```
