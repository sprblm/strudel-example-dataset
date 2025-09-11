/// <reference types="cypress" />

describe('Species Filter E2E', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('persists filter state in URL and reloads correctly', () => {
    // Check all selected by default
    cy.get('[data-testid="species-checkbox-adelie"]').should('be.checked');
    cy.get('[data-testid="species-checkbox-chinstrap"]').should('be.checked');
    cy.get('[data-testid="species-checkbox-gentoo"]').should('be.checked');

    // Uncheck Chinstrap
    cy.get('[data-testid="species-checkbox-chinstrap"]').click();
    cy.url().should('include', 'species=Adelie,Gentoo');

    // Check row count decreases
    cy.get('.MuiDataGrid-virtualScroller').should('have.length.greaterThan', 0);
    cy.get('[data-testid="showing-count"]').contains('Showing').should('be.visible');

    // Reload page
    cy.reload();

    // Verify filter state restored
    cy.get('[data-testid="species-checkbox-chinstrap"]').should('not.be.checked');
    cy.url().should('include', 'species=Adelie,Gentoo');
  });

  it('tests keyboard navigation', () => {
    cy.get('[data-testid="species-filter"]').focus();
    cy.tab().should('focus'); // Tab to first checkbox
    cy.get('[data-testid="species-checkbox-adelie"]').focus();
    cy.press('Space').should('be.checked');
    cy.tab(); // To next
    cy.get('[data-testid="species-checkbox-chinstrap"]').focus();
    cy.press('Space');
  });
});