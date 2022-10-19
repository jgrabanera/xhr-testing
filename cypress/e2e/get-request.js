/// <reference types="cypress" />

describe('Network Request', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/commands/network-requests');
  });

  it('GET Request', () => {
    //wait till the button is clicked
    cy.intercept(
      {
        method: 'GET',
        url: '**/comments/*', //find all url that contains /comments/
      },
      {
        body: {
          postId: 1,
          id: 1,
          name: 'Grim Lacriox',
          email: 'grimLacriox@user.com',
          body: 'Lorem Ipsum',
        },
      }
    ).as('getComment');

    cy.get('.network-btn').click();

    cy.wait('@getComment').its('response.statusCode').should('eq', 200); //assertion
  });

  it('POST Request', () => {
    cy.intercept('POST', '/comments').as('postComment');

    cy.get('.network-post').click();

    cy.wait('@postComment').its('response.statusCode').should('eq', 201); //assertion
  });
});
