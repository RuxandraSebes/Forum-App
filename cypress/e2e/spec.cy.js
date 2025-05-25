describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[href="/users/login"] > button').click()
    cy.get('[placeholder="Nume utilizator"]').type("ruxi")
    cy.get('[placeholder="Parolă"]').type("ruxi")
    cy.get('button').click()
  })
})