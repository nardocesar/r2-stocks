import { createConfigManager } from "../../src/core/ConfigManager.js";

describe("ConfigManager", () => {
  let configManager;

  beforeEach(() => {
    configManager = createConfigManager();
  });

  describe("merge", () => {
    test("should merge user config with defaults", () => {
      const userConfig = {
        containerId: "test-widget",
        apiKey: "test-key",
      };

      const merged = configManager.merge(userConfig);

      expect(merged.containerId).toBe("test-widget");
      expect(merged.apiKey).toBe("test-key");
      expect(merged.symbol).toBe("MSFT");
      expect(merged.refreshInterval).toBe(60000);
    });

    test("should override default symbol", () => {
      const userConfig = {
        containerId: "test-widget",
        apiKey: "test-key",
        symbol: "AAPL",
      };

      const merged = configManager.merge(userConfig);

      expect(merged.symbol).toBe("AAPL");
    });

    test("should merge theme properties", () => {
      const userConfig = {
        containerId: "test-widget",
        apiKey: "test-key",
        theme: {
          primaryColor: "#ff0000",
        },
      };

      const merged = configManager.merge(userConfig);

      expect(merged.theme.primaryColor).toBe("#ff0000");
      expect(merged.theme.backgroundColor).toBe("#ffffff");
    });

    test("should throw error for missing containerId", () => {
      const userConfig = {
        apiKey: "test-key",
      };

      expect(() => configManager.merge(userConfig)).toThrow("containerId is required");
    });

    test("should throw error for missing apiKey", () => {
      const userConfig = {
        containerId: "test-widget",
      };

      expect(() => configManager.merge(userConfig)).toThrow("apiKey is required");
    });

    test("should throw error for invalid symbol", () => {
      const userConfig = {
        containerId: "test-widget",
        apiKey: "test-key",
        symbol: "invalid123",
      };

      expect(() => configManager.merge(userConfig)).toThrow("valid stock ticker");
    });

    test("should throw error for invalid refresh interval", () => {
      const userConfig = {
        containerId: "test-widget",
        apiKey: "test-key",
        refreshInterval: 1000,
      };

      expect(() => configManager.merge(userConfig)).toThrow("refreshInterval must be");
    });
  });
});
