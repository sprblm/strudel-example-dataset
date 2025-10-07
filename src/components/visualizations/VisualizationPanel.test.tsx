import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VisualizationPanel } from './VisualizationPanel';
import { AppProvider } from '@/context/ContextProvider';
import * as useExportModule from '@/hooks/useExport';

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
  const exportToPNG = vi.fn().mockResolvedValue(undefined);
  const buildFilename = vi.fn().mockReturnValue('scatter-2025-10-07.png');

  beforeEach(() => {
    exportToPNG.mockClear();
    buildFilename.mockClear();
    vi.spyOn(useExportModule, 'useExport').mockReturnValue({
      exporting: false,
      exportToPNG,
      buildFilename,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

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
      screen.getByRole('img', {
        name: /scatter plot of bill length mm vs body mass g/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /download scatter chart as png/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByTestId('export-visualization-button')).toBeEnabled();
  });

  it('invokes export workflow when the download button is clicked', async () => {
    const user = userEvent.setup();
    render(<VisualizationPanel />, { wrapper });

    const button = await screen.findByRole('button', {
      name: /download scatter chart as png/i,
    });

    await user.click(button);

    await waitFor(() => {
      expect(buildFilename).toHaveBeenCalledWith({ chartType: 'scatter' });
      expect(exportToPNG).toHaveBeenCalledTimes(1);
    });

    const [containerArg, optionsArg] = exportToPNG.mock.calls[0] ?? [];
    expect(containerArg).toBeInstanceOf(HTMLElement);
    expect(optionsArg).toMatchObject({
      chartType: 'scatter',
      title: 'Scatter Plot: Bill Length Mm vs Body Mass G',
    });
    expect(optionsArg.filename).toBe(buildFilename.mock.results[0]?.value);
  });
});
