/// <reference types="cypress" />

describe('Sex Filter E2E', () => {
  beforeEach(() => {
    cy.visit('/penguins');
    cy.injectAxe();
  });

  it('persists filter state in URL and reloads correctly', () => {
    cy.get('[data-testid="sex-radio-male"]').click();
    cy.url().should('include', '?sex=male');
    cy.reload();
    cy.get('[data-testid="sex-radio-male"]').should('be.checked');
    cy.get('[data-testid="sex-filter-feedback"]').should('contain', 'male');
  });

  it('tests keyboard navigation', () => {
    cy.get('[data-testid="sex-radio-group"]').focus();
    cy.realPress('ArrowDown');
    cy.get('[data-testid="sex-radio-all"]').should('be.checked');
    cy.realPress('ArrowDown');
    cy.get('[data-testid="sex-radio-male"]').should('be.checked');
    cy.realPress('Space');
    cy.get('[data-testid="sex-radio-male"]').should('be.checked');
  });

  it('handles missing sex values', () => {
    cy.get('[data-testid="sex-radio-all"]').click();
    cy.get('[data-testid="data-table-row"]').should('have.length.greaterThan', 0);
    cy.get('[data-testid="sex-radio-female"]').click();
  });

  it('validates accessibility', () => {
    cy.checkA11y('[data-testid="sex-filter"]');
  });

  it('integrates with other filters', () => {
    cy.get('[data-testid="species-checkbox-adelie"]').click();
    cy.get('[data-testid="sex-radio-male"]').click();
    cy.url().should('include', 'sex=male');
    cy.get('[data-testid="data-table"]').should('be.visible');
  });
});