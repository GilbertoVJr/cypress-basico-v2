Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function() {
    cy.get('#firstName').type('Gilberto')
    cy.get('#lastName').type('Vieira')
    cy.get('#email').type('gil@hotmail.com')
    cy.get('#open-text-area').type('teste')
    cy.contains('button', 'Enviar').click()
})