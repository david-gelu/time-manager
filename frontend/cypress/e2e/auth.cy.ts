describe('Authentication Pages', () => {
  describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/auth/login')
    })

    it('should display the login form', () => {
      cy.contains('Conectează-te').should('be.visible')
    })

    it('should have email and password fields', () => {
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="password"]').should('be.visible')
    })

    it('should have a submit button', () => {
      cy.get('button').contains('Connect').should('be.visible')
    })

    it('should have a Google sign-in button', () => {
      cy.contains('Connect with Google').should('be.visible')
    })

    it('should have a link to register', () => {
      cy.contains('Create one').should('be.visible')
    })

    it('should have a link back to home', () => {
      cy.contains('Back to home page').should('be.visible')
    })
  })

  describe('Register Page', () => {
    beforeEach(() => {
      cy.visit('/auth/register')
    })

    it('should display the register form', () => {
      cy.contains('Create a new account').should('be.visible')
    })

    it('should have email, password and confirm password fields', () => {
      cy.get('input[type="email"]').should('have.length', 1)
      cy.get('input[type="password"]').should('have.length', 2)
    })

    it('should have a Create account button', () => {
      cy.get('button').contains('Create account').should('be.visible')
    })

    it('should have a link to login', () => {
      cy.contains('Already have an account?').should('be.visible')
      cy.contains('Connect').should('be.visible')
    })
  })

  describe('Navigation', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('should navigate to login page via login button', () => {
      cy.contains('Login').click()
      cy.url().should('include', '/auth/login')
    })
  })
})