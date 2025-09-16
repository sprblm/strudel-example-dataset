/// <reference types="cypress" />

describe('Species Filter E2E', () => {
  beforeEach(() => {
    cy.visit('/penguins/');
  });

  it('persists filter state in URL and reloads correctly', () => {
    cy.get('[data-testid="species-checkbox-adelie"] input').should(
      'be.checked'
    );
    cy.get('[data-testid="species-checkbox-chinstrap"] input').should(
      'be.checked'
    );
    cy.get('[data-testid="species-checkbox-gentoo"] input').should(
      'be.checked'
    );

    cy.get('[data-testid="species-checkbox-chinstrap"]').click();
    cy.wait(5000);
    cy.get('[data-testid="species-checkbox-chinstrap"] input').should(
      'not.be.checked'
    );

    cy.get('[data-testid="data-table"]').should('be.visible');
    cy.get('[data-testid="showing-count"]')
      .contains('Showing')
      .should('be.visible');

    cy.reload();
    cy.wait(5000);

    cy.get('[data-testid="species-checkbox-chinstrap"] input').should(
      'not.be.checked'
    );
    cy.get('[data-testid="species-checkbox-chinstrap"] input').should(
      'not.be.checked'
    );
  });

  it('tests keyboard navigation', () => {
    cy.get('[data-testid="species-checkbox-adelie"] input').focus({
      force: true,
    });
    cy.realPress('Space');
    cy.wait(500);
    cy.get('[data-testid="species-checkbox-adelie"] input').should(
      'be.checked'
    );
    cy.realPress('Tab');
    cy.wait(500);
    cy.get('[data-testid="species-checkbox-chinstrap"] input').should(
      'be.focused'
    );
    cy.realPress('Space');
  });
});
