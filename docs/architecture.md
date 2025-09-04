## Technical Architecture: Palmer Penguins Explorer (Revised)

### Core Architecture Decisions

**State Management**: Zustand for filters/data, React state for UI (simpler than Context)
**Routing**: React Router v6 with tabs as routes (/table, /visualize/[chartType])
**Data Pipeline**: Static JSON → Zustand → Memoized selectors → Components
**Component Library**: Strudel Kit components with custom chart wrappers
**Accessibility**: React Aria Live for announcements, focus trap for modals
**Testing**: Vitest + React Testing Library for unit tests, Cypress for E2E
**CI/CD**: GitHub Actions for automated testing, building, and deployment
**Error Handling**: Layered error boundaries with graceful degradation and recovery

### File Structure (Revised)

```
palmer-penguins-explorer/
├── public/
│   ├── penguins.json              # Static dataset (344 records)
│   └── social-preview.png         # OG image for sharing
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.tsx      # Strudel AppBar with Help/Export/Settings
│   │   │   ├── MainLayout.tsx     # Responsive container with skip links
│   │   │   ├── TabNavigation.tsx  # Table/Visualizations toggle
│   │   │   └── MobileMenu.tsx     # Hamburger menu for mobile
│   │   ├── filters/
│   │   │   ├── FilterPanel.tsx    # Collapsible container
│   │   │   ├── SpeciesFilter.tsx  # Checkboxes with counts
│   │   │   ├── IslandFilter.tsx   # Dropdown/select
│   │   │   ├── SexFilter.tsx      # Radio group
│   │   │   ├── ClearFiltersButton.tsx
│   │   │   └── FilterSummary.tsx  # "Showing X penguins" text
│   │   ├── table/
│   │   │   ├── DataTable.tsx      # Strudel Table wrapper
│   │   │   ├── TablePagination.tsx
│   │   │   ├── ColumnSort.tsx     # Sort indicators
│   │   │   ├── EmptyState.tsx     # "No penguins match" message
│   │   │   └── CardView.tsx    # Card-based responsive layout
│   │   ├── visualizations/
│   │   │   ├── VisualizationPanel.tsx
│   │   │   ├── ChartTypeSelector.tsx  # Icon-based selection
│   │   │   ├── AxisControls.tsx      # X/Y dropdowns
│   │   │   ├── charts/
│   │   │   │   ├── ScatterPlot.tsx
│   │   │   │   ├── Histogram.tsx
│   │   │   │   ├── BoxPlot.tsx
│   │   │   │   └── ChartContainer.tsx  # Responsive wrapper
│   │   │   └── ChartLegend.tsx
│   │   ├── modals/
│   │   │   ├── WelcomeModal.tsx   # First visit guide
│   │   │   └── HelpModal.tsx      # Dataset info
│   │   ├── export/
│   │   │   ├── ExportButton.tsx   # PNG/CSV download
│   │   │   └── ShareButton.tsx    # Copy URL
│   │   └── a11y/
│   │       ├── SkipLinks.tsx
│   │       ├── LiveRegion.tsx     # Filter announcements
│   │       └── FocusTrap.tsx      # Modal focus management
│   ├── hooks/
│   │   ├── useFilteredData.ts     # Memoized filter logic
│   │   ├── useURLSync.ts          # Bidirectional URL state
│   │   ├── useChartConfig.ts      # Chart type specific settings
│   │   ├── useExport.ts           # PNG/CSV generation
│   │   ├── useFirstVisit.ts       # localStorage check
│   │   ├── useResponsive.ts       # Breakpoint detection
│   │   └── useKeyboardShortcuts.ts
│   ├── stores/
│   │   ├── dataStore.ts           # Raw data & loading state
│   │   ├── filterStore.ts         # Filter selections & counts
│   │   └── selectors.ts           # Memoized data transformations
│   ├── utils/
│   │   ├── constants.ts           # SPECIES, ISLANDS, NUMERIC_FIELDS
│   │   ├── dataHelpers.ts         # Missing value handling
│   │   ├── chartHelpers.ts        # D3 scale/axis utilities
│   │   ├── exportHelpers.ts       # Canvas/CSV generation
│   │   ├── urlHelpers.ts          # URL param serialization
│   │   └── a11yHelpers.ts         # ARIA labels, descriptions
│   ├── types/
│   │   ├── penguin.ts
│   │   ├── filters.ts
│   │   ├── charts.ts
│   │   └── strudel.d.ts           # Strudel Kit type extensions
│   ├── styles/
│   │   ├── globals.css            # CSS reset, Strudel imports
│   │   ├── breakpoints.css        # Responsive utilities
│   │   └── components/            # Component-specific styles
│   ├── routes/
│   │   ├── TableRoute.tsx
│   │   └── VisualizationRoute.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── tests/
│   ├── __fixtures__/               # Test data and mocks
│   ├── unit/                      # Component and hook unit tests
│   │   ├── components/            # Component-specific tests
│   │   ├── hooks/                 # Hook-specific tests
│   │   └── utils/                 # Utility function tests
│   ├── integration/               # Integration tests
│   │   ├── filters/               # Filter interaction tests
│   │   └── visualizations/        # Chart rendering tests
│   ├── e2e/                       # End-to-end user journey tests
│   │   ├── user-flows/            # Complete user workflows
│   │   └── accessibility/         # A11y compliance tests
│   ├── performance/               # Performance benchmark tests
│   └── setup/                     # Test configuration and utilities
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Continuous integration pipeline
│       ├── deploy.yml             # Deployment automation
│       ├── lighthouse.yml         # Performance monitoring
│       └── accessibility.yml      # Automated a11y testing
└── [config files]
```

