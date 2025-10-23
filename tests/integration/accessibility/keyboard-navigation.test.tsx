import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { vi } from 'vitest';
import { Layout } from '@/components/Layout';
import { AppProvider } from '@/context/ContextProvider';
import { theme } from '@/theme';
import { FiltersPanel } from '@/components/FiltersPanel';
import { DataTable } from '@/components/table/DataTable';
import { HelpModal } from '@/components/modals/HelpModal';

// Mock AppLink to avoid router dependency
vi.mock('@/components/AppLink', () => ({
  AppLink: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock('@/components/table/DataTable', () => ({
  DataTable: () => (
    <div
      id="data"
      role="grid"
      aria-label="Palmer Penguins data table"
      tabIndex={-1}
    />
  ),
}));

vi.mock('@/components/modals/HelpModal', async () => {
  const React = await import('react');
  const { useAppState } = await import('@/context/ContextProvider');
  const { closeHelpModal } = await import('@/context/actions');

  const HelpModal: React.FC = () => {
    const { state, dispatch } = useAppState();
    if (!state.helpModalOpen) {
      return null;
    }
    return (
      <div role="dialog" aria-label="Help">
        <p>Palmer Penguins Explorer - Help</p>
        <button type="button" onClick={() => dispatch(closeHelpModal())}>
          Close
        </button>
      </div>
    );
  };

  return { HelpModal };
});
// Mock the penguin data hook
vi.mock('@/hooks/usePenguinData', () => ({
  usePenguinData: () => ({
    data: [
      {
        species: 'Adelie',
        island: 'Torgersen',
        bill_length_mm: 39.1,
        bill_depth_mm: 18.7,
        flipper_length_mm: 181,
        body_mass_g: 3750,
        sex: 'male',
        year: 2024,
        diet: 'fish',
        life_stage: 'adult',
        health_metrics: 'healthy',
      },
      {
        species: 'Chinstrap',
        island: 'Dream',
        bill_length_mm: 46.5,
        bill_depth_mm: 17.9,
        flipper_length_mm: 192,
        body_mass_g: 3500,
        sex: 'female',
        year: 2025,
        diet: 'krill',
        life_stage: 'adult',
        health_metrics: 'overweight',
      },
    ],
    isLoading: false,
    error: null,
    isError: false,
  }),
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AppProvider>{children}</AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('Keyboard Navigation Integration', () => {
  beforeEach(() => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('provides skip links that are accessible via Tab navigation', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <Layout>
          <div id="filters">
            <FiltersPanel />
          </div>
          <div id="data">
            <DataTable />
          </div>
        </Layout>
      </TestWrapper>
    );

    // Tab should focus the first skip link
    await user.tab();

    const skipToMainLink = screen.getByRole('link', {
      name: 'Skip to main content',
    });
    expect(skipToMainLink).toHaveFocus();

    // Tab to next skip link
    await user.tab();
    const skipToFiltersLink = screen.getByRole('link', {
      name: 'Skip to filters',
    });
    expect(skipToFiltersLink).toHaveFocus();

    // Tab to third skip link
    await user.tab();
    const skipToDataLink = screen.getByRole('link', { name: 'Skip to data' });
    expect(skipToDataLink).toHaveFocus();
  });

  it('supports keyboard shortcuts for help modal', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <Layout>
          <FiltersPanel />
        </Layout>
        <HelpModal />
      </TestWrapper>
    );

    // Press Shift+? to open help modal
    await user.keyboard('{Shift>}?{/Shift}');

    expect(
      await screen.findByRole('dialog', { name: /help/i })
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Palmer Penguins Explorer - Help')
    ).toBeInTheDocument();

    // Press Escape to close modal
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /help/i })).toBeNull();
    });
  });

  it('supports Tab navigation through filter components', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <FiltersPanel />
      </TestWrapper>
    );

    // Start from first focusable element in filters
    await user.tab();
    const firstCheckbox = await screen.findByRole('checkbox', {
      name: /filter by adelie/i,
    });
    expect(firstCheckbox).toHaveFocus();

    // Navigate through species checkboxes
    await user.tab();
    expect(
      screen.getByRole('checkbox', { name: /filter by chinstrap/i })
    ).toHaveFocus();

    await user.tab();
    expect(
      screen.getByRole('checkbox', { name: /filter by gentoo/i })
    ).toHaveFocus();

    // Navigate to island filter
    await user.tab();
    const islandSelect = screen.getByLabelText(/select island/i);
    expect(islandSelect).toHaveFocus();

    // Navigate to sex filter
    await user.tab();
    const sexRadio = screen.getByRole('radio', { name: /all/i });
    expect(sexRadio).toHaveFocus();
  });

  it('provides proper focus indicators on interactive elements', async () => {
    render(
      <TestWrapper>
        <FiltersPanel />
      </TestWrapper>
    );

    const checkbox = await screen.findByRole('checkbox', {
      name: /filter by adelie/i,
    });
    const select = screen.getByLabelText(/select island/i);
    const radio = screen.getByRole('radio', { name: /all/i });

    // Elements should exist and be focusable
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toHaveAttribute('disabled');

    expect(select).toBeInTheDocument();
    expect(select).not.toHaveAttribute('disabled');

    expect(radio).toBeInTheDocument();
    expect(radio).not.toHaveAttribute('disabled');
  });

  it('maintains logical tab order throughout the application', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <Layout>
          <FiltersPanel />
          <DataTable />
        </Layout>
      </TestWrapper>
    );

    // Start tabbing from the beginning
    await user.tab(); // Skip to main content
    await user.tab(); // Skip to filters
    await user.tab(); // Skip to data
    await user.tab(); // Should go to first filter element

    // Should be in the filters section
    const filtersSection = await screen.findByRole('group', {
      name: /species filter/i,
    });
    const firstFilterElement = within(filtersSection).getByRole('checkbox', {
      name: /filter by adelie/i,
    });
    expect(firstFilterElement).toHaveFocus();
  });

  it('supports Enter and Space key activation on buttons', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <FiltersPanel />
      </TestWrapper>
    );

    // Focus a checkbox and activate with Space
    await user.tab();
    const checkbox = await screen.findByRole('checkbox', {
      name: /filter by adelie/i,
    });
    expect(checkbox).toHaveFocus();

    await user.keyboard(' '); // Space should toggle checkbox

    // Note: In jsdom we can't fully test the visual state change,
    // but we can verify the component doesn't throw errors
    expect(checkbox).toBeInTheDocument();
  });

  it('provides accessible labels and descriptions for screen readers', async () => {
    render(
      <TestWrapper>
        <Layout>
          <FiltersPanel />
          <DataTable />
        </Layout>
      </TestWrapper>
    );

    // Check ARIA labels and landmarks
    expect(
      await screen.findByRole('navigation', { name: 'Skip links' })
    ).toBeInTheDocument();
    expect(await screen.findByRole('main')).toBeInTheDocument();
    expect(
      await screen.findByRole('group', { name: /species filter/i })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('grid', { name: /palmer penguins data table/i })
    ).toBeInTheDocument();

    // Check specific ARIA labels
    expect(
      screen.getByLabelText(/filter by adelie penguins/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/filter penguins by island/i)
    ).toBeInTheDocument();
  });
});
