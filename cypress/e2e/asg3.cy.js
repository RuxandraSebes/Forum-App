describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/register')
    cy.get('[placeholder="Nume utilizator"]').type("Ruxandra Sebes")
    cy.get('[placeholder="Email"]').type("ruxandra.sebes@example.com")
    cy.get('[placeholder="Parolă"]').type("ruxi123")
    cy.get('button').click()
    cy.visit('http://localhost:3000/login')
    cy.get('[placeholder="Email"]').type('ruxandra.sebes@example.com')
    cy.get('[placeholder="Parolă"]').type("ruxi123")
    cy.get('button').click()
    cy.get(':nth-child(2) > input').type("Întrebare de test")
    cy.get(':nth-child(3) > textarea').type("Conținutul întrebării de test")
    cy.get(':nth-child(4) > input').type("test, întrebări")
    cy.get('[style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: rgb(249, 249, 249); border-radius: 8px; box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 10px;"] > button')
  }).click
})