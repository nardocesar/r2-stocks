```
HTML
```

# Frontend Widget Architect & Developer

# Challenge (R2Stocks)

## The Challenge: Build the Widget You'd Want to Use

Imagine this: You're browsing a finance blog. A sleek little widget quietly sits in the sidebar,
showing live AAPL stock prices styled to match the site, no janky scripts, no layout glitches. It
loads fast, feels native, updates itself, and just _works_. Now imagine you're the one who built it
and hundreds of sites rely on it.

That’s the idea behind **R2StocksSnapshot**.

## Objective

Design and build a **lightweight** , **embeddable** , and **fully isolated** stock quote widget that any
client can drop into their site with just a **two-line snippet**. It should be fast, configurable, and
production‑ready out of the box.

This challenge is about more than getting data on screen, it's about architecting something
robust, reusable, and delightful to use. You'll focus on embedding experience, real-time data
rendering, theming, performance, observability, and developer ergonomics.

## 1. Embeddability & Initialization

```
● Two‑line embed via HTML + JS:
```

```
<div id="stocks-widget"></div>
```

```
<script async src="https://cdn.example.com/stocks.bundle.js"></script>
```

```
<script>
```

```
StocksSnapshot.init({
```

```
containerId: 'stocks-widget',
```

```
symbol: 'AAPL',
```

```
apiKey: 'YOUR_API_KEY'
```

```
}).then(() => console.log('Stocks widget ready'));
```

```
</script>
```

```
● Auto‑mount into specified containerId.
● Promise‑based init() resolves on first paint, rejects on irreversible errors.
```

## 2. Isolation & Theming

```
● Style & script isolation via Shadow DOM or CSS Modules—no collisions.
● Custom themes:
○ CSS Variables (e.g. --stocks-primary-color, --stocks-font-family).
○ JS theme object in init() for colors, fonts, spacing.
○ Support loading external fonts.
```

## 3. Core Functionality

```
● Data Fetch:
○ Retrieve real‑time stock data (symbol, price, change %, timestamp).
○ Default symbol: MSFT if none provided.
○ Use a public market API (e.g. Alpha Vantage, IEX Cloud).
● Render:
○ Symbol and company name
○ Current price
○ Price change (absolute & percent) with up/down indicator
○ Last update timestamp
```

## 4. SSR & Vanilla JS Support (Optional Bonus)

```
● Server-Side Rendering (SSR) Bonus
If you're up for it, show us how the widget could support fast initial paint and SEO using
server-rendered markup:
○ Use Node.js/Express or any SSR-capable setup to:
■ Pre-render the initial widget markup on the server.
■ Deliver ready-to-paint HTML for faster perceived performance.
```

```
■ Hydrate the widget on the client side while preserving Shadow DOM
isolation.
```

```
● Vanilla JavaScript Compatibility Bonus
We love modern frameworks, but we also love lean, dependency-free components.
Prove your architectural flexibility by supporting vanilla usage:
● No reliance on React/Vue/etc. for core functionality.
● Fully functional via ES Modules or UMD bundle.
● Can run on legacy (but ES6-compatible) sites with no build tooling required.
● Use modern browser APIs (Shadow DOM, Custom Elements, Fetch, etc.)
natively.
● Provide a minimal standalone build (stocks.bundle.js) that works in any
<script async> context.
```

These are entirely optional, but demonstrating either (or both) will definitely earn you extra
credit.

## 5. Interactivity & Features

```
● Optional sparkline of past 24 h or 7 d.
● Auto‑refresh interval (configurable, default 60 s).
● Click handler hook for linking to full quote page.
```

## 5. Observability

```
● OpenTelemetry (@opentelemetry/api):
○ Spans: stocks.fetch, widget.render
○ Metrics: load time histogram (init→paint), API error count
○ Configurable OTLP endpoint or console.log fallback
● Allow clients to inspect traces in DevTools.
```

## 6. Performance, Mobile ‑ First Responsiveness & Bundle Size

```
● Mobile‑first, responsive design: fluid layouts that adapt to any container width/height;
supports light/dark modes and high‑DPI screens.
● Bundle ≤ 50 KB gzipped (core features).
● Code‑split non‑critical parts (sparkline charting, theme engine).
● Lazy‑load assets (chart lib, fonts).
● Load script with async or defer.
● Use requestIdleCallback for non‑urgent work.
● Bundle ≤ 50 KB gzipped (core features).
● Code‑split non‑critical parts (sparkline charting, theme engine).
● Lazy‑load assets (chart lib, fonts).
```

## 7. Containerization

```
● Multi‑stage Dockerfile:
```

1. Build stage (node:alpine) compiles & bundles.
2. Runtime stage (nginx:alpine) serves static assets.
   ● Bonus: docker‑compose.yml to launch widget service + demo host.

## 8. Documentation & Testing

```
● README.md :
○ Setup, build, embed instructions
○ How to customize theme & refresh interval
○ Observability guide (traces, metrics)
● **Demo **index.html showcasing theming, sparkline, auto‑refresh.
● Unit tests (Jest + Testing Library) for:
○ init() behavior
○ Config parsing and error handling
○ Rendering logic
● Bonus: E2E Tests
● Cypress / Playwright: Validate rendering, updates, theme, and interactivity
● Include run instructions (npm run e2e) and sample test
● Extra credit: CI-integrated
```

## 9. Submission & Evaluation

```
● Deliverables:
○ GitHub repo link
○ README.md
○ Dockerfile (+ optional docker‑compose.yml)
○ Sample demo page
○ Unit tests
○ E2e tests (if any)
○ Live demo URL or DockerHub image
● Timebox: In house project, 1 week maximum.
```

**Evaluation Criteria Focus Areas**

Architecture & Modularity Clear folder structure, minimal coupling, vanilla JS
preferred. SSR support bonus

Data Accuracy & Refresh Real‑time updates, correct change calculations

Observability Proper spans/metrics, end‑to‑end export

Performance & Size Fast first‑paint (<200 ms on simulated 3G), <50 KB
bundle

Embedding Experience Zero‑friction snippet, full isolation, config flexibility based
on
https://r2-api-docs.readme.io/docs/initialize-an-embedda
ble-component

Theming & Customization CSS var overrides + JS API

Containerization Reproducible, small Docker image

Docs & Testing Comprehensive README, working demo, robust tests
