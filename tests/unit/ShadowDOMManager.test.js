import { createShadowDOMManager } from "../../src/core/ShadowDOMManager.js";

describe("ShadowDOMManager", () => {
  let container;
  let shadowDOMManager;

  beforeEach(() => {
    container = document.createElement("div");
    container.id = "test-container";
    document.body.appendChild(container);
    shadowDOMManager = createShadowDOMManager();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe("createShadowRoot", () => {
    test("should create a shadow root on first call", () => {
      const shadowRoot = shadowDOMManager.createShadowRoot(container);

      expect(shadowRoot).toBeDefined();
      expect(container.shadowRoot).toBe(shadowRoot);
    });

    test("should reuse existing shadow root on subsequent calls", () => {
      const shadowRoot1 = shadowDOMManager.createShadowRoot(container);
      const shadowRoot2 = shadowDOMManager.createShadowRoot(container);

      expect(shadowRoot1).toBe(shadowRoot2);
      expect(container.shadowRoot).toBe(shadowRoot1);
    });

    test("should clear existing shadow root content when reused", () => {
      const shadowRoot1 = shadowDOMManager.createShadowRoot(container);
      const testElement = document.createElement("div");
      testElement.className = "test-element";
      shadowRoot1.appendChild(testElement);

      expect(shadowRoot1.querySelector(".test-element")).toBeTruthy();

      shadowDOMManager.createShadowRoot(container);

      expect(shadowRoot1.querySelector(".test-element")).toBeNull();
    });

    test("should inject base styles", () => {
      const shadowRoot = shadowDOMManager.createShadowRoot(container);
      const styleSheet = shadowRoot.querySelector("style");

      expect(styleSheet).toBeTruthy();
      expect(styleSheet.textContent).toContain(":host");
      expect(styleSheet.textContent).toContain(".stocks-widget");
    });

    test("should apply theme when provided", () => {
      const theme = {
        primaryColor: "#ff0000",
        backgroundColor: "#000000",
      };

      const shadowRoot = shadowDOMManager.createShadowRoot(container, theme);
      const themeStyle = shadowRoot.querySelector("#theme-variables");

      expect(themeStyle).toBeTruthy();
      expect(themeStyle.textContent).toContain("#ff0000");
      expect(themeStyle.textContent).toContain("#000000");
    });
  });

  describe("updateTheme", () => {
    test("should update theme on existing shadow root", () => {
      const shadowRoot = shadowDOMManager.createShadowRoot(container);
      const newTheme = {
        primaryColor: "#00ff00",
      };

      shadowDOMManager.updateTheme(shadowRoot, newTheme);

      const themeStyle = shadowRoot.querySelector("#theme-variables");
      expect(themeStyle).toBeTruthy();
      expect(themeStyle.textContent).toContain("#00ff00");
    });
  });
});
