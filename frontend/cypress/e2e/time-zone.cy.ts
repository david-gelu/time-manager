describe('Time Zone Converter Page', () => {
  beforeEach(() => {
    cy.visit('/time-zones')
  })

  it('should display the main title', () => {
    cy.contains('Time Zone Converter').should('be.visible')
  })

  it('should display the Romania time converter card', () => {
    cy.contains('Time in Romania for the selected timezone').should('be.visible')
  })

  it('should display the date and time in other time zones section', () => {
    cy.contains('Date and Time in Other Time Zones').should('be.visible')
  })

  it('should show default selected time zones', () => {
    // Default zones: Europe/London and Asia/Tokyo
    cy.contains('Europe/London').should('be.visible')
    cy.contains('Asia/Tokyo').should('be.visible')
  })

  it('should show the search time zone button', () => {
    cy.contains('Search time zone...').should('be.visible')
  })

  it('should have a country selector for source timezone', () => {
    cy.contains('Select a country').should('be.visible')
  })

  it('should show time input fields', () => {
    cy.get('input[placeholder="HH"]').should('be.visible')
    cy.get('input[placeholder="MM"]').should('be.visible')
  })

  it('should display UTC offset for time zones', () => {
    cy.contains('UTC').should('exist')
  })
})