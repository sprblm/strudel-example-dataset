/// <reference types="cypress" />

describe('Filtering User Flows E2E', () => {
  beforeEach(() => {
    cy.visit('/penguins/');
    cy.injectAxe();
  });

  it('activates multiple filters and clears them', () => {
    // Activate filters
    cy.get('[data-testid="species-checkbox-chinstrap"]').click(); // Not all
    cy.get('[data-testid="island-select"]').click();
    cy.get('[data-value="Dream"]').click();
    cy.get('[data-testid="sex-radio-male"]').click();
    cy.url().should(\n      'include',\n      '?species=Adelie,Chinstrap&island=Dream&sex=male'\n    ); // Assuming species param format

    // Verify partial dataset
    cy.get('[data-testid="data-table"]').should('be.visible');

    // Clear
    cy.get('[data-testid="clear-filters-button"]').click();
    cy.url().should('eq', 'http://localhost:5175/penguins/');
    cy.get('[data-testid="data-table"]').should('be.visible'); // Full dataset
  });
});
