describe('Scatter Plot Visualization User Flow', () => {
  beforeEach(() => {
    cy.visit('/visualizations/');
  });

  it('supports end-to-end configuration and interaction', () => {
    cy.get('[data-testid="visualization-panel"]').should('exist');

    cy.get('#chart-type-select').should('contain', 'Scatter');

    cy.get('#x-axis-select').click();
    cy.contains('li', 'Flipper Length (mm)').click();

    cy.get('#y-axis-select').click();
    cy.contains('li', 'Bill Depth (mm)').click();

    cy.get('[data-testid="species-checkbox-gentoo"]').click();
    cy.get('[data-testid="species-checkbox-gentoo"]')
      .find('input[type="checkbox"]')
      .should('not.be.checked');

    cy.get('figure[role="img"] svg').should('be.visible');
  });

  it('maintains accessible metadata for the scatter plot', () => {
    cy.get('figure[role="img"]').should('exist');
    cy.get('#chart-title-scatter')
      .should('be.visible')
      .and('contain', 'Scatter Plot');
    cy.contains(/Showing \d+ penguins/).should('be.visible');
  });
});
