import {
  isValidContainerId,
  isValidApiKey,
  isValidSymbol,
  isValidRefreshInterval,
  isValidTheme,
} from "../utils/validators.js";

const DEFAULT_CONFIG = {
  symbol: "MSFT",
  refreshInterval: 60000,
  theme: {
    primaryColor: "#007bff",
    backgroundColor: "#ffffff",
    textColor: "#333333",
    fontFamily: "system-ui, -apple-system, sans-serif",
    borderRadius: "8px",
  },
  sparkline: {
    enabled: false,
    period: "24h",
  },
  observability: {
    enabled: true,
    otlpEndpoint: null,
    debug: false,
  },
};

export const createConfigManager = () => {
  const validate = (config) => {
    const errors = [];

    if (!isValidContainerId(config.containerId)) {
      errors.push("containerId is required and must be a non-empty string");
    }

    if (!isValidApiKey(config.apiKey)) {
      errors.push("apiKey is required and must be a non-empty string");
    }

    if (config.symbol && !isValidSymbol(config.symbol)) {
      errors.push("symbol must be a valid stock ticker (1-5 uppercase letters)");
    }

    if (config.refreshInterval && !isValidRefreshInterval(config.refreshInterval)) {
      errors.push("refreshInterval must be a number >= 5000 (5 seconds)");
    }

    if (config.theme && !isValidTheme(config.theme)) {
      errors.push("theme contains invalid properties");
    }

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed:\n${errors.join("\n")}`);
    }
  };

  const merge = (userConfig) => {
    const merged = {
      ...DEFAULT_CONFIG,
      ...userConfig,
      theme: {
        ...DEFAULT_CONFIG.theme,
        ...(userConfig.theme || {}),
      },
      sparkline: {
        ...DEFAULT_CONFIG.sparkline,
        ...(userConfig.sparkline || {}),
      },
      observability: {
        ...DEFAULT_CONFIG.observability,
        ...(userConfig.observability || {}),
      },
    };

    validate(merged);
    return merged;
  };

  return {
    validate,
    merge,
  };
};
