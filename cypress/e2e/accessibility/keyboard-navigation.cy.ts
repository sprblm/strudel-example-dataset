describe('Keyboard Navigation E2E', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('supports complete keyboard navigation flow', () => {
    // Start with skip links
    cy.get('body').tab();
    cy.focused().should('contain.text', 'Skip to main content');

    cy.tab();
    cy.focused().should('contain.text', 'Skip to filters');

    cy.tab();
    cy.focused().should('contain.text', 'Skip to data');

    // Navigate through the actual content
    cy.tab();
    // Should now be in the main content area, focusing first interactive element
    cy.focused().should('be.visible');
  });

  it('supports keyboard shortcuts', () => {
    // Open help modal with ?
    cy.get('body').type('{shift}?');
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('[id="help-modal-title"]').should(
      'contain.text',
      'Palmer Penguins Explorer - Help'
    );

    // Close modal with Escape
    cy.get('body').type('{esc}');
    cy.get('[role="dialog"]').should('not.exist');
  });

  it('traps focus within modals', () => {
    // Open help modal
    cy.get('body').type('{shift}?');
    cy.get('[role="dialog"]').should('be.visible');

    // Focus should be trapped within the modal
    cy.focused().should('be.visible');

    // Tab through modal elements
    cy.tab();
    cy.focused().should('exist').and('be.visible');

    // Continue tabbing - should stay within modal
    cy.tab();
    cy.focused().should('exist').and('be.visible');

    // Close modal
    cy.get('[aria-label="Close help modal"]').click();
    cy.get('[role="dialog"]').should('not.exist');
  });

  it('provides visual focus indicators', () => {
    // Tab to interactive elements and verify they have focus indicators
    cy.get('body').tab(); // Skip link
    cy.focused().should('have.css', 'outline-style', 'solid');

    // Navigate to filters
    cy.get('#filters').focus();
    cy.get('#filters input[type="checkbox"]').first().focus();
    cy.focused().should('be.visible');
  });

  it('supports filter interaction via keyboard', () => {
    // Navigate to species filter
    cy.get('#filters').focus();
    cy.get('[data-testid="species-checkbox-adelie"]').focus();

    // Toggle checkbox with space
    cy.focused().type(' ');

    // Navigate to island filter
    cy.get('[data-testid="island-select"]').focus();

    // Open dropdown with Enter and select option
    cy.focused().type('{enter}');
    cy.get('[data-testid="island-option-biscoe"]').should('be.visible');
    cy.get('[data-testid="island-option-biscoe"]').click();
  });

  it('supports data table keyboard navigation', () => {
    // Navigate to data table
    cy.get('#data').focus();

    // Table should be accessible
    cy.get('[role="grid"]').should('be.visible');

    // Navigate through table headers (sortable)
    cy.get('.MuiDataGrid-columnHeader').first().focus();
    cy.focused().should('be.visible');

    // Use arrow keys to navigate (if supported)
    cy.focused().type('{rightarrow}');
  });

  it('skip links function correctly', () => {
    // Test skip to main content
    cy.get('body').tab();
    cy.focused().click();
    cy.get('#main-content').should('be.focused');

    // Reset and test skip to filters
    cy.get('body').tab();
    cy.tab();
    cy.focused().click();
    cy.get('#filters').should('be.focused');

    // Reset and test skip to data
    cy.get('body').tab();
    cy.tab();
    cy.tab();
    cy.focused().click();
    cy.get('#data').should('be.focused');
  });

  it('maintains accessibility when filtering data', () => {
    // Apply filters and ensure accessibility is maintained
    cy.get('[data-testid="species-checkbox-adelie"]').uncheck();

    // Data table should still be accessible
    cy.get('[role="grid"]').should('be.visible');
    cy.get('#data').should('be.visible');

    // Clear filters button should be accessible
    cy.get('[data-testid="clear-filters-button"]').should('be.visible');
    cy.get('[data-testid="clear-filters-button"]').focus();
    cy.focused().should('be.visible');
  });

  it('provides screen reader announcements', () => {
    // Check for live regions
    cy.get('[role="status"]').should('exist');
    cy.get('[aria-live="polite"]').should('exist');

    // Apply filter and check for announcements
    cy.get('[data-testid="species-checkbox-adelie"]').uncheck();

    // Should have announcement about filter changes
    cy.get('[role="status"]').should('be.visible');
  });
});
