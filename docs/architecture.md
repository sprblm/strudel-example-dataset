## Technical Architecture: Palmer Penguins Explorer (Revised)

### Core Architecture Decisions

**State Management**: Zustand for filters/data, React state for UI (simpler than Context)
**Routing**: React Router v6 with tabs as routes (/table, /visualize/[chartType])
**Data Pipeline**: Static JSON → Zustand → Memoized selectors → Components
**Component Library**: Strudel Kit components with custom chart wrappers
**Accessibility**: React Aria Live for announcements, focus trap for modals

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
│   │   │   └── MobileTable.tsx    # Responsive table view
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
│   ├── a11y/                      # Accessibility tests
│   └── e2e/                       # User journey tests
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
          'charts': ['d3-scale', 'd3-shape', 'd3-array'],
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
