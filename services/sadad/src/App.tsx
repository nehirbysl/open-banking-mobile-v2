import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import Store from './pages/Store';
import Checkout from './pages/Checkout';
import PaymentCallback from './pages/PaymentCallback';
import MerchantDashboard from './pages/MerchantDashboard';

import type { Product } from './utils/products';
import type { CartItem } from './utils/cart';
import {
  loadCart,
  addToCart,
  decrementItem,
  removeFromCart,
  clearCart as clearCartStorage,
  cartItemCount,
  cartTotal,
} from './utils/cart';

/* ── Theme: merchant blue ─────────────────────────────────── */

const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    blue: [
      '#e7f5ff',
      '#d0ebff',
      '#a5d8ff',
      '#74b9ff',
      '#4dabf7',
      '#339af0',
      '#228be6',
      '#0984E3',
      '#1971c2',
      '#1864ab',
    ],
  },
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  headings: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  defaultRadius: 'md',
});

/* ── Cart context ─────────────────────────────────────────── */

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  add: (product: Product) => void;
  decrement: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCart());

  const add = useCallback(
    (product: Product) => setItems((prev) => addToCart(prev, product)),
    []
  );
  const decrement = useCallback(
    (productId: string) => setItems((prev) => decrementItem(prev, productId)),
    []
  );
  const remove = useCallback(
    (productId: string) => setItems((prev) => removeFromCart(prev, productId)),
    []
  );
  const clear = useCallback(() => setItems(clearCartStorage()), []);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount: cartItemCount(items),
        total: cartTotal(items),
        add,
        decrement,
        remove,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ── Query client ─────────────────────────────────────────── */

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 2 * 60 * 1000,
    },
  },
});

/* ── App ──────────────────────────────────────────────────── */

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <Notifications position="top-right" />
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Store />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment/callback" element={<PaymentCallback />} />
              <Route path="/merchant" element={<MerchantDashboard />} />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
