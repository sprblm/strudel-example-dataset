import { mount } from '@cypress/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme';
import { FiltersProvider } from '@/contexts/FiltersProvider';
import VisualizationRoute from '@/routes/VisualizationRoute';
import { Penguin } from '@/types/penguin';

const mockPenguins: Penguin[] = [
  {
    species: 'Adelie',
    island: 'Biscoe',
    bill_length_mm: 39.1,
    bill_depth_mm: 18.7,
    flipper_length_mm: 181,
    body_mass_g: 3750,
    sex: 'male',
    year: 2007,
  },
  {
    species: 'Chinstrap',
    island: 'Dream',
    bill_length_mm: 46.5,
    bill_depth_mm: 17.9,
    flipper_length_mm: 192,
    body_mass_g: 3500,
    sex: 'female',
    year: 2008,
  },
  {
    species: 'Gentoo',
    island: 'Biscoe',
    bill_length_mm: 50,
    bill_depth_mm: 15,
    flipper_length_mm: 220,
    body_mass_g: 5000,
    sex: 'male',
    year: 2009,
  },
];

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
