import "@testing-library/jest-dom/vitest";

// Mock window.matchMedia for Ant Design responsive components
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });

  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // Mock getComputedStyle
  const originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = (elt) => {
    try {
      return originalGetComputedStyle(elt);
    } catch {
      return {} as any;
    }
  };
}
