# Tech Stack & Decisions

## Core Architecture Decisions

**State Management**: React Query for data fetching/caching, Context API for app state  
**Routing**: TanStack Router for type-safe routing with params (/table, /visualize/[chartType])  
**Data Pipeline**: Static JSON → React Query → Memoized selectors → Components  
**Component Library**: MUI v5 components with custom chart wrappers  
**Accessibility**: React Aria Live for announcements, focus trap for modals  
**Testing**: Vitest + React Testing Library for unit tests, Cypress for E2E  
**CI/CD**: GitHub Actions for automated testing, building, and deployment  
**Error Handling**: Layered error boundaries with graceful degradation and recovery

## Technology Stack

### Frontend Framework

- **React 18** with TypeScript
- **Vite** as build tool for fast development and optimized production builds
- **TanStack Router** for type-safe client-side routing with URL state management

### State Management

- **React Query** for server state management (data fetching, caching)
- **Context API** for global app state (filters, UI state)
- **React built-in state** for component-local UI state
- **Memoized selectors** for performance optimization

### UI Framework

- **MUI v5** as primary component library (@mui/material, @mui/x-data-grid)
- **Emotion** for CSS-in-JS styling (built into MUI)
- **MUI theme system** for consistent theming and design tokens

### Data Visualization

- **Plotly.js** with react-plotly.js wrapper for interactive charts
- **D3-fetch** for data loading and processing utilities
- **Canvas/WebGL rendering** via Plotly for performance with large datasets

### Development Tools

- **TypeScript** for type safety and developer experience
- **ESLint + Prettier** for code quality and formatting
- **Jest** for unit testing (already configured in project)
- **React Testing Library** for component testing
- **Cypress** for end-to-end testing

### Build & Deployment

- **Vite build system** with optimized production bundles
- **GitHub Actions** for CI/CD automation
- **Netlify** for static site hosting and CDN
- **Performance budgets** enforced via Lighthouse CI

## Architecture Principles

### 1. Performance First

- Bundle splitting for optimal loading
- Lazy loading for chart components
- Memoization for expensive computations
- Debounced updates for smooth interactions

### 2. Accessibility By Design

- WCAG 2.1 AA compliance from the start
- Keyboard navigation for all interactions
- Screen reader announcements via live regions
- High contrast and focus indicators

### 3. Developer Experience

- TypeScript for better IDE support and error catching
- Comprehensive testing strategy
- Hot module replacement for fast development
- Clear component and folder organization

### 4. Maintainability

- Single responsibility principle for components
- Clear separation of concerns (UI, state, business logic)
- Consistent patterns and naming conventions
- Comprehensive documentation and comments

## Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-router": "^1.109.2",
    "@tanstack/react-query": "^5.51.23",
    "@mui/material": "^5.15.14",
    "@mui/x-data-grid": "^7.0.0",
    "@emotion/react": "^11.11.4",
    "@emotion/styled": "^11.11.0",
    "plotly.js": "^2.30.1",
    "react-plotly.js": "^2.6.0",
    "d3-fetch": "^3.0.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "jest": "^29.7.0",
    "@testing-library/react": "^16.3.0",
    "cypress": "^13.15.0",
    "eslint": "^8.57.0",
    "prettier": "^3.3.3"
  }
}
```

## Browser Support

- **Chrome 90+**
- **Firefox 88+**
- **Safari 14+**
- **Edge 90+**
- **Mobile browsers** with progressive enhancement
