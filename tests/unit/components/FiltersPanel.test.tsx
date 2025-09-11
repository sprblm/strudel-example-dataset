import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FiltersPanel } from '@/components/FiltersPanel';
import { useAppState } from '@/context/ContextProvider';
import { useNavigate } from '@tanstack/react-router';

vi.mock('@/context/ContextProvider');
vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
}));

const mockDispatch = vi.fn();
const mockUseAppState = vi.mocked(useAppState);
const mockNavigate = vi.fn();

const mockUseNavigate = vi.mocked(useNavigate);

describe('FiltersPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAppState.mockReturnValue({
      state: { selectedSpecies: ['Adelie'], selectedIsland: 'Biscoe', selectedSex: 'male' }, // Active
      dispatch: mockDispatch,
    });
    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  it('renders clear button when filters active', () => {
    render(<FiltersPanel />);
    expect(screen.getByTestId('clear-filters-button')).toBeInTheDocument();
    expect(screen.getByText(/clear 3 filter/i)).toBeInTheDocument();
  });

  it('hides clear button when no filters active', () => {
    mockUseAppState.mockReturnValue({
      state: { selectedSpecies: ['Adelie', 'Chinstrap', 'Gentoo'], selectedIsland: 'all', selectedSex: 'all' }, // Default
      dispatch: mockDispatch,
    });

    render(<FiltersPanel />);
    expect(screen.queryByTestId('clear-filters-button')).not.toBeInTheDocument();
  });

  it('dispatches clear and navigates on click', () => {
    render(<FiltersPanel />);
    const button = screen.getByTestId('clear-filters-button');
    fireEvent.click(button);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CLEAR_ALL_FILTERS',
      payload: null,
    });
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/penguins/', search: expect.any(Function) });
  });

  it('announces clear action', () => {
    render(<FiltersPanel />);
    const button = screen.getByTestId('clear-filters-button');
    fireEvent.click(button);

    expect(screen.getByRole('alert')).toHaveTextContent('All filters cleared');
  });
});