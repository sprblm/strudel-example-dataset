# Project Brief: Palmer Penguins Explorer - Strudel Kit Demo

## 1. Problem Statement

### The Demo Gap

We need a compelling demonstration of Strudel Kit's capabilities for building scientific data exploration tools. The Palmer Penguins dataset provides an ideal, approachable dataset that showcases data filtering, visualization, and accessibility features without requiring domain expertise.

### Demo Goals

- Showcase Strudel Kit's component library and design patterns
- Demonstrate rapid development of accessible data tools
- Provide a realistic example others can learn from and extend
- Create something genuinely useful for the biology/data science community

## 2. Target Users (Simplified)

### Primary Demo Audience

1. **Developers evaluating Strudel Kit** - Need to see real-world patterns
2. **Biology students/educators** - Benefit from the actual tool

### Secondary Audience

3. **Stakeholders/Funders** - Need to see the potential impact
4. **Accessibility advocates** - Want to verify inclusive design

## 3. Core Features (30-Day Scope)

### Week 1-2: Foundation

- **Data Management**

  - Load Palmer Penguins dataset (344 rows)
  - Handle missing values gracefully
  - Basic data table view with Strudel Table component

- **Filtering System**
  - Species checkboxes (Adelie, Chinstrap, Gentoo)
  - Island selection (Biscoe, Dream, Torgersen)
  - Sex filter with "all" option
  - Clear all filters button
  - Show active filter count

### Week 2-3: Visualizations

- **Three Core Chart Types**
  - Scatter plot (any two numeric variables)
  - Histogram with species overlay
  - Box plot for distributions
- **Interactivity**
  - Hover tooltips with exact values
  - Click to highlight species
  - Responsive sizing
  - Strudel's accessible color palette

### Week 3-4: Polish & Accessibility

- **Accessibility Features**

  - Keyboard navigation throughout
  - Screen reader announcements
  - Skip to main content link
  - Alternative text for all charts
  - Data table fallback view

- **User Experience**
  - Welcome modal with dataset info
  - Guided tour highlighting features
  - Export chart as PNG
  - Shareable URL for filtered state
  - Mobile-responsive layout

### If Time Permits

- Comparison mode (side-by-side species)
- CSV data download

## 4. Success Metrics (Demo Goals)

### Technical Demonstration

- Loads in < 2 seconds
- All Strudel components utilized effectively
- Clean, maintainable code structure
- Well-documented for other developers

### User Experience

- Intuitive enough for first-time users
- At least one "wow" moment per user
- No accessibility barriers
- Works on phone, tablet, desktop

### Community Impact

- 20+ GitHub stars in first month
- 3+ developers fork and extend
- Used in at least one classroom
- Positive feedback from accessibility testing

## 5. Technical Constraints (Prototype Scope)

### Development Approach

- **Stack**
  - Strudel Kit component library
  - React or Vue (whichever Strudel supports best)
  - Vite for quick development
  - Client-side only (no backend)

### Browser Support (Simplified)

- Modern browsers only (Chrome, Firefox, Safari, Edge latest)
- Basic mobile responsiveness
- Focus on desktop experience

### Data Handling

- Dataset bundled with app (no loading)
- All processing in browser
- Simple state management
- URL-based state for sharing

### Deployment

- GitHub Pages or Netlify
- Single page application
- No authentication needed
- Static hosting only

## Key Demo Features to Highlight

1. **Strudel Components in Action**

   - Tables, filters, charts, modals
   - Consistent design language
   - Accessible by default

2. **Real Scientific Workflow**

   - Filter → Visualize → Explore → Export
   - Meaningful for actual users
   - Not just a toy example

3. **Developer Experience**
   - Clean code patterns
   - Reusable components
   - Clear documentation
   - Easy to extend

## 30-Day Timeline

### Week 1 (Days 1-7)

- [ ] Project setup with Strudel Kit
- [ ] Data loading and basic table view
- [ ] Species and island filters working
- [ ] Basic responsive layout

### Week 2 (Days 8-14)

- [ ] Scatter plot implementation
- [ ] Histogram implementation
- [ ] Interactive tooltips
- [ ] Filter state management

### Week 3 (Days 15-21)

- [ ] Box plot implementation
- [ ] Accessibility audit and fixes
- [ ] Mobile responsiveness
- [ ] Export functionality

### Week 4 (Days 22-30)

- [ ] Welcome tour
- [ ] Polish and bug fixes
- [ ] Documentation writing
- [ ] Deployment and launch

## Definition of Done (Prototype)

- [ ] Three working visualization types
- [ ] Filtering affects all visualizations
- [ ] Keyboard navigable
- [ ] Screen reader tested
- [ ] Deployed to public URL
- [ ] README with setup instructions
- [ ] Code commented for learning
- [ ] Tweet thread ready for launch

## What We're NOT Building (Scope Control)

- Advanced statistics beyond basic summaries
- User accounts or saving
- Comparison with other datasets
- Custom color schemes
- Animation beyond basic transitions
- PDF export or print layouts
- Collaborative features
- Backend API

## Success Statement

"In 30 days, we built a genuinely useful Palmer Penguins explorer that demonstrates Strudel Kit's power for creating accessible scientific tools. Biology students actually use it, developers learn from it, and it proves that beautiful, accessible data exploration can be built quickly with the right toolkit."
