import {
  isValidContainerId,
  isValidApiKey,
  isValidSymbol,
  isValidRefreshInterval,
  isValidTheme,
} from "../../src/utils/validators.js";

describe("validators", () => {
  describe("isValidContainerId", () => {
    test("should return true for valid container id", () => {
      expect(isValidContainerId("widget-1")).toBe(true);
    });

    test("should return false for empty string", () => {
      expect(isValidContainerId("")).toBe(false);
    });

    test("should return false for non-string", () => {
      expect(isValidContainerId(123)).toBe(false);
    });
  });

  describe("isValidApiKey", () => {
    test("should return true for valid api key", () => {
      expect(isValidApiKey("test-key-123")).toBe(true);
    });

    test("should return false for empty string", () => {
      expect(isValidApiKey("")).toBe(false);
    });
  });

  describe("isValidSymbol", () => {
    test("should return true for valid symbols", () => {
      expect(isValidSymbol("AAPL")).toBe(true);
      expect(isValidSymbol("MSFT")).toBe(true);
      expect(isValidSymbol("GOOGL")).toBe(true);
    });

    test("should return false for invalid symbols", () => {
      expect(isValidSymbol("aapl")).toBe(false);
      expect(isValidSymbol("TOOLONG")).toBe(false);
      expect(isValidSymbol("A1")).toBe(false);
    });
  });

  describe("isValidRefreshInterval", () => {
    test("should return true for valid intervals", () => {
      expect(isValidRefreshInterval(5000)).toBe(true);
      expect(isValidRefreshInterval(60000)).toBe(true);
    });

    test("should return false for intervals below 5000", () => {
      expect(isValidRefreshInterval(1000)).toBe(false);
    });

    test("should return false for non-numbers", () => {
      expect(isValidRefreshInterval("5000")).toBe(false);
    });
  });

  describe("isValidTheme", () => {
    test("should return true for valid theme", () => {
      expect(isValidTheme({
        primaryColor: "#007bff",
        backgroundColor: "#ffffff",
      })).toBe(true);
    });

    test("should return true for empty theme", () => {
      expect(isValidTheme({})).toBe(true);
    });

    test("should return true for null/undefined", () => {
      expect(isValidTheme(null)).toBe(true);
      expect(isValidTheme(undefined)).toBe(true);
    });

    test("should return false for invalid keys", () => {
      expect(isValidTheme({
        invalidKey: "value",
      })).toBe(false);
    });
  });
});
