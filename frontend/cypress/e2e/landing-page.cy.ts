describe('Landing Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the main heading', () => {
    cy.contains('Welcome to Time Manager').should('be.visible')
  })

  it('should display all feature cards', () => {
    const features = ['Dashboard', 'Daily Tasks', 'Kanban Board', 'Calendar View', 'Global Time Zone Converter', 'Profile Management']
    features.forEach(feature => {
      cy.contains(feature).should('be.visible')
    })
  })

  it('should display key features section', () => {
    cy.contains('Key Features').should('be.visible')
  })

  it('should display Getting Started section', () => {
    cy.contains('Getting Started').should('be.visible')
  })

  it('should have working navigation links in sidebar', () => {
    // Sidebar should show public links
    cy.contains('Home').should('be.visible')
    cy.contains('Calendar').should('be.visible')
    cy.contains('Time Zones').should('be.visible')
  })

  it('should show login button when not authenticated', () => {
    cy.contains('Login').should('be.visible')
  })
})