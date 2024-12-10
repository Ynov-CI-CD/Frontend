describe('Website Connection Test', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Should load the homepage', () => {
    cy.contains('User Creation').should('be.visible');
  });
});
