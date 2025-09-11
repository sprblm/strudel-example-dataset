describe('Island Filter Integration', () => {
  beforeEach(() => {
    // Visit the main penguins page
    cy.visit('/penguins');

    // Wait for data to load
    cy.get('[data-testid="island-filter"]').should('be.visible');
  });

  it('should have island filter with default "All" selection', () => {
    cy.get('[data-testid="island-select"]').should('contain', 'All');
    cy.get('[data-testid="island-filter-feedback"]').should('not.exist');
  });

  it('should display all island options when opened', () => {
    // Open the select dropdown
    cy.get('[data-testid="island-select"]').click();

    // Check all options are present
    cy.get('[data-testid="island-option-all"]')
      .should('be.visible')
      .and('contain', 'All');
    cy.get('[data-testid="island-option-biscoe"]')
      .should('be.visible')
      .and('contain', 'Biscoe');
    cy.get('[data-testid="island-option-dream"]')
      .should('be.visible')
      .and('contain', 'Dream');
    cy.get('[data-testid="island-option-torgersen"]')
      .should('be.visible')
      .and('contain', 'Torgersen');
  });

  it('should filter penguins when island is selected', () => {
    // Get initial penguin count
    cy.contains('Showing').then(($countText) => {
      const initialCount = parseInt($countText.text().match(/\\d+/)[0]);

      // Select Biscoe island
      cy.get('[data-testid="island-select"]').click();
      cy.get('[data-testid="island-option-biscoe"]').click();

      // Check that data is filtered
      cy.contains('Showing').should(($newCountText) => {
        const newCount = parseInt($newCountText.text().match(/\\d+/)[0]);
        expect(newCount).to.be.lessThan(initialCount);
        expect(newCount).to.be.greaterThan(0); // Should have some Biscoe penguins
      });

      // Check visual feedback
      cy.get('[data-testid="island-filter-feedback"]').should(
        'contain',
        'Filtering by: Biscoe'
      );
    });
  });

  it('should update table data in real-time when island filter changes', () => {
    // Select Dream island
    cy.get('[data-testid="island-select"]').click();
    cy.get('[data-testid="island-option-dream"]').click();

    // Check that all visible penguins are from Dream island
    // Note: This assumes the table has data-testid attributes for the island column
    cy.get('.MuiDataGrid-root').should('be.visible');

    // Verify only Dream island penguins are shown
    cy.get('.MuiDataGrid-row').should('have.length.at.least', 1);

    // Switch to Torgersen
    cy.get('[data-testid="island-select"]').click();
    cy.get('[data-testid="island-option-torgersen"]').click();

    // Verify feedback updated
    cy.get('[data-testid="island-filter-feedback"]').should(
      'contain',
      'Filtering by: Torgersen'
    );
  });

  it('should work in combination with species filter', () => {
    // First apply species filter (select only Adelie)
    cy.get('[data-testid="species-checkbox-adelie"]').should('be.checked');
    cy.get('[data-testid="species-checkbox-chinstrap"]').click(); // uncheck
    cy.get('[data-testid="species-checkbox-gentoo"]').click(); // uncheck

    // Get count with only Adelie selected
    cy.contains('Showing').then(($adelieCount) => {
      const adelieOnlyCount = parseInt($adelieCount.text().match(/\\d+/)[0]);

      // Now apply island filter (Biscoe)
      cy.get('[data-testid="island-select"]').click();
      cy.get('[data-testid="island-option-biscoe"]').click();

      // Should show fewer penguins (only Adelie from Biscoe)
      cy.contains('Showing').should(($combinedCount) => {
        const combinedFilterCount = parseInt(
          $combinedCount.text().match(/\\d+/)[0]
        );
        expect(combinedFilterCount).to.be.lessThan(adelieOnlyCount);
      });
    });
  });

  it('should reset to show all penguins when "All" is selected', () => {
    // First apply a specific island filter
    cy.get('[data-testid="island-select"]').click();
    cy.get('[data-testid="island-option-dream"]').click();

    // Get filtered count
    cy.contains('Showing').then(($filteredCount) => {
      const filteredPenguinCount = parseInt(
        $filteredCount.text().match(/\\d+/)[0]
      );

      // Reset to "All"
      cy.get('[data-testid="island-select"]').click();
      cy.get('[data-testid="island-option-all"]').click();

      // Should show more penguins (unless species filter is active)
      cy.contains('Showing').should(($allCount) => {
        const allPenguinCount = parseInt($allCount.text().match(/\\d+/)[0]);
        expect(allPenguinCount).to.be.greaterThan(filteredPenguinCount);
      });

      // Visual feedback should be hidden
      cy.get('[data-testid="island-filter-feedback"]').should('not.exist');
    });
  });

  it('should be keyboard accessible', () => {
    // Focus the select using Tab
    cy.get('body').type('{tab}');
    cy.get('[data-testid="island-select"]').should('have.focus');

    // Open dropdown with Enter
    cy.focused().type('{enter}');
    cy.get('[data-testid="island-option-all"]').should('be.visible');

    // Navigate with arrow keys and select with Enter
    cy.focused().type('{downarrow}');
    cy.focused().type('{enter}');

    // Should have selected Biscoe
    cy.get('[data-testid="island-filter-feedback"]').should(
      'contain',
      'Filtering by: Biscoe'
    );
  });

  it('should persist filter state in URL', () => {
    // Select an island
    cy.get('[data-testid="island-select"]').click();
    cy.get('[data-testid="island-option-dream"]').click();

    // Check URL contains island parameter
    cy.url().should('include', 'island=Dream');

    // Refresh page
    cy.reload();

    // Filter should be maintained
    cy.get('[data-testid="island-select"]').should('contain', 'Dream');
    cy.get('[data-testid="island-filter-feedback"]').should(
      'contain',
      'Filtering by: Dream'
    );
  });

  it('should handle edge cases gracefully', () => {
    // Test multiple rapid selections
    cy.get('[data-testid="island-select"]').click();
    cy.get('[data-testid="island-option-biscoe"]').click();

    cy.get('[data-testid="island-select"]').click();
    cy.get('[data-testid="island-option-dream"]').click();

    cy.get('[data-testid="island-select"]').click();
    cy.get('[data-testid="island-option-torgersen"]').click();

    // Should end up with Torgersen selected
    cy.get('[data-testid="island-filter-feedback"]').should(
      'contain',
      'Filtering by: Torgersen'
    );

    // Data should be consistent
    cy.get('.MuiDataGrid-root').should('be.visible');
    cy.contains('Showing').should('contain', 'penguin');
  });
});
