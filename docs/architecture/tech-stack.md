# Tech Stack Details

## Versions and Dependencies

### Core

- React: ^18.2.0
- TypeScript: ^5.0.0
- @types/react: ^18.2.0
- @types/react-dom: ^18.2.0

### Routing

- @tanstack/react-router: ^1.109.2
- @tanstack/router-plugin: ^1.109.2

### State and Data

- @tanstack/react-query: ^5.51.23

### UI and Styling

- @strudel-ui/react: (Strudel Kit - MUI 5 based)
- @mui/material: ^5.15.0
- @emotion/react: ^11.11.0
- @emotion/styled: ^11.11.0

### Visualization

- d3: ^7.8.0 (for scales and utilities)
- recharts: ^2.8.0 (or similar for charts)

### Testing

- vitest: ^1.0.0
- @testing-library/react: ^14.0.0
- @testing-library/jest-dom: ^6.0.0
- cypress: ^13.0.0
- vitest-axe: ^8.0.0 (for accessibility)

### Build Tools

- vite: ^5.0.0
- vite-tsconfig-paths: ^4.2.0

### Linting and Formatting

- eslint: ^8.50.0
- @typescript-eslint/eslint-plugin: ^6.10.0
- prettier: ^3.0.0

## Configuration Highlights

### Vite Configuration (vite.config.ts)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [TanStackRouterVite(), react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['@tanstack/react-router', '@tanstack/react-query'],
          ui: ['@strudel-ui/react', '@mui/material'],
        },
      },
    },
  },
});
```

### TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "vite-env.d.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### ESLint Configuration (.eslintrc.json)

```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

## Performance Optimizations

- **Code Splitting**: Route-based and dynamic imports for charts
- **Tree Shaking**: Vite's ES modules for optimal bundling
- **Caching**: React Query's built-in caching with stale-while-revalidate
- **Memoization**: useMemo and useCallback for expensive computations
- **Virtualization**: For large tables (if dataset grows)

## Accessibility Stack

- **axe-core**: Integrated into Vitest for automated WCAG testing
- **React Aria**: Accessible components and focus management
- **Focus Trap**: For modals and overlays
- **Live Regions**: ARIA-live for dynamic content announcements

## Deployment Configuration

### Netlify (netlify.toml)

```toml
[build]
  command = "npm run build"
  functions = "dist/functions"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables

- No runtime env vars (static site)
- Build-time vars for analytics or feature flags if needed
