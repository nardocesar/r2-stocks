# R2StocksSnapshot - Implementation Plan

## Project Overview

Build a lightweight, embeddable stock quote widget that can be dropped into any website with a simple two-line snippet. The widget must be fast, isolated, themeable, and production-ready.

## Architecture & Technology Stack

### Architectural Approach

**Functional Programming Paradigm**: This project uses a functional approach with factory functions and closures instead of classes. This provides better composability, eliminates `this` binding issues, improves tree-shaking, and results in more testable code.

### Core Technologies

- **Vanilla JavaScript (ES6+)**: No framework dependencies for core functionality
- **Functional patterns**: Factory functions, closures, and pure functions over classes
- **Shadow DOM**: Complete style and script isolation
- **Custom Elements API**: Native web component approach
- **Fetch API**: For stock data retrieval
- **OpenTelemetry**: Observability and monitoring

### Build Tools

- **Webpack 5**: Powerful bundler with ES modules support for tree-shaking, code-splitting, and multiple output formats
- **Terser Webpack Plugin**: JavaScript minification
- **MiniCssExtractPlugin**: CSS extraction and minification
- **PostCSS Loader**: CSS processing and autoprefixing
- **TypeScript (optional)**: Type safety during development, compiled to vanilla JS
- **ES Modules**: Modern import/export syntax throughout (requires `"type": "module"` in package.json)

### Testing

- **Jest**: Unit testing framework
- **@testing-library/dom**: DOM testing utilities
- **Playwright** (bonus): E2E testing

### Containerization

- **Docker**: Multi-stage builds (node:alpine → nginx:alpine)
- **Docker Compose**: Local development and demo hosting

---

## Detailed Implementation Plan

### 1. Project Structure

```
r2-stocks/
├── src/
│   ├── core/
│   │   ├── StocksSnapshot.js       # Main entry point and public API
│   │   ├── WidgetRenderer.js       # DOM rendering logic
│   │   ├── ShadowDOMManager.js     # Shadow DOM setup and management
│   │   └── ConfigManager.js        # Config parsing and validation
│   ├── services/
│   │   ├── StockDataService.js     # API integration for stock data
│   │   ├── RefreshManager.js       # Auto-refresh scheduling
│   │   └── CacheService.js         # Optional data caching
│   ├── theming/
│   │   ├── ThemeEngine.js          # Theme application logic
│   │   ├── defaultTheme.js         # Default theme values
│   │   └── styles.css              # Base widget styles
│   ├── observability/
│   │   ├── TelemetryManager.js     # OpenTelemetry setup
│   │   ├── spans.js                # Span creation utilities
│   │   └── metrics.js              # Metrics collection
│   ├── features/
│   │   ├── Sparkline.js            # Optional sparkline chart (lazy-loaded)
│   │   └── ClickHandler.js         # Click event management
│   └── utils/
│       ├── formatters.js           # Price and date formatting
│       ├── validators.js           # Input validation
│       └── performance.js          # Performance utilities
├── demo/
│   └── index.html                  # Demo page with examples
├── tests/
│   ├── unit/
│   │   ├── StocksSnapshot.test.js
│   │   ├── ConfigManager.test.js
│   │   └── WidgetRenderer.test.js
│   └── e2e/ (bonus)
│       └── widget.spec.js
├── dist/                           # Build output
│   ├── stocks.bundle.js           # Main bundle (UMD)
│   ├── stocks.esm.js              # ES Module version
│   └── stocks.bundle.js.map       # Source maps
├── docker/
│   ├── Dockerfile                 # Multi-stage build
│   └── nginx.conf                 # Nginx configuration
├── docker-compose.yml
├── package.json                   # Must include "type": "module" for ES modules
├── webpack.config.js              # Build configuration (ES module)
├── webpack.dev.js                 # Development config
├── webpack.prod.js                # Production config
├── babel.config.js                # Babel configuration
├── postcss.config.js              # PostCSS configuration
├── jest.config.js
├── .gitignore
└── README.md
```

### 2. Embeddability & Initialization

#### API Design

