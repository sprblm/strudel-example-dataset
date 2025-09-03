# Front-End Specification: Palmer Penguins Explorer

## 1. USER FLOWS

### Flow 1: Developer Evaluating Strudel Kit

```
START → Welcome Modal → Explore Demo
  ├─→ View Data Table
  │   ├─→ Sort Columns
  │   └─→ Notice Strudel Components
  ├─→ Apply Filters
  │   ├─→ Toggle Species (Checkboxes)
  │   ├─→ Select Island (Dropdown)
  │   └─→ Filter by Sex (Radio)
  ├─→ Switch to Visualizations
  │   ├─→ Try Scatter Plot
  │   │   ├─→ Change X/Y Axes
  │   │   └─→ Hover for Details
  │   ├─→ View Histogram
  │   │   └─→ Adjust Bins
  │   └─→ Explore Box Plot
  ├─→ Test Accessibility
  │   ├─→ Tab Navigation
  │   └─→ Screen Reader
  └─→ Export/Share
      ├─→ Download Chart PNG
      └─→ Copy Shareable URL → END
```

### Flow 2: Biology Student Analyzing Data

```
START → Welcome Modal (Learn Dataset)
  ├─→ View All Penguins (Table)
  ├─→ Filter to Specific Species
  │   └─→ Compare Islands
  ├─→ Create Scatter Plot
  │   ├─→ Bill Length vs Depth
  │   └─→ Identify Patterns
  ├─→ View Distribution (Histogram)
  │   └─→ Compare Species
  └─→ Export Visualization
      └─→ Use in Report → END
```

### Flow 3: Educator Preparing Lesson

```
START → Direct URL (Pre-filtered)
  ├─→ Review Filtered View
  ├─→ Create Visualization
  │   └─→ Box Plot by Species
  ├─→ Toggle Filter Demo
  │   └─→ Show Data Changes
  └─→ Share URL with Class → END
```

### Flow 4: Accessibility User with Screen Reader

```
START → Skip to Main Content
  ├─→ Navigate by Headings
  ├─→ Interact with Filters
  │   └─→ Hear Filter Announcements
  ├─→ Table Navigation
  │   └─→ Hear Data Summary
  └─→ Chart Alternative Text → END
```

## 2. WIREFRAMES

### Desktop Layout (1200px+)

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Logo] Palmer Penguins Explorer            [Help] [Export] [Share]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ ┌─────────────┐ ┌─────────────────────────────────────────────┐  │
│ │  FILTERS    │ │  DATA VIEW    [Table] [Visualize ▼]         │  │
│ │             │ │                                              │  │
│ │ Species:    │ │  ┌────────────────────────────────────────┐ │  │
│ │ ☑ Adelie   │ │  │                                        │ │  │
│ │ ☑ Chinstrap│ │  │        Main Content Area               │ │  │
│ │ ☑ Gentoo   │ │  │        (Table or Charts)               │ │  │
│ │             │ │  │                                        │ │  │
│ │ Island:     │ │  │  Table View:                          │ │  │
│ │ [All     ▼] │ │  │  ┌──┬──────┬────────┬──────┬────┐   │ │  │
│ │             │ │  │  │# │Species│Island  │Bill L│... │   │ │  │
│ │ Sex:        │ │  │  ├──┼──────┼────────┼──────┼────┤   │ │  │
│ │ ◉ All      │ │  │  │1 │Adelie │Torgers.│ 39.1 │... │   │ │  │
│ │ ○ Male     │ │  │  │2 │Adelie │Torgers.│ 39.5 │... │   │ │  │
│ │ ○ Female   │ │  │  └──┴──────┴────────┴──────┴────┘   │ │  │
│ │             │ │  │                                        │ │  │
│ │ [Clear All] │ │  │  Showing 344 of 344 penguins         │ │  │
│ │             │ │  └────────────────────────────────────────┘ │  │
│ │ Filters: 0  │ │                                              │  │
│ └─────────────┘ └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Visualization View

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Logo] Palmer Penguins Explorer            [Help] [Export] [Share]  │
├─────────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────────────────────────────────────┐  │
│ │  FILTERS    │ │  VISUALIZATION  [Scatter] [Histogram] [Box] │  │
│ │  (same)     │ │                                              │  │
│ │             │ │  Chart Controls:                             │  │
│ │             │ │  X-Axis: [Bill Length ▼]  Y-Axis: [Mass ▼] │  │
│ │             │ │                                              │  │
│ │             │ │  ┌────────────────────────────────────────┐ │  │
│ │             │ │  │          Scatter Plot Canvas          │ │  │
│ │             │ │  │                                        │ │  │
│ │             │ │  │     •  • ••                           │ │  │
│ │             │ │  │    •• •• • •                          │ │  │
│ │             │ │  │   • • •• ••• •                       │ │  │
│ │             │ │  │    •• • •• • •                       │ │  │
│ │             │ │  │     • •• • •                         │ │  │
│ │             │ │  │                                        │ │  │
│ │             │ │  └────────────────────────────────────────┘ │  │
│ │             │ │                                              │  │
│ │             │ │  Legend: ● Adelie ● Chinstrap ● Gentoo     │  │
│ │             │ │  [Download PNG]                             │  │
│ └─────────────┘ └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Tablet Layout (768px - 1199px)

