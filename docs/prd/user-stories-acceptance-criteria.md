# User Stories & Acceptance Criteria

## Epic 1: Data Loading & Display

**US1.1: As a user, I want to see the Palmer Penguins data in a table**

- **Acceptance Criteria:**
  - Table displays all 344 penguins with columns: species, island, bill_length_mm, bill_depth_mm, flipper_length_mm, body_mass_g, sex, year
  - Missing values displayed as "—" (em dash)
  - Table uses Strudel Table component
  - Sortable columns with visual indicators
  - Responsive horizontal scroll on mobile
  - Screen reader announces table structure

**US1.2: As a user, I want to understand what I'm looking at**

- **Acceptance Criteria:**
  - Welcome modal appears on first visit
  - Modal includes: dataset description, variable definitions, data attribution
  - "Don't show again" option (localStorage)
  - Accessible modal with focus trap
  - Can be reopened from help menu

## Epic 2: Filtering System

**US2.1: As a user, I want to filter penguins by species**

- **Acceptance Criteria:**
  - Three checkboxes: Adelie, Chinstrap, Gentoo
  - All selected by default
  - Updates affect table and all visualizations
  - Filter state reflected in URL
  - Keyboard navigable checkboxes
  - Screen reader announces selection changes

**US2.2: As a user, I want to filter by island**

- **Acceptance Criteria:**
  - Dropdown/select with options: All, Biscoe, Dream, Torgersen
  - "All" selected by default
  - Instant filtering on selection
  - Clear visual feedback of active filter

**US2.3: As a user, I want to filter by sex**

- **Acceptance Criteria:**
  - Radio buttons: All, Male, Female
  - Handles missing sex values appropriately
  - Mutually exclusive selection

**US2.4: As a user, I want to clear all filters quickly**

- **Acceptance Criteria:**
  - "Clear filters" button visible when any filter active
  - Shows count of active filters
  - Single click resets all filters
  - Announces action to screen readers

## Epic 3: Data Visualization

**US3.1: As a user, I want to explore relationships with scatter plots**

- **Acceptance Criteria:**
  - X/Y axis dropdowns for any numeric column
  - Points colored by species using Strudel palette
  - Hover shows exact values and penguin details
  - Legend toggles species visibility
  - Responsive sizing with min/max dimensions
  - Alternative text describes the visualization

**US3.2: As a user, I want to see distributions with histograms**

- **Acceptance Criteria:**
  - Dropdown to select variable
  - Species shown as overlapping distributions
  - Adjustable bin size (5, 10, 20 bins)
  - Y-axis shows count
  - Clear color/pattern distinction for species

**US3.3: As a user, I want to compare distributions with box plots**

- **Acceptance Criteria:**
  - Shows quartiles, median, outliers
  - Grouped by species
  - Variable selection dropdown
  - Hover shows exact statistics
  - Handles missing values gracefully

## Epic 4: Accessibility & Usability

**US4.1: As a keyboard user, I want full keyboard navigation**

- **Acceptance Criteria:**
  - Tab order follows logical flow
  - All interactive elements reachable
  - Visual focus indicators meet WCAG standards
  - Skip to main content link
  - Keyboard shortcuts: / focuses search, ? opens help, Esc closes modals
  - Escape closes modals/dropdowns

**US4.2: As a screen reader user, I want appropriate announcements**

- **Acceptance Criteria:**
  - Live regions announce filter changes
  - Chart descriptions update with data
  - Form controls properly labeled
  - Landmark regions defined
  - Loading states announced

**US4.3: As a mobile user, I want a responsive experience**

- **Acceptance Criteria:**
  - Single column layout below 768px
  - Touch-friendly tap targets (44x44px min)
  - Card-based layout for table data
  - Collapsible filter panel
  - Charts resize appropriately

## Epic 5: Data Export & Sharing

**US5.1: As a user, I want to save visualizations**

- **Acceptance Criteria:**
  - "Download as PNG" button for each chart
  - Filename includes chart type and date
  - Includes title and axis labels
  - Resolution suitable for presentations

**US5.2: As a user, I want to share my filtered view**

- **Acceptance Criteria:**
  - URL structure: /visualize/[chartType]?[filters] (e.g., /visualize/scatter?x=bill_length&y=body_mass)
  - Copy URL button with confirmation
  - Loading shared URL restores exact state
  - Social sharing preview metadata
