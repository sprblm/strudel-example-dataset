import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VisualizationPanel } from './VisualizationPanel';
import { AppProvider } from '@/context/ContextProvider';

vi.mock('@tanstack/react-router', () => ({
  useSearch: () => ({}),
  useNavigate: () => () => {},
}));

vi.mock(
  '@tanstack/router',
  () => ({
    useSearch: () => ({}),
    useNavigate: () => () => {},
  }),
  { virtual: true }
);

const penguinFixture = [
  {
    species: 'Adelie',
    island: 'Biscoe',
    bill_length_mm: 40,
    bill_depth_mm: 18,
    flipper_length_mm: 190,
    body_mass_g: 3600,
    sex: 'male',
    year: 2007,
  },
];

vi.mock('@/hooks/usePenguinData', () => ({
  usePenguinData: () => ({
    data: penguinFixture,
    isLoading: false,
    error: undefined,
    isError: false,
  }),
}));

const mockQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>
    <QueryClientProvider client={mockQueryClient}>
      {children}
    </QueryClientProvider>
  </AppProvider>
);

describe('VisualizationPanel', () => {
  it('renders scatter plot components', () => {
    render(<VisualizationPanel />, { wrapper });

    expect(
      screen.getByRole('combobox', { name: /x-axis/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /y-axis/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Adelie')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /scatter plot/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /download scatter chart as png/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByTestId('export-visualization-button')).toBeEnabled();
  });
});