```
┌─────────────────────────────────────────┐
│ ☰ Palmer Penguins    [Help][Export][↗] │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ ▼ FILTERS (Collapsible)            │ │
│ ├─────────────────────────────────────┤ │
│ │ Species: ☑ Adelie ☑ Chin. ☑ Gentoo│ │
│ │ Island: [All ▼]  Sex: ◉ All       │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │     [Table] [Charts]               │ │
│ │                                     │ │
│ │     Content Area                    │ │
│ │     (Scrollable)                    │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Mobile Layout (<768px)

```
┌─────────────────┐
│ ☰ Penguins   ↗ │
├─────────────────┤
│ [▼ Filters (2)] │
├─────────────────┤
│ Tabs:           │
│ [Data][Charts]  │
├─────────────────┤
│                 │
│  Content        │
│  (Full Width)   │
│                 │
│  Horizontal     │
│  scroll for     │
│  table          │
│                 │
└─────────────────┘
```

## 3. INTERACTION SPECIFICATIONS

### Filter Interactions

#### Species Checkboxes

```
State Flow:
Initial → All Selected → User Unchecks One → Update URL → Debounce 300ms → Update Data

Visual Feedback:
- Checkbox: Strudel primary color when checked
- Transition: 200ms ease-in-out
- Focus: 2px offset outline
- Hover: 10% darker background

Announcements:
"Adelie penguins deselected. Showing 148 penguins."
```

#### Data Updates

```
Filter Change Sequence:
1. User interaction
2. Update local state immediately
3. Show loading skeleton on charts
4. Debounce 300ms
5. Update URL params
6. Recalculate filtered data
7. Announce result count
8. Fade in new visualization (200ms)
```

### Chart Interactions

#### Hover States

```
Scatter Plot Point:
- Scale: 1.2x on hover
- Stroke: 2px white outline
- Tooltip: Show after 100ms
- Content: Species, measurements, island

Tooltip Positioning:
- Default: Top-right of cursor
- Edge detection: Flip to opposite side
- Mobile: Fixed bottom sheet
```

#### Loading States

```
Skeleton Patterns:
┌─────────────────────┐
│ ░░░░░░░░░░░░░░░░░░ │ <- Animated gradient
│ ░░░░ ░░░░░ ░░░░░░░ │    shimmer effect
│ ░░░░░░░░░░░░░░░░░░ │
└─────────────────────┘

Timing:
- Show after 100ms delay
- Minimum display: 300ms
- Fade out: 200ms
```

## 4. VISUAL DESIGN GUIDELINES

### Color System

```css
/* Strudel Kit Core Palette */
--strudel-primary: #2e5090; /* Primary Blue */
--strudel-secondary: #4a7b7c; /* Teal */
--strudel-tertiary: #f4a15d; /* Orange */

/* Species Colors (Accessible) */
--species-adelie: #ff6b6b; /* Warm Red */
--species-chinstrap: #4ecdc4; /* Teal */
--species-gentoo: #95a3b3; /* Blue Gray */

/* UI Colors */
--background: #ffffff;
--surface: #f8f9fa;
--border: #e5e7eb;
--text-primary: #1f2937;
--text-secondary: #6b7280;
--text-muted: #9ca3af;

/* State Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

### Typography

```css
/* Font Stack */
--font-family:
  'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;

/* Type Scale */
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Spacing System

```css
/* 8px Base Grid */
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-5: 1.25rem; /* 20px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-10: 2.5rem; /* 40px */
--space-12: 3rem; /* 48px */
--space-16: 4rem; /* 64px */
```

### Component Styling

