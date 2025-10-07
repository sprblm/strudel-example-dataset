# Data Flow Architecture

## Application Data Flow Overview

The data flow architecture follows a unidirectional pattern with clear separation between data loading, state management, and UI updates.

## Data Flow Sequences

### 1. Initial Load Sequence

```typescript
// Application startup data flow
App Mount → Check localStorage → Show/Skip Welcome → Load JSON → Initialize Filters from URL
```

**Detailed Flow:**

1. **App Mount**: React application initializes
2. **localStorage Check**: Verify if user has visited before
3. **Welcome Modal**: Show/skip onboarding based on visit status
4. **Data Loading**: Fetch static penguin dataset from `/penguins.json`
5. **URL Parsing**: Extract filter parameters from URL
6. **Store Initialization**: Initialize filter and data stores
7. **Initial Render**: Render with loaded data and URL-derived filters

### 2. Filter State Synchronization

```typescript
// Filter update data flow
User Input → Update Store → Debounced URL Update → Memoized Recompute → Re-render
              ↓
         Live Region Announcement
```

**Detailed Flow:**

1. **User Input**: User interacts with filter controls (checkbox, dropdown, radio)
2. **Store Update**: Filter store updates relevant state (species, island, sex)
3. **Derived State**: Filter counts and active filter count automatically recompute
4. **URL Synchronization**: Debounced URL update (100ms) to maintain browser history
5. **Data Recomputation**: Memoized selector recomputes filtered dataset
6. **Component Re-render**: React re-renders affected components with new data
7. **Accessibility Announcement**: Live region announces new result count to screen readers

### 3. View State Management

```typescript
// Route-based view switching
Tab Click → Route Change → Component Mount → Use Filtered Data → Render
```

**Detailed Flow:**

1. **Tab Interaction**: User clicks Table or Visualization tab
2. **Route Change**: React Router navigates to new route (`/table` or `/visualize/:chartType`)
3. **Component Mount**: Route-specific component mounts
4. **Data Consumption**: Component hooks into filtered data from selectors
5. **View Render**: Component renders with current filtered dataset
6. **URL State**: Chart type and configuration persisted in URL parameters

### 4. Export Pipeline

```typescript
// Data/visualization export flow
Current View → Canvas/CSV Generator → Blob Creation → Download Trigger
                                         ↓
                                    URL Shortener API (for sharing)
```

**Detailed Flow:**

1. **Export Trigger**: User clicks export button (PNG/CSV)
2. **Current State Capture**: Capture current view state (data, filters, chart config)
3. **Content Generation**:
   - **PNG**: Canvas rendering of current visualization
   - **CSV**: Filtered dataset conversion to CSV format
4. **Blob Creation**: Create downloadable blob from generated content
5. **Download Trigger**: Browser download with appropriate filename
6. **Share URL**: Generate shareable URL with current state parameters

## Data Sources and Persistence

### Static Data Loading

```typescript
// Data loading with error handling
interface DataLoadingFlow {
  source: '/penguins.json';
  fallback: 'localStorage cache';
  errorHandling: 'exponential backoff retry';
  validation: 'schema validation';
}
```

### State Persistence

```typescript
// State persistence strategy
interface StatePersistence {
  filters: 'URL parameters';
  chartConfig: 'URL parameters';
  visitStatus: 'localStorage';
  dataCache: 'localStorage (7-day expiry)';
}
```

## State Synchronization Patterns

### URL State Synchronization

The application maintains bidirectional synchronization between application state and URL parameters:

```typescript
// URL parameter mapping
interface URLStateMapping {
  species: 'comma-separated species list';
  island: 'single island value or "all"';
  sex: 'single sex value or "all"';
  chartType: 'route parameter (/visualize/:chartType)';
  xAxis: 'chart x-axis field';
  yAxis: 'chart y-axis field';
  bins: 'histogram bin count';
}
```

### Live Data Updates

Components automatically receive updates through:

1. **Zustand subscriptions**: Components subscribe to relevant store slices
2. **Memoized selectors**: Expensive computations cached and recomputed only when dependencies change
3. **React re-renders**: Automatic re-rendering when subscribed state changes

## Performance Optimizations in Data Flow

### Debounced Updates

```typescript
// Prevent excessive URL updates during rapid filter changes
const debouncedURLUpdate = useMemo(() => debounce(updateURLParams, 100), []);
```

### Memoized Computations

```typescript
// Expensive filter computations are memoized
const filteredData = useMemo(() => {
  return penguins.filter((penguin) => {
    return matchesFilters(penguin, filters);
  });
}, [penguins, filters]);
```

### Selective Re-rendering

```typescript
// Components only re-render when their specific data slice changes
const species = useFilterStore((state) => state.selectedSpecies);
const counts = useFilterStore((state) => state.speciesCounts);
```

## Error Handling in Data Flow

### Data Loading Errors

```typescript
// Robust data loading with fallbacks
interface ErrorHandling {
  networkErrors: 'exponential backoff retry (3 attempts)';
  dataValidation: 'schema validation with error reporting';
  fallbackData: 'localStorage cache as last resort';
  userFeedback: 'error states with retry options';
}
```

### State Recovery

```typescript
// State corruption recovery
interface StateRecovery {
  invalidFilters: 'reset to default state';
  malformedURL: 'graceful parsing with defaults';
  storeErrors: 'error boundaries with state reset';
}
```

## Data Flow Security Considerations

### Input Validation

```typescript
// All user inputs are validated before state updates
interface InputValidation {
  filterValues: 'whitelist validation against known values';
  urlParameters: 'sanitization and type checking';
  localStorageData: 'schema validation on read';
}
```

### XSS Prevention

```typescript
// Prevent XSS through data flow
interface XSSPrevention {
  userInput: 'controlled components only';
  urlData: 'parameter sanitization';
  dynamicContent: 'React automatic escaping';
}
```

## Monitoring and Debugging

### Data Flow Debugging

```typescript
// Development debugging tools
interface DebuggingTools {
  storeLogging: 'Zustand devtools integration';
  stateInspection: 'React DevTools state inspection';
  performanceProfile: 'React Profiler for re-render analysis';
  networkInspection: 'Browser DevTools for data loading';
}
```

### Performance Monitoring

```typescript
// Production monitoring
interface PerformanceMonitoring {
  loadTimes: 'Navigation Timing API';
  renderPerformance: 'React concurrent features';
  errorTracking: 'error boundary reporting';
  userInteractions: 'event timing measurement';
}
```
