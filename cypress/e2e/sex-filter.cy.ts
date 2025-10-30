/// <reference types="cypress" />

describe('Sex Filter E2E', () => {
  beforeEach(() => {
    cy.visit('/penguins/');
    cy.injectAxe();
  });

  it('persists filter state in URL and reloads correctly', () => {
    const selectSex = (value: string) =>
      cy.get(`[data-testid="sex-option-${value}"]`).click();

    selectSex('male');
    cy.get('[data-testid="sex-filter-feedback"]').should(
      'contain',
      'Filtering by: male'
    );
    cy.location('search').should('contain', 'sex=male');

    cy.reload();

    cy.get('[data-testid="sex-filter-feedback"]').should(
      'contain',
      'Filtering by: male'
    );
    cy.location('search').should('contain', 'sex=male');
  });

  it('tests keyboard navigation', () => {
    const radioInput = (value: string) =>
      cy
        .get('[data-testid="sex-radio-group"]')
        .find(`input[type="radio"][value="${value}"]`);

    radioInput('all').focus();
    cy.realPress('ArrowDown');
    radioInput('male').should('be.focused');
    cy.realPress('Space');
    radioInput('male').should('be.checked');
  });

  it('handles missing sex values', () => {
    cy.get('[data-testid="sex-option-all"]').click();
    cy.get('[aria-label="Palmer Penguins data table"][role="grid"]').should(
      'be.visible'
    );
    cy.get('[data-testid="sex-option-female"]').click();
    cy.get('[aria-label="Palmer Penguins data table"][role="grid"]').should(
      'be.visible'
    );
  });

  it('validates accessibility', () => {
    cy.get('[data-testid="sex-filter"]').should('be.visible');
    cy.checkA11y('[data-testid="sex-filter"]');
  });

  it('integrates with other filters', () => {
    cy.get('[data-testid="species-label-adelie"]').click();
    cy.get('[data-testid="sex-option-male"]').click();
    cy.get('[data-testid="sex-filter-feedback"]').should(
      'contain',
      'Filtering by: male'
    );
    cy.contains(/Showing \d+ penguins/).should('be.visible');
  });
});
