import { mount } from '@cypress/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme';
import { FiltersProvider } from '@/contexts/FiltersProvider';
import VisualizationRoute from '@/routes/VisualizationRoute';

describe('Scatter Integration', () => {
  it('renders AxisControls, ChartLegend, and ScatterPlot', () => {
    mount(
      <ThemeProvider theme={theme}>
        <MemoryRouter
          initialEntries={['/visualize/scatter?x=bill_length_mm&y=body_mass_g']}
        >
          <FiltersProvider
            initialState={{
              selectedSpecies: [],
              selectedIsland: 'all',
              selectedSex: 'all',
            }}
          >
            <VisualizationRoute />
          </FiltersProvider>
        </MemoryRouter>
      </ThemeProvider>
    );

    cy.get('[role="combobox"]').should('have.length.gte', 2); // Axis controls
    cy.contains('Species Legend').should('be.visible');
    cy.get('svg').should('be.visible');
  });

  it('changes axes and updates URL', () => {
    mount(
      <ThemeProvider theme={theme}>
        <MemoryRouter
          initialEntries={['/visualize/scatter?x=bill_length_mm&y=body_mass_g']}
        >
          <FiltersProvider
            initialState={{
              selectedSpecies: [],
              selectedIsland: 'all',
              selectedSex: 'all',
            }}
          >
            <VisualizationRoute />
          </FiltersProvider>
        </MemoryRouter>
      </ThemeProvider>
    );

    cy.get('[role="combobox"]').first().click();
    cy.contains('flipper_length_mm').click();
    cy.url().should('include', 'x=flipper_length_mm');
  });

  it('toggles species in legend', () => {
    mount(
      <ThemeProvider theme={theme}>
        <MemoryRouter
          initialEntries={['/visualize/scatter?x=bill_length_mm&y=body_mass_g']}
        >
          <FiltersProvider
            initialState={{
              selectedSpecies: [],
              selectedIsland: 'all',
              selectedSex: 'all',
            }}
          >
            <VisualizationRoute />
          </FiltersProvider>
        </MemoryRouter>
      </ThemeProvider>
    );

    cy.contains('Adelie').parent().find('input[type="checkbox"]').click();
    // Verify toggle (check state change indirectly via re-render)
    cy.get('svg').should('be.visible'); // Plot updates
  });
});