### Component Architecture (Revised)

```typescript
// Hierarchical component structure aligned with wireframes
interface AppStructure {
  App: {
    router: {
      '/': MainLayout;
      children: {
        table: TableRoute;
        'visualize/:chartType?': VisualizationRoute;
      };
    };
    providers: ['QueryClient', 'RouterProvider'];
    modals: ['WelcomeModal', 'HelpModal'];
  };

  MainLayout: {
    header: 'AppHeader';
    body: {
      left: 'FilterPanel'; // Fixed on desktop, overlay on mobile
      main: 'TabNavigation + Outlet';
    };
    a11y: ['SkipLinks', 'LiveRegion'];
  };
}
```

### Data Flow Architecture (Revised)

```typescript
// 1. Initial Load Sequence
App Mount → Check localStorage → Show/Skip Welcome → Load JSON → Initialize Filters from URL

// 2. Filter State Synchronization
User Input → Update Store → Debounced URL Update → Memoized Recompute → Re-render
              ↓
         Live Region Announcement

// 3. View State Management
Tab Click → Route Change → Component Mount → Use Filtered Data → Render

// 4. Export Pipeline
Current View → Canvas/CSV Generator → Blob Creation → Download Trigger
                                         ↓
                                    URL Shortener API (for sharing)
```

### Store Architecture (Revised)

```typescript
// dataStore.ts
interface DataStore {
  // State
  penguins: Penguin[];
  loadingState: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;

  // Actions
  loadData: () => Promise<void>;

  // Computed
  get speciesMap(): Map<Species, Penguin[]>;
  get islandMap(): Map<Island, Penguin[]>;
  get numericRanges(): Record<NumericField, [min: number, max: number]>;
}

// filterStore.ts
interface FilterStore {
  // State - matching wireframe exactly
  selectedSpecies: Set<Species>; // Checkboxes
  selectedIsland: Island | 'all'; // Dropdown
  selectedSex: Sex | 'all'; // Radio

  // Derived counts for UI
  speciesCounts: Record<Species, number>;
  activeFilerCount: number;

  // Actions
  toggleSpecies: (species: Species) => void;
  setIsland: (island: Island | 'all') => void;
  setSex: (sex: Sex | 'all') => void;
  clearAll: () => void;

  // URL persistence
  serializeToURL: () => URLSearchParams;
  hydrateFromURL: (params: URLSearchParams) => void;
}

// selectors.ts - Memoized computations
export const getFilteredPenguins = createSelector(
  [(state) => state.penguins, (state) => state.filters],
  (penguins, filters) => {
    return penguins.filter((p) => {
      const speciesMatch = filters.selectedSpecies.has(p.species);
      const islandMatch =
        filters.selectedIsland === 'all' || p.island === filters.selectedIsland;
      const sexMatch =
        filters.selectedSex === 'all' || p.sex === filters.selectedSex;

      return speciesMatch && islandMatch && sexMatch;
    });
  }
);
```

### Key Component Implementations (Revised)