```javascript
// Factory function for main API - returns object with methods
const createStocksSnapshot = () => {
  // Store widget instances using closures
  const instances = new Map();

  const init = async (config) => {
    // 1. Validate config
    // 2. Initialize OpenTelemetry
    // 3. Create Shadow DOM
    // 4. Fetch initial data
    // 5. Render widget
    // 6. Setup auto-refresh
    // 7. Resolve promise on first paint

    const instance = {
      shadowRoot,
      refreshManager,
      telemetry,
      // ... other instance data
    };

    instances.set(config.containerId, instance);
    return { success: true, paintTime };
  };

  const destroy = (containerId) => {
    const instance = instances.get(containerId);
    if (instance) {
      instance.refreshManager.stop();
      // cleanup
      instances.delete(containerId);
    }
  };

  const update = (containerId, newConfig) => {
    const instance = instances.get(containerId);
    if (instance) {
      // update logic
    }
  };

  return {
    init,
    destroy,
    update,
  };
};

// Public API exposed globally
window.StocksSnapshot = createStocksSnapshot();
```

#### Configuration Schema

```javascript
{
  containerId: 'stocks-widget',     // Required
  symbol: 'AAPL',                   // Optional, default: 'MSFT'
  apiKey: 'YOUR_API_KEY',           // Required
  refreshInterval: 60000,           // Optional, default: 60s (ms)
  theme: {                          // Optional
    primaryColor: '#007bff',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    fontFamily: 'system-ui, sans-serif',
    borderRadius: '8px'
  },
  sparkline: {                      // Optional
    enabled: false,
    period: '24h'                   // '24h' or '7d'
  },
  onClick: (symbol) => { },         // Optional click handler
  observability: {                  // Optional
    enabled: true,
    otlpEndpoint: null,             // null = console fallback
    debug: false
  }
}
```

#### Initialization Flow

1. **Validation**: Check required params (containerId, apiKey)
2. **Telemetry Setup**: Initialize OpenTelemetry tracer and meter
3. **Container Check**: Verify DOM element exists
4. **Shadow DOM**: Attach shadow root with mode: 'open'
5. **Styles Injection**: Inject base styles + theme overrides
6. **Data Fetch**: Start telemetry span, fetch stock data
7. **Render**: Paint initial UI
8. **Promise Resolution**: Resolve on first paint (performance.now())
9. **Auto-refresh**: Schedule periodic updates

### 3. Isolation & Theming

#### Shadow DOM Strategy

```javascript
// Factory function for shadow DOM management
const createShadowDOMManager = () => {
  const getBaseStyles = () => {
    // Return base styles string
  };

  const getThemeVariables = (theme) => {
    // Return theme CSS variables string
  };

  const createShadowRoot = (container, theme) => {
    const shadowRoot = container.attachShadow({ mode: "open" });

    // Inject styles
    const styleSheet = document.createElement("style");
    styleSheet.textContent = getBaseStyles();
    shadowRoot.appendChild(styleSheet);

    // Inject theme variables
    const themeSheet = document.createElement("style");
    themeSheet.textContent = getThemeVariables(theme);
    shadowRoot.appendChild(themeSheet);

    return shadowRoot;
  };

  return {
    createShadowRoot,
  };
};
```

#### CSS Variables Approach

```css
:host {
  /* Default theme */
  --stocks-primary-color: #007bff;
  --stocks-bg-color: #ffffff;
  --stocks-text-color: #333333;
  --stocks-font-family: system-ui, -apple-system, sans-serif;
  --stocks-border-radius: 8px;
  --stocks-padding: 16px;
  --stocks-positive-color: #22c55e;
  --stocks-negative-color: #ef4444;

  display: block;
  font-family: var(--stocks-font-family);
}
```

#### Theme Application

1. **CSS Variables**: Applied to :host in shadow root
2. **JS API**: Config.theme object merged with defaults
3. **External Fonts**: @import or <link> in shadow DOM
4. **Runtime Updates**: Dynamic CSS variable modification

### 4. Core Functionality

#### Stock Data Service

