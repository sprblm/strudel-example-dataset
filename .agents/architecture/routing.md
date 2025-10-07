# Routing Structure

## Route Configuration

The application uses React Router v6 with a nested routing structure that matches the tab-based wireframe design.

### Route Hierarchy

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
```

### URL Structure Examples

The routing system supports rich URL state to enable shareable links:

```
# Table view with filters
/table?species=adelie,gentoo&island=biscoe&sex=female

# Scatter plot with axis configuration
/visualize/scatter?x=bill_length_mm&y=body_mass_g&species=all&island=all&sex=all

# Histogram with custom binning
/visualize/histogram?field=flipper_length_mm&bins=15&species=chinstrap,gentoo

# Box plot with filtered data
/visualize/boxplot?field=body_mass_g&species=adelie&island=torgersen
```

## Route Components

### MainLayout - Root Layout Component

```typescript
// MainLayout.tsx - Root layout with nested routing
export const MainLayout: FC = () => {
  const location = useLocation()
  const { isLoading, error } = useDataStore()

  // Initialize URL sync on mount
  useURLSync()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (error) {
    return <ErrorScreen error={error} />
  }

  return (
    <div className={styles.mainLayout}>
      <SkipLinks />

      <AppHeader />

      <div className={styles.content}>
        <FilterPanel />

        <main id="main-content" className={styles.mainContent}>
          <TabNavigation />
          <Outlet />
        </main>
      </div>

      <LiveRegion />
      <WelcomeModal />
      <HelpModal />
    </div>
  )
}
```

### TableRoute - Data Table View

```typescript
// TableRoute.tsx - Data table route component
export const TableRoute: FC = () => {
  const filteredData = useFilterStore(getFilteredPenguins)
  const [sortField, setSortField] = useState<keyof Penguin>('species')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Update page title
  useEffect(() => {
    document.title = `Data Table - Palmer Penguins Explorer (${filteredData.length} penguins)`
  }, [filteredData.length])

  const handleSort = (field: keyof Penguin, direction: 'asc' | 'desc') => {
    setSortField(field)
    setSortDirection(direction)

    // Update URL with sort parameters
    const url = new URL(window.location.href)
    url.searchParams.set('sort', field)
    url.searchParams.set('order', direction)
    window.history.replaceState({}, '', url.toString())
  }

  // Handle empty state
  if (filteredData.length === 0) {
    return (
      <EmptyDataState
        onReset={() => useFilterStore.getState().clearAll()}
      />
    )
  }

  return (
    <div className={styles.tableRoute}>
      <div className={styles.tableHeader}>
        <h1>Penguin Data</h1>
        <p className={styles.resultCount}>
          Showing {filteredData.length} penguin{filteredData.length !== 1 ? 's' : ''}
        </p>

        <div className={styles.tableActions}>
          <ExportButton
            data={filteredData}
            format="csv"
            filename="palmer-penguins-filtered"
          />
        </div>
      </div>

      <DataTable
        data={filteredData}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    </div>
  )
}
```

### VisualizationRoute - Chart View

```typescript
// VisualizationRoute.tsx - Visualization route component
export const VisualizationRoute: FC = () => {
  const { chartType } = useParams<{ chartType: ChartType }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const filteredData = useFilterStore(getFilteredPenguins)

  // Chart configuration from URL
  const chartConfig = useMemo(() => ({
    type: chartType || 'scatter',
    xAxis: searchParams.get('x') || 'bill_length_mm',
    yAxis: searchParams.get('y') || 'body_mass_g',
    field: searchParams.get('field') || 'bill_length_mm',
    bins: parseInt(searchParams.get('bins') || '10'),
    colorBy: searchParams.get('color') || 'species'
  }), [chartType, searchParams])

  // Update page title
  useEffect(() => {
    const chartName = formatChartType(chartConfig.type)
    document.title = `${chartName} - Palmer Penguins Explorer (${filteredData.length} penguins)`
  }, [chartConfig.type, filteredData.length])

  // Update URL when chart config changes
  const updateChartConfig = (newConfig: Partial<ChartConfig>) => {
    const newSearchParams = new URLSearchParams(searchParams)

    Object.entries(newConfig).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value.toString())
      } else {
        newSearchParams.delete(key)
      }
    })

    setSearchParams(newSearchParams, { replace: true })
  }

  // Handle empty state
  if (filteredData.length === 0) {
    return (
      <EmptyDataState
        onReset={() => useFilterStore.getState().clearAll()}
      />
    )
  }

  return (
    <div className={styles.visualizationRoute}>
      <div className={styles.chartHeader}>
        <h1>Data Visualization</h1>
        <p className={styles.resultCount}>
          Visualizing {filteredData.length} penguin{filteredData.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className={styles.chartControls}>
        <ChartTypeSelector />

        {chartConfig.type === 'scatter' && (
          <AxisControls
            xAxis={chartConfig.xAxis}
            yAxis={chartConfig.yAxis}
            onAxisChange={updateChartConfig}
          />
        )}

        {chartConfig.type === 'histogram' && (
          <HistogramControls
            field={chartConfig.field}
            bins={chartConfig.bins}
            onConfigChange={updateChartConfig}
          />
        )}

        {chartConfig.type === 'boxplot' && (
          <BoxPlotControls
            field={chartConfig.field}
            onConfigChange={updateChartConfig}
          />
        )}
      </div>

      <div className={styles.chartContainer}>
        <ChartErrorBoundary>
          {chartConfig.type === 'scatter' && (
            <ScatterPlot
              data={filteredData}
              xField={chartConfig.xAxis}
              yField={chartConfig.yAxis}
              colorField={chartConfig.colorBy}
            />
          )}

          {chartConfig.type === 'histogram' && (
            <Histogram
              data={filteredData}
              field={chartConfig.field}
              bins={chartConfig.bins}
              colorField={chartConfig.colorBy}
            />
          )}

          {chartConfig.type === 'boxplot' && (
            <BoxPlot
              data={filteredData}
              field={chartConfig.field}
              groupBy={chartConfig.colorBy}
            />
          )}
        </ChartErrorBoundary>
      </div>

      <div className={styles.chartActions}>
        <ExportButton
          chartRef={chartRef}
          data={filteredData}
          config={chartConfig}
          format="png"
        />

        <ShareButton
          url={window.location.href}
          title={`Palmer Penguins ${formatChartType(chartConfig.type)}`}
        />
      </div>
    </div>
  )
}
```

## URL State Management

### URL Parameter Schema

```typescript
interface URLParameters {
  // Filter parameters
  species?: string; // comma-separated: "adelie,gentoo"
  island?: Island | 'all';
  sex?: Sex | 'all';

