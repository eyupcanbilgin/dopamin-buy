import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { UrgeMeter } from "@/components/urge-meter";

describe("UrgeMeter Component", () => {
  const defaultProps = {
    value: null,
    onChange: vi.fn(),
    title: "Test Dürtü Seviyesi",
    description: "Lütfen 1-10 arası bir dürtü seçin",
    emptyText: "Seçim yapılmadı",
  };

  it("should render title and description", () => {
    render(<UrgeMeter {...defaultProps} />);
    expect(screen.getByText("Test Dürtü Seviyesi")).toBeInTheDocument();
    expect(screen.getByText("Lütfen 1-10 arası bir dürtü seçin")).toBeInTheDocument();
  });

  it("should render 10 score buttons", () => {
    render(<UrgeMeter {...defaultProps} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(10);
    buttons.forEach((btn, index) => {
      expect(btn).toHaveTextContent(String(index + 1));
    });
  });

  it("should call onChange when a score button is clicked", () => {
    const onChangeMock = vi.fn();
    render(<UrgeMeter {...defaultProps} onChange={onChangeMock} />);
    
    // Click button 7
    const button7 = screen.getByRole("button", { name: "7 üzerinden 10 dürtü seviyesi" });
    fireEvent.click(button7);
    
    expect(onChangeMock).toHaveBeenCalledWith(7);
  });

  it("should highlight the selected button and show the selected score status text", () => {
    render(<UrgeMeter {...defaultProps} value={6} />);
    
    // The button with score 6 should be highlighted (aria-pressed=true)
    const button6 = screen.getByRole("button", { name: "6 üzerinden 10 dürtü seviyesi" });
    expect(button6).toHaveAttribute("aria-pressed", "true");
    
    expect(screen.getByText("Seçili seviye: 6/10")).toBeInTheDocument();
  });

  it("should show emptyText when no value is selected", () => {
    render(<UrgeMeter {...defaultProps} value={null} />);
    expect(screen.getByText("Seçim yapılmadı")).toBeInTheDocument();
  });
});
