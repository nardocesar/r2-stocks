export const createStockDataService = (apiKey, telemetry) => {
  const baseUrl = "https://www.alphavantage.co/query";

  const parseQuoteData = (data) => {
    const quote = data["Global Quote"];
    if (!quote || Object.keys(quote).length === 0) {
      console.error("API Response:", JSON.stringify(data, null, 2));
      throw new Error("No data available. Check API key or wait for rate limit (5 calls/min)");
    }

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

      if (data.Note) {
        telemetry.recordError("rate_limit");
        console.warn("Rate limit message:", data.Note);
        throw new Error("API rate limit (5 calls/min). Please wait and refresh.");
      }

      if (data["Error Message"]) {
        telemetry.recordError("invalid_symbol");
        throw new Error(`Invalid symbol: ${data["Error Message"]}`);
      }

      if (data.Information) {
        telemetry.recordError("api_info");
        console.warn("API Info:", data.Information);
        throw new Error("API limit reached. Please wait and try again.");
      }

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
