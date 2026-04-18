// Lightweight no-op telemetry manager for when observability is disabled
// This prevents loading heavy OpenTelemetry dependencies

export const createNoOpTelemetryManager = () => {
  const noOpSpan = {
    end: () => {},
    recordException: () => {},
  };

  return {
    initialize: () => {},
    startSpan: () => noOpSpan,
    recordInitTime: () => {},
    recordError: () => {},
    recordApiCall: () => {},
  };
};
