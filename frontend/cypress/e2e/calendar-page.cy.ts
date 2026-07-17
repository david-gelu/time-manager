describe('Calendar Page', () => {
  beforeEach(() => {
    cy.visit('/calendar')
  })

  it('should display the calendar page with correct title', () => {
    cy.contains('Calendar per week').should('be.visible')
  })

  it('should show month navigation buttons', () => {
    // Should have previous month, today, and next month buttons
    cy.get('button').should('have.length.at.least', 3)
  })

  it('should display the month and year', () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
    const now = new Date()
    const currentMonth = months[now.getMonth()]
    cy.contains(currentMonth).should('be.visible')
    cy.contains(now.getFullYear().toString()).should('be.visible')
  })

  it('should display week headers', () => {
    cy.contains('Week').should('be.visible')
    cy.contains('Mon').should('be.visible')
    cy.contains('Tue').should('be.visible')
    cy.contains('Wed').should('be.visible')
    cy.contains('Thu').should('be.visible')
    cy.contains('Fri').should('be.visible')
    cy.contains('Sat').should('be.visible')
    cy.contains('Sun').should('be.visible')
  })

  it('should display the search/date description', () => {
    cy.contains('Search for a date to see what week of the year it is').should('be.visible')
  })
})