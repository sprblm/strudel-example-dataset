# State Management Architecture

## State Management Strategy

The application uses a hybrid state management approach with Zustand for global state and React's built-in state for local UI concerns, providing optimal performance and developer experience.

## Store Architecture

### Data Store (dataStore.ts)

The data store manages the raw penguin dataset and loading states:

```typescript
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
```

**Responsibilities:**

- Raw dataset storage and loading
- Data validation and error handling
- Computed maps for efficient filtering
- Caching and offline support

### Filter Store (filterStore.ts)

The filter store manages user filter selections and derived filter state:

```typescript
interface FilterStore {
  // State - matching wireframe exactly
  selectedSpecies: Set<Species>; // Checkboxes
  selectedIsland: Island | 'all'; // Dropdown
  selectedSex: Sex | 'all'; // Radio

  // Derived counts for UI
  speciesCounts: Record<Species, number>;
  activeFilterCount: number;

  // Actions
  toggleSpecies: (species: Species) => void;
  setIsland: (island: Island | 'all') => void;
  setSex: (sex: Sex | 'all') => void;
  clearAll: () => void;

  // URL persistence
  serializeToURL: () => URLSearchParams;
  hydrateFromURL: (params: URLSearchParams) => void;
}
```

**Responsibilities:**

- Filter selection state management
- Live count computation
- URL state synchronization
- Filter validation and sanitization

### Selectors (selectors.ts)

Memoized computations for performance optimization:

```typescript
// Memoized filtered data computation
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

// Additional selectors for chart data
export const getChartData = createSelector(
  [getFilteredPenguins, (state) => state.chartConfig],
  (penguins, config) => {
    return transformForChart(penguins, config);
  }
);

// Performance metrics selector
export const getDataMetrics = createSelector(
  [getFilteredPenguins],
  (penguins) => ({
    totalCount: penguins.length,
    speciesDistribution: groupBy(penguins, 'species'),
    islandDistribution: groupBy(penguins, 'island'),
    sexDistribution: groupBy(penguins, 'sex'),
  })
);
```

## Store Implementation Details

### Zustand Configuration

```typescript
// Data store implementation
export const useDataStore = create<DataStore>((set, get) => ({
  penguins: [],
  loadingState: 'idle',
  error: null,

  loadData: async () => {
    set({ loadingState: 'loading', error: null });

    try {
      const response = await fetch('/penguins.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      validatePenguinData(data);

      set({
        penguins: data,
        loadingState: 'success',
        error: null,
      });

      // Cache data for offline use
      cacheData(data);
    } catch (error) {
      set({
        loadingState: 'error',
        error: error.message,
      });
    }
  },

  // Computed properties using getters
  get speciesMap() {
    const { penguins } = get();
    return groupBy(penguins, 'species');
  },

  get islandMap() {
    const { penguins } = get();
    return groupBy(penguins, 'island');
  },

  get numericRanges() {
    const { penguins } = get();
    return computeNumericRanges(penguins);
  },
}));

// Filter store implementation
export const useFilterStore = create<FilterStore>((set, get) => ({
  selectedSpecies: new Set(['adelie', 'chinstrap', 'gentoo']),
  selectedIsland: 'all',
  selectedSex: 'all',

  // Computed counts
  get speciesCounts() {
    const dataStore = useDataStore.getState();
    const { selectedIsland, selectedSex } = get();

    return computeSpeciesCounts(dataStore.penguins, {
      island: selectedIsland,
      sex: selectedSex,
    });
  },

  get activeFilterCount() {
    const { selectedSpecies, selectedIsland, selectedSex } = get();
    let count = 0;

    if (selectedSpecies.size < 3) count++;
    if (selectedIsland !== 'all') count++;
    if (selectedSex !== 'all') count++;

    return count;
  },

  toggleSpecies: (species) => {
    set((state) => {
      const newSelected = new Set(state.selectedSpecies);
      if (newSelected.has(species)) {
        newSelected.delete(species);
      } else {
        newSelected.add(species);
      }
      return { selectedSpecies: newSelected };
    });
  },

  setIsland: (island) => set({ selectedIsland: island }),
  setSex: (sex) => set({ selectedSex: sex }),

  clearAll: () =>
    set({
      selectedSpecies: new Set(['adelie', 'chinstrap', 'gentoo']),
      selectedIsland: 'all',
      selectedSex: 'all',
    }),

  serializeToURL: () => {
    const { selectedSpecies, selectedIsland, selectedSex } = get();
    const params = new URLSearchParams();

    if (selectedSpecies.size < 3) {
      params.set('species', Array.from(selectedSpecies).join(','));
    }
    if (selectedIsland !== 'all') {
      params.set('island', selectedIsland);
    }
    if (selectedSex !== 'all') {
      params.set('sex', selectedSex);
    }

    return params;
  },

  hydrateFromURL: (params) => {
    const species = params.get('species');
    const island = params.get('island');
    const sex = params.get('sex');

    set({
      selectedSpecies: species
        ? new Set(species.split(',').filter(isValidSpecies))
        : new Set(['adelie', 'chinstrap', 'gentoo']),
      selectedIsland: island && isValidIsland(island) ? island : 'all',
      selectedSex: sex && isValidSex(sex) ? sex : 'all',
    });
  },
}));
```

