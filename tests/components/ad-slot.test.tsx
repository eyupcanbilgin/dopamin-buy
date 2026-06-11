import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { AdSlot } from "@/components/ad-slot";

vi.mock("next/navigation", () => ({
  usePathname: () => "/shop",
}));

const configuredSlot = {
  id: "ad-1",
  name: "Bütçe sponsoru",
  placement: "homepage-banner" as const,
  label: "Sponsorlu" as const,
  title: "Sakin bütçe planlama aracı",
  body: "Harcamayı aceleye getirmeden planlamaya yardımcı sponsorlu içerik.",
  sponsorName: "Doply Partner",
  ctaLabel: "Sponsor sitesine git",
  ctaHref: "https://example.com",
  frequencyCap: 3,
};

describe("AdSlot Component", () => {
  it("should render a clearly labeled empty ad fallback", async () => {
    render(<AdSlot disableRemoteLoad />);

    expect(await screen.findByLabelText("Reklam alanı")).toBeInTheDocument();
    expect(screen.getByText("Reklam")).toBeInTheDocument();
    expect(screen.getByText("Sakin mola alanı")).toBeInTheDocument();
    expect(screen.getByText(/ürün kartı gibi gizlemez/i)).toBeInTheDocument();
  });

  it("should render configured sponsor content with label and sponsor name", async () => {
    render(<AdSlot slot={configuredSlot} />);

    expect(await screen.findByLabelText("Sponsorlu alanı")).toBeInTheDocument();
    expect(screen.getByText("Sponsorlu")).toBeInTheDocument();
    expect(screen.getByText("Doply Partner")).toBeInTheDocument();
    expect(screen.getByText("Sakin bütçe planlama aracı")).toBeInTheDocument();
  });

  it("should suppress unsafe configured sponsor links", async () => {
    render(<AdSlot slot={{ ...configuredSlot, ctaHref: "javascript:alert(1)" }} />);

    expect(await screen.findByLabelText("Sponsorlu alanı")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Sponsor sitesine git/i })).not.toBeInTheDocument();
  });

  it("should render skeleton when loading", () => {
    render(<AdSlot loading />);

    expect(screen.getByLabelText("Reklam alanı yükleniyor")).toBeInTheDocument();
  });
});
