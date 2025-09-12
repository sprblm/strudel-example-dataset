# Source Tree Structure

## Project Organization

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

## Directory Organization Principles

### Component Organization

Components are organized by feature and responsibility:

- **layout/**: App-wide layout components
- **filters/**: Data filtering interface components
- **table/**: Data table display components
- **visualizations/**: Chart and visualization components
- **modals/**: Modal dialog components
- **export/**: Data export functionality
- **a11y/**: Accessibility-specific components

### Hook Organization

Custom hooks are grouped by functionality:

- **Data hooks**: `useFilteredData`, `useChartConfig`
- **UI hooks**: `useResponsive`, `useFirstVisit`
- **Integration hooks**: `useURLSync`, `useKeyboardShortcuts`
- **Feature hooks**: `useExport`

### Store Organization

State management is separated by concern:

- **dataStore**: Raw penguin data and loading states
- **filterStore**: User filter selections and derived counts
- **selectors**: Memoized computations for performance

### Utility Organization

Utilities are organized by domain:

- **constants**: Static configuration values
- **dataHelpers**: Data processing and validation
- **chartHelpers**: Visualization-specific utilities
- **exportHelpers**: File generation utilities
- **urlHelpers**: URL state management
- **a11yHelpers**: Accessibility utilities

### Test Organization

Tests are organized by type and scope:

- **unit/**: Isolated component and function tests
- **integration/**: Multi-component interaction tests
- **e2e/**: Full user journey tests
- **performance/**: Performance benchmark tests
- \***\*fixtures**/\*\*: Shared test data and mocks
- **setup/**: Test configuration and utilities
