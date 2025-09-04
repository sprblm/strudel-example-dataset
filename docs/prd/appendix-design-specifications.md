# Appendix: Design Specifications

## Information Architecture

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

## Component Hierarchy

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
