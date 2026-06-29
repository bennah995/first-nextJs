// app/lib/checkoutStore.js
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const STATES = {
  BROWSING: "browsing",
  CART: "cart",
  INFO: "info",
  PAYMENT: "payment",
  CONFIRMED: "confirmed",
};

const initial = {
  state: STATES.BROWSING,
  info: { name: "", phone: "", address: "" },
  paymentMethod: null,
  orderId: null,
};

export const useCheckout = create(
  persist(
    (set, get) => ({
      ...initial,
      STATES,

      goTo(nextState) {
        // Only allowed transitions. Guard against jumps.
        const allowed = {
          [STATES.BROWSING]: [STATES.CART],
          [STATES.CART]: [STATES.INFO, STATES.BROWSING],
          [STATES.INFO]: [STATES.PAYMENT, STATES.CART],
          [STATES.PAYMENT]: [STATES.CONFIRMED, STATES.INFO],
          [STATES.CONFIRMED]: [STATES.BROWSING],
        };
        const current = get().state;
        if (!allowed[current]?.includes(nextState)) {
          console.warn(`invalid checkout transition: ${current} -> ${nextState}`);
          return false;
        }
        set({ state: nextState });
        return true;
      },

      setInfo(info) {
        set({ info: { ...get().info, ...info } });
      },

      setPaymentMethod(method) {
        set({ paymentMethod: method });
      },

      setOrderId(orderId) {
        set({ orderId });
      },

      reset() {
        set(initial);
      },
    }),
    {
      name: "mctaba-checkout",
      partialize: (s) => ({
        state: s.state,
        info: s.info,
        paymentMethod: s.paymentMethod,
        orderId: s.orderId,
      }),
    }
  )
);