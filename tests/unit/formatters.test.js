import {
  formatPrice,
  formatChange,
  formatPercent,
  formatTimestamp,
} from "../../src/utils/formatters.js";

describe("formatters", () => {
  describe("formatPrice", () => {
    test("should format price with dollar sign", () => {
      expect(formatPrice(150.5)).toBe("$150.50");
      expect(formatPrice(1000)).toBe("$1000.00");
    });
  });

  describe("formatChange", () => {
    test("should format positive change with plus sign", () => {
      expect(formatChange(5.25)).toBe("+5.25");
    });

    test("should format negative change", () => {
      expect(formatChange(-3.50)).toBe("-3.50");
    });

    test("should format zero", () => {
      expect(formatChange(0)).toBe("+0.00");
    });
  });

  describe("formatPercent", () => {
    test("should format positive percent", () => {
      expect(formatPercent(2.5)).toBe("+2.50%");
    });

    test("should format negative percent", () => {
      expect(formatPercent(-1.25)).toBe("-1.25%");
    });
  });

  describe("formatTimestamp", () => {
    test("should format timestamp", () => {
      const date = new Date("2024-01-15T10:30:00");
      const formatted = formatTimestamp(date);
      expect(formatted).toMatch(/Jan 15/);
    });
  });
});
