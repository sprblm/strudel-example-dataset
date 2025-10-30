/// <reference types="cypress" />

describe('Filtering User Flows E2E', () => {
  beforeEach(() => {
    cy.visit('/penguins/');
    cy.injectAxe();
  });

  it('activates multiple filters and clears them', () => {
    const getSpeciesCheckbox = (species: string) =>
      cy
        .get(`[data-testid="species-checkbox-${species}"]`)
        .find('input[type="checkbox"]');

    cy.get('[data-testid="species-label-chinstrap"]').click();
    getSpeciesCheckbox('chinstrap').should('not.be.checked');

    cy.get('[data-testid="island-select"]').click();
    cy.contains('[role="option"]', 'Dream').click();

    cy.get('[data-testid="sex-option-male"]').click();
    cy.get('[data-testid="sex-filter-feedback"]').should(
      'contain',
      'Filtering by: male'
    );

    cy.get('[aria-label="Palmer Penguins data table"][role="grid"]').should(
      'be.visible'
    );
    cy.contains(/Showing \d+ penguins/).should('be.visible');

    cy.get('[data-testid="clear-filters-button"]').click();
    cy.location('pathname').should('eq', '/penguins/');
    cy.get('[aria-label="Palmer Penguins data table"][role="grid"]').should(
      'be.visible'
    );
    cy.contains(/Showing \d+ penguins/).should('be.visible');
  });
});