```css
/* Cards */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: var(--space-6);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Buttons */
.button-primary {
  background: var(--strudel-primary);
  color: white;
  padding: var(--space-2) var(--space-4);
  border-radius: 6px;
  font-weight: var(--font-medium);
  transition: all 200ms ease-in-out;
}

/* Form Controls */
.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--strudel-primary);
  border-radius: 4px;
}
```

## 5. COMPONENT SPECIFICATIONS

### FilterPanel Component

```typescript
interface FilterPanelProps {
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

interface FilterPanelState {
  isCollapsed: boolean;
  activeFilterCount: number;
}

// Behavior Specifications:
// - Collapsible on mobile via prop
// - Shows active filter count badge
// - Announces filter changes to screen readers
// - Persists collapsed state in sessionStorage
// - Keyboard shortcut: Cmd/Ctrl + F to focus
```

### DataTable Component

```typescript
interface DataTableProps {
  data: Penguin[];
  className?: string;
  onRowClick?: (penguin: Penguin) => void;
}

interface TableColumn {
  key: keyof Penguin;
  label: string;
  sortable: boolean;
  format?: (value: any) => string;
  align?: 'left' | 'right' | 'center';
  width?: string;
}

// Features:
// - Sortable columns with indicators
// - Alternating row colors
// - Responsive horizontal scroll
// - Empty state message
// - Loading skeleton rows
// - Keyboard navigation between rows
```

### ScatterPlot Component

```typescript
interface ScatterPlotProps {
  data: Penguin[];
  xField: NumericField;
  yField: NumericField;
  colorBySpecies: boolean;
  dimensions?: { width: number; height: number };
  onPointClick?: (penguin: Penguin) => void;
}

interface ScatterPlotState {
  hoveredPoint: Penguin | null;
  selectedSpecies: Set<Species>;
  tooltipPosition: { x: number; y: number };
}

// Interaction Behaviors:
// - Hover: Scale point 1.2x, show tooltip
// - Click: Toggle species visibility
// - Keyboard: Arrow keys navigate points
// - Touch: Tap to show/hide tooltip
// - Zoom: Pinch gesture on mobile
// - Pan: Drag on mobile/desktop
```

### Histogram Component

```typescript
interface HistogramProps {
  data: Penguin[];
  field: NumericField;
  binCount: 5 | 10 | 20;
  showDensity: boolean;
  splitBySpecies: boolean;
}

// Visual Specifications:
// - Overlapping translucent bars by species
// - Y-axis: Count or density
// - Bin edges clearly marked
// - Interactive legend
// - Hover shows exact count/range
```

### ChartTooltip Component

```typescript
interface TooltipProps {
  visible: boolean;
  x: number;
  y: number;
  data: {
    species: Species;
    [key: string]: any;
  };
}

// Positioning Logic:
// 1. Check viewport boundaries
// 2. Flip horizontal if too close to edge
// 3. Flip vertical if too close to bottom
// 4. Mobile: Fixed position bottom sheet
// 5. Arrow pointing to data point
```

## 6. RESPONSIVE DESIGN

### Breakpoint System

```css
/* Breakpoints */
--mobile: 0px;
--tablet: 768px;
--desktop: 1024px;
--wide: 1280px;

/* Container Widths */
--container-mobile: 100%;
--container-tablet: 750px;
--container-desktop: 1000px;
--container-wide: 1200px;
```

### Mobile Adaptations

```css
/* Filter Panel */
@media (max-width: 767px) {
  .filter-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid var(--border);
    max-height: 50vh;
    overflow-y: auto;
    transform: translateY(100%);
    transition: transform 300ms ease-out;
  }

  .filter-panel.open {
    transform: translateY(0);
  }
}

/* Table */
@media (max-width: 767px) {
  .data-table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .data-table {
    min-width: 600px;
  }
}

/* Charts */
@media (max-width: 767px) {
  .chart-container {
    height: 300px; /* Fixed height */
    margin: var(--space-4) calc(var(--space-4) * -1);
  }

  .chart-controls {
    flex-direction: column;
    gap: var(--space-2);
  }
}
```

### Touch Interactions

