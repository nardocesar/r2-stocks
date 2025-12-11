export const isValidContainerId = (id) => {
  return typeof id === "string" && id.length > 0;
};

export const isValidApiKey = (key) => {
  return typeof key === "string" && key.length > 0;
};

export const isValidSymbol = (symbol) => {
  return typeof symbol === "string" && /^[A-Z]{1,5}$/.test(symbol);
};

export const isValidRefreshInterval = (interval) => {
  return typeof interval === "number" && interval >= 5000;
};

export const isValidTheme = (theme) => {
  if (!theme || typeof theme !== "object") return true;

  const validKeys = [
    "primaryColor",
    "backgroundColor",
    "textColor",
    "fontFamily",
    "borderRadius",
  ];

  return Object.keys(theme).every((key) => validKeys.includes(key));
};
