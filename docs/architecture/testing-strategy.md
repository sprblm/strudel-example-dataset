# Testing Strategy

## Overview

Comprehensive testing strategy ensuring 80% minimum coverage across all code metrics with automated quality gates and accessibility compliance.

## Testing Framework Stack

### Unit Testing

- **Vitest** - Modern, fast test runner with native TypeScript support
- **React Testing Library** - Component testing focused on user interactions
- **jsdom** - Browser environment simulation

### Integration Testing

- **Cypress Component Testing** - Component integration tests
- **Cypress** - Browser-based integration testing

### End-to-End Testing

- **Cypress** - Complete user journey testing
- **Real browser automation** - Chrome, Firefox, Edge support

### Accessibility Testing

- **axe-core** - Automated WCAG 2.1 AA compliance testing
- **cypress-axe** - A11y testing in E2E flows

## Test Configuration

### Vitest Configuration

```typescript
// vitest.config.ts - Modern, fast testing framework
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup/vitest-setup.ts'],
    coverage: {
      reporter: ['text', 'json-summary', 'html'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
```

### Cypress Configuration

```typescript
// cypress.config.ts - E2E and integration testing
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'tests/e2e/support/e2e.ts',
    specPattern: 'tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshotOnRunFailure: false,
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    supportFile: 'tests/e2e/support/component.ts',
    specPattern: 'tests/integration/**/*.cy.{js,jsx,ts,tsx}',
  },
});
```

## Testing Strategy by Layer

### 1. Unit Tests (tests/unit/)

**Focus**: Individual components, hooks, and utilities in isolation

```typescript
// tests/unit/components/FilterPanel.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { TestProviders } from '../../setup/test-providers';

describe('FilterPanel', () => {
  it('renders species filters with correct counts', async () => {
    render(<FilterPanel />, { wrapper: TestProviders });

    expect(screen.getByText('Adelie (152)')).toBeInTheDocument();
    expect(screen.getByText('Chinstrap (68)')).toBeInTheDocument();
    expect(screen.getByText('Gentoo (124)')).toBeInTheDocument();
  });

  it('announces filter changes to screen readers', async () => {
    const { user } = render(<FilterPanel />, { wrapper: TestProviders });

    await user.click(screen.getByLabelText('Adelie'));

    expect(screen.getByRole('status')).toHaveTextContent(
      'Showing 192 of 344 penguins'
    );
  });
});
```

### 2. Integration Tests (tests/integration/)

**Focus**: Component interactions and data flow

```typescript
// tests/integration/filters/filter-synchronization.cy.tsx
describe('Filter Synchronization', () => {
  it('updates URL and data when filters change', () => {
    cy.visit('/table');

    // Change filters
    cy.findByLabelText('Adelie').uncheck();
    cy.findByLabelText('Island').select('Biscoe');

    // Check URL updates
    cy.url().should('include', 'species=chinstrap,gentoo');
    cy.url().should('include', 'island=biscoe');

    // Check data updates
    cy.findByText('Showing 124 of 344 penguins').should('be.visible');

    // Check chart updates
    cy.visit('/visualize/scatter');
    cy.findByRole('img', { name: /scatter plot/i }).should(
      'have.attr',
      'aria-describedby'
    );
  });
});
```

### 3. End-to-End Tests (tests/e2e/)

**Focus**: Complete user workflows and acceptance criteria

```typescript
// tests/e2e/user-flows/data-exploration.cy.ts
describe('Data Exploration Flow', () => {
  it('supports complete data exploration workflow', () => {
    // Start with welcome modal
    cy.visit('/');
    cy.findByRole('dialog', { name: /welcome/i }).should('be.visible');
    cy.findByRole('button', { name: /close/i }).click();

    // Explore table data
    cy.findByRole('columnheader', { name: /species/i }).click();
    cy.findByText('Adelie').should('be.visible');

    // Apply filters
    cy.findByLabelText('Chinstrap').uncheck();
    cy.findByLabelText('Gentoo').uncheck();

    // Switch to visualizations
    cy.findByRole('tab', { name: /visualizations/i }).click();
    cy.findByRole('tab', { name: /scatter plot/i }).click();

    // Configure chart
    cy.findByLabelText('X-Axis').select('Bill Length (mm)');
    cy.findByLabelText('Y-Axis').select('Body Mass (g)');

    // Export visualization
    cy.findByRole('button', { name: /download png/i }).click();
    cy.readFile('cypress/downloads/scatter-plot-*.png').should('exist');
  });
});
```

## Accessibility Testing Integration

### Automated A11y Testing

```typescript
// tests/setup/a11y-setup.ts
import { configureAxe } from 'jest-axe';

const axe = configureAxe({
  rules: {
    // Configure WCAG 2.1 AA compliance
    'color-contrast': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'focus-management': { enabled: true },
    'aria-labels': { enabled: true },
  },
});

// Automated accessibility testing for every component
export const testAccessibility = async (component: RenderResult) => {
  const results = await axe(component.container);
  expect(results).toHaveNoViolations();
};
```

### Component A11y Tests

```typescript
// tests/unit/components/ScatterPlot.test.tsx
import { testAccessibility } from '../../setup/a11y-setup';

describe('ScatterPlot Accessibility', () => {
  it('meets WCAG 2.1 AA standards', async () => {
    const component = render(<ScatterPlot data={mockData} />);
    await testAccessibility(component);
  });

  it('provides keyboard navigation for data points', () => {
    render(<ScatterPlot data={mockData} />);
    const chart = screen.getByRole('img', { name: /scatter plot/i });

    // Test keyboard navigation
    fireEvent.keyDown(chart, { key: 'ArrowRight' });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    fireEvent.keyDown(chart, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
```

## Test Organization

### Directory Structure

```
tests/
├── __fixtures__/           # Test data and mocks
├── unit/                  # Component and hook unit tests
│   ├── components/        # Component-specific tests
│   ├── hooks/            # Hook-specific tests
│   └── utils/            # Utility function tests
├── integration/          # Integration tests
│   ├── filters/          # Filter interaction tests
│   └── visualizations/   # Chart rendering tests
├── e2e/                  # End-to-end user journey tests
│   ├── user-flows/       # Complete user workflows
│   └── accessibility/    # A11y compliance tests
├── performance/          # Performance benchmark tests
└── setup/               # Test configuration and utilities
```

### Test Commands

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run --coverage",
    "test:integration": "cypress run --component",
    "test:e2e": "cypress run",
    "test:a11y": "cypress run --spec 'tests/e2e/accessibility/**/*'",
    "test:all": "npm run test:unit && npm run test:integration && npm run test:e2e"
  }
}
```

## Quality Gates

### Coverage Requirements

- **Branches**: 80% minimum
- **Functions**: 80% minimum
- **Lines**: 80% minimum
- **Statements**: 80% minimum

### Accessibility Standards

- **WCAG 2.1 AA compliance**: 100% required
- **Zero axe violations**: Enforced on every component
- **Keyboard navigation**: Full coverage required
- **Screen reader compatibility**: Tested with announcements

### Performance Criteria

- **Unit tests**: Complete in < 30 seconds
- **Integration tests**: Complete in < 2 minutes
- **E2E tests**: Complete in < 5 minutes
- **Bundle analysis**: Automated size regression detection

## Continuous Integration

Tests run automatically on:

- **Every pull request** - Unit, integration, and accessibility tests
- **Main branch pushes** - Full test suite including E2E
- **Nightly schedule** - Performance regression testing
- **Pre-deployment** - Smoke tests on staging environment
