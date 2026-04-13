import type { Product } from './products';

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_KEY = 'sadad_cart';

/**
 * Load cart from localStorage.
 */
export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

/**
 * Save cart to localStorage.
 */
export function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

/**
 * Add a product to the cart (increment quantity if already present).
 */
export function addToCart(items: CartItem[], product: Product): CartItem[] {
  const existing = items.find((i) => i.product.id === product.id);
  let next: CartItem[];
  if (existing) {
    next = items.map((i) =>
      i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
    );
  } else {
    next = [...items, { product, quantity: 1 }];
  }
  saveCart(next);
  return next;
}

/**
 * Remove one unit of a product from the cart.
 */
export function decrementItem(items: CartItem[], productId: string): CartItem[] {
  const next = items
    .map((i) =>
      i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i
    )
    .filter((i) => i.quantity > 0);
  saveCart(next);
  return next;
}

/**
 * Remove a product entirely from the cart.
 */
export function removeFromCart(items: CartItem[], productId: string): CartItem[] {
  const next = items.filter((i) => i.product.id !== productId);
  saveCart(next);
  return next;
}

/**
 * Clear the entire cart.
 */
export function clearCart(): CartItem[] {
  localStorage.removeItem(CART_KEY);
  return [];
}

/**
 * Get total item count.
 */
export function cartItemCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

/**
 * Get cart total in OMR.
 */
export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
}
