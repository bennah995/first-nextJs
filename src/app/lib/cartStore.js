// app/lib/cartStore.js
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
  items: [],
};

export const useCart = create(
  persist(
    (set, get) => ({
      ...initialState,

      addItem(product, quantity = 1) {
        const items = get().items;
        const existing = items.find((i) => i.id === product.id);

        if (existing) {
          set({
            items: items.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: product.id,
                slug: product.slug,
                name: product.name,
                price_cents: product.price_cents,
                image_url: product.image_url,
                quantity,
              },
            ],
          });
        }
      },

      removeItem(productId) {
        set({ items: get().items.filter((i) => i.id !== productId) });
      },

      setQuantity(productId, quantity) {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === productId ? { ...i, quantity } : i
          ),
        });
      },

      clear() {
        set(initialState);
      },

      // Derived state -- computed on every read.
      totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      totalCents() {
        return get().items.reduce((sum, i) => sum + i.quantity * i.price_cents, 0);
      },
    }),
    {
      name: "mctaba-cart",
      // Only persist items, not the functions
      partialize: (state) => ({ items: state.items }),
    }
  )
);