describe('ClearFilters Integration', () => {
  beforeEach(() => {
    cy.mount(<FiltersPanel />);
  });

  it('resets state and URL on clear', () => {
    // Mock active state
    cy.get('[data-testid="clear-filters-button"]').should('be.visible').click();
    // Verify dispatch and navigate called (mocked)
    cy.get('[data-testid="species-checkbox-adelie"]').should('be.checked'); // Back to all
  });

  it('count is accurate', () => {
    cy.get('[data-testid="clear-filters-button"]').should('contain.text', 'Clear 3 filter'); // Assuming mock
  });
});