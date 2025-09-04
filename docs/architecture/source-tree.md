# Source Tree Structure

## Project Organization

The Palmer Penguins Explorer follows a feature-based component organization with clear separation of concerns.

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
│   │   │   └── CardView.tsx       # Card-based responsive layout
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

## Directory Structure Principles

### Feature-Based Organization

Components are grouped by feature/domain rather than by type:

- `/filters/` - All filtering-related components
- `/table/` - Data table and related components
- `/visualizations/` - Charts and visualization components
- `/modals/` - Modal dialogs and overlays

### Separation of Concerns

- **Components**: Pure UI components with minimal business logic
- **Hooks**: Reusable stateful logic and side effects
- **Stores**: Global state management (Zustand)
- **Utils**: Pure functions and utilities
- **Types**: TypeScript type definitions

### Testing Structure

Tests mirror the source structure:

- **Unit tests** for individual components and functions
- **Integration tests** for component interactions
- **E2E tests** for complete user workflows
- **Performance tests** for runtime and bundle analysis

## Key Files & Their Purpose

### Application Entry Points

- `main.tsx` - React application bootstrap
- `App.tsx` - Root component with providers and routing
- `index.html` - HTML template with meta tags

### Core Components

- `MainLayout.tsx` - Primary application layout
- `AppHeader.tsx` - Navigation and global actions
- `FilterPanel.tsx` - Data filtering interface
- `DataTable.tsx` - Tabular data display
- `VisualizationPanel.tsx` - Chart container and controls

### State Management

- `dataStore.ts` - Raw penguin data and loading states
- `filterStore.ts` - Filter selections and derived counts
- `selectors.ts` - Memoized data transformations

### Utilities

- `constants.ts` - Application constants and enums
- `dataHelpers.ts` - Data processing and formatting
- `a11yHelpers.ts` - Accessibility utility functions

## Import Path Standards

Use absolute imports with `@/` prefix for cleaner imports:

```typescript
// Good
import { FilterPanel } from '@/components/filters/FilterPanel';
import { useFilteredData } from '@/hooks/useFilteredData';
import { SPECIES } from '@/utils/constants';

// Avoid
import { FilterPanel } from '../../components/filters/FilterPanel';
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `FilterPanel.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useFilteredData.ts`)
- **Utilities**: camelCase (e.g., `dataHelpers.ts`)
- **Types**: camelCase (e.g., `penguin.ts`)
- **Constants**: camelCase (e.g., `constants.ts`)

## Code Organization Within Files

```typescript
// 1. External imports
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal imports (absolute paths)
import { useFilterStore } from '@/stores/filterStore';
import { SPECIES } from '@/utils/constants';

// 3. Types and interfaces
interface FilterPanelProps {
  className?: string;
}

// 4. Component implementation
export const FilterPanel: React.FC<FilterPanelProps> = ({ className }) => {
  // Component logic
};
```