```javascript
// Factory function for stock data service
const createStockDataService = (apiKey, telemetry) => {
  const baseUrl = "https://www.alphavantage.co/query";

  const parseQuoteData = (data) => {
    const quote = data["Global Quote"];
    return {
      symbol: quote["01. symbol"],
      price: parseFloat(quote["05. price"]),
      change: parseFloat(quote["09. change"]),
      changePercent: parseFloat(quote["10. change percent"].replace("%", "")),
      timestamp: new Date(quote["07. latest trading day"]),
    };
  };

  const fetchQuote = async (symbol) => {
    const span = telemetry.startSpan("stocks.fetch");

    try {
      const url = `${baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        telemetry.recordError("api_error");
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const quote = parseQuoteData(data);

      span.end();
      return quote;
    } catch (error) {
      span.recordException(error);
      span.end();
      throw error;
    }
  };

  return {
    fetchQuote,
  };
};
```

#### Widget Renderer

```javascript
// Factory function for widget renderer
const createWidgetRenderer = (telemetry) => {
  const formatTime = (timestamp) => {
    // Format timestamp helper
    return new Date(timestamp).toLocaleString();
  };

  const render = (shadowRoot, data, theme) => {
    const span = telemetry.startSpan("widget.render");

    const container = document.createElement("div");
    container.className = "stocks-widget";

    const isPositive = data.change >= 0;
    const changeClass = isPositive ? "positive" : "negative";
    const changeIcon = isPositive ? "▲" : "▼";

    container.innerHTML = `
      <div class="widget-header">
        <h3 class="symbol">${data.symbol}</h3>
        <span class="company-name">${data.companyName || ""}</span>
      </div>
      <div class="widget-body">
        <div class="price">$${data.price.toFixed(2)}</div>
        <div class="change ${changeClass}">
          <span class="change-icon">${changeIcon}</span>
          <span class="change-value">${data.change.toFixed(2)}</span>
          <span class="change-percent">(${data.changePercent.toFixed(
            2
          )}%)</span>
        </div>
      </div>
      <div class="widget-footer">
        <span class="timestamp">Updated: ${formatTime(
          data.timestamp
        )}</span>
      </div>
    `;

    shadowRoot.innerHTML = "";
    shadowRoot.appendChild(container);

    span.end();
  };

  return {
    render,
  };
};
```

### 5. Observability (OpenTelemetry)

#### Telemetry Manager

```javascript
import { trace, metrics } from "@opentelemetry/api";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { MeterProvider } from "@opentelemetry/sdk-metrics";

