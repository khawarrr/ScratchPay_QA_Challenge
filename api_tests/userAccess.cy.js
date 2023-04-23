describe('logged-in user is prevented from getting a list of email addresses of practice id 2', () => {
    let token;
  
    before(() => {
      cy.request('POST', 'https://qa-challenge-api.scratchpay.com/api/auth', {
        email: 'gianna@hightable.test',
        password: 'thedantonio1'
      }).then((response) => {
        expect(response.status).to.eq(200);
        token = response.body.token;
      });
    });
  
    it('should prevent a logged-in user from getting the list of email addresses for practice id 2', () => {
      cy.request({
        method: 'GET',
        url: 'https://qa-challenge-api.scratchpay.com/api/clinics/2/emails',
        headers: {
          Authorization: `Bearer ${token}`
        },
        failOnStatusCode: false // Prevent Cypress from failing the test due to a non-200 status code
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('error', 'Error: User does not have permissions');
      });
    });
  });
  