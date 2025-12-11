import { createConfigManager } from "./ConfigManager.js";
import { createShadowDOMManager } from "./ShadowDOMManager.js";
import { createTelemetryManager } from "../observability/TelemetryManager.js";
import { createStockDataService } from "../services/StockDataService.js";
import { createWidgetRenderer } from "./WidgetRenderer.js";
import { createRefreshManager } from "../services/RefreshManager.js";

export const createStocksSnapshot = () => {
  const instances = new Map();

  const init = async (userConfig) => {
    const startTime = performance.now();
    const configManager = createConfigManager();

    let config;
    try {
      config = configManager.merge(userConfig);
    } catch (error) {
      throw new Error(`Configuration error: ${error.message}`);
    }

    const container = document.getElementById(config.containerId);
    if (!container) {
      throw new Error(`Container element with id '${config.containerId}' not found`);
    }

    const telemetry = createTelemetryManager(config.observability);
    telemetry.initialize();

    const rootSpan = telemetry.startSpan("stocks.init");

    try {
      const shadowDOMManager = createShadowDOMManager();
      const shadowRoot = shadowDOMManager.createShadowRoot(container, config.theme);

      const renderer = createWidgetRenderer(telemetry);
      renderer.renderLoading(shadowRoot);

      const stockDataService = createStockDataService(config.apiKey, telemetry);

      const fetchAndRender = async () => {
        try {
          const data = await stockDataService.fetchQuote(config.symbol);
          renderer.render(shadowRoot, data);
        } catch (error) {
          renderer.renderError(shadowRoot, error.message);
          telemetry.recordError("fetch_error");
        }
      };

      await fetchAndRender();

      const refreshManager = createRefreshManager(
        config.refreshInterval,
        fetchAndRender
      );
      refreshManager.start();

      const instance = {
        shadowRoot,
        refreshManager,
        telemetry,
        renderer,
        stockDataService,
        shadowDOMManager,
        config,
      };

      instances.set(config.containerId, instance);

      const paintTime = performance.now() - startTime;
      telemetry.recordInitTime(paintTime);
      rootSpan.end();

      return { success: true, paintTime };
    } catch (error) {
      rootSpan.recordException(error);
      rootSpan.end();
      throw error;
    }
  };

  const destroy = (containerId) => {
    const instance = instances.get(containerId);
    if (!instance) {
      throw new Error(`No widget instance found for container '${containerId}'`);
    }

    instance.refreshManager.stop();

    const container = document.getElementById(containerId);
    if (container && container.shadowRoot) {
      container.shadowRoot.innerHTML = "";
    }

    instances.delete(containerId);
  };

  const update = async (containerId, newConfig) => {
    const instance = instances.get(containerId);
    if (!instance) {
      throw new Error(`No widget instance found for container '${containerId}'`);
    }

    if (newConfig.theme) {
      const mergedTheme = {
        ...instance.config.theme,
        ...newConfig.theme,
      };
      instance.shadowDOMManager.updateTheme(instance.shadowRoot, mergedTheme);
      instance.config.theme = mergedTheme;
    }

    if (newConfig.symbol && newConfig.symbol !== instance.config.symbol) {
      instance.config.symbol = newConfig.symbol;
      const data = await instance.stockDataService.fetchQuote(newConfig.symbol);
      instance.renderer.render(instance.shadowRoot, data);
    }

    if (newConfig.refreshInterval && newConfig.refreshInterval !== instance.config.refreshInterval) {
      instance.refreshManager.stop();
      instance.config.refreshInterval = newConfig.refreshInterval;

      const fetchAndRender = async () => {
        try {
          const data = await instance.stockDataService.fetchQuote(instance.config.symbol);
          instance.renderer.render(instance.shadowRoot, data);
        } catch (error) {
          instance.renderer.renderError(instance.shadowRoot, error.message);
        }
      };

      const newRefreshManager = createRefreshManager(
        newConfig.refreshInterval,
        fetchAndRender
      );
      newRefreshManager.start();
      instance.refreshManager = newRefreshManager;
    }
  };

  return {
    init,
    destroy,
    update,
  };
};

export default createStocksSnapshot();
