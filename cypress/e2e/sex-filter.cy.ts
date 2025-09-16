/// <reference types="cypress" />

describe('Sex Filter E2E', () => {
  beforeEach(() => {
    cy.visit('/penguins/');
    cy.injectAxe();
  });

  it('persists filter state in URL and reloads correctly', () => {
    cy.get('[data-testid="sex-radio-male"]').click();
    cy.url().should('include', 'sex=male');
    cy.reload();\n    cy.wait(2000);\n    // Check that the radio button is checked after reload\n    cy.get('[data-testid="sex-radio-male"] input').should('be.checked');\n    cy.get('[data-testid="sex-filter-feedback"]').should('contain', 'male');
  });

  it('tests keyboard navigation', () => {
    cy.get('[data-testid="sex-radio-all"] input').focus();
    cy.realPress('ArrowDown');
    cy.get('[data-testid="sex-radio-all"] input').should('be.checked');\n    cy.wait(500);
    cy.realPress('ArrowDown');
    cy.get('[data-testid="sex-radio-male"] input').should('be.checked');
    cy.realPress('Space');
    cy.get('[data-testid="sex-radio-male"] input').should('be.checked');
  });

  it('handles missing sex values', () => {
    cy.get('[data-testid="sex-radio-all"]').click();
    cy.get('[data-testid="data-table"]').should('be.visible');
    cy.get('[data-testid="sex-radio-female"]').click();
  });

  it('validates accessibility', () => {\n    cy.get('[data-testid="sex-filter"]').should('be.visible');\n    cy.checkA11y();\n  });

  it('integrates with other filters', () => {
    cy.get('[data-testid="species-checkbox-adelie"]').click();\n    cy.wait(500);\n    cy.get('[data-testid="sex-radio-male"]').click();\n    cy.wait(1000);\n    cy.url().should('include', 'sex=male');\n    cy.get('[data-testid="data-table"]').should('be.visible');
  });
});
