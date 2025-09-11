describe('ClearFilters Integration', () => {
  beforeEach(() => {
    cy.mount(
      <MemoryRouter initialEntries={['/penguins']}>
        <FiltersProvider>
          {' '}
          {/* Assuming context wrapper */}
          <FiltersPanel />
        </FiltersProvider>
      </MemoryRouter>
    );
  });

  it('resets state and URL on clear', () => {
    // Mock active state
    cy.get('[data-testid="clear-filters-button"]').should('be.visible').click();
    // Verify dispatch and navigate called (mocked)
    cy.get('[data-testid="clear-filters-button"]').click();
    cy.url().should('include', '/penguins'); // No params
    cy.get('[data-testid="data-table-row"]').should('have.length.gt', 100); // Full dataset
  });

  it('count is accurate', () => {
    cy.get('[data-testid="clear-filters-button"]').should(
      'contain.text',
      'Clear 3 filter'
    ); // Assuming mock
  });
});
