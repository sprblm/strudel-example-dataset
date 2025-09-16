describe('Scatter Plot Visualization', () => {
  beforeEach(() => {
    cy.visit('/explore-data/');
  });

  it('displays scatter plot with controls', () => {
    cy.get('[aria-label*="X Axis"]').should('be.visible');
    cy.get('[aria-label*="Y Axis"]').should('be.visible');
    cy.contains('Adelie').should('be.visible');
    cy.contains('Gentoo').should('be.visible');
    cy.get('svg').should('be.visible');

    // Toggle species visibility
    cy.contains('Adelie').click();
    cy.get('svg circle').should('not.have.length', 0);

    // Change X axis
    cy.get('[aria-label*="X Axis"]').click();
    cy.contains('Flipper Length (mm)').click();
    cy.get('svg circle').should('be.visible');

    // Change Y axis
    cy.get('[aria-label*="Y Axis"]').click();
    cy.contains('Bill Depth (mm)').click();
    cy.get('svg circle').should('be.visible');
  });

  it('has accessible chart elements', () => {
    cy.get('svg').should(
      'have.attr',
      'aria-labelledby',
      'scatter-title scatter-desc'
    );
    cy.get('#scatter-title').should('contain', 'Scatter Plot');
    cy.get('#scatter-desc').should('contain', 'Interactive scatter plot');
  });
});