```typescript
// FilterPanel.tsx - Responsive collapsible panel
export const FilterPanel: FC = () => {
  const { isTablet, isMobile } = useResponsive()
  const [isCollapsed, setCollapsed] = useState(isMobile)
  const filterCount = useFilterStore(state => state.activeFilterCount)

  if (isMobile) {
    return (
      <>
        <MobileFilterTrigger
          onClick={() => setCollapsed(false)}
          filterCount={filterCount}
        />
        <MobileFilterOverlay
          isOpen={!isCollapsed}
          onClose={() => setCollapsed(true)}
        >
          <FilterContent />
        </MobileFilterOverlay>
      </>
    )
  }

  return (
    <aside
      className={styles.panel}
      data-collapsed={isTablet ? isCollapsed : false}
      aria-label="Data filters"
    >
      {isTablet && (
        <button onClick={() => setCollapsed(!isCollapsed)}>
          {isCollapsed ? '▶' : '▼'} Filters
        </button>
      )}
      <FilterContent />
    </aside>
  )
}

// SpeciesFilter.tsx - Checkboxes with live counts
export const SpeciesFilter: FC = () => {
  const { selectedSpecies, speciesCounts, toggleSpecies } = useFilterStore()

  return (
    <fieldset>
      <legend>Species</legend>
      {SPECIES.map(species => (
        <label key={species} className={styles.checkbox}>
          <input
            type="checkbox"
            checked={selectedSpecies.has(species)}
            onChange={() => toggleSpecies(species)}
            aria-describedby={`${species}-count`}
          />
          <span>{species}</span>
          <span
            id={`${species}-count`}
            className={speciesCounts[species] === 0 ? styles.zero : ''}
          >
            ({speciesCounts[species]})
          </span>
        </label>
      ))}
    </fieldset>
  )
}

// ChartTypeSelector.tsx - Icon-based selection matching wireframe
export const ChartTypeSelector: FC = () => {
  const navigate = useNavigate()
  const { chartType } = useParams<{ chartType: ChartType }>()

  return (
    <div className={styles.chartSelector} role="tablist">
      <button
        role="tab"
        aria-selected={chartType === 'scatter'}
        onClick={() => navigate('/visualize/scatter')}
        aria-label="Scatter plot"
      >
        📊
      </button>
      <button
        role="tab"
        aria-selected={chartType === 'histogram'}
        onClick={() => navigate('/visualize/histogram')}
        aria-label="Histogram"
      >
        📈
      </button>
      <button
        role="tab"
        aria-selected={chartType === 'boxplot'}
        onClick={() => navigate('/visualize/boxplot')}
        aria-label="Box plot"
      >
        📉
      </button>
    </div>
  )
}

// WelcomeModal.tsx - First visit experience
export const WelcomeModal: FC = () => {
  const [isOpen, setOpen] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  useEffect(() => {
    const hasVisited = localStorage.getItem('palmer-penguins-visited')
    if (!hasVisited) {
      setOpen(true)
    }
  }, [])

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('palmer-penguins-visited', 'true')
    }
    setOpen(false)
  }

  return (
    <StrudelModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Welcome to Palmer Penguins Explorer"
      size="medium"
    >
      <div className={styles.welcome}>
        <p>Explore data from 344 penguins collected at Palmer Station, Antarctica</p>

        <section>
          <h3>Dataset Variables</h3>
          <dl>
            <dt>Species</dt>
            <dd>Adelie, Chinstrap, or Gentoo</dd>
            <dt>Bill measurements</dt>
            <dd>Length and depth in millimeters</dd>
            {/* ... other variables ... */}
          </dl>
        </section>

        <label className={styles.dontShow}>
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
          />
          Don't show this again
        </label>
      </div>
    </StrudelModal>
  )
}
```

### Routing Structure (Revised)

```typescript
// Route configuration matching wireframe tabs
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/table" replace />
      },
      {
        path: 'table',
        element: <TableRoute />
      },
      {
        path: 'visualize/:chartType?',
        element: <VisualizationRoute />
      }
    ]
  }
])

// URL structure examples:
// /table?species=adelie,gentoo&island=biscoe
// /visualize/scatter?x=bill_length&y=body_mass&species=all
// /visualize/histogram?field=flipper_length&bins=10
```

### Performance Optimizations (Revised)

