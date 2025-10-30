# Palmer Penguins Explorer

Palmer Penguins Explorer is a data visualization and exploration tool for the famous Palmer Penguins dataset. This application allows researchers and data scientists to interactively explore physical measurements and biological attributes of penguin species from the Palmer Archipelago, Antarctica.

The project demonstrates modern data visualization techniques and filtering capabilities using React, TypeScript, and Material UI.

## Features

- **Interactive Data Filtering**: Filter penguin data by species, island, sex, diet, life stage, and year range
- **Data Visualization**: Multiple chart types including scatter plots, histograms, and box plots
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessibility**: Full keyboard navigation, screen reader support, and ARIA labels
- **Shareable Links**: Share filtered views and visualizations with persistent URLs
- **Real-time Updates**: Live announcements and data-driven summaries

## Dataset Information

The Palmer Penguins dataset contains physical measurements and biological attributes of penguins from three species:

- Adelie
- Chinstrap
- Gentoo

Data fields include:

- Species, island, and sex
- Bill length and depth (mm)
- Flipper length and body mass (mm/g)
- Diet and life stage
- Year of measurement

## Tech Stack

- [**React**](https://react.dev/): A component-based JavaScript library for building UIs.
- [**TypeScript**](https://www.typescriptlang.org/): A typed superset of JavaScript that compiles to plain JavaScript.
- [**Vite**](https://vite.dev/): A fast, opinionated frontend build tool.
- [**Material UI**](https://mui.com/material-ui/getting-started/): Open-source React component library based on Google's Material Design.
- [**TanStack Router**](https://tanstack.com/router/latest): A fully type-safe router with built-in data fetching, first-class search-param APIs, and more.
- [**Cypress**](https://www.cypress.io/): End-to-end tests for the application.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

```
git clone https://github.com/sprblm/strudel-example-dataset.git
```

2. Navigate to the project directory:

```
cd strudel-example-dataset
```

3. Install dependencies:

```
npm install
```

### Running the Application

Start the development server:

```
npm start
```

Open [http://localhost:5175](http://localhost:5175) to view the app in your browser.

### Running Tests

Run unit tests:

```
npm run test
```

Run end-to-end tests with Cypress:

```
npm run cy:test
```

## Project Structure

- `src/components/`: React components for UI elements
- `src/components/filters/`: Filter components (species, island, sex, diet, life stage, year)
- `src/components/visualizations/`: Data visualization components
- `src/context/`: Global application state using React Context
- `src/hooks/`: Custom React hooks
- `src/utils/`: Utility functions and helpers
- `tests/`: Test files
- `cypress/`: End-to-end test specifications

## Advanced Features

### Extended Filter Controls

The application includes advanced filtering capabilities:

- **Diet Filter**: Multi-select filter for dietary habits
- **Life Stage Filter**: Toggle for different life stages (adult, juvenile, chick)
- **Year Range Filter**: Slider for selecting data collection years (2021-2025)

### Accessibility Features

- Full keyboard navigation support
- Screen reader announcements via live regions
- Skip links for easier navigation
- ARIA labels and roles for all interactive elements
- High contrast mode compatibility

### Visualization Options

- Scatter plots for exploring correlations between variables
- Histograms for distribution analysis
- Box plots for comparing statistical summaries

## Contributing

We welcome contributions to the Palmer Penguins Explorer! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute.

## License

This software is licensed under the MIT License. [Read the full license](LICENSE).

## Dataset Attribution

This project uses the Palmer Penguins dataset, which was collected by Dr. Kristen Gorman and the Palmer Station Long Term Ecological Research program. The dataset is freely available and has been used in numerous educational and research contexts.

Original data source: https://allisonhorst.github.io/palmerpenguins/

## Repository Information

Note: The default branch of this repository is `main`. If you're cloning or working with this repository, please ensure you're working on the `main` branch which contains the most recent stable version of the code.
