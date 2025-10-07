# Coding Standards

## General Principles

- Strict adherence to TypeScript (strict mode enabled)
- Consistent component structure (props → state → handlers → JSX)
- Minimal side effects in components

## Formatting

- Prettier rules:
  ```json
  {
    "semi": false,
    "singleQuote": true,
    "trailingComma": "es5"
  }
  ```
- ESLint (Airbnb style):
  - No implicit any (`@typescript-eslint/no-explicit-any`)
  - Enforce consistent imports
  - Require JSDoc for public APIs

## UI Patterns

- MUI conventions:
  - Use `sx` prop for one-off styles
  - Theme-based responsive helpers
  - Consistent spacing scale (theme.spacing)
- Component naming:
  - `PascalCase` for components
  - `kebab-case` for custom data attributes
    - Example: `data-testid="clear-filters-button"`
