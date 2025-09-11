# Component Architecture

## Hierarchical Component Structure

The component architecture is designed to align with the wireframes and provide a clear separation of concerns:

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

## Component Categories

### Layout Components

#### AppHeader
- **Purpose**: Top-level navigation and app actions
- **Features**: Strudel AppBar with Help/Export/Settings
- **Responsive**: Collapses to hamburger menu on mobile
- **Accessibility**: Skip links, proper heading hierarchy

#### MainLayout
- **Purpose**: Primary application layout container
- **Features**: Responsive container with accessibility features
- **Responsive**: Adapts sidebar/overlay behavior based on viewport
- **Accessibility**: Skip links, live regions, focus management

#### TabNavigation
- **Purpose**: Toggle between Table and Visualizations views
- **Features**: Tab interface matching wireframe design
- **Responsive**: Maintains usability across all breakpoints
- **Accessibility**: ARIA tab pattern, keyboard navigation

#### MobileMenu
- **Purpose**: Mobile-specific navigation overlay
- **Features**: Hamburger menu for mobile devices
- **Responsive**: Only rendered on mobile breakpoints
- **Accessibility**: Focus trap, escape key handling

### Filter Components

#### FilterPanel
- **Purpose**: Container for all data filtering controls
- **Features**: Collapsible panel with responsive behavior
- **Responsive**: Fixed sidebar (desktop), collapsible (tablet), overlay (mobile)
- **Accessibility**: Proper fieldset/legend structure, announcements

#### SpeciesFilter
- **Purpose**: Multi-select species filtering
- **Features**: Checkboxes with live count updates
- **State**: Connected to filterStore for species selections
- **Accessibility**: ARIA descriptions for counts, proper labeling

#### IslandFilter
- **Purpose**: Single-select island filtering
- **Features**: Dropdown/select with "All" option
- **State**: Connected to filterStore for island selection
- **Accessibility**: Proper select labeling and descriptions

#### SexFilter
- **Purpose**: Single-select sex filtering
- **Features**: Radio group with "All" option
- **State**: Connected to filterStore for sex selection
- **Accessibility**: Radio group pattern, proper fieldset

#### ClearFiltersButton
- **Purpose**: Reset all filters to default state
- **Features**: Single action to clear all active filters
- **State**: Triggers filterStore.clearAll()
- **Accessibility**: Clear action description

#### FilterSummary
- **Purpose**: Display current filter results count
- **Features**: "Showing X penguins" live text
- **State**: Computed from filtered data count
- **Accessibility**: Live region for screen reader announcements

### Table Components

#### DataTable
- **Purpose**: Display penguin data in tabular format
- **Features**: Strudel Table wrapper with sorting and pagination
- **State**: Consumes filtered data from selectors
- **Accessibility**: Proper table headers, sortable column indicators

#### TablePagination
- **Purpose**: Navigate through large datasets
- **Features**: Page-based navigation with configurable page size
- **State**: Local pagination state
- **Accessibility**: Page navigation controls, current page indication

#### ColumnSort
- **Purpose**: Sort table data by column
- **Features**: Visual sort indicators (ascending/descending)
- **State**: Local sort state with URL synchronization
- **Accessibility**: Sort button labels, current sort announcement

#### EmptyState
- **Purpose**: Handle no-results scenarios
- **Features**: "No penguins match" message with suggestions
- **Conditional**: Only renders when filtered data is empty
- **Accessibility**: Proper heading hierarchy, actionable suggestions

#### CardView
- **Purpose**: Alternative mobile-friendly data display
- **Features**: Card-based responsive layout for small screens
- **Responsive**: Replaces table on mobile breakpoints
- **Accessibility**: Proper card labeling and navigation

### Visualization Components

#### VisualizationPanel
- **Purpose**: Container for chart visualization controls
- **Features**: Chart type selector and axis controls
- **State**: Chart configuration and data
- **Accessibility**: Proper panel labeling and focus management

#### ChartTypeSelector
- **Purpose**: Toggle between different chart types
- **Features**: Icon-based selection (scatter, histogram, box plot)
- **State**: Chart type routing parameter
- **Accessibility**: Tab pattern for chart type selection

#### AxisControls
- **Purpose**: Configure chart axes (X/Y dropdowns)
- **Features**: Dropdown selectors for data fields
- **State**: Chart configuration in URL params
- **Accessibility**: Proper select labeling and descriptions

#### Charts (ScatterPlot, Histogram, BoxPlot)
- **Purpose**: Render data visualizations
- **Features**: D3-powered interactive charts
- **State**: Filtered data and chart configuration
- **Accessibility**: Keyboard navigation, data announcements, alt text

#### ChartContainer
- **Purpose**: Responsive wrapper for chart components
- **Features**: Responsive sizing and error boundary
- **Responsive**: Adapts chart dimensions to container
- **Accessibility**: Proper chart labeling and descriptions

#### ChartLegend
- **Purpose**: Display chart legend information
- **Features**: Color-coded legend with species information
- **State**: Derived from chart data and configuration
- **Accessibility**: Proper legend labeling and associations

### Modal Components

#### WelcomeModal
- **Purpose**: First-visit user onboarding
- **Features**: Dataset introduction and "don't show again" option
- **State**: localStorage for visit tracking
- **Accessibility**: Modal focus trap, escape key handling

#### HelpModal
- **Purpose**: Dataset information and help content
- **Features**: Detailed dataset variable descriptions
- **Trigger**: Help button in app header
- **Accessibility**: Modal pattern with proper focus management

### Export Components

#### ExportButton
- **Purpose**: Download visualizations and data
- **Features**: PNG and CSV export options
- **Implementation**: Canvas rendering for images, blob generation for CSV
- **Accessibility**: Clear export action descriptions

#### ShareButton
- **Purpose**: Share current view via URL
- **Features**: Copy shareable URL to clipboard
- **State**: Current URL with filter and view parameters
- **Accessibility**: Share action feedback and status

### Accessibility Components

#### SkipLinks
- **Purpose**: Keyboard navigation shortcuts
- **Features**: Skip to main content, filters, and data
- **Implementation**: Hidden links that appear on focus
- **Accessibility**: Standard skip link pattern

#### LiveRegion
- **Purpose**: Announce dynamic content changes
- **Features**: Screen reader announcements for filter changes
- **State**: Connected to filtered data count
- **Accessibility**: ARIA live region with polite announcements

#### FocusTrap
- **Purpose**: Modal focus management
- **Features**: Trap focus within modal dialogs
- **Implementation**: Focus management for modals
- **Accessibility**: Proper modal focus behavior

## Component Design Principles

### Single Responsibility
Each component has a clear, focused purpose and encapsulates related functionality.

### Composition Over Inheritance
Components are designed to be composed together rather than extended through inheritance.

### Props Interface Design
- Clear, typed interfaces using TypeScript
- Minimal required props with sensible defaults
- Consistent naming conventions across components

### State Management Integration
- Components connect to appropriate stores (data, filter)
- Local state only for UI-specific concerns
- Proper separation of server state and UI state

### Accessibility First
- All components designed with accessibility in mind
- ARIA patterns implemented consistently
- Keyboard navigation support throughout

### Responsive Design
- Mobile-first component design
- Conditional rendering based on breakpoints
- Adaptive layouts that work across all screen sizes

### Error Handling
- Error boundaries at appropriate levels
- Graceful degradation for failed components
- User-friendly error states and recovery options