```typescript
// Meet PRD performance requirements
// < 2s initial load
const lazyLoadCharts = {
  ScatterPlot: lazy(() => import('./charts/ScatterPlot')),
  Histogram: lazy(() => import('./charts/Histogram')),
  BoxPlot: lazy(() => import('./charts/BoxPlot'))
}

// < 100ms filter updates
const debouncedURLUpdate = useMemo(
  () => debounce(updateURLParams, 100),
  []
)

// < 300ms chart renders
const ChartMemo = memo(({ data, config }) => {
  const optimizedData = useMemo(
    () => preprocessForD3(data),
    [data]
  )

  return <ChartComponent data={optimizedData} {...config} />
}, (prev, next) => {
  return shallowEqual(prev.data, next.data) &&
         shallowEqual(prev.config, next.config)
})

// Bundle splitting strategy
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom', 'zustand'],
          'strudel': ['@strudel-ui/react'],
          'export': ['html2canvas', 'file-saver']
        }
      }
    }
  }
})
```

### Accessibility Implementation (Revised)

```typescript
// LiveRegion.tsx - Announce filter changes
export const LiveRegion: FC = () => {
  const filteredCount = useFilteredData().length
  const totalCount = useDataStore(state => state.penguins.length)

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      Showing {filteredCount} of {totalCount} penguins
    </div>
  )
}

// Keyboard navigation for charts
export const useChartKeyboard = (
  chartRef: RefObject<SVGElement>,
  dataPoints: DataPoint[]
) => {
  const [focusedIndex, setFocusedIndex] = useState(-1)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowRight':
          setFocusedIndex(i => Math.min(i + 1, dataPoints.length - 1))
          break
        case 'ArrowLeft':
          setFocusedIndex(i => Math.max(i - 1, 0))
          break
        case 'Enter':
        case ' ':
          if (focusedIndex >= 0) {
            showTooltip(dataPoints[focusedIndex])
          }
          break
        case 'Escape':
          hideTooltip()
          setFocusedIndex(-1)
          break
      }
    }

    chartRef.current?.addEventListener('keydown', handleKeyDown)
    return () => chartRef.current?.removeEventListener('keydown', handleKeyDown)
  }, [dataPoints, focusedIndex])

  return { focusedIndex }
}

// Skip links implementation
export const SkipLinks: FC = () => (
  <div className={styles.skipLinks}>
    <a href="#main-content">Skip to main content</a>
    <a href="#filters">Skip to filters</a>
    <a href="#data-table">Skip to data</a>
  </div>
)
```

### Mobile-First Responsive Strategy

```typescript
// Breakpoint system matching wireframes
export const breakpoints = {
  mobile: 0, // < 768px - Overlay filters, stacked layout
  tablet: 768, // 768-1024px - Collapsible sidebar
  desktop: 1024, // > 1024px - Fixed sidebar, full layout
} as const;

// Responsive hook
export const useResponsive = () => {
  const [viewport, setViewport] = useState(getViewport());

  useEffect(() => {
    const mql = {
      tablet: window.matchMedia(`(min-width: ${breakpoints.tablet}px)`),
      desktop: window.matchMedia(`(min-width: ${breakpoints.desktop}px)`),
    };

    const handler = () => setViewport(getViewport());
    Object.values(mql).forEach((m) => m.addListener(handler));

    return () => {
      Object.values(mql).forEach((m) => m.removeListener(handler));
    };
  }, []);

  return {
    isMobile: viewport === 'mobile',
    isTablet: viewport === 'tablet',
    isDesktop: viewport === 'desktop',
    viewport,
  };
};
```

### Testing Architecture & Strategy

#### Testing Framework Stack

```typescript
// vitest.config.ts - Modern, fast testing framework
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup/vitest-setup.ts'],
    coverage: {
      reporter: ['text', 'json-summary', 'html'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});

// cypress.config.ts - E2E and integration testing
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'tests/e2e/support/e2e.ts',
    specPattern: 'tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshotOnRunFailure: false,
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    supportFile: 'tests/e2e/support/component.ts',
    specPattern: 'tests/integration/**/*.cy.{js,jsx,ts,tsx}',
  },
});
```

#### Testing Strategy by Layer