// Factory function for telemetry manager
const createTelemetryManager = (config) => {
  let tracer = null;
  let meter = null;
  let initHistogram = null;
  let errorCounter = null;

  const setupConsoleFallback = () => {
    // Console-based fallback implementation
  };

  const initialize = () => {
    if (!config.enabled) {
      setupConsoleFallback();
      return;
    }

    // Setup tracer
    const provider = new WebTracerProvider();

    if (config.otlpEndpoint) {
      const exporter = new OTLPTraceExporter({
        url: config.otlpEndpoint,
      });
      provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    } else {
      provider.addSpanProcessor(new ConsoleSpanExporter());
    }

    provider.register();
    tracer = trace.getTracer("stocks-widget", "1.0.0");

    // Setup metrics
    const meterProvider = new MeterProvider();
    meter = meterProvider.getMeter("stocks-widget");

    initHistogram = meter.createHistogram("widget.init.duration", {
      description: "Time from init to first paint",
      unit: "ms",
    });

    errorCounter = meter.createCounter("api.errors", {
      description: "API error count",
    });
  };

  const startSpan = (name) => {
    return tracer.startSpan(name);
  };

  const recordInitTime = (duration) => {
    initHistogram.record(duration);
  };

  const recordError = (type) => {
    errorCounter.add(1, { errorType: type });
  };

  return {
    initialize,
    startSpan,
    recordInitTime,
    recordError,
  };
};
```

#### Instrumented Initialization

```javascript
const init = async (config) => {
  const startTime = performance.now();
  const telemetry = createTelemetryManager(config.observability);
  telemetry.initialize();

  const rootSpan = telemetry.startSpan('stocks.init');

  try {
    // ... initialization logic ...

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
```

### 6. Performance Optimization

#### Bundle Size Strategy

1. **Core bundle** (<30KB gzipped): Init, render, fetch, basic theme
2. **Sparkline chunk** (lazy-loaded): Charting library
3. **Advanced theme** (lazy-loaded): Complex theming features

#### Package Configuration

**package.json** (ES Module Configuration)

```json
{
  "name": "r2-stocks-snapshot",
  "version": "1.0.0",
  "type": "module",
  "description": "Embeddable stock quote widget",
  "main": "dist/stocks.bundle.js",
  "module": "dist/stocks.esm.js",
  "scripts": {
    "dev": "webpack serve --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js",
    "test": "jest",
    "test:e2e": "playwright test"
  },
  "devDependencies": {
    "@babel/core": "^7.23.0",
    "@babel/preset-env": "^7.23.0",
    "babel-loader": "^9.1.3",
    "compression-webpack-plugin": "^10.0.0",
    "css-loader": "^6.8.1",
    "jest": "^29.7.0",
    "postcss": "^8.4.31",
    "postcss-loader": "^7.3.3",
    "style-loader": "^3.3.3",
    "terser-webpack-plugin": "^5.3.9",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^4.15.1",
    "webpack-merge": "^5.10.0"
  },
  "dependencies": {
    "@opentelemetry/api": "^1.6.0",
    "@opentelemetry/exporter-trace-otlp-http": "^0.43.0",
    "@opentelemetry/sdk-metrics": "^1.17.0",
    "@opentelemetry/sdk-trace-web": "^1.17.0"
  }
}
```

**Important**: The `"type": "module"` field enables ES module syntax for `.js` files in Node.js, allowing `import`/`export` instead of `require()`/`module.exports`.

#### Webpack Configuration

**webpack.config.js** (Common configuration)

```javascript
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commonConfig = {
  entry: "./src/core/StocksSnapshot.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".json"],
  },
};

export default commonConfig;
```

**webpack.prod.js** (Production build)

```javascript
import { merge } from "webpack-merge";
import common from "./webpack.config.js";
import TerserPlugin from "terser-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";

export default merge(common, {
  mode: "production",
  output: {
    filename: "stocks.bundle.js",
    library: {
      name: "StocksSnapshot",
      type: "umd",
      export: "default",
    },
    globalObject: "this",
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            passes: 2,
          },
          mangle: true,
        },
      }),
    ],
    splitChunks: {
      chunks: "async",
      cacheGroups: {
        sparkline: {
          test: /[\\/]features[\\/]Sparkline/,
          name: "sparkline",
          chunks: "async",
          priority: 10,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "async",
          priority: 5,
        },
      },
    },
    usedExports: true, // Tree shaking
    sideEffects: false,
  },
  plugins: [
    new CompressionPlugin({
      filename: "[path][base].gz",
      algorithm: "gzip",
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8,
    }),
  ],
  devtool: "source-map",
});
```

**webpack.dev.js** (Development build)

```javascript
import { merge } from "webpack-merge";
import common from "./webpack.config.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(common, {
  mode: "development",
  output: {
    filename: "stocks.bundle.js",
    library: {
      name: "StocksSnapshot",
      type: "umd",
      export: "default",
    },
    globalObject: "this",
  },
  devtool: "eval-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "demo"),
    },
    port: 3000,
    hot: true,
    open: true,
    compress: true,
  },
});
```

#### Lazy Loading Pattern

```javascript
// Sparkline feature
async enableSparkline() {
  if (!this.sparklineModule) {
    this.sparklineModule = await import('./features/Sparkline.js');
  }
  return this.sparklineModule.render(this.shadowRoot, this.historicalData);
}
```

#### Performance Techniques

1. **requestIdleCallback**: Non-critical rendering
2. **Intersection Observer**: Load data when widget visible
3. **Resource Hints**: `<link rel="dns-prefetch">` for API
4. **Debouncing**: Resize and theme change handlers
5. **Virtual DOM diffing**: Minimal re-renders

### 7. Auto-Refresh & Interactivity

#### Refresh Manager

```javascript
// Factory function for refresh manager
const createRefreshManager = (interval, callback) => {
  let timerId = null;
  let isVisible = true;

  const scheduleNext = () => {
    timerId = setTimeout(() => {
      if (isVisible) {
        callback();
      }
      scheduleNext();
    }, interval);
  };

  const setupVisibilityListener = () => {
    document.addEventListener("visibilitychange", () => {
      isVisible = !document.hidden;
      if (isVisible) {
        callback(); // Refresh immediately when visible
      }
    });
  };

  const start = () => {
    scheduleNext();
    setupVisibilityListener();
  };

  const stop = () => {
    clearTimeout(timerId);
  };

  return {
    start,
    stop,
  };
};
```

#### Click Handler

```javascript
// Pure function for click handler setup
const setupClickHandler = (element, symbol, handler) => {
  if (handler && typeof handler === 'function') {
    element.style.cursor = 'pointer';
    element.addEventListener('click', () => handler(symbol));
  }
};
```

### 8. Mobile-First Responsive Design

#### CSS Approach

```css
.stocks-widget {
  /* Mobile-first base styles */
  width: 100%;
  min-width: 280px;
  padding: var(--stocks-padding);
  background: var(--stocks-bg-color);
  border-radius: var(--stocks-border-radius);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Tablet */
@media (min-width: 768px) {
  .stocks-widget {
    min-width: 320px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .stocks-widget {
    min-width: 360px;
  }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :host {
    --stocks-bg-color: #1e1e1e;
    --stocks-text-color: #e0e0e0;
  }
}

/* High DPI */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .widget-icon {
    /* High-res assets */
  }
}
```

### 9. Testing Strategy

#### Unit Tests

```javascript
// tests/unit/StocksSnapshot.test.js
import { createStocksSnapshot } from "../../src/core/StocksSnapshot";

describe("StocksSnapshot init", () => {
  test("resolves on first paint", async () => {
    const container = document.createElement("div");
    container.id = "test-widget";
    document.body.appendChild(container);

    const stocksSnapshot = createStocksSnapshot();
    const result = await stocksSnapshot.init({
      containerId: "test-widget",
      symbol: "AAPL",
      apiKey: "test-key",
    });

    expect(result.success).toBe(true);
    expect(result.paintTime).toBeGreaterThan(0);
  });

  test("rejects on invalid config", async () => {
    const stocksSnapshot = createStocksSnapshot();
    await expect(stocksSnapshot.init({})).rejects.toThrow(
      "containerId is required"
    );
  });
});
```

#### E2E Tests (Bonus)

```javascript
// tests/e2e/widget.spec.js
import { test, expect } from "@playwright/test";

test("widget renders with correct data", async ({ page }) => {
  await page.goto("http://localhost:8080/demo");

  const widget = page.locator("#stocks-widget");
  await expect(widget).toBeVisible();

  const price = widget.locator(".price");
  await expect(price).toContainText("$");

  const change = widget.locator(".change");
  await expect(change).toHaveClass(/positive|negative/);
});
```

### 10. Docker Configuration

#### Multi-Stage Dockerfile

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Runtime stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/demo /usr/share/nginx/html/demo
COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose

```yaml
version: "3.8"

services:
  widget:
    build: .
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production

  demo:
    image: nginx:alpine
    volumes:
      - ./demo:/usr/share/nginx/html
    ports:
      - "3000:80"
```

### 11. Documentation Structure

#### README.md Sections

1. **Quick Start**: 2-line embed example
2. **Installation**: NPM or CDN usage
3. **Configuration**: All options with examples
4. **Theming Guide**: CSS variables + JS API
5. **API Reference**: init(), destroy(), update()
6. **Observability**: How to view traces/metrics
7. **Development**: Local setup, build commands
8. **Docker**: Build and run instructions
9. **Performance**: Bundle size, optimization tips
10. **Browser Support**: Compatibility matrix
11. **Contributing**: Guidelines
12. **License**: MIT

---

## Implementation Checklist

### Phase 1: Core Foundation

- [ ] Project setup (package.json with `"type": "module"`, build config)
- [ ] Vanilla JS widget skeleton using ES modules
- [ ] Shadow DOM integration
- [ ] StocksSnapshot.init() API
- [ ] Config validation
- [ ] Error handling

### Phase 2: Data & Rendering

- [ ] Stock API integration (Alpha Vantage)
- [ ] Data service with caching
- [ ] Widget HTML/CSS templates
- [ ] Mobile-responsive styles
- [ ] Dark mode support

### Phase 3: Theming

- [ ] CSS Variables system
- [ ] JS theme API
- [ ] External font loading
- [ ] Theme presets

### Phase 4: Observability

- [ ] OpenTelemetry setup
- [ ] Spans for fetch & render
- [ ] Metrics (init time, errors)
- [ ] Console fallback
- [ ] DevTools integration

### Phase 5: Performance

- [ ] Bundle optimization (<50KB)
- [ ] Code-splitting setup
- [ ] Lazy-loading sparkline
- [ ] Resource hints
- [ ] Performance monitoring

### Phase 6: Features

- [ ] Auto-refresh mechanism
- [ ] Sparkline chart (optional)
- [ ] Click handlers
- [ ] Visibility-based pausing

### Phase 7: Testing

- [ ] Jest setup
- [ ] Unit tests (init, config, render)
- [ ] E2E tests (Playwright) - bonus
- [ ] CI integration - bonus

### Phase 8: Docker & Deployment

- [ ] Multi-stage Dockerfile
- [ ] Nginx configuration
- [ ] docker-compose.yml
- [ ] Build optimization

### Phase 9: Documentation

- [ ] Comprehensive README
- [ ] Demo page with examples
- [ ] API documentation
- [ ] Observability guide

### Phase 10: Polish

- [ ] Code review and cleanup
- [ ] Performance audit
- [ ] Accessibility check
- [ ] Browser testing
- [ ] Final bundle size check

---

## Technology Decisions & Rationale

### Why Vanilla JS with Functional Approach?

1. **Zero dependencies**: Smaller bundle, no framework overhead
2. **Universal compatibility**: Works anywhere
3. **Longevity**: No framework migration needed
4. **Performance**: Direct DOM manipulation is fast
5. **Evaluation criteria**: Explicitly preferred in requirements
6. **Functional paradigm benefits**:
   - **Composability**: Factory functions can be easily composed and combined
   - **Testability**: Pure functions and closures are easier to test in isolation
   - **No `this` context issues**: Eliminates common class-based pitfalls
   - **Smaller bundle**: Function declarations are more tree-shakeable than classes
   - **Immutability-friendly**: Encourages immutable patterns and pure functions
   - **Closure-based encapsulation**: Private state via closures is natural and lightweight

### Why Shadow DOM?

1. **Complete isolation**: No CSS/JS collisions
2. **Encapsulation**: Private implementation details
3. **Native API**: No polyfills needed for modern browsers
4. **Themeable**: CSS variables pierce shadow boundary

### Why Alpha Vantage?

1. **Free tier**: Good for demo
2. **Real-time data**: Global quote endpoint
3. **Historical data**: For sparkline feature
4. **Reliable**: Well-documented API

### Why Webpack?

1. **Tree-shaking**: Advanced dead code elimination with production mode and ES modules
2. **Multiple formats**: Supports UMD, ES modules, CommonJS simultaneously
3. **Code-splitting**: Powerful splitChunks optimization with cacheGroups
4. **Rich ecosystem**: Extensive plugin and loader ecosystem
5. **Dev experience**: Built-in dev server, HMR, and source maps
6. **Asset management**: Built-in handling for CSS, images, fonts
7. **ES Module support**: Native support for modern import/export syntax

---

## Performance Targets

| Metric      | Target        | Strategy                                   |
| ----------- | ------------- | ------------------------------------------ |
| Bundle size | <50KB gzipped | Tree-shaking, minification, code-splitting |
| First paint | <200ms on 3G  | Async loading, critical path optimization  |
| TTI         | <1s on 3G     | Minimal JS execution, lazy features        |
| API latency | <500ms        | Caching, retry logic                       |
| Memory      | <5MB          | Efficient data structures, cleanup         |
| Lighthouse  | >90           | Best practices, accessibility              |

---

## Risk Mitigation

### API Rate Limits

- **Risk**: Alpha Vantage free tier = 5 calls/min
- **Mitigation**: Client-side caching, configurable refresh, warning in docs

### Bundle Size Creep

- **Risk**: Feature additions increase bundle
- **Mitigation**: Strict code-splitting, bundle analysis, size CI checks

### Browser Compatibility

- **Risk**: Shadow DOM not supported in IE11
- **Mitigation**: Document minimum browser versions, polyfill option

### Theme Conflicts

- **Risk**: CSS variables might not pierce shadow DOM in some browsers
- **Mitigation**: Test extensively, fallback to JS-based theming

---

## Success Metrics

1. **Bundle size**: ≤50KB gzipped core
2. **First paint**: <200ms on simulated 3G
3. **Test coverage**: >80%
4. **Lighthouse score**: >90
5. **Zero external dependencies** (runtime)
6. **Docker image**: <50MB
7. **Observability**: Full trace export working

This implementation plan provides a comprehensive roadmap to build a production-ready embeddable stock widget that meets all evaluation criteria.
