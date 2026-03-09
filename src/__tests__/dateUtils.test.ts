import { describe, it, expect } from "vitest";
import {
  pad,
  formatDate,
  getCurrentDate,
  isValidDate,
  getDateInterval,
  forwardDateBasedOnInstallments,
  fixInstallmentDates,
} from "../services/dateUtils";

describe("pad", () => {
  it("should pad single digit numbers with leading zero", () => {
    expect(pad(1)).toBe("01");
    expect(pad(5)).toBe("05");
    expect(pad(9)).toBe("09");
  });

  it("should not pad double digit numbers", () => {
    expect(pad(10)).toBe("10");
    expect(pad(12)).toBe("12");
  });
});

describe("formatDate", () => {
  it("should format date string to OFX format", () => {
    expect(formatDate("01/02/2023")).toBe("20230201000000");
    expect(formatDate("15/12/2024")).toBe("20241215000000");
    expect(formatDate("31/01/2025")).toBe("20250131000000");
  });
});

describe("getCurrentDate", () => {
  it("should return current date in OFX format", () => {
    const result = getCurrentDate();
    const pattern = /^\d{8}000000$/;
    expect(result).toMatch(pattern);
  });
});

describe("isValidDate", () => {
  it("should return true for valid date strings with two slashes", () => {
    expect(isValidDate("01/02/2023")).toBe(true);
    expect(isValidDate("15/12/2024")).toBe(true);
    expect(isValidDate("31/01/2025")).toBe(true);
  });

  it("should return false for invalid date strings", () => {
    expect(isValidDate("01-02-2023")).toBe(false);
    expect(isValidDate("01022023")).toBe(false);
    expect(isValidDate("01/02")).toBe(false);
    expect(isValidDate("")).toBe(false);
  });
});

describe("getDateInterval", () => {
  it("should calculate date interval from array of dates", () => {
    const dates = ["15/01/2023", "01/02/2023", "28/02/2023", "15/03/2023"];
    const result = getDateInterval(dates);
    expect(result).toEqual({ startDate: "15/01/2023", endDate: "15/03/2023" });
  });

  it("should filter out invalid dates", () => {
    const dates = ["15/01/2023", "invalid", "28/02/2023"];
    const result = getDateInterval(dates);
    expect(result).toEqual({ startDate: "15/01/2023", endDate: "28/02/2023" });
  });

  it("should handle single valid date", () => {
    const dates = ["15/01/2023"];
    const result = getDateInterval(dates);
    expect(result).toEqual({ startDate: "15/01/2023", endDate: "15/01/2023" });
  });
});

describe("forwardDateBasedOnInstallments", () => {
  it("should forward date based on installment number within same year", () => {
    expect(forwardDateBasedOnInstallments("15/01/2023", "2/5")).toBe(
      "15/02/2023",
    );
    expect(forwardDateBasedOnInstallments("10/03/2023", "3/12")).toBe(
      "10/05/2023",
    ); // 3+3-1=5 (May)
  });

  it("should handle year rollover when month exceeds 12", () => {
    expect(forwardDateBasedOnInstallments("15/11/2023", "3/12")).toBe(
      "15/01/2024",
    ); // 11+3-1=13 -> 1 (Jan)
    expect(forwardDateBasedOnInstallments("01/06/2023", "8/12")).toBe(
      "01/01/2024",
    ); // 6+8-1=13 -> 1 (Jan)
  });

  it("should handle spaces and parentheses in installments", () => {
    expect(forwardDateBasedOnInstallments("15/01/2023", " (2/5) ")).toBe(
      "15/02/2023",
    );
  });
});

describe("fixInstallmentDates", () => {
  it("should adjust dates for transactions with installment info", () => {
    const data = [
      ["15/01/2023", "Description", "1/5"],
      ["15/01/2023", "Description", "2/5"],
      ["15/01/2023", "Description", "3/5"],
    ];
    fixInstallmentDates(data);
    expect(data[0][0]).toBe("15/01/2023");
    expect(data[1][0]).toBe("15/02/2023");
    expect(data[2][0]).toBe("15/03/2023");
  });

  it("should not modify transactions without installment slashes", () => {
    const data = [
      ["15/01/2023", "Description", "1"],
      ["15/02/2023", "Description", "2"],
    ];
    fixInstallmentDates(data);
    expect(data[0][0]).toBe("15/01/2023");
    expect(data[1][0]).toBe("15/02/2023");
  });

  it("should handle transactions with spaces in date", () => {
    const data = [[" 15/01/2023 ", "Description", "1/5"]];
    fixInstallmentDates(data);
    expect(data[0][0]).toBe("15/01/2023");
  });
});
