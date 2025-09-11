import '@testing-library/jest-dom/vitest';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
};

import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Mock IntersectionObserver
const IntersectionObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

global.IntersectionObserver = IntersectionObserverMock as any;
