describe('API Tests', () => {
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
  
    it('should return a valid JWT token on successful login', () => {
      cy.request('GET', 'https://qa-challenge-api.scratchpay.com/api/auth', {
        email: 'gianna@hightable.test',
        password: 'thedantonio1'
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('token');
      });
    });
  
    it('should be able to authenticate subsequent requests using the JWT token', () => {
      cy.request({
        method: 'GET',
        url: 'https://qa-challenge-api.scratchpay.com/api/user',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('email', 'gianna@hightable.test');
      });
    });
  });
  