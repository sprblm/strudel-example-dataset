describe('Responsive Mobile Experience', () => {
  it('shows collapsible filters and card layout on small screens', () => {
    cy.viewport(375, 667);
    cy.visit('/penguins');

    cy.get('[data-testid="filters-toggle"]').should('be.visible');
    cy.get('#filters').should('not.exist');

    cy.get('[data-testid="filters-toggle"]').click();
    cy.get('[data-testid="filters-toggle"]').should('contain', 'Hide filters');
    cy.get('#filters').should('exist');

    cy.get('[data-testid="penguin-card-list"]').should('be.visible');
    cy.get('[data-testid="penguin-card-list"]').within(() => {
      cy.contains('Bill Length');
      cy.contains('Body Mass');
    });
  });

  it('keeps desktop table layout on wider screens', () => {
    cy.viewport(1280, 800);
    cy.visit('/penguins');

    cy.get('[data-testid="filters-toggle"]').should('not.exist');
    cy.get('#filters').should('exist');
    cy.get('[role="grid"]').should('exist');
  });
});