  // Chart parameters
  x?: string; // x-axis field for scatter plots
  y?: string; // y-axis field for scatter plots
  field?: string; // field for histogram/boxplot
  bins?: string; // number of bins for histogram
  color?: string; // color grouping field

  // Table parameters
  sort?: string; // sort field
  order?: 'asc' | 'desc'; // sort direction
  page?: string; // current page number
}
```

### URL Synchronization Hook

```typescript
// useURLSync.ts - Bidirectional URL state synchronization
export const useURLSync = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { serializeToURL, hydrateFromURL } = useFilterStore();

  // Debounced URL update to prevent excessive history entries
  const debouncedNavigate = useMemo(
    () =>
      debounce((search: string) => {
        navigate({ search }, { replace: true });
      }, 100),
    [navigate]
  );

  // Update URL when filters change
  useEffect(() => {
    const params = serializeToURL();
    const newSearch = params.toString();

    if (newSearch !== location.search.slice(1)) {
      debouncedNavigate(newSearch);
    }
  }, [serializeToURL, debouncedNavigate, location.search]);

  // Update filters when URL changes (browser back/forward, direct URL access)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    hydrateFromURL(params);
  }, [location.search, hydrateFromURL]);

  // Cleanup debounced function
  useEffect(() => {
    return () => {
      debouncedNavigate.cancel();
    };
  }, [debouncedNavigate]);
};
```

### Deep Linking Support

```typescript
// Deep linking validation and fallbacks
export const validateAndNormalizeURL = (
  params: URLSearchParams
): URLSearchParams => {
  const normalized = new URLSearchParams();

  // Validate species parameter
  const species = params.get('species');
  if (species) {
    const validSpecies = species.split(',').filter(isValidSpecies);
    if (validSpecies.length > 0) {
      normalized.set('species', validSpecies.join(','));
    }
  }

  // Validate island parameter
  const island = params.get('island');
  if (island && (island === 'all' || isValidIsland(island))) {
    normalized.set('island', island);
  }

  // Validate sex parameter
  const sex = params.get('sex');
  if (sex && (sex === 'all' || isValidSex(sex))) {
    normalized.set('sex', sex);
  }

  // Validate chart parameters
  const xField = params.get('x');
  if (xField && isValidNumericField(xField)) {
    normalized.set('x', xField);
  }

  const yField = params.get('y');
  if (yField && isValidNumericField(yField)) {
    normalized.set('y', yField);
  }

  const field = params.get('field');
  if (field && isValidNumericField(field)) {
    normalized.set('field', field);
  }

  const bins = params.get('bins');
  if (bins) {
    const binCount = parseInt(bins);
    if (binCount >= 5 && binCount <= 50) {
      normalized.set('bins', bins);
    }
  }

  return normalized;
};
```

## Navigation Components

### TabNavigation - Tab Interface

```typescript
// TabNavigation.tsx - Tab-based navigation
export const TabNavigation: FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const currentTab = location.pathname.startsWith('/visualize') ? 'visualize' : 'table'

  const handleTabChange = (tab: 'table' | 'visualize') => {
    if (tab === 'table') {
      navigate('/table' + location.search)
    } else {
      navigate('/visualize/scatter' + location.search)
    }
  }

  return (
    <div className={styles.tabNavigation} role="tablist">
      <button
        role="tab"
        aria-selected={currentTab === 'table'}
        aria-controls="table-panel"
        onClick={() => handleTabChange('table')}
        className={cx(styles.tab, {
          [styles.active]: currentTab === 'table'
        })}
      >
        📊 Table
      </button>

      <button
        role="tab"
        aria-selected={currentTab === 'visualize'}
        aria-controls="visualize-panel"
        onClick={() => handleTabChange('visualize')}
        className={cx(styles.tab, {
          [styles.active]: currentTab === 'visualize'
        })}
      >
        📈 Visualizations
      </button>
    </div>
  )
}
```

### Breadcrumb Navigation

```typescript
// Breadcrumbs.tsx - Contextual navigation
export const Breadcrumbs: FC = () => {
  const location = useLocation()
  const { chartType } = useParams<{ chartType: ChartType }>()

  const breadcrumbs = useMemo(() => {
    const crumbs = [
      { label: 'Home', path: '/' }
    ]

    if (location.pathname.startsWith('/table')) {
      crumbs.push({ label: 'Data Table', path: '/table' })
    } else if (location.pathname.startsWith('/visualize')) {
      crumbs.push({ label: 'Visualizations', path: '/visualize/scatter' })

      if (chartType) {
        crumbs.push({
          label: formatChartType(chartType),
          path: `/visualize/${chartType}`
        })
      }
    }

    return crumbs
  }, [location.pathname, chartType])

  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      <ol>
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path}>
            {index < breadcrumbs.length - 1 ? (
              <Link to={crumb.path + location.search}>
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page">{crumb.label}</span>
            )}
            {index < breadcrumbs.length - 1 && (
              <span className={styles.separator} aria-hidden="true"> / </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
```

## Route Security and Validation

### Route Guards

```typescript
// Route protection and validation
export const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { penguins, loadingState } = useDataStore()

  // Redirect to loading state if data not yet loaded
  if (loadingState === 'loading') {
    return <LoadingScreen />
  }

  // Redirect to error state if data failed to load
  if (loadingState === 'error' || penguins.length === 0) {
    return <ErrorScreen />
  }

  return <>{children}</>
}
```

### 404 Handling

```typescript
// 404 error boundary and fallback
export const NotFoundRoute: FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Auto-redirect to table view after 3 seconds
    const timer = setTimeout(() => {
      navigate('/table', { replace: true })
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className={styles.notFound} role="main">
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>

      <div className={styles.actions}>
        <Link to="/table">Go to Data Table</Link>
        <Link to="/visualize/scatter">Go to Visualizations</Link>
      </div>

      <p className={styles.autoRedirect}>
        You'll be automatically redirected to the data table in 3 seconds.
      </p>
    </div>
  )
}
```
