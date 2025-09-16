/// <reference types="cypress" />

describe('Sex Filter E2E', () => {
  beforeEach(() => {
    cy.visit('/penguins/');
    cy.injectAxe();
  });

  it('persists filter state in URL and reloads correctly', () => {
    cy.get('[data-testid="sex-radio-male"]').click({ force: true });
    cy.wait(2000);
    cy.url().should('include', 'sex=male');
    cy.reload();
    cy.wait(2000);
    cy.get('[data-testid="sex-radio-male"] input').should('be.checked');
    cy.get('[data-testid="sex-filter-feedback"]').should('contain', 'male');
  });

  it('tests keyboard navigation', () => {
    cy.get('[data-testid="sex-radio-all"] input').focus({ force: true });
    cy.realPress('ArrowDown');
    cy.wait(500);
    cy.get('[data-testid="sex-radio-all"] input').should('be.checked');
    cy.realPress('ArrowDown');
    cy.wait(500);
    cy.get('[data-testid="sex-radio-male"] input').should('be.checked');
    cy.realPress('Space');
    cy.wait(500);
    cy.get('[data-testid="sex-radio-male"] input').should('be.checked');
  });

  it('handles missing sex values', () => {
    cy.get('[data-testid="sex-radio-all"]').click();
    cy.wait(1000);
    cy.get('[data-testid="data-table"]').should('be.visible');
    cy.get('[data-testid="sex-radio-female"]').click();
  });

  it('validates accessibility', () => {
    cy.get('[data-testid="sex-filter"]').should('be.visible');
    cy.checkA11y('[data-testid="sex-filter"]');
  });

  it('integrates with other filters', () => {
    cy.get('[data-testid="species-checkbox-adelie"]').click();
    cy.wait(1000);
    cy.get('[data-testid="sex-radio-male"]').click({ force: true });
    cy.wait(1000);
    cy.url().should('include', 'sex=male');
    cy.get('[data-testid="data-table"]').should('be.visible');
  });
});
