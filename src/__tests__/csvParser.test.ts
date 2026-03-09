import { describe, it, expect } from "vitest";
import { parseCsvSemiColon } from "../services/csvParser";

describe("parseCsvSemiColon", () => {
  it("should parse CSV content with the specific header format", () => {
    const csvContent = `Adicional ; Nome;
01/01/2023;Test Transaction;1/3;R$ 100,00;;1234;Sicredi
02/01/2023;Another Transaction;2/3;R$ 200,50;;5678;Sicredi`;

    const result = parseCsvSemiColon(csvContent);
    expect(result).toHaveLength(2);
    expect(result[0][0]).toBe("01/01/2023");
    expect(result[0][1]).toBe("Test Transaction");
    expect(result[0][2]).toBe("1/3");
    expect(result[0][3]).toBe("R$ 100,00");
    expect(result[1][1]).toBe("Another Transaction");
  });

  it("should filter out transactions with insufficient columns", () => {
    const csvContent = `Adicional ; Nome;
01/01/2023;Test Transaction;1/3;R$ 100,00;;1234;Sicredi
Invalid;transaction`;

    const result = parseCsvSemiColon(csvContent);
    expect(result).toHaveLength(1);
    expect(result[0][0]).toBe("01/01/2023");
  });

  it("should remove quotes and normalize double semicolons", () => {
    const csvContent = `Adicional ; Nome;
01/01/2023;"Test "Transaction"";1/3;R$ 100,00;;1234;Sicredi`;

    const result = parseCsvSemiColon(csvContent);
    expect(result).toHaveLength(1);
    expect(result[0][1]).toBe('Test Transaction');
  });
});
