import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AppProvider } from '@/context/ContextProvider';
import { VisualizationPanel } from './VisualizationPanel';

vi.mock('@/hooks/usePenguinData', () => ({
  usePenguinData: () => ({
    data: [
      {
        species: 'Adelie',
        island: 'Torgersen',
        bill_length_mm: 41.1,
        bill_depth_mm: 18.2,
        flipper_length_mm: 195,
        body_mass_g: 3600,
        sex: 'female',
        year: 2008,
      },
    ],
    isLoading: false,
    error: null,
    isError: false,
  }),
}));

vi.mock('@/hooks/useChartConfig', () => ({
  useChartConfig: () => ({
    config: {
      type: 'scatter',
      x: 'bill_length_mm',
      y: 'body_mass_g',
      field: 'bill_length_mm',
      bins: 10,
    },
    updateConfig: vi.fn(),
  }),
}));

let queryClient: QueryClient;

beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
});

afterEach(() => {
  queryClient.clear();
});

describe('VisualizationPanel', () => {
  it('renders scatter plot components', () => {
    render(
      <AppProvider>
        <QueryClientProvider client={queryClient}>
          <VisualizationPanel />
        </QueryClientProvider>
      </AppProvider>
    );

    expect(
      screen.getByRole('combobox', { name: /x-axis variable/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /y-axis variable/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Adelie')).toBeInTheDocument();
    expect(
      screen.getAllByRole('img', { name: /scatter plot/i })[0]
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /download png/i })
    ).toBeInTheDocument();
  });
});
