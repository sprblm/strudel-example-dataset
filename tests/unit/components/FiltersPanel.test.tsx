import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FiltersPanel } from '@/components/FiltersPanel';
import { useAppState } from '@/context/ContextProvider';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from '@tanstack/react-router';

vi.mock('@/context/ContextProvider');

const mockDispatch = vi.fn();
const mockUseAppState = vi.mocked(useAppState);

// Create a simple router for testing
const rootRoute = createRootRoute({
  component: () => <FiltersPanel />,
});
const routeTree = rootRoute;
const memoryHistory = createMemoryHistory({
  initialEntries: ['/'],
});
const router = createRouter({ routeTree, history: memoryHistory });

describe('FiltersPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAppState.mockReturnValue({
      state: {
        selectedSpecies: ['Adelie'],
        selectedIsland: 'Biscoe',
        selectedSex: 'male',
      }, // Active
      dispatch: mockDispatch,
    });
  });

  it('renders clear button when filters active', () => {
    render(
      <RouterProvider router={router}>
        <FiltersPanel />
      </RouterProvider>
    );
    expect(screen.getByTestId('clear-filters-button')).toBeInTheDocument();
    expect(screen.getByText(/clear 3 filter/i)).toBeInTheDocument();
  });

  it('hides clear button when no filters active', () => {
    mockUseAppState.mockReturnValue({
      state: {
        selectedSpecies: ['Adelie', 'Chinstrap', 'Gentoo'],
        selectedIsland: 'all',
        selectedSex: 'all',
      }, // Default
      dispatch: mockDispatch,
    });

    render(
      <RouterProvider router={router}>
        <FiltersPanel />
      </RouterProvider>
    );
    expect(
      screen.queryByTestId('clear-filters-button')
    ).not.toBeInTheDocument();
  });

  it('dispatches clear and navigates on click', () => {
    render(
      <RouterProvider router={router}>
        <FiltersPanel />
      </RouterProvider>
    );
    const button = screen.getByTestId('clear-filters-button');
    fireEvent.click(button);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CLEAR_ALL_FILTERS',
      payload: null,
    });
  });

  it('announces clear action', async () => {
    render(
      <RouterProvider router={router}>
        <FiltersPanel />
      </RouterProvider>
    );
    const button = screen.getByTestId('clear-filters-button');
    fireEvent.click(button);

    // Wait for the alert to appear
    setTimeout(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'All filters cleared'
      );
    }, 100);
  });
});
