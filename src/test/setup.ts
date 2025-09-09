import '@testing-library/jest-dom/vitest';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
};