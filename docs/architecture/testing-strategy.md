# Testing Strategy

## Pyramid Distribution

- **Unit (70%)**: Vitest + React Testing Library
  - Component isolation
  - Custom hooks
  - Utility functions
- **Integration (20%)**: Cypress Component Testing
  - Context API interactions
  - State management flows
  - Complex component compositions
- **E2E (10%)**: Cypress
  - User journey validation
  - Critical path tests

## Validation Requirements

| Type              | Tool       | Coverage Target          | Notes                     |
| ----------------- | ---------- | ------------------------ | ------------------------- |
| **Function**      | Vitest     | 85% line coverage        | Critical paths 100%       |
| **Accessibility** | axe-core   | WCAG 2.1 AA compliance   | Manual + automated checks |
| **A11y**          | axe-core   | Zero critical violations | Run in all test levels    |
| **Performance**   | Lighthouse | ≥90 performance score    | CI smoke tests            |

## File Locations

- Unit tests: `tests/unit/**`
- Integration tests: `tests/integration/**`
- E2E tests: `cypress/e2e/**`

## Requirements

- All PRs require:
  - Passing unit tests
  - Zero critical axe violations
  - Lint compliance
- New features require:
  - AC-specific scenario tests
  - Accessibility validation
  - Performance baseline