```typescript
// 1. Unit Tests - Components, Hooks, Utilities
// tests/unit/components/FilterPanel.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { TestProviders } from '../../setup/test-providers';

describe('FilterPanel', () => {
  it('renders species filters with correct counts', async () => {
    render(<FilterPanel />, { wrapper: TestProviders });

    expect(screen.getByText('Adelie (152)')).toBeInTheDocument();
    expect(screen.getByText('Chinstrap (68)')).toBeInTheDocument();
    expect(screen.getByText('Gentoo (124)')).toBeInTheDocument();
  });

  it('announces filter changes to screen readers', async () => {
    const { user } = render(<FilterPanel />, { wrapper: TestProviders });

    await user.click(screen.getByLabelText('Adelie'));

    expect(screen.getByRole('status')).toHaveTextContent(
      'Showing 192 of 344 penguins'
    );
  });
});

// 2. Integration Tests - Component Interactions
// tests/integration/filters/filter-synchronization.cy.tsx
describe('Filter Synchronization', () => {
  it('updates URL and data when filters change', () => {
    cy.visit('/table');

    // Change filters
    cy.findByLabelText('Adelie').uncheck();
    cy.findByLabelText('Island').select('Biscoe');

    // Check URL updates
    cy.url().should('include', 'species=chinstrap,gentoo');
    cy.url().should('include', 'island=biscoe');

    // Check data updates
    cy.findByText('Showing 124 of 344 penguins').should('be.visible');

    // Check chart updates
    cy.visit('/visualize/scatter');
    cy.findByRole('img', { name: /scatter plot/i })
      .should('have.attr', 'aria-describedby');
  });
});

// 3. E2E Tests - Complete User Journeys
// tests/e2e/user-flows/data-exploration.cy.ts
describe('Data Exploration Flow', () => {
  it('supports complete data exploration workflow', () => {
    // Start with welcome modal
    cy.visit('/');
    cy.findByRole('dialog', { name: /welcome/i }).should('be.visible');
    cy.findByRole('button', { name: /close/i }).click();

    // Explore table data
    cy.findByRole('columnheader', { name: /species/i }).click();
    cy.findByText('Adelie').should('be.visible');

    // Apply filters
    cy.findByLabelText('Chinstrap').uncheck();
    cy.findByLabelText('Gentoo').uncheck();

    // Switch to visualizations
    cy.findByRole('tab', { name: /visualizations/i }).click();
    cy.findByRole('tab', { name: /scatter plot/i }).click();

    // Configure chart
    cy.findByLabelText('X-Axis').select('Bill Length (mm)');
    cy.findByLabelText('Y-Axis').select('Body Mass (g)');

    // Export visualization
    cy.findByRole('button', { name: /download png/i }).click();
    cy.readFile('cypress/downloads/scatter-plot-*.png').should('exist');
  });
});
```

#### Accessibility Testing Integration

```typescript
// tests/setup/a11y-setup.ts
import { configureAxe } from 'jest-axe';

const axe = configureAxe({
  rules: {
    // Configure WCAG 2.1 AA compliance
    'color-contrast': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'focus-management': { enabled: true },
    'aria-labels': { enabled: true }
  }
});

// Automated accessibility testing for every component
export const testAccessibility = async (component: RenderResult) => {
  const results = await axe(component.container);
  expect(results).toHaveNoViolations();
};

// tests/unit/components/ScatterPlot.test.tsx
import { testAccessibility } from '../../setup/a11y-setup';

describe('ScatterPlot Accessibility', () => {
  it('meets WCAG 2.1 AA standards', async () => {
    const component = render(<ScatterPlot data={mockData} />);
    await testAccessibility(component);
  });

  it('provides keyboard navigation for data points', () => {
    render(<ScatterPlot data={mockData} />);
    const chart = screen.getByRole('img', { name: /scatter plot/i });

    // Test keyboard navigation
    fireEvent.keyDown(chart, { key: 'ArrowRight' });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    fireEvent.keyDown(chart, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
```

### CI/CD Pipeline & Deployment Architecture

#### GitHub Actions Workflow Strategy

