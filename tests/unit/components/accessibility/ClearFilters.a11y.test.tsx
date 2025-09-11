import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { FiltersPanel } from '@/components/FiltersPanel';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from '@tanstack/react-router';

// Mock Context
vi.mock('@/context/ContextProvider', () => ({
  useAppState: vi.fn(() => ({
    state: {
      selectedSpecies: ['Adelie'],
      selectedIsland: 'all',
      selectedSex: 'all',
    },
    dispatch: vi.fn(),
  })),
}));

// Create a simple router for testing
const rootRoute = createRootRoute({
  component: () => <FiltersPanel />,
});
const routeTree = rootRoute;
const memoryHistory = createMemoryHistory({
  initialEntries: ['/'],
});
const router = createRouter({ routeTree, history: memoryHistory });

expect.extend(toHaveNoViolations);

describe('ClearFilters Accessibility', () => {
  it('passes axe-core scan', async () => {
    const { container } = render(
      <RouterProvider router={router}>
        <FiltersPanel />
      </RouterProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('announces correctly to screen readers', async () => {
    render(
      <RouterProvider router={router}>
        <FiltersPanel />
      </RouterProvider>
    );
    const button = screen.getByTestId('clear-filters-button');
    fireEvent.click(button);

    // Wait for the alert to appear
    setTimeout(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'All filters cleared'
      );
    }, 100);
  });
});
