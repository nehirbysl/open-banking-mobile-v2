# Salalah Souq — Mobile App

Expo (React Native) version of the Salalah Souq Omani heritage gift store, paired with the Bank Dhofar Sadad payment gateway.

## Screens

| Route | Purpose |
| --- | --- |
| `(public)/store` | Landing with parallax hero, featured carousel, categories, and new arrivals |
| `(public)/products` | Full catalogue grid with search, category filter, and sort |
| `(public)/products/[id]` | Product detail with image carousel, rating, highlights, reviews, add-to-cart |
| `(public)/cart` | Cart with quantity steppers, VAT/shipping totals, checkout CTA |
| `(public)/checkout` | Delivery details + payment method selection, Sadad → BD Online deep-link |
| `(public)/checkout/success` | Confetti + receipt after approval |
| `(public)/about` | Brand story and Bank Dhofar partnership |

## Stack

- **Expo 51** (SDK 51), **expo-router 3** typed routes
- **react-native-reanimated** for parallax, card animations, confetti
- **react-native-svg** for heritage product illustrations
- **zustand + AsyncStorage** for persistent cart state
- **expo-haptics**, **expo-sharing**, **expo-linear-gradient**

## Theme

Orange (`#D35400`) primary with earthy gold accents and cream backgrounds — premium Omani heritage look. English-only copy.
