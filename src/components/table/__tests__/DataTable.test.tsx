import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { vi } from 'vitest';
import { theme } from '@/theme';
import { DataTable } from '../DataTable';

// Mock the usePenguinData hook
vi.mock('@/hooks/usePenguinData', () => ({
  usePenguinData: vi.fn(),
}));

import { usePenguinData } from '@/hooks/usePenguinData';
const mockUsePenguinData = vi.mocked(usePenguinData);

// Test wrapper with providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
};

const mockPenguinData = [
  {
    species: 'Adelie',
    island: 'Biscoe',
    bill_length_mm: 53.4,
    bill_depth_mm: 17.8,
    flipper_length_mm: 219.0,
    body_mass_g: 5687.0,
    sex: 'female',
    year: 2021,
  },
  {
    species: 'Chinstrap',
    island: 'Dream',
    bill_length_mm: null,
    bill_depth_mm: 18.1,
    flipper_length_mm: 245.0,
    body_mass_g: null,
    sex: null,
    year: 2021,
  },
];

describe('DataTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    mockUsePenguinData.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      isError: false,
    });

    render(
      <TestWrapper>
        <DataTable />
      </TestWrapper>
    );

    expect(screen.getByText('Loading penguin data...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    const errorMessage = 'Failed to fetch data';
    mockUsePenguinData.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error(errorMessage),
      isError: true,
    });

    render(
      <TestWrapper>
        <DataTable />
      </TestWrapper>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Failed to load penguin data/)).toBeInTheDocument();
  });

  it('renders penguin data correctly', async () => {
    mockUsePenguinData.mockReturnValue({
      data: mockPenguinData,
      isLoading: false,
      error: null,
      isError: false,
    });

    render(
      <TestWrapper>
        <DataTable />
      </TestWrapper>
    );

    // Wait for the data grid to render
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    // Check for column headers
    expect(screen.getByText('Species')).toBeInTheDocument();
    expect(screen.getByText('Island')).toBeInTheDocument();
    expect(screen.getByText('Bill Length (mm)')).toBeInTheDocument();

    // Check for data values
    expect(screen.getByText('Adelie')).toBeInTheDocument();
    expect(screen.getByText('Chinstrap')).toBeInTheDocument();
    expect(screen.getByText('Biscoe')).toBeInTheDocument();

    // Check record count
    expect(screen.getByText('Showing 2 penguins')).toBeInTheDocument();
  });

  it('displays missing values as em dash', async () => {
    mockUsePenguinData.mockReturnValue({
      data: mockPenguinData,
      isLoading: false,
      error: null,
      isError: false,
    });

    render(
      <TestWrapper>
        <DataTable />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    // Check that null values are displayed as em dash
    const emDashes = screen.getAllByText('—');
    expect(emDashes.length).toBeGreaterThan(0);
  });

  it('renders as data table on mobile viewports', () => {
    mockUsePenguinData.mockReturnValue({
      data: mockPenguinData,
      isLoading: false,
      error: null,
      isError: false,
    });

    render(
      <TestWrapper>
        <DataTable />
      </TestWrapper>
    );

    // DataTable should render grid regardless of viewport
    expect(screen.getByRole('grid')).toBeInTheDocument();
    // Check that headers are present
    expect(screen.getByText('Bill Length (mm)')).toBeInTheDocument();
    expect(screen.getByText('Body Mass (g)')).toBeInTheDocument();
    // Check that data is present
    expect(screen.getByText('Adelie')).toBeInTheDocument();
  });
});
