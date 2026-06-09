"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  DeliverySimulationValues,
  PaymentSimulationValues,
  ShippingSimulationValues,
} from "@/lib/schemas";

export type CartLine = {
  productId: string;
  quantity: number;
};

export type SimulatedOrderLine = CartLine & {
  name: string;
  price: number;
  image: string;
};

export type SimulatedOrder = {
  id: string;
  createdAt: string;
  lines: SimulatedOrderLine[];
  total: number;
  avoidedSpending: number;
  urgeBefore: number | null;
  urgeAfter: number | null;
  delivery: DeliverySimulationValues | null;
  shipping: ShippingSimulationValues | null;
  payment: Pick<PaymentSimulationValues, "methodId"> | null;
  journalEntryAdded: boolean;
  waitingUntil: string | null;
};

type CartState = {
  hasHydrated: boolean;
  cart: CartLine[];
  urgeBefore: number | null;
  urgeAfter: number | null;
  delivery: DeliverySimulationValues | null;
  shipping: ShippingSimulationValues | null;
  payment: Pick<PaymentSimulationValues, "methodId"> | null;
  latestOrder: SimulatedOrder | null;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setUrgeBefore: (value: number) => void;
  setUrgeAfter: (value: number) => void;
  setDelivery: (values: DeliverySimulationValues) => void;
  setShipping: (values: ShippingSimulationValues) => void;
  setPayment: (values: Pick<PaymentSimulationValues, "methodId">) => void;
  completeSimulation: (order: SimulatedOrder) => void;
  markLatestOrderJournaled: () => void;
  setLatestOrderWaitingUntil: (value: string) => void;
  resetSession: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      cart: [],
      urgeBefore: null,
      urgeAfter: null,
      delivery: null,
      shipping: null,
      payment: null,
      latestOrder: null,
      addItem: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.cart.find((line) => line.productId === productId);

          if (existing) {
            return {
              cart: state.cart.map((line) =>
                line.productId === productId
                  ? { ...line, quantity: Math.min(line.quantity + quantity, 9) }
                  : line,
              ),
            };
          }

          return { cart: [...state.cart, { productId, quantity: Math.min(quantity, 9) }] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          cart: state.cart.filter((line) => line.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart:
            quantity <= 0
              ? state.cart.filter((line) => line.productId !== productId)
              : state.cart.map((line) =>
                  line.productId === productId
                    ? { ...line, quantity: Math.min(quantity, 9) }
                    : line,
                ),
        })),
      clearCart: () => set({ cart: [] }),
      setUrgeBefore: (value) => set({ urgeBefore: value }),
      setUrgeAfter: (value) =>
        set((state) => ({
          urgeAfter: value,
          latestOrder: state.latestOrder
            ? {
                ...state.latestOrder,
                urgeAfter: value,
              }
            : null,
        })),
      setDelivery: (values) => set({ delivery: values }),
      setShipping: (values) => set({ shipping: values }),
      setPayment: (values) => set({ payment: values }),
      completeSimulation: (order) =>
        set({
          latestOrder: order,
          cart: [],
          urgeAfter: null,
          delivery: null,
          shipping: null,
          payment: null,
        }),
      markLatestOrderJournaled: () =>
        set((state) => ({
          latestOrder: state.latestOrder
            ? {
                ...state.latestOrder,
                journalEntryAdded: true,
              }
            : null,
        })),
      setLatestOrderWaitingUntil: (value) =>
        set((state) => ({
          latestOrder: state.latestOrder
            ? {
                ...state.latestOrder,
                waitingUntil: value,
              }
            : null,
        })),
      resetSession: () =>
        set({
          cart: [],
          urgeBefore: null,
          urgeAfter: null,
          delivery: null,
          shipping: null,
          payment: null,
          latestOrder: null,
        }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "dopamin-simulation-session",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        cart: state.cart,
        urgeBefore: state.urgeBefore,
        urgeAfter: state.urgeAfter,
        shipping: state.shipping,
        payment: state.payment,
        latestOrder: state.latestOrder
          ? {
              ...state.latestOrder,
              delivery: state.latestOrder.delivery
                ? {
                    city: "Sanal Şehir",
                    district: "Sanal Alan",
                    addressType: state.latestOrder.delivery.addressType,
                    fictionalAddress: "Dopamin Simülasyon Alanı",
                  }
                : null,
            }
          : null,
      }),
    },
  ),
);
