import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VisualizationPanel } from './VisualizationPanel';
import { AppProvider } from '@/context/ContextProvider';

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
      screen.getByRole('combobox', { name: /x axis/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /y axis/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Adelie')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /scatter plot/i })
    ).toBeInTheDocument();
  });
});
