import { formatTimestamp } from "../utils/formatters.js";

export const createWidgetRenderer = (telemetry) => {
  const renderLoading = (shadowRoot) => {
    const container = document.createElement("div");
    container.className = "stocks-widget";
    container.innerHTML = '<div class="loading">Loading stock data...</div>';
    shadowRoot.innerHTML = "";
    shadowRoot.appendChild(container);
  };

  const renderError = (shadowRoot, message) => {
    const container = document.createElement("div");
    container.className = "stocks-widget";
    container.innerHTML = `<div class="error">Error: ${message}</div>`;
    shadowRoot.innerHTML = "";
    shadowRoot.appendChild(container);
  };

  const render = (shadowRoot, data) => {
    const span = telemetry.startSpan("widget.render");

    try {
      const container = document.createElement("div");
      container.className = "stocks-widget";

      const isPositive = data.change >= 0;
      const changeClass = isPositive ? "positive" : "negative";
      const changeIcon = isPositive ? "▲" : "▼";

      container.innerHTML = `
        <div class="widget-header">
          <h3 class="symbol">${data.symbol}</h3>
        </div>
        <div class="widget-body">
          <div class="price">$${data.price.toFixed(2)}</div>
          <div class="change ${changeClass}">
            <span class="change-icon">${changeIcon}</span>
            <span class="change-value">${data.change.toFixed(2)}</span>
            <span class="change-percent">(${data.changePercent.toFixed(2)}%)</span>
          </div>
        </div>
        <div class="widget-footer">
          <span class="timestamp">Updated: ${formatTimestamp(data.timestamp)}</span>
        </div>
      `;

      const existingWidget = shadowRoot.querySelector(".stocks-widget");
      if (existingWidget) {
        existingWidget.replaceWith(container);
      } else {
        shadowRoot.appendChild(container);
      }

      span.end();
    } catch (error) {
      span.recordException(error);
      span.end();
      throw error;
    }
  };

  return {
    render,
    renderLoading,
    renderError,
  };
};
