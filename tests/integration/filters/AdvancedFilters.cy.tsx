describe('Advanced Filters Integration', () => {
  beforeEach(() => {
    cy.visit('/penguins');
    cy.get('[data-testid="toggle-advanced-filters"]').should('be.visible');
  });

  it('allows configuring diet, life stage, and year filters via the advanced panel', () => {
    cy.get('[data-testid="advanced-summary"]').should('not.exist');

    cy.get('[data-testid="toggle-advanced-filters"]').click();
    cy.get('[data-testid="advanced-filters"]').should('be.visible');

    cy.get('[data-testid="diet-chip-parental"]').click();
    cy.get('[data-testid="diet-summary"]').should('not.contain', 'Parental');

    cy.get('[data-testid="life-stage-adult"]').click();

    cy.get('[data-testid="year-range-slider"]').within(() => {
      cy.get('[role="slider"]').first().focus().type('{rightarrow}{rightarrow}');
      cy.get('[role="slider"]').eq(1).focus().type('{leftarrow}');
    });

    cy.get('[data-testid="toggle-advanced-filters"]').click();

    cy.get('[data-testid="advanced-summary"]').should('contain', 'diet:').and('contain', 'life stage: adult').and('contain', 'years');
  });

  it('filters data, persists in URL, and hydrates on reload', () => {
    cy.get('[data-testid="toggle-advanced-filters"]').click();
    cy.get('[data-testid="diet-chip-krill"]').click();
    cy.get('[data-testid="life-stage-juvenile"]').click();
    cy.get('[data-testid="year-range-slider"]').within(() => {
      cy.get('[role="slider"]').first().focus().type('{rightarrow}');
      cy.get('[role="slider"]').eq(1).focus().type('{leftarrow}{leftarrow}');
    });

    cy.contains('Showing').invoke('text').then((initialText) => {
      cy.get('[data-testid="toggle-advanced-filters"]').click();

      cy.url().should('include', 'diet=').and('include', 'lifeStage=').and('include', 'years=');

      cy.reload();

      cy.get('[data-testid="advanced-summary"]').should('contain', 'diet:').and('contain', 'life stage: juvenile');

      cy.contains('Showing').invoke('text').should((reloadedText) => {
        expect(reloadedText).to.equal(initialText);
      });
    });
  });
});
