/// <reference types="cypress" />

describe('Filtering User Flows E2E', () => {
  beforeEach(() => {
    cy.visit('/penguins/');
    cy.injectAxe();
  });

  it('activates multiple filters and clears them', () => {
    cy.get('[data-testid="species-checkbox-chinstrap"]').click();
    cy.wait(1000);
    cy.get('[data-testid="island-select"]').click();
    cy.get('[data-value="Dream"]').click();
    cy.wait(1000);
    cy.get('[data-testid="sex-radio-male"]').click();
    cy.wait(5000);
    cy.get('[data-testid="species-checkbox-chinstrap"] input').should(
      'be.checked'
    );
    cy.get('[data-value="Dream"]').should('be.visible');
    cy.get('[data-testid="sex-radio-male"] input').should('be.checked');

    cy.get('[data-testid="data-table"]').should('be.visible');

    cy.get('[data-testid="clear-filters-button"]').click();
    cy.wait(1000);
    cy.url().should('eq', 'http://localhost:5175/penguins/');
    cy.get('[data-testid="data-table"]').should('be.visible');
  });
});