## Local Component State

### When to Use Local State

Local React state is used for:

- **UI-only concerns**: Modal open/closed, form input values, loading indicators
- **Temporary state**: Hover states, focus management, animation states
- **Component-specific state**: Pagination current page, sort direction, expanded/collapsed states

### Examples of Local State Usage

```typescript
// Modal state
const [isWelcomeOpen, setWelcomeOpen] = useState(false);
const [dontShowAgain, setDontShowAgain] = useState(false);

// Pagination state
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(20);

// Chart interaction state
const [hoveredDataPoint, setHoveredDataPoint] = useState(null);
const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

// Responsive state
const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
```

## State Synchronization

### URL State Synchronization

Bidirectional synchronization between URL and application state:

```typescript
// URL synchronization hook
export const useURLSync = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { serializeToURL, hydrateFromURL } = useFilterStore();

  // Update URL when filters change
  useEffect(() => {
    const params = serializeToURL();
    const newSearch = params.toString();

    if (newSearch !== location.search.slice(1)) {
      navigate({ search: newSearch }, { replace: true });
    }
  }, [serializeToURL, navigate, location.search]);

  // Update filters when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    hydrateFromURL(params);
  }, [location.search, hydrateFromURL]);
};
```

### localStorage Persistence

Certain state is persisted to localStorage for better UX:

```typescript
// Visit tracking
export const useFirstVisit = () => {
  const [isFirstVisit, setIsFirstVisit] = useState(() => {
    return !localStorage.getItem('palmer-penguins-visited');
  });

  const markVisited = useCallback(() => {
    localStorage.setItem('palmer-penguins-visited', 'true');
    setIsFirstVisit(false);
  }, []);

  return { isFirstVisit, markVisited };
};

// Data caching
export const useDataCache = () => {
  const cacheData = useCallback((data: Penguin[]) => {
    try {
      const cacheObject = {
        data,
        timestamp: Date.now(),
        version: '1.0',
      };
      localStorage.setItem(
        'palmer-penguins-cache',
        JSON.stringify(cacheObject)
      );
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }, []);

  const getCachedData = useCallback((): Penguin[] | null => {
    try {
      const cached = localStorage.getItem('palmer-penguins-cache');
      if (!cached) return null;

      const { data, timestamp, version } = JSON.parse(cached);

      // Check cache expiry (7 days)
      if (Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem('palmer-penguins-cache');
        return null;
      }

      // Check version compatibility
      if (version !== '1.0') {
        localStorage.removeItem('palmer-penguins-cache');
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Failed to retrieve cached data:', error);
      return null;
    }
  }, []);

  return { cacheData, getCachedData };
};
```

## Performance Considerations

### Subscription Optimization

Components subscribe only to the data they need:

```typescript
// Only subscribe to species selection
const selectedSpecies = useFilterStore((state) => state.selectedSpecies);

// Only subscribe to filtered data count
const filteredCount = useFilterStore(
  (state) => getFilteredPenguins(state).length
);

// Avoid subscribing to entire store
const store = useFilterStore(); // ❌ Re-renders on any change
```

### Selector Memoization

Expensive computations are memoized to prevent unnecessary recalculation:

```typescript
// Memoized chart data transformation
export const useChartData = (chartType: ChartType) => {
  const filteredData = useFilterStore(getFilteredPenguins);

  return useMemo(() => {
    switch (chartType) {
      case 'scatter':
        return transformForScatterPlot(filteredData);
      case 'histogram':
        return transformForHistogram(filteredData);
      case 'boxplot':
        return transformForBoxPlot(filteredData);
      default:
        return filteredData;
    }
  }, [filteredData, chartType]);
};
```

### Debounced Updates

Rapid state changes are debounced to prevent performance issues:

```typescript
// Debounced URL updates
export const useDebouncedURLUpdate = () => {
  const updateURL = useURLUpdate();

  const debouncedUpdate = useMemo(() => debounce(updateURL, 100), [updateURL]);

  return debouncedUpdate;
};
```

## Error Handling in State Management

### Store Error Recovery

```typescript
// Error boundary for store operations
export const StoreErrorBoundary: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={<StoreErrorFallback />}
      onError={(error) => {
        // Reset stores to default state
        useDataStore.getState().reset?.();
        useFilterStore.getState().clearAll();

        console.error('Store error:', error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
```

### State Validation

```typescript
// Validate state integrity
export const validateStoreState = (state: any): boolean => {
  try {
    // Validate data store
    if (!Array.isArray(state.penguins)) return false;

    // Validate filter store
    if (!(state.selectedSpecies instanceof Set)) return false;
    if (!isValidIsland(state.selectedIsland)) return false;
    if (!isValidSex(state.selectedSex)) return false;

    return true;
  } catch (error) {
    return false;
  }
};
```
