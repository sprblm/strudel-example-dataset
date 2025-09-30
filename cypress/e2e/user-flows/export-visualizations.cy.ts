describe('Export Visualizations', () => {
  const fixedNow = new Date(2025, 8, 24, 12, 0, 0).getTime();

  beforeEach(() => {
    cy.clock(fixedNow);
    cy.visit('/penguins/');
  });

  it('exports a PNG with chart metadata and remains accessible', () => {
    cy.injectAxe();

    cy.get('[data-testid="visualization-panel"]').should('exist');
    cy.get('figure[role="img"] svg', { timeout: 10000 }).should('be.visible');
    cy.contains('figcaption', 'Scatter Plot: Bill Length Mm vs Body Mass G').should(
      'be.visible'
    );
    cy.get('svg').contains('text', 'Bill Length Mm').should('exist');
    cy.get('svg').contains('text', 'Body Mass G').should('exist');

    cy.window().then((win) => {
      cy.stub(win.HTMLAnchorElement.prototype, 'click').as('anchorClick');
      cy.stub(win.URL, 'createObjectURL').callThrough().as('createObjectURL');
      cy.stub(win.URL, 'revokeObjectURL').callThrough().as('revokeObjectURL');
    });

    cy.get('[data-testid="export-visualization-button"]').should(
      'be.visible'
    ).click();

    cy.get('@createObjectURL').should('have.callCount', 2);
    cy.get('@createObjectURL').then((createUrlStub) => {
      const svgBlob = createUrlStub.getCall(0).args[0] as Blob;
      const pngBlob = createUrlStub.getCall(1).args[0] as Blob;

      expect(svgBlob.type).to.equal('image/svg+xml;charset=utf-8');
      expect(pngBlob.type).to.equal('image/png');

      return svgBlob.text().then((content) => {
        expect(content).to.include('Scatter Plot: Bill Length Mm vs Body Mass G');
        expect(content).to.match(/Bill Length Mm/);
        expect(content).to.match(/Body Mass G/);
      });
    });

    cy.get('@anchorClick').should('have.been.calledOnce');
    cy.get('@anchorClick').then((anchorClick) => {
      const anchor = anchorClick.getCall(0).thisValue as HTMLAnchorElement;
      expect(anchor.download).to.equal('scatter-2025-09-24.png');
    });

    cy.checkA11y('[data-testid="visualization-panel"]', {
      includedImpacts: ['serious', 'critical'],
    });
  });
});
