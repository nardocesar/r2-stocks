# R2 Stocks Snapshot

A lightweight, embeddable stock quote widget built with vanilla JavaScript and functional programming patterns. Features Shadow DOM isolation, themeable design, and built-in observability with OpenTelemetry.

## Features

- **Zero Dependencies**: Pure vanilla JavaScript with no framework overhead
- **Shadow DOM Isolation**: Complete CSS and JavaScript encapsulation
- **Themeable**: Customizable via CSS variables or JavaScript API
- **Real-time Updates**: Auto-refresh with configurable intervals
- **Observability**: Built-in OpenTelemetry instrumentation
- **Mobile-First**: Responsive design that works on all devices
- **Production-Ready**: Docker support with multi-stage builds

## Quick Start

### 1. Add to Your Page

```html
<!-- Add container -->
<div id="stocks-widget"></div>

<!-- Include the widget script -->
<script src="stocks.bundle.js"></script>

<!-- Initialize -->
<script>
  StocksSnapshot.init({
    containerId: 'stocks-widget',
    symbol: 'AAPL',
    apiKey: 'YOUR_ALPHA_VANTAGE_API_KEY',
    refreshInterval: 60000
  });
</script>
```

### 2. Get an API Key

Sign up for a free API key at [Alpha Vantage](https://www.alphavantage.co/support/#api-key).

## Configuration Options

```javascript
{
  containerId: 'stocks-widget',     // Required: DOM element ID
  apiKey: 'YOUR_API_KEY',           // Required: Alpha Vantage API key
  symbol: 'AAPL',                   // Optional: Stock symbol (default: 'MSFT')
  refreshInterval: 60000,           // Optional: Update interval in ms (default: 60000, min: 5000)

  theme: {                          // Optional: Custom theme
    primaryColor: '#007bff',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    fontFamily: 'system-ui, sans-serif',
    borderRadius: '8px'
  },

  observability: {                  // Optional: Telemetry settings
    enabled: true,
    otlpEndpoint: null,             // Optional: OTLP endpoint URL
    debug: false                    // Enable debug logging
  }
}
```

## API Reference

### `init(config)`

Initialize a new widget instance.

```javascript
const result = await StocksSnapshot.init({
  containerId: 'widget-1',
  symbol: 'AAPL',
  apiKey: 'YOUR_API_KEY'
});

console.log(`Widget initialized in ${result.paintTime}ms`);
```

### `update(containerId, newConfig)`

Update an existing widget.

```javascript
StocksSnapshot.update('widget-1', {
  symbol: 'MSFT',
  theme: { primaryColor: '#00ff00' }
});
```

### `destroy(containerId)`

Remove a widget instance.

```javascript
StocksSnapshot.destroy('widget-1');
```

## Development

### Prerequisites

- Node.js 20+
- npm or yarn

### Setup

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Opens at `http://localhost:3000` with hot reload.

### Build

```bash
npm run build
```

Outputs to `dist/` directory.

### Run Tests

```bash
npm test
```

### Docker

Build and run with Docker:

```bash
docker-compose up
```

Access at `http://localhost:8080`

## Architecture

This project uses functional programming patterns:

- **Factory Functions**: Instead of classes for better composability
- **Closures**: Private state without class syntax
- **Pure Functions**: Predictable, testable code
- **ES Modules**: Modern import/export throughout

### Project Structure

```
r2-stocks/
├── src/
│   ├── core/              # Main entry point and core logic
│   ├── services/          # Data fetching and refresh management
│   ├── theming/           # Theme engine and styles
│   ├── observability/     # OpenTelemetry integration
│   └── utils/             # Formatters and validators
├── demo/                  # Demo page
├── tests/                 # Unit tests
├── dist/                  # Build output
└── docker/                # Docker configuration
```

## Performance

- Bundle size: <50KB gzipped
- First paint: <200ms on 3G
- Zero runtime dependencies
- Efficient Shadow DOM rendering

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

Requires native Shadow DOM support.

## License

MIT

## Contributing

Contributions welcome! Please ensure:

1. Tests pass: `npm test`
2. Code follows functional patterns
3. No unnecessary comments
4. Bundle size remains under 50KB

## API Rate Limits

Alpha Vantage free tier allows 5 API calls per minute. The widget includes intelligent caching and error handling. For production use, consider:

- Setting `refreshInterval` to 300000 (5 minutes) or higher
- Implementing server-side caching
- Upgrading to Alpha Vantage premium

## Acknowledgments

- Built with Webpack 5 and ES modules
- Stock data from Alpha Vantage
- Observability via OpenTelemetry
