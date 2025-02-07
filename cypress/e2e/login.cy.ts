describe('Website Connection Test', () => {
  const testUser = {
    email: 'usertest@ynov.com',
    password : '123456Ynov!'
  }
  beforeEach(() => {
    cy.visit('/login');
    cy.intercept('POST', `${Cypress.env('apiUrl')}/auth/login`, {
      statusCode: 200,
      body: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjM0NTY3ODkwLCJ1c2VybmFtZSI6IkpvaG4gRG9lIn0.WdE6-F7d1jf_Slt8hMLuhg8Hhj9HGg44bQzmp8d_jRg'
      }
    }).as('registerUser');

    cy.intercept('GET', `${Cypress.env('apiUrl')}/users`, {
      "status": "success",
      "data": [
        {
          "_id": "678a38e4f4ca57177feb7c53",
          "password": "$2a$10$jWD1ZILs/rxp25DzteBOsO1vZr92K4e0l7UBWnw2n39X0GGcfHRXO",
          "email": "loise.fenoll@ynov.com",
          "role": "admin",
          "firstName": "Loise",
          "lastName": "Fenoll",
          "birthDate": "1992-03-05",
          "city": "Montpellier",
          "zipCode": "34000"
        },
        {
          "_id": "67a38a1503db4a230795dc31",
          "password": "$2a$10$rNbUU2vqah2wdel8x/TQB.OGQK8qCOdz.M2ENtPkNq2oX9HcFsYUS",
          "email": "jose.dupont@example.com",
          "role": "user",
          "firstName": "José",
          "lastName": "Dupont",
          "birthDate": "1999-01-01",
          "city": "Paris",
          "zipCode": "75000"
        }
      ]
    }).as('getUsers');
  });

  it('Should Login', () => {
    cy.location('pathname').should('eq', '/login');
    const email = cy.get('[data-cy="email"]');
    const password = cy.get('[data-cy="password"]');
    const submit = cy.get('[data-cy="submit"]');

    submit.should('be.disabled');

    email.type(testUser.email);
    password.type(testUser.password);

    submit.should('be.enabled');

    cy.get('[data-cy="submit"]').click();

    cy.location('pathname').should('eq', '/');
  });

  it('Should Logout', () => {
    cy.location('pathname').should('eq', '/login');
    const email = cy.get('[data-cy="email"]');
    const password = cy.get('[data-cy="password"]');

    email.type(testUser.email);
    password.type(testUser.password);
    cy.get('[data-cy="submit"]').click();
    cy.location('pathname').should('eq', '/');

    cy.get('[data-cy="logout"]').click();
    cy.location('pathname').should('eq', '/login');
  });
});