```yaml
# .github/workflows/ci.yml - Continuous Integration
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint code
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Run integration tests
        run: npm run test:integration

      - name: Build application
        run: npm run build

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json

  e2e:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Start application
        run: npm run preview &

      - name: Wait for server
        run: npx wait-on http://localhost:4173

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload E2E artifacts
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots

  accessibility:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Start application
        run: npm run preview &

      - name: Wait for server
        run: npx wait-on http://localhost:4173

      - name: Run accessibility audit
        run: npm run test:a11y

      - name: Upload accessibility report
        uses: actions/upload-artifact@v3
        with:
          name: accessibility-report
          path: accessibility-report.html

# .github/workflows/deploy.yml - Deployment Pipeline
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_run:
    workflows: ["CI Pipeline"]
    types:
      - completed
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build for production
        run: npm run build
        env:
          NODE_ENV: production

      - name: Run pre-deployment tests
        run: npm run test:build

      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: './dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: 'Deploy from GitHub Actions'
          enable-commit-comment: false
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

      - name: Run post-deployment smoke tests
        run: npm run test:smoke -- --baseUrl=${{ steps.netlify.outputs.deploy-url }}

# .github/workflows/lighthouse.yml - Performance Monitoring
name: Lighthouse Performance Audit

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 6 * * 1' # Weekly on Mondays

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Start application
        run: npm run preview &

      - name: Wait for server
        run: npx wait-on http://localhost:4173

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

      - name: Upload Lighthouse report
        uses: actions/upload-artifact@v3
        with:
          name: lighthouse-report
          path: '.lighthouseci'
```

#### Performance Budget & Monitoring

```typescript
// lighthouse.config.js - Performance budgets
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/visualize/scatter',
      ],
      startServerCommand: 'npm run preview',
      numberOfRuns: 3,
    },
    assert: {
      // Performance budgets based on PRD requirements
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1.0 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        // Specific metrics
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }], // < 2s
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }], // < 300ms

        // Bundle size constraints
        'resource-summary:document:size': ['error', { maxNumericValue: 50000 }],
        'resource-summary:script:size': ['error', { maxNumericValue: 512000 }], // < 500KB
        'resource-summary:stylesheet:size': [
          'error',
          { maxNumericValue: 25000 },
        ],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

// vite.config.ts - Bundle analysis integration
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer for monitoring bundle size
    process.env.ANALYZE && bundleAnalyzer(),
  ],
  build: {
    // Enable source maps for production debugging
    sourcemap: true,
    // Rollup options for optimal bundling
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          state: ['zustand'],
          ui: ['@strudel-ui/react'],
          charts: ['d3-scale', 'd3-selection', 'd3-axis'],
          export: ['html2canvas', 'file-saver'],
        },
      },
    },
  },
});
```

### Error Handling & Recovery Architecture

#### Layered Error Boundary Strategy

```typescript
// src/components/error/ErrorBoundary.tsx - Root error boundary
export class RootErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    console.error('Application Error:', error, errorInfo);

    // Report to error tracking (Sentry, LogRocket, etc.)
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }

    this.setState({ error, errorInfo });
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Error reporting implementation
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      })
    }).catch(() => {
      // Silently fail if error reporting fails
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <h1>Something went wrong</h1>
          <p>We're sorry, but something unexpected happened.</p>

          <details className="error-details">
            <summary>Error Details</summary>
            <pre>{this.state.error?.message}</pre>
          </details>

          <div className="error-actions">
            <button onClick={() => window.location.reload()}>
              Refresh Page
            </button>
            <button onClick={() => this.setState({ hasError: false })}>
              Try Again
            </button>
            <a href="mailto:support@example.com">
              Report Issue
            </a>
          </div>

          {/* Fallback data access */}
          <section className="fallback-content">
            <h2>View Raw Data</h2>
            <a href="/penguins.json" download>
              Download Dataset (JSON)
            </a>
          </section>
        </div>
      );
    }

    return this.props.children;
  }
}

// src/components/error/ChartErrorBoundary.tsx - Chart-specific error handling
export const ChartErrorBoundary: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ChartErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Chart Error:', error, errorInfo);
        // Report chart-specific errors
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

const ChartErrorFallback: FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  const { filteredData } = useFilteredData();

  return (
    <div className="chart-error-fallback" role="alert">
      <h3>Chart could not be displayed</h3>
      <p>There was an error rendering the visualization.</p>

      <div className="fallback-actions">
        <button onClick={resetErrorBoundary}>
          Try Again
        </button>
        <Link to="/table">
          View Data Table Instead
        </Link>
      </div>

      {/* Alternative text representation */}
      <section className="data-summary">
        <h4>Data Summary</h4>
        <p>{filteredData.length} penguins displayed</p>
        <ul>
          {Object.entries(groupBy(filteredData, 'species')).map(([species, penguins]) => (
            <li key={species}>
              {species}: {penguins.length} penguins
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
```

#### Graceful Data Loading & Network Error Handling

