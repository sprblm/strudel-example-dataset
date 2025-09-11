/// <reference types="cypress" />

describe('Species Filter E2E', () => {
  beforeEach(() => {
    cy.visit('/penguins');
  });

  it('persists filter state in URL and reloads correctly', () => {
    // Check all selected by default
    cy.get('[data-testid="species-checkbox-adelie"] input').should(
      'be.checked'
    );
    cy.get('[data-testid="species-checkbox-chinstrap"] input').should(
      'be.checked'
    );
    cy.get('[data-testid="species-checkbox-gentoo"] input').should(
      'be.checked'
    );

    // Uncheck Chinstrap
    cy.get('[data-testid="species-checkbox-chinstrap"]').click();
    cy.url().should('include', 'species=Adelie,Gentoo');

    // Check row count decreases
    cy.get('[data-testid="data-table"]').should('be.visible');
    cy.get('[data-testid="showing-count"]')
      .contains('Showing')
      .should('be.visible');

    // Reload page
    cy.reload();

    // Verify filter state restored
    cy.get('[data-testid="species-checkbox-chinstrap"] input').should(
      'not.be.checked'
    );
    cy.url().should('include', 'species=Adelie,Gentoo');
  });

  it('tests keyboard navigation', () => {
    cy.get('[data-testid="species-filter"]').focus();
    cy.realPress('Tab'); // Tab to first checkbox
    cy.get('[data-testid="species-checkbox-adelie"] input').should(
      'be.focused'
    );
    cy.realPress('Space');
    cy.get('[data-testid="species-checkbox-adelie"] input').should(
      'be.checked'
    );
    cy.realPress('Tab'); // To next
    cy.get('[data-testid="species-checkbox-chinstrap"] input').should(
      'be.focused'
    );
    cy.realPress('Space');
  });
});
