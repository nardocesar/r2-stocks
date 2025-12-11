import { trace, metrics } from "@opentelemetry/api";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { MeterProvider } from "@opentelemetry/sdk-metrics";
import { BatchSpanProcessor, ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";

export const createTelemetryManager = (config) => {
  let tracer = null;
  let meter = null;
  let initHistogram = null;
  let errorCounter = null;

  const createNoOpSpan = () => ({
    end: () => {},
    recordException: () => {},
    setAttribute: () => {},
  });

  const setupConsoleFallback = () => {
    tracer = {
      startSpan: (name) => {
        if (config.debug) console.log(`[Telemetry] Starting span: ${name}`);
        return createNoOpSpan();
      },
    };

    meter = {
      createHistogram: () => ({
        record: (value) => {
          if (config.debug) console.log(`[Telemetry] Recording metric: ${value}`);
        },
      }),
      createCounter: () => ({
        add: (value, attributes) => {
          if (config.debug) console.log(`[Telemetry] Counter increment:`, value, attributes);
        },
      }),
    };
  };

  const initialize = () => {
    if (!config.enabled) {
      setupConsoleFallback();
      return;
    }

    const provider = new WebTracerProvider();

    if (config.otlpEndpoint) {
      const exporter = new OTLPTraceExporter({
        url: config.otlpEndpoint,
      });
      provider.addSpanProcessor(new BatchSpanProcessor(exporter));
    } else {
      provider.addSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()));
    }

    provider.register();
    tracer = trace.getTracer("stocks-widget", "1.0.0");

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

  const startSpan = (name, options = {}) => {
    if (!tracer) {
      return createNoOpSpan();
    }
    return tracer.startSpan(name, options);
  };

  const recordInitTime = (duration) => {
    if (initHistogram) {
      initHistogram.record(duration);
    }
  };

  const recordError = (type) => {
    if (errorCounter) {
      errorCounter.add(1, { errorType: type });
    }
  };

  return {
    initialize,
    startSpan,
    recordInitTime,
    recordError,
  };
};
