describe('Scatter Plot User Flow', () => {
  beforeEach(() => {
    cy.visit('/explore-data');
  });

  it('navigates to scatter plot and interacts with controls', () => {
    cy.get('[data-testid="chart-selector"]').select('scatter');
    cy.url().should('include', '/visualize/scatter');

    // Change X axis
    cy.get('[role="combobox"][aria-label*="X-Axis"]').click();
    cy.contains('flipper_length_mm').click();
    cy.url().should('include', 'x=flipper_length_mm');

    // Toggle species
    cy.contains('Adelie').parent().find('input[type="checkbox"]').click();

    // Hover over point (simulate)
    cy.get('circle').first().trigger('mouseover');
    cy.get('[role="tooltip"]').should('be.visible').and('contain', 'Adelie');

    // Keyboard navigation
    cy.get('circle').first().focus();
    cy.realPress('Enter'); // Trigger focus event
    cy.get('[role="tooltip"]').should('be.visible');
  });

  it('is responsive and accessible', () => {
    cy.injectAxe();
    cy.checkA11y();

    cy.viewport(768, 1024); // Tablet
    cy.get('svg').invoke('attr', 'width').should('be.lte', 800);

    cy.viewport(375, 667); // Mobile
    cy.get('svg').invoke('attr', 'width').should('be.lte', 400);
  });
});
