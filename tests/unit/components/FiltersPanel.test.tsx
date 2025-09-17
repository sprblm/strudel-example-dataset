import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FiltersPanel } from '@/components/FiltersPanel';
import { useAppState } from '@/context/ContextProvider';
import { useNavigate } from '@tanstack/react-router';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

vi.mock('@/context/ContextProvider');
vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
}));

const mockDispatch = vi.fn();
const mockNavigate = vi.fn();
const mockUseAppState = vi.mocked(useAppState);
const mockUseNavigate = vi.mocked(useNavigate);

const theme = createTheme();

describe('FiltersPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseNavigate.mockReturnValue(mockNavigate);
    mockUseAppState.mockReturnValue({
      state: {
        appTitle: 'Penguins Explorer',
        apiModalOpen: false,
        helpModalOpen: false,
        selectedSpecies: ['Adelie'], // Only one species selected (out of 3) - this is an active filter
        selectedIsland: 'Biscoe', // Specific island selected (not 'all') - this is an active filter
        selectedSex: 'male', // Specific sex selected (not 'all') - this is an active filter
      },
      dispatch: mockDispatch,
    });
  });

  it('renders clear button when filters active', () => {
    render(
      <ThemeProvider theme={theme}>
        <FiltersPanel />
      </ThemeProvider>
    );
    expect(screen.getByTestId('clear-filters-button')).toBeInTheDocument();
    expect(screen.getByText(/clear 3 filter/i)).toBeInTheDocument();
  });

  it('hides clear button when no filters active', () => {
    mockUseAppState.mockReturnValue({
      state: {
        appTitle: 'Penguins Explorer',
        apiModalOpen: false,
        helpModalOpen: false,
        selectedSpecies: ['Adelie', 'Chinstrap', 'Gentoo'],
        selectedIsland: 'all',
        selectedSex: 'all',
      }, // Default
      dispatch: mockDispatch,
    });

    render(
      <ThemeProvider theme={theme}>
        <FiltersPanel />
      </ThemeProvider>
    );
    expect(
      screen.queryByTestId('clear-filters-button')
    ).not.toBeInTheDocument();
  });

  it('dispatches clear and navigates on click', () => {
    render(
      <ThemeProvider theme={theme}>
        <FiltersPanel />
      </ThemeProvider>
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
      <ThemeProvider theme={theme}>
        <FiltersPanel />
      </ThemeProvider>
    );
    const button = screen.getByTestId('clear-filters-button');
    fireEvent.click(button);

    // Wait for the alert to appear
    const alert = await screen.findByRole('status');
    expect(alert).toHaveTextContent('All filters cleared');
  });
});
