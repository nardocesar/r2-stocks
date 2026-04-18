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

    if (variables.length === 0) {
      return '';
    }

    return `:host { ${variables.join("; ")} }`;
  };

  const applyTheme = (shadowRoot, theme) => {
    if (!shadowRoot) {
      console.error('applyTheme: shadowRoot is null or undefined');
      return;
    }

    const themeCSS = generateThemeCSS(theme);
    if (!themeCSS) {
      console.warn('applyTheme: No theme CSS generated');
      return;
    }

    let themeSheet = shadowRoot.querySelector("#theme-variables");
    if (themeSheet) {
      themeSheet.textContent = themeCSS;
      console.log('Theme updated:', theme);
    } else {
      themeSheet = document.createElement("style");
      themeSheet.id = "theme-variables";
      themeSheet.textContent = themeCSS;
      shadowRoot.appendChild(themeSheet);
      console.log('Theme applied:', theme);
    }
  };

  return {
    generateThemeCSS,
    applyTheme,
  };
};
