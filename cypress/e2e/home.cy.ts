describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/');
    cy.contains('h1', 'Palmer Penguins Explorer').should('be.visible');
    cy.contains('button', 'Open data workspace').should('be.visible');
    cy.contains('button', 'Launch visualizations').should('be.visible');
  });
});
