"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  DeliverySimulationValues,
  PaymentSimulationValues,
  ShippingSimulationValues,
} from "@/lib/schemas";
import type { CartProductSnapshot } from "@/lib/cart-types";
import type { DelayMode, ReflectionAnswers, UrgeTriggerId } from "@/lib/urge";

export type CartLine = {
  productId: string;
  quantity: number;
  snapshot?: CartProductSnapshot;
};

export type SimulatedOrderLine = CartLine & {
  name: string;
  categorySlug: string;
  categoryName: string;
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
  triggers: UrgeTriggerId[];
  delivery: DeliverySimulationValues | null;
  shipping: ShippingSimulationValues | null;
  payment: Pick<PaymentSimulationValues, "methodId"> | null;
  journalEntryAdded: boolean;
  waitingUntil: string | null;
  delayMode: DelayMode | null;
  cooldownUntil: string | null;
  reflection: ReflectionAnswers | null;
};

type CartState = {
  hasHydrated: boolean;
  cart: CartLine[];
  urgeBefore: number | null;
  urgeAfter: number | null;
  urgeTriggers: UrgeTriggerId[];
  browseCheckInDismissedAt: string | null;
  delivery: DeliverySimulationValues | null;
  shipping: ShippingSimulationValues | null;
  payment: Pick<PaymentSimulationValues, "methodId"> | null;
  latestOrder: SimulatedOrder | null;
  simulationHistory: SimulatedOrder[];
  addItem: (productId: string, quantity?: number, snapshot?: CartProductSnapshot) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setUrgeBefore: (value: number) => void;
  setUrgeAfter: (value: number) => void;
  setUrgeTriggers: (values: UrgeTriggerId[]) => void;
  dismissBrowseCheckIn: () => void;
  setDelivery: (values: DeliverySimulationValues) => void;
  setShipping: (values: ShippingSimulationValues) => void;
  setPayment: (values: Pick<PaymentSimulationValues, "methodId">) => void;
  completeSimulation: (order: SimulatedOrder) => void;
  markLatestOrderJournaled: () => void;
  setLatestOrderWaitingUntil: (value: string, delayMode?: DelayMode) => void;
  setLatestOrderCooldownUntil: (value: string) => void;
  setLatestOrderReflection: (value: ReflectionAnswers) => void;
  resetSession: () => void;
  setHasHydrated: (value: boolean) => void;
};

function updateLatestOrderInHistory(
  history: SimulatedOrder[],
  latestOrder: SimulatedOrder | null,
) {
  if (!latestOrder) {
    return history;
  }

  return history.map((order) => (order.id === latestOrder.id ? latestOrder : order));
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      cart: [],
      urgeBefore: null,
      urgeAfter: null,
      urgeTriggers: [],
      browseCheckInDismissedAt: null,
      delivery: null,
      shipping: null,
      payment: null,
      latestOrder: null,
      simulationHistory: [],
      addItem: (productId, quantity = 1, snapshot) =>
        set((state) => {
          const existing = state.cart.find((line) => line.productId === productId);

          if (existing) {
            return {
              cart: state.cart.map((line) =>
                line.productId === productId
                  ? {
                      ...line,
                      quantity: Math.min(line.quantity + quantity, 9),
                      snapshot: snapshot ?? line.snapshot,
                    }
                  : line,
              ),
            };
          }

          return {
            cart: [
              ...state.cart,
              {
                productId,
                quantity: Math.min(quantity, 9),
                ...(snapshot ? { snapshot } : {}),
              },
            ],
          };
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
        set((state) => {
          const latestOrder = state.latestOrder
            ? {
                ...state.latestOrder,
                urgeAfter: value,
              }
            : null;

          return {
            urgeAfter: value,
            latestOrder,
            simulationHistory: updateLatestOrderInHistory(state.simulationHistory, latestOrder),
          };
        }),
      setUrgeTriggers: (values) => set({ urgeTriggers: values }),
      dismissBrowseCheckIn: () => set({ browseCheckInDismissedAt: new Date().toISOString() }),
      setDelivery: (values) => set({ delivery: values }),
      setShipping: (values) => set({ shipping: values }),
      setPayment: (values) => set({ payment: values }),
      completeSimulation: (order) =>
        set((state) => ({
          latestOrder: order,
          simulationHistory: [order, ...state.simulationHistory.filter((item) => item.id !== order.id)].slice(0, 120),
          cart: [],
          urgeAfter: null,
          urgeTriggers: [],
          browseCheckInDismissedAt: null,
          delivery: null,
          shipping: null,
          payment: null,
        })),
      markLatestOrderJournaled: () =>
        set((state) => {
          const latestOrder = state.latestOrder
            ? {
                ...state.latestOrder,
                journalEntryAdded: true,
              }
            : null;

          return {
            latestOrder,
            simulationHistory: updateLatestOrderInHistory(state.simulationHistory, latestOrder),
          };
        }),
      setLatestOrderWaitingUntil: (value, delayMode) =>
        set((state) => {
          const latestOrder = state.latestOrder
            ? {
                ...state.latestOrder,
                waitingUntil: value,
                delayMode: delayMode ?? null,
              }
            : null;

          return {
            latestOrder,
            simulationHistory: updateLatestOrderInHistory(state.simulationHistory, latestOrder),
          };
        }),
      setLatestOrderCooldownUntil: (value) =>
        set((state) => {
          const latestOrder = state.latestOrder
            ? {
                ...state.latestOrder,
                cooldownUntil: value,
              }
            : null;

          return {
            latestOrder,
            simulationHistory: updateLatestOrderInHistory(state.simulationHistory, latestOrder),
          };
        }),
      setLatestOrderReflection: (value) =>
        set((state) => {
          const latestOrder = state.latestOrder
            ? {
                ...state.latestOrder,
                reflection: value,
              }
            : null;

          return {
            latestOrder,
            simulationHistory: updateLatestOrderInHistory(state.simulationHistory, latestOrder),
          };
        }),
      resetSession: () =>
        set({
          cart: [],
          urgeBefore: null,
          urgeAfter: null,
          urgeTriggers: [],
          browseCheckInDismissedAt: null,
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
        urgeTriggers: state.urgeTriggers,
        browseCheckInDismissedAt: state.browseCheckInDismissedAt,
        delivery: state.delivery,
        shipping: state.shipping,
        payment: state.payment,
        simulationHistory: state.simulationHistory.map(redactOrderDelivery),
        latestOrder: state.latestOrder
          ? redactOrderDelivery(state.latestOrder)
          : null,
      }),
    },
  ),
);

function redactOrderDelivery(order: SimulatedOrder): SimulatedOrder {
  return {
    ...order,
    triggers: order.triggers ?? [],
    delayMode: order.delayMode ?? null,
    cooldownUntil: order.cooldownUntil ?? null,
    reflection: order.reflection ?? null,
    delivery: order.delivery
      ? {
          city: "Sanal Şehir",
          district: "Sanal Alan",
          addressType: order.delivery.addressType,
          fictionalAddress: "Dopamin Simülasyon Alanı",
        }
      : null,
  };
}