```typescript
// Touch-specific behaviors
const touchHandlers = {
  onTouchStart: (e: TouchEvent) => {
    // Store initial touch point
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  },

  onTouchMove: (e: TouchEvent) => {
    // Calculate delta for pan/swipe
    const delta = {
      x: e.touches[0].clientX - touchStart.x,
      y: e.touches[0].clientY - touchStart.y,
    };

    // Horizontal swipe to change chart type
    if (Math.abs(delta.x) > 50 && Math.abs(delta.y) < 20) {
      navigateChart(delta.x > 0 ? 'prev' : 'next');
    }
  },

  onTouchEnd: (e: TouchEvent) => {
    // Tap to show tooltip
    if (touchDuration < 200) {
      showTooltipAtPoint(e.changedTouches[0]);
    }
  },
};
```

## 7. ACCESSIBILITY REQUIREMENTS

### WCAG 2.1 AA Compliance

#### Keyboard Navigation Map

```
Tab Order:
1. Skip to main content
2. Help button
3. Export button
4. Share button
5. Filter panel
   a. Species checkboxes
   b. Island dropdown
   c. Sex radio buttons
   d. Clear filters button
6. View toggle (Table/Charts)
7. Main content area
   - Table: Column headers → Cells
   - Charts: Controls → Legend → Chart
```

#### Screen Reader Announcements

```typescript
// Filter changes
announce('2 species selected. Showing 237 penguins.');

// Chart updates
announce('Scatter plot updated. Bill length vs body mass for 237 penguins.');

// Data loading
announce('Loading penguin data...');
announce('Data loaded. 344 penguins displayed.');

// Errors
announce('Error: Unable to load data. Please refresh the page.');
```

#### ARIA Patterns

```html
<!-- Filter Panel -->
<section role="region" aria-label="Data filters" aria-live="polite">
  <h2 id="filter-heading">Filters</h2>
  <div role="group" aria-labelledby="species-label">
    <span id="species-label">Species</span>
    <input type="checkbox" id="adelie" aria-describedby="filter-status" />
    <label for="adelie">Adelie</label>
  </div>
  <div id="filter-status" role="status" aria-live="polite">
    2 filters active
  </div>
</section>

<!-- Data Table -->
<table
  role="table"
  aria-label="Palmer Penguins dataset"
  aria-rowcount="344"
  aria-describedby="table-caption"
>
  <caption id="table-caption">
    Showing 344 penguins. Click column headers to sort.
  </caption>
</table>

<!-- Charts -->
<figure role="img" aria-label="Scatter plot of bill length vs body mass">
  <div id="chart-description" class="sr-only">
    This scatter plot shows the relationship between bill length and body mass
    for 344 penguins, colored by species. Adelie penguins (red) cluster in the
    lower left...
  </div>
</figure>
```

#### Focus Management

```typescript
// Modal focus trap
const focusableElements = modal.querySelectorAll(
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
);

const firstElement = focusableElements[0];
const lastElement = focusableElements[focusableElements.length - 1];

modal.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
});
```

#### Color Contrast Requirements

```css
/* Minimum contrast ratios */
/* Normal text: 4.5:1 */
/* Large text: 3:1 */
/* UI components: 3:1 */

/* Example validations */
--text-on-primary: #ffffff; /* 7.2:1 on primary blue */
--text-on-surface: #1f2937; /* 15.8:1 on surface */
--border-color: #d1d5db; /* 3.1:1 on white */
```

### Assistive Technology Support

```typescript
// Chart alternative descriptions
const generateChartDescription = (
  data: Penguin[],
  xField: string,
  yField: string
) => {
  const summary = calculateSummaryStats(data);

  return `
    This ${chartType} shows ${data.length} penguins.
    ${xField} ranges from ${summary[xField].min} to ${summary[xField].max}.
    ${yField} ranges from ${summary[yField].min} to ${summary[yField].max}.
    
    By species:
    - Adelie: ${summary.bySpecies.Adelie.count} penguins
    - Chinstrap: ${summary.bySpecies.Chinstrap.count} penguins  
    - Gentoo: ${summary.bySpecies.Gentoo.count} penguins
    
    ${generateTrendDescription(data, xField, yField)}
  `;
};
```

### Error Handling & Recovery

```typescript
// Graceful degradation
const ErrorBoundary: React.FC = ({ children }) => {
  if (error) {
    return (
      <div role="alert" className="error-state">
        <h2>Unable to display visualization</h2>
        <p>The data is still available in table format below.</p>
        <button onClick={retry}>Try Again</button>
        <DataTable data={data} />
      </div>
    );
  }
  return children;
};
```

This comprehensive specification provides the detailed guidance needed to build an accessible, responsive, and user-friendly Palmer Penguins Explorer that showcases Strudel Kit's capabilities while serving real educational needs.
