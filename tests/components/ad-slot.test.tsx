import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AdSlot } from "@/components/ad-slot";

describe("AdSlot Component", () => {
  it("should render as aside landmark with correct aria-label", () => {
    const { container } = render(<AdSlot />);
    const asideElement = container.querySelector("aside");
    expect(asideElement).toBeInTheDocument();
    expect(asideElement).toHaveAttribute("aria-label", "Etik duyuru alanı");
  });

  it("should display default title and description", () => {
    render(<AdSlot />);
    expect(screen.getByText("Sakin mola alanı")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Bu alanda bu fazda reklam, geri sayım veya satın alma baskısı yok. İstersen sepete eklemeden önce bir nefeslik durakla."
      )
    ).toBeInTheDocument();
  });

  it("should display custom title and description", () => {
    render(<AdSlot title="Özel Mola" description="Sakin kalma alanı açıklaması." />);
    expect(screen.getByText("Özel Mola")).toBeInTheDocument();
    expect(screen.getByText("Sakin kalma alanı açıklaması.")).toBeInTheDocument();
  });

  it("should render safety and ethical badges", () => {
    render(<AdSlot />);
    // "Gerçek ödeme yok" badge
    expect(screen.getByText("Gerçek ödeme yok")).toBeInTheDocument();
    // "Para korunur" badge
    expect(screen.getByText("Para korunur")).toBeInTheDocument();
  });
});
