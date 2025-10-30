import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { IslandFilter } from '@/components/filters/IslandFilter';
import { useAppState } from '@/context/ContextProvider';

// Mock the context
vi.mock('@/context/ContextProvider', () => ({
  useAppState: vi.fn(),
}));

const mockUseAppState = vi.mocked(useAppState);
const mockDispatch = vi.fn();

const theme = createTheme();

const baseState = {
  appTitle: 'Penguins Explorer',
  apiModalOpen: false,
  helpModalOpen: false,
  selectedSpecies: ['Adelie', 'Chinstrap', 'Gentoo'],
  selectedIsland: 'all',
  selectedSex: 'all',
  selectedDiet: ['fish', 'krill', 'squid', 'parental'],
  selectedLifeStage: 'all',
  selectedYearRange: [2021, 2025],
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('IslandFilter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDispatch.mockClear();
  });

  it('renders island filter with default "All" selection', () => {
    mockUseAppState.mockReturnValue({
      state: { ...baseState },
      dispatch: mockDispatch,
    });

    renderWithTheme(<IslandFilter />);

    expect(screen.getByText('Island Filter')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Filter penguins by island')
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('all')).toBeInTheDocument();
  });

  it('displays all island options when dropdown is opened', async () => {
    mockUseAppState.mockReturnValue({
      state: { ...baseState },
      dispatch: mockDispatch,
    });

    renderWithTheme(<IslandFilter />);

    const select = screen.getByLabelText('Filter penguins by island');
    fireEvent.mouseDown(select);

    await waitFor(() => {
      expect(screen.getByTestId('island-option-all')).toBeInTheDocument();
      expect(screen.getByTestId('island-option-biscoe')).toBeInTheDocument();
      expect(screen.getByTestId('island-option-dream')).toBeInTheDocument();
      expect(screen.getByTestId('island-option-torgersen')).toBeInTheDocument();
    });
  });

  it('calls dispatch with UPDATE_ISLAND_FILTER when selection changes', async () => {
    mockUseAppState.mockReturnValue({
      state: { ...baseState },
      dispatch: mockDispatch,
    });

    renderWithTheme(<IslandFilter />);

    const select = screen.getByLabelText('Filter penguins by island');
    fireEvent.mouseDown(select);

    const biscoeOption = await screen.findByTestId('island-option-biscoe');
    fireEvent.click(biscoeOption);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_ISLAND_FILTER',
      payload: 'Biscoe',
    });
  });

  it('shows visual feedback when specific island is selected', () => {
    mockUseAppState.mockReturnValue({
      state: { ...baseState, selectedIsland: 'Biscoe' },
      dispatch: mockDispatch,
    });

    renderWithTheme(<IslandFilter />);

    expect(screen.getByTestId('island-filter-feedback')).toBeInTheDocument();
    expect(screen.getByText('Filtering by: Biscoe')).toBeInTheDocument();
  });

  it('does not show visual feedback when "All" is selected', () => {
    mockUseAppState.mockReturnValue({
      state: { ...baseState },
      dispatch: mockDispatch,
    });

    renderWithTheme(<IslandFilter />);

    expect(
      screen.queryByTestId('island-filter-feedback')
    ).not.toBeInTheDocument();
  });

  it('handles keyboard navigation properly', async () => {
    mockUseAppState.mockReturnValue({
      state: { ...baseState },
      dispatch: mockDispatch,
    });

    renderWithTheme(<IslandFilter />);

    const select = screen.getByLabelText('Filter penguins by island');

    // Test keyboard focus
    select.focus();
    expect(select).toHaveFocus();

    // Test Enter key opens dropdown
    fireEvent.keyDown(select, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByTestId('island-option-all')).toBeInTheDocument();
    });
  });

  it('has proper ARIA attributes for accessibility', () => {
    mockUseAppState.mockReturnValue({
      state: {
        appTitle: 'Penguins Explorer',
        apiModalOpen: false,
        selectedSpecies: ['Adelie', 'Chinstrap', 'Gentoo'],
        selectedIsland: 'all',
        selectedSex: 'all',
      },
      dispatch: mockDispatch,
    });

    renderWithTheme(<IslandFilter />);

    const select = screen.getByLabelText('Filter penguins by island');
    expect(select).toHaveAttribute('aria-label', 'Filter penguins by island');

    const legend = screen.getByText('Island Filter');
    expect(legend).toHaveAttribute('id', 'island-filter-legend');
  });

  it('maintains selection state correctly', () => {
    mockUseAppState.mockReturnValue({
      state: { ...baseState, selectedIsland: 'Dream' },
      dispatch: mockDispatch,
    });

    renderWithTheme(<IslandFilter />);

    const select = screen.getByDisplayValue('Dream');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Filtering by: Dream')).toBeInTheDocument();
  });

  it('handles empty or undefined selectedIsland gracefully', () => {
    mockUseAppState.mockReturnValue({
      state: { ...baseState, selectedIsland: undefined },
      dispatch: mockDispatch,
    });

    renderWithTheme(<IslandFilter />);

    // Should default to 'all' when selectedIsland is undefined
    expect(screen.getByDisplayValue('all')).toBeInTheDocument();
    expect(
      screen.queryByTestId('island-filter-feedback')
    ).not.toBeInTheDocument();
  });
});
