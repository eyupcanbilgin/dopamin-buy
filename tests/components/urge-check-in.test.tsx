import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { UrgeCheckIn } from "@/components/urge-check-in";
import { useCartStore } from "@/store/use-cart-store";

describe("UrgeCheckIn Component", () => {
  beforeEach(() => {
    useCartStore.getState().resetSession();
  });

  it("should render for 'before' mode and display proper title and subtext", () => {
    render(<UrgeCheckIn mode="before" />);
    expect(screen.getByText("Alışveriş dürtün şu an kaç?")).toBeInTheDocument();
    expect(screen.getByText(/1 sakin, 10 çok güçlü/i)).toBeInTheDocument();
  });

  it("should render for 'after' mode and display proper title and subtext", () => {
    render(<UrgeCheckIn mode="after" />);
    expect(screen.getByText("Simülasyondan sonra dürtün kaç?")).toBeInTheDocument();
    expect(screen.getByText(/Kapanış hissini fark etmek için/i)).toBeInTheDocument();
  });

  it("should update Zustand store urgeBefore when clicking score in 'before' mode", () => {
    render(<UrgeCheckIn mode="before" />);
    const button8 = screen.getByRole("button", { name: "8 üzerinden 10 dürtü seviyesi" });
    fireEvent.click(button8);
    expect(useCartStore.getState().urgeBefore).toBe(8);
  });

  it("should update Zustand store urgeAfter when clicking score in 'after' mode", () => {
    render(<UrgeCheckIn mode="after" />);
    const button3 = screen.getByRole("button", { name: "3 üzerinden 10 dürtü seviyesi" });
    fireEvent.click(button3);
    expect(useCartStore.getState().urgeAfter).toBe(3);
  });
});
