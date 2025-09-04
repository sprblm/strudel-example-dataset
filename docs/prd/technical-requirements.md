# Technical Requirements

## Architecture

- **Framework:** React with Strudel Kit components
- **Build Tool:** Vite
- **State Management:** Zustand
- **Routing:** React Router for URL state
- **Styling:** Strudel Design System + CSS Modules
- **Charts:** Strudel Chart components

## Performance Requirements

- Initial load: < 2 seconds on 3G
- Filter updates: < 100ms
- Chart renders: < 300ms
- No cumulative layout shift
- Bundle size: < 500KB gzipped

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Basic functionality on mobile browsers

## Accessibility Standards

- WCAG 2.1 Level AA compliance
- Keyboard navigation for all interactions
- Screen reader tested (NVDA, JAWS, VoiceOver)
- Color contrast ratios meet standards
- No reliance on color alone

## Data Requirements

- Palmer Penguins dataset (344 records)
- Bundled as JSON with build
- Preprocessing for missing values
- Type definitions for TypeScript

## Deployment

- Static site hosting (GitHub Pages/Netlify)
- Automated deployment on main branch
- Preview deployments for PRs
- Public repository with MIT license
