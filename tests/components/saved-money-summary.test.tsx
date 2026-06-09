import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SavedMoneySummary } from "@/components/saved-money-summary";

describe("SavedMoneySummary Component", () => {
  it("should render default label and amount formatted in TRY style", () => {
    render(<SavedMoneySummary amount={4500} />);

    expect(screen.getByText("Birikim özeti")).toBeInTheDocument();
    expect(screen.getByText("Bugün harcamaktan kaçındığın tutar")).toBeInTheDocument();
    
    // Check that the formatted amount displays (contains "4.500")
    expect(screen.getByText(/4\.500/)).toBeInTheDocument();
  });

  it("should render custom label when passed as prop", () => {
    const customLabel = "Sanal sepetinizden tasarruf ettiğiniz miktar";
    render(<SavedMoneySummary amount={150} label={customLabel} />);

    expect(screen.getByText(customLabel)).toBeInTheDocument();
  });

  it("should render the security warning description", () => {
    render(<SavedMoneySummary amount={100} />);

    expect(
      screen.getByText("Bu tutar sanal sepetten hesaplandı. Karttan çekim yapılmadı, teslimat planlanmadı.")
    ).toBeInTheDocument();
  });
});
