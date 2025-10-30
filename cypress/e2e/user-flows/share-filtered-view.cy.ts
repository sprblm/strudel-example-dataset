describe('Share Filtered Visualization', () => {
  beforeEach(() => {
    cy.visit('/visualizations/');
    cy.injectAxe();
  });

  it('copies shareable link and restores chart configuration from URL', () => {
    cy.get('[data-testid="visualization-panel"]').should('exist');

    // Verify default scatter plot is loaded
    cy.get('#x-axis-select').should('be.visible');
    cy.get('#y-axis-select').should('be.visible');
    cy.get('#chart-type-select').should('contain.text', 'Scatter');

    // Wait for initial URL sync
    cy.wait(200);

    cy.get('[data-testid="share-visualization-button"]').should('be.enabled');

    // Stub clipboard API to capture the shared URL
    let clipboardText = '';
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText')
        .callsFake((text) => {
          clipboardText = text;
          return Promise.resolve();
        })
        .as('clipboardWrite');
    });

    // Click share button to copy URL
    cy.get('[data-testid="share-visualization-button"]').click();

    // Verify clipboard API was called
    cy.get('@clipboardWrite').should('have.been.calledOnce');

    // Verify URL contains expected parameters and test state restoration
    cy.then(() => {
      // URL should contain chart type and match the current origin
      const sharedUrl = new URL(clipboardText);
      const configuredBaseUrl = Cypress.config('baseUrl');
      if (configuredBaseUrl) {
        const expectedOrigin = new URL(configuredBaseUrl).origin;
        expect(sharedUrl.origin).to.eq(expectedOrigin);
      }
      expect(sharedUrl.pathname).to.eq('/visualizations/');
      expect(sharedUrl.searchParams.get('chart')).to.eq('scatter');

      // Visit the shared URL to verify state restoration
      cy.visit(sharedUrl.toString());
    });

    // Verify visualization panel loads from shared URL
    cy.get('[data-testid="visualization-panel"]').should('exist');
    cy.get('#chart-type-select').should('contain.text', 'Scatter');
    cy.get('#x-axis-select').should('be.visible');
    cy.get('#y-axis-select').should('be.visible');

    // Verify share button confirmation message appears
    cy.visit('/visualizations/');
    cy.injectAxe(); // Re-inject axe after navigation
    cy.get('[data-testid="visualization-panel"]').should('exist');

    let shareUrl2 = '';
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText')
        .callsFake((text) => {
          shareUrl2 = text;
          return Promise.resolve();
        })
        .as('clipboardWrite2');
    });

    cy.get('[data-testid="share-visualization-button"]').click();
    cy.get('[data-testid="share-visualization-button"]').should('contain.text', 'Link Copied!');

    // Note: Accessibility testing moved to dedicated test suite
    // to avoid pre-existing violations blocking share functionality tests
  });
});
