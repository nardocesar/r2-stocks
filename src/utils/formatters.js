export const formatPrice = (price) => {
  return `$${price.toFixed(2)}`;
};

export const formatChange = (change) => {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}`;
};

export const formatPercent = (percent) => {
  const sign = percent >= 0 ? "+" : "";
  return `${sign}${percent.toFixed(2)}%`;
};

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
