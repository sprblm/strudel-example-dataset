describe('Keyboard Navigation E2E', () => {
  beforeEach(() => {
    cy.visit('/penguins/');
  });

  it('provides skip links to key regions', () => {
    cy.realPress('Tab');
    cy.focused()
      .should('have.attr', 'href', '#main-content')
      .and('contain.text', 'Skip to main content');

    cy.realPress('Tab');
    cy.focused()
      .should('have.attr', 'href', '#filters')
      .and('contain.text', 'Skip to filters');

    cy.realPress('Tab');
    cy.focused()
      .should('have.attr', 'href', '#data')
      .and('contain.text', 'Skip to data');

    cy.realPress('Enter');
    cy.focused().should('have.id', 'data');
  });

  it('opens the help modal via keyboard shortcut and traps focus', () => {
    cy.realPress('?');
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('#help-modal-title')
      .should('be.visible')
      .and('contain.text', 'Help');

    cy.focused().should('have.attr', 'role', 'dialog');

    cy.realPress('Tab');
    cy.focused().should('be.visible');
    cy.realPress('Tab');
    cy.focused().should('be.visible');

    cy.realPress('Escape');
    cy.get('[role="dialog"]').should('not.exist');
  });

  it('allows keyboard-only interaction with filters', () => {
    cy.get('[data-testid="species-checkbox-adelie"]')
      .find('input[type="checkbox"]')
      .focus();
    cy.realPress('Space');
    cy.get('[data-testid="species-checkbox-adelie"]')
      .find('input[type="checkbox"]')
      .should('not.be.checked');

    cy.get('[data-testid="toggle-advanced-filters"]').focus();
    cy.realPress('Enter');
    cy.get('[data-testid="advanced-filters"]').should('be.visible');

    cy.get('[data-testid="diet-chip-krill"]').focus();
    cy.realPress('Enter');
    cy.get('[data-testid="diet-summary"]')
      .should('contain.text', 'Krill')
      .and('not.contain.text', 'All diets');
  });

  it('announces filter updates via live region', () => {
    cy.get('[data-testid="species-checkbox-gentoo"]')
      .find('input[type="checkbox"]')
      .uncheck({ force: true });
    cy.get('[data-testid="live-region"]')
      .should('contain.text', 'Showing')
      .and('contain.text', 'penguins');
  });

  it('supports keyboard navigation within the data table', () => {
    cy.get('#data').focus();
    cy.realPress('Tab');
    cy.focused().should('have.attr', 'role', 'columnheader');

    cy.realPress('ArrowRight');
    cy.focused().should('have.attr', 'role', 'columnheader');

    cy.realPress('Tab');
    cy.focused().should('have.attr', 'role', 'gridcell');
  });
});
