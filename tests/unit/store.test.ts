import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@/store/use-cart-store";

describe("Cart and Simulation Store", () => {
  beforeEach(() => {
    // Reset state before each test
    useCartStore.getState().resetSession();
  });

  it("should start with empty state", () => {
    const state = useCartStore.getState();
    expect(state.cart).toEqual([]);
    expect(state.urgeBefore).toBeNull();
    expect(state.urgeAfter).toBeNull();
    expect(state.delivery).toBeNull();
    expect(state.shipping).toBeNull();
    expect(state.payment).toBeNull();
    expect(state.latestOrder).toBeNull();
  });

  it("should add item and increment quantity if added again", () => {
    // Add item first time
    useCartStore.getState().addItem("prd-001", 1);
    let state = useCartStore.getState();
    expect(state.cart).toHaveLength(1);
    expect(state.cart[0]).toEqual({ productId: "prd-001", quantity: 1 });

    // Add item second time
    useCartStore.getState().addItem("prd-001", 2);
    state = useCartStore.getState();
    expect(state.cart).toHaveLength(1);
    expect(state.cart[0]).toEqual({ productId: "prd-001", quantity: 3 });
  });

  it("should clamp quantity to max 9", () => {
    useCartStore.getState().addItem("prd-001", 10);
    const state = useCartStore.getState();
    expect(state.cart[0]?.quantity).toBe(9);
  });

  it("should remove item from cart", () => {
    useCartStore.getState().addItem("prd-001", 1);
    useCartStore.getState().addItem("prd-002", 1);
    expect(useCartStore.getState().cart).toHaveLength(2);

    useCartStore.getState().removeItem("prd-001");
    const state = useCartStore.getState();
    expect(state.cart).toHaveLength(1);
    expect(state.cart[0]?.productId).toBe("prd-002");
  });

  it("should update quantity or remove if updated to 0", () => {
    useCartStore.getState().addItem("prd-001", 3);
    useCartStore.getState().updateQuantity("prd-001", 5);
    let state = useCartStore.getState();
    expect(state.cart[0]?.quantity).toBe(5);

    useCartStore.getState().updateQuantity("prd-001", 0);
    state = useCartStore.getState();
    expect(state.cart).toHaveLength(0);
  });

  it("should set urge levels before and after", () => {
    useCartStore.getState().setUrgeBefore(8);
    expect(useCartStore.getState().urgeBefore).toBe(8);

    useCartStore.getState().setUrgeAfter(4);
    expect(useCartStore.getState().urgeAfter).toBe(4);
  });

  it("should handle checkout details setting", () => {
    const deliveryMock = {
      city: "İstanbul",
      district: "Kadıköy",
      addressType: "home" as const,
      fictionalAddress: "Sakin Ev Rotası, Doply Simülasyon Alanı, Kadıköy / İstanbul",
    };
    useCartStore.getState().setDelivery(deliveryMock);
    expect(useCartStore.getState().delivery).toEqual(deliveryMock);

    const shippingMock = { optionId: "standard-simulation" as const };
    useCartStore.getState().setShipping(shippingMock);
    expect(useCartStore.getState().shipping).toEqual(shippingMock);

    const paymentMock = { methodId: "simulated-doply-card" as const };
    useCartStore.getState().setPayment(paymentMock);
    expect(useCartStore.getState().payment).toEqual(paymentMock);
  });

  it("should complete simulation and clear current cart/checkout state", () => {
    useCartStore.getState().addItem("prd-001", 1);
    useCartStore.getState().setUrgeBefore(8);

    const mockOrder = {
      id: "SNL-2026-TEST",
      createdAt: new Date().toISOString(),
      lines: [
        {
          productId: "prd-001",
          quantity: 1,
          name: "Test Product",
          categorySlug: "teknoloji",
          categoryName: "Teknoloji",
          price: 100,
          image: "/test.jpg",
        },
      ],
      total: 100,
      avoidedSpending: 100,
      urgeBefore: 8,
      urgeAfter: null,
      triggers: ["stress" as const],
      delivery: {
        city: "Ankara",
        district: "Çankaya",
        addressType: "random" as const,
        fictionalAddress: "Rahatlama Durağı, Doply Simülasyon Alanı, Çankaya / Ankara",
      },
      shipping: { optionId: "standard-simulation" as const },
      payment: { methodId: "simulated-doply-card" as const },
      journalEntryAdded: false,
      waitingUntil: null,
      delayMode: null,
      cooldownUntil: null,
      reflection: null,
    };

    useCartStore.getState().completeSimulation(mockOrder);

    const state = useCartStore.getState();
    expect(state.cart).toEqual([]);
    expect(state.latestOrder).toEqual(mockOrder);
    expect(state.simulationHistory[0]).toEqual(mockOrder);
    expect(state.delivery).toBeNull();
    expect(state.shipping).toBeNull();
    expect(state.payment).toBeNull();
  });

  it("should not persist reflection text or precise delivery details", () => {
    const mockOrder = {
      id: "SNL-2026-PRIVATE",
      createdAt: new Date().toISOString(),
      lines: [
        {
          productId: "prd-001",
          quantity: 1,
          name: "Test Product",
          categorySlug: "teknoloji",
          categoryName: "Teknoloji",
          price: 100,
          image: "/test.jpg",
        },
      ],
      total: 100,
      avoidedSpending: 100,
      urgeBefore: 8,
      urgeAfter: null,
      triggers: ["stress" as const],
      delivery: {
        city: "İstanbul",
        district: "Kadıköy",
        addressType: "home" as const,
        fictionalAddress: "Kişisel hisler içeren sanal rota, Kadıköy / İstanbul",
      },
      shipping: { optionId: "standard-simulation" as const },
      payment: { methodId: "simulated-doply-card" as const },
      journalEntryAdded: false,
      waitingUntil: null,
      delayMode: null,
      cooldownUntil: null,
      reflection: {
        whyWanted: "kişisel stres notu",
        needed: "emin değilim",
        feeling: "yorgun",
        updatedAt: new Date().toISOString(),
      },
    };

    useCartStore.getState().completeSimulation(mockOrder);

    const persisted = JSON.parse(window.localStorage.getItem("doply-simulation-session") ?? "{}");
    expect(persisted.state.latestOrder.reflection).toBeNull();
    expect(persisted.state.latestOrder.delivery.city).toBe("Sanal Şehir");
    expect(JSON.stringify(persisted)).not.toContain("kişisel stres notu");
    expect(JSON.stringify(persisted)).not.toContain("Kadıköy");
  });
});
