describe('Website Connection Test', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('Should load the login', () => {
    cy.contains('Login').should('be.visible');
  });
});
