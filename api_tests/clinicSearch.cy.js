describe('Clinic search', () => {
    beforeEach(() => {
      cy.visit('https://qa-challenge.scratchpay.com/')
    })
  
    it('should allow non-logged in users to search for clinics with "veterinary" in their name', () => {
      const searchTerm = 'veterinary'
  
      cy.request('GET', `https://qa-challenge-api.scratchpay.com/api/clinics?term=${searchTerm}`)
        .then(response => {
          expect(response.status).to.eq(200)
          expect(response.body.clinics).to.have.length.greaterThan(0)
          expect(response.body.clinics[0].name.toLowerCase()).to.include(searchTerm)
        })
    })
  
    it('should allow logged in users to search for clinics with "veterinary" in their name', () => {
      const email = 'gianna@hightable.test'
      const password = 'thedantonio1'
      const searchTerm = 'veterinary'
  
      // Login
      cy.get('[data-cy=header-login-button]').click()
      cy.get('[data-cy=login-email]').type(email)
      cy.get('[data-cy=login-password]').type(password)
      cy.get('[data-cy=login-submit]').click()
  
      // Search clinics
      cy.request({
        method: 'GET',
        url: `https://qa-challenge-api.scratchpay.com/api/clinics?term=${searchTerm}`,
        headers: {
          Authorization: `Bearer ${Cypress.env('TOKEN')}`
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.clinics).to.have.length.greaterThan(0)
        expect(response.body.clinics[0].name.toLowerCase()).to.include(searchTerm)
      })
    })
  
    it('should prevent non-logged in users from searching for clinics with "veterinary" in their name', () => {
      const searchTerm = 'veterinary'
  
      // Logout if already logged in
      if (Cypress.env('TOKEN')) {
        cy.request({
          method: 'POST',
          url: 'https://qa-challenge-api.scratchpay.com/api/auth/logout',
          headers: {
            Authorization: `Bearer ${Cypress.env('TOKEN')}`
          }
        })
      }
  
      // Search clinics
      cy.request({
        method: 'GET',
        url: `https://qa-challenge-api.scratchpay.com/api/clinics?term=${searchTerm}`,
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.eq(401)
        expect(response.body.message).to.eq('You need to be authorized for this action.')
      })
    })
  })
  