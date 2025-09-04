# Appendix: Design Specifications

## Information Architecture

### Site Structure

```
Palmer Penguins Explorer
├── Landing View (/)
│   └── Redirects to /table
├── Data Table View (/table)
│   ├── Filter Panel (Collapsible on mobile)
│   ├── Data Table (Responsive)
│   └── Export Options
├── Visualizations (/visualize)
│   ├── Chart Type Selection
│   ├── Scatter Plot (/visualize/scatter)
│   ├── Histogram (/visualize/histogram)
│   └── Box Plot (/visualize/boxplot)
├── Help Modal (Overlay)
└── Welcome Modal (First visit only)
```

### URL Structure and State Management

```
Base Routes:
/table                          # Data table view
/visualize/scatter              # Scatter plot view
/visualize/histogram            # Histogram view
/visualize/boxplot              # Box plot view

Query Parameters (Shared State):
?species=adelie,chinstrap       # Selected species (comma-separated)
?island=biscoe                  # Selected island
?sex=male                       # Selected sex filter
?x=bill_length_mm              # X-axis variable (charts only)
?y=body_mass_g                 # Y-axis variable (charts only)
?bins=10                       # Histogram bins (histogram only)

Example URLs:
/table?species=adelie,gentoo&island=biscoe
/visualize/scatter?x=bill_length_mm&y=body_mass_g&species=adelie
/visualize/histogram?variable=flipper_length_mm&bins=20&sex=female
```

---

## Component Hierarchy

### Application Structure

```typescript
App
├── Router
│   ├── MainLayout
│   │   ├── AppHeader (Strudel AppBar)
│   │   │   ├── Logo/Title
│   │   │   ├── HelpButton
│   │   │   └── ExportMenu
│   │   ├── SkipLinks
│   │   ├── FilterPanel
│   │   │   ├── FilterToggle (Mobile only)
│   │   │   ├── SpeciesFilter (Checkboxes)
│   │   │   ├── IslandFilter (Dropdown)
│   │   │   ├── SexFilter (Radio buttons)
│   │   │   ├── ClearFiltersButton
│   │   │   └── FilterSummary
│   │   ├── MainContent
│   │   │   ├── TabNavigation
│   │   │   └── Routes
│   │   │       ├── TableRoute
│   │   │       │   ├── DataTable (Strudel Table)
│   │   │       │   ├── TablePagination
│   │   │       │   └── MobileCardView
│   │   │       └── VisualizationRoute
│   │   │           ├── ChartTypeSelector
│   │   │           ├── AxisControls
│   │   │           └── ChartContainer
│   │   │               ├── ScatterPlot
│   │   │               ├── Histogram
│   │   │               └── BoxPlot
│   │   └── Footer (Attribution)
│   ├── WelcomeModal (First visit)
│   ├── HelpModal (On demand)
│   └── ErrorBoundary
├── GlobalErrorHandler
└── AccessibilityProvider
```

### Component Responsibilities

#### Layout Components

- **MainLayout**: Primary application container with responsive grid
- **AppHeader**: Top navigation using Strudel AppBar component
- **FilterPanel**: Collapsible sidebar containing all filter controls
- **MainContent**: Primary content area with routing

#### Data Components

- **DataTable**: Table display using Strudel Table with sorting and pagination
- **MobileCardView**: Card-based layout for mobile table experience
- **ChartContainer**: Responsive wrapper for all visualization components

#### Filter Components

- **SpeciesFilter**: Checkbox group for species selection with counts
- **IslandFilter**: Dropdown selector for island filtering
- **SexFilter**: Radio button group for sex filtering
- **ClearFiltersButton**: Reset all filters with confirmation

#### Visualization Components

- **ScatterPlot**: Interactive scatter plot with hover tooltips
- **Histogram**: Distribution histogram with adjustable bins
- **BoxPlot**: Statistical box plot with outlier detection
- **ChartTypeSelector**: Icon-based chart type navigation

#### Utility Components

- **SkipLinks**: Accessibility navigation shortcuts
- **LiveRegion**: Screen reader announcements
- **LoadingStates**: Skeleton loaders and spinners
- **ErrorBoundary**: Error handling with user-friendly messages

---

## Responsive Design Specifications

### Breakpoint Strategy

```css
/* Mobile First Approach */
:root {
  --mobile: 0px; /* 0-767px */
  --tablet: 768px; /* 768-1023px */
  --desktop: 1024px; /* 1024px+ */
  --wide: 1440px; /* 1440px+ */
}
```

### Layout Adaptations

#### Mobile (0-767px)

- **Single Column**: Vertical stack layout
- **Filter Overlay**: Full-screen filter modal
- **Card Tables**: Stacked card view instead of horizontal table
- **Touch Targets**: Minimum 44x44px tap targets
- **Chart Sizing**: Full-width responsive charts

#### Tablet (768-1023px)

- **Two Column**: Filter sidebar + main content
- **Collapsible Filters**: Sidebar can collapse to save space
- **Hybrid Table**: Horizontal scroll with sticky columns
- **Chart Controls**: Simplified axis controls
- **Modal Sizing**: Larger modals with more content

#### Desktop (1024px+)

- **Three Column**: Filters + content + metadata/legend
- **Full Table**: Complete horizontal table layout
- **Advanced Controls**: Full chart configuration options
- **Hover States**: Rich hover interactions
- **Keyboard Shortcuts**: Full keyboard navigation support

### Component-Specific Responsive Behavior

#### DataTable Component

```typescript
// Mobile: Card layout
<div className="penguin-card">
  <h3>{penguin.species}</h3>
  <p>Island: {penguin.island}</p>
  <p>Measurements: {measurements}</p>
</div>

// Tablet/Desktop: Table layout
<table className="data-table">
  <thead>...</thead>
  <tbody>...</tbody>
</table>
```

#### FilterPanel Component

```typescript
// Mobile: Overlay modal
<Modal isOpen={filtersOpen}>
  <FilterContent />
</Modal>

// Desktop: Sidebar
<aside className="filter-sidebar">
  <FilterContent />
</aside>
```

---

## Accessibility Implementation

### ARIA Implementation

```typescript
// Example ARIA patterns
<div
  role="region"
  aria-label="Data filters"
  aria-expanded={filtersExpanded}
>
  <button
    aria-controls="filter-content"
    aria-expanded={filtersExpanded}
  >
    Filters ({activeFilterCount})
  </button>
</div>

<div
  id="filter-content"
  role="group"
  aria-labelledby="filter-heading"
>
  <h2 id="filter-heading">Filter Penguins</h2>
  {/* Filter controls */}
</div>
```

### Live Region Announcements

```typescript
// Screen reader announcements
<div
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {`Showing ${filteredCount} of ${totalCount} penguins`}
</div>

<div
  aria-live="assertive"
  className="sr-only"
>
  {errorMessage}
</div>
```

### Keyboard Navigation Patterns

- **Tab Order**: Logical flow through filter controls, then main content
- **Skip Links**: Jump to main content, filter controls, visualization
- **Chart Navigation**: Arrow keys for data point selection
- **Modal Management**: Focus trap, return focus on close
- **Filter Shortcuts**: Quick access keys for common filters

### Screen Reader Support

- **Dynamic Descriptions**: Chart descriptions update with filter changes
- **Status Announcements**: Filter changes announced via live regions
- **Form Labels**: All form controls properly labeled
- **Landmark Regions**: Clear page structure with ARIA landmarks
- **Loading States**: Accessible loading and error state communication

---

_These design specifications provide the detailed implementation guidance for creating a cohesive, accessible, and responsive Palmer Penguins Explorer interface._
