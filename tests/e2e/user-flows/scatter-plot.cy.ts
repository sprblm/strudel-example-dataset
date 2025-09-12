describe('Scatter Plot User Flow', () => {
  beforeEach(() => {
    cy.visit('/visualize/scatter');
  });

  it('navigates to scatter plot', () => {
    cy.url().should('include', '/visualize/scatter');
    cy.get('[data-testid="axis-x-select"]').should('be.visible');
    cy.get('[data-testid="legend-item-adelie"]').should('be.visible');
    cy.get('svg').should('be.visible');
  });

  it('changes axes via dropdowns', () => {
    cy.get('[data-testid="axis-x-select"]').select('flipper_length_mm');
    cy.url().should('include', 'x=flipper_length_mm');
    cy.get('[data-testid="axis-y-select"]').select('bill_depth_mm');
    cy.url().should('include', 'y=bill_depth_mm');
    // Plot updates (check axes labels or SVG change indirectly)
    cy.get('svg').should('be.visible');
  });

  it('hovers over points to show tooltip', () => {
    cy.get('circle.data-point').first().trigger('mouseenter');
    cy.get('[data-testid="tooltip"]')
      .should('be.visible')
      .within(() => {
        cy.contains('Adelie'); // First point species
      });
    cy.get('circle.data-point').first().trigger('mouseleave');
    cy.get('[data-testid="tooltip"]').should('not.exist');
  });

  it('toggles species in legend', () => {
    cy.get('[data-testid="legend-item-chinstrap"]').click();
    // Verify points for Chinstrap hide (count or visibility)
    cy.get('circle.data-point').should('have.length', 2); // Assuming 3 points initially, now 2
    cy.get('[data-testid="legend-item-chinstrap"]').should('not.be.checked');
    cy.get('[data-testid="legend-item-chinstrap"]').click(); // Toggle back
    cy.get('circle.data-point').should('have.length', 3);
  });
});
