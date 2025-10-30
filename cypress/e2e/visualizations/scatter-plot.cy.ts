describe('Scatter Plot Visualization', () => {
  beforeEach(() => {
    cy.visit('/visualizations/');
  });

  it('renders controls and responds to user interaction', () => {
    cy.get('#chart-type-select').should('be.visible').and('contain', 'Scatter');
    cy.get('#x-axis-select').should('be.visible');
    cy.get('#y-axis-select').should('be.visible');

    cy.get('figure[role="img"]').should('exist');
    cy.get('#chart-title-scatter')
      .should('be.visible')
      .and('contain', 'Scatter Plot');

    cy.get('#x-axis-select').click();
    cy.contains('li', 'Flipper Length (mm)').click();
    cy.location('search').should('include', 'x=flipper_length_mm');

    cy.get('#y-axis-select').click();
    cy.contains('li', 'Bill Depth (mm)').click();
    cy.location('search').should('include', 'y=bill_depth_mm');

    cy.get('[data-testid="species-checkbox-adelie"]')
      .find('input[type="checkbox"]')
      .should('be.checked');
    cy.get('[data-testid="species-checkbox-adelie"]').click();
    cy.get('[data-testid="species-checkbox-adelie"]')
      .find('input[type="checkbox"]')
      .should('not.be.checked');
  });

  it('exposes accessible chart descriptions', () => {
    cy.get('figure[role="img"]').should(
      'have.attr',
      'aria-labelledby',
      'chart-title-scatter'
    );
    cy.get('figure[role="img"]').should(
      'have.attr',
      'aria-describedby'
    );
    cy.get('[id^="chart-desc-scatter"]').should('exist');
    cy.get('[id^="chart-stats-scatter"]').should('exist');
    cy.contains(/Showing \d+ penguins/).should('be.visible');
  });
});
