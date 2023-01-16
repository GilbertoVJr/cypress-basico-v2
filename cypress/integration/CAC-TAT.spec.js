/// <reference types="Cypress" />

// Aula 1 e 2. Aprendendo cy.get(), cy.contains(), type(), clear() e .click()
describe('Central de Atendimento ao Cliente TAT', function () {
    const THREE_SECONDS_IN_MS = 3000
    beforeEach(function () {
        cy.visit('./src/index.html')
    })

    it('Verifica o título da aplicação', function () {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('Preencher os campos obrigatórios e enviar o formulário', function () {

        const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In finibus ultrices pretium. Integer pellentesque, ex vel finibus euismod, risus dolor placerat enim, sed varius velit massa sed tortor. Sed vestibulum, lectus eu rhoncus iaculis, ex mauris vehicula lacus, eleifend faucibus mauris nulla nec nulla. Mauris varius sollicitudin fermentum. Sed tincidunt odio eget vehicula suscipit.'

        cy.clock()

        cy.get('#firstName').type('Gilberto')
        cy.get('#lastName').type('Vieira')
        cy.get('#email').type('gil@hotmail.com')
        cy.get('#open-text-area').type(longText, { delay: 0 })
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.success').should('not.be.visible')
    })

    it('Exibir mensagem de erro ao submeter o formuário com um email com formatação inválida', function () {
        cy.clock()

        cy.get('#firstName').type('Gilberto')
        cy.get('#lastName').type('Vieira')
        cy.get('#email').type('gil,hotmail@com')
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.success').should('not.be.visible')
    })

    Cypress._.times(5, function () {
        it('Campo telefone continua vazio quando preenchido com valor não-numérico', function () {
            cy.get('#phone')
                .type('abcdefghij')
                .should('have.value', '')
        })
    })

    it('Exibir mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {
        cy.clock()

        cy.get('#firstName').type('Gilberto')
        cy.get('#lastName').type('Vieira')
        cy.get('#email').type('gil@hotmail.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')
    })

    it('Preencher e limpar os campos nome, sobrenome, email e telefone', function () {
        cy.get('#firstName')
            .type('Gilberto')
            .should('have.value', 'Gilberto')
            .clear()
            .should('have.value', '')
        cy.get('#lastName')
            .type('Vieira')
            .should('have.value', 'Vieira')
            .clear()
            .should('have.value', '')
        cy.get('#email')
            .type('gil@hotmail.com')
            .should('have.value', 'gil@hotmail.com')
            .clear()
            .should('have.value', '')
        cy.get('#phone')
            .type('123456789')
            .should('have.value', '123456789')
            .clear()
            .should('have.value', '')
    })

    it('Exibir mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {
        cy.clock()

        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')
    })

    it('Enviar o formulário com sucesso usando um comando customizado', function () {
        cy.clock()

        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.success').should('not.be.visible')
    })

    //Aula 3, aprendendo comando Select
    it('Selecionar um produto (YouTube) por seu texto', function () {
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')
    })

    it('Selecionar um produto (Mentoria) por seu valor (value)', function () {
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    })

    it('Selecionar um produto (Blog) por seu índice', function () {
        cy.get('#product')
            .select(1)
            .should('have.value', 'blog')
    })

    //Aula 4, aprendendo marcação input do tipo radio

    it('Marcar 0 tipo de atendimento "Feedback"', function () {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('have.value', 'feedback')
    })

    it('Marcar cada tipo de atendimento', function () {
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(function ($radio) {
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
    })

    //Aula 5, marcando e desmarcando inputs do tipo checkbox

    it("Marcar ambos checkboxes, depois desmarcar o ultimo", function () {
        cy.get('input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
    })

    //Aula 6, fazendo uploado de arquivos com Cypress

    it("Selecionar um arquivo da pasta fixtures", function () {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json')
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it("Selecionar um arquivo simulando um drag-and-drop", function () {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it("Selecionar um arquivo utilizando uma fixture para a qual foi dada um alias", function () {
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]')
            .selectFile('@sampleFile')
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    //Aula 7, como lidar com links de outras abas

    it("Verificar que a política de privacidade abre em outra aba sem a necessidade de um clique", function () {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it("Acessar a página da política de privacidade removendo o target e então clicar no link", function () {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')
            .click()

        cy.contains('Talking About Testing').should('be.visible')
    })

    //Aula 8, Simulando viewport de um dispositivo móvel
    //Alterar no package.json

    //Aula 11, utilizando o cy.clock e cy.tick; Utilizando o lodash para testar várias vezes seguidas; Utilizando invoke para mostrar e esconder elementos

    it("Exibir e esconder as mensagens de sucesso e erro usando o .invoke()", function () {
        cy.get('.success')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso.')
            .invoke('hide')
            .should('not.be.visible')
        cy.get('.error')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios!')
            .invoke('hide')
            .should('not.be.visible')
    })


})

