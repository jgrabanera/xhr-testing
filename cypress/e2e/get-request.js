/// <reference types="cypress" />
import xhr_HomePage_PO from '../support/pageObjects/xhr_Homepage_PO';

describe('Network Request', () => {
  const xhr_Homepage = new xhr_HomePage_PO();
  let message = 'Unable to find comment!';

  beforeEach(() => {
    xhr_Homepage.accessXHR();
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
    cy.intercept('POST', '**/comments').as('postComment');

    cy.get('.network-post').click();

    //cy.wait('@postComment').its('response.statusCode').should('eq', 201); //assertion status code

    cy.wait('@postComment').should(({ request, response }) => {
      expect(request.body).to.include('email');
      expect(response.body).to.have.property('email', 'hello@cypress.io');

      expect(request.headers).to.have.property('content-type');
      expect(response.headers).to.have.property('content-type', 'application/json; charset=utf-8');
    });
  });

  it.only('PUT Request', () => {
    cy.intercept(
      {
        method: 'PUT',
        url: '**/comments/*', //find all url that contains /comments/
      },
      {
        statusCode: 404,
        body: { error: message },
        delay: 500,
      }
    ).as('putComment');

    cy.get('.network-put').click();

    cy.wait('@putComment').its('response.statusCode').should('eq', 404); //assertion
    cy.get('.network-put-comment').should('contain', message);
  });
});
