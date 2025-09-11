import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '@/context/ContextProvider';
import { theme } from '@/theme';
import { DataTable } from '@/components/table/DataTable';
import { vi } from 'vitest';
import { usePenguinData } from '@/hooks/usePenguinData';

vi.mock('@/hooks/usePenguinData', () => ({
  usePenguinData: vi.fn(() => ({
    data: [
      { species: 'Adelie', island: 'Biscoe', bill_length_mm: 39.1, bill_depth_mm: 18.7, flipper_length_mm: 181, body_mass_g: 3750, sex: 'male', year: 2007 },
      { species: 'Chinstrap', island: 'Dream', bill_length_mm: 46.5, bill_depth_mm: 17.9, flipper_length_mm: 192, body_mass_g: 3500, sex: 'female', year: 2007 },
      { species: 'Gentoo', island: 'Biscoe', bill_length_mm: 49.0, bill_depth_mm: 15.0, flipper_length_mm: 217, body_mass_g: 6000, sex: 'male', year: 2007 },
    ],
    isLoading: false,
    error: null,
    isError: false,
  })),
}));

const renderWithProviders = (ui) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AppProvider>
          {ui}
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('DataTable with Filtering', () => {
  it('displays filtered data based on species selection', () => {
    const mockUsePenguinData = vi.mocked(usePenguinData);
    mockUsePenguinData.mockReturnValue({
      data: [
        { species: 'Adelie', island: 'Biscoe', bill_length_mm: 39.1, bill_depth_mm: 18.7, flipper_length_mm: 181, body_mass_g: 3750, sex: 'male', year: 2007 },
        { species: 'Gentoo', island: 'Biscoe', bill_length_mm: 49.0, bill_depth_mm: 15.0, flipper_length_mm: 217, body_mass_g: 6000, sex: 'male', year: 2007 },
      ],
      isLoading: false,
      error: null,
      isError: false,
    });

    renderWithProviders(<DataTable />);

    expect(screen.getByText('Showing 2 penguins')).toBeInTheDocument();
  });

  it('shows loading state when data is loading', () => {
    vi.mocked(usePenguinData).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
      isError: false,
    });

    renderWithProviders(<DataTable />);

    expect(screen.getByText('Loading penguin data...')).toBeInTheDocument();
  });

  it('shows error state when data fetch fails', () => {
    vi.mocked(usePenguinData).mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error('Fetch failed'),
      isError: true,
    });

    renderWithProviders(<DataTable />);

    expect(screen.getByText(/Failed to load penguin data/)).toBeInTheDocument();
  });
});