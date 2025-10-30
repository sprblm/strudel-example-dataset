/// <reference types="cypress" />

describe('Species Filter E2E', () => {
  beforeEach(() => {
    cy.visit('/penguins/');
  });

  it('persists filter state in URL and reloads correctly', () => {
    const getSpeciesCheckbox = (species: string) =>
      cy
        .get(`[data-testid="species-checkbox-${species}"]`)
        .find('input[type="checkbox"]');

    ['adelie', 'chinstrap', 'gentoo'].forEach((species) => {
      getSpeciesCheckbox(species).should('be.checked');
    });

    cy.get('[data-testid="species-label-chinstrap"]').click();

    getSpeciesCheckbox('chinstrap').should('not.be.checked');

    cy.get('[aria-label="Palmer Penguins data table"][role="grid"]').should(
      'be.visible'
    );
    cy.contains(/Showing \d+ penguins/).should('be.visible');

    cy.location('search').should('contain', 'species=');

    cy.reload();

    getSpeciesCheckbox('chinstrap').should('not.be.checked');
    cy.location('search').should('contain', 'species=');
  });

  it('tests keyboard navigation', () => {
    const getSpeciesCheckbox = (species: string) =>
      cy
        .get(`[data-testid="species-checkbox-${species}"]`)
        .find('input[type="checkbox"]');

    getSpeciesCheckbox('adelie').focus();
    cy.realPress('Space');
    getSpeciesCheckbox('adelie').should('not.be.checked');

    cy.realPress('Tab');
    getSpeciesCheckbox('chinstrap').should('be.focused');
    cy.realPress('Space');
    getSpeciesCheckbox('chinstrap').should('not.be.checked');
  });
});
