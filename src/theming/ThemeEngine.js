export const createThemeEngine = () => {
  const generateThemeCSS = (theme) => {
    const variables = [];

    if (theme.primaryColor) {
      variables.push(`--stocks-primary-color: ${theme.primaryColor}`);
    }
    if (theme.backgroundColor) {
      variables.push(`--stocks-bg-color: ${theme.backgroundColor}`);
    }
    if (theme.textColor) {
      variables.push(`--stocks-text-color: ${theme.textColor}`);
    }
    if (theme.fontFamily) {
      variables.push(`--stocks-font-family: ${theme.fontFamily}`);
    }
    if (theme.borderRadius) {
      variables.push(`--stocks-border-radius: ${theme.borderRadius}`);
    }

    return `:host { ${variables.join("; ")}; }`;
  };

  const applyTheme = (shadowRoot, theme) => {
    const existingThemeSheet = shadowRoot.querySelector("#theme-variables");
    if (existingThemeSheet) {
      existingThemeSheet.textContent = generateThemeCSS(theme);
    } else {
      const themeSheet = document.createElement("style");
      themeSheet.id = "theme-variables";
      themeSheet.textContent = generateThemeCSS(theme);
      shadowRoot.appendChild(themeSheet);
    }
  };

  return {
    generateThemeCSS,
    applyTheme,
  };
};
