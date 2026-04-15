/**
 * Cart store — zustand + AsyncStorage persistence.
 *
 * Single source of truth for line items, quantities, and totals.
 * Survives app restarts via AsyncStorage hydration on boot.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from './products';

export interface CartLine {
  productId: string;
  name: string;
  price: number;
  kind: Product['kind'];
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  add: (product: Product, qty?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (product, qty = 1) => {
        set((state) => {
          const existing = state.lines.find((l) => l.productId === product.id);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === product.id
                  ? { ...l, quantity: l.quantity + qty }
                  : l,
              ),
            };
          }
          return {
            lines: [
              ...state.lines,
              {
                productId: product.id,
                name: product.name,
                price: product.price,
                kind: product.kind,
                quantity: qty,
              },
            ],
          };
        });
      },
      remove: (productId) => {
        set((state) => ({
          lines: state.lines.filter((l) => l.productId !== productId),
        }));
      },
      setQuantity: (productId, qty) => {
        set((state) => ({
          lines:
            qty <= 0
              ? state.lines.filter((l) => l.productId !== productId)
              : state.lines.map((l) =>
                  l.productId === productId ? { ...l, quantity: qty } : l,
                ),
        }));
      },
      clear: () => set({ lines: [] }),
      count: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: () =>
        get().lines.reduce((sum, l) => sum + l.quantity * l.price, 0),
    }),
    {
      name: 'salalah-cart-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const SHIPPING_FLAT = 2.5;
export const VAT_RATE = 0.05;

export function computeTotals(subtotal: number) {
  const shipping = subtotal > 0 ? SHIPPING_FLAT : 0;
  const vat = +(subtotal * VAT_RATE).toFixed(3);
  const total = +(subtotal + shipping + vat).toFixed(3);
  return { subtotal, shipping, vat, total };
}
