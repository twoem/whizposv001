import { create } from 'zustand';
import { CartItem } from '../shared/types';
import { TAX_RATE } from '../shared/constants';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => set((state) => {
    const existing = state.items.find(i => i.productId === item.productId);
    if (existing) {
      return {
        items: state.items.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      };
    }
    return { items: [...state.items, item] };
  }),
  removeItem: (productId) => set((state) => ({
    items: state.items.filter(i => i.productId !== productId)
  })),
  updateQuantity: (productId, quantity) => set((state) => ({
    items: state.items.map(i =>
      i.productId === productId ? { ...i, quantity } : i
    ).filter(i => i.quantity > 0)
  })),
  clearCart: () => set({ items: [] }),
  getSubtotal: () => {
    const state = get();
    return state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },
  getTax: () => {
    const state = get();
    const subtotal = state.getSubtotal();
    return Math.round(subtotal * TAX_RATE * 100) / 100;
  },
  getTotal: () => {
    const state = get();
    return state.getSubtotal() + state.getTax();
  },
}));
