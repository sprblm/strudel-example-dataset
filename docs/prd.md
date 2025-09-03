# Product Requirements Document: Palmer Penguins Explorer

**Version:** 1.0  
**Date:** September 2025  
**Status:** Demo/Prototype

## Executive Summary

Palmer Penguins Explorer is a demonstration application showcasing Strudel Kit's capabilities for building accessible scientific data exploration tools. This 30-day prototype will serve as both a functional tool for biology education and a reference implementation for developers.

## Product Overview

### Vision

Create a best-in-class demonstration of how modern, accessible data exploration tools can be built rapidly using Strudel Kit components.

### Success Criteria

- Functional data explorer deployed within 30 days
- Zero accessibility barriers (WCAG 2.1 AA compliant)
- Clean, documented codebase suitable for learning
- Genuine utility for biology students/educators

### Non-Goals (Out of Scope)

- Statistical analysis beyond basic summaries
- Multi-dataset comparison
- User authentication or data persistence
- Server-side processing
- Custom theming engine

## User Stories & Acceptance Criteria

### Epic 1: Data Loading & Display

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

### Epic 2: Filtering System

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

### Epic 3: Data Visualization

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

### Epic 4: Accessibility & Usability

**US4.1: As a keyboard user, I want full keyboard navigation**

- **Acceptance Criteria:**
  - Tab order follows logical flow
  - All interactive elements reachable
  - Visual focus indicators meet WCAG standards
  - Skip to main content link
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
  - Horizontal scroll for table
  - Collapsible filter panel
  - Charts resize appropriately

### Epic 5: Data Export & Sharing

**US5.1: As a user, I want to save visualizations**

- **Acceptance Criteria:**
  - "Download as PNG" button for each chart
  - Filename includes chart type and date
  - Includes title and axis labels
  - Resolution suitable for presentations

**US5.2: As a user, I want to share my filtered view**

- **Acceptance Criteria:**
  - URL updates with filter state
  - Copy URL button with confirmation
  - Loading shared URL restores exact state
  - Social sharing preview metadata

## Technical Requirements

### Architecture

- **Framework:** React with Strudel Kit components
- **Build Tool:** Vite
- **State Management:** React Context or Zustand
- **Routing:** React Router for URL state
- **Styling:** Strudel Design System + CSS Modules
- **Charts:** Strudel Chart components (or D3 if needed)

### Performance Requirements

- Initial load: < 2 seconds on 3G
- Filter updates: < 100ms
- Chart renders: < 300ms
- No cumulative layout shift
- Bundle size: < 500KB gzipped

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Basic functionality on mobile browsers

### Accessibility Standards

- WCAG 2.1 Level AA compliance
- Keyboard navigation for all interactions
- Screen reader tested (NVDA, JAWS, VoiceOver)
- Color contrast ratios meet standards
- No reliance on color alone

### Data Requirements

- Palmer Penguins dataset (344 records)
- Bundled as JSON with build
- Preprocessing for missing values
- Type definitions for TypeScript

### Deployment

- Static site hosting (GitHub Pages/Netlify)
- Automated deployment on main branch
- Preview deployments for PRs
- Public repository with MIT license

## Development Milestones

### Milestone 1: Foundation (Days 1-7)

- Project setup and configuration
- Data loading and table display
- Basic filtering implementation
- Responsive layout structure

### Milestone 2: Visualizations (Days 8-14)

- Scatter plot with controls
- Histogram implementation
- Interactive features (hover, tooltips)
- Filter integration with charts

### Milestone 3: Enhanced Features (Days 15-21)

- Box plot visualization
- Export functionality
- URL state management
- Mobile optimizations

### Milestone 4: Polish & Launch (Days 22-30)

- Accessibility audit and fixes
- Welcome tour implementation
- Documentation and code cleanup
- Deployment and announcement

## Risk Mitigation

### Technical Risks

- **Strudel Kit limitations:** Have D3 fallback ready
- **Performance with filters:** Use React.memo and debouncing
- **Browser compatibility:** Progressive enhancement approach

### Scope Risks

- **Feature creep:** Strict adherence to PRD
- **Time constraints:** Core features first, enhancements if time permits

## Success Metrics

### Launch Metrics

- [ ] All P0 user stories complete
- [ ] Zero critical accessibility issues
- [ ] Page loads under 2 seconds
- [ ] Works on 2 mobile devices tested

### Post-Launch Goals (First 30 Days)

- 20+ GitHub stars
- 3+ community forks
- 1+ classroom adoption
- 90%+ positive user feedback

## Appendix: Design Specifications

### Information Architecture

```
Home
├── Data Table View
├── Visualizations
│   ├── Scatter Plot
│   ├── Histogram
│   └── Box Plot
├── Filters Panel
├── Help Modal
└── Export Options
```

### Component Hierarchy

- App
  - Header (Strudel AppBar)
  - FilterPanel
    - SpeciesFilter
    - IslandFilter
    - SexFilter
  - MainContent
    - DataTable (Strudel Table)
    - VisualizationPanel
      - ChartControls
      - Chart (Scatter/Histogram/BoxPlot)
  - WelcomeModal
  - ExportMenu
