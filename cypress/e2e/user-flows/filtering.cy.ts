/// <reference types="cypress" />

describe('Filtering User Flows E2E', () => {
  beforeEach(() => {
    cy.visit('/penguins');
    cy.injectAxe();
  });

  it('activates multiple filters and clears them', () => {
    // Activate filters
    cy.get('[data-testid="species-checkbox-chinstrap"]').click(); // Not all
    cy.get('[data-testid="island-select"]').click();
    cy.get('[data-value="Dream"]').click();
    cy.get('[data-testid="sex-radio-male"]').click();
    cy.url().should(
      'include',
      'species=Adelie,Chinstrap&island=Dream&sex=male'
    ); // Assuming species param format

    // Verify partial dataset
    cy.get('[data-testid="data-table-row"]').should(
      'have.length.lessThan',
      344
    );

    // Clear
    cy.get('[data-testid="clear-filters-button"]').click();
    cy.url().should('eq', 'http://localhost:5175/penguins');
    cy.get('[data-testid="data-table-row"]').should('have.length', 344); // Full dataset
  });
});
