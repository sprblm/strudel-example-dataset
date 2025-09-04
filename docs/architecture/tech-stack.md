# Tech Stack & Decisions

## Core Architecture Decisions

**State Management**: Zustand for filters/data, React state for UI (simpler than Context)  
**Routing**: React Router v6 with tabs as routes (/table, /visualize/[chartType])  
**Data Pipeline**: Static JSON → Zustand → Memoized selectors → Components  
**Component Library**: Strudel Kit components with custom chart wrappers  
**Accessibility**: React Aria Live for announcements, focus trap for modals  
**Testing**: Vitest + React Testing Library for unit tests, Cypress for E2E  
**CI/CD**: GitHub Actions for automated testing, building, and deployment  
**Error Handling**: Layered error boundaries with graceful degradation and recovery

## Technology Stack

### Frontend Framework

- **React 18** with TypeScript
- **Vite** as build tool for fast development and optimized production builds
- **React Router v6** for client-side routing with URL state management

### State Management

- **Zustand** for global state (filters, data)
- **React built-in state** for component-local UI state
- **Memoized selectors** for performance optimization

### UI Framework

- **Strudel Kit** as primary component library
- **CSS Modules** for component-specific styling
- **Strudel Design System** tokens for consistent theming

### Data Visualization

- **D3.js utilities** for scales, axes, and data transformations
- **Custom React chart components** wrapping D3 functionality
- **Canvas/SVG rendering** for performance with large datasets

### Development Tools

- **TypeScript** for type safety and developer experience
- **ESLint + Prettier** for code quality and formatting
- **Vitest** for unit testing with modern, fast test runner
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
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.0.0",
    "zustand": "^4.0.0",
    "@strudel-ui/react": "latest",
    "d3-scale": "^4.0.0",
    "d3-selection": "^3.0.0",
    "html2canvas": "^1.4.1",
    "file-saver": "^2.0.5"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vitest": "^0.34.0",
    "@testing-library/react": "^13.0.0",
    "cypress": "^13.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

## Browser Support

- **Chrome 90+**
- **Firefox 88+**
- **Safari 14+**
- **Edge 90+**
- **Mobile browsers** with progressive enhancement
