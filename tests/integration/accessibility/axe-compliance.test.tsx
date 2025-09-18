import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { axe, toHaveNoViolations } from 'jest-axe';
import { vi } from 'vitest';
import { Layout } from '@/components/Layout';
import { AppProvider } from '@/context/ContextProvider';
import { theme } from '@/theme';
import { FiltersPanel } from '@/components/FiltersPanel';
import { DataTable } from '@/components/table/DataTable';
import { HelpModal } from '@/components/modals/HelpModal';
import { SkipLinks } from '@/components/a11y/SkipLinks';
import {
  createRouter,
  RouterProvider,
  createRootRoute,
  createRoute,
} from '@tanstack/react-router';

// Extend expect with axe matchers
expect.extend(toHaveNoViolations);

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
        year: 2007,
      },
      {
        species: 'Chinstrap',
        island: 'Dream',
        bill_length_mm: 46.5,
        bill_depth_mm: 17.9,
        flipper_length_mm: 192,
        body_mass_g: 3500,
        sex: 'female',
        year: 2007,
      },
    ],
    isLoading: false,
    error: null,
    isError: false,
  }),
}));

// Create minimal router for testing
const rootRoute = createRootRoute({
  component: ({ children }) => <>{children}</>,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <div>Index</div>,
});

const routeTree = rootRoute.addChildren([indexRoute]);

const router = createRouter({ routeTree });

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
        <RouterProvider router={router}>
          <AppProvider>{children}</AppProvider>
        </RouterProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('Accessibility Compliance (axe-core)', () => {
  it('SkipLinks component has no accessibility violations', async () => {
    const { container } = render(
      <TestWrapper>
        <SkipLinks />
      </TestWrapper>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('FiltersPanel component has no accessibility violations', async () => {
    const { container } = render(
      <TestWrapper>
        <FiltersPanel />
      </TestWrapper>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('DataTable component has no accessibility violations', async () => {
    const { container } = render(
      <TestWrapper>
        <DataTable />
      </TestWrapper>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('HelpModal component has no accessibility violations when open', async () => {
    const { container } = render(
      <TestWrapper>
        <AppProvider helpModalOpen={true}>
          <HelpModal />
        </AppProvider>
      </TestWrapper>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Complete Layout has no accessibility violations', async () => {
    const { container } = render(
      <TestWrapper>
        <Layout>
          <FiltersPanel />
          <DataTable />
        </Layout>
      </TestWrapper>
    );

    const results = await axe(container, {
      rules: {
        // Disable color-contrast rule as it requires actual rendering
        'color-contrast': { enabled: false },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it('Keyboard navigation components meet WCAG 2.1 AA standards', async () => {
    const { container } = render(
      <TestWrapper>
        <Layout>
          <FiltersPanel />
          <DataTable />
        </Layout>
      </TestWrapper>
    );

    const results = await axe(container, {
      tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
      rules: {
        'color-contrast': { enabled: false }, // Requires actual rendering
      },
    });
    expect(results).toHaveNoViolations();
  });

  it('Focus management components are accessible', async () => {
    const { container } = render(
      <TestWrapper>
        <Layout>
          <FiltersPanel />
        </Layout>
      </TestWrapper>
    );

    const results = await axe(container, {
      tags: ['wcag2a', 'wcag2aa'],
      rules: {
        'focus-order-semantics': { enabled: true },
        tabindex: { enabled: true },
        'landmark-one-main': { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it('Modal components maintain accessibility when active', async () => {
    const { container } = render(
      <TestWrapper>
        <AppProvider helpModalOpen={true}>
          <Layout>
            <FiltersPanel />
          </Layout>
          <HelpModal />
        </AppProvider>
      </TestWrapper>
    );

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    });
    expect(results).toHaveNoViolations();
  });
});
