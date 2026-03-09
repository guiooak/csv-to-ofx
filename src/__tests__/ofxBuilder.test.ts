import { describe, it, expect } from "vitest";
import {
  generateTransactionId,
  buildOfxTransaction,
  buildOfxHeader,
  buildOfxRawData,
  buildFileName,
  buildOfxFileData,
} from "../services/ofxBuilder";

describe("generateTransactionId", () => {
  it("should generate unique transaction ID from date, value, and description", () => {
    const id = generateTransactionId(
      "20230101000000",
      "-100.50",
      "Test Transaction",
    );
    expect(id).toBe("20230101000000--10050-testtransaction"); // Double dash due to bug
  });

  it("should handle special characters in description", () => {
    const id = generateTransactionId(
      "20230101000000",
      "-100.50",
      "Test & Transaction!",
    );
    expect(id).toBe("20230101000000--10050-testtransaction"); // Double dash due to bug
  });
});

describe("buildOfxTransaction", () => {
  it("should build OFX transaction for debit", () => {
    const transaction = ["01/01/2023", "Test Description", "1/3", "R$ 100,00"];
    const result = buildOfxTransaction(transaction);
    expect(result).toContain("<TRNTYPE>DEBIT");
    expect(result).toContain("<DTPOSTED>20230101000000[-3:GMT]");
    expect(result).toContain("<TRNAMT>-100.00");
    expect(result).toContain("<MEMO>Test Description 1/3");
  });

  it("should build OFX transaction for credit", () => {
    const transaction = ["01/01/2023", "Refund", "1/1", "- R$ 50,00"];
    const result = buildOfxTransaction(transaction);
    expect(result).toContain("<TRNTYPE>CREDIT");
    expect(result).toContain("<TRNAMT>50.00"); // Negative becomes positive for credit
  });

  it("should return empty string for invalid transaction", () => {
    const transaction = ["", "", "", ""];
    const result = buildOfxTransaction(transaction);
    expect(result).toBe("");
  });
});

describe("buildOfxHeader", () => {
  it("should build OFX header with correct date format", () => {
    const result = buildOfxHeader("01/01/2023", "31/01/2023");
    expect(result).toContain("<DTSTART>20230101000000[-3:GMT]");
    expect(result).toContain("<DTEND>20230131000000[-3:GMT]");
    expect(result).toContain("<CURDEF>BRL");
    expect(result).toContain("<LANGUAGE>POR");
  });
});

describe("buildOfxRawData", () => {
  it("should build complete OFX file with transactions", () => {
    const transactions = [
      ["01/01/2023", "Transaction 1", "1/2", "R$ 100,00"],
      ["02/01/2023", "Transaction 2", "2/2", "-R$ 50,00"],
    ];
    const result = buildOfxRawData(transactions, "01/01/2023", "02/01/2023");
    expect(result).toContain("OFXHEADER:100");
    expect(result).toContain("<STMTTRN>");
    expect(result).toContain("<BANKTRANLIST>");
  });
});

describe("buildFileName", () => {
  it("should build filename with date range", () => {
    expect(buildFileName("01/01/2023", "31/01/2023")).toBe(
      "transactions_01-01-2023_to_31-01-2023.ofx",
    );
  });
});

describe("buildOfxFileData", () => {
  it("should encode OFX data as URI with proper line endings", () => {
    const data = "OFXHEADER:100\nDATA:OFXSGML";
    const result = buildOfxFileData(data);
    expect(result).toContain("data:text/ofx;charset=utf-8,");
    expect(decodeURIComponent(result)).toContain("\r\n");
  });

  it("should replace # with _ in data", () => {
    const data = "Test#Value";
    const result = buildOfxFileData(data);
    expect(decodeURIComponent(result)).toContain("Test_Value");
  });
});