```typescript
// src/hooks/useDataWithRetry.ts - Robust data loading
export const useDataWithRetry = () => {
  const [state, setState] = useState<{
    data: Penguin[] | null;
    loading: boolean;
    error: string | null;
    retryCount: number;
  }>({
    data: null,
    loading: false,
    error: null,
    retryCount: 0,
  });

  const loadData = useCallback(async (retryAttempt = 0) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Attempt to load from primary source
      const response = await fetch('/penguins.json');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Validate data structure
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid data format received');
      }

      setState({
        data,
        loading: false,
        error: null,
        retryCount: retryAttempt,
      });
    } catch (error) {
      console.error('Data loading error:', error);

      // Implement exponential backoff for retries
      const maxRetries = 3;
      const backoffDelay = Math.min(1000 * Math.pow(2, retryAttempt), 10000);

      if (retryAttempt < maxRetries) {
        setTimeout(() => {
          loadData(retryAttempt + 1);
        }, backoffDelay);
      } else {
        // Final fallback - try to load from localStorage cache
        const cachedData = getCachedData();
        if (cachedData) {
          setState({
            data: cachedData,
            loading: false,
            error: 'Using cached data - some features may be limited',
            retryCount: retryAttempt,
          });
        } else {
          setState({
            data: null,
            loading: false,
            error:
              error instanceof Error ? error.message : 'Unknown error occurred',
            retryCount: retryAttempt,
          });
        }
      }
    }
  }, []);

  const retry = useCallback(() => {
    loadData(0);
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { ...state, retry };
};

// src/utils/dataCache.ts - Offline data caching
const CACHE_KEY = 'palmer-penguins-data';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

export const cacheData = (data: Penguin[]) => {
  try {
    const cacheObject = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
  } catch (error) {
    console.warn('Failed to cache data:', error);
  }
};

export const getCachedData = (): Penguin[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);

    // Check if cache is expired
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    console.warn('Failed to retrieve cached data:', error);
    return null;
  }
};
```

#### User-Friendly Error States & Recovery

```typescript
// src/components/error/ErrorStates.tsx - User-facing error components
export const NetworkErrorState: FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="error-state network-error" role="alert">
    <div className="error-icon">🌐</div>
    <h2>Connection Problem</h2>
    <p>We couldn't load the penguin data. Please check your internet connection and try again.</p>

    <div className="error-actions">
      <button onClick={onRetry} className="primary">
        Try Again
      </button>
      <button onClick={() => window.location.reload()} className="secondary">
        Refresh Page
      </button>
    </div>

    <details className="troubleshooting">
      <summary>Troubleshooting Tips</summary>
      <ul>
        <li>Check your internet connection</li>
        <li>Disable browser extensions that might block requests</li>
        <li>Try refreshing the page</li>
        <li>If the problem persists, the service may be temporarily unavailable</li>
      </ul>
    </details>
  </div>
);

export const EmptyDataState: FC<{ onReset: () => void }> = ({ onReset }) => (
  <div className="empty-state" role="status">
    <div className="empty-icon">🐧</div>
    <h2>No Penguins Found</h2>
    <p>Your current filters don't match any penguins in the dataset.</p>

    <div className="empty-actions">
      <button onClick={onReset} className="primary">
        Clear All Filters
      </button>
      <Link to="/table" className="secondary">
        View All Data
      </Link>
    </div>

    <div className="filter-suggestions">
      <h3>Try adjusting your filters:</h3>
      <ul>
        <li>Select different species</li>
        <li>Change island selection to "All"</li>
        <li>Select "All" for sex filter</li>
      </ul>
    </div>
  </div>
);

export const ChartRenderErrorState: FC<{ error: Error; onRetry: () => void }> = ({ error, onRetry }) => {
  const { filteredData } = useFilteredData();

  return (
    <div className="chart-error-state" role="alert">
      <div className="error-icon">📊</div>
      <h3>Visualization Error</h3>
      <p>We couldn't display this chart, but your data is still available.</p>

      <div className="error-actions">
        <button onClick={onRetry} className="primary">
          Try Again
        </button>
        <Link to="/table" className="secondary">
          View as Table
        </Link>
      </div>

      {/* Provide data summary as fallback */}
      <section className="data-fallback">
        <h4>Data Summary</h4>
        <DataSummaryTable data={filteredData} />
      </section>

      {/* Developer error details (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="developer-info">
          <summary>Developer Information</summary>
          <pre>{error.stack}</pre>
        </details>
      )}
    </div>
  );
};
```
