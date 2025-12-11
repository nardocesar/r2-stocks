import { createThemeEngine } from "../theming/ThemeEngine.js";

const baseStyles = `
:host {
  --stocks-primary-color: #007bff;
  --stocks-bg-color: #ffffff;
  --stocks-text-color: #333333;
  --stocks-font-family: system-ui, -apple-system, sans-serif;
  --stocks-border-radius: 8px;
  --stocks-padding: 16px;
  --stocks-positive-color: #22c55e;
  --stocks-negative-color: #ef4444;
  --stocks-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  display: block;
  font-family: var(--stocks-font-family);
}

.stocks-widget {
  width: 100%;
  min-width: 280px;
  padding: var(--stocks-padding);
  background: var(--stocks-bg-color);
  border-radius: var(--stocks-border-radius);
  box-shadow: var(--stocks-shadow);
  color: var(--stocks-text-color);
}

.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.symbol {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--stocks-text-color);
}

.company-name {
  font-size: 14px;
  color: #666;
  margin-left: 8px;
}

.widget-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.price {
  font-size: 32px;
  font-weight: 700;
  color: var(--stocks-text-color);
}

.change {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 500;
}

.change.positive {
  color: var(--stocks-positive-color);
}

.change.negative {
  color: var(--stocks-negative-color);
}

.change-icon {
  font-size: 12px;
}

.widget-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.timestamp {
  font-size: 12px;
  color: #999;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  font-size: 14px;
  color: #666;
}

.error {
  padding: 16px;
  background: #fee;
  border-radius: var(--stocks-border-radius);
  color: #c00;
  font-size: 14px;
}

@media (min-width: 768px) {
  .stocks-widget {
    min-width: 320px;
  }
}

@media (min-width: 1024px) {
  .stocks-widget {
    min-width: 360px;
  }
}

@media (prefers-color-scheme: dark) {
  :host {
    --stocks-bg-color: #1e1e1e;
    --stocks-text-color: #e0e0e0;
  }
}
`;

export const createShadowDOMManager = () => {
  const themeEngine = createThemeEngine();

  const createShadowRoot = (container, theme) => {
    const shadowRoot = container.attachShadow({ mode: "open" });

    const styleSheet = document.createElement("style");
    styleSheet.textContent = baseStyles;
    shadowRoot.appendChild(styleSheet);

    if (theme) {
      themeEngine.applyTheme(shadowRoot, theme);
    }

    return shadowRoot;
  };

  const updateTheme = (shadowRoot, theme) => {
    themeEngine.applyTheme(shadowRoot, theme);
  };

  return {
    createShadowRoot,
    updateTheme,
  };
};
