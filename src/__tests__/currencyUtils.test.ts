import { describe, it, expect } from "vitest";
import { parseCurrencyValue } from "../services/currencyUtils";

describe("parseCurrencyValue", () => {
  it("should parse positive currency values", () => {
    expect(parseCurrencyValue("R$ 100,50")).toBe("-100.50");
    expect(parseCurrencyValue("R$1.234,56")).toBe("-1234.56");
    expect(parseCurrencyValue("R$ 10,00")).toBe("-10.00");
  });

  it("should parse negative currency values", () => {
    expect(parseCurrencyValue("- R$ 100,50")).toBe("100.50");
    expect(parseCurrencyValue("-R$1.234,56")).toBe("1234.56");
  });

  it("should handle values without R$ symbol", () => {
    expect(parseCurrencyValue("100,50")).toBe("-100.50");
    expect(parseCurrencyValue("-100,50")).toBe("100.50");
  });

  it("should handle empty or undefined values", () => {
    expect(parseCurrencyValue("")).toBe("");
    expect(parseCurrencyValue("   ")).toBe("-"); // Original bug: returns '-' for whitespace-only
  });

  it("should remove only first thousand separator due to bug", () => {
    expect(parseCurrencyValue("R$ 1.234.567,89")).toBe("-1234.567.89"); // Original: only first dot removed
    expect(parseCurrencyValue("-R$ 2.500,00")).toBe("2500.00");
  });
});